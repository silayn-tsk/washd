"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, LoaderCircle, PackageCheck, Save, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../auth-provider";
import { supabase } from "@/lib/supabase";
import { redirectForAdminMfa, resolveAdminAccess } from "@/lib/admin-access";

type Member = { id: string; member_id: string; name?: string; email?: string; unit?: string };
type Bag = { user_id: string; id: string; status: string; updated_at: string };
type Collection = { user_id: string; due: string; location: string; status: string };

function defaultReturnDate() {
  const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  date.setHours(17, 30, 0, 0);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default function AdminTrackingPage() {
  const { user, loading: authLoading } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [bags, setBags] = useState<Bag[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [bagId, setBagId] = useState("");
  const [status, setStatus] = useState("received");
  const [collectionDue, setCollectionDue] = useState(defaultReturnDate());
  const [location, setLocation] = useState("Residence lobby");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadOperations = useCallback(async () => {
    const [memberResult, bagResult, collectionResult] = await Promise.all([
      supabase.from("profiles").select("id, member_id, name, email, unit").order("member_id"),
      supabase.from("bags").select("user_id, id, status, updated_at").order("updated_at", { ascending: false }),
      supabase.from("collections").select("user_id, due, location, status").gte("due", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).order("due"),
    ]);
    setMembers((memberResult.data || []) as Member[]);
    setBags((bagResult.data || []) as Bag[]);
    setCollections((collectionResult.data || []) as Collection[]);
    if (memberResult.data?.[0]) setSelectedId((current) => current || memberResult.data[0].id);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) window.location.replace("/login?next=/admin/tracking");
    if (!user) return;
    void resolveAdminAccess().then((access) => {
      if (access === "mfa") { redirectForAdminMfa("/admin/tracking"); return; }
      const canEdit = access === "allowed";
      setAllowed(canEdit);
      if (canEdit) void loadOperations();
    });
  }, [user, authLoading, loadOperations]);

  const selectedMember = members.find((member) => member.id === selectedId);
  const memberBag = useMemo(() => bags.find((bag) => bag.user_id === selectedId), [bags, selectedId]);
  const memberCollection = useMemo(() => collections.find((item) => item.user_id === selectedId), [collections, selectedId]);

  useEffect(() => {
    if (!selectedMember) return;
    queueMicrotask(() => {
      setBagId(memberBag?.id || `WSHD-${selectedMember.member_id.replace(/\D/g, "").padStart(2, "0")}`);
      setStatus(memberBag?.status || "received");
      setLocation(memberCollection?.location || selectedMember.unit || "Residence lobby");
      if (memberCollection?.due) {
        const date = new Date(memberCollection.due);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        setCollectionDue(local.toISOString().slice(0, 16));
      } else setCollectionDue(defaultReturnDate());
    });
  }, [selectedMember, memberBag, memberCollection]);

  async function saveTracking() {
    if (!selectedMember) return;
    setBusy(true); setError(""); setNotice("");
    const { data, error: updateError } = await supabase.functions.invoke<{ error?: string }>("admin-update-tracking", {
      body: { memberId: selectedMember.id, bagId, status, collectionDue: new Date(collectionDue).toISOString(), location },
    });
    setBusy(false);
    if (updateError || data?.error) { setError(data?.error || "Tracking could not be updated."); return; }
    setNotice(`${selectedMember.member_id} now shows “${status}” in the live dashboard.`);
    await loadOperations();
  }

  if (authLoading || (user && allowed === null)) return <main className="admin-state"><LoaderCircle className="spin" /><p>Opening member operations…</p></main>;
  if (!user) return null;
  if (!allowed) return <main className="admin-state"><ShieldAlert size={42} /><h1>Admin access required</h1><Link className="deck-button" href="/admin">Return to admin</Link></main>;

  return (
    <main className="admin-page tracking-admin-page">
      <header className="admin-header"><div><Link className="admin-brand" href="/admin"><span>washd. operations</span></Link></div><div><Link className="admin-preview" href="/admin"><ArrowLeft size={15} /> Website editor</Link><button className="admin-save" type="button" disabled={busy || !selectedMember} onClick={() => void saveTracking()}>{busy ? <><LoaderCircle className="spin" size={17} /> Updating…</> : <><Save size={17} /> Update live tracking</>}</button></div></header>
      <div className="tracking-admin-layout">
        <aside className="member-operations-list"><span>Members</span>{members.map((member) => <button className={selectedId === member.id ? "active" : ""} type="button" key={member.id} onClick={() => { setSelectedId(member.id); setNotice(""); setError(""); }}><strong>{member.member_id}</strong><span>{member.name || member.email}</span></button>)}</aside>
        <section className="tracking-admin-editor">
          <span className="kicker">Live member tracking</span><h1>{selectedMember?.name || "Choose a member"}</h1><p>{selectedMember?.member_id} · {selectedMember?.email}</p>
          {notice && <div className="admin-notice success"><CheckCircle2 size={18} /> {notice}</div>}{error && <div className="admin-notice error"><ShieldAlert size={18} /> {error}</div>}
          {selectedMember && <div className="tracking-admin-card"><div className="tracking-admin-current"><PackageCheck size={28} /><div><span>Currently visible</span><strong>{memberBag?.status || "No bag yet"}</strong><small>{memberBag?.id || "Create the first tracking cycle below"}</small></div></div><div className="admin-fields"><label className="admin-field"><span>Bag ID</span><input value={bagId} onChange={(event) => setBagId(event.target.value.toUpperCase())} /></label><label className="admin-field"><span>Live status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="received">Bag received</option><option value="washing">Cleaning</option><option value="finishing">Finishing</option><option value="ready">Ready for collection</option></select></label><label className="admin-field"><span>Expected return</span><input type="datetime-local" value={collectionDue} onChange={(event) => setCollectionDue(event.target.value)} /></label><label className="admin-field"><span>Collection point</span><input value={location} onChange={(event) => setLocation(event.target.value)} /></label></div><div className="tracking-admin-hint"><Clock3 size={17} /> Saving updates the member dashboard instantly and adds a timestamped event to the bag history.</div></div>}
        </section>
      </div>
    </main>
  );
}
