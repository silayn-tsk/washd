"use client";

import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
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

function ManagedPolicyBody({ policy }: { policy: PolicyPageContent }) {
  const sections = policy.body.trim().split(/(?=^##\s+)/m).filter(Boolean);
  return <>{sections.map((section, index) => {
    const lines = section.trim().split("\n");
    const heading = lines[0].replace(/^##\s+/, "");
    const body = lines.slice(1).join("\n").trim();
    return <section key={`${heading}-${index}`}><h2>{heading}</h2><p className="managed-policy-copy">{body}</p></section>;
  })}</>;
}

export function LegalShell({ eyebrow, title, intro, children, locale = "en", policyPath }: { eyebrow: string; title: string; intro: string; children: React.ReactNode; locale?: LegalLocale; policyPath: "/privacy" | "/terms" | "/service-information" | "/care-guarantee" }) {
  const { content } = useSiteContent();
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
      <article className="legal-content"><BusinessDisclosure locale={locale} />{managedPolicy?.body.trim() ? <ManagedPolicyBody policy={managedPolicy} /> : children}</article>
      <footer className="legal-footer"><div><strong>washd.</strong><span>Laundry, handled.</span></div><a href="mailto:washdmy@gmail.com"><Mail size={15} /> washdmy@gmail.com</a><nav><Link href="/privacy">Privacy notice</Link><Link href="/terms">Service terms</Link><Link href="/service-information">Service information</Link><Link href="/care-guarantee">Care guarantee</Link></nav></footer>
    </main>
  );
}
