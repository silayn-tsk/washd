import { corsHeaders, json, safeReturnUrl } from "../_shared/http.ts";
import { adminClient, requireUser, stripeClient } from "../_shared/services.ts";

function isMissingStripeResource(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "resource_missing");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  try {
    const user = await requireUser(request);
    const body = await request.json();
    const planId = String(body?.planId || "");
    if (body?.termsAccepted !== true) return json(request, { error: "Service terms must be accepted" }, 400);
    const addonIds = Array.isArray(body?.addonIds) ? [...new Set(body.addonIds.map((value: unknown) => String(value)))].slice(0, 8) : [];
    const supabase = adminClient();
    const liveMode = (Deno.env.get("STRIPE_SECRET_KEY") || "").startsWith("sk_live_");
    if (liveMode) {
      const { data: siteContent, error: siteContentError } = await supabase.from("site_content").select("content").eq("key", "main").maybeSingle();
      const contact = siteContent?.content?.contact as Record<string, unknown> | undefined;
      const legalDisclosureReady = !siteContentError && [contact?.legalName, contact?.registrationNumber, contact?.registeredAddress]
        .every((value) => typeof value === "string" && value.trim().length > 0);
      if (!legalDisclosureReady) return json(request, { error: "Live checkout is not yet available" }, 503);
    }
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id, name, stripe_price_id")
      .eq("id", planId)
      .eq("active", true)
      .single();

    if (planError || !plan) return json(request, { error: "Unknown subscription plan" }, 400);
    if (!plan.stripe_price_id?.startsWith("price_")) {
      return json(request, { error: `Stripe price is not configured for ${plan.name}` }, 412);
    }

    let addons: Array<{ id: string; stripe_price_id: string }> = [];
    if (addonIds.length) {
      const { data: addonRows, error: addonError } = await supabase.from("plan_addons").select("id, stripe_price_id").in("id", addonIds).eq("active", true);
      if (addonError || !addonRows || addonRows.length !== addonIds.length || addonRows.some((addon) => !addon.stripe_price_id?.startsWith("price_"))) {
        return json(request, { error: "One or more add-ons are unavailable" }, 400);
      }
      addons = addonRows as Array<{ id: string; stripe_price_id: string }>;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, stripe_customer_id, stripe_subscription_id, subscription_status")
      .eq("id", user.id)
      .maybeSingle();

    const managedStatuses = new Set(["active", "trialing", "past_due", "unpaid", "paused"]);
    if (profile?.stripe_subscription_id && managedStatuses.has(profile.subscription_status || "")) {
      return json(request, { error: "You already have a subscription. Manage it from your Washd account.", code: "ACTIVE_SUBSCRIPTION" }, 409);
    }

    const stripe = stripeClient();
    let customerId = profile?.stripe_customer_id || null;
    if (customerId) {
      try {
        const existingCustomer = await stripe.customers.retrieve(customerId);
        if (existingCustomer.deleted) customerId = null;
      } catch (error) {
        if (isMissingStripeResource(error)) customerId = null;
        else throw error;
      }
    }
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.name || user.user_metadata?.name,
        metadata: { supabaseUserId: user.id },
      }, { idempotencyKey: `washd-customer-${user.id}` });
      customerId = customer.id;
      const { error: customerUpdateError } = await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
      if (customerUpdateError) throw customerUpdateError;
    }

    const checkoutMinute = Math.floor(Date.now() / 60000);
    const selectionKey = [planId, ...addonIds.sort()].join("-").replace(/[^a-z0-9-]/gi, "").slice(0, 120);
    const termsAcceptedAt = new Date().toISOString();
    const checkoutMetadata = { supabaseUserId: user.id, planId, addonIds: addonIds.join(","), termsVersion: "2026-08-04", termsAcceptedAt };
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }, ...addons.map((addon) => ({ price: addon.stripe_price_id, quantity: 1 }))],
      success_url: safeReturnUrl(body?.successUrl, "/plans?checkout=success&session_id={CHECKOUT_SESSION_ID}"),
      cancel_url: safeReturnUrl(body?.cancelUrl, "/plans?checkout=cancelled"),
      allow_promotion_codes: true,
      payment_method_collection: "always",
      ...(Deno.env.get("STRIPE_REQUIRE_TERMS_CONSENT") === "true" ? { consent_collection: { terms_of_service: "required" as const } } : {}),
      subscription_data: { metadata: checkoutMetadata },
      metadata: checkoutMetadata,
    }, { idempotencyKey: `washd-checkout-${user.id}-${selectionKey}-${checkoutMinute}` });

    const { error: pendingUpdateError } = await supabase.from("profiles").update({
      pending_plan_id: planId,
      checkout_session_id: session.id,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    if (pendingUpdateError) throw pendingUpdateError;

    return json(request, { url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    if (message === "UNAUTHORIZED") return json(request, { error: "Please log in first" }, 401);
    console.error("create-checkout-session", message);
    return json(request, { error: "Unable to start secure checkout" }, 500);
  }
});
