"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  Building2,
  CalendarCheck,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  HeartHandshake,
  MessageCircle,
  Menu,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  TimerReset,
  Truck,
  WashingMachine,
  Wind,
  X,
} from "lucide-react";
import { whatsappUrl } from "@/lib/site-content";
import { supabase } from "@/lib/supabase";
import { useSiteContent } from "./use-site-content";

const burdenIcons = [Clock3, Wind, Shirt];
const routineIcons = [PackageCheck, WashingMachine, CalendarCheck];
const safetyIcons = [PackageCheck, Camera, RotateCcw, ShieldCheck];
const benefitIcons = [TimerReset, Sparkles, HeartHandshake, CalendarCheck];
const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,63}$/;
const malaysianMobilePattern = /^(?:60|0)1\d{8,9}$/;

function isValidEmail(value: string) {
  return value.length <= 254 && emailPattern.test(value.trim());
}

function isValidMalaysianMobile(value: string) {
  return malaysianMobilePattern.test(value.replace(/\D/g, ""));
}

export default function Home() {
  const { content, plans, loading: contentLoading } = useSiteContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [enquiry, setEnquiry] = useState({ name: "", email: "", phone: "", residence: "", message: "" });
  const [enquiryBusy, setEnquiryBusy] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState<"" | "success" | "error">("");
  const [enquiryError, setEnquiryError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", phone: "" });
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (contentLoading || !window.location.hash) return;
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (!target) return;
    requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }, [contentLoading]);

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 500);
    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    return () => window.removeEventListener("scroll", updateBackToTop);
  }, []);

  const joinUrl = whatsappUrl(content);
  const buildingUrl = whatsappUrl(content, "Hi Washd, I'd like to discuss bringing Washd to our building.");

  async function sendEnquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = enquiry.email.trim().toLowerCase();
    const phone = enquiry.phone.trim();
    const nextErrors = {
      email: isValidEmail(email) ? "" : "Enter a valid email address, for example name@example.com.",
      phone: isValidMalaysianMobile(phone) ? "" : "Enter a valid Malaysian mobile number, for example 012-345 6789.",
    };
    setFieldErrors(nextErrors);
    setEnquiryError("");
    if (nextErrors.email || nextErrors.phone) return;
    setEnquiryBusy(true);
    setEnquiryStatus("");
    const { error } = await supabase.from("contact_requests").insert({
      name: enquiry.name.trim(),
      email,
      phone,
      organisation: enquiry.residence.trim(),
      interest: "residence",
      message: `Custom plan enquiry: ${enquiry.message.trim()}`,
    });
    setEnquiryBusy(false);
    if (error) {
      setEnquiryStatus("error");
      setEnquiryError(error.code === "23514" ? "Check that your email and Malaysian mobile number are valid, then try again." : "We couldn’t send the enquiry just now. Please message Washd on WhatsApp instead.");
      return;
    }
    setEnquiryStatus("success");
    setEnquiry({ name: "", email: "", phone: "", residence: "", message: "" });
    setFieldErrors({ email: "", phone: "" });
  }

  return (
    <main className="deck-home">
      <div className="deck-announcement">
        <span>{content.schedule.label}</span>
        <strong>{content.schedule.firstRoute}</strong>
        <i />
        <strong>{content.schedule.secondRoute}</strong>
      </div>

      <header className="deck-header">
        <a className="deck-brand" href="#top" aria-label="Washd home">
          <span className="deck-wordmark">washd<i>.</i></span>
        </a>
        <nav className={menuOpen ? "deck-nav open" : "deck-nav"} aria-label="Main navigation">
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#plans" onClick={() => setMenuOpen(false)}>Plans</a>
          <a href="#safety" onClick={() => setMenuOpen(false)}>Our promise</a>
          <a className="deck-button small member-login-cta" href="/login">Member login <ArrowRight size={16} /></a>
        </nav>
        <button className="deck-menu" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="deck-hero" id="top">
        <div className="deck-hero-copy">
          <span className="deck-kicker">{content.brand.modelLabel}</span>
          <h1>{content.hero.title}<br /><em>{content.hero.accent}</em></h1>
          <p>{content.hero.body}</p>
          <div className="deck-actions">
            <a className="deck-button gold" href={joinUrl} target="_blank" rel="noreferrer">{content.hero.primaryCta} <ArrowRight size={18} /></a>
            <a className="deck-text-link" href="#plans">{content.hero.secondaryCta} <span>↓</span></a>
          </div>
        </div>

        <div className="route-visual" aria-label="Washd fixed weekly collection schedule">
          <div className="route-orbit orbit-a" /><div className="route-orbit orbit-b" />
          <div className="route-building"><Building2 size={92} strokeWidth={1.2} /><strong>Your building</strong><small>One collection point</small></div>
          <div className="route-line"><span /><Truck size={30} /><span /></div>
          <div className="route-times">
            <article><span>DROP</span><strong>{content.schedule.dropTime}</strong><small>Sealed, numbered bag</small></article>
            <article className="return"><span>RETURN</span><strong>{content.schedule.returnTime}</strong><small>Fresh, folded, ready</small></article>
          </div>
          <div className="route-stamp"><Check size={18} /><span>Two-day<br />turnaround</span></div>
        </div>
      </section>

      <section className="deck-section burden-section">
        <div className="deck-heading reveal">
          <div><span className="deck-kicker teal">{content.burden.eyebrow}</span><h2>{content.burden.title}</h2></div>
          <p>{content.burden.intro}</p>
        </div>
        <div className="deck-card-grid three">
          {content.burden.cards.map((card, index) => {
            const Icon = burdenIcons[index] || Clock3;
            return <article className="deck-card reveal" key={`${card.title}-${index}`}><span className="icon-disc"><Icon size={24} /></span><h3>{card.title}</h3><p>{card.body}</p></article>;
          })}
        </div>
        <p className="deck-section-note reveal">{content.burden.footer}</p>
      </section>

      <section className="heritage-section">
        <div className="heritage-year reveal" aria-label="Operating heritage since 1964"><span>Since</span><strong>1964</strong></div>
        <div className="heritage-copy reveal">
          <span className="deck-kicker gold-text">{content.heritage.eyebrow}</span>
          <h2>{content.heritage.title}<br /><em>{content.heritage.accent}</em></h2>
          <p>{content.heritage.body}</p>
          <div>{content.heritage.points.map((point) => <span key={point}><Check size={15} /> {point}</span>)}</div>
        </div>
      </section>

      <section className="deck-section routine-section" id="how">
        <div className="deck-heading stacked reveal"><span className="deck-kicker teal">{content.routine.eyebrow}</span><h2>{content.routine.title}</h2><p>{content.routine.intro}</p></div>
        <div className="routine-grid">
          {content.routine.steps.map((step, index) => {
            const Icon = routineIcons[index] || PackageCheck;
            return (
              <article className={index === 1 ? "routine-card featured reveal" : "routine-card reveal"} key={`${step.title}-${index}`}>
                <div><span>0{index + 1}</span><Icon size={31} /></div><h3>{step.title}</h3><p>{step.body}</p>
              </article>
            );
          })}
        </div>
        <div className="routine-footer reveal"><strong>{content.routine.footer}</strong><span>{content.schedule.firstRoute}</span><span>{content.schedule.secondRoute}</span></div>
      </section>

      <section className="deck-section services-section" id="services">
        <div className="deck-heading stacked reveal"><span className="deck-kicker teal">{content.services.eyebrow}</span><h2>{content.services.title}</h2><p>{content.services.intro}</p></div>
        <div className="service-pair">
          {content.services.items.map((service, index) => (
            <article className={index === 1 ? "service-block dark reveal" : "service-block reveal"} key={`${service.title}-${index}`}>
              <span className="service-icon">{index === 0 ? <WashingMachine size={32} /> : <Shirt size={32} />}</span>
              <div><h3>{service.title}</h3><strong>{service.label}</strong><p>{service.body}</p></div>
            </article>
          ))}
        </div>
        <p className="deck-section-note reveal">{content.services.footer}</p>
      </section>

      <section className="deck-section plans-section" id="plans">
        <div className="deck-heading reveal">
          <div><span className="deck-kicker teal">{content.membership.eyebrow}</span><h2>{content.membership.title}</h2></div>
          <p>{content.membership.intro}</p>
        </div>
        <div className="deck-plan-grid">
          {plans.map((plan) => (
            <article className={plan.popular ? "deck-plan popular reveal" : "deck-plan reveal"} key={plan.id}>
              {plan.popular && <span className="deck-popular">Most popular</span>}
              <h3>{plan.name}</h3>
              <div className="deck-price"><span>RM</span><strong>{plan.price_rm}</strong></div>
              <small>per month</small>
              <p>{plan.description}</p>
              <a href={`/plans?plan=${encodeURIComponent(plan.id)}`}>View plan details <ArrowRight size={16} /></a>
            </article>
          ))}
          <article className="deck-plan custom reveal">
            <span className="custom-plan-icon"><SlidersHorizontal size={24} /></span>
            <h3>{content.customPlan.title}</h3>
            <p>{content.customPlan.body}</p>
            <ul>{content.customPlan.features.map((feature) => <li key={feature}><Check size={14} /> {feature}</li>)}</ul>
            <a href="#custom-enquiry">{content.customPlan.cta} <ArrowRight size={16} /></a>
          </article>
        </div>
        <p className="plan-note reveal">{content.membership.extraNote}</p>
      </section>

      <section className="deck-section safety-section" id="safety">
        <div className="deck-heading stacked reveal"><span className="deck-kicker teal">{content.safety.eyebrow}</span><h2>{content.safety.title}</h2><p>{content.safety.intro}</p></div>
        <div className="promise-grid">
          {content.safety.cards.map((card, index) => {
            const Icon = safetyIcons[index] || ShieldCheck;
            return <article className="promise-card reveal" key={`${card.title}-${index}`}><span className="icon-disc"><Icon size={22} /></span><div><h3>{card.title}</h3><p>{card.body}</p></div></article>;
          })}
        </div>
      </section>

      <section className="deck-section benefits-section">
        <div className="deck-heading stacked reveal"><span className="deck-kicker teal">{content.benefits.eyebrow}</span><h2>{content.benefits.title}</h2></div>
        <div className="promise-grid">
          {content.benefits.cards.map((card, index) => {
            const Icon = benefitIcons[index] || Sparkles;
            return <article className="promise-card reveal" key={`${card.title}-${index}`}><span className="icon-disc aqua"><Icon size={22} /></span><div><h3>{card.title}</h3><p>{card.body}</p></div></article>;
          })}
        </div>
      </section>

      <section className="building-section">
        <div className="building-copy reveal">
          <span className="deck-kicker gold-text">{content.building.eyebrow}</span>
          <h2>{content.building.title}</h2>
          <p>{content.building.body}</p>
          <a className="deck-button light" href={buildingUrl} target="_blank" rel="noreferrer">{content.building.cta} <ArrowRight size={18} /></a>
        </div>
        <div className="building-points reveal">
          {content.building.points.map((point) => <div key={point}><Check size={18} /><span>{point}</span></div>)}
        </div>
      </section>

      <section className="deck-faq" id="faq">
        <div className="faq-intro reveal"><span className="deck-kicker teal">{content.faq.eyebrow}</span><h2>{content.faq.title}</h2><p>{content.faq.intro}</p></div>
        <div className="deck-faq-list reveal">
          {content.faq.items.map((item, index) => (
            <article className={openFaq === index ? "deck-faq-item open" : "deck-faq-item"} key={`${item.question}-${index}`}>
              <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{String(index + 1).padStart(2, "0")}</span>{item.question}<ChevronDown size={20} /></button>
              <div><p>{item.answer}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="deck-final-cta" id="custom-enquiry">
        <div className="final-orbit" />
        <div className="final-copy reveal">
          <span className="deck-kicker gold-text">{content.enquiry.eyebrow}</span>
          <h2>{content.enquiry.title}</h2>
          <p>{content.enquiry.body}</p>
          <div className="final-steps">{content.customPlan.features.map((step) => <span key={step}><Check size={15} /> {step}</span>)}</div>
          <p className="final-standard-plan">Prefer a standard plan? <a href="/plans">Review all memberships <ArrowRight size={15} /></a></p>
        </div>
        <form className="enquiry-form reveal" onSubmit={sendEnquiry}>
          <div><label>Full name<input required minLength={2} maxLength={100} value={enquiry.name} onChange={(event) => setEnquiry({ ...enquiry, name: event.target.value })} placeholder="Your name" /></label><label>Email<input required type="email" inputMode="email" autoComplete="email" maxLength={254} pattern="[^\s@]+@[^\s@]+\.[A-Za-z]{2,63}" aria-invalid={Boolean(fieldErrors.email)} value={enquiry.email} onChange={(event) => { setEnquiry({ ...enquiry, email: event.target.value }); setFieldErrors((current) => ({ ...current, email: "" })); }} onBlur={() => enquiry.email && setFieldErrors((current) => ({ ...current, email: isValidEmail(enquiry.email) ? "" : "Enter a valid email address, for example name@example.com." }))} placeholder="you@example.com" />{fieldErrors.email && <small className="enquiry-field-error">{fieldErrors.email}</small>}</label></div>
          <div><label>Malaysian mobile number<input required type="tel" inputMode="tel" autoComplete="tel" maxLength={18} aria-invalid={Boolean(fieldErrors.phone)} value={enquiry.phone} onChange={(event) => { const phone = event.target.value.replace(/[^\d+\-()\s]/g, ""); setEnquiry({ ...enquiry, phone }); setFieldErrors((current) => ({ ...current, phone: "" })); }} onBlur={() => enquiry.phone && setFieldErrors((current) => ({ ...current, phone: isValidMalaysianMobile(enquiry.phone) ? "" : "Enter a valid Malaysian mobile number, for example 012-345 6789." }))} placeholder="e.g. 012-345 6789" />{fieldErrors.phone && <small className="enquiry-field-error">{fieldErrors.phone}</small>}</label><label>Residence / organisation<input required minLength={2} maxLength={160} value={enquiry.residence} onChange={(event) => setEnquiry({ ...enquiry, residence: event.target.value })} placeholder="Building or company" /></label></div>
          <label>What would your ideal plan include?<textarea required minLength={10} value={enquiry.message} onChange={(event) => setEnquiry({ ...enquiry, message: event.target.value })} placeholder="Tell us how many bags, pressed pieces and collections you need each month." /></label>
          {enquiryStatus === "success" && <div className="enquiry-notice success" role="status">{content.enquiry.success}</div>}
          {enquiryStatus === "error" && <div className="enquiry-notice error" role="alert">{enquiryError}</div>}
          <button className="deck-button gold" type="submit" disabled={enquiryBusy}>{enquiryBusy ? "Sending…" : content.enquiry.button} <ArrowRight size={18} /></button>
          <small className="enquiry-privacy">We use these details to answer your enquiry. See our <a href="/privacy">Privacy Notice</a>.</small>
        </form>
      </section>

      <footer className="deck-footer">
        <div><a className="deck-brand deck-footer-brand" href="#top"><span className="deck-wordmark">washd<i>.</i></span></a><p>{content.brand.tagline}<br />While you live your life.</p></div>
        <div><strong>Explore</strong><a href="#how">How it works</a><a href="#services">Services</a><a href="/plans">Membership plans</a></div>
        <div><strong>Contact</strong><a href={joinUrl} target="_blank" rel="noreferrer">{content.contact.phoneDisplay}</a><a href={`mailto:${content.contact.email}`}>{content.contact.email}</a><span>{content.contact.serviceArea}</span></div>
        <div><strong>Members & policies</strong><a href="/login">Log in</a><a href="/privacy">Privacy notice</a><a href="/terms">Service terms</a><a href="/service-information">Service information</a><a href="/care-guarantee">Care guarantee</a></div>
        <small>© 2026 Washd. {content.brand.tagline}{content.contact.legalName && <> · {content.contact.legalName}{content.contact.registrationNumber && ` (${content.contact.registrationNumber})`}</>}</small>
      </footer>

      <button
        className={showBackToTop && !menuOpen ? "floating-back-to-top visible" : "floating-back-to-top"}
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={20} aria-hidden="true" />
        <span>Top</span>
      </button>

      <a
        className={menuOpen ? "floating-whatsapp hidden" : "floating-whatsapp"}
        href={joinUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Washd on WhatsApp"
      >
        <MessageCircle size={21} aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
    </main>
  );
}
