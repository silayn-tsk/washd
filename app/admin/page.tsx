"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ExternalLink, LoaderCircle, LockKeyhole, LogOut, Save, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../auth-provider";
import { defaultAddons, defaultPlans, defaultSiteContent, mergeSiteContent, type Plan, type PlanAddon, type SiteContent } from "@/lib/site-content";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { redirectForAdminMfa, resolveAdminAccess } from "@/lib/admin-access";

type PathPart = string | number;
type EditableValue = string | number | boolean | null | EditableValue[] | { [key: string]: EditableValue };

const sectionLabels: Record<string, string> = {
  brand: "Brand",
  hero: "Hero",
  schedule: "Weekly schedule",
  burden: "Customer problem",
  heritage: "Since 1964 story",
  routine: "How it works",
  services: "Services",
  membership: "Membership introduction",
  customPlan: "Custom plan",
  safety: "Safety promise",
  benefits: "Member benefits",
  building: "Building partners",
  faq: "Frequently asked questions",
  enquiry: "Custom-plan enquiry",
  finalCta: "Final call to action",
  contact: "Contact details",
};

const ownerEmail = "washdmy@gmail.com";

function fieldLabel(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase());
}

function setNestedValue<T>(source: T, path: PathPart[], value: EditableValue): T {
  const copy = structuredClone(source) as Record<string | number, unknown>;
  let cursor = copy;
  path.slice(0, -1).forEach((part) => { cursor = cursor[part] as Record<string | number, unknown>; });
  cursor[path[path.length - 1]] = value;
  return copy as T;
}

function ContentFields({ value, path, onChange }: { value: EditableValue; path: PathPart[]; onChange: (path: PathPart[], value: EditableValue) => void }) {
  if (Array.isArray(value)) {
    return <div className="admin-array">{value.map((item, index) => <div className="admin-array-item" key={index}><span className="admin-item-number">{index + 1}</span><ContentFields value={item} path={[...path, index]} onChange={onChange} /></div>)}</div>;
  }
  if (value && typeof value === "object") {
    return <div className="admin-fields">{Object.entries(value).map(([key, child]) => <ContentFields key={key} value={child} path={[...path, key]} onChange={onChange} />)}</div>;
  }

  const key = String(path[path.length - 1]);
  const label = fieldLabel(key);
  if (typeof value === "boolean") {
    return <label className="admin-checkbox"><input type="checkbox" checked={value} onChange={(event) => onChange(path, event.target.checked)} /><span>{label}</span></label>;
  }
  if (typeof value === "number") {
    return <label className="admin-field"><span>{label}</span><input type="number" value={value} onChange={(event) => onChange(path, Number(event.target.value))} /></label>;
  }
  const text = String(value ?? "");
  const multiline = text.length > 64 || ["body", "intro", "footer"].includes(key);
  return <label className={multiline ? "admin-field full" : "admin-field"}><span>{label}</span>{multiline ? <textarea value={text} onChange={(event) => onChange(path, event.target.value)} /> : <input value={text} onChange={(event) => onChange(path, event.target.value)} />}</label>;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [addons, setAddons] = useState<PlanAddon[]>(defaultAddons);
  const [activeSection, setActiveSection] = useState("brand");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) window.location.replace("/login?next=/admin");
    if (!user || !isSupabaseConfigured) return;

    void Promise.all([
      resolveAdminAccess(),
      supabase.from("site_content").select("content").eq("key", "main").maybeSingle(),
      supabase.from("plans").select("id, name, description, price_rm, popular, features, sort_order, stripe_price_id").eq("active", true).order("sort_order"),
      supabase.from("plan_addons").select("id, name, description, price_rm, active, sort_order, stripe_price_id").eq("active", true).order("sort_order"),
    ]).then(([access, contentResult, plansResult, addonsResult]) => {
      if (access === "mfa") { redirectForAdminMfa("/admin"); return; }
      const canEdit = access === "allowed";
      setAllowed(canEdit);
      if (!canEdit) return;
      if (contentResult.data?.content) setContent(mergeSiteContent(contentResult.data.content));
      if (plansResult.data?.length) setPlans(plansResult.data as Plan[]);
      if (addonsResult.data?.length) setAddons(addonsResult.data as PlanAddon[]);
    });
  }, [user, authLoading]);

  function updateContent(path: PathPart[], value: EditableValue) {
    setContent((current) => setNestedValue(current, path, value));
    setNotice("");
  }

  function updatePlan(index: number, key: keyof Plan, value: string | number | boolean | string[]) {
    setPlans((current) => current.map((plan, planIndex) => planIndex === index ? { ...plan, [key]: value } : plan));
    setNotice("");
  }

  function updateAddon(index: number, key: keyof PlanAddon, value: string | number | boolean) {
    setAddons((current) => current.map((addon, addonIndex) => addonIndex === index ? { ...addon, [key]: value } : addon));
    setNotice("");
  }

  async function saveEverything() {
    if (!user || !allowed) return;
    setSaving(true);
    setError("");
    setNotice("");

    const contentResult = await supabase.from("site_content").update({ content, updated_by: user.id, updated_at: new Date().toISOString() }).eq("key", "main");
    if (contentResult.error) {
      setError("The website content could not be saved. Please try again.");
      setSaving(false);
      return;
    }

    const { data, error: planError } = await supabase.functions.invoke<{ plans?: Plan[]; addons?: PlanAddon[]; error?: string }>("admin-save-plans", {
      body: {
        plans: plans.map((plan) => ({ id: plan.id, name: plan.name, description: plan.description, price_rm: plan.price_rm, popular: plan.popular, features: plan.features })),
        addons: addons.map((addon) => ({ id: addon.id, name: addon.name, description: addon.description, price_rm: addon.price_rm, active: addon.active })),
      },
    });

    setSaving(false);
    if (planError || data?.error) {
      setError("Website copy was saved, but the plans could not be synced with Stripe. No plan price was changed at checkout.");
      return;
    }
    if (data?.plans) setPlans(data.plans);
    if (data?.addons) setAddons(data.addons);
    setNotice("Saved. The public website and Stripe plan prices are now in sync.");
  }

  if (authLoading || (user && allowed === null)) {
    return <main className="admin-state"><LoaderCircle className="spin" /><p>Opening the Washd editor…</p></main>;
  }
  if (!user) return null;
  if (!allowed) {
    return <main className="admin-state"><ShieldAlert size={42} /><h1>Admin access required</h1><p>Sign in with the Washd owner account ({ownerEmail}) to edit the website.</p><div><Link className="deck-button" href="/">Back to website</Link><button className="admin-link-button" type="button" onClick={async () => { await supabase.auth.signOut(); window.location.assign("/login?next=/admin"); }}>Use another account</button></div></main>;
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><Link className="admin-brand" href="/"><span>washd. admin</span></Link><span className="admin-secure"><LockKeyhole size={13} /> Owner only</span></div>
        <div><a className="admin-preview" href="/" target="_blank">View website <ExternalLink size={15} /></a><button className="admin-save" type="button" disabled={saving} onClick={() => void saveEverything()}>{saving ? <><LoaderCircle className="spin" size={17} /> Saving…</> : <><Save size={17} /> Save all changes</>}</button></div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <Link href="/"><ArrowLeft size={15} /> Back to site</Link>
          <strong>Website content</strong>
          {Object.keys(sectionLabels).map((key) => <button className={activeSection === key ? "active" : ""} type="button" key={key} onClick={() => setActiveSection(key)}>{sectionLabels[key]}</button>)}
          <strong>Commerce</strong>
          <button className={activeSection === "plans" ? "active" : ""} type="button" onClick={() => setActiveSection("plans")}>Membership plans</button>
          <button className={activeSection === "addons" ? "active" : ""} type="button" onClick={() => setActiveSection("addons")}>À-la-carte add-ons</button>
          <strong>Operations</strong>
          <Link href="/admin/tracking">Member tracking</Link>
          <Link href="/admin/enquiries">Enquiry inbox</Link>
          <Link href="/admin/payments">Payment health</Link>
          <Link href="/admin/security">Security & MFA</Link>
          <button className="admin-logout" type="button" onClick={async () => { await supabase.auth.signOut(); window.location.assign("/"); }}><LogOut size={15} /> Log out</button>
        </aside>

        <section className="admin-editor">
          <div className="admin-editor-title"><span>Editing</span><h1>{activeSection === "plans" ? "Membership plans" : activeSection === "addons" ? "À-la-carte add-ons" : sectionLabels[activeSection]}</h1><p>Changes go live after you choose “Save all changes”.</p></div>
          {notice && <div className="admin-notice success"><CheckCircle2 size={18} /> {notice}</div>}
          {error && <div className="admin-notice error"><ShieldAlert size={18} /> {error}</div>}

          {activeSection === "plans" ? (
            <div className="admin-plan-list">
              {plans.map((plan, index) => (
                <article className="admin-plan-card" key={plan.id}>
                  <div className="admin-plan-heading"><span>Plan {index + 1}</span><label className="admin-checkbox"><input type="checkbox" checked={plan.popular} onChange={(event) => updatePlan(index, "popular", event.target.checked)} /><span>Most popular</span></label></div>
                  <div className="admin-fields">
                    <label className="admin-field"><span>Name</span><input value={plan.name} onChange={(event) => updatePlan(index, "name", event.target.value)} /></label>
                    <label className="admin-field"><span>Monthly price (RM)</span><input type="number" min={1} max={5000} value={plan.price_rm} onChange={(event) => updatePlan(index, "price_rm", Number(event.target.value))} /></label>
                    <label className="admin-field full"><span>Description</span><textarea value={plan.description} onChange={(event) => updatePlan(index, "description", event.target.value)} /></label>
                    <label className="admin-field full"><span>Features (one per line)</span><textarea value={plan.features.join("\n")} onChange={(event) => updatePlan(index, "features", event.target.value.split("\n").filter(Boolean))} /></label>
                  </div>
                  <small>Changing the price creates a matching monthly price in Stripe when you save.</small>
                </article>
              ))}
            </div>
          ) : activeSection === "addons" ? (
            <div className="admin-plan-list">
              {addons.map((addon, index) => (
                <article className="admin-plan-card" key={addon.id}>
                  <div className="admin-plan-heading"><span>Add-on {index + 1}</span><label className="admin-checkbox"><input type="checkbox" checked={addon.active} onChange={(event) => updateAddon(index, "active", event.target.checked)} /><span>Available</span></label></div>
                  <div className="admin-fields"><label className="admin-field"><span>Name</span><input value={addon.name} onChange={(event) => updateAddon(index, "name", event.target.value)} /></label><label className="admin-field"><span>Monthly price (RM)</span><input type="number" min={1} max={5000} value={addon.price_rm} onChange={(event) => updateAddon(index, "price_rm", Number(event.target.value))} /></label><label className="admin-field full"><span>Description</span><textarea value={addon.description} onChange={(event) => updateAddon(index, "description", event.target.value)} /></label></div>
                  <small>Price changes create a matching recurring Stripe price when you save.</small>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-section-card">
              <ContentFields value={content[activeSection as keyof SiteContent] as EditableValue} path={[activeSection]} onChange={updateContent} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
