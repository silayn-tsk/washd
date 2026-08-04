import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { BusinessDisclosure } from "./business-disclosure";

export function LegalShell({ eyebrow, title, intro, children, locale = "en" }: { eyebrow: string; title: string; intro: string; children: React.ReactNode; locale?: "en" | "ms" }) {
  return (
    <main className="legal-page" lang={locale === "ms" ? "ms" : "en"}>
      <header className="legal-header">
        <Link className="deck-brand" href="/"><span className="deck-wordmark">washd<i>.</i></span></Link>
        <Link href="/"><ArrowLeft size={16} /> {locale === "ms" ? "Kembali ke laman web" : "Back to website"}</Link>
      </header>
      <section className="legal-hero"><span className="deck-kicker">{eyebrow}</span><h1>{title}</h1><p>{intro}</p><small>{locale === "ms" ? "Kemas kini terakhir 4 Ogos 2026" : "Last updated 4 August 2026"}</small></section>
      <article className="legal-content"><BusinessDisclosure locale={locale} />{children}</article>
      <footer className="legal-footer"><div><strong>washd.</strong><span>Laundry, handled.</span></div><a href="mailto:washdmy@gmail.com"><Mail size={15} /> washdmy@gmail.com</a><nav><Link href="/privacy">Privacy</Link><Link href="/privacy/bm">Notis Privasi</Link><Link href="/terms">Terms</Link><Link href="/terms/bm">Terma</Link><Link href="/service-information">Service information</Link><Link href="/maklumat-perkhidmatan">Maklumat perkhidmatan</Link><Link href="/care-guarantee">Care guarantee</Link><Link href="/care-guarantee/bm">Jaminan penjagaan</Link></nav></footer>
    </main>
  );
}
