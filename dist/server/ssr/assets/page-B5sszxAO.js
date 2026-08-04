import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as createLucideIcon } from "./createLucideIcon-C_ZiOjAb.js";
import { n as CreditCard, t as RefreshCw } from "./refresh-cw-jO5yGuRS.js";
import { n as supabase } from "./supabase-IjeCSyWw.js";
import { useAuth } from "./auth-provider-DRNPY7tG.js";
import { t as Link } from "./link-BeSeDncp.js";
import { t as ArrowLeft } from "./arrow-left-DySEBrLm.js";
import { n as CircleCheck, t as ShieldAlert } from "./shield-alert-BXmRqX9v.js";
import { t as LoaderCircle } from "./loader-circle-BAPOc58U.js";
import { n as resolveAdminAccess, t as redirectForAdminMfa } from "./admin-access-DXAg9WWg.js";
//#region node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TriangleAlert = createLucideIcon("triangle-alert", [
	["path", {
		d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
		key: "wmoenq"
	}],
	["path", {
		d: "M12 9v4",
		key: "juzpu7"
	}],
	["path", {
		d: "M12 17h.01",
		key: "p32p05"
	}]
]);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Webhook = createLucideIcon("webhook", [
	["path", {
		d: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2",
		key: "q3hayz"
	}],
	["path", {
		d: "m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06",
		key: "1go1hn"
	}],
	["path", {
		d: "m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8",
		key: "qlwsc0"
	}]
]);
//#endregion
//#region app/admin/payments/page.tsx
var import_jsx_runtime = require_jsx_runtime();
var attentionStatuses = new Set([
	"payment_attention",
	"past_due",
	"unpaid",
	"incomplete",
	"incomplete_expired"
]);
function friendlyStatus(value) {
	return (value || "not subscribed").replaceAll("_", " ");
}
function AdminPaymentsPage() {
	const { user, loading: authLoading } = useAuth();
	const [allowed, setAllowed] = (0, import_react.useState)(null);
	const [members, setMembers] = (0, import_react.useState)([]);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [readiness, setReadiness] = (0, import_react.useState)(null);
	const [readinessError, setReadinessError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const loadHealth = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError("");
		setReadinessError("");
		const [memberResult, eventResult, readinessResult] = await Promise.all([
			supabase.from("profiles").select("id, member_id, name, email, plan_id, subscription_status, latest_invoice_status, payment_brand, payment_last4, current_period_end, updated_at").order("created_at", { ascending: false }),
			supabase.from("stripe_events").select("id, type, status, processed_at, last_error").order("processed_at", { ascending: false }).limit(50),
			supabase.functions.invoke("admin-payment-readiness", { body: {} })
		]);
		setLoading(false);
		if (memberResult.error || eventResult.error) {
			setError("Payment health could not be loaded. Please refresh and try again.");
			return;
		}
		setMembers(memberResult.data || []);
		setEvents(eventResult.data || []);
		if (readinessResult.error || readinessResult.data?.error) {
			setReadiness(null);
			setReadinessError("Stripe configuration status could not be verified.");
		} else setReadiness(readinessResult.data);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) window.location.replace("/login?next=/admin/payments");
		if (!user) return;
		resolveAdminAccess().then((access) => {
			if (access === "mfa") {
				redirectForAdminMfa("/admin/payments");
				return;
			}
			const canView = access === "allowed";
			setAllowed(canView);
			if (canView) loadHealth();
			else setLoading(false);
		});
	}, [
		user,
		authLoading,
		loadHealth
	]);
	const subscribed = members.filter((member) => member.subscription_status && !["canceled", "incomplete_expired"].includes(member.subscription_status));
	const needsAttention = members.filter((member) => attentionStatuses.has(member.subscription_status || "") || member.latest_invoice_status === "open");
	const failedEvents = events.filter((event) => event.status === "failed");
	const recentEvents = (0, import_react.useMemo)(() => events.slice(0, 12), [events]);
	if (authLoading || user && allowed === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-state",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Checking payment health…" })]
	});
	if (!user) return null;
	if (!allowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-state",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 42 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Admin access required" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "deck-button",
				href: "/admin",
				children: "Return to admin"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-page payment-admin-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "admin-header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "admin-brand",
				href: "/admin",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "washd. payments" })
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				className: "admin-preview",
				href: "/admin",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 15 }), " Website editor"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "admin-save",
				type: "button",
				disabled: loading,
				onClick: () => void loadHealth(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
					className: loading ? "spin" : "",
					size: 16
				}), " Refresh"]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "payment-health-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "payment-health-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kicker",
							children: "Launch operations"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Payment health" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Member billing state and Stripe webhook processing in one place." })
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
				readinessError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "admin-notice error",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 18 }),
						" ",
						readinessError
					]
				}),
				readiness && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: `payment-mode-banner ${readiness.readyForLive ? "ready" : "attention"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [readiness.readyForLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 25 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 25 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stripe environment" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: readiness.readyForLive ? "Live payments are configured" : readiness.mode === "test" ? "Stripe is still in test mode" : "Live payments need attention" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: readiness.readyForLive ? "The account, MYR prices, webhook and customer portal passed the private readiness check." : "Do not accept real customer registrations until every item below passes." })
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: readiness.account.chargesEnabled ? "pass" : "fail",
								children: ["Charges ", readiness.account.chargesEnabled ? "enabled" : "not enabled"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: readiness.account.payoutsEnabled ? "pass" : "fail",
								children: ["Payouts ", readiness.account.payoutsEnabled ? "enabled" : "not enabled"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: readiness.checks.pricesReady ? "pass" : "fail",
								children: [
									readiness.checks.configuredPrices,
									" MYR prices ",
									readiness.checks.pricesReady ? "verified" : "need attention"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: readiness.checks.webhookReady ? "pass" : "fail",
								children: ["Webhook ", readiness.checks.webhookReady ? "verified" : "not ready"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: readiness.checks.portalReady ? "pass" : "fail",
								children: ["Customer portal ", readiness.checks.portalReady ? "verified" : "not ready"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: readiness.checks.legalDisclosureReady ? "pass" : "fail",
								children: ["Supplier disclosure ", readiness.checks.legalDisclosureReady ? "complete" : "incomplete"]
							})
						] }),
						!readiness.readyForLive && readiness.issues.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Why launch is blocked" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: readiness.issues.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: issue }, issue)) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
							"Checked ",
							new Date(readiness.checkedAt).toLocaleString("en-MY"),
							" · No payment keys or account identifiers are shown."
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "payment-health-metrics",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { size: 22 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subscribed members" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: subscribed.length })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: needsAttention.length ? "attention" : "",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 22 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Need payment attention" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: needsAttention.length })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: failedEvents.length ? "attention" : "",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Webhook, { size: 22 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Failed webhooks" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: failedEvents.length })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "payment-health-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "payment-health-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "payment-health-card-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Members" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Billing status" })] }), needsAttention.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 14 }), " No payment issues"] })]
						}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "enquiry-empty",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								className: "spin",
								size: 20
							}), " Loading…"]
						}) : members.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "enquiry-empty",
							children: "No members yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "payment-member-list",
							children: members.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: attentionStatuses.has(member.subscription_status || "") ? "attention" : "",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: member.member_id }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: member.name || member.email }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: member.plan_id || "No plan" })
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `billing-status ${attentionStatuses.has(member.subscription_status || "") ? "attention" : ""}`,
										children: friendlyStatus(member.subscription_status)
									}),
									member.payment_last4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										member.payment_brand,
										" ···· ",
										member.payment_last4
									] }),
									member.current_period_end && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["Renews ", new Date(member.current_period_end).toLocaleDateString("en-MY")] })
								] })]
							}, member.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "payment-health-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "payment-health-card-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stripe events" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Recent webhook activity" })] }), failedEvents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 14 }), " Healthy"] })]
						}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "enquiry-empty",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								className: "spin",
								size: 20
							}), " Loading…"]
						}) : recentEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "enquiry-empty",
							children: "No Stripe events yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "payment-event-list",
							children: recentEvents.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `event-health ${event.status}`,
								children: event.status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: event.type }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: new Date(event.processed_at).toLocaleString("en-MY") }),
								event.last_error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: event.last_error })
							] })] }, event.id))
						})]
					})]
				})
			]
		})]
	});
}
//#endregion
export { AdminPaymentsPage as default };
