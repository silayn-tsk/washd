"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, FileText, X } from "lucide-react";
import Link from "next/link";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { TurnstileWidget, turnstileSiteKey } from "../turnstile-widget";

const TERMS_VERSION = "2026-08-12";

const serviceTerms = [
  ["1. The Service", "Washd provides a scheduled wash, iron and fold laundry service, collected from and returned to your building on fixed days. The service operates on a monthly subscription basis with set collection days — not on demand — so we can offer a reliable, planned service to every customer."],
  ["2. Subscription & Payment", "2.1. Washd is a recurring monthly subscription, managed and paid by card through our secure payment provider, Stripe.\n2.2. Your subscription renews automatically each month until cancelled in line with these terms.\n2.3. Access to the service depends on your subscription being active and payment being up to date."],
  ["3. Collections & Returns", "3.1. Collections and returns follow your building's fixed schedule. Items are left at the agreed collection point before 9:30 AM on your collection day and returned by 6:00 PM on the return day.\n3.2. Standard turnaround is approximately two days (for example, collect Monday, return Wednesday).\n3.3. On the rare occasion a collection cannot proceed on our side, we will arrange the next available collection, or an alternative that works for you."],
  ["4. What Counts as Household Laundry", "4.1. Each plan's weight allowance covers everyday wearable clothing only.\n4.2. Bedding, towels, curtains, rugs, comforters, blankets and other bulky or heavily soiled items are not included as standard. If you would like these cleaned, please contact us in advance to arrange them as a separate add-on.\n4.3. Weight is measured at intake on our scales, and that measurement is final for that collection. Overweight bags may be returned, split to the next collection, or charged at an additional rate, which we will confirm with you."],
  ["5. Items We Do Not Accept in Standard Bags", "The following should not be placed in your standard laundry bag. If included without being flagged to us in advance, they are handled as normal household laundry and Washd cannot accept liability for them:\n• Dry-clean-only garments — suits, blazers, tailored formalwear, silk, wool, leather, suede, structured or lined garments (we offer dry cleaning separately on request);\n• Delicate or special items — lingerie, beaded, sequinned, embellished or hand-wash-only pieces;\n• Garments likely to bleed colour when not separated or flagged;\n• Garments with existing damage — weak seams, tears, thinning fabric or loose buttons;\n• Non-clothing or prohibited items, and anything left in pockets."],
  ["6. Your Responsibilities", "Before each collection, you agree to:\n• Include only everyday clothing, within your plan's weight limit;\n• Separate or clearly flag whites and colours where items may run — if not separated, they are washed together at your own risk;\n• Flag any stained, delicate or special-care items in advance;\n• Empty all pockets and remove belts, brooches and loose accessories."],
  ["7. Stains, Fabrics & Realistic Outcomes", "7.1. Stain treatment is carried out on a best-effort basis. Certain stains — including ink, dye, hair dye and aged or set-in marks — may lighten but cannot be guaranteed to fully remove. This does not constitute a service failure.\n7.2. Delicate fabrics, older garments and items with hidden defects carry inherent risk during cleaning. Where a garment's fabric or condition limits the achievable result, or presents a risk of shrinkage or colour change despite correct handling, it is treated on the understanding that this risk rests with the owner."],
  ["8. Raising a Concern", "8.1. Please check your laundry on return. Any concern about a missing item or the quality of the work should be raised within 24 hours of return, while it can be verified against our records.\n8.2. If you believe an item was damaged in our care, please raise it before the garment is worn or washed again, and return it to us for inspection. Once an item has been worn or re-washed, we are unable to assess a claim.\n8.3. Items are counted at collection and return; missing-item queries are checked against that record."],
  ["9. Liability", "9.1. In the unlikely event of loss of, or damage to, a correctly-declared item caused directly by Washd, our liability is limited to a maximum of ten (10) times the cleaning value of that item, in line with standard garment-care practice. This does not extend to the item's retail or replacement value.\n9.2. Washd accepts no liability for pre-existing damage or wear, or for items that should have been flagged or excluded under these terms but were not."],
  ["10. Missed & Unused Collections", "10.1. If a bag is not left out on your collection morning, that collection is not carried over or refunded, as the slot is reserved for you regardless.\n10.2. Being a subscription, unused collections within a month do not roll over or convert to a refund."],
  ["11. Uncollected Laundry", "Cleaned laundry returned to the collection point and not collected within 7 days is held at your own risk. After 90 days, uncollected laundry is no longer our responsibility."],
  ["12. Fair Use", "Plans are intended for a single household's everyday laundry. Sharing a plan across multiple units or for business purposes falls outside its scope; if your needs are larger, please contact us and we will tailor an arrangement."],
  ["13. Pausing & Cancelling", "13.1. You may pause or cancel your subscription by notifying us at least two weeks (14 days) before your next billing date.\n13.2. Cancellations or pauses requested with less than two weeks' notice take effect from the following billing cycle.\n13.3. Payments already processed for the current cycle are non-refundable."],
  ["14. Changes to Service & Terms", "Washd may update these terms, pricing or service details from time to time. Any changes will be communicated in advance, and continued use of the service constitutes acceptance of the updated terms."],
  ["15. Governing Law", "These terms are governed by the laws of Malaysia."],
  ["16. Contact", "For any questions, requests or concerns:\nWhatsApp: 017-649 4749 · Email: washdmy@gmail.com"],
] as const;

export default function SignupPage() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const handleCaptcha = useCallback((token: string) => setCaptchaToken(token), []);

  function reviewTerms(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setTermsOpen(true);
  }

  async function createAccount() {
    if (!termsAccepted) return;
    setBusy(true);
    setError("");
    try {
      if (!isSupabaseConfigured) throw new Error("Supabase is not configured");
      if (turnstileSiteKey && !captchaToken) throw new Error("CAPTCHA_REQUIRED");
      const pickupLabel = unit.trim() || "Residence lobby";
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(), password,
        options: { emailRedirectTo: `${window.location.origin}/plans`, captchaToken: captchaToken || undefined, data: { name: name.trim(), unit: pickupLabel, pickup_location: { label: pickupLabel, notes: "" }, terms_accepted: true, terms_version: TERMS_VERSION } },
      });
      if (signupError) throw signupError;
      window.location.assign(data.session ? "/plans" : "/login?signup=check-email");
    } catch (caught) {
      const message = (caught as { message?: string }).message?.toLowerCase() ?? "";
      setTermsOpen(false);
      setError(message.includes("captcha_required") ? "Complete the security check before creating your account." : message.includes("terms_required") ? "Please accept the Service Terms before creating an account." : message.includes("already registered") ? "An account already exists for this email. Try logging in instead." : message.includes("password") ? "Choose a password with at least 10 characters." : message.includes("not configured") ? "Washd account creation is being connected. Please try again shortly." : "We couldn’t create your account. Please check your details and try again.");
    } finally { setBusy(false); if (turnstileSiteKey) setCaptchaReset((value) => value + 1); }
  }

  return <main className="signup-page">
    <Link className="brand signup-brand" href="/"><span>washd<span className="brand-dot">.</span></span></Link>
    <section className="signup-card">
      <div className="signup-intro"><span className="signup-glow signup-glow-one" /><span className="signup-glow signup-glow-two" /><span className="kicker">Join Washd</span><h1>A fresher weekly rhythm starts here.</h1><p>Create your account now. You can choose a plan after signing up.</p><ul><li><Check size={16} /> Track every Washd bag</li><li><Check size={16} /> Manage pickups in one place</li><li><Check size={16} /> Secure Stripe-hosted payments</li></ul></div>
      <form onSubmit={reviewTerms}>
        <label>Full name<input required minLength={2} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>
        <label>Residence / unit<input autoComplete="street-address" value={unit} onChange={(event) => setUnit(event.target.value)} placeholder="e.g. The Residence · Unit 12-3" /></label>
        <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
        <label>Password<span className="password-field"><input required minLength={10} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 10 characters" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>
        <TurnstileWidget action="signup" onToken={handleCaptcha} resetSignal={captchaReset} />
        {error && <div className="form-alert error" role="alert">{error}</div>}
        <button className="button wide gold-button" type="submit">Create account <ArrowRight size={18} /></button>
        <p className="form-foot">We use these details to create and secure your account. Read our <Link href="/privacy">Privacy Notice</Link>.</p><p className="form-foot">Already a member? <a href="/login">Log in</a></p>
      </form>
    </section>
    {termsOpen && <div className="terms-modal-backdrop" role="presentation"><section className="terms-modal" role="dialog" aria-modal="true" aria-labelledby="terms-title"><header><div><span className="kicker"><FileText size={14} /> Before you join</span><h2 id="terms-title">Washd Terms &amp; Conditions</h2><p>Please read these terms before creating your account.</p></div><button type="button" className="terms-modal-close" aria-label="Close terms" onClick={() => setTermsOpen(false)} disabled={busy}><X size={21} /></button></header><div className="terms-modal-copy">{serviceTerms.map(([heading, body]) => <section key={heading}><h3>{heading}</h3><p>{body}</p></section>)}</div><label className="terms-modal-acceptance"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} disabled={busy} /><span>I confirm that I have read, understood and agree to the Washd Terms &amp; Conditions of Service.</span></label><footer><button type="button" className="text-button" onClick={() => setTermsOpen(false)} disabled={busy}>Go back</button><button type="button" className="button gold-button" disabled={!termsAccepted || busy} onClick={() => void createAccount()}>{busy ? "Creating account…" : <>Agree &amp; create account <ArrowRight size={17} /></>}</button></footer></section></div>}
  </main>;
}
