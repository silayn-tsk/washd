"use client";

import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { ArrowRight, Check, LockKeyhole, Sparkles } from "lucide-react";
import { useAuth } from "../auth-provider";
import { MemberHeader } from "../member-header";
import { functions } from "@/lib/firebase";

const plans = [
  { id: "everyday", name: "Everyday", price: 89, note: "1 wash & fold bag / week", features: ["Weekly wash & fold bag", "Lobby collection", "48-hour return"] },
  { id: "everyday-plus", name: "Everyday Plus", price: 139, note: "2 wash & fold bags / week", features: ["Two weekly bags", "Priority processing", "WhatsApp reminders"] },
  { id: "professional", name: "Professional", price: 169, note: "1 bag + 3 pressed / week", popular: true, features: ["Weekly bag", "Three pressed pieces", "Priority support"] },
  { id: "executive", name: "Executive", price: 239, note: "1 bag + 6 pressed / week", features: ["Weekly bag", "Six pressed pieces", "Concierge handling"] },
];

export default function PlansPage() {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"success" | "cancelled" | "">("");

  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get("checkout");
    if (result === "success" || result === "cancelled") setStatus(result);
  }, []);

  async function subscribe(planId: string) {
    if (!user) {
      window.location.assign("/login?next=/plans");
      return;
    }
    setSelected(planId);
    setError("");
    try {
      const createCheckout = httpsCallable<
        { planId: string; successUrl: string; cancelUrl: string },
        { url: string }
      >(functions, "createCheckoutSession");
      const origin = window.location.origin;
      const result = await createCheckout({
        planId,
        successUrl: `${origin}/plans?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/plans?checkout=cancelled`,
      });
      if (!result.data.url?.startsWith("https://")) throw new Error("Missing secure checkout URL");
      window.location.assign(result.data.url);
    } catch (caught) {
      const code = (caught as { code?: string }).code ?? "";
      setError(code.includes("failed-precondition") ? "This plan’s Stripe price still needs to be activated." : "Secure checkout is not active yet. Your account is ready, but the payment backend still needs its Stripe configuration.");
      setSelected("");
    }
  }

  return (
    <main className="member-page">
      <MemberHeader />
      <section className="plans-hero">
        <span className="kicker"><Sparkles size={14} /> Washd membership</span>
        <h1>A plan for every<br /><em>laundry rhythm.</em></h1>
        <p>Choose your weekly care level. Checkout is securely hosted by Stripe, and you can manage billing anytime.</p>
      </section>
      {status === "success" && <div className="checkout-banner success"><Check size={19} /> Payment complete. Your Washd account will update as soon as Stripe confirms the subscription.</div>}
      {status === "cancelled" && <div className="checkout-banner">Checkout was cancelled. No charge was made.</div>}
      {error && <div className="checkout-banner error" role="alert">{error}</div>}
      <section className="membership-grid">
        {plans.map((plan) => (
          <article className={plan.popular ? "membership-card popular" : "membership-card"} key={plan.id}>
            {plan.popular && <span className="popular-tag">Most popular</span>}
            <h2>{plan.name}</h2><p>{plan.note}</p>
            <div className="plan-price"><span>RM</span><strong>{plan.price}</strong><small>/ month</small></div>
            <ul>{plan.features.map((feature) => <li key={feature}><Check size={16} /> {feature}</li>)}</ul>
            <button className="button wide" type="button" disabled={loading || selected === plan.id} onClick={() => void subscribe(plan.id)}>{selected === plan.id ? "Opening secure checkout…" : <>{user ? "Choose this plan" : "Log in to subscribe"} <ArrowRight size={17} /></>}</button>
          </article>
        ))}
      </section>
      <div className="stripe-trust"><LockKeyhole size={16} /> Payments are processed on Stripe’s secure checkout. Washd never stores your card number.</div>
    </main>
  );
}
