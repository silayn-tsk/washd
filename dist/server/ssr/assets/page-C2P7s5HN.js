import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as ArrowRight } from "./arrow-right-B3OoMR5i.js";
import { n as CalendarDays, t as MemberHeader } from "./member-header-TP8FFmTc.js";
import { t as Check } from "./check-BL4M26RJ.js";
import { t as PackageCheck } from "./package-check-BNDVGQv6.js";
import { n as Shirt, t as Sparkles } from "./sparkles-DeCK4-rI.js";
import { n as supabase, t as isSupabaseConfigured } from "./supabase-IjeCSyWw.js";
import { useAuth } from "./auth-provider-DRNPY7tG.js";
import { t as Link } from "./link-BeSeDncp.js";
import { t as useSiteContent } from "./use-site-content-ltrE_RuD.js";
import { t as ArrowLeft } from "./arrow-left-DySEBrLm.js";
import { t as LockKeyhole } from "./lock-keyhole-D2zGSO8b.js";
import { t as SlidersHorizontal } from "./sliders-horizontal-DzzRRpd6.js";
//#region app/plans/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function PlansPage() {
	const { user, loading: authLoading } = useAuth();
	const { content, plans, addons, loading: contentLoading } = useSiteContent();
	const [selectedPlanId, setSelectedPlanId] = (0, import_react.useState)("");
	const [selectedAddons, setSelectedAddons] = (0, import_react.useState)([]);
	const [checkoutBusy, setCheckoutBusy] = (0, import_react.useState)(false);
	const [termsAccepted, setTermsAccepted] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const search = new URLSearchParams(window.location.search);
		const result = search.get("checkout");
		const plan = search.get("plan") || "";
		if (result === "success" || result === "cancelled") queueMicrotask(() => setStatus(result));
		if (plan) queueMicrotask(() => setSelectedPlanId(plan));
	}, []);
	(0, import_react.useEffect)(() => {
		if (authLoading || user || !selectedPlanId) return;
		const next = `/plans?plan=${encodeURIComponent(selectedPlanId)}`;
		window.location.replace(`/login?next=${encodeURIComponent(next)}`);
	}, [
		authLoading,
		user,
		selectedPlanId
	]);
	const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
	const selectedAddonRows = addons.filter((addon) => selectedAddons.includes(addon.id));
	const total = (selectedPlan?.price_rm || 0) + selectedAddonRows.reduce((sum, addon) => sum + addon.price_rm, 0);
	function choosePlan(plan) {
		if (!user) {
			const next = `/plans?plan=${encodeURIComponent(plan.id)}`;
			window.location.assign(`/login?next=${encodeURIComponent(next)}`);
			return;
		}
		setSelectedPlanId(plan.id);
		setSelectedAddons([]);
		setTermsAccepted(false);
		setError("");
		window.history.pushState({}, "", `/plans?plan=${encodeURIComponent(plan.id)}`);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
	async function makePayment() {
		if (!selectedPlan) return;
		if (!user) {
			const next = `/plans?plan=${encodeURIComponent(selectedPlan.id)}`;
			window.location.assign(`/login?next=${encodeURIComponent(next)}`);
			return;
		}
		setCheckoutBusy(true);
		setError("");
		try {
			if (!termsAccepted) throw new Error("TERMS_REQUIRED");
			if (!isSupabaseConfigured) throw new Error("Payment service is not configured");
			const origin = window.location.origin;
			const { data, error: checkoutError } = await supabase.functions.invoke("create-checkout-session", { body: {
				planId: selectedPlan.id,
				addonIds: selectedAddons,
				termsAccepted: true,
				successUrl: `${origin}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
				cancelUrl: `${origin}/plans?plan=${encodeURIComponent(selectedPlan.id)}&checkout=cancelled`
			} });
			if (checkoutError) throw checkoutError;
			if (!data?.url?.startsWith("https://")) throw new Error("Missing secure checkout URL");
			window.location.assign(data.url);
		} catch (caught) {
			setError(caught instanceof Error && caught.message === "TERMS_REQUIRED" ? "Review and accept the service terms before continuing to payment." : "We couldn’t open secure payment. Please try again or contact Washd for help.");
			setCheckoutBusy(false);
		}
	}
	function PlanCard({ plan, compact = false }) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: `${plan.popular ? "membership-card popular" : "membership-card"}${compact ? " compact" : ""}`,
			children: [
				plan.popular && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "popular-tag",
					children: "Most popular"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: plan.name }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: plan.description }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "plan-price",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RM" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: plan.price_rm }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "/ month" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: plan.features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }),
					" ",
					feature
				] }, feature)) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "button wide",
					type: "button",
					disabled: authLoading || contentLoading,
					onClick: () => choosePlan(plan),
					children: [
						user ? "View plan details" : "Log in to subscribe",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 17 })
					]
				})
			]
		});
	}
	if (selectedPlanId && (authLoading || !user)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "member-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "account-loading",
			children: "Opening your selected plan…"
		})]
	});
	if (!selectedPlan) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "member-page plans-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "plans-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "kicker",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 14 }),
							" ",
							content.membership.eyebrow
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						"Choose your monthly",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "laundry rhythm." })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Select a plan, log in, then review every detail and optional add-on before payment." })
				]
			}),
			status === "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "checkout-banner",
				children: "Checkout was cancelled. No charge was made."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "membership-grid selection-grid",
				children: [plans.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanCard, { plan }, plan.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "membership-card custom-membership-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "custom-plan-icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { size: 25 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: content.customPlan.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: content.customPlan.body }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: content.customPlan.features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }),
							" ",
							feature
						] }, feature)) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							className: "button wide",
							href: "/#custom-enquiry",
							children: ["Send an enquiry ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 17 })]
						})
					]
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "member-page plan-detail-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "plan-detail-hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "plan-back",
					type: "button",
					onClick: () => {
						setSelectedPlanId("");
						setSelectedAddons([]);
						setTermsAccepted(false);
						window.history.pushState({}, "", "/plans");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " All plans"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "plan-detail-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kicker",
							children: "Your selected membership"
						}),
						selectedPlan.popular && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "detail-popular",
							children: "Most popular"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: selectedPlan.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selectedPlan.description }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "detail-price",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RM" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedPlan.price_rm }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "every month" })
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "plan-includes",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Everything included" }),
							selectedPlan.features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 17 }),
								" ",
								feature
							] }, feature)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { size: 17 }), " Fixed Mon / Wed / Fri building route"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { size: 17 }), " Live bag tracking in your dashboard"] })
						]
					})]
				})]
			}),
			status === "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "checkout-banner",
				children: "Checkout was cancelled. Your selection is still here."
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "checkout-banner error",
				role: "alert",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "addons-section",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "addons-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kicker",
						children: "À-la-carte add-ons"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Make the plan fit your week." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Optional monthly additions. Select only what you need and see your total before payment." })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "addons-grid",
					children: addons.map((addon, index) => {
						const checked = selectedAddons.includes(addon.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: checked ? "addon-card selected" : "addon-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked,
									onChange: () => setSelectedAddons((current) => checked ? current.filter((id) => id !== addon.id) : [...current, addon.id])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "addon-icon",
									children: index % 2 === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { size: 21 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { size: 21 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: addon.name }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: addon.description }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["+ RM ", addon.price_rm] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "/ month" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: checked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 15 }) : "+" })
								] })
							]
						}, addon.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "other-plans-section",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "kicker",
					children: "Compare before you decide"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Other memberships" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "other-plans-grid",
					children: [plans.filter((plan) => plan.id !== selectedPlan.id).map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanCard, {
						plan,
						compact: true
					}, plan.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "membership-card compact custom-membership-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "custom-plan-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { size: 23 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: content.customPlan.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: content.customPlan.body }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								className: "button wide",
								href: "/#custom-enquiry",
								children: ["Enquire ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "payment-review",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kicker",
						children: "Final review"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Your Washd membership" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "review-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [selectedPlan.name, " plan"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["RM ", selectedPlan.price_rm] })]
					}),
					selectedAddonRows.map((addon) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "review-line addon",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: addon.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["RM ", addon.price_rm] })]
					}, addon.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "review-total",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["RM ", total] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Renews monthly. Cancel with two weeks’ notice. Add-ons renew with your selected plan." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "payment-action",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 24 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Ready to subscribe?" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You’ll continue to Stripe to enter your card details securely." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "terms-acceptance",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: termsAccepted,
								onChange: (event) => setTermsAccepted(event.target.checked)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"I have reviewed and agree to the ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: "/terms",
									target: "_blank",
									children: "Service Terms"
								}),
								" and ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: "/service-information",
									target: "_blank",
									children: "Service Information"
								}),
								". ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: "/maklumat-perkhidmatan",
									target: "_blank",
									children: "Bahasa Malaysia"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "button wide gold-button",
							type: "button",
							disabled: checkoutBusy || !termsAccepted,
							onClick: () => void makePayment(),
							children: [
								checkoutBusy ? "Opening secure payment…" : "Make payment",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 18 })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Washd never stores your complete card number." })
					]
				})]
			})
		]
	});
}
//#endregion
export { PlansPage as default };
