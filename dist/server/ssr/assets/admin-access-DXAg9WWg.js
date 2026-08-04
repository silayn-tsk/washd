import { n as supabase } from "./supabase-IjeCSyWw.js";
//#region lib/admin-access.ts
async function resolveAdminAccess() {
	const { data: allowed } = await supabase.rpc("is_site_admin");
	if (allowed === true) return "allowed";
	const { data: identity } = await supabase.rpc("is_site_admin_identity");
	if (identity !== true) return "denied";
	const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
	return assurance?.nextLevel === "aal2" && assurance.currentLevel !== "aal2" ? "mfa" : "denied";
}
function redirectForAdminMfa(nextPath) {
	window.location.replace(`/mfa?next=${encodeURIComponent(nextPath)}`);
}
//#endregion
export { resolveAdminAccess as n, redirectForAdminMfa as t };
