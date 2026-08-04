import { corsHeaders, json } from "../_shared/http.ts";
import { adminClient, requireAdmin } from "../_shared/services.ts";

const allowedStatuses = ["received", "washing", "finishing", "ready"];
const statusLabels: Record<string, string> = {
  received: "Bag received and checked in",
  washing: "Laundry is being washed separately",
  finishing: "Laundry is being folded, pressed and quality checked",
  ready: "Bag is ready at the collection point",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

  try {
    await requireAdmin(request);
    const supabase = adminClient();

    const body = await request.json();
    const memberId = String(body?.memberId || "");
    const bagId = String(body?.bagId || "").trim().toUpperCase();
    const status = String(body?.status || "");
    const collectionDue = body?.collectionDue ? new Date(String(body.collectionDue)) : null;
    const location = String(body?.location || "Residence lobby").trim();
    if (!/^[0-9a-f-]{36}$/i.test(memberId) || !/^[A-Z0-9-]{3,32}$/.test(bagId) || !allowedStatuses.includes(status)) {
      return json(request, { error: "Tracking details are invalid" }, 400);
    }
    if (collectionDue && Number.isNaN(collectionDue.getTime())) return json(request, { error: "Collection date is invalid" }, 400);

    const { data: profile } = await supabase.from("profiles").select("id, member_id").eq("id", memberId).maybeSingle();
    if (!profile) return json(request, { error: "Member not found" }, 404);

    const { data: existing } = await supabase.from("bags").select("events, cycle_started_at").eq("user_id", memberId).eq("id", bagId).maybeSingle();
    const events = Array.isArray(existing?.events) ? existing.events : [];
    const now = new Date().toISOString();
    const latestStatus = (events.at(-1) as { status?: string } | undefined)?.status;
    const nextEvents = latestStatus === status ? events : [...events, { status, label: statusLabels[status], at: now }];

    const { error: bagError } = await supabase.from("bags").upsert({
      id: bagId,
      user_id: memberId,
      status,
      cycle_started_at: existing?.cycle_started_at || now,
      events: nextEvents,
      updated_at: now,
    }, { onConflict: "user_id,id" });
    if (bagError) throw bagError;

    if (collectionDue) {
      const { error: collectionError } = await supabase.from("collections").upsert({
        id: `return-${profile.member_id}`,
        user_id: memberId,
        type: "collection",
        due: collectionDue.toISOString(),
        location: location || "Residence lobby",
        status: status === "ready" ? "ready" : "scheduled",
        updated_at: now,
      }, { onConflict: "user_id,id" });
      if (collectionError) throw collectionError;
    }

    return json(request, { ok: true, bagId, status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update tracking";
    if (message === "UNAUTHORIZED") return json(request, { error: "Please log in" }, 401);
    if (message === "ADMIN_REQUIRED") return json(request, { error: "Admin access required" }, 403);
    if (message === "MFA_REQUIRED") return json(request, { error: "Authenticator verification required" }, 403);
    console.error("admin-update-tracking", message);
    return json(request, { error: "Unable to update member tracking" }, 500);
  }
});
