import { json } from "../_shared/http.ts";
import { adminClient, stripeClient } from "../_shared/services.ts";

const planDefinitions = [
  { id: "starter", name: "Starter", description: "5kg wash-fold bag once a week", priceRM: 109, popular: false, features: ["5kg wash-fold bag", "Once a week", "Fixed building collection"] },
  { id: "active", name: "Active", description: "5kg wash-fold bag twice a week", priceRM: 199, popular: false, features: ["5kg wash-fold bag", "Twice a week", "Fixed building collection"] },
  { id: "professional", name: "Professional", description: "7kg bag + 4 pressed shirts, once a week", priceRM: 259, popular: true, features: ["7kg wash-fold bag", "4 pressed shirts", "Once a week"] },
  { id: "executive", name: "Executive", description: "7kg bag + 7 pressed shirts, once a week", priceRM: 299, popular: false, features: ["7kg wash-fold bag", "7 pressed shirts", "Once a week"] },
];

const addonDefinitions = [
  { id: "extra-shirts", name: "4 extra pressed shirts", description: "Four additional shirts washed, pressed and returned on hangers each month.", priceRM: 30 },
  { id: "extra-bag", name: "One extra 5kg bag", description: "Add one extra wash, dry and fold bag to your monthly allowance.", priceRM: 18 },
  { id: "fragrance-free", name: "Fragrance-free care", description: "A fragrance-free detergent preference for every bag in your membership.", priceRM: 12 },
  { id: "priority-return", name: "Priority 24-hour return", description: "Move one collection each month to our priority 24-hour return service.", priceRM: 35 },
];

Deno.serve(async (request) => {
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);
  const expectedToken = Deno.env.get("WASHD_SETUP_TOKEN");
  if (!expectedToken || request.headers.get("x-washd-setup-token") !== expectedToken) {
    return json(request, { error: "Unauthorized" }, 401);
  }

  try {
    const secretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const liveMode = secretKey.startsWith("sk_live_");
    const testMode = secretKey.startsWith("sk_test_");
    if (!testMode && !(liveMode && Deno.env.get("ALLOW_LIVE_STRIPE") === "true")) {
      return json(request, { error: "A Stripe test key is required unless live setup is explicitly enabled" }, 412);
    }

    const stripe = stripeClient();
    const supabase = adminClient();
    const products = await stripe.products.list({ active: true, limit: 100 });
    const plans = [];

    for (const definition of planDefinitions) {
      let product = products.data.find((candidate) => candidate.metadata.washd_plan_id === definition.id);
      if (!product) {
        product = await stripe.products.create({
          name: `Washd ${definition.name}`,
          description: definition.description,
          metadata: { washd_plan_id: definition.id },
        });
      }

      const prices = await stripe.prices.list({ product: product.id, active: true, type: "recurring", limit: 100 });
      let price = prices.data.find((candidate) =>
        candidate.currency === "myr" &&
        candidate.unit_amount === definition.priceRM * 100 &&
        candidate.recurring?.interval === "month"
      );
      if (!price) {
        price = await stripe.prices.create({
          product: product.id,
          currency: "myr",
          unit_amount: definition.priceRM * 100,
          recurring: { interval: "month" },
          metadata: { washd_plan_id: definition.id },
        });
      }

      plans.push({
        id: definition.id,
        name: definition.name,
        description: definition.description,
        price_rm: definition.priceRM,
        popular: definition.popular,
        features: definition.features,
        stripe_price_id: price.id,
        active: true,
        sort_order: planDefinitions.findIndex((candidate) => candidate.id === definition.id) + 1,
        updated_at: new Date().toISOString(),
      });
    }

    const { error: planError } = await supabase.from("plans").upsert(plans, { onConflict: "id" });
    if (planError) throw planError;

    const addons = [];
    for (const [index, definition] of addonDefinitions.entries()) {
      let product = products.data.find((candidate) => candidate.metadata.washd_addon_id === definition.id);
      if (!product) product = await stripe.products.create({ name: `Washd add-on: ${definition.name}`, description: definition.description, metadata: { washd_addon_id: definition.id } });
      const prices = await stripe.prices.list({ product: product.id, active: true, type: "recurring", limit: 100 });
      let price = prices.data.find((candidate) => candidate.currency === "myr" && candidate.unit_amount === definition.priceRM * 100 && candidate.recurring?.interval === "month");
      if (!price) price = await stripe.prices.create({ product: product.id, currency: "myr", unit_amount: definition.priceRM * 100, recurring: { interval: "month" }, metadata: { washd_addon_id: definition.id } });
      addons.push({ id: definition.id, name: definition.name, description: definition.description, price_rm: definition.priceRM, stripe_price_id: price.id, active: true, sort_order: index + 1, updated_at: new Date().toISOString() });
    }
    const { error: addonError } = await supabase.from("plan_addons").upsert(addons, { onConflict: "id" });
    if (addonError) throw addonError;

    const appBaseUrl = (Deno.env.get("APP_BASE_URL") || "https://washd-my-86c6d.web.app").replace(/\/$/, "");
    const portalConfigurations = await stripe.billingPortal.configurations.list({ active: true, limit: 100 });
    let portal = portalConfigurations.data.find((configuration) => configuration.metadata?.washd_app === "true");
    if (!portal) {
      portal = await stripe.billingPortal.configurations.create({
        business_profile: { headline: "Manage your Washd laundry membership" },
        default_return_url: `${appBaseUrl}/account`,
        features: {
          customer_update: { enabled: true, allowed_updates: ["email"] },
          invoice_history: { enabled: true },
          payment_method_update: { enabled: true },
          subscription_cancel: { enabled: true, mode: "at_period_end", proration_behavior: "none" },
        },
        metadata: { washd_app: "true" },
      });
    }

    const webhookUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/stripe-webhook`;
    const enabledEvents = [
      "checkout.session.completed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "invoice.payment_succeeded",
      "invoice.payment_failed",
    ] as const;
    const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
    const existing = endpoints.data.find((candidate) => candidate.url === webhookUrl && candidate.status !== "disabled");
    if (existing) {
      return json(request, {
        error: "A Washd webhook already exists and its signing secret cannot be recovered automatically",
        portalConfigurationId: portal.id,
      }, 409);
    }

    const endpoint = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: [...enabledEvents],
      description: "Washd Supabase subscription sync",
      metadata: { washd_project_ref: "egrhyqdrqdaupvxiyurf" },
    });

    return json(request, {
      webhookSecret: endpoint.secret,
      portalConfigurationId: portal.id,
      configuredPlans: plans.length,
      configuredAddons: addons.length,
      mode: liveMode ? "live" : "test",
    });
  } catch (error) {
    const detail = error instanceof Error
      ? error.message.replace(/(?:sk|rk)_(?:test|live)_[A-Za-z0-9_]+/g, "[redacted key]")
      : "Unknown setup error";
    console.error("configure-stripe", detail);
    return json(request, { error: "Stripe setup failed", detail }, 500);
  }
});
