"use client";

import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BusinessDisclosure } from "./business-disclosure";
import { useSiteContent } from "./use-site-content";
import type { PolicyPageContent, SiteContent } from "@/lib/site-content";

type LegalLocale = "en" | "ms" | "zh" | "ko";

const languageLabels: Record<LegalLocale, string> = { en: "English", ms: "Bahasa Malaysia", zh: "中文", ko: "한국어" };
const languageSuffix: Record<LegalLocale, string> = { en: "", ms: "/bm", zh: "/zh", ko: "/ko" };
const policyKeys: Record<"/privacy" | "/terms" | "/service-information" | "/care-guarantee", keyof SiteContent["policies"]> = {
  "/privacy": "privacy",
  "/terms": "terms",
  "/service-information": "serviceInformation",
  "/care-guarantee": "careGuarantee",
};

function linkText(text: string, phone: string, whatsappNumber: string): ReactNode[] {
  return text.split(/(https?:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b0\d{2}-\d{3}\s?\d{4}\b)/g).filter(Boolean).map((part, index) => {
    if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(part)) return <a key={`${part}-${index}`} href={`mailto:${part}`}>{part}</a>;
    if (part === phone) return <a key={`${part}-${index}`} href={`https://wa.me/${whatsappNumber}`}>{part}</a>;
    if (/^https?:\/\//.test(part)) return <a key={`${part}-${index}`} href={part}>{part}</a>;
    return part;
  });
}

function PolicyCopy({ body, phone, whatsappNumber }: { body: string; phone: string; whatsappNumber: string }) {
  return <div className="managed-policy-copy">{body.split(/\n\s*\n/).filter(Boolean).map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length && lines.every((line) => line.startsWith("- "))) {
      return <ul key={index}>{lines.map((line, lineIndex) => <li key={lineIndex}>{linkText(line.slice(2), phone, whatsappNumber)}</li>)}</ul>;
    }
    return <p key={index}>{lines.map((line, lineIndex) => <span key={lineIndex}>{lineIndex > 0 && <br />}{linkText(line, phone, whatsappNumber)}</span>)}</p>;
  })}</div>;
}

function ManagedPolicyBody({ policy, content, plans, addons }: { policy: PolicyPageContent; content: SiteContent; plans: Array<{ name: string; price_rm: number; description: string }>; addons: Array<{ name: string; price_rm: number }> }) {
  const replacements: Record<string, string> = {
    businessName: content.contact.legalName || "Washd",
    website: "https://washd-my-86c6d.web.app",
    email: content.contact.email,
    phone: content.contact.phoneDisplay,
    serviceArea: content.contact.serviceArea,
    plans: plans.map((plan) => `- ${plan.name} — RM ${plan.price_rm} per month: ${plan.description}`).join("\n"),
    addons: addons.map((addon) => `- ${addon.name} — RM ${addon.price_rm} per month`).join("\n"),
  };
  const resolve = (value: string) => value.replace(/\{(businessName|website|email|phone|serviceArea|plans|addons)\}/g, (_, key: string) => replacements[key]);
  return <>{policy.sections.map((section, index) => <section key={`${section.heading}-${index}`}><h2>{section.heading}</h2><PolicyCopy body={resolve(section.body)} phone={content.contact.phoneDisplay} whatsappNumber={content.contact.whatsappNumber} /></section>)}</>;
}

export function LegalShell({ eyebrow, title, intro, children, locale = "en", policyPath }: { eyebrow: string; title: string; intro: string; children: React.ReactNode; locale?: LegalLocale; policyPath: "/privacy" | "/terms" | "/service-information" | "/care-guarantee" }) {
  const { content, plans, addons } = useSiteContent();
  const managedPolicy = locale === "en" ? content.policies[policyKeys[policyPath]] : null;
  const backLabel = locale === "ms" ? "Kembali ke laman web" : locale === "zh" ? "返回网站" : locale === "ko" ? "웹사이트로 돌아가기" : "Back to website";
  const updatedLabel = locale === "ms" ? "Kemas kini terakhir 4 Ogos 2026" : locale === "zh" ? "最后更新：2026年8月4日" : locale === "ko" ? "최종 업데이트: 2026년 8월 4일" : managedPolicy?.lastUpdated || "Last updated 4 August 2026";
  const displayedEyebrow = managedPolicy?.eyebrow || eyebrow;
  const displayedTitle = managedPolicy?.title || title;
  const displayedIntro = managedPolicy?.intro || intro;
  return (
    <main className="legal-page" lang={locale === "zh" ? "zh-Hans" : locale}>
      <header className="legal-header">
        <Link className="deck-brand" href="/"><span className="deck-wordmark">washd<i>.</i></span></Link>
        <Link href="/"><ArrowLeft size={16} /> {backLabel}</Link>
      </header>
      <section className="legal-hero"><span className="deck-kicker">{displayedEyebrow}</span><h1>{displayedTitle}</h1><p>{displayedIntro}</p><small>{updatedLabel}</small></section>
      <nav className="legal-language" aria-label="Policy language">
        {(Object.keys(languageLabels) as LegalLocale[]).map((language) => language === locale
          ? <strong key={language} aria-current="page">{languageLabels[language]}</strong>
          : <Link key={language} href={`${policyPath}${languageSuffix[language]}`}>{languageLabels[language]}</Link>)}
      </nav>
      <article className="legal-content"><BusinessDisclosure locale={locale} />{managedPolicy ? <ManagedPolicyBody policy={managedPolicy} content={content} plans={plans} addons={addons} /> : children}</article>
      <footer className="legal-footer"><div><strong>washd.</strong><span>Laundry, handled.</span></div><a href="mailto:washdmy@gmail.com"><Mail size={15} /> washdmy@gmail.com</a><nav><Link href="/privacy">Privacy notice</Link><Link href="/terms">Service terms</Link><Link href="/service-information">Service information</Link><Link href="/care-guarantee">Care guarantee</Link></nav></footer>
    </main>
  );
}
