"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { TurnstileWidget, turnstileSiteKey } from "../turnstile-widget";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const handleCaptcha = useCallback((token: string) => setCaptchaToken(token), []);

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (!isSupabaseConfigured) throw new Error("Supabase is not configured");
      if (turnstileSiteKey && !captchaToken) throw new Error("CAPTCHA_REQUIRED");
      const pickupLabel = unit.trim() || "Residence lobby";
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/plans`,
          captchaToken: captchaToken || undefined,
          data: {
            name: name.trim(),
            unit: pickupLabel,
            pickup_location: { label: pickupLabel, notes: "" },
          },
        },
      });
      if (signupError) throw signupError;
      window.location.assign(data.session ? "/plans" : "/login?signup=check-email");
    } catch (caught) {
      const message = (caught as { message?: string }).message?.toLowerCase() ?? "";
      setError(message.includes("captcha_required") ? "Complete the security check before creating your account." : message.includes("already registered") ? "An account already exists for this email. Try logging in instead." : message.includes("password") ? "Choose a password with at least 10 characters." : message.includes("not configured") ? "Washd account creation is being connected. Please try again shortly." : "We couldn’t create your account. Please check your details and try again.");
    } finally {
      setBusy(false);
      if (turnstileSiteKey) setCaptchaReset((value) => value + 1);
    }
  }

  return (
    <main className="signup-page">
      <Link className="brand signup-brand" href="/"><span>washd<span className="brand-dot">.</span></span></Link>
      <section className="signup-card">
        <div className="signup-intro">
          <span className="kicker">Join Washd</span>
          <h1>A fresher weekly rhythm starts here.</h1>
          <p>Create your account now. You can choose a plan after signing up.</p>
          <ul><li><Check size={16} /> Track every Washd bag</li><li><Check size={16} /> Manage pickups in one place</li><li><Check size={16} /> Secure Stripe-hosted payments</li></ul>
        </div>
        <form onSubmit={createAccount}>
          <label>Full name<input required minLength={2} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>
          <label>Residence / unit<input autoComplete="street-address" value={unit} onChange={(event) => setUnit(event.target.value)} placeholder="e.g. The Residence · Unit 12-3" /></label>
          <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
          <label>Password<span className="password-field"><input required minLength={10} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 10 characters" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>
          <TurnstileWidget action="signup" onToken={handleCaptcha} resetSignal={captchaReset} />
          {error && <div className="form-alert error" role="alert">{error}</div>}
          <button className="button wide gold-button" type="submit" disabled={busy}>{busy ? "Creating account…" : <>Create account <ArrowRight size={18} /></>}</button>
          <p className="form-foot">We use these details to create and secure your account. Read our <Link href="/privacy">Privacy Notice</Link> or <Link href="/privacy/bm">Notis Privasi</Link>.</p>
          <p className="form-foot">Already a member? <a href="/login">Log in</a></p>
        </form>
      </section>
    </main>
  );
}
