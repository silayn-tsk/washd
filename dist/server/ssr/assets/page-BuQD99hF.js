import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as ArrowRight } from "./arrow-right-B3OoMR5i.js";
import { n as supabase, t as isSupabaseConfigured } from "./supabase-IjeCSyWw.js";
import { t as Link } from "./link-BeSeDncp.js";
import { t as LockKeyhole } from "./lock-keyhole-D2zGSO8b.js";
import { n as Eye, t as EyeOff } from "./eye-off-7dhMBhpz.js";
//#region app/reset-password/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [complete, setComplete] = (0, import_react.useState)(false);
	async function updatePassword(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		try {
			if (!isSupabaseConfigured) throw new Error("Supabase is not configured");
			const { error: updateError } = await supabase.auth.updateUser({ password });
			if (updateError) throw updateError;
			setComplete(true);
		} catch {
			setError("This reset link is invalid or expired. Request a new one from the login page.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "auth-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "auth-story",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "brand auth-brand",
				href: "/",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["washd", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "brand-dot",
					children: "."
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "auth-story-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kicker light",
						children: "Account security"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						"A fresh start,",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "securely handled." })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Choose a new password for your Washd account." })
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "auth-form-side",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "auth-form-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "auth-mobile-logo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kicker",
						children: "Password recovery"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: complete ? "Password updated." : "Choose a new password." }),
					complete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your Washd account is ready." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "button wide gold-button",
						href: "/account",
						children: ["Continue to account ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: updatePassword,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["New password", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "password-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									minLength: 10,
									type: showPassword ? "text" : "password",
									autoComplete: "new-password",
									value: password,
									onChange: (event) => setPassword(event.target.value),
									placeholder: "At least 10 characters"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": showPassword ? "Hide password" : "Show password",
									onClick: () => setShowPassword((value) => !value),
									children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 19 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 19 })
								})]
							})] }),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "form-alert error",
								role: "alert",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button wide gold-button",
								type: "submit",
								disabled: busy,
								children: busy ? "Updating…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Update password ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })] })
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { ResetPasswordPage as default };
