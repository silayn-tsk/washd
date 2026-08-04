import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { BusinessDisclosure } from "./business-disclosure";

type LegalLocale = "en" | "ms" | "zh" | "ko";

const languageLabels: Record<LegalLocale, string> = { en: "English", ms: "Bahasa Malaysia", zh: "中文", ko: "한국어" };
const languageSuffix: Record<LegalLocale, string> = { en: "", ms: "/bm", zh: "/zh", ko: "/ko" };

export function LegalShell({ eyebrow, title, intro, children, locale = "en", policyPath }: { eyebrow: string; title: string; intro: string; children: React.ReactNode; locale?: LegalLocale; policyPath: "/privacy" | "/terms" | "/service-information" | "/care-guarantee" }) {
  const backLabel = locale === "ms" ? "Kembali ke laman web" : locale === "zh" ? "返回网站" : locale === "ko" ? "웹사이트로 돌아가기" : "Back to website";
  const updatedLabel = locale === "ms" ? "Kemas kini terakhir 4 Ogos 2026" : locale === "zh" ? "最后更新：2026年8月4日" : locale === "ko" ? "최종 업데이트: 2026년 8월 4일" : "Last updated 4 August 2026";
  return (
    <main className="legal-page" lang={locale === "zh" ? "zh-Hans" : locale}>
      <header className="legal-header">
        <Link className="deck-brand" href="/"><span className="deck-wordmark">washd<i>.</i></span></Link>
        <Link href="/"><ArrowLeft size={16} /> {backLabel}</Link>
      </header>
      <section className="legal-hero"><span className="deck-kicker">{eyebrow}</span><h1>{title}</h1><p>{intro}</p><small>{updatedLabel}</small></section>
      <nav className="legal-language" aria-label="Policy language">
        {(Object.keys(languageLabels) as LegalLocale[]).map((language) => language === locale
          ? <strong key={language} aria-current="page">{languageLabels[language]}</strong>
          : <Link key={language} href={`${policyPath}${languageSuffix[language]}`}>{languageLabels[language]}</Link>)}
      </nav>
      <article className="legal-content"><BusinessDisclosure locale={locale} />{children}</article>
      <footer className="legal-footer"><div><strong>washd.</strong><span>Laundry, handled.</span></div><a href="mailto:washdmy@gmail.com"><Mail size={15} /> washdmy@gmail.com</a><nav><Link href="/privacy">Privacy notice</Link><Link href="/terms">Service terms</Link><Link href="/service-information">Service information</Link><Link href="/care-guarantee">Care guarantee</Link></nav></footer>
    </main>
  );
}
