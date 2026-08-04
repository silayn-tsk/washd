"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, LoaderCircle, LockKeyhole, ShieldAlert, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../auth-provider";
import { supabase } from "@/lib/supabase";

type Enrollment = { factorId: string; qrCode: string; secret: string };

export default function AdminSecurityPage() {
  const { user, loading: authLoading } = useAuth();
  const [identityAllowed, setIdentityAllowed] = useState<boolean | null>(null);
  const [verifiedFactors, setVerifiedFactors] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadSecurity = useCallback(async () => {
    const [identityResult, factorResult, assuranceResult] = await Promise.all([
      supabase.rpc("is_site_admin_identity"),
      supabase.auth.mfa.listFactors(),
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    ]);
    const allowed = identityResult.data === true;
    setIdentityAllowed(allowed);
    if (!allowed) return;
    setVerifiedFactors(factorResult.data?.totp.filter((factor) => factor.status === "verified").length || 0);
    setCurrentLevel(assuranceResult.data?.currentLevel || null);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) window.location.replace("/login?next=/admin/security");
    if (user) queueMicrotask(() => void loadSecurity());
  }, [user, authLoading, loadSecurity]);

  async function beginEnrollment() {
    setBusy(true); setError(""); setNotice("");
    const factors = await supabase.auth.mfa.listFactors();
    for (const factor of factors.data?.all.filter((item) => item.factor_type === "totp" && item.status === "unverified") || []) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Washd admin" });
    setBusy(false);
    if (enrollError || !data?.totp) {
      setError("Authenticator setup could not start. Please refresh and try again.");
      return;
    }
    setEnrollment({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
  }

  async function verifyEnrollment(event: FormEvent) {
    event.preventDefault();
    if (!enrollment) return;
    setBusy(true); setError(""); setNotice("");
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrollment.factorId, code: code.trim() });
    if (verifyError) {
      setBusy(false); setCode("");
      setError("That code was not accepted. Wait for the next code and try again.");
      return;
    }
    const { error: enforcementError } = await supabase.rpc("enable_admin_mfa_enforcement");
    setBusy(false);
    if (enforcementError) {
      setError("The authenticator was verified, but admin enforcement could not be enabled. Contact technical support before launch.");
      return;
    }
    setEnrollment(null); setCode("");
    setNotice("Authenticator protection is active. Every new admin session now requires a verification code.");
    await loadSecurity();
  }

  async function cancelEnrollment() {
    if (!enrollment) return;
    setBusy(true);
    await supabase.auth.mfa.unenroll({ factorId: enrollment.factorId });
    setEnrollment(null); setCode(""); setBusy(false);
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setError(""); setNotice("");
    if (currentLevel !== "aal2") {
      setError("Verify this session with your authenticator before changing the owner password.");
      return;
    }
    if (newPassword.length < 12) {
      setError("Use at least 12 characters for the new owner password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The two new-password entries do not match.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setBusy(false);
    if (updateError) {
      setError("The owner password could not be changed. Try again with a new, unique password.");
      return;
    }
    setNewPassword(""); setConfirmPassword("");
    setNotice("Owner password changed. Store it in your password manager and do not share it in chat.");
  }

  if (authLoading || (user && identityAllowed === null)) return <main className="admin-state"><LoaderCircle className="spin" /><p>Opening admin security…</p></main>;
  if (!user) return null;
  if (!identityAllowed) return <main className="admin-state"><ShieldAlert size={42} /><h1>Admin access required</h1><p>This page is available only to the Washd owner account.</p><Link className="deck-button" href="/">Back to website</Link></main>;

  const needsChallenge = verifiedFactors > 0 && currentLevel !== "aal2";
  return (
    <main className="admin-page security-admin-page">
      <header className="admin-header"><div><Link className="admin-brand" href="/admin"><span>washd. security</span></Link><span className="admin-secure"><LockKeyhole size={13} /> Owner only</span></div><div><Link className="admin-preview" href="/admin"><ArrowLeft size={15} /> Website editor</Link></div></header>
      <section className="security-admin-content">
        <div className="payment-health-title"><span className="kicker">Account protection</span><h1>Admin multi-factor authentication</h1><p>Protect website content, customer tracking, enquiries and payment operations with an authenticator app.</p></div>
        {notice && <div className="admin-notice success"><CheckCircle2 size={18} /> {notice}</div>}
        {error && <div className="admin-notice error"><ShieldAlert size={18} /> {error}</div>}

        <article className={`security-status-card ${verifiedFactors > 0 ? "active" : ""}`}>
          <span><ShieldCheck size={29} /></span>
          <div><small>Current protection</small><h2>{verifiedFactors > 0 ? "Authenticator connected" : "Password only"}</h2><p>{verifiedFactors > 0 ? `${verifiedFactors} verified authenticator${verifiedFactors === 1 ? "" : "s"} on this account.` : "Set up an authenticator before Washd accepts real customer payments."}</p></div>
          <strong>{verifiedFactors > 0 ? "MFA active" : "Action required"}</strong>
        </article>

        {needsChallenge && <div className="security-action-card"><KeyRound size={25} /><div><h2>Verify this session</h2><p>Your account has MFA, but this browser session still needs its six-digit code.</p></div><Link className="deck-button" href="/mfa?next=/admin/security">Enter code</Link></div>}

        {!enrollment && verifiedFactors === 0 && <div className="security-action-card"><Smartphone size={27} /><div><h2>Connect an authenticator app</h2><p>Use Google Authenticator, Microsoft Authenticator, 1Password or another TOTP-compatible app.</p></div><button className="deck-button" type="button" disabled={busy} onClick={() => void beginEnrollment()}>{busy ? "Starting…" : "Set up authenticator"}</button></div>}

        {enrollment && <section className="mfa-enrollment-card">
          <div><span className="kicker">Step 1</span><h2>Scan this QR code</h2><p>Open your authenticator app, add a new account and scan the code.</p></div>
          {/* Supabase returns a local SVG data URL for this newly created TOTP factor. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={enrollment.qrCode} alt="QR code for the Washd admin authenticator" />
          <details><summary>Can’t scan it?</summary><p>Enter this setup key manually and keep it private:</p><code>{enrollment.secret}</code></details>
          <form onSubmit={(event) => void verifyEnrollment(event)}><span className="kicker">Step 2</span><label>Enter the six-digit code<input autoFocus required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" /></label><div><button className="deck-button" type="submit" disabled={busy || code.length !== 6}>{busy ? "Verifying…" : "Verify and enforce MFA"}</button><button className="admin-link-button" type="button" disabled={busy} onClick={() => void cancelEnrollment()}>Cancel</button></div></form>
        </section>}

        {verifiedFactors > 0 && currentLevel === "aal2" && <section className="security-password-card">
          <div><span className="kicker">Owner credential</span><h2>Replace the shared password</h2><p>Choose a unique password that you have never used elsewhere. Save it directly in your password manager.</p></div>
          <form onSubmit={(event) => void changePassword(event)}>
            <label>New password<input required type="password" autoComplete="new-password" minLength={12} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
            <label>Confirm new password<input required type="password" autoComplete="new-password" minLength={12} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
            <button className="deck-button" type="submit" disabled={busy || newPassword.length < 12 || confirmPassword.length < 12}>{busy ? "Changing…" : "Change owner password"}</button>
          </form>
        </section>}

        <div className="security-warning"><ShieldAlert size={19} /><p><strong>Do not remove the authenticator app after enabling this.</strong> Supabase does not provide recovery codes. Add a second verified factor later or follow the documented owner-recovery procedure if the device is lost.</p></div>
      </section>
    </main>
  );
}
