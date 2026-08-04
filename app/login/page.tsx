"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, MapPin } from "lucide-react";
import Link from "next/link";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { TurnstileWidget, turnstileSiteKey } from "../turnstile-widget";

function friendlyError(message?: string) {
  const normalized = message?.toLowerCase() ?? "";
  if (normalized.includes("invalid login credentials")) return "That email or password doesn’t match our records.";
  if (normalized.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  if (normalized.includes("email")) return "Enter a valid email address.";
  return "We couldn’t log you in. Please try again.";
}

function safeNextPath() {
  if (typeof window === "undefined") return "/account";
  const next = new URLSearchParams(window.location.search).get("next");
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const handleCaptcha = useCallback((token: string) => setCaptchaToken(token), []);

  useEffect(() => {
    const signup = new URLSearchParams(window.location.search).get("signup");
    if (signup === "check-email") queueMicrotask(() => setNotice("Check your inbox to confirm your Washd account, then log in."));
  }, []);

  async function logIn(loginEmail = email, loginPassword = password) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (!isSupabaseConfigured) throw new Error("Supabase is not configured");
      if (turnstileSiteKey && !captchaToken) throw new Error("CAPTCHA_REQUIRED");
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
        options: { captchaToken: captchaToken || undefined },
      });
      if (authError) throw authError;
      const destination = safeNextPath();
      const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assurance?.currentLevel !== "aal2" && assurance?.nextLevel === "aal2") {
        window.location.assign(`/mfa?next=${encodeURIComponent(destination)}`);
      } else {
        window.location.assign(destination);
      }
    } catch (caught) {
      const message = (caught as { message?: string }).message;
      setError(message?.includes("CAPTCHA_REQUIRED") ? "Complete the security check before logging in." : message?.includes("not configured") ? "Washd account access is being connected. Please try again shortly." : friendlyError(message));
    } finally {
      setBusy(false);
      if (turnstileSiteKey) setCaptchaReset((value) => value + 1);
    }
  }

  async function resetPassword() {
    if (!email.trim()) {
      setError("Enter your email first, then choose reset password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (!isSupabaseConfigured) throw new Error("Supabase is not configured");
      if (turnstileSiteKey && !captchaToken) throw new Error("CAPTCHA_REQUIRED");
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
        captchaToken: captchaToken || undefined,
      });
      if (resetError) throw resetError;
      setNotice(`Password reset instructions were sent to ${email.trim()}.`);
    } catch (caught) {
      const message = (caught as { message?: string }).message;
      setError(message?.includes("CAPTCHA_REQUIRED") ? "Complete the security check before requesting a password reset." : message?.includes("not configured") ? "Washd account access is being connected. Please try again shortly." : friendlyError(message));
    } finally {
      setBusy(false);
      if (turnstileSiteKey) setCaptchaReset((value) => value + 1);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link className="brand auth-brand" href="/">
          <span>washd<span className="brand-dot">.</span></span>
        </Link>
        <div className="auth-story-copy">
          <span className="kicker light">Your laundry, in view</span>
          <h1>From lobby<br />to <em>wardrobe.</em></h1>
          <p>Book collections, follow each bag and manage your Washd plan from one beautifully simple account.</p>
          <div className="auth-benefits">
            <span><MapPin size={18} /> Live bag tracking</span>
            <span><LockKeyhole size={18} /> Secure account access</span>
          </div>
        </div>
        <div className="auth-orbit" aria-hidden="true"><span /><span /><span /></div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-card">
          <span className="auth-mobile-logo">washd<span className="brand-dot">.</span></span>
          <span className="kicker">Member access</span>
          <h2>Welcome back.</h2>
          <p>Schedule collections and track each bag from lobby to wardrobe.</p>

          <form onSubmit={(event) => { event.preventDefault(); void logIn(); }}>
            <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
            <label>Password
              <span className="password-field">
                <input required minLength={6} type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
              </span>
            </label>
            <TurnstileWidget action="member_login" onToken={handleCaptcha} resetSignal={captchaReset} />
            {error && <div className="form-alert error" role="alert">{error}</div>}
            {notice && <div className="form-alert success" role="status">{notice}</div>}
            <button className="button wide gold-button" type="submit" disabled={busy}>{busy ? "Logging in…" : <>Log in <ArrowRight size={18} /></>}</button>
          </form>

          <div className="auth-links"><a href="/signup">Create an account</a><button type="button" onClick={() => void resetPassword()}>Reset password</button></div>
          <small className="secure-note"><LockKeyhole size={13} /> Secure encrypted member access · <Link href="/privacy">Privacy</Link> · <Link href="/privacy/bm">Notis Privasi</Link></small>
        </div>
      </section>
    </main>
  );
}
