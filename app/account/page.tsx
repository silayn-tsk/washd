"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { ArrowRight, CreditCard, LogOut, PackageCheck, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../auth-provider";
import { MemberHeader } from "../member-header";
import { auth, db, functions } from "@/lib/firebase";

type Profile = { name?: string; planId?: string; subscriptionStatus?: string; paymentBrand?: string; paymentLast4?: string; unit?: string };

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile>({});
  const [billingBusy, setBillingBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) window.location.replace("/login?next=/account");
    if (!user) return;
    return onSnapshot(doc(db, "users", user.uid), (snapshot) => setProfile((snapshot.data() ?? {}) as Profile));
  }, [user, loading]);

  async function manageBilling() {
    setBillingBusy(true);
    setError("");
    try {
      const createPortal = httpsCallable<{ returnUrl: string }, { url: string }>(functions, "createBillingPortalSession");
      const result = await createPortal({ returnUrl: `${window.location.origin}/account` });
      if (!result.data.url?.startsWith("https://")) throw new Error("Missing secure portal URL");
      window.location.assign(result.data.url);
    } catch {
      setError("Billing management will become available after your first Stripe subscription is activated.");
    } finally {
      setBillingBusy(false);
    }
  }

  if (loading || !user) return <main className="member-page"><MemberHeader /><div className="account-loading">Loading your account…</div></main>;

  const planName = profile.planId ? profile.planId.replaceAll("-", " ") : "No active plan";
  return (
    <main className="member-page account-page">
      <MemberHeader />
      <section className="account-title"><span className="kicker">My Washd</span><h1>Welcome back, <em>{profile.name?.split(" ")[0] || user.displayName?.split(" ")[0] || "member"}.</em></h1><p>Your plan, payments and pickup profile in one place.</p></section>
      {error && <div className="checkout-banner error" role="alert">{error}</div>}
      <section className="account-grid">
        <article className="account-card plan-summary"><div className="account-icon"><PackageCheck size={24} /></div><span>Current plan</span><h2>{planName}</h2><p>Status: <strong>{profile.subscriptionStatus || "Not subscribed"}</strong></p><a className="button" href="/plans">View plans <ArrowRight size={17} /></a></article>
        <article className="account-card"><div className="account-icon"><UserRound size={24} /></div><span>Profile</span><h3>{profile.name || user.displayName || "Washd member"}</h3><p>{user.email}</p><p>{profile.unit || "Pickup address not added"}</p></article>
        <article className="account-card"><div className="account-icon"><CreditCard size={24} /></div><span>Billing</span><h3>{profile.paymentLast4 ? `${profile.paymentBrand || "Card"} •••• ${profile.paymentLast4}` : "No payment method"}</h3><p>Card details are securely held by Stripe.</p><button className="text-button" type="button" disabled={billingBusy} onClick={() => void manageBilling()}>{billingBusy ? "Opening…" : "Manage billing"} <ArrowRight size={16} /></button></article>
        <article className="account-card security-card"><div className="account-icon"><ShieldCheck size={24} /></div><span>Account security</span><h3>Firebase protected</h3><p>Your password and sign-in session are managed by Firebase Authentication.</p><button className="text-button" type="button" onClick={async () => { await signOut(auth); window.location.assign("/"); }}><LogOut size={16} /> Log out</button></article>
      </section>
    </main>
  );
}
