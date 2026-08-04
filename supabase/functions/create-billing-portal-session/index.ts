import { corsHeaders, json, safeReturnUrl } from "../_shared/http.ts";
import { adminClient, requireUser, stripeClient } from "../_shared/services.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  try {
    const user = await requireUser(request);
    const body = await request.json();
    const { data: profile } = await adminClient()
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.stripe_customer_id) {
      return json(request, { error: "Subscribe to a plan before managing billing" }, 412);
    }

    const configuration = Deno.env.get("STRIPE_PORTAL_CONFIGURATION_ID") || undefined;
    const session = await stripeClient().billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: safeReturnUrl(body?.returnUrl, "/account"),
      configuration,
    });
    return json(request, { url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Portal failed";
    if (message === "UNAUTHORIZED") return json(request, { error: "Please log in first" }, 401);
    console.error("create-billing-portal-session", message);
    return json(request, { error: "Unable to open billing management" }, 500);
  }
});
