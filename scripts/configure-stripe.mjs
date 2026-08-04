import { writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const stripeSecretKey = required("STRIPE_SECRET_KEY");
if (!stripeSecretKey.startsWith("sk_test_") && process.env.ALLOW_LIVE_STRIPE !== "true") {
  throw new Error("Only a Stripe test key is accepted unless ALLOW_LIVE_STRIPE=true is explicitly set");
}

const supabaseUrl = required("SUPABASE_URL").replace(/\/$/, "");
const serviceRoleKey = required("SUPABASE_SERVICE_ROLE_KEY");
const appBaseUrl = (process.env.APP_BASE_URL || "https://washd-my-86c6d.web.app").replace(/\/$/, "");
const outputPath = required("WASHD_SETUP_OUTPUT");
const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
const webhookUrl = `${supabaseUrl}/functions/v1/stripe-webhook`;

const plans = [
  { id: "starter", name: "Starter", description: "5kg wash-fold bag once a week", priceRM: 109, popular: false, features: ["5kg wash-fold bag", "Once a week", "Fixed building collection"] },
  { id: "active", name: "Active", description: "5kg wash-fold bag twice a week", priceRM: 199, popular: false, features: ["5kg wash-fold bag", "Twice a week", "Fixed building collection"] },
  { id: "professional", name: "Professional", description: "7kg bag + 4 pressed shirts, once a week", priceRM: 259, popular: true, features: ["7kg wash-fold bag", "4 pressed shirts", "Once a week"] },
  { id: "executive", name: "Executive", description: "7kg bag + 7 pressed shirts, once a week", priceRM: 299, popular: false, features: ["7kg wash-fold bag", "7 pressed shirts", "Once a week"] },
];

const addons = [
  { id: "extra-shirts", name: "4 extra pressed shirts", description: "Four additional shirts washed, pressed and returned on hangers each month.", priceRM: 30 },
  { id: "extra-bag", name: "One extra 5kg bag", description: "Add one extra wash, dry and fold bag to your monthly allowance.", priceRM: 18 },
  { id: "fragrance-free", name: "Fragrance-free care", description: "A fragrance-free detergent preference for every bag in your membership.", priceRM: 12 },
  { id: "priority-return", name: "Priority 24-hour return", description: "Move one collection each month to our priority 24-hour return service.", priceRM: 35 },
];

const stripe = new Stripe(stripeSecretKey);
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const products = await stripe.products.list({ active: true, limit: 100 });
const configuredPlans = [];

for (const plan of plans) {
  let product = products.data.find((candidate) => candidate.metadata.washd_plan_id === plan.id);
  if (!product) {
    product = await stripe.products.create({
      name: `Washd ${plan.name}`,
      description: plan.description,
      metadata: { washd_plan_id: plan.id },
    });
  }

  const prices = await stripe.prices.list({ product: product.id, active: true, type: "recurring", limit: 100 });
  let price = prices.data.find((candidate) =>
    candidate.currency === "myr" &&
    candidate.unit_amount === plan.priceRM * 100 &&
    candidate.recurring?.interval === "month",
  );
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      currency: "myr",
      unit_amount: plan.priceRM * 100,
      recurring: { interval: "month" },
      metadata: { washd_plan_id: plan.id },
    });
  }

  configuredPlans.push({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price_rm: plan.priceRM,
    popular: plan.popular,
    features: plan.features,
    stripe_price_id: price.id,
    active: true,
    sort_order: plans.findIndex((candidate) => candidate.id === plan.id) + 1,
    updated_at: new Date().toISOString(),
  });
}

const configuredAddons = [];
for (const [index, addon] of addons.entries()) {
  let product = products.data.find((candidate) => candidate.metadata.washd_addon_id === addon.id);
  if (!product) {
    product = await stripe.products.create({
      name: `Washd add-on: ${addon.name}`,
      description: addon.description,
      metadata: { washd_addon_id: addon.id },
    });
  }
  const prices = await stripe.prices.list({ product: product.id, active: true, type: "recurring", limit: 100 });
  let price = prices.data.find((candidate) => candidate.currency === "myr" && candidate.unit_amount === addon.priceRM * 100 && candidate.recurring?.interval === "month");
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      currency: "myr",
      unit_amount: addon.priceRM * 100,
      recurring: { interval: "month" },
      metadata: { washd_addon_id: addon.id },
    });
  }
  configuredAddons.push({
    id: addon.id,
    name: addon.name,
    description: addon.description,
    price_rm: addon.priceRM,
    stripe_price_id: price.id,
    active: true,
    sort_order: index + 1,
    updated_at: new Date().toISOString(),
  });
}

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

const enabledEvents = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
];
const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
let endpoint = endpoints.data.find((candidate) => candidate.url === webhookUrl && candidate.status !== "disabled");
let webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || null;
if (endpoint) {
  endpoint = await stripe.webhookEndpoints.update(endpoint.id, {
    enabled_events: enabledEvents,
    description: "Washd Supabase subscription sync",
    metadata: { washd_project_ref: projectRef },
  });
} else {
  const created = await stripe.webhookEndpoints.create({
    url: webhookUrl,
    enabled_events: enabledEvents,
    description: "Washd Supabase subscription sync",
    metadata: { washd_project_ref: projectRef },
  });
  endpoint = created;
  webhookSecret = created.secret;
}

if (!webhookSecret) {
  throw new Error("The existing webhook secret cannot be recovered. Supply STRIPE_WEBHOOK_SECRET or create a fresh endpoint");
}

await writeFile(outputPath, JSON.stringify({
  mode: stripeSecretKey.startsWith("sk_live_") ? "live" : "test",
  stripeWebhookSecret: webhookSecret,
  stripePortalConfigurationId: portal.id,
  webhookEndpointId: endpoint.id,
  plans: Object.fromEntries(configuredPlans.map((plan) => [plan.id, plan.stripe_price_id])),
  addons: Object.fromEntries(configuredAddons.map((addon) => [addon.id, addon.stripe_price_id])),
}, null, 2), { mode: 0o600 });

const { error: planError } = await supabase.from("plans").upsert(configuredPlans, { onConflict: "id" });
if (planError) throw planError;

const { error: addonError } = await supabase.from("plan_addons").upsert(configuredAddons, { onConflict: "id" });
if (addonError) throw addonError;

console.log(`Configured four Stripe ${stripeSecretKey.startsWith("sk_live_") ? "live" : "test"} subscriptions, four add-ons, the billing portal, and the signed Washd webhook.`);
