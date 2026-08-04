"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Inbox, LoaderCircle, Mail, MessageSquareText, Phone, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../auth-provider";
import { supabase } from "@/lib/supabase";
import { redirectForAdminMfa, resolveAdminAccess } from "@/lib/admin-access";

type EnquiryStatus = "new" | "contacted" | "closed";
type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organisation: string;
  interest: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
};

const statusLabels: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

export default function AdminEnquiriesPage() {
  const { user, loading: authLoading } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("contact_requests")
      .select("id, name, email, phone, organisation, interest, message, status, created_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (loadError) {
      setError("Enquiries could not be loaded. Please refresh and try again.");
      return;
    }
    const rows = (data || []) as Enquiry[];
    setEnquiries(rows);
    if (rows[0]) setSelectedId((current) => current || rows[0].id);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) window.location.replace("/login?next=/admin/enquiries");
    if (!user) return;
    void resolveAdminAccess().then((access) => {
      if (access === "mfa") { redirectForAdminMfa("/admin/enquiries"); return; }
      const canEdit = access === "allowed";
      setAllowed(canEdit);
      if (canEdit) void loadEnquiries();
      else setLoading(false);
    });
  }, [user, authLoading, loadEnquiries]);

  const selected = useMemo(() => enquiries.find((item) => item.id === selectedId), [enquiries, selectedId]);
  const newCount = enquiries.filter((item) => item.status === "new").length;

  async function changeStatus(status: EnquiryStatus) {
    if (!selected) return;
    setSaving(true);
    setNotice("");
    setError("");
    const { error: updateError } = await supabase.from("contact_requests").update({ status }).eq("id", selected.id);
    setSaving(false);
    if (updateError) {
      setError("The status could not be updated. Please try again.");
      return;
    }
    setEnquiries((current) => current.map((item) => item.id === selected.id ? { ...item, status } : item));
    setNotice(`${selected.name} is now marked ${statusLabels[status].toLowerCase()}.`);
  }

  if (authLoading || (user && allowed === null)) return <main className="admin-state"><LoaderCircle className="spin" /><p>Opening enquiry inbox…</p></main>;
  if (!user) return null;
  if (!allowed) return <main className="admin-state"><ShieldAlert size={42} /><h1>Admin access required</h1><Link className="deck-button" href="/admin">Return to admin</Link></main>;

  return (
    <main className="admin-page enquiries-admin-page">
      <header className="admin-header">
        <div><Link className="admin-brand" href="/admin"><span>washd. enquiries</span></Link></div>
        <div><Link className="admin-preview" href="/admin"><ArrowLeft size={15} /> Website editor</Link><Link className="admin-preview" href="/admin/tracking">Member tracking</Link></div>
      </header>
      <div className="enquiry-admin-layout">
        <aside className="enquiry-admin-list">
          <div className="enquiry-inbox-title"><Inbox size={17} /><strong>{newCount} new</strong><span>{enquiries.length} total</span></div>
          {loading ? <div className="enquiry-empty"><LoaderCircle className="spin" size={20} /> Loading…</div> : enquiries.length === 0 ? <div className="enquiry-empty">No enquiries yet.</div> : enquiries.map((item) => (
            <button className={selectedId === item.id ? "active" : ""} type="button" key={item.id} onClick={() => { setSelectedId(item.id); setNotice(""); setError(""); }}>
              <span className={`enquiry-status ${item.status}`}>{statusLabels[item.status]}</span>
              <strong>{item.name}</strong>
              <span>{item.organisation}</span>
              <small>{new Date(item.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}</small>
            </button>
          ))}
        </aside>
        <section className="enquiry-admin-detail">
          {!selected ? <div className="enquiry-empty-detail"><MessageSquareText size={36} /><h1>No enquiry selected</h1><p>New custom-plan enquiries will appear here.</p></div> : <>
            <span className="kicker">Custom-plan enquiry</span>
            <div className="enquiry-detail-heading"><div><h1>{selected.name}</h1><p>{selected.organisation} · {selected.interest}</p></div><span className={`enquiry-status ${selected.status}`}>{statusLabels[selected.status]}</span></div>
            {notice && <div className="admin-notice success"><CheckCircle2 size={18} /> {notice}</div>}
            {error && <div className="admin-notice error"><ShieldAlert size={18} /> {error}</div>}
            <article className="enquiry-detail-card">
              <div className="enquiry-contact-actions"><a href={`mailto:${selected.email}?subject=${encodeURIComponent("Your Washd custom plan enquiry")}`}><Mail size={17} /> {selected.email}</a>{selected.phone && <a href={`tel:${selected.phone}`}><Phone size={17} /> {selected.phone}</a>}</div>
              <div className="enquiry-message"><span>Customer request</span><p>{selected.message}</p></div>
              <div className="enquiry-meta"><span>Received</span><strong>{new Date(selected.created_at).toLocaleString("en-MY", { dateStyle: "long", timeStyle: "short" })}</strong></div>
              <div className="enquiry-status-actions"><span>Update follow-up status</span><div>{(["new", "contacted", "closed"] as EnquiryStatus[]).map((status) => <button className={selected.status === status ? "active" : ""} disabled={saving || selected.status === status} type="button" key={status} onClick={() => void changeStatus(status)}>{statusLabels[status]}</button>)}</div></div>
            </article>
          </>}
        </section>
      </div>
    </main>
  );
}
