import { corsHeaders, json } from "../_shared/http.ts";
import { adminClient, requireAdmin, stripeClient } from "../_shared/services.ts";

const requiredWebhookEvents = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
] as const;

type PriceRow = {
  id: string;
  name: string;
  stripe_price_id: string | null;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  try {
    await requireAdmin(request);

    const secret = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const mode = secret.startsWith("sk_live_") ? "live" : secret.startsWith("sk_test_") ? "test" : "unknown";
    const liveMode = mode === "live";
    const stripe = stripeClient();
    const supabase = adminClient();

    const [account, plansResult, addonsResult, siteContentResult, endpoints, portalConfigurations] = await Promise.all([
      stripe.accounts.retrieve(),
      supabase.from("plans").select("id, name, stripe_price_id").eq("active", true).order("sort_order"),
      supabase.from("plan_addons").select("id, name, stripe_price_id").eq("active", true).order("sort_order"),
      supabase.from("site_content").select("content").eq("key", "main").maybeSingle(),
      stripe.webhookEndpoints.list({ limit: 100 }),
      stripe.billingPortal.configurations.list({ active: true, limit: 100 }),
    ]);

    if (plansResult.error) throw plansResult.error;
    if (addonsResult.error) throw addonsResult.error;

    const contact = siteContentResult.data?.content?.contact as Record<string, unknown> | undefined;
    const legalDisclosureReady = !siteContentResult.error && [contact?.legalName, contact?.registrationNumber, contact?.registeredAddress]
      .every((value) => typeof value === "string" && value.trim().length > 0);

    const priceRows = [
      ...((plansResult.data || []) as PriceRow[]).map((row) => ({ ...row, kind: "plan" })),
      ...((addonsResult.data || []) as PriceRow[]).map((row) => ({ ...row, kind: "add-on" })),
    ];
    const priceIssues: string[] = [];

    await Promise.all(priceRows.map(async (row) => {
      if (!row.stripe_price_id?.startsWith("price_")) {
        priceIssues.push(`${row.kind} “${row.name}” has no Stripe price`);
        return;
      }
      try {
        const price = await stripe.prices.retrieve(row.stripe_price_id);
        if (!price.active) priceIssues.push(`${row.kind} “${row.name}” uses an inactive price`);
        if (price.livemode !== liveMode) priceIssues.push(`${row.kind} “${row.name}” belongs to the wrong Stripe mode`);
        if (price.currency !== "myr") priceIssues.push(`${row.kind} “${row.name}” is not priced in MYR`);
        if (price.type !== "recurring" || price.recurring?.interval !== "month") {
          priceIssues.push(`${row.kind} “${row.name}” is not a monthly recurring price`);
        }
      } catch {
        priceIssues.push(`${row.kind} “${row.name}” cannot be found in ${mode} mode`);
      }
    }));

    const webhookUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/stripe-webhook`;
    const webhook = endpoints.data.find((endpoint) => endpoint.url === webhookUrl && endpoint.status === "enabled");
    const enabledEvents = new Set(webhook?.enabled_events || []);
    const webhookEventsReady = enabledEvents.has("*") || requiredWebhookEvents.every((event) => enabledEvents.has(event));
    const webhookReady = Boolean(webhook && webhookEventsReady);

    const configuredPortalId = Deno.env.get("STRIPE_PORTAL_CONFIGURATION_ID");
    const portalReady = Boolean(portalConfigurations.data.find((portal) =>
      portal.id === configuredPortalId &&
      portal.active &&
      portal.features.payment_method_update.enabled &&
      portal.features.subscription_cancel.enabled
    ));

    const accountReady = Boolean(account.details_submitted && account.charges_enabled && account.payouts_enabled);
    const issues = [...priceIssues];
    if (mode !== "live") issues.unshift("Stripe is not using a live secret key");
    if (!account.details_submitted) issues.push("Stripe business details are not fully submitted");
    if (!account.charges_enabled) issues.push("Stripe charges are not enabled");
    if (!account.payouts_enabled) issues.push("Stripe payouts are not enabled");
    if (!webhookReady) issues.push("The signed Washd webhook is missing or incomplete");
    if (!portalReady) issues.push("The configured customer portal is missing or incomplete");
    if (!legalDisclosureReady) issues.push("Registered supplier name, SSM number or business address is missing");

    const pricesReady = priceRows.length > 0 && priceIssues.length === 0;
    const readyForLive = mode === "live" && accountReady && pricesReady && webhookReady && portalReady && legalDisclosureReady;

    return json(request, {
      mode,
      readyForLive,
      account: {
        detailsSubmitted: Boolean(account.details_submitted),
        chargesEnabled: Boolean(account.charges_enabled),
        payoutsEnabled: Boolean(account.payouts_enabled),
        country: account.country || null,
        defaultCurrency: account.default_currency || null,
      },
      checks: {
        pricesReady,
        configuredPrices: priceRows.length,
        webhookReady,
        portalReady,
        legalDisclosureReady,
      },
      issues,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Readiness check failed";
    if (message === "UNAUTHORIZED") return json(request, { error: "Please log in first" }, 401);
    if (message === "ADMIN_REQUIRED") return json(request, { error: "Admin access required" }, 403);
    if (message === "MFA_REQUIRED") return json(request, { error: "MFA verification required" }, 403);
    console.error("admin-payment-readiness", message);
    return json(request, { error: "Payment readiness could not be checked" }, 500);
  }
});
