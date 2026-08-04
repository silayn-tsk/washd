import { t as require_jsx_runtime, w as __toESM, y as require_react } from "../index.js";
//#region app/turnstile-widget.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
function TurnstileWidget({ onToken, resetSignal, action }) {
	const container = (0, import_react.useRef)(null);
	const widgetId = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		if (!turnstileSiteKey || !container.current) return;
		let cancelled = false;
		const render = () => {
			if (cancelled || !container.current || !window.turnstile || widgetId.current) return;
			widgetId.current = window.turnstile.render(container.current, {
				sitekey: turnstileSiteKey,
				action,
				theme: "light",
				size: "flexible",
				callback: (token) => onToken(token),
				"expired-callback": () => onToken(""),
				"error-callback": () => onToken("")
			});
		};
		const existing = document.getElementById("washd-turnstile-script");
		if (window.turnstile) render();
		else if (existing) existing.addEventListener("load", render, { once: true });
		else {
			const script = document.createElement("script");
			script.id = "washd-turnstile-script";
			script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
			script.async = true;
			script.defer = true;
			script.addEventListener("load", render, { once: true });
			document.head.appendChild(script);
		}
		return () => {
			cancelled = true;
			existing?.removeEventListener("load", render);
			if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
			widgetId.current = "";
		};
	}, [action, onToken]);
	(0, import_react.useEffect)(() => {
		if (resetSignal > 0 && widgetId.current && window.turnstile) {
			window.turnstile.reset(widgetId.current);
			onToken("");
		}
	}, [resetSignal, onToken]);
	if (!turnstileSiteKey) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "turnstile-wrap",
		ref: container,
		"aria-label": "Security verification"
	});
}
//#endregion
export { turnstileSiteKey as n, TurnstileWidget as t };
