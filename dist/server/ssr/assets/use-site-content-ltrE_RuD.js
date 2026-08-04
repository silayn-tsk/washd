import { w as __toESM, y as require_react } from "../index.js";
import { n as supabase, t as isSupabaseConfigured } from "./supabase-IjeCSyWw.js";
import { i as mergeSiteContent, n as defaultPlans, r as defaultSiteContent, t as defaultAddons } from "./site-content-CrFfA5JE.js";
//#region app/use-site-content.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function useSiteContent() {
	const [content, setContent] = (0, import_react.useState)(defaultSiteContent);
	const [plans, setPlans] = (0, import_react.useState)(defaultPlans);
	const [addons, setAddons] = (0, import_react.useState)(defaultAddons);
	const [loading, setLoading] = (0, import_react.useState)(isSupabaseConfigured);
	(0, import_react.useEffect)(() => {
		if (!isSupabaseConfigured) return;
		Promise.all([
			supabase.from("site_content").select("content").eq("key", "main").maybeSingle(),
			supabase.from("plans").select("id, name, description, price_rm, popular, features, sort_order, stripe_price_id").eq("active", true).order("sort_order"),
			supabase.from("plan_addons").select("id, name, description, price_rm, active, sort_order, stripe_price_id").eq("active", true).order("sort_order")
		]).then(([contentResult, plansResult, addonsResult]) => {
			if (contentResult.data?.content) setContent(mergeSiteContent(contentResult.data.content));
			if (plansResult.data?.length) setPlans(plansResult.data);
			if (addonsResult.data?.length) setAddons(addonsResult.data);
			setLoading(false);
		});
	}, []);
	return {
		content,
		plans,
		addons,
		loading
	};
}
//#endregion
export { useSiteContent as t };
