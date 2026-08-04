import { supabase } from "./supabase";

export type AdminAccess = "allowed" | "mfa" | "denied";

export async function resolveAdminAccess(): Promise<AdminAccess> {
  const { data: allowed } = await supabase.rpc("is_site_admin");
  if (allowed === true) return "allowed";

  const { data: identity } = await supabase.rpc("is_site_admin_identity");
  if (identity !== true) return "denied";

  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  return assurance?.nextLevel === "aal2" && assurance.currentLevel !== "aal2" ? "mfa" : "denied";
}

export function redirectForAdminMfa(nextPath: string) {
  window.location.replace(`/mfa?next=${encodeURIComponent(nextPath)}`);
}
