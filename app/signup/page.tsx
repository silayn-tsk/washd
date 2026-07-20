"use client";

import { useState } from "react";
import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowRight, Check, Eye, EyeOff, WashingMachine } from "lucide-react";
import { auth, db } from "@/lib/firebase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await setPersistence(auth, browserLocalPersistence);
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName: name.trim() });
      const pickupLabel = unit.trim() || "Residence lobby";
      await setDoc(doc(db, "users", credential.user.uid), {
        name: name.trim(),
        email: credential.user.email,
        unit: pickupLabel,
        pickupLocation: { label: pickupLabel, notes: "" },
        notifyVia: "whatsapp",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      window.location.assign("/plans");
    } catch (caught) {
      const code = (caught as { code?: string }).code;
      setError(code === "auth/email-already-in-use" ? "An account already exists for this email. Try logging in instead." : code === "auth/weak-password" ? "Choose a password with at least 6 characters." : "We couldn’t create your account. Please check your details and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="signup-page">
      <a className="brand signup-brand" href="/"><span className="brand-mark"><WashingMachine size={22} /></span><span>Washd</span></a>
      <section className="signup-card">
        <div className="signup-intro">
          <span className="kicker">Join Washd</span>
          <h1>A fresher weekly rhythm starts here.</h1>
          <p>Create your account now. You can choose a plan after signing up.</p>
          <ul><li><Check size={16} /> Track every Washd bag</li><li><Check size={16} /> Manage pickups in one place</li><li><Check size={16} /> Secure Stripe-hosted payments</li></ul>
        </div>
        <form onSubmit={createAccount}>
          <label>Full name<input required minLength={2} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>
          <label>Residence / unit<input autoComplete="street-address" value={unit} onChange={(event) => setUnit(event.target.value)} placeholder="e.g. The Residence · Unit 12-3" /></label>
          <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
          <label>Password<span className="password-field"><input required minLength={6} type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>
          {error && <div className="form-alert error" role="alert">{error}</div>}
          <button className="button wide gold-button" type="submit" disabled={busy}>{busy ? "Creating account…" : <>Create account <ArrowRight size={18} /></>}</button>
          <p className="form-foot">Already a member? <a href="/login">Log in</a></p>
        </form>
      </section>
    </main>
  );
}
