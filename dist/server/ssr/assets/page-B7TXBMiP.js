import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as ArrowRight } from "./arrow-right-B3OoMR5i.js";
import { n as supabase } from "./supabase-IjeCSyWw.js";
import { useAuth } from "./auth-provider-DRNPY7tG.js";
import { t as Link } from "./link-BeSeDncp.js";
import { t as LoaderCircle } from "./loader-circle-BAPOc58U.js";
import { t as LockKeyhole } from "./lock-keyhole-D2zGSO8b.js";
import { t as KeyRound } from "./key-round-B64x2qG4.js";
import { t as ShieldCheck } from "./shield-check-CLro6Zk2.js";
//#region app/mfa/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function nextPath() {
	if (typeof window === "undefined") return "/account";
	const value = new URLSearchParams(window.location.search).get("next");
	return value?.startsWith("/") && !value.startsWith("//") ? value : "/account";
}
function MfaPage() {
	const { user, loading: authLoading } = useAuth();
	const [factorId, setFactorId] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) window.location.replace(`/login?next=${encodeURIComponent(`/mfa?next=${nextPath()}`)}`);
		if (!user) return;
		Promise.all([supabase.auth.mfa.getAuthenticatorAssuranceLevel(), supabase.auth.mfa.listFactors()]).then(([assuranceResult, factorResult]) => {
			if (assuranceResult.data?.currentLevel === "aal2") {
				window.location.replace(nextPath());
				return;
			}
			const verified = factorResult.data?.totp.find((factor) => factor.status === "verified");
			if (verified) setFactorId(verified.id);
			else setError("No verified authenticator is attached to this account. The Washd owner can set one up from Admin Security.");
			setLoading(false);
		});
	}, [user, authLoading]);
	async function verify(event) {
		event.preventDefault();
		if (!factorId) return;
		setBusy(true);
		setError("");
		const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
			factorId,
			code: code.trim()
		});
		setBusy(false);
		if (verifyError) {
			setError("That verification code was not accepted. Wait for a new code in your authenticator app and try again.");
			setCode("");
			return;
		}
		window.location.replace(nextPath());
	}
	if (authLoading || loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-state",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Checking account security…" })]
	});
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mfa-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mfa-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "brand",
					href: "/",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["washd", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "brand-dot",
						children: "."
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mfa-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 28 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "kicker",
					children: "Protected access"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Enter your authenticator code." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Open the authenticator app connected to your Washd owner account and enter the current six-digit code." }),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "form-alert error",
					role: "alert",
					children: error
				}),
				factorId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (event) => void verify(event),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Six-digit code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						required: true,
						inputMode: "numeric",
						autoComplete: "one-time-code",
						pattern: "[0-9]{6}",
						maxLength: 6,
						value: code,
						onChange: (event) => setCode(event.target.value.replace(/\D/g, "")),
						placeholder: "000000"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "button wide gold-button",
						type: "submit",
						disabled: busy || code.length !== 6,
						children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							className: "spin",
							size: 17
						}), " Verifying…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Verify and continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 17 })] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 14 }), " Password access alone cannot open protected Washd administration."] }),
				!factorId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "text-button",
					href: "/admin/security",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { size: 16 }), " Open Admin Security"]
				})
			]
		})
	});
}
//#endregion
export { MfaPage as default };
