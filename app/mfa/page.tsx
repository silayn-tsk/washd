"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, KeyRound, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../auth-provider";
import { supabase } from "@/lib/supabase";

function nextPath() {
  if (typeof window === "undefined") return "/account";
  const value = new URLSearchParams(window.location.search).get("next");
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export default function MfaPage() {
  const { user, loading: authLoading } = useAuth();
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) window.location.replace(`/login?next=${encodeURIComponent(`/mfa?next=${nextPath()}`)}`);
    if (!user) return;
    void Promise.all([
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
      supabase.auth.mfa.listFactors(),
    ]).then(([assuranceResult, factorResult]) => {
      if (assuranceResult.data?.currentLevel === "aal2") {
        window.location.replace(nextPath());
        return;
      }
      const verified = factorResult.data?.totp.find((factor) => factor.status === "verified");
      if (verified) setFactorId(verified.id);
      else setError("No verified authenticator is attached to this account. The Washd owner can set one up from Admin Security.");
      setLoading(false);
    });
  }, [user, authLoading]);

  async function verify(event: FormEvent) {
    event.preventDefault();
    if (!factorId) return;
    setBusy(true);
    setError("");
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
    setBusy(false);
    if (verifyError) {
      setError("That verification code was not accepted. Wait for a new code in your authenticator app and try again.");
      setCode("");
      return;
    }
    window.location.replace(nextPath());
  }

  if (authLoading || loading) return <main className="admin-state"><LoaderCircle className="spin" /><p>Checking account security…</p></main>;
  if (!user) return null;

  return (
    <main className="mfa-page">
      <section className="mfa-card">
        <Link className="brand" href="/"><span>washd<span className="brand-dot">.</span></span></Link>
        <span className="mfa-icon"><ShieldCheck size={28} /></span>
        <span className="kicker">Protected access</span>
        <h1>Enter your authenticator code.</h1>
        <p>Open the authenticator app connected to your Washd owner account and enter the current six-digit code.</p>
        {error && <div className="form-alert error" role="alert">{error}</div>}
        {factorId && <form onSubmit={(event) => void verify(event)}>
          <label>Six-digit code<input autoFocus required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" /></label>
          <button className="button wide gold-button" type="submit" disabled={busy || code.length !== 6}>{busy ? <><LoaderCircle className="spin" size={17} /> Verifying…</> : <>Verify and continue <ArrowRight size={17} /></>}</button>
        </form>}
        <small><LockKeyhole size={14} /> Password access alone cannot open protected Washd administration.</small>
        {!factorId && <Link className="text-button" href="/admin/security"><KeyRound size={16} /> Open Admin Security</Link>}
      </section>
    </main>
  );
}
