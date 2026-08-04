import { t as require_jsx_runtime } from "../index.js";
import { t as Link } from "./link-BeSeDncp.js";
import { t as useSiteContent } from "./use-site-content-ltrE_RuD.js";
import { t as ArrowLeft } from "./arrow-left-DySEBrLm.js";
import { t as Mail } from "./mail-DB7CV6wY.js";
//#region app/business-disclosure.tsx
var import_jsx_runtime = require_jsx_runtime();
function BusinessDisclosure({ locale = "en" }) {
	const { content } = useSiteContent();
	const contact = content.contact;
	const serviceArea = contact.serviceArea === "Selected residential buildings in Kuala Lumpur" ? locale === "ms" ? "Bangunan kediaman terpilih di Kuala Lumpur" : locale === "zh" ? "吉隆坡指定住宅大楼" : locale === "ko" ? "쿠알라룸푸르 내 지정 주거 건물" : contact.serviceArea : contact.serviceArea;
	const label = locale === "ms" ? "Penyedia perkhidmatan" : locale === "zh" ? "服务提供者" : locale === "ko" ? "서비스 제공자" : "Service provider";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "business-disclosure",
		"aria-label": label,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [contact.legalName || "Washd", contact.registrationNumber && ` · ${contact.registrationNumber}`] }),
			contact.registeredAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: contact.registeredAddress }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				contact.email,
				" · ",
				contact.phoneDisplay
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: serviceArea })
		]
	});
}
//#endregion
//#region app/legal-shell.tsx
var languageLabels = {
	en: "English",
	ms: "Bahasa Malaysia",
	zh: "中文",
	ko: "한국어"
};
var languageSuffix = {
	en: "",
	ms: "/bm",
	zh: "/zh",
	ko: "/ko"
};
var policyKeys = {
	"/privacy": "privacy",
	"/terms": "terms",
	"/service-information": "serviceInformation",
	"/care-guarantee": "careGuarantee"
};
function linkText(text, phone, whatsappNumber) {
	return text.split(/(https?:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b0\d{2}-\d{3}\s?\d{4}\b)/g).filter(Boolean).map((part, index) => {
		if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(part)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: `mailto:${part}`,
			children: part
		}, `${part}-${index}`);
		if (part === phone) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: `https://wa.me/${whatsappNumber}`,
			children: part
		}, `${part}-${index}`);
		if (/^https?:\/\//.test(part)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: part,
			children: part
		}, `${part}-${index}`);
		return part;
	});
}
function PolicyCopy({ body, phone, whatsappNumber }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "managed-policy-copy",
		children: body.split(/\n\s*\n/).filter(Boolean).map((block, index) => {
			const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
			if (lines.length && lines.every((line) => line.startsWith("- "))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: lines.map((line, lineIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: linkText(line.slice(2), phone, whatsappNumber) }, lineIndex)) }, index);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: lines.map((line, lineIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [lineIndex > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}), linkText(line, phone, whatsappNumber)] }, lineIndex)) }, index);
		})
	});
}
function ManagedPolicyBody({ policy, content, plans, addons }) {
	const replacements = {
		businessName: content.contact.legalName || "Washd",
		website: "https://washd-my-86c6d.web.app",
		email: content.contact.email,
		phone: content.contact.phoneDisplay,
		serviceArea: content.contact.serviceArea,
		plans: plans.map((plan) => `- ${plan.name} — RM ${plan.price_rm} per month: ${plan.description}`).join("\n"),
		addons: addons.map((addon) => `- ${addon.name} — RM ${addon.price_rm} per month`).join("\n")
	};
	const resolve = (value) => value.replace(/\{(businessName|website|email|phone|serviceArea|plans|addons)\}/g, (_, key) => replacements[key]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: policy.sections.map((section, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: section.heading }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyCopy, {
		body: resolve(section.body),
		phone: content.contact.phoneDisplay,
		whatsappNumber: content.contact.whatsappNumber
	})] }, `${section.heading}-${index}`)) });
}
function LegalShell({ eyebrow, title, intro, children, locale = "en", policyPath }) {
	const { content, plans, addons } = useSiteContent();
	const managedPolicy = locale === "en" ? content.policies[policyKeys[policyPath]] : null;
	const backLabel = locale === "ms" ? "Kembali ke laman web" : locale === "zh" ? "返回网站" : locale === "ko" ? "웹사이트로 돌아가기" : "Back to website";
	const updatedLabel = locale === "ms" ? "Kemas kini terakhir 4 Ogos 2026" : locale === "zh" ? "最后更新：2026年8月4日" : locale === "ko" ? "최종 업데이트: 2026년 8월 4일" : managedPolicy?.lastUpdated || "Last updated 4 August 2026";
	const displayedEyebrow = managedPolicy?.eyebrow || eyebrow;
	const displayedTitle = managedPolicy?.title || title;
	const displayedIntro = managedPolicy?.intro || intro;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "legal-page",
		lang: locale === "zh" ? "zh-Hans" : locale,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "legal-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "deck-brand",
					href: "/",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "deck-wordmark",
						children: ["washd", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "." })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					href: "/",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }),
						" ",
						backLabel
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "legal-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "deck-kicker",
						children: displayedEyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: displayedTitle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: displayedIntro }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: updatedLabel })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "legal-language",
				"aria-label": "Policy language",
				children: Object.keys(languageLabels).map((language) => language === locale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					"aria-current": "page",
					children: languageLabels[language]
				}, language) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					href: `${policyPath}${languageSuffix[language]}`,
					children: languageLabels[language]
				}, language))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "legal-content",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessDisclosure, { locale }), managedPolicy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedPolicyBody, {
					policy: managedPolicy,
					content,
					plans,
					addons
				}) : children]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "legal-footer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "washd." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Laundry, handled." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "mailto:washdmy@gmail.com",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 15 }), " washdmy@gmail.com"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: "/privacy",
							children: "Privacy notice"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: "/terms",
							children: "Service terms"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: "/service-information",
							children: "Service information"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: "/care-guarantee",
							children: "Care guarantee"
						})
					] })
				]
			})
		]
	});
}
//#endregion
export { LegalShell };
