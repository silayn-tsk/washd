import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as createLucideIcon } from "./createLucideIcon-C_ZiOjAb.js";
import { t as ArrowRight } from "./arrow-right-B3OoMR5i.js";
import { n as CalendarDays, t as MemberHeader } from "./member-header-TP8FFmTc.js";
import { t as Check } from "./check-BL4M26RJ.js";
import { t as Clock3 } from "./clock-3-MO75UB1Z.js";
import { n as CreditCard, t as RefreshCw } from "./refresh-cw-jO5yGuRS.js";
import { t as LogOut } from "./log-out-BXy5j2aR.js";
import { t as MapPin } from "./map-pin-Xu6G1a_r.js";
import { t as PackageCheck } from "./package-check-BNDVGQv6.js";
import { n as Shirt, t as Sparkles } from "./sparkles-DeCK4-rI.js";
import { t as Truck } from "./truck-Bk9_Kx1j.js";
import { n as supabase, t as isSupabaseConfigured } from "./supabase-IjeCSyWw.js";
import { useAuth } from "./auth-provider-DRNPY7tG.js";
import { t as useSiteContent } from "./use-site-content-ltrE_RuD.js";
//#region node_modules/lucide-react/dist/esm/icons/copy.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Copy = createLucideIcon("copy", [["rect", {
	width: "14",
	height: "14",
	x: "8",
	y: "8",
	rx: "2",
	ry: "2",
	key: "17jyea"
}], ["path", {
	d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
	key: "zix9uf"
}]]);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var UserRound = createLucideIcon("user-round", [["circle", {
	cx: "12",
	cy: "8",
	r: "5",
	key: "1hypcn"
}], ["path", {
	d: "M20 21a8 8 0 0 0-16 0",
	key: "rfgkzh"
}]]);
//#endregion
//#region app/account/page.tsx
var import_jsx_runtime = require_jsx_runtime();
var trackingSteps = [
	{
		key: "received",
		label: "Bag received",
		caption: "Checked and counted"
	},
	{
		key: "washing",
		label: "Cleaning",
		caption: "Washed separately"
	},
	{
		key: "finishing",
		label: "Finishing",
		caption: "Folded or pressed"
	},
	{
		key: "ready",
		label: "Ready",
		caption: "At your collection point"
	}
];
function trackingIndex(status) {
	const normalized = (status || "").toLowerCase().replaceAll("-", "_");
	if ([
		"ready",
		"returned",
		"completed",
		"out_for_delivery"
	].includes(normalized)) return 3;
	if ([
		"finishing",
		"drying",
		"folding",
		"pressing",
		"quality_check"
	].includes(normalized)) return 2;
	if ([
		"washing",
		"cleaning",
		"in_progress"
	].includes(normalized)) return 1;
	if ([
		"received",
		"collected",
		"picked_up",
		"checked_in"
	].includes(normalized)) return 0;
	return -1;
}
function nextFixedDrop() {
	const date = /* @__PURE__ */ new Date();
	for (let days = 0; days < 8; days += 1) {
		const candidate = new Date(date);
		candidate.setDate(date.getDate() + days);
		candidate.setHours(9, 30, 0, 0);
		if ([1, 3].includes(candidate.getDay()) && candidate > date) return candidate;
	}
	return date;
}
function formatDate(value, options) {
	return new Intl.DateTimeFormat("en-MY", options || {
		weekday: "long",
		day: "numeric",
		month: "long"
	}).format(new Date(value));
}
function AccountPage() {
	const { user, loading } = useAuth();
	const { plans, addons } = useSiteContent();
	const [profile, setProfile] = (0, import_react.useState)({});
	const [bag, setBag] = (0, import_react.useState)(null);
	const [collection, setCollection] = (0, import_react.useState)(null);
	const [dataLoading, setDataLoading] = (0, import_react.useState)(true);
	const [billingBusy, setBillingBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [checkoutSuccess, setCheckoutSuccess] = (0, import_react.useState)(false);
	const [memberIdCopied, setMemberIdCopied] = (0, import_react.useState)(false);
	const loadDashboard = (0, import_react.useCallback)(async () => {
		if (!user) return;
		const [profileResult, bagResult, collectionResult] = await Promise.all([
			supabase.from("profiles").select("name, member_id, plan_id, active_addons, subscription_status, payment_brand, payment_last4, unit, current_period_end").eq("id", user.id).maybeSingle(),
			supabase.from("bags").select("id, status, cycle_started_at, events, updated_at").eq("user_id", user.id).order("cycle_started_at", { ascending: false }).limit(1).maybeSingle(),
			supabase.from("collections").select("id, type, due, location, status").eq("user_id", user.id).gte("due", (/* @__PURE__ */ new Date(Date.now() - 720 * 60 * 1e3)).toISOString()).order("due").limit(1).maybeSingle()
		]);
		setProfile(profileResult.data ?? {});
		setBag(bagResult.data ?? null);
		setCollection(collectionResult.data ?? null);
		setDataLoading(false);
	}, [user]);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) window.location.replace("/login?next=/account");
		if (!user) return;
		queueMicrotask(() => void loadDashboard());
		const channel = supabase.channel(`member-tracking-${user.id}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "bags",
			filter: `user_id=eq.${user.id}`
		}, () => void loadDashboard()).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "collections",
			filter: `user_id=eq.${user.id}`
		}, () => void loadDashboard()).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [
		user,
		loading,
		loadDashboard
	]);
	(0, import_react.useEffect)(() => {
		if (new URLSearchParams(window.location.search).get("checkout") === "success") queueMicrotask(() => setCheckoutSuccess(true));
	}, []);
	async function manageBilling() {
		setBillingBusy(true);
		setError("");
		try {
			if (!isSupabaseConfigured) throw new Error("Billing service is not configured");
			const { data, error: portalError } = await supabase.functions.invoke("create-billing-portal-session", { body: { returnUrl: `${window.location.origin}/account` } });
			if (portalError) throw portalError;
			if (!data?.url?.startsWith("https://")) throw new Error("Missing secure portal URL");
			window.location.assign(data.url);
		} catch {
			setError("Billing management becomes available after your first membership payment is activated.");
		} finally {
			setBillingBusy(false);
		}
	}
	const activeStep = trackingIndex(bag?.status);
	const plan = plans.find((candidate) => candidate.id === profile.plan_id);
	const planName = plan?.name || profile.plan_id?.replaceAll("-", " ") || "No active plan";
	const activeAddonRows = addons.filter((addon) => profile.active_addons?.includes(addon.id));
	const nextDrop = (0, import_react.useMemo)(() => nextFixedDrop(), []);
	const nextDue = collection?.due || nextDrop;
	const latestEvent = bag?.events?.at(-1);
	const lastUpdated = bag?.updated_at || latestEvent?.at;
	const memberId = profile.member_id || "Assigning…";
	async function copyMemberId() {
		if (!profile.member_id) return;
		await navigator.clipboard.writeText(profile.member_id);
		setMemberIdCopied(true);
		window.setTimeout(() => setMemberIdCopied(false), 1800);
	}
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "member-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "account-loading",
			children: "Loading your Washd dashboard…"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "member-page account-page dashboard-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "dashboard-title",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dashboard-intro",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kicker",
							children: "Member dashboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
							"Hello, ",
							profile.name?.split(" ")[0] || user.user_metadata?.name?.split(" ")[0] || "member",
							"."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your laundry journey, next collection and membership in one place." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "member-id-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "member-id-topline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Washd member ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "Active member" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: memberId }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "member-id-footer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Keep this ID handy when contacting our care team." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !profile.member_id,
								onClick: () => void copyMemberId(),
								"aria-label": "Copy member ID",
								children: [memberIdCopied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 15 }), memberIdCopied ? "Copied" : "Copy"]
							})]
						})
					]
				})]
			}),
			checkoutSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "checkout-banner success",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 19 }), " Payment complete. Your new membership will appear here as soon as confirmation arrives."]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "checkout-banner error",
				role: "alert",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "tracking-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tracking-topline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot" }), " Live bag tracking"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void loadDashboard(),
							disabled: dataLoading,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
								size: 15,
								className: dataLoading ? "spin" : ""
							}), " Refresh"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tracking-summary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bag ? `Bag ${bag.id}` : "Your next Washd bag" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: bag ? trackingSteps[Math.max(activeStep, 0)]?.label || "In our care" : "Ready for your next drop" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: bag ? latestEvent?.label || "Your bag is moving through the Washd care process." : `Drop by 9:30am on ${formatDate(nextDrop)}.` })
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "return-estimate",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 20 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bag ? "Expected return" : "Next drop" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatDate(nextDue, {
									weekday: "short",
									day: "numeric",
									month: "short",
									hour: "numeric",
									minute: "2-digit"
								}) })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "tracking-progress",
						children: trackingSteps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: index < activeStep ? "done" : index === activeStep ? "active" : "",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: index <= activeStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 }) : index + 1 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: step.label }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: step.caption })
							]
						}, step.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tracking-footer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { size: 15 }), " Updates appear here as our team scans your numbered bag."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: lastUpdated ? `Last update ${formatDate(lastUpdated, {
							day: "numeric",
							month: "short",
							hour: "numeric",
							minute: "2-digit"
						})}` : "Waiting for your first scan" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "dashboard-grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "dashboard-card collection-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "dashboard-card-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { size: 22 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Next collection" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: formatDate(nextDue) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 15 }),
								" ",
								collection ? formatDate(collection.due, {
									hour: "numeric",
									minute: "2-digit"
								}) : "Drop by 9:30am"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 15 }),
								" ",
								collection?.location || profile.unit || "Residence lobby"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: collection ? collection.status : "Fixed weekly route" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "dashboard-card plan-dashboard-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "dashboard-card-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { size: 22 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Current membership" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: planName }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: plan?.description || (profile.plan_id ? "Your active Washd membership" : "Choose a plan to begin weekly collections.") }),
							activeAddonRows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "active-addons",
								children: activeAddonRows.map((addon) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { size: 13 }),
									" ",
									addon.name
								] }, addon.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "text-button",
								href: "/plans",
								children: [
									profile.plan_id ? "View or change plan" : "Choose a plan",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "dashboard-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "dashboard-card-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { size: 22 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Billing" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: profile.payment_last4 ? `${profile.payment_brand || "Card"} •••• ${profile.payment_last4}` : "No payment method" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: profile.current_period_end ? `Next renewal ${formatDate(profile.current_period_end)}` : "Your card details are entered only on secure checkout." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "text-button",
								type: "button",
								disabled: billingBusy || !profile.payment_last4,
								onClick: () => void manageBilling(),
								children: [
									billingBusy ? "Opening…" : profile.payment_last4 ? "Manage billing" : "Available after payment",
									" ",
									profile.payment_last4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "dashboard-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "dashboard-card-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { size: 22 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Member profile" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: profile.name || user.user_metadata?.name || "Washd member" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: user.email }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: profile.unit || "Residence lobby" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "text-button logout-button",
								type: "button",
								onClick: async () => {
									await supabase.auth.signOut();
									window.location.assign("/");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 15 }), " Log out"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "dashboard-help",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 22 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Need help with a collection?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Share your member ID and bag number with the Washd team for the fastest assistance." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "https://wa.me/60176494749",
						target: "_blank",
						rel: "noreferrer",
						children: ["Message Washd ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
					})
				]
			})
		]
	});
}
//#endregion
export { AccountPage as default };
