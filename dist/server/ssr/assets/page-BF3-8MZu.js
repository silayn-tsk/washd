import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as ArrowRight } from "./arrow-right-B3OoMR5i.js";
import { t as MapPin } from "./map-pin-Xu6G1a_r.js";
import { n as supabase, t as isSupabaseConfigured } from "./supabase-IjeCSyWw.js";
import { t as Link } from "./link-BeSeDncp.js";
import { t as LockKeyhole } from "./lock-keyhole-D2zGSO8b.js";
import { n as Eye, t as EyeOff } from "./eye-off-7dhMBhpz.js";
import { n as turnstileSiteKey, t as TurnstileWidget } from "./turnstile-widget-Bx-oZLjk.js";
//#region app/login/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function friendlyError(message) {
	const normalized = message?.toLowerCase() ?? "";
	if (normalized.includes("invalid login credentials")) return "That email or password doesn’t match our records.";
	if (normalized.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
	if (normalized.includes("email")) return "Enter a valid email address.";
	return "We couldn’t log you in. Please try again.";
}
function safeNextPath() {
	if (typeof window === "undefined") return "/account";
	const next = new URLSearchParams(window.location.search).get("next");
	return next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
}
function LoginPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [captchaToken, setCaptchaToken] = (0, import_react.useState)("");
	const [captchaReset, setCaptchaReset] = (0, import_react.useState)(0);
	const handleCaptcha = (0, import_react.useCallback)((token) => setCaptchaToken(token), []);
	(0, import_react.useEffect)(() => {
		if (new URLSearchParams(window.location.search).get("signup") === "check-email") queueMicrotask(() => setNotice("Check your inbox to confirm your Washd account, then log in."));
	}, []);
	async function logIn(loginEmail = email, loginPassword = password) {
		setBusy(true);
		setError("");
		setNotice("");
		try {
			if (!isSupabaseConfigured) throw new Error("Supabase is not configured");
			if (turnstileSiteKey && !captchaToken) throw new Error("CAPTCHA_REQUIRED");
			const { error: authError } = await supabase.auth.signInWithPassword({
				email: loginEmail.trim(),
				password: loginPassword,
				options: { captchaToken: captchaToken || void 0 }
			});
			if (authError) throw authError;
			const destination = safeNextPath();
			const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
			if (assurance?.currentLevel !== "aal2" && assurance?.nextLevel === "aal2") window.location.assign(`/mfa?next=${encodeURIComponent(destination)}`);
			else window.location.assign(destination);
		} catch (caught) {
			const message = caught.message;
			setError(message?.includes("CAPTCHA_REQUIRED") ? "Complete the security check before logging in." : message?.includes("not configured") ? "Washd account access is being connected. Please try again shortly." : friendlyError(message));
		} finally {
			setBusy(false);
			if (turnstileSiteKey) setCaptchaReset((value) => value + 1);
		}
	}
	async function resetPassword() {
		if (!email.trim()) {
			setError("Enter your email first, then choose reset password.");
			return;
		}
		setBusy(true);
		setError("");
		try {
			if (!isSupabaseConfigured) throw new Error("Supabase is not configured");
			if (turnstileSiteKey && !captchaToken) throw new Error("CAPTCHA_REQUIRED");
			const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
				redirectTo: `${window.location.origin}/reset-password`,
				captchaToken: captchaToken || void 0
			});
			if (resetError) throw resetError;
			setNotice(`Password reset instructions were sent to ${email.trim()}.`);
		} catch (caught) {
			const message = caught.message;
			setError(message?.includes("CAPTCHA_REQUIRED") ? "Complete the security check before requesting a password reset." : message?.includes("not configured") ? "Washd account access is being connected. Please try again shortly." : friendlyError(message));
		} finally {
			setBusy(false);
			if (turnstileSiteKey) setCaptchaReset((value) => value + 1);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "auth-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "auth-story",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "brand auth-brand",
					href: "/",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["washd", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "brand-dot",
						children: "."
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "auth-story-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kicker light",
							children: "Your laundry, in view"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
							"From lobby",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "wardrobe." })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Book collections, follow each bag and manage your Washd plan from one beautifully simple account." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "auth-benefits",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 18 }), " Live bag tracking"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 18 }), " Secure account access"] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "auth-orbit",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "auth-form-side",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "auth-form-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "auth-mobile-logo",
						children: ["washd", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "brand-dot",
							children: "."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kicker",
						children: "Member access"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Welcome back." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Schedule collections and track each bag from lobby to wardrobe." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (event) => {
							event.preventDefault();
							logIn();
						},
						children: [
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
									minLength: 6,
									type: showPassword ? "text" : "password",
									autoComplete: "current-password",
									value: password,
									onChange: (event) => setPassword(event.target.value),
									placeholder: "Your password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": showPassword ? "Hide password" : "Show password",
									onClick: () => setShowPassword((value) => !value),
									children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 19 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 19 })
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TurnstileWidget, {
								action: "member_login",
								onToken: handleCaptcha,
								resetSignal: captchaReset
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "form-alert error",
								role: "alert",
								children: error
							}),
							notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "form-alert success",
								role: "status",
								children: notice
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "button wide gold-button",
								type: "submit",
								disabled: busy,
								children: busy ? "Logging in…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Log in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "auth-links",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/signup",
							children: "Create an account"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void resetPassword(),
							children: "Reset password"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
						className: "secure-note",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 13 }),
							" Secure encrypted member access · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: "/privacy",
								children: "Privacy"
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: "/privacy/bm",
								children: "Notis Privasi"
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginPage as default };
