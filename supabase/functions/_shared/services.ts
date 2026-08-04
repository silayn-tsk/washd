import { createClient, type User } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@22";

export function adminClient() {
  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  const serviceKey = (secretKeys ? JSON.parse(secretKeys).default : null) ||
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceKey) throw new Error("Supabase server key is unavailable");
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    serviceKey,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export function stripeClient() {
  const secret = Deno.env.get("STRIPE_SECRET_KEY");
  if (!secret) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(secret);
}

export async function requireUser(request: Request): Promise<User> {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) throw new Error("UNAUTHORIZED");

  const { data, error } = await adminClient().auth.getUser(token);
  if (error || !data.user) throw new Error("UNAUTHORIZED");
  return data.user;
}

export async function requireAdmin(request: Request): Promise<User> {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) throw new Error("UNAUTHORIZED");

  const supabase = adminClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("UNAUTHORIZED");

  const { data: admin, error: adminError } = await supabase
    .from("site_admins")
    .select("user_id, mfa_required")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (adminError || !admin) throw new Error("ADMIN_REQUIRED");

  if (admin.mfa_required) {
    const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel(token);
    if (assuranceError || assurance?.currentLevel !== "aal2") throw new Error("MFA_REQUIRED");
  }
  return data.user;
}
