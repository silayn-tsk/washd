import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as createLucideIcon } from "./createLucideIcon-C_ZiOjAb.js";
import { t as LogOut } from "./log-out-BXy5j2aR.js";
import { n as supabase, t as isSupabaseConfigured } from "./supabase-IjeCSyWw.js";
import { useAuth } from "./auth-provider-DRNPY7tG.js";
import { t as Link } from "./link-BeSeDncp.js";
import { i as mergeSiteContent, n as defaultPlans, r as defaultSiteContent, t as defaultAddons } from "./site-content-CrFfA5JE.js";
import { t as ArrowLeft } from "./arrow-left-DySEBrLm.js";
import { n as CircleCheck, t as ShieldAlert } from "./shield-alert-BXmRqX9v.js";
import { t as LoaderCircle } from "./loader-circle-BAPOc58U.js";
import { n as resolveAdminAccess, t as redirectForAdminMfa } from "./admin-access-DXAg9WWg.js";
import { t as LockKeyhole } from "./lock-keyhole-D2zGSO8b.js";
import { t as Save } from "./save-Bw2QtbKU.js";
//#region node_modules/lucide-react/dist/esm/icons/book-open-text.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var BookOpenText = createLucideIcon("book-open-text", [
	["path", {
		d: "M12 7v14",
		key: "1akyts"
	}],
	["path", {
		d: "M16 12h2",
		key: "7q9ll5"
	}],
	["path", {
		d: "M16 8h2",
		key: "msurwy"
	}],
	["path", {
		d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
		key: "ruj8y"
	}],
	["path", {
		d: "M6 12h2",
		key: "32wvfc"
	}],
	["path", {
		d: "M6 8h2",
		key: "30oboj"
	}]
]);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ExternalLink = createLucideIcon("external-link", [
	["path", {
		d: "M15 3h6v6",
		key: "1q9fwt"
	}],
	["path", {
		d: "M10 14 21 3",
		key: "gplh6r"
	}],
	["path", {
		d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
		key: "a6xqqp"
	}]
]);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Plus = createLucideIcon("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Trash2 = createLucideIcon("trash-2", [
	["path", {
		d: "M10 11v6",
		key: "nco0om"
	}],
	["path", {
		d: "M14 11v6",
		key: "outv1u"
	}],
	["path", {
		d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
		key: "miytrc"
	}],
	["path", {
		d: "M3 6h18",
		key: "d0wm0j"
	}],
	["path", {
		d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
		key: "e791ji"
	}]
]);
//#endregion
//#region app/admin/page.tsx
var import_jsx_runtime = require_jsx_runtime();
var sectionLabels = {
	brand: "Brand",
	hero: "Hero",
	schedule: "Weekly schedule",
	burden: "Customer problem",
	heritage: "Since 1964 story",
	routine: "How it works",
	services: "Services",
	membership: "Membership introduction",
	customPlan: "Custom plan",
	safety: "Safety promise",
	benefits: "Member benefits",
	building: "Building partners",
	faq: "Frequently asked questions",
	enquiry: "Custom-plan enquiry",
	finalCta: "Final call to action",
	contact: "Contact details"
};
var policyLabels = {
	privacy: "Privacy notice",
	terms: "Service terms",
	serviceInformation: "Service information",
	careGuarantee: "Care guarantee"
};
var ownerEmail = "washdmy@gmail.com";
function fieldLabel(value) {
	return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase());
}
function setNestedValue(source, path, value) {
	const copy = structuredClone(source);
	let cursor = copy;
	path.slice(0, -1).forEach((part) => {
		cursor = cursor[part];
	});
	cursor[path[path.length - 1]] = value;
	return copy;
}
function ContentFields({ value, path, onChange }) {
	if (Array.isArray(value)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "admin-array",
		children: value.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-array-item",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "admin-item-number",
				children: index + 1
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentFields, {
				value: item,
				path: [...path, index],
				onChange
			})]
		}, index))
	});
	if (value && typeof value === "object") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "admin-fields",
		children: Object.entries(value).map(([key, child]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentFields, {
			value: child,
			path: [...path, key],
			onChange
		}, key))
	});
	const key = String(path[path.length - 1]);
	const label = fieldLabel(key);
	if (typeof value === "boolean") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "admin-checkbox",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked: value,
			onChange: (event) => onChange(path, event.target.checked)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
	if (typeof value === "number") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "admin-field",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			value,
			onChange: (event) => onChange(path, Number(event.target.value))
		})]
	});
	const text = String(value ?? "");
	const multiline = text.length > 64 || [
		"body",
		"intro",
		"footer"
	].includes(key);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: multiline ? "admin-field full" : "admin-field",
		"data-field": key,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), multiline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value: text,
			onChange: (event) => onChange(path, event.target.value)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: text,
			onChange: (event) => onChange(path, event.target.value)
		})]
	});
}
function PolicyEditor({ policy, policyKey, onChange }) {
	const basePath = ["policies", policyKey];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "admin-policy-workspace",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "admin-section-card admin-policy-hero-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "admin-policy-guidance",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpenText, { size: 19 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Page introduction" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Edit the text at the top of this policy page. Every field below is published when you select “Save all changes”." })] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "admin-fields",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "admin-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Eyebrow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: policy.eyebrow,
								onChange: (event) => onChange([...basePath, "eyebrow"], event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "admin-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Page title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: policy.title,
								onChange: (event) => onChange([...basePath, "title"], event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "admin-field full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Introduction" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: policy.intro,
								onChange: (event) => onChange([...basePath, "intro"], event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "admin-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last updated" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: policy.lastUpdated,
								onChange: (event) => onChange([...basePath, "lastUpdated"], event.target.value)
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "admin-policy-sections-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Page content" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Policy sections" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Edit each visible heading and its complete content directly." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onChange([...basePath, "sections"], [...policy.sections, {
						heading: "New section",
						body: "Add the policy content here."
					}]),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), " Add section"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "admin-policy-section-list",
				children: policy.sections.map((section, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "admin-policy-section",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-policy-section-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Section ", index + 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-label": `Remove section ${index + 1}`,
								onClick: () => onChange([...basePath, "sections"], policy.sections.filter((_, sectionIndex) => sectionIndex !== index)),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 15 }), " Remove"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "admin-field full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Section heading" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: section.heading,
								onChange: (event) => onChange([
									...basePath,
									"sections",
									index,
									"heading"
								], event.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "admin-field full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Section content" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: section.body,
								onChange: (event) => onChange([
									...basePath,
									"sections",
									index,
									"body"
								], event.target.value)
							})]
						})
					]
				}, index))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "admin-policy-token-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Automatic details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Use ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{email}" }),
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{phone}" }),
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{serviceArea}" }),
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{businessName}" }),
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{website}" }),
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{plans}" }),
					" or ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{addons}" }),
					" where live business information should appear. Start list items with a hyphen."
				] })]
			})
		]
	});
}
function AdminPage() {
	const { user, loading: authLoading } = useAuth();
	const [allowed, setAllowed] = (0, import_react.useState)(null);
	const [content, setContent] = (0, import_react.useState)(defaultSiteContent);
	const [plans, setPlans] = (0, import_react.useState)(defaultPlans);
	const [addons, setAddons] = (0, import_react.useState)(defaultAddons);
	const [activeSection, setActiveSection] = (0, import_react.useState)("brand");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const activePolicyKey = activeSection.startsWith("policy-") ? activeSection.slice(7) : null;
	const activeTitle = activePolicyKey ? policyLabels[activePolicyKey] : activeSection === "plans" ? "Membership plans" : activeSection === "addons" ? "À-la-carte add-ons" : sectionLabels[activeSection];
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) window.location.replace("/login?next=/admin");
		if (!user || !isSupabaseConfigured) return;
		Promise.all([
			resolveAdminAccess(),
			supabase.from("site_content").select("content").eq("key", "main").maybeSingle(),
			supabase.from("plans").select("id, name, description, price_rm, popular, features, sort_order, stripe_price_id").eq("active", true).order("sort_order"),
			supabase.from("plan_addons").select("id, name, description, price_rm, active, sort_order, stripe_price_id").eq("active", true).order("sort_order")
		]).then(([access, contentResult, plansResult, addonsResult]) => {
			if (access === "mfa") {
				redirectForAdminMfa("/admin");
				return;
			}
			const canEdit = access === "allowed";
			setAllowed(canEdit);
			if (!canEdit) return;
			if (contentResult.data?.content) setContent(mergeSiteContent(contentResult.data.content));
			if (plansResult.data?.length) setPlans(plansResult.data);
			if (addonsResult.data?.length) setAddons(addonsResult.data);
		});
	}, [user, authLoading]);
	function updateContent(path, value) {
		setContent((current) => setNestedValue(current, path, value));
		setNotice("");
	}
	function updatePlan(index, key, value) {
		setPlans((current) => current.map((plan, planIndex) => planIndex === index ? {
			...plan,
			[key]: value
		} : plan));
		setNotice("");
	}
	function updateAddon(index, key, value) {
		setAddons((current) => current.map((addon, addonIndex) => addonIndex === index ? {
			...addon,
			[key]: value
		} : addon));
		setNotice("");
	}
	async function saveEverything() {
		if (!user || !allowed) return;
		setSaving(true);
		setError("");
		setNotice("");
		if ((await supabase.from("site_content").update({
			content,
			updated_by: user.id,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("key", "main")).error) {
			setError("The website content could not be saved. Please try again.");
			setSaving(false);
			return;
		}
		const { data, error: planError } = await supabase.functions.invoke("admin-save-plans", { body: {
			plans: plans.map((plan) => ({
				id: plan.id,
				name: plan.name,
				description: plan.description,
				price_rm: plan.price_rm,
				popular: plan.popular,
				features: plan.features
			})),
			addons: addons.map((addon) => ({
				id: addon.id,
				name: addon.name,
				description: addon.description,
				price_rm: addon.price_rm,
				active: addon.active
			}))
		} });
		setSaving(false);
		if (planError || data?.error) {
			setError("Website copy was saved, but the plans could not be synced with Stripe. No plan price was changed at checkout.");
			return;
		}
		if (data?.plans) setPlans(data.plans);
		if (data?.addons) setAddons(data.addons);
		setNotice("Saved. The public website and Stripe plan prices are now in sync.");
	}
	if (authLoading || user && allowed === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-state",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Opening the Washd editor…" })]
	});
	if (!user) return null;
	if (!allowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-state",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 42 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Admin access required" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Sign in with the Washd owner account (",
				ownerEmail,
				") to edit the website."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "deck-button",
				href: "/",
				children: "Back to website"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "admin-link-button",
				type: "button",
				onClick: async () => {
					await supabase.auth.signOut();
					window.location.assign("/login?next=/admin");
				},
				children: "Use another account"
			})] })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "admin-header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				className: "admin-brand",
				href: "/",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "admin-wordmark",
					children: ["washd", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "." })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "studio" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "admin-secure",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { size: 13 }), " Owner only"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: "admin-preview",
				href: "/",
				target: "_blank",
				children: ["View website ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 15 })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "admin-save",
				type: "button",
				disabled: saving,
				onClick: () => void saveEverything(),
				children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					className: "spin",
					size: 17
				}), " Saving…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 17 }), " Save all changes"] })
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-layout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "admin-sidebar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "admin-sidebar-intro",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Control room" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Website studio" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Content, commerce and operations." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "admin-back",
						href: "/",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 15 }), " Back to site"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Website content" }),
					Object.keys(sectionLabels).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: activeSection === key ? "active" : "",
						type: "button",
						onClick: () => setActiveSection(key),
						children: sectionLabels[key]
					}, key)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Policies" }),
					Object.keys(policyLabels).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: activeSection === `policy-${key}` ? "active" : "",
						type: "button",
						onClick: () => setActiveSection(`policy-${key}`),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpenText, { size: 14 }),
							" ",
							policyLabels[key]
						]
					}, key)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Commerce" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: activeSection === "plans" ? "active" : "",
						type: "button",
						onClick: () => setActiveSection("plans"),
						children: "Membership plans"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: activeSection === "addons" ? "active" : "",
						type: "button",
						onClick: () => setActiveSection("addons"),
						children: "À-la-carte add-ons"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Operations" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "admin-operation-link",
						href: "/admin/tracking",
						children: ["Member tracking ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↗" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "admin-operation-link",
						href: "/admin/enquiries",
						children: ["Enquiry inbox ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↗" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "admin-operation-link",
						href: "/admin/payments",
						children: ["Payment health ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↗" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "admin-operation-link",
						href: "/admin/security",
						children: ["Security & MFA ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↗" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "admin-logout",
						type: "button",
						onClick: async () => {
							await supabase.auth.signOut();
							window.location.assign("/");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 15 }), " Log out"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "admin-editor",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "admin-editor-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-editor-title",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Editing" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: activeTitle }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: activePolicyKey ? "Edit the complete English policy page, section by section." : "Shape the public Washd experience, then review and publish when ready." })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-workspace-status",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Publishing mode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " Review, then save"] })]
						})]
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "admin-panel-transition",
						children: activePolicyKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyEditor, {
							policy: content.policies[activePolicyKey],
							policyKey: activePolicyKey,
							onChange: updateContent
						}) : activeSection === "plans" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "admin-plan-list",
							children: plans.map((plan, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "admin-plan-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "admin-plan-heading",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Plan ", index + 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "admin-checkbox",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: plan.popular,
												onChange: (event) => updatePlan(index, "popular", event.target.checked)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Most popular" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "admin-fields",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "admin-field",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: plan.name,
													onChange: (event) => updatePlan(index, "name", event.target.value)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "admin-field",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly price (RM)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: 1,
													max: 5e3,
													value: plan.price_rm,
													onChange: (event) => updatePlan(index, "price_rm", Number(event.target.value))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "admin-field full",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													value: plan.description,
													onChange: (event) => updatePlan(index, "description", event.target.value)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "admin-field full",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Features (one per line)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													value: plan.features.join("\n"),
													onChange: (event) => updatePlan(index, "features", event.target.value.split("\n").filter(Boolean))
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Changing the price creates a matching monthly price in Stripe when you save." })
								]
							}, plan.id))
						}) : activeSection === "addons" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "admin-plan-list",
							children: addons.map((addon, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "admin-plan-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "admin-plan-heading",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Add-on ", index + 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "admin-checkbox",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: addon.active,
												onChange: (event) => updateAddon(index, "active", event.target.checked)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Available" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "admin-fields",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "admin-field",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: addon.name,
													onChange: (event) => updateAddon(index, "name", event.target.value)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "admin-field",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly price (RM)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: 1,
													max: 5e3,
													value: addon.price_rm,
													onChange: (event) => updateAddon(index, "price_rm", Number(event.target.value))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "admin-field full",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													value: addon.description,
													onChange: (event) => updateAddon(index, "description", event.target.value)
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Price changes create a matching recurring Stripe price when you save." })
								]
							}, addon.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "admin-section-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentFields, {
								value: content[activeSection],
								path: [activeSection],
								onChange: updateContent
							})
						})
					}, activeSection)
				]
			})]
		})]
	});
}
//#endregion
export { AdminPage as default };
