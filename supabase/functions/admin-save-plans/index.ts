import { corsHeaders, json } from "../_shared/http.ts";
import { adminClient, requireAdmin, stripeClient } from "../_shared/services.ts";

type EditablePlan = {
  id: string;
  name: string;
  description: string;
  price_rm: number;
  popular: boolean;
  features: string[];
};
type EditableAddon = { id: string; name: string; description: string; price_rm: number; active: boolean };

const allowedPlanIds = ["starter", "active", "professional", "executive"];
const allowedAddonIds = ["extra-shirts", "extra-bag", "fragrance-free", "priority-return"];

function validatePlans(input: unknown): EditablePlan[] {
  if (!Array.isArray(input) || input.length !== allowedPlanIds.length) throw new Error("INVALID_PLANS");
  const plans = input.map((value) => value as EditablePlan);
  if (plans.some((plan) =>
    !allowedPlanIds.includes(plan.id) ||
    typeof plan.name !== "string" || plan.name.trim().length < 2 || plan.name.length > 80 ||
    typeof plan.description !== "string" || plan.description.trim().length < 5 || plan.description.length > 240 ||
    !Number.isInteger(plan.price_rm) || plan.price_rm < 1 || plan.price_rm > 5000 ||
    typeof plan.popular !== "boolean" ||
    !Array.isArray(plan.features) || plan.features.length < 1 || plan.features.length > 8 ||
    plan.features.some((feature) => typeof feature !== "string" || feature.trim().length < 2 || feature.length > 120)
  )) throw new Error("INVALID_PLANS");
  if (new Set(plans.map((plan) => plan.id)).size !== allowedPlanIds.length) throw new Error("INVALID_PLANS");
  return plans;
}

function validateAddons(input: unknown): EditableAddon[] {
  if (!Array.isArray(input) || input.length !== allowedAddonIds.length) throw new Error("INVALID_ADDONS");
  const addons = input.map((value) => value as EditableAddon);
  if (addons.some((addon) => !allowedAddonIds.includes(addon.id) || typeof addon.name !== "string" || addon.name.trim().length < 2 || addon.name.length > 80 || typeof addon.description !== "string" || addon.description.trim().length < 5 || addon.description.length > 240 || !Number.isInteger(addon.price_rm) || addon.price_rm < 1 || addon.price_rm > 5000 || typeof addon.active !== "boolean")) throw new Error("INVALID_ADDONS");
  if (new Set(addons.map((addon) => addon.id)).size !== allowedAddonIds.length) throw new Error("INVALID_ADDONS");
  return addons;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  try {
    await requireAdmin(request);
    const supabase = adminClient();

    const body = await request.json();
    const plans = validatePlans(body?.plans);
    const addons = validateAddons(body?.addons);
    const stripe = stripeClient();
    const products = await stripe.products.list({ active: true, limit: 100 });
    const saved = [];

    for (const [index, plan] of plans.entries()) {
      let product = products.data.find((candidate) => candidate.metadata.washd_plan_id === plan.id);
      if (!product) {
        product = await stripe.products.create({
          name: `Washd ${plan.name.trim()}`,
          description: plan.description.trim(),
          metadata: { washd_plan_id: plan.id },
        });
      } else {
        product = await stripe.products.update(product.id, {
          name: `Washd ${plan.name.trim()}`,
          description: plan.description.trim(),
        });
      }

      const prices = await stripe.prices.list({ product: product.id, active: true, type: "recurring", limit: 100 });
      let price = prices.data.find((candidate) =>
        candidate.currency === "myr" &&
        candidate.unit_amount === plan.price_rm * 100 &&
        candidate.recurring?.interval === "month"
      );
      if (!price) {
        price = await stripe.prices.create({
          product: product.id,
          currency: "myr",
          unit_amount: plan.price_rm * 100,
          recurring: { interval: "month" },
          metadata: { washd_plan_id: plan.id },
        });
      }

      saved.push({
        id: plan.id,
        name: plan.name.trim(),
        description: plan.description.trim(),
        price_rm: plan.price_rm,
        popular: plan.popular,
        features: plan.features.map((feature) => feature.trim()),
        stripe_price_id: price.id,
        active: true,
        sort_order: index + 1,
        updated_at: new Date().toISOString(),
      });
    }

    const { error } = await supabase.from("plans").upsert(saved, { onConflict: "id" });
    if (error) throw error;

    const savedAddons = [];
    for (const [index, addon] of addons.entries()) {
      let product = products.data.find((candidate) => candidate.metadata.washd_addon_id === addon.id);
      if (!product) {
        product = await stripe.products.create({ name: `Washd add-on: ${addon.name.trim()}`, description: addon.description.trim(), metadata: { washd_addon_id: addon.id } });
      } else {
        product = await stripe.products.update(product.id, { name: `Washd add-on: ${addon.name.trim()}`, description: addon.description.trim(), active: addon.active });
      }
      const prices = await stripe.prices.list({ product: product.id, active: true, type: "recurring", limit: 100 });
      let price = prices.data.find((candidate) => candidate.currency === "myr" && candidate.unit_amount === addon.price_rm * 100 && candidate.recurring?.interval === "month");
      if (!price) price = await stripe.prices.create({ product: product.id, currency: "myr", unit_amount: addon.price_rm * 100, recurring: { interval: "month" }, metadata: { washd_addon_id: addon.id } });
      savedAddons.push({ id: addon.id, name: addon.name.trim(), description: addon.description.trim(), price_rm: addon.price_rm, stripe_price_id: price.id, active: addon.active, sort_order: index + 1, updated_at: new Date().toISOString() });
    }
    const { error: addonError } = await supabase.from("plan_addons").upsert(savedAddons, { onConflict: "id" });
    if (addonError) throw addonError;
    return json(request, { plans: saved, addons: savedAddons });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "UNAUTHORIZED") return json(request, { error: "Please log in" }, 401);
    if (message === "ADMIN_REQUIRED") return json(request, { error: "Admin access required" }, 403);
    if (message === "MFA_REQUIRED") return json(request, { error: "Authenticator verification required" }, 403);
    if (message === "INVALID_PLANS") return json(request, { error: "Plan details are invalid" }, 400);
    if (message === "INVALID_ADDONS") return json(request, { error: "Add-on details are invalid" }, 400);
    console.error("admin-save-plans", message);
    return json(request, { error: "Unable to save plans" }, 500);
  }
});
