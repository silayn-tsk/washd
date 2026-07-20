"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Hotel,
  Leaf,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  Shirt,
  Sparkles,
  Star,
  Truck,
  WashingMachine,
  Wind,
  X,
} from "lucide-react";

const services = [
  {
    icon: WashingMachine,
    title: "Wash & fold",
    price: "from RM 18 / bag",
    copy: "Everyday laundry, sorted, washed and folded exactly how you like it.",
    tone: "blue",
  },
  {
    icon: Shirt,
    title: "Dry cleaning",
    price: "from RM 12 / item",
    copy: "Expert garment care for workwear, occasion pieces and delicate fabrics.",
    tone: "cream",
  },
  {
    icon: Wind,
    title: "Bedding & linens",
    price: "from RM 22 / set",
    copy: "Fresh sheets, fluffy duvets and hotel-quality pressing without the chore.",
    tone: "lilac",
  },
];

const faqs = [
  {
    question: "How does pickup and delivery work?",
    answer:
      "Choose a two-hour pickup window. A Washd rider collects your labelled bag, and you can follow every step until it arrives back at your door.",
  },
  {
    question: "When will my laundry be returned?",
    answer:
      "Standard wash & fold is returned within 48 hours. Need it sooner? Select our 24-hour express option when you book.",
  },
  {
    question: "What if I have special care instructions?",
    answer:
      "Add notes to your booking for fragrance-free detergent, cold wash, hang dry, stain treatment or any garment-specific request.",
  },
  {
    question: "Where is Washd available?",
    answer:
      "We currently cover central Kuala Lumpur and selected Klang Valley neighbourhoods, with new postcodes added regularly.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bags, setBags] = useState(2);
  const [express, setExpress] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booked, setBooked] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const estimate = useMemo(() => bags * 18 + (express ? 12 : 0), [bags, express]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = bookingOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [bookingOpen]);

  function openBooking() {
    setBooked(false);
    setBookingOpen(true);
    setMenuOpen(false);
  }

  function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBooked(true);
  }

  return (
    <main>
      <div className="announcement">
        <span>First wash on us — save RM 18 with code <strong>FRESH18</strong></span>
        <a href="#pricing">See pricing <ArrowRight size={14} /></a>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Washd home">
          <span className="brand-mark"><WashingMachine size={22} strokeWidth={1.8} /></span>
          <span>Washd</span>
        </a>

        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#business" onClick={() => setMenuOpen(false)}>For business</a>
          <button className="nav-login" type="button">Log in</button>
          <button className="button button-small" type="button" onClick={openBooking}>
            Book a pickup
          </button>
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="bubble bubble-one" />
        <div className="bubble bubble-two" />
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Laundry day, upgraded</div>
          <h1>Laundry,<br /><em>seamlessly</em> handled.</h1>
          <p>
            Door-to-door laundry care that gives you your time back. We collect,
            clean and deliver — fresh, folded and ready to wear.
          </p>
          <div className="hero-actions">
            <button className="button" type="button" onClick={openBooking}>
              Schedule a pickup <ArrowRight size={18} />
            </button>
            <a className="text-link" href="#how">See how it works <span>↓</span></a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>AZ</span><span>MK</span><span>JL</span>
            </div>
            <div><strong>4.9</strong> <span className="stars">★★★★★</span><br /><small>Loved by 2,000+ happy closets</small></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Washd laundry service status preview">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="float-tag tag-shirt"><Shirt size={20} /><span>Dry clean</span></div>
          <div className="float-tag tag-sparkle"><Sparkles size={20} /><span>Eco fresh</span></div>
          <div className="float-tag tag-clock"><Clock3 size={20} /><span>48 hr</span></div>
          <div className="washer">
            <div className="washer-top">
              <span className="washer-dot active" /><span className="washer-dot" />
              <div className="washer-display">WASHD · 28 MIN</div>
            </div>
            <div className="washer-door">
              <div className="washer-glass">
                <span className="cloth cloth-a" />
                <span className="cloth cloth-b" />
                <span className="cloth cloth-c" />
                <span className="foam foam-a" />
                <span className="foam foam-b" />
              </div>
            </div>
            <div className="washer-name">Washd care cycle</div>
          </div>
          <div className="status-card">
            <div className="status-icon"><Truck size={21} /></div>
            <div><small>Next update</small><strong>Out for delivery</strong></div>
            <span className="status-time">6:30 PM</span>
          </div>
        </div>
      </section>

      <div className="ticker" aria-label="Washd service highlights">
        <div className="ticker-track">
          {["Doorstep pickup", "Expert garment care", "Eco-friendly cleaning", "Real-time tracking", "48-hour return", "Doorstep pickup", "Expert garment care", "Eco-friendly cleaning", "Real-time tracking", "48-hour return"].map((item, index) => (
            <span key={`${item}-${index}`}><Sparkles size={14} /> {item}</span>
          ))}
        </div>
      </div>

      <section className="section services" id="services">
        <div className="section-heading reveal">
          <div>
            <span className="kicker">Everything your wardrobe needs</span>
            <h2>Care for every<br /><em>kind of clean.</em></h2>
          </div>
          <p>From weekly essentials to the pieces you save for something special, every item gets a care plan — not a one-cycle-fits-all wash.</p>
        </div>
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article className={`service-card ${service.tone} reveal`} key={service.title} style={{ transitionDelay: `${index * 90}ms` }}>
                <div className="service-icon"><Icon size={27} strokeWidth={1.6} /></div>
                <div className="service-number">0{index + 1}</div>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <div className="service-footer"><strong>{service.price}</strong><button type="button" onClick={openBooking} aria-label={`Book ${service.title}`}><ArrowRight size={18} /></button></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="steps-section" id="how">
        <div className="steps-intro reveal">
          <span className="kicker light">Clean clothes, zero detours</span>
          <h2>From hamper to wardrobe<br />in three easy moves.</h2>
          <p>You tap. We collect. Your laundry comes home beautifully finished.</p>
          <button className="button button-light" type="button" onClick={openBooking}>Try Washd today <ArrowRight size={18} /></button>
        </div>
        <div className="steps-list">
          {[
            [CalendarDays, "01", "Book your window", "Choose a pickup time that fits around your day."],
            [PackageCheck, "02", "We clean with care", "Every bag is tagged, checked and cleaned to your preferences."],
            [Truck, "03", "Fresh to your door", "Track your order and get it back folded and wardrobe-ready."],
          ].map(([Icon, number, title, copy], index) => {
            const StepIcon = Icon as typeof CalendarDays;
            return (
              <article className="step reveal" key={String(title)} style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="step-icon"><StepIcon size={25} /></div>
                <span>{String(number)}</span>
                <div><h3>{String(title)}</h3><p>{String(copy)}</p></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section estimator" id="pricing">
        <div className="estimator-visual reveal">
          <div className="receipt">
            <div className="receipt-brand"><span className="brand-mark small"><WashingMachine size={17} /></span> Washd</div>
            <div className="receipt-line"><span>{bags} wash & fold {bags === 1 ? "bag" : "bags"}</span><strong>RM {bags * 18}</strong></div>
            <div className="receipt-line"><span>Pickup & delivery</span><strong>Free</strong></div>
            {express && <div className="receipt-line"><span>24-hour express</span><strong>RM 12</strong></div>}
            <div className="receipt-total"><span>Estimated total</span><strong>RM {estimate}</strong></div>
            <div className="receipt-note"><CheckCircle2 size={16} /> No subscriptions. No hidden fees.</div>
          </div>
          <div className="laundry-bag"><span>W</span><small>freshly done</small></div>
        </div>

        <div className="estimator-copy reveal">
          <span className="kicker">Simple, honest pricing</span>
          <h2>Know your total<br /><em>before pickup.</em></h2>
          <p>One Washd bag holds around a week of everyday laundry. Pickup and delivery are included.</p>
          <div className="quantity-row">
            <div><strong>Wash & fold bags</strong><small>Up to 6kg per bag</small></div>
            <div className="stepper">
              <button type="button" aria-label="Remove one bag" onClick={() => setBags((value) => Math.max(1, value - 1))}><Minus size={17} /></button>
              <span>{bags}</span>
              <button type="button" aria-label="Add one bag" onClick={() => setBags((value) => Math.min(8, value + 1))}><Plus size={17} /></button>
            </div>
          </div>
          <label className="express-row">
            <span><strong>24-hour express</strong><small>Add RM 12 to your order</small></span>
            <input type="checkbox" checked={express} onChange={(event) => setExpress(event.target.checked)} />
            <i aria-hidden="true" />
          </label>
          <div className="estimate-total"><span>Your estimate</span><strong>RM {estimate}</strong></div>
          <button className="button wide" type="button" onClick={openBooking}>Book this pickup <ArrowRight size={18} /></button>
        </div>
      </section>

      <section className="care-section">
        <div className="care-copy reveal">
          <span className="kicker">Thoughtful by default</span>
          <h2>Gentle on clothes.<br /><em>Lighter on the planet.</em></h2>
          <p>Smarter loads, lower-temperature cycles and responsible products give every clean a smaller footprint.</p>
          <div className="care-points">
            <div><Leaf size={21} /><span><strong>Eco-conscious cycles</strong><small>Optimised water and energy use</small></span></div>
            <div><ShieldCheck size={21} /><span><strong>Fabric-safe care</strong><small>Sorted and treated by trained teams</small></span></div>
            <div><Sparkles size={21} /><span><strong>Premium finish</strong><small>Neatly folded, pressed and protected</small></span></div>
          </div>
        </div>
        <div className="care-art reveal" aria-hidden="true">
          <div className="fabric fabric-one">LINEN</div>
          <div className="fabric fabric-two">COTTON</div>
          <div className="fabric fabric-three">DELICATE</div>
          <div className="care-seal"><Leaf size={27} /><strong>Cleaner care</strong><span>every cycle</span></div>
        </div>
      </section>

      <section className="business-section" id="business">
        <div className="business-card reveal">
          <div>
            <span className="kicker light">Washd for business</span>
            <h2>Fresh linen.<br />Flawless operations.</h2>
            <p>Reliable laundry care for boutique hotels, gyms, salons and serviced residences — with flexible volume plans and one tidy dashboard.</p>
            <a className="button button-light" href="mailto:hello@washd.my?subject=Washd%20for%20business">Talk to our team <ArrowRight size={18} /></a>
          </div>
          <div className="business-metrics">
            <div><Hotel size={25} /><strong>99.4%</strong><span>on-time return rate</span></div>
            <div><Building2 size={25} /><strong>45+</strong><span>business partners</span></div>
            <div><Clock3 size={25} /><strong>7 days</strong><span>weekly collection</span></div>
          </div>
        </div>
      </section>

      <section className="reviews section">
        <div className="section-heading reveal">
          <div><span className="kicker">Fresh words</span><h2>People love getting<br /><em>laundry day back.</em></h2></div>
          <div className="review-score"><strong>4.9</strong><span>★★★★★</span><small>Based on 2,000+ orders</small></div>
        </div>
        <div className="review-grid">
          {[
            ["The tracking is brilliant and every shirt came back perfectly folded. I got my Sunday evening back.", "Aina Z.", "Mont Kiara"],
            ["Finally, a laundry service that feels premium without surprise charges. Pickup was right on time.", "Marcus K.", "Bangsar"],
            ["I left a note about sensitive skin and they remembered it on my next order. That care makes the difference.", "Joanne L.", "Damansara Heights"],
          ].map(([quote, name, place], index) => (
            <blockquote className="review-card reveal" key={name} style={{ transitionDelay: `${index * 90}ms` }}>
              <Star size={22} fill="currentColor" />
              <p>“{quote}”</p>
              <footer><span>{name.slice(0, 1)}</span><div><strong>{name}</strong><small>{place}</small></div></footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="faq section" id="faq">
        <div className="faq-title reveal"><span className="kicker">Good to know</span><h2>Your laundry<br />questions, <em>sorted.</em></h2></div>
        <div className="faq-list reveal">
          {faqs.map((item, index) => (
            <div className={activeFaq === index ? "faq-item open" : "faq-item"} key={item.question}>
              <button type="button" aria-expanded={activeFaq === index} onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                <span>{item.question}</span><ChevronDown size={20} />
              </button>
              <div className="faq-answer"><p>{item.answer}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-bubble bubble-a" /><div className="cta-bubble bubble-b" />
        <span className="kicker">Ready when you are</span>
        <h2>More fresh.<br /><em>Less fuss.</em></h2>
        <p>Your first wash & fold bag is on us. We’ll pick it up from your doorstep.</p>
        <button className="button" type="button" onClick={openBooking}>Get your first wash free <ArrowRight size={18} /></button>
        <small>Use code FRESH18 · New customers only</small>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div><a className="brand footer-brand" href="#top"><span className="brand-mark"><WashingMachine size={22} /></span><span>Washd</span></a><p>From lobby to wardrobe.<br />Laundry care, made effortless.</p></div>
          <div><strong>Explore</strong><a href="#services">Services</a><a href="#how">How it works</a><a href="#pricing">Pricing</a></div>
          <div><strong>Company</strong><a href="#business">For business</a><a href="mailto:hello@washd.my">Contact</a><a href="#faq">Help centre</a></div>
          <div><strong>Say hello</strong><a href="mailto:hello@washd.my">hello@washd.my</a><span>Daily, 8am–9pm</span><a href="#top">Instagram</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Washd. Made fresh in Kuala Lumpur.</span><div><a href="#top">Privacy</a><a href="#top">Terms</a></div></div>
      </footer>

      {bookingOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}>
          <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="modal-close" type="button" aria-label="Close booking" onClick={() => setBookingOpen(false)}><X size={20} /></button>
            {!booked ? (
              <>
                <span className="modal-step">Pickup request</span>
                <h2 id="booking-title">Let’s lighten your laundry load.</h2>
                <p>Tell us where and when. We’ll confirm your slot by message.</p>
                <form onSubmit={submitBooking}>
                  <label>Your name<input required name="name" placeholder="e.g. Aina" /></label>
                  <label>Mobile number<input required name="phone" type="tel" placeholder="+60 12 345 6789" /></label>
                  <label>Pickup postcode<input required name="postcode" inputMode="numeric" placeholder="e.g. 50480" /></label>
                  <div className="form-split">
                    <label>Preferred day<select name="day" defaultValue="tomorrow"><option value="tomorrow">Tomorrow</option><option value="day-after">Day after tomorrow</option><option value="weekend">This weekend</option></select></label>
                    <label>Time window<select name="time" defaultValue="evening"><option value="morning">8am–11am</option><option value="afternoon">12pm–3pm</option><option value="evening">5pm–8pm</option></select></label>
                  </div>
                  <button className="button wide" type="submit">Request my pickup <ArrowRight size={18} /></button>
                  <small>No payment needed yet. This demo keeps your details in this page only.</small>
                </form>
              </>
            ) : (
              <div className="booking-success">
                <div><Check size={34} /></div>
                <span className="modal-step">Request received</span>
                <h2 id="booking-title">Your laundry-free day is almost here.</h2>
                <p>We’ve saved your pickup request. In a live version, you’d now receive a confirmation by message.</p>
                <button className="button wide" type="button" onClick={() => setBookingOpen(false)}>Done</button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
