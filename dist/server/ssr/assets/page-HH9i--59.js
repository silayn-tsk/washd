import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as createLucideIcon } from "./createLucideIcon-C_ZiOjAb.js";
import { n as supabase } from "./supabase-IjeCSyWw.js";
import { useAuth } from "./auth-provider-DRNPY7tG.js";
import { t as Link } from "./link-BeSeDncp.js";
import { t as ArrowLeft } from "./arrow-left-DySEBrLm.js";
import { n as CircleCheck, t as ShieldAlert } from "./shield-alert-BXmRqX9v.js";
import { t as LoaderCircle } from "./loader-circle-BAPOc58U.js";
import { t as Mail } from "./mail-DB7CV6wY.js";
import { n as resolveAdminAccess, t as redirectForAdminMfa } from "./admin-access-DXAg9WWg.js";
//#region node_modules/lucide-react/dist/esm/icons/inbox.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Inbox = createLucideIcon("inbox", [["polyline", {
	points: "22 12 16 12 14 15 10 15 8 12 2 12",
	key: "o97t9d"
}], ["path", {
	d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
	key: "oot6mr"
}]]);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MessageSquareText = createLucideIcon("message-square-text", [
	["path", {
		d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
		key: "18887p"
	}],
	["path", {
		d: "M7 11h10",
		key: "1twpyw"
	}],
	["path", {
		d: "M7 15h6",
		key: "d9of3u"
	}],
	["path", {
		d: "M7 7h8",
		key: "af5zfr"
	}]
]);
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Phone = createLucideIcon("phone", [["path", {
	d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
	key: "9njp5v"
}]]);
//#endregion
//#region app/admin/enquiries/page.tsx
var import_jsx_runtime = require_jsx_runtime();
var statusLabels = {
	new: "New",
	contacted: "Contacted",
	closed: "Closed"
};
function AdminEnquiriesPage() {
	const { user, loading: authLoading } = useAuth();
	const [allowed, setAllowed] = (0, import_react.useState)(null);
	const [enquiries, setEnquiries] = (0, import_react.useState)([]);
	const [selectedId, setSelectedId] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const loadEnquiries = (0, import_react.useCallback)(async () => {
		setLoading(true);
		const { data, error: loadError } = await supabase.from("contact_requests").select("id, name, email, phone, organisation, interest, message, status, created_at").order("created_at", { ascending: false });
		setLoading(false);
		if (loadError) {
			setError("Enquiries could not be loaded. Please refresh and try again.");
			return;
		}
		const rows = data || [];
		setEnquiries(rows);
		if (rows[0]) setSelectedId((current) => current || rows[0].id);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) window.location.replace("/login?next=/admin/enquiries");
		if (!user) return;
		resolveAdminAccess().then((access) => {
			if (access === "mfa") {
				redirectForAdminMfa("/admin/enquiries");
				return;
			}
			const canEdit = access === "allowed";
			setAllowed(canEdit);
			if (canEdit) loadEnquiries();
			else setLoading(false);
		});
	}, [
		user,
		authLoading,
		loadEnquiries
	]);
	const selected = (0, import_react.useMemo)(() => enquiries.find((item) => item.id === selectedId), [enquiries, selectedId]);
	const newCount = enquiries.filter((item) => item.status === "new").length;
	async function changeStatus(status) {
		if (!selected) return;
		setSaving(true);
		setNotice("");
		setError("");
		const { error: updateError } = await supabase.from("contact_requests").update({ status }).eq("id", selected.id);
		setSaving(false);
		if (updateError) {
			setError("The status could not be updated. Please try again.");
			return;
		}
		setEnquiries((current) => current.map((item) => item.id === selected.id ? {
			...item,
			status
		} : item));
		setNotice(`${selected.name} is now marked ${statusLabels[status].toLowerCase()}.`);
	}
	if (authLoading || user && allowed === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-state",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Opening enquiry inbox…" })]
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
		className: "admin-page enquiries-admin-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "admin-header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "admin-brand",
				href: "/admin",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "washd. enquiries" })
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				className: "admin-preview",
				href: "/admin",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 15 }), " Website editor"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "admin-preview",
				href: "/admin/tracking",
				children: "Member tracking"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "enquiry-admin-layout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "enquiry-admin-list",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "enquiry-inbox-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { size: 17 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [newCount, " new"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [enquiries.length, " total"] })
					]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "enquiry-empty",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: "spin",
						size: 20
					}), " Loading…"]
				}) : enquiries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "enquiry-empty",
					children: "No enquiries yet."
				}) : enquiries.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: selectedId === item.id ? "active" : "",
					type: "button",
					onClick: () => {
						setSelectedId(item.id);
						setNotice("");
						setError("");
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `enquiry-status ${item.status}`,
							children: statusLabels[item.status]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.organisation }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: new Date(item.created_at).toLocaleDateString("en-MY", {
							day: "numeric",
							month: "short",
							year: "numeric"
						}) })
					]
				}, item.id))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "enquiry-admin-detail",
				children: !selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "enquiry-empty-detail",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquareText, { size: 36 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "No enquiry selected" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "New custom-plan enquiries will appear here." })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kicker",
						children: "Custom-plan enquiry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "enquiry-detail-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: selected.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							selected.organisation,
							" · ",
							selected.interest
						] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `enquiry-status ${selected.status}`,
							children: statusLabels[selected.status]
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "enquiry-detail-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "enquiry-contact-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `mailto:${selected.email}?subject=${encodeURIComponent("Your Washd custom plan enquiry")}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 17 }),
										" ",
										selected.email
									]
								}), selected.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${selected.phone}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { size: 17 }),
										" ",
										selected.phone
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "enquiry-message",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Customer request" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selected.message })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "enquiry-meta",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Received" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: new Date(selected.created_at).toLocaleString("en-MY", {
									dateStyle: "long",
									timeStyle: "short"
								}) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "enquiry-status-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Update follow-up status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: [
									"new",
									"contacted",
									"closed"
								].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: selected.status === status ? "active" : "",
									disabled: saving || selected.status === status,
									type: "button",
									onClick: () => void changeStatus(status),
									children: statusLabels[status]
								}, status)) })]
							})
						]
					})
				] })
			})]
		})]
	});
}
//#endregion
export { AdminEnquiriesPage as default };
