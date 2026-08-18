"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, Clock3, Copy, CreditCard, LogOut, MapPin, PackageCheck, RefreshCw, Shirt, Sparkles, Truck, UserRound, X } from "lucide-react";
import { useAuth } from "../auth-provider";
import { MemberHeader } from "../member-header";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useSiteContent } from "../use-site-content";

type Profile = {
  name?: string;
  member_id?: string;
  plan_id?: string;
  active_addons?: string[];
  subscription_status?: string;
  payment_brand?: string;
  payment_last4?: string;
  unit?: string;
  current_period_end?: string;
  pickup_location?: { label?: string; notes?: string; weeklyPickupDay?: string };
};
type BagEvent = { status?: string; label?: string; at?: string };
type Bag = { id: string; status: string; cycle_started_at?: string; events?: BagEvent[]; updated_at?: string };
type Collection = { id: string; type: string; due: string; location: string; status: string };

const trackingSteps = [
  { key: "received", label: "Bag received", caption: "Checked and counted" },
  { key: "washing", label: "Cleaning", caption: "Washed separately" },
  { key: "finishing", label: "Finishing", caption: "Folded or pressed" },
  { key: "ready", label: "Ready", caption: "At your collection point" },
  { key: "collected", label: "Collected", caption: "Confirm you have collected your bag" },
];

function trackingIndex(status?: string) {
  const normalized = (status || "").toLowerCase().replaceAll("-", "_");
  if (["ready", "returned", "completed", "out_for_delivery"].includes(normalized)) return 3;
  if (["finishing", "drying", "folding", "pressing", "quality_check"].includes(normalized)) return 2;
  if (["washing", "cleaning", "in_progress"].includes(normalized)) return 1;
  if (["received", "collected", "picked_up", "checked_in"].includes(normalized)) return 0;
  return -1;
}

type PickupDay = "monday" | "wednesday";

function nextFixedDrop(pickupDay?: PickupDay) {
  const date = new Date();
  for (let days = 0; days < 8; days += 1) {
    const candidate = new Date(date);
    candidate.setDate(date.getDate() + days);
    candidate.setHours(9, 30, 0, 0);
    const allowedDay = pickupDay === "monday" ? 1 : pickupDay === "wednesday" ? 3 : undefined;
    if ((allowedDay ? candidate.getDay() === allowedDay : [1, 3].includes(candidate.getDay())) && candidate > date) return candidate;
  }
  return date;
}

function formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-MY", options || { weekday: "long", day: "numeric", month: "long" }).format(new Date(value));
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const { plans, addons } = useSiteContent();
  const [profile, setProfile] = useState<Profile>({});
  const [bag, setBag] = useState<Bag | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [billingBusy, setBillingBusy] = useState(false);
  const [error, setError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [memberIdCopied, setMemberIdCopied] = useState(false);
  const [pickupDayChoice, setPickupDayChoice] = useState<PickupDay | null>(null);
  const [pickupDayBusy, setPickupDayBusy] = useState(false);
  const [collectionConfirming, setCollectionConfirming] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!user) return;
    const [profileResult, bagResult, collectionResult] = await Promise.all([
      supabase.from("profiles").select("name, member_id, plan_id, active_addons, subscription_status, payment_brand, payment_last4, unit, current_period_end, pickup_location").eq("id", user.id).maybeSingle(),
      supabase.from("bags").select("id, status, cycle_started_at, events, updated_at").eq("user_id", user.id).order("cycle_started_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("collections").select("id, type, due, location, status").eq("user_id", user.id).gte("due", new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()).order("due").limit(1).maybeSingle(),
    ]);
    setProfile((profileResult.data ?? {}) as Profile);
    setBag((bagResult.data as Bag | null) ?? null);
    setCollection((collectionResult.data as Collection | null) ?? null);
    setDataLoading(false);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) window.location.replace("/login?next=/account");
    if (!user) return;
    queueMicrotask(() => void loadDashboard());
    const channel = supabase.channel(`member-tracking-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "bags", filter: `user_id=eq.${user.id}` }, () => void loadDashboard())
      .on("postgres_changes", { event: "*", schema: "public", table: "collections", filter: `user_id=eq.${user.id}` }, () => void loadDashboard())
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [user, loading, loadDashboard]);

  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get("checkout");
    if (result === "success") queueMicrotask(() => setCheckoutSuccess(true));
  }, []);

  async function manageBilling() {
    setBillingBusy(true);
    setError("");
    try {
      if (!isSupabaseConfigured) throw new Error("Billing service is not configured");
      const { data, error: portalError } = await supabase.functions.invoke<{ url: string }>("create-billing-portal-session", { body: { returnUrl: `${window.location.origin}/account` } });
      if (portalError) throw portalError;
      if (!data?.url?.startsWith("https://")) throw new Error("Missing secure portal URL");
      window.location.assign(data.url);
    } catch {
      setError("Billing management becomes available after your first membership payment is activated.");
    } finally {
      setBillingBusy(false);
    }
  }

  const activeStep = trackingIndex(bag?.status);
  const shouldShowTracking = Boolean(bag && !["empty", "collected"].includes(bag.status));
  const plan = plans.find((candidate) => candidate.id === profile.plan_id);
  const planName = plan?.name || profile.plan_id?.replaceAll("-", " ") || "No active plan";
  const activeAddonRows = addons.filter((addon) => profile.active_addons?.includes(addon.id));
  const weeklyPickupDay = profile.pickup_location?.weeklyPickupDay === "monday" || profile.pickup_location?.weeklyPickupDay === "wednesday"
    ? profile.pickup_location.weeklyPickupDay
    : undefined;
  const nextDrop = useMemo(() => nextFixedDrop(weeklyPickupDay), [weeklyPickupDay]);
  const nextDue = collection?.due || nextDrop;
  const latestEvent = bag?.events?.at(-1);
  const lastUpdated = bag?.updated_at || latestEvent?.at;
  const memberId = profile.member_id || "Assigning…";

  async function copyMemberId() {
    if (!profile.member_id) return;
    await navigator.clipboard.writeText(profile.member_id);
    setMemberIdCopied(true);
    window.setTimeout(() => setMemberIdCopied(false), 1800);
  }

  async function confirmPickupDay() {
    if (!user || !pickupDayChoice) return;
    setPickupDayBusy(true);
    setError("");
    const pickupLocation = typeof profile.pickup_location === "object" && profile.pickup_location ? profile.pickup_location : {};
    const { error: updateError } = await supabase.from("profiles").update({
      pickup_location: { ...pickupLocation, weeklyPickupDay: pickupDayChoice },
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    if (updateError) {
      setError("We couldn’t save your weekly pickup day. Please try again or contact Washd on WhatsApp.");
    } else {
      setProfile((current) => ({ ...current, pickup_location: { ...pickupLocation, weeklyPickupDay: pickupDayChoice } }));
      setPickupDayChoice(null);
    }
    setPickupDayBusy(false);
  }

  async function confirmBagCollection() {
    if (!bag || bag.status !== "ready") return;
    setCollectionConfirming(true);
    setError("");
    try {
      const { data, error: confirmError } = await supabase.functions.invoke<{ error?: string }>("member-confirm-bag-collection", { body: { bagId: bag.id } });
      if (confirmError || data?.error) throw new Error(data?.error || "Unable to confirm collection");
      await loadDashboard();
    } catch {
      setError("We couldn’t confirm collection yet. Please refresh and try again, or contact Washd on WhatsApp.");
    } finally {
      setCollectionConfirming(false);
    }
  }

  if (loading || !user) return <main className="member-page"><MemberHeader /><div className="account-loading">Loading your Washd dashboard…</div></main>;

  return (
    <main className="member-page account-page dashboard-page">
      <MemberHeader />
      <div className="dashboard-bubbles" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <section className="dashboard-title">
        <div className="dashboard-intro"><span className="kicker">Member dashboard</span><h1>Hello, {profile.name?.split(" ")[0] || user.user_metadata?.name?.split(" ")[0] || "member"}.</h1><p>Your laundry journey, next collection and membership in one place.</p></div>
        <div className="member-id-card">
          <div className="member-id-topline"><span>Washd member ID</span><i>Active member</i></div>
          <strong>{memberId}</strong>
          <div className="member-id-footer"><small>Keep this ID handy when contacting our care team.</small><button type="button" disabled={!profile.member_id} onClick={() => void copyMemberId()} aria-label="Copy member ID">{memberIdCopied ? <Check size={15} /> : <Copy size={15} />}{memberIdCopied ? "Copied" : "Copy"}</button></div>
        </div>
      </section>
      {checkoutSuccess && <div className="checkout-banner success"><Check size={19} /> Payment complete. Your new membership will appear here as soon as confirmation arrives.</div>}
      {error && <div className="checkout-banner error" role="alert">{error}</div>}

      {shouldShowTracking && <section className="tracking-card">
        <div className="tracking-topline"><div><span className="live-dot" /> Live bag tracking</div><button type="button" onClick={() => void loadDashboard()} disabled={dataLoading}><RefreshCw size={15} className={dataLoading ? "spin" : ""} /> Refresh</button></div>
        <div className="tracking-summary">
          <div><span>{`Bag ${bag?.id}`}</span><h2>{trackingSteps[Math.max(activeStep, 0)]?.label || "In our care"}</h2><p>{latestEvent?.label || "Your bag is moving through the Washd care process."}</p></div>
          <div className="return-estimate"><Clock3 size={20} /><span>Expected return</span><strong>{formatDate(nextDue, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</strong></div>
        </div>
        <div className="tracking-progress">
          {trackingSteps.map((step, index) => <div className={index < activeStep ? "done" : index === activeStep ? "active" : ""} key={step.key}><span>{index <= activeStep ? <Check size={15} /> : index + 1}</span><strong>{step.label}</strong><small>{step.caption}</small>{step.key === "collected" && bag?.status === "ready" && <button type="button" className="confirm-collection-button" disabled={collectionConfirming} onClick={() => void confirmBagCollection()}>{collectionConfirming ? "Saving…" : "Confirm collected"}</button>}</div>)}
        </div>
        <div className="tracking-footer"><span><Truck size={15} /> Updates appear here as our team scans your numbered bag.</span><small>{lastUpdated ? `Last update ${formatDate(lastUpdated, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}` : "Waiting for your first scan"}</small></div>
      </section>}

      <section className="dashboard-grid">
        <article className="dashboard-card collection-card"><div className="dashboard-card-icon"><CalendarDays size={22} /></div><span>Next collection</span><h3>{formatDate(nextDue)}</h3><p><Clock3 size={15} /> {collection ? formatDate(collection.due, { hour: "numeric", minute: "2-digit" }) : "Drop by 9:30am"}</p><p><MapPin size={15} /> {profile.unit || collection?.location || "Residence lobby"}</p><small>{collection ? collection.status : "Fixed weekly route"}</small></article>
        <article className="dashboard-card pickup-day-card"><div className="dashboard-card-icon"><CalendarDays size={22} /></div><span>Weekly pickup day</span>{weeklyPickupDay ? <><h3>Every {weeklyPickupDay === "monday" ? "Monday" : "Wednesday"}</h3><p>Your weekly Washd collection follows this fixed route.</p><p><Clock3 size={15} /> Drop by 9:30am</p><a className="text-button" href={`https://wa.me/60176494749?text=${encodeURIComponent("Hi Washd, I would like to request a change to my weekly pickup day.")}`} target="_blank" rel="noreferrer">Request a change on WhatsApp <ArrowRight size={16} /></a></> : <><h3>Choose your day</h3><p>Select one fixed weekly collection day. It cannot be changed online later.</p><div className="pickup-day-options"><button type="button" onClick={() => setPickupDayChoice("monday")}>Monday</button><button type="button" onClick={() => setPickupDayChoice("wednesday")}>Wednesday</button></div></>}</article>
        <article className="dashboard-card plan-dashboard-card"><div className="dashboard-card-icon"><PackageCheck size={22} /></div><span>Current membership</span><h3>{planName}</h3><p>{plan?.description || (profile.plan_id ? "Your active Washd membership" : "Choose a plan to begin weekly collections.")}</p>{activeAddonRows.length > 0 && <div className="active-addons">{activeAddonRows.map((addon) => <span key={addon.id}><Shirt size={13} /> {addon.name}</span>)}</div>}<a className="text-button" href="/plans">{profile.plan_id ? "View or change plan" : "Choose a plan"} <ArrowRight size={16} /></a></article>
        <article className="dashboard-card"><div className="dashboard-card-icon"><CreditCard size={22} /></div><span>Billing</span><h3>{profile.payment_last4 ? `${profile.payment_brand || "Card"} •••• ${profile.payment_last4}` : "No payment method"}</h3><p>{profile.current_period_end ? `Next renewal ${formatDate(profile.current_period_end)}` : "Your card details are entered only on secure checkout."}</p><button className="text-button" type="button" disabled={billingBusy || !profile.payment_last4} onClick={() => void manageBilling()}>{billingBusy ? "Opening…" : profile.payment_last4 ? "Manage billing" : "Available after payment"} {profile.payment_last4 && <ArrowRight size={16} />}</button></article>
        <article className="dashboard-card member-profile-card"><div className="dashboard-card-icon"><UserRound size={22} /></div><span>Member profile</span><h3>{profile.name || user.user_metadata?.name || "Washd member"}</h3><p>{user.email}</p><p>{profile.unit || "Residence lobby"}</p><button className="text-button logout-button" type="button" onClick={async () => { await supabase.auth.signOut(); window.location.assign("/"); }}><LogOut size={15} /> Log out</button></article>
      </section>

      <section className="dashboard-help"><Sparkles size={22} /><div><span>Need help with a collection?</span><p>Share your member ID and bag number with the Washd team for the fastest assistance.</p></div><a href="https://wa.me/60176494749" target="_blank" rel="noreferrer">Message Washd <ArrowRight size={16} /></a></section>
      {pickupDayChoice && <div className="pickup-day-modal-backdrop" role="presentation" onClick={() => !pickupDayBusy && setPickupDayChoice(null)}>
        <section className="pickup-day-modal" role="dialog" aria-modal="true" aria-labelledby="pickup-day-title" onClick={(event) => event.stopPropagation()}>
          <button className="pickup-day-modal-close" type="button" onClick={() => setPickupDayChoice(null)} disabled={pickupDayBusy} aria-label="Close pickup-day confirmation"><X size={20} /></button>
          <span className="kicker">Confirm weekly pickup day</span>
          <CalendarDays size={30} />
          <h2 id="pickup-day-title">Every {pickupDayChoice === "monday" ? "Monday" : "Wednesday"}</h2>
          <p>This will be your weekly laundry pickup date. Your collection will follow this same day every week.</p>
          <div className="pickup-day-modal-note">If you need to change your pickup day later, please contact Washd on WhatsApp.</div>
          <div className="pickup-day-modal-actions"><button type="button" onClick={() => setPickupDayChoice(null)} disabled={pickupDayBusy}>Back</button><button className="button gold-button" type="button" onClick={() => void confirmPickupDay()} disabled={pickupDayBusy}>{pickupDayBusy ? "Saving…" : `Confirm ${pickupDayChoice === "monday" ? "Monday" : "Wednesday"}`} <ArrowRight size={17} /></button></div>
        </section>
      </div>}
    </main>
  );
}
