import { corsHeaders, json } from "../_shared/http.ts";
import { adminClient, requireUser } from "../_shared/services.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  try {
    const user = await requireUser(request);
    const body = await request.json();
    const bagId = String(body?.bagId || "").trim().toUpperCase();
    if (!/^[A-Z0-9-]{3,32}$/.test(bagId)) return json(request, { error: "Bag details are invalid" }, 400);

    const supabase = adminClient();
    const { data: bag, error: bagError } = await supabase
      .from("bags")
      .select("events, status")
      .eq("user_id", user.id)
      .eq("id", bagId)
      .maybeSingle();
    if (bagError) throw bagError;
    if (!bag) return json(request, { error: "Bag not found" }, 404);
    if (bag.status !== "ready") return json(request, { error: "This bag is not ready to collect yet" }, 409);

    const now = new Date().toISOString();
    const events = Array.isArray(bag.events) ? bag.events : [];
    const { error: updateError } = await supabase.from("bags").update({
      status: "empty",
      events: [...events, { status: "collected", label: "Member confirmed bag collection", at: now }],
      updated_at: now,
    }).eq("user_id", user.id).eq("id", bagId);
    if (updateError) throw updateError;

    const { error: collectionError } = await supabase.from("collections").update({ status: "collected", updated_at: now })
      .eq("user_id", user.id).eq("type", "collection").in("status", ["ready", "scheduled"]);
    if (collectionError) throw collectionError;

    return json(request, { ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to confirm collection";
    if (message === "UNAUTHORIZED") return json(request, { error: "Please log in first" }, 401);
    console.error("member-confirm-bag-collection", message);
    return json(request, { error: "Unable to confirm collection" }, 500);
  }
});
