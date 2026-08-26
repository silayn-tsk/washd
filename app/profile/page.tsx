"use client";

import { useEffect, useState } from "react";
import { Check, KeyRound, LoaderCircle, LogOut, Mail, MapPin, Save, UserRound } from "lucide-react";
import { useAuth } from "../auth-provider";
import { MemberHeader } from "../member-header";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useSiteContent } from "../use-site-content";

type Profile = {
  member_id?: string;
  name?: string;
  email?: string;
  unit?: string;
  pickup_location?: { label?: string; notes?: string; weeklyPickupDay?: string };
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { content } = useSiteContent();
  const [profile, setProfile] = useState<Profile>({});
  const [name, setName] = useState("");
  const [residence, setResidence] = useState("");
  const [unit, setUnit] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) window.location.replace("/login?next=/profile");
    if (!user) return;
    void supabase.from("profiles").select("member_id, name, email, unit, pickup_location").eq("id", user.id).maybeSingle().then(({ data }) => {
      const next = (data || {}) as Profile;
      const location = next.pickup_location || {};
      setProfile(next);
      setName(next.name || user.user_metadata?.name || "");
      const savedResidence = location.label || "";
      setResidence(content.residences.options.includes(savedResidence) ? savedResidence : "");
      setUnit(location.notes || next.unit?.split(" · ").at(-1) || "");
      setPageLoading(false);
    });
  }, [user, loading, content.residences.options]);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setNotice("");
    setError("");
    const pickupLabel = [residence.trim(), unit.trim()].filter(Boolean).join(" · ");
    const { data: savedProfile, error: updateError } = await supabase.from("profiles").update({
      name: name.trim(),
      unit: pickupLabel,
      // Keep the member's fixed weekly pickup day when they update residence details.
      pickup_location: { ...(profile.pickup_location || {}), label: residence.trim(), notes: unit.trim() },
      updated_at: new Date().toISOString(),
    }).eq("id", user.id).select("member_id, name, email, unit, pickup_location").maybeSingle();
    setSaving(false);
    if (updateError || !savedProfile) { setError("We couldn’t save your profile. Please sign out, log in again, and retry."); return; }
    setProfile(savedProfile as Profile);
    setNotice("Your member profile is updated.");
  }

  async function sendPasswordReset() {
    if (!user?.email || !isSupabaseConfigured) return;
    setPasswordBusy(true);
    setNotice("");
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: `${window.location.origin}/reset-password` });
    setPasswordBusy(false);
    if (resetError) { setError("We couldn’t send the password-reset email. Please try again."); return; }
    setNotice("A password-reset link has been sent to your email.");
  }

  if (loading || !user || pageLoading) return <main className="member-page dashboard-page"><MemberHeader /><div className="account-loading"><LoaderCircle className="spin" /> Loading your profile…</div></main>;

  return <main className="member-page dashboard-page profile-page">
    <MemberHeader />
    <div className="dashboard-bubbles profile-bubbles" aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <section className="profile-hero">
      <div><span className="kicker">Member profile</span><h1>Your Washd details.</h1><p>Keep your residence and collection details up to date.</p></div>
      <aside className="profile-member-id"><span>Washd member ID</span><strong>{profile.member_id || "Assigning…"}</strong><small>Use this ID whenever you contact our care team.</small></aside>
    </section>
    <section className="profile-layout">
      <form className="profile-card profile-form" onSubmit={saveProfile}>
        <div className="profile-card-heading"><div className="profile-icon"><UserRound size={22} /></div><div><span>Personal details</span><h2>Profile information</h2></div></div>
        <label>Full name<input required minLength={2} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label>Email address<input value={user.email || ""} readOnly aria-readonly="true" /><small>Email is managed securely through your Washd sign-in.</small></label>
        <div className="profile-field-row"><label>Residence<select required value={residence} onChange={(event) => setResidence(event.target.value)}><option value="" disabled>Select your residence</option>{content.residences.options.map((option) => <option value={option} key={option}>{option}</option>)}</select><small>Select an approved Washd residence, then save your profile.</small></label><label>Unit / apartment<input required value={unit} onChange={(event) => setUnit(event.target.value)} placeholder="e.g. Unit 12-3" /></label></div>
        {error && <div className="profile-alert error" role="alert">{error}</div>}{notice && <div className="profile-alert success"><Check size={17} /> {notice}</div>}
        <button className="button profile-save" type="submit" disabled={saving}>{saving ? <><LoaderCircle className="spin" size={17} /> Saving…</> : <><Save size={17} /> Save profile</>}</button>
      </form>
      <aside className="profile-side-stack">
        <section className="profile-card profile-contact-card"><div className="profile-card-heading"><div className="profile-icon"><MapPin size={22} /></div><div><span>Account contact</span><h2>Your Washd details</h2></div></div><p>Keep these details accurate so our care team can identify your collection and assist you quickly.</p><div className="profile-contact-detail"><MapPin size={17} /><span>{[residence, unit].filter(Boolean).join(" · ") || "Choose your residence"}</span></div><div className="profile-contact-detail"><Mail size={17} /><span>{user.email}</span></div></section>
        <section className="profile-card profile-security-card"><div className="profile-card-heading"><div className="profile-icon"><KeyRound size={22} /></div><div><span>Security</span><h2>Password and sign-in</h2></div></div><p>For your safety, we’ll send a reset link to your registered email address.</p><button className="text-button" type="button" disabled={passwordBusy} onClick={() => void sendPasswordReset()}>{passwordBusy ? "Sending…" : "Change password"} <KeyRound size={15} /></button><button className="text-button logout-button" type="button" onClick={async () => { await supabase.auth.signOut(); window.location.assign("/"); }}><LogOut size={15} /> Log out</button></section>
      </aside>
    </section>
  </main>;
}
