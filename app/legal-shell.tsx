import { ArrowLeft, Mail, WashingMachine } from "lucide-react";
import Link from "next/link";
import { BusinessDisclosure } from "./business-disclosure";

export function LegalShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link className="deck-brand" href="/"><span className="deck-brand-mark"><WashingMachine size={20} /></span><span className="deck-wordmark">washd<i>.</i></span></Link>
        <Link href="/"><ArrowLeft size={16} /> Back to website</Link>
      </header>
      <section className="legal-hero"><span className="deck-kicker">{eyebrow}</span><h1>{title}</h1><p>{intro}</p><small>Last updated 4 August 2026</small></section>
      <article className="legal-content"><BusinessDisclosure />{children}</article>
      <footer className="legal-footer"><div><WashingMachine size={20} /><strong>Washd</strong><span>Laundry, handled.</span></div><a href="mailto:washdmy@gmail.com"><Mail size={15} /> washdmy@gmail.com</a><nav><Link href="/privacy">Privacy</Link><Link href="/privacy/bm">Notis Privasi</Link><Link href="/terms">Terms</Link><Link href="/care-guarantee">Care guarantee</Link></nav></footer>
    </main>
  );
}
