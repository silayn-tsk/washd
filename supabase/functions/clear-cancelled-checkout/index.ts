import { corsHeaders, json } from "../_shared/http.ts";
import { adminClient, requireUser } from "../_shared/services.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  try {
    const user = await requireUser(request);
    // A customer who exits Stripe Checkout has not created a subscription and
    // has not been charged. Only remove our temporary selection/session data.
    const { error } = await adminClient().from("profiles").update({
      pending_plan_id: null,
      checkout_session_id: null,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    if (error) throw error;
    return json(request, { cleared: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to clear cancelled checkout";
    if (message === "UNAUTHORIZED") return json(request, { error: "Please log in first" }, 401);
    console.error("clear-cancelled-checkout", message);
    return json(request, { error: "Unable to clear cancelled checkout" }, 500);
  }
});
