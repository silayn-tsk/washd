import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { n as supabase, t as isSupabaseConfigured } from "./supabase-IjeCSyWw.js";
//#region app/auth-provider.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)({
	user: null,
	loading: true
});
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(isSupabaseConfigured);
	(0, import_react.useEffect)(() => {
		if (!isSupabaseConfigured) return;
		supabase.auth.getSession().then(({ data }) => {
			setUser(data.session?.user ?? null);
			setLoading(false);
		});
		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});
		return () => listener.subscription.unsubscribe();
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		user,
		loading
	}), [user, loading]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(AuthContext);
}
//#endregion
export { AuthProvider, useAuth };
