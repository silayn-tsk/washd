"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, LockKeyhole, PackageCheck, Shirt, SlidersHorizontal, Sparkles } from "lucide-react";
import { useAuth } from "../auth-provider";
import Link from "next/link";
import { MemberHeader } from "../member-header";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useSiteContent } from "../use-site-content";
import type { Plan } from "@/lib/site-content";

export default function PlansPage() {
  const { user, loading: authLoading } = useAuth();
  const { content, plans, addons, loading: contentLoading } = useSiteContent();
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
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

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
  const selectedAddonRows = addons.filter((addon) => selectedAddons.includes(addon.id));
  const total = (selectedPlan?.price_rm || 0) + selectedAddonRows.reduce((sum, addon) => sum + addon.price_rm, 0);

  function choosePlan(plan: Plan) {
    if (!user) {
      const next = `/plans?plan=${encodeURIComponent(plan.id)}`;
      window.location.assign(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    setSelectedPlanId(plan.id);
    setSelectedAddons([]);
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
          addonIds: selectedAddons,
          termsAccepted: true,
          successUrl: `${origin}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/plans?plan=${encodeURIComponent(selectedPlan.id)}&checkout=cancelled`,
        },
      });
      if (checkoutError) throw checkoutError;
      if (!data?.url?.startsWith("https://")) throw new Error("Missing secure checkout URL");
      window.location.assign(data.url);
    } catch (caught) {
      setError(caught instanceof Error && caught.message === "TERMS_REQUIRED" ? "Review and accept the service terms before continuing to payment." : "We couldn’t open secure payment. Please try again or contact Washd for help.");
      setCheckoutBusy(false);
    }
  }

  function PlanCard({ plan, compact = false }: { plan: Plan; compact?: boolean }) {
    return (
      <article className={`${plan.popular ? "membership-card popular" : "membership-card"}${compact ? " compact" : ""}`}>
        {plan.popular && <span className="popular-tag">Most popular</span>}
        <h2>{plan.name}</h2><p>{plan.description}</p>
        <div className="plan-price"><span>RM</span><strong>{plan.price_rm}</strong><small>/ month</small></div>
        <ul>{plan.features.map((feature) => <li key={feature}><Check size={16} /> {feature}</li>)}</ul>
        <button className="button wide" type="button" disabled={authLoading || contentLoading} onClick={() => choosePlan(plan)}>{user ? "View plan details" : "Log in to subscribe"} <ArrowRight size={17} /></button>
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
          <p>Select a plan, log in, then review every detail and optional add-on before payment.</p>
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
      </main>
    );
  }

  return (
    <main className="member-page plan-detail-page">
      <MemberHeader />
      <section className="plan-detail-hero">
        <button className="plan-back" type="button" onClick={() => { setSelectedPlanId(""); setSelectedAddons([]); setTermsAccepted(false); window.history.pushState({}, "", "/plans"); }}><ArrowLeft size={16} /> All plans</button>
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
      {error && <div className="checkout-banner error" role="alert">{error}</div>}

      <section className="addons-section">
        <div className="addons-heading"><div><span className="kicker">À-la-carte add-ons</span><h2>Make the plan fit your week.</h2></div><p>Optional monthly additions. Select only what you need and see your total before payment.</p></div>
        <div className="addons-grid">
          {addons.map((addon, index) => {
            const checked = selectedAddons.includes(addon.id);
            return (
              <label className={checked ? "addon-card selected" : "addon-card"} key={addon.id}>
                <input type="checkbox" checked={checked} onChange={() => setSelectedAddons((current) => checked ? current.filter((id) => id !== addon.id) : [...current, addon.id])} />
                <span className="addon-icon">{index % 2 === 0 ? <Shirt size={21} /> : <PackageCheck size={21} />}</span>
                <strong>{addon.name}</strong><p>{addon.description}</p>
                <div><span>+ RM {addon.price_rm}</span><small>/ month</small><i>{checked ? <Check size={15} /> : "+"}</i></div>
              </label>
            );
          })}
        </div>
      </section>

      <section className="other-plans-section">
        <div><span className="kicker">Compare before you decide</span><h2>Other memberships</h2></div>
        <div className="other-plans-grid">
          {plans.filter((plan) => plan.id !== selectedPlan.id).map((plan) => <PlanCard plan={plan} compact key={plan.id} />)}
          <article className="membership-card compact custom-membership-card"><span className="custom-plan-icon"><SlidersHorizontal size={23} /></span><h2>{content.customPlan.title}</h2><p>{content.customPlan.body}</p><Link className="button wide" href="/#custom-enquiry">Enquire <ArrowRight size={16} /></Link></article>
        </div>
      </section>

      <section className="payment-review">
        <div>
          <span className="kicker">Final review</span><h2>Your Washd membership</h2>
          <div className="review-line"><span>{selectedPlan.name} plan</span><strong>RM {selectedPlan.price_rm}</strong></div>
          {selectedAddonRows.map((addon) => <div className="review-line addon" key={addon.id}><span>{addon.name}</span><strong>RM {addon.price_rm}</strong></div>)}
          <div className="review-total"><span>Monthly total</span><strong>RM {total}</strong></div>
          <small>Renews monthly. Cancel with two weeks’ notice. Add-ons renew with your selected plan.</small>
        </div>
        <div className="payment-action"><LockKeyhole size={24} /><h3>Ready to subscribe?</h3><p>You’ll continue to Stripe to enter your card details securely.</p><label className="terms-acceptance"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /><span>I have reviewed and agree to the <Link href="/terms" target="_blank">Service Terms</Link> and <Link href="/service-information" target="_blank">Service Information</Link>. <Link href="/maklumat-perkhidmatan" target="_blank">Bahasa Malaysia</Link></span></label><button className="button wide gold-button" type="button" disabled={checkoutBusy || !termsAccepted} onClick={() => void makePayment()}>{checkoutBusy ? "Opening secure payment…" : "Make payment"} <ArrowRight size={18} /></button><small>Washd never stores your complete card number.</small></div>
      </section>
    </main>
  );
}
