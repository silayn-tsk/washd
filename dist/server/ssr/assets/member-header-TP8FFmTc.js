import { t as require_jsx_runtime } from "../index.js";
import { t as createLucideIcon } from "./createLucideIcon-C_ZiOjAb.js";
import { useAuth } from "./auth-provider-DRNPY7tG.js";
import { t as Link } from "./link-BeSeDncp.js";
/**
* @license lucide-react v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CalendarDays = createLucideIcon("calendar-days", [
	["path", {
		d: "M8 2v4",
		key: "1cmpym"
	}],
	["path", {
		d: "M16 2v4",
		key: "4m81vk"
	}],
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "4",
		rx: "2",
		key: "1hopcy"
	}],
	["path", {
		d: "M3 10h18",
		key: "8toen8"
	}],
	["path", {
		d: "M8 14h.01",
		key: "6423bh"
	}],
	["path", {
		d: "M12 14h.01",
		key: "1etili"
	}],
	["path", {
		d: "M16 14h.01",
		key: "1gbofw"
	}],
	["path", {
		d: "M8 18h.01",
		key: "lrp35t"
	}],
	["path", {
		d: "M12 18h.01",
		key: "mhygvu"
	}],
	["path", {
		d: "M16 18h.01",
		key: "kzsmim"
	}]
]);
//#endregion
//#region app/member-header.tsx
var import_jsx_runtime = require_jsx_runtime();
function MemberHeader() {
	const { user, loading } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "member-header",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			className: "brand",
			href: user ? "/account" : "/",
			"aria-label": user ? "Washd dashboard" : "Washd home",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["washd", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "brand-dot",
				children: "."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			"aria-label": "Member navigation",
			children: [
				user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "member-dashboard-link",
					href: "/account",
					children: "Dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					href: "/plans",
					children: "Plans"
				}),
				!loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "member-pill",
					href: user ? "/account" : "/login",
					children: user ? "My profile" : "Log in"
				})
			]
		})]
	});
}
//#endregion
export { CalendarDays as n, MemberHeader as t };
