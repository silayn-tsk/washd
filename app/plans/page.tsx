"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarDays, Check, CircleDollarSign, Clock3, Droplets, LockKeyhole, MessageCircle, PackageCheck, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useAuth } from "../auth-provider";
import Link from "next/link";
import { MemberHeader } from "../member-header";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useSiteContent } from "../use-site-content";
import type { Plan, SiteContent } from "@/lib/site-content";

function WhatsAppRequest({ content, label = "Request on WhatsApp" }: { content: SiteContent; label?: string }) {
  const message = encodeURIComponent("Hi Washd, I would like to arrange a per-piece or special-care laundry item for my next collection.");
  return <a className="button" href={`https://wa.me/${content.contact.whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> {label} <ArrowRight size={16} /></a>;
}

function PlanClauses({ detail }: { detail: SiteContent["planDetails"][string] | undefined }) {
  if (!detail) return null;
  return <section className="plan-clauses-section">
    <div className="plan-clauses-heading"><span className="kicker">Plan details</span><h2>Clear before your first collection.</h2><p>Everything this membership includes, plus the important care conditions.</p></div>
    <div className="plan-clauses-grid">
      <article><span>Included</span><ul>{detail.included.map((item) => <li key={item}><Check size={16} /> {item}</li>)}</ul></article>
      <article className="plan-clauses-excluded"><span>Not included</span><ul>{detail.excluded.map((item) => <li key={item}><X size={16} aria-hidden="true" /> {item}</li>)}</ul></article>
    </div>
    <div className="fabric-care-notice"><Droplets size={22} /><div><span>Colour &amp; fabric care</span><p>{detail.colourCare}</p></div></div>
    <p className="plan-detail-note"><strong>Please note:</strong> {detail.note}</p>
  </section>;
}

function AlaCarteServices({ content }: { content: SiteContent }) {
  const services = content.aLaCarte;
  return <section className="ala-carte-section" id="additional-services">
    <div className="ala-carte-heading"><div><span className="kicker">Additional services</span><h2>{services.title}</h2></div><p>{services.intro}</p></div>
    <div className="ala-carte-grid">{services.groups.map((group) => <article className="ala-carte-card" key={group.title}><span>{group.subtitle}</span><h3>{group.title}</h3><div>{group.items.map((item) => <p key={item.name}><span>{item.name}</span><strong>{item.price}</strong></p>)}</div></article>)}</div>
    <div className="ala-carte-message"><MessageCircle size={25} /><div><span>For subscribers</span><p>{services.subscriberMessage}</p></div><WhatsAppRequest content={content} label="Message Washd" /></div>
    <div className="ala-carte-notes"><article><CircleDollarSign size={19} /><p>{services.paymentNote}</p></article><article><Clock3 size={19} /><p>{services.scheduleNote}</p></article><article><Droplets size={19} /><p>{services.colourCareNote}</p></article><article><Sparkles size={19} /><p>{services.expressNote}</p></article></div>
    <div className="ala-carte-rules"><div><span className="kicker">Service rules</span><h3>Per-piece and one-off care</h3></div><div>{services.rules.map((rule) => <details key={rule.title}><summary>{rule.title}<ArrowRight size={16} /></summary><p>{rule.body}</p></details>)}</div></div>
  </section>;
}

export default function PlansPage() {
  const { user, loading: authLoading } = useAuth();
  const { content, plans, loading: contentLoading } = useSiteContent();
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [planChangeBusy, setPlanChangeBusy] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"success" | "cancelled" | "">("");

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const result = search.get("checkout");
    const plan = search.get("plan") || "";
    if (result === "success" || result === "cancelled") queueMicrotask(() => setStatus(result));
    if (plan) queueMicrotask(() => setSelectedPlanId(plan));
  }, []);

  useEffect(() => {
    if (authLoading || user || !selectedPlanId) return;
    const next = `/plans?plan=${encodeURIComponent(selectedPlanId)}`;
    window.location.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [authLoading, user, selectedPlanId]);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    queueMicrotask(() => { if (!cancelled) setMembershipLoading(true); });
    void supabase.from("profiles").select("subscription_status").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (!cancelled) {
        setMembershipStatus(data?.subscription_status || null);
        setMembershipLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [authLoading, user]);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
  const total = selectedPlan?.price_rm || 0;
  const hasCurrentSubscription = ["active", "trialing", "past_due", "unpaid", "paused"].includes(membershipStatus || "");

  function choosePlan(plan: Plan) {
    if (!user) {
      const next = `/plans?plan=${encodeURIComponent(plan.id)}`;
      window.location.assign(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    setSelectedPlanId(plan.id);
    setTermsAccepted(false);
    setError("");
    window.history.pushState({}, "", `/plans?plan=${encodeURIComponent(plan.id)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function makePayment() {
    if (!selectedPlan) return;
    if (!user) {
      const next = `/plans?plan=${encodeURIComponent(selectedPlan.id)}`;
      window.location.assign(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    setCheckoutBusy(true);
    setError("");
    try {
      if (!termsAccepted) throw new Error("TERMS_REQUIRED");
      if (!isSupabaseConfigured) throw new Error("Payment service is not configured");
      const origin = window.location.origin;
      const { data, error: checkoutError } = await supabase.functions.invoke<{ url: string }>("create-checkout-session", {
        body: {
          planId: selectedPlan.id,
          addonIds: [],
          termsAccepted: true,
          successUrl: `${origin}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/plans?plan=${encodeURIComponent(selectedPlan.id)}&checkout=cancelled`,
        },
      });
      if (checkoutError) {
        const response = (checkoutError as unknown as { context?: Response }).context;
        const problem = response ? await response.clone().json().catch(() => null) as { error?: unknown } | null : null;
        throw new Error(typeof problem?.error === "string" ? problem.error : checkoutError.message);
      }
      if (!data?.url?.startsWith("https://")) throw new Error("Missing secure checkout URL");
      window.location.assign(data.url);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "";
      const explanation = message === "TERMS_REQUIRED" || message === "Service terms must be accepted"
        ? "Tick the service-terms box before continuing to secure payment."
        : message === "Please log in first"
          ? "Please log in before starting secure payment."
          : message.startsWith("Stripe price is not configured")
            ? "This membership is not connected to Stripe yet. Please contact Washd while we complete its payment setup."
            : message === "Live checkout is not yet available"
              ? "Secure payment is being finalised and is not available yet. Please contact Washd for help."
              : message.includes("already have a subscription")
                ? message
                : "We couldn’t open secure payment. Please try again or contact Washd for help.";
      setError(explanation);
      setCheckoutBusy(false);
    }
  }

  async function openPlanManager() {
    setPlanChangeBusy(true);
    setError("");
    try {
      if (!isSupabaseConfigured) throw new Error("Billing service is not configured");
      const { data, error: portalError } = await supabase.functions.invoke<{ url: string }>("create-billing-portal-session", { body: { returnUrl: `${window.location.origin}/account` } });
      if (portalError) {
        const response = (portalError as unknown as { context?: Response }).context;
        const problem = response ? await response.clone().json().catch(() => null) as { error?: unknown } | null : null;
        throw new Error(typeof problem?.error === "string" ? problem.error : portalError.message);
      }
      if (!data?.url?.startsWith("https://")) throw new Error("Missing secure portal URL");
      window.location.assign(data.url);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "";
      setError(message === "Subscribe to a plan before managing billing" ? "Your membership is still being activated. Please wait a moment, then try again." : "We couldn’t open your secure plan manager. Please try again or contact Washd for help.");
      setPlanChangeBusy(false);
    }
  }

  function PlanCard({ plan, compact = false }: { plan: Plan; compact?: boolean }) {
    return (
      <article className={`${plan.popular ? "membership-card popular" : "membership-card"}${compact ? " compact" : ""}`}>
        {plan.popular && <span className="popular-tag">Most popular</span>}
        <h2>{plan.name}</h2><p>{plan.description}</p>
        <div className="plan-price"><span>RM</span><strong>{plan.price_rm}</strong><small>/ month</small></div>
        <ul>{plan.features.map((feature) => <li key={feature}><Check size={16} /> {feature}</li>)}</ul>
        <button className="button wide" type="button" disabled={authLoading || contentLoading || membershipLoading} onClick={() => choosePlan(plan)}>{user ? hasCurrentSubscription ? "Choose this plan" : "View plan details" : "Log in to subscribe"} <ArrowRight size={17} /></button>
      </article>
    );
  }

  if (selectedPlanId && (authLoading || !user)) {
    return <main className="member-page"><MemberHeader /><div className="account-loading">Opening your selected plan…</div></main>;
  }

  if (!selectedPlan) {
    return (
      <main className="member-page plans-page">
        <MemberHeader />
        <section className="plans-hero">
          <span className="kicker"><Sparkles size={14} /> {content.membership.eyebrow}</span>
          <h1>Choose your monthly<br /><em>laundry rhythm.</em></h1>
          <p>Select a plan, log in, then review every detail before payment.</p>
        </section>
        {status === "cancelled" && <div className="checkout-banner">Checkout was cancelled. No charge was made.</div>}
        <section className="membership-grid selection-grid">
          {plans.map((plan) => <PlanCard plan={plan} key={plan.id} />)}
          <article className="membership-card custom-membership-card">
            <span className="custom-plan-icon"><SlidersHorizontal size={25} /></span>
            <h2>{content.customPlan.title}</h2><p>{content.customPlan.body}</p>
            <ul>{content.customPlan.features.map((feature) => <li key={feature}><Check size={16} /> {feature}</li>)}</ul>
            <Link className="button wide" href="/#custom-enquiry">Send an enquiry <ArrowRight size={17} /></Link>
          </article>
        </section>
        <AlaCarteServices content={content} />
      </main>
    );
  }

  return (
    <main className="member-page plan-detail-page">
      <MemberHeader />
      <section className="plan-detail-hero">
        <button className="plan-back" type="button" onClick={() => { setSelectedPlanId(""); setTermsAccepted(false); window.history.pushState({}, "", "/plans"); }}><ArrowLeft size={16} /> All plans</button>
        <div className="plan-detail-grid">
          <div>
            <span className="kicker">Your selected membership</span>
            {selectedPlan.popular && <span className="detail-popular">Most popular</span>}
            <h1>{selectedPlan.name}</h1>
            <p>{selectedPlan.description}</p>
            <div className="detail-price"><span>RM</span><strong>{selectedPlan.price_rm}</strong><small>every month</small></div>
          </div>
          <div className="plan-includes">
            <span>Everything included</span>
            {selectedPlan.features.map((feature) => <div key={feature}><Check size={17} /> {feature}</div>)}
            <div><CalendarDays size={17} /> Fixed Mon / Wed / Fri building route</div>
            <div><PackageCheck size={17} /> Live bag tracking in your dashboard</div>
          </div>
        </div>
      </section>

      {status === "cancelled" && <div className="checkout-banner">Checkout was cancelled. Your selection is still here.</div>}

      <PlanClauses detail={content.planDetails[selectedPlan.id]} />

      <AlaCarteServices content={content} />

      <section className="other-plans-section">
        <div><span className="kicker">Compare before you decide</span><h2>Other memberships</h2></div>
        <div className="other-plans-grid">
          {plans.filter((plan) => plan.id !== selectedPlan.id).map((plan) => <PlanCard plan={plan} compact key={plan.id} />)}
          <article className="membership-card compact custom-membership-card"><span className="custom-plan-icon"><SlidersHorizontal size={23} /></span><h2>{content.customPlan.title}</h2><p>{content.customPlan.body}</p><Link className="button wide" href="/#custom-enquiry">Enquire <ArrowRight size={16} /></Link></article>
        </div>
      </section>

      <section className="payment-review" id="payment-review">
        <div>
          <span className="kicker">Final review</span><h2>Your Washd membership</h2>
          <div className="review-line"><span>{selectedPlan.name} plan</span><strong>RM {selectedPlan.price_rm}</strong></div>
          <div className="review-total"><span>Monthly total</span><strong>RM {total}</strong></div>
          <small>Renews monthly. Cancel with two weeks’ notice.</small>
        </div>
        {hasCurrentSubscription ? <div className="payment-action"><PackageCheck size={24} /><h3>Ready to change?</h3><p>You selected the {selectedPlan.name} plan. Continue to Stripe to confirm your change securely.</p><button className="button wide gold-button" type="button" disabled={planChangeBusy} onClick={() => void openPlanManager()}>{planChangeBusy ? "Opening plan manager…" : "Continue to Stripe"} <ArrowRight size={18} /></button><small>Stripe will show the available Washd plans and confirm the change before anything is updated.</small></div> : <div className="payment-action"><LockKeyhole size={24} /><h3>Ready to subscribe?</h3><p>You’ll continue to Stripe to enter your card details securely.</p><label className="terms-acceptance"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /><span>I have reviewed and agree to the <Link href="/terms" target="_blank">Service Terms</Link> and <Link href="/service-information" target="_blank">Service Information</Link>.</span></label>{!termsAccepted && <small className="terms-required-hint">Tick the agreement above to unlock secure payment.</small>}<button className="button wide gold-button" type="button" disabled={checkoutBusy || !termsAccepted} onClick={() => void makePayment()}>{checkoutBusy ? "Opening secure payment…" : "Make payment"} <ArrowRight size={18} /></button><small>Washd never stores your complete card number.</small></div>}
      </section>

      <button className="mobile-plan-bar" type="button" onClick={() => document.getElementById("payment-review")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
        <span><small>Your monthly plan</small><strong>RM {total}</strong></span><span>Review plan <ArrowRight size={17} /></span>
      </button>

      {error && <div className="checkout-error-popover" role="alert" aria-live="assertive">
        <AlertCircle size={21} />
        <p>{error}</p>
        {error.includes("already have a subscription") ? <Link className="checkout-error-action" href="/account">Go to my account <ArrowRight size={15} /></Link> : <button type="button" onClick={() => setError("")}>Okay</button>}
        <button className="checkout-error-close" type="button" onClick={() => setError("")} aria-label="Close message"><X size={17} /></button>
      </div>}
    </main>
  );
}
