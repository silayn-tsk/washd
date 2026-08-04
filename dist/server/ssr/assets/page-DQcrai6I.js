import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as createLucideIcon } from "./createLucideIcon-C_ZiOjAb.js";
import { n as supabase } from "./supabase-IjeCSyWw.js";
import { useAuth } from "./auth-provider-DRNPY7tG.js";
import { t as Link } from "./link-BeSeDncp.js";
import { t as ArrowLeft } from "./arrow-left-DySEBrLm.js";
import { n as CircleCheck, t as ShieldAlert } from "./shield-alert-BXmRqX9v.js";
import { t as LoaderCircle } from "./loader-circle-BAPOc58U.js";
import { t as LockKeyhole } from "./lock-keyhole-D2zGSO8b.js";
import { t as KeyRound } from "./key-round-B64x2qG4.js";
import { t as ShieldCheck } from "./shield-check-CLro6Zk2.js";
//#region node_modules/lucide-react/dist/esm/icons/smartphone.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Smartphone = createLucideIcon("smartphone", [["rect", {
	width: "14",
	height: "20",
	x: "5",
	y: "2",
	rx: "2",
	ry: "2",
	key: "1yt0o3"
}], ["path", {
	d: "M12 18h.01",
	key: "mhygvu"
}]]);
//#endregion
//#region app/admin/security/page.tsx
var import_jsx_runtime = require_jsx_runtime();
function AdminSecurityPage() {
	const { user, loading: authLoading } = useAuth();
	const [identityAllowed, setIdentityAllowed] = (0, import_react.useState)(null);
	const [verifiedFactors, setVerifiedFactors] = (0, import_react.useState)(0);
	const [currentLevel, setCurrentLevel] = (0, import_react.useState)(null);
	const [enrollment, setEnrollment] = (0, import_react.useState)(null);
	const [code, setCode] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const loadSecurity = (0, import_react.useCallback)(async () => {
		const [identityResult, factorResult, assuranceResult] = await Promise.all([
			supabase.rpc("is_site_admin_identity"),
			supabase.auth.mfa.listFactors(),
			supabase.auth.mfa.getAuthenticatorAssuranceLevel()
		]);
		const allowed = identityResult.data === true;
		setIdentityAllowed(allowed);
		if (!allowed) return;
		setVerifiedFactors(factorResult.data?.totp.filter((factor) => factor.status === "verified").length || 0);
		setCurrentLevel(assuranceResult.data?.currentLevel || null);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) window.location.replace("/login?next=/admin/security");
		if (user) queueMicrotask(() => void loadSecurity());
	}, [
		user,
		authLoading,
		loadSecurity
	]);
	async function beginEnrollment() {
		setBusy(true);
		setError("");
		setNotice("");
		const factors = await supabase.auth.mfa.listFactors();
		for (const factor of factors.data?.all.filter((item) => item.factor_type === "totp" && item.status === "unverified") || []) await supabase.auth.mfa.unenroll({ factorId: factor.id });
		const { data, error: enrollError } = await supabase.auth.mfa.enroll({
			factorType: "totp",
			friendlyName: "Washd admin"
		});
		setBusy(false);
		if (enrollError || !data?.totp) {
			setError("Authenticator setup could not start. Please refresh and try again.");
			return;
		}
		setEnrollment({
			factorId: data.id,
			qrCode: data.totp.qr_code,
			secret: data.totp.secret
		});
	}
	async function verifyEnrollment(event) {
		event.preventDefault();
		if (!enrollment) return;
		setBusy(true);
		setError("");
		setNotice("");
		const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
			factorId: enrollment.factorId,
			code: code.trim()
		});
		if (verifyError) {
			setBusy(false);
			setCode("");
			setError("That code was not accepted. Wait for the next code and try again.");
			return;
		}
		const { error: enforcementError } = await supabase.rpc("enable_admin_mfa_enforcement");
		setBusy(false);
		if (enforcementError) {
			setError("The authenticator was verified, but admin enforcement could not be enabled. Contact technical support before launch.");
			return;
		}
		setEnrollment(null);
		setCode("");
		setNotice("Authenticator protection is active. Every new admin session now requires a verification code.");
		await loadSecurity();
	}
	async function cancelEnrollment() {
		if (!enrollment) return;
		setBusy(true);
		await supabase.auth.mfa.unenroll({ factorId: enrollment.factorId });
		setEnrollment(null);
		setCode("");
		setBusy(false);
	}
	async function changePassword(event) {
		event.preventDefault();
		setError("");
		setNotice("");
		if (currentLevel !== "aal2") {
			setError("Verify this session with your authenticator before changing the owner password.");
			return;
		}
		if (newPassword.length < 12) {
			setError("Use at least 12 characters for the new owner password.");
			return;
		}
		if (newPassword !== confirmPassword) {
			setError("The two new-password entries do not match.");
			return;
		}
		setBusy(true);
		const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
		setBusy(false);
		if (updateError) {
			setError("The owner password could not be changed. Try again with a new, unique password.");
			return;
		}
		setNewPassword("");
		setConfirmPassword("");
		setNotice("Owner password changed. Store it in your password manager and do not share it in chat.");
	}
	if (authLoading || user && identityAllowed === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-state",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Opening admin security…" })]
	});
	if (!user) return null;
	if (!identityAllowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-state",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 42 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Admin access required" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This page is available only to the Washd owner account." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "deck-button",
				href: "/",
				children: "Back to website"
			})
		]
	});
	const needsChallenge = verifiedFactors > 0 && currentLevel !== "aal2";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-page security-admin-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "admin-header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "admin-brand",
				href: "/admin",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "washd. security" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "admin-secure",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 13 }), " Owner only"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				className: "admin-preview",
				href: "/admin",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 15 }), " Website editor"]
			}) })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "security-admin-content",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "payment-health-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kicker",
							children: "Account protection"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Admin multi-factor authentication" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Protect website content, customer tracking, enquiries and payment operations with an authenticator app." })
					]
				}),
				notice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "admin-notice success",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 18 }),
						" ",
						notice
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "admin-notice error",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 18 }),
						" ",
						error
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `security-status-card ${verifiedFactors > 0 ? "active" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 29 }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Current protection" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: verifiedFactors > 0 ? "Authenticator connected" : "Password only" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: verifiedFactors > 0 ? `${verifiedFactors} verified authenticator${verifiedFactors === 1 ? "" : "s"} on this account.` : "Set up an authenticator before Washd accepts real customer payments." })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: verifiedFactors > 0 ? "MFA active" : "Action required" })
					]
				}),
				needsChallenge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "security-action-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { size: 25 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Verify this session" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your account has MFA, but this browser session still needs its six-digit code." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "deck-button",
							href: "/mfa?next=/admin/security",
							children: "Enter code"
						})
					]
				}),
				!enrollment && verifiedFactors === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "security-action-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { size: 27 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Connect an authenticator app" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Use Google Authenticator, Microsoft Authenticator, 1Password or another TOTP-compatible app." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "deck-button",
							type: "button",
							disabled: busy,
							onClick: () => void beginEnrollment(),
							children: busy ? "Starting…" : "Set up authenticator"
						})
					]
				}),
				enrollment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mfa-enrollment-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kicker",
								children: "Step 1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Scan this QR code" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Open your authenticator app, add a new account and scan the code." })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: enrollment.qrCode,
							alt: "QR code for the Washd admin authenticator"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Can’t scan it?" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter this setup key manually and keep it private:" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: enrollment.secret })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (event) => void verifyEnrollment(event),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "kicker",
									children: "Step 2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Enter the six-digit code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									autoFocus: true,
									required: true,
									inputMode: "numeric",
									autoComplete: "one-time-code",
									pattern: "[0-9]{6}",
									maxLength: 6,
									value: code,
									onChange: (event) => setCode(event.target.value.replace(/\D/g, "")),
									placeholder: "000000"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "deck-button",
									type: "submit",
									disabled: busy || code.length !== 6,
									children: busy ? "Verifying…" : "Verify and enforce MFA"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "admin-link-button",
									type: "button",
									disabled: busy,
									onClick: () => void cancelEnrollment(),
									children: "Cancel"
								})] })
							]
						})
					]
				}),
				verifiedFactors > 0 && currentLevel === "aal2" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "security-password-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kicker",
							children: "Owner credential"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Replace the shared password" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Choose a unique password that you have never used elsewhere. Save it directly in your password manager." })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (event) => void changePassword(event),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["New password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								autoComplete: "new-password",
								minLength: 12,
								value: newPassword,
								onChange: (event) => setNewPassword(event.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Confirm new password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								autoComplete: "new-password",
								minLength: 12,
								value: confirmPassword,
								onChange: (event) => setConfirmPassword(event.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "deck-button",
								type: "submit",
								disabled: busy || newPassword.length < 12 || confirmPassword.length < 12,
								children: busy ? "Changing…" : "Change owner password"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "security-warning",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 19 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Do not remove the authenticator app after enabling this." }), " Supabase does not provide recovery codes. Add a second verified factor later or follow the documented owner-recovery procedure if the device is lost."] })]
				})
			]
		})]
	});
}
//#endregion
export { AdminSecurityPage as default };
