"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);

  async function updatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (!isSupabaseConfigured) throw new Error("Supabase is not configured");
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setComplete(true);
    } catch {
      setError("This reset link is invalid or expired. Request a new one from the login page.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link className="brand auth-brand" href="/"><span>washd<span className="brand-dot">.</span></span></Link>
        <div className="auth-story-copy">
          <span className="kicker light">Account security</span>
          <h1>A fresh start,<br /><em>securely handled.</em></h1>
          <p>Choose a new password for your Washd account.</p>
        </div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-card">
          <span className="auth-mobile-logo"><LockKeyhole size={20} /></span>
          <span className="kicker">Password recovery</span>
          <h2>{complete ? "Password updated." : "Choose a new password."}</h2>
          {complete ? (
            <><p>Your Washd account is ready.</p><Link className="button wide gold-button" href="/account">Continue to account <ArrowRight size={18} /></Link></>
          ) : (
            <form onSubmit={updatePassword}>
              <label>New password
                <span className="password-field">
                  <input required minLength={10} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 10 characters" />
                  <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
                </span>
              </label>
              {error && <div className="form-alert error" role="alert">{error}</div>}
              <button className="button wide gold-button" type="submit" disabled={busy}>{busy ? "Updating…" : <>Update password <ArrowRight size={18} /></>}</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
