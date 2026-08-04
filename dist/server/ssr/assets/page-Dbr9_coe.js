import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
import { t as Clock3 } from "./clock-3-MO75UB1Z.js";
import { t as PackageCheck } from "./package-check-BNDVGQv6.js";
import { n as supabase } from "./supabase-IjeCSyWw.js";
import { useAuth } from "./auth-provider-DRNPY7tG.js";
import { t as Link } from "./link-BeSeDncp.js";
import { t as ArrowLeft } from "./arrow-left-DySEBrLm.js";
import { n as CircleCheck, t as ShieldAlert } from "./shield-alert-BXmRqX9v.js";
import { t as LoaderCircle } from "./loader-circle-BAPOc58U.js";
import { n as resolveAdminAccess, t as redirectForAdminMfa } from "./admin-access-DXAg9WWg.js";
import { t as Save } from "./save-Bw2QtbKU.js";
//#region app/admin/tracking/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function defaultReturnDate() {
	const date = new Date(Date.now() + 2880 * 60 * 1e3);
	date.setHours(17, 30, 0, 0);
	return (/* @__PURE__ */ new Date(date.getTime() - date.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}
function AdminTrackingPage() {
	const { user, loading: authLoading } = useAuth();
	const [allowed, setAllowed] = (0, import_react.useState)(null);
	const [members, setMembers] = (0, import_react.useState)([]);
	const [bags, setBags] = (0, import_react.useState)([]);
	const [collections, setCollections] = (0, import_react.useState)([]);
	const [selectedId, setSelectedId] = (0, import_react.useState)("");
	const [bagId, setBagId] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("received");
	const [collectionDue, setCollectionDue] = (0, import_react.useState)(defaultReturnDate());
	const [location, setLocation] = (0, import_react.useState)("Residence lobby");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const loadOperations = (0, import_react.useCallback)(async () => {
		const [memberResult, bagResult, collectionResult] = await Promise.all([
			supabase.from("profiles").select("id, member_id, name, email, unit").order("member_id"),
			supabase.from("bags").select("user_id, id, status, updated_at").order("updated_at", { ascending: false }),
			supabase.from("collections").select("user_id, due, location, status").gte("due", (/* @__PURE__ */ new Date(Date.now() - 1440 * 60 * 1e3)).toISOString()).order("due")
		]);
		setMembers(memberResult.data || []);
		setBags(bagResult.data || []);
		setCollections(collectionResult.data || []);
		if (memberResult.data?.[0]) setSelectedId((current) => current || memberResult.data[0].id);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) window.location.replace("/login?next=/admin/tracking");
		if (!user) return;
		resolveAdminAccess().then((access) => {
			if (access === "mfa") {
				redirectForAdminMfa("/admin/tracking");
				return;
			}
			const canEdit = access === "allowed";
			setAllowed(canEdit);
			if (canEdit) loadOperations();
		});
	}, [
		user,
		authLoading,
		loadOperations
	]);
	const selectedMember = members.find((member) => member.id === selectedId);
	const memberBag = (0, import_react.useMemo)(() => bags.find((bag) => bag.user_id === selectedId), [bags, selectedId]);
	const memberCollection = (0, import_react.useMemo)(() => collections.find((item) => item.user_id === selectedId), [collections, selectedId]);
	(0, import_react.useEffect)(() => {
		if (!selectedMember) return;
		queueMicrotask(() => {
			setBagId(memberBag?.id || `WSHD-${selectedMember.member_id.replace(/\D/g, "").padStart(2, "0")}`);
			setStatus(memberBag?.status || "received");
			setLocation(memberCollection?.location || selectedMember.unit || "Residence lobby");
			if (memberCollection?.due) {
				const date = new Date(memberCollection.due);
				setCollectionDue((/* @__PURE__ */ new Date(date.getTime() - date.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16));
			} else setCollectionDue(defaultReturnDate());
		});
	}, [
		selectedMember,
		memberBag,
		memberCollection
	]);
	async function saveTracking() {
		if (!selectedMember) return;
		setBusy(true);
		setError("");
		setNotice("");
		const { data, error: updateError } = await supabase.functions.invoke("admin-update-tracking", { body: {
			memberId: selectedMember.id,
			bagId,
			status,
			collectionDue: new Date(collectionDue).toISOString(),
			location
		} });
		setBusy(false);
		if (updateError || data?.error) {
			setError(data?.error || "Tracking could not be updated.");
			return;
		}
		setNotice(`${selectedMember.member_id} now shows “${status}” in the live dashboard.`);
		await loadOperations();
	}
	if (authLoading || user && allowed === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-state",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Opening member operations…" })]
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
		className: "admin-page tracking-admin-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "admin-header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "admin-brand",
				href: "/admin",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "washd. operations" })
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				className: "admin-preview",
				href: "/admin",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 15 }), " Website editor"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "admin-save",
				type: "button",
				disabled: busy || !selectedMember,
				onClick: () => void saveTracking(),
				children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					className: "spin",
					size: 17
				}), " Updating…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 17 }), " Update live tracking"] })
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "tracking-admin-layout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "member-operations-list",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Members" }), members.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: selectedId === member.id ? "active" : "",
					type: "button",
					onClick: () => {
						setSelectedId(member.id);
						setNotice("");
						setError("");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: member.member_id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: member.name || member.email })]
				}, member.id))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "tracking-admin-editor",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kicker",
						children: "Live member tracking"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: selectedMember?.name || "Choose a member" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						selectedMember?.member_id,
						" · ",
						selectedMember?.email
					] }),
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
					selectedMember && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tracking-admin-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tracking-admin-current",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { size: 28 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Currently visible" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: memberBag?.status || "No bag yet" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: memberBag?.id || "Create the first tracking cycle below" })
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "admin-fields",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "admin-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bag ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: bagId,
											onChange: (event) => setBagId(event.target.value.toUpperCase())
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "admin-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: status,
											onChange: (event) => setStatus(event.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "received",
													children: "Bag received"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "washing",
													children: "Cleaning"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "finishing",
													children: "Finishing"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "ready",
													children: "Ready for collection"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "admin-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Expected return" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "datetime-local",
											value: collectionDue,
											onChange: (event) => setCollectionDue(event.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "admin-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Collection point" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: location,
											onChange: (event) => setLocation(event.target.value)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tracking-admin-hint",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { size: 17 }), " Saving updates the member dashboard instantly and adds a timestamped event to the bag history."]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { AdminTrackingPage as default };
