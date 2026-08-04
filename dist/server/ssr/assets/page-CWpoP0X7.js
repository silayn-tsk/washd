import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as ArrowRight } from "./arrow-right-B3OoMR5i.js";
import { t as Check } from "./check-BL4M26RJ.js";
import { n as supabase, t as isSupabaseConfigured } from "./supabase-IjeCSyWw.js";
import { t as Link } from "./link-BeSeDncp.js";
import { n as Eye, t as EyeOff } from "./eye-off-7dhMBhpz.js";
import { n as turnstileSiteKey, t as TurnstileWidget } from "./turnstile-widget-Bx-oZLjk.js";
//#region app/signup/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function SignupPage() {
	const [name, setName] = (0, import_react.useState)("");
	const [unit, setUnit] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [captchaToken, setCaptchaToken] = (0, import_react.useState)("");
	const [captchaReset, setCaptchaReset] = (0, import_react.useState)(0);
	const handleCaptcha = (0, import_react.useCallback)((token) => setCaptchaToken(token), []);
	async function createAccount(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		try {
			if (!isSupabaseConfigured) throw new Error("Supabase is not configured");
			if (turnstileSiteKey && !captchaToken) throw new Error("CAPTCHA_REQUIRED");
			const pickupLabel = unit.trim() || "Residence lobby";
			const { data, error: signupError } = await supabase.auth.signUp({
				email: email.trim(),
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/plans`,
					captchaToken: captchaToken || void 0,
					data: {
						name: name.trim(),
						unit: pickupLabel,
						pickup_location: {
							label: pickupLabel,
							notes: ""
						}
					}
				}
			});
			if (signupError) throw signupError;
			window.location.assign(data.session ? "/plans" : "/login?signup=check-email");
		} catch (caught) {
			const message = caught.message?.toLowerCase() ?? "";
			setError(message.includes("captcha_required") ? "Complete the security check before creating your account." : message.includes("already registered") ? "An account already exists for this email. Try logging in instead." : message.includes("password") ? "Choose a password with at least 10 characters." : message.includes("not configured") ? "Washd account creation is being connected. Please try again shortly." : "We couldn’t create your account. Please check your details and try again.");
		} finally {
			setBusy(false);
			if (turnstileSiteKey) setCaptchaReset((value) => value + 1);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "signup-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			className: "brand signup-brand",
			href: "/",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["washd", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "brand-dot",
				children: "."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "signup-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "signup-intro",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kicker",
						children: "Join Washd"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "A fresher weekly rhythm starts here." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Create your account now. You can choose a plan after signing up." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }), " Track every Washd bag"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }), " Manage pickups in one place"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }), " Secure Stripe-hosted payments"] })
					] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: createAccount,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Full name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						minLength: 2,
						autoComplete: "name",
						value: name,
						onChange: (event) => setName(event.target.value),
						placeholder: "Your name"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Residence / unit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoComplete: "street-address",
						value: unit,
						onChange: (event) => setUnit(event.target.value),
						placeholder: "e.g. The Residence · Unit 12-3"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "email",
						autoComplete: "email",
						value: email,
						onChange: (event) => setEmail(event.target.value),
						placeholder: "you@example.com"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TurnstileWidget, {
						action: "signup",
						onToken: handleCaptcha,
						resetSignal: captchaReset
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "form-alert error",
						role: "alert",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "button wide gold-button",
						type: "submit",
						disabled: busy,
						children: busy ? "Creating account…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Create account ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "form-foot",
						children: [
							"We use these details to create and secure your account. Read our ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: "/privacy",
								children: "Privacy Notice"
							}),
							" or ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: "/privacy/bm",
								children: "Notis Privasi"
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "form-foot",
						children: ["Already a member? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/login",
							children: "Log in"
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { SignupPage as default };
