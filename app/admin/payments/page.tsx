"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, CreditCard, LoaderCircle, RefreshCw, ShieldAlert, Webhook } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../auth-provider";
import { supabase } from "@/lib/supabase";
import { redirectForAdminMfa, resolveAdminAccess } from "@/lib/admin-access";

type PaymentMember = {
  id: string;
  member_id: string;
  name: string | null;
  email: string | null;
  plan_id: string | null;
  subscription_status: string | null;
  latest_invoice_status: string | null;
  payment_brand: string | null;
  payment_last4: string | null;
  current_period_end: string | null;
  updated_at: string;
};

type StripeEventHealth = {
  id: string;
  type: string;
  status: "processing" | "processed" | "failed";
  processed_at: string;
  last_error: string | null;
};

type PaymentReadiness = {
  mode: "test" | "live" | "unknown";
  readyForLive: boolean;
  account: { detailsSubmitted: boolean; chargesEnabled: boolean; payoutsEnabled: boolean; country: string | null; defaultCurrency: string | null };
  checks: { pricesReady: boolean; configuredPrices: number; webhookReady: boolean; portalReady: boolean; legalDisclosureReady: boolean };
  issues: string[];
  checkedAt: string;
};

const attentionStatuses = new Set(["payment_attention", "past_due", "unpaid", "incomplete", "incomplete_expired"]);

function friendlyStatus(value: string | null) {
  return (value || "not subscribed").replaceAll("_", " ");
}

export default function AdminPaymentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [members, setMembers] = useState<PaymentMember[]>([]);
  const [events, setEvents] = useState<StripeEventHealth[]>([]);
  const [readiness, setReadiness] = useState<PaymentReadiness | null>(null);
  const [readinessError, setReadinessError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHealth = useCallback(async () => {
    setLoading(true);
    setError("");
    setReadinessError("");
    const [memberResult, eventResult, readinessResult] = await Promise.all([
      supabase.from("profiles").select("id, member_id, name, email, plan_id, subscription_status, latest_invoice_status, payment_brand, payment_last4, current_period_end, updated_at").order("created_at", { ascending: false }),
      supabase.from("stripe_events").select("id, type, status, processed_at, last_error").order("processed_at", { ascending: false }).limit(50),
      supabase.functions.invoke<PaymentReadiness & { error?: string }>("admin-payment-readiness", { body: {} }),
    ]);
    setLoading(false);
    if (memberResult.error || eventResult.error) {
      setError("Payment health could not be loaded. Please refresh and try again.");
      return;
    }
    setMembers((memberResult.data || []) as PaymentMember[]);
    setEvents((eventResult.data || []) as StripeEventHealth[]);
    if (readinessResult.error || readinessResult.data?.error) {
      setReadiness(null);
      setReadinessError("Stripe configuration status could not be verified.");
    } else {
      setReadiness(readinessResult.data);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) window.location.replace("/login?next=/admin/payments");
    if (!user) return;
    void resolveAdminAccess().then((access) => {
      if (access === "mfa") { redirectForAdminMfa("/admin/payments"); return; }
      const canView = access === "allowed";
      setAllowed(canView);
      if (canView) void loadHealth();
      else setLoading(false);
    });
  }, [user, authLoading, loadHealth]);

  const subscribed = members.filter((member) => member.subscription_status && !["canceled", "incomplete_expired"].includes(member.subscription_status));
  const needsAttention = members.filter((member) => attentionStatuses.has(member.subscription_status || "") || member.latest_invoice_status === "open");
  const failedEvents = events.filter((event) => event.status === "failed");
  const recentEvents = useMemo(() => events.slice(0, 12), [events]);

  if (authLoading || (user && allowed === null)) return <main className="admin-state"><LoaderCircle className="spin" /><p>Checking payment health…</p></main>;
  if (!user) return null;
  if (!allowed) return <main className="admin-state"><ShieldAlert size={42} /><h1>Admin access required</h1><Link className="deck-button" href="/admin">Return to admin</Link></main>;

  return (
    <main className="admin-page payment-admin-page">
      <header className="admin-header"><div><Link className="admin-brand" href="/admin"><span>washd. payments</span></Link></div><div><Link className="admin-preview" href="/admin"><ArrowLeft size={15} /> Website editor</Link><button className="admin-save" type="button" disabled={loading} onClick={() => void loadHealth()}><RefreshCw className={loading ? "spin" : ""} size={16} /> Refresh</button></div></header>
      <div className="payment-health-page">
        <div className="payment-health-title"><span className="kicker">Launch operations</span><h1>Payment health</h1><p>Member billing state and Stripe webhook processing in one place.</p></div>
        {error && <div className="admin-notice error"><ShieldAlert size={18} /> {error}</div>}
        {readinessError && <div className="admin-notice error"><ShieldAlert size={18} /> {readinessError}</div>}
        {readiness && <section className={`payment-mode-banner ${readiness.readyForLive ? "ready" : "attention"}`}>
          <div>{readiness.readyForLive ? <CheckCircle2 size={25} /> : <AlertTriangle size={25} />}<div><span>Stripe environment</span><h2>{readiness.readyForLive ? "Live payments are configured" : readiness.mode === "test" ? "Stripe is still in test mode" : "Live payments need attention"}</h2><p>{readiness.readyForLive ? "The account, MYR prices, webhook and customer portal passed the private readiness check." : "Do not accept real customer registrations until every item below passes."}</p></div></div>
          <ul>
            <li className={readiness.account.chargesEnabled ? "pass" : "fail"}>Charges {readiness.account.chargesEnabled ? "enabled" : "not enabled"}</li>
            <li className={readiness.account.payoutsEnabled ? "pass" : "fail"}>Payouts {readiness.account.payoutsEnabled ? "enabled" : "not enabled"}</li>
            <li className={readiness.checks.pricesReady ? "pass" : "fail"}>{readiness.checks.configuredPrices} MYR prices {readiness.checks.pricesReady ? "verified" : "need attention"}</li>
            <li className={readiness.checks.webhookReady ? "pass" : "fail"}>Webhook {readiness.checks.webhookReady ? "verified" : "not ready"}</li>
            <li className={readiness.checks.portalReady ? "pass" : "fail"}>Customer portal {readiness.checks.portalReady ? "verified" : "not ready"}</li>
            <li className={readiness.checks.legalDisclosureReady ? "pass" : "fail"}>Supplier disclosure {readiness.checks.legalDisclosureReady ? "complete" : "incomplete"}</li>
          </ul>
          {!readiness.readyForLive && readiness.issues.length > 0 && <details><summary>Why launch is blocked</summary><ul>{readiness.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></details>}
          <small>Checked {new Date(readiness.checkedAt).toLocaleString("en-MY")} · No payment keys or account identifiers are shown.</small>
        </section>}
        <section className="payment-health-metrics"><article><CreditCard size={22} /><span>Subscribed members</span><strong>{subscribed.length}</strong></article><article className={needsAttention.length ? "attention" : ""}><AlertTriangle size={22} /><span>Need payment attention</span><strong>{needsAttention.length}</strong></article><article className={failedEvents.length ? "attention" : ""}><Webhook size={22} /><span>Failed webhooks</span><strong>{failedEvents.length}</strong></article></section>
        <div className="payment-health-grid">
          <section className="payment-health-card"><div className="payment-health-card-title"><div><span>Members</span><h2>Billing status</h2></div>{needsAttention.length === 0 && <small><CheckCircle2 size={14} /> No payment issues</small>}</div>{loading ? <div className="enquiry-empty"><LoaderCircle className="spin" size={20} /> Loading…</div> : members.length === 0 ? <div className="enquiry-empty">No members yet.</div> : <div className="payment-member-list">{members.map((member) => <article key={member.id} className={attentionStatuses.has(member.subscription_status || "") ? "attention" : ""}><div><strong>{member.member_id}</strong><span>{member.name || member.email}</span><small>{member.plan_id || "No plan"}</small></div><div><span className={`billing-status ${attentionStatuses.has(member.subscription_status || "") ? "attention" : ""}`}>{friendlyStatus(member.subscription_status)}</span>{member.payment_last4 && <small>{member.payment_brand} ···· {member.payment_last4}</small>}{member.current_period_end && <small>Renews {new Date(member.current_period_end).toLocaleDateString("en-MY")}</small>}</div></article>)}</div>}</section>
          <section className="payment-health-card"><div className="payment-health-card-title"><div><span>Stripe events</span><h2>Recent webhook activity</h2></div>{failedEvents.length === 0 && <small><CheckCircle2 size={14} /> Healthy</small>}</div>{loading ? <div className="enquiry-empty"><LoaderCircle className="spin" size={20} /> Loading…</div> : recentEvents.length === 0 ? <div className="enquiry-empty">No Stripe events yet.</div> : <div className="payment-event-list">{recentEvents.map((event) => <article key={event.id}><span className={`event-health ${event.status}`}>{event.status}</span><div><strong>{event.type}</strong><small>{new Date(event.processed_at).toLocaleString("en-MY")}</small>{event.last_error && <p>{event.last_error}</p>}</div></article>)}</div>}</section>
        </div>
      </div>
    </main>
  );
}
