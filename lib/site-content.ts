export type ContentCard = {
  title: string;
  body: string;
};

export type PolicyPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  body: string;
};

export type SiteContent = {
  brand: {
    name: string;
    tagline: string;
    modelLabel: string;
  };
  hero: {
    title: string;
    accent: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  };
  schedule: {
    label: string;
    firstRoute: string;
    secondRoute: string;
    dropTime: string;
    returnTime: string;
  };
  burden: {
    eyebrow: string;
    title: string;
    intro: string;
    cards: ContentCard[];
    footer: string;
  };
  heritage: {
    eyebrow: string;
    title: string;
    accent: string;
    body: string;
    points: string[];
  };
  routine: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: ContentCard[];
    footer: string;
  };
  services: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<ContentCard & { label: string }>;
    footer: string;
  };
  membership: {
    eyebrow: string;
    title: string;
    intro: string;
    extraNote: string;
  };
  customPlan: {
    title: string;
    body: string;
    features: string[];
    cta: string;
  };
  safety: {
    eyebrow: string;
    title: string;
    intro: string;
    cards: ContentCard[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    cards: ContentCard[];
  };
  building: {
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
    cta: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{ question: string; answer: string }>;
  };
  enquiry: {
    eyebrow: string;
    title: string;
    body: string;
    button: string;
    success: string;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    body: string;
    button: string;
    steps: string[];
  };
  policies: {
    privacy: PolicyPageContent;
    terms: PolicyPageContent;
    serviceInformation: PolicyPageContent;
    careGuarantee: PolicyPageContent;
  };
  contact: {
    name: string;
    legalName: string;
    registrationNumber: string;
    registeredAddress: string;
    phoneDisplay: string;
    whatsappNumber: string;
    email: string;
    serviceArea: string;
  };
};

export type Plan = {
  id: string;
  name: string;
  description: string;
  price_rm: number;
  popular: boolean;
  features: string[];
  sort_order: number;
  stripe_price_id?: string | null;
};

export type PlanAddon = {
  id: string;
  name: string;
  description: string;
  price_rm: number;
  active: boolean;
  sort_order: number;
  stripe_price_id?: string | null;
};

export const defaultPlans: Plan[] = [
  { id: "starter", name: "Starter", description: "5kg wash-fold bag once a week", price_rm: 109, popular: false, features: ["5kg wash-fold bag", "Once a week", "Fixed building collection"], sort_order: 1 },
  { id: "active", name: "Active", description: "5kg wash-fold bag twice a week", price_rm: 199, popular: false, features: ["5kg wash-fold bag", "Twice a week", "Fixed building collection"], sort_order: 2 },
  { id: "professional", name: "Professional", description: "7kg bag + 4 pressed shirts, once a week", price_rm: 259, popular: true, features: ["7kg wash-fold bag", "4 pressed shirts", "Once a week"], sort_order: 3 },
  { id: "executive", name: "Executive", description: "7kg bag + 7 pressed shirts, once a week", price_rm: 299, popular: false, features: ["7kg wash-fold bag", "7 pressed shirts", "Once a week"], sort_order: 4 },
];

export const defaultAddons: PlanAddon[] = [
  { id: "extra-shirts", name: "4 extra pressed shirts", description: "Four additional shirts washed, pressed and returned on hangers each month.", price_rm: 30, active: true, sort_order: 1 },
  { id: "extra-bag", name: "One extra 5kg bag", description: "Add one extra wash, dry and fold bag to your monthly allowance.", price_rm: 18, active: true, sort_order: 2 },
  { id: "fragrance-free", name: "Fragrance-free care", description: "A fragrance-free detergent preference for every bag in your membership.", price_rm: 12, active: true, sort_order: 3 },
  { id: "priority-return", name: "Priority 24-hour return", description: "Move one collection each month to our priority 24-hour return service.", price_rm: 35, active: true, sort_order: 4 },
];

export const defaultSiteContent: SiteContent = {
  brand: {
    name: "Washd",
    tagline: "Laundry, handled.",
    modelLabel: "The milkman model for laundry",
  },
  hero: {
    title: "Laundry,",
    accent: "handled.",
    body: "Like the milkman of old, we come to your building on fixed days and return your laundry washed, ironed and folded.",
    primaryCta: "Message us on WhatsApp",
    secondaryCta: "See monthly plans",
  },
  schedule: {
    label: "The fixed weekly rhythm",
    firstRoute: "Drop Mon → Collect Wed",
    secondRoute: "Drop Wed → Collect Fri",
    dropTime: "Drop by 9:30am",
    returnTime: "Collect at 5:30pm",
  },
  burden: {
    eyebrow: "01 · The everyday burden",
    title: "Your weekend deserves better",
    intro: "A washing machine handles one step. The hours, the drying and the ironing still fall on you.",
    cards: [
      { title: "Hours every week", body: "Washing, drying, folding and ironing eat 3 to 5 hours of your week." },
      { title: "Nowhere to dry", body: "No balcony, strict condo rules or rain - and clothes hang for days." },
      { title: "The dreaded ironing", body: "Even with a machine, the folding and pressing still fall on you." },
    ],
    footer: "We handle every step - including the one you hate most.",
  },
  heritage: {
    eyebrow: "Laundry expertise since 1964",
    title: "Sixty years of care,",
    accent: "reimagined for today.",
    body: "Washd is built on a family laundry heritage that began in 1964. We have carried that practical knowledge forward into a simpler, more transparent membership for modern residential life.",
    points: ["Generations of garment-care experience", "Modern tracking and accountable handling", "A local service designed for Malaysian homes"],
  },
  routine: {
    eyebrow: "02 · The routine",
    title: "Three simple steps",
    intro: "No app to learn and no appointments to book. A simple rhythm built around the week you already keep.",
    steps: [
      { title: "Drop your bag", body: "Leave your sealed, numbered bag at the collection point by 9:30am." },
      { title: "We do the work", body: "We wash, dry, fold and press - each bag on its own, never mixed." },
      { title: "Collect, all done", body: "Collect it fresh at 5:30pm, two days later, ready to wear." },
    ],
    footer: "Same days. Same routine. Every week.",
  },
  services: {
    eyebrow: "03 · What we offer",
    title: "Two services, combined however you like",
    intro: "Most members pair them: everyday clothes washed and folded, work shirts pressed and hung.",
    items: [
      { title: "The Everyday Bag", label: "Wash · Dry · Fold", body: "Casual wear, towels and bedsheets. One price per bag - whatever fits, zipped up." },
      { title: "Pressed & Pristine", label: "Wash · Iron · Hang", body: "Office shirts and work wear, counted by the piece and returned crisp on hangers." },
    ],
    footer: "Keep washing your daily personal items at home - leave everything else to us.",
  },
  membership: {
    eyebrow: "04 · Membership",
    title: "Simple monthly plans",
    intro: "All plans run on the fixed Mon / Wed / Fri schedule. Cancel anytime with two weeks' notice.",
    extraNote: "Extra pressed shirt: +RM 8 each.",
  },
  customPlan: {
    title: "Build your own plan",
    body: "Need a different bag size, more pressed shirts or a schedule for your household? Tell us what would work.",
    features: ["Flexible bag allowance", "Custom pressing mix", "Household or corporate options"],
    cta: "Enquire about a custom plan",
  },
  safety: {
    eyebrow: "05 · Your peace of mind",
    title: "Your clothes, tracked and safe",
    intro: "A simple, disciplined system so nothing is ever lost, mixed up or unaccounted for.",
    cards: [
      { title: "Your own numbered bags", body: "Two personal bags with a unique ID - your identity in our system." },
      { title: "Photographed & counted", body: "Photographed and counted at collection, and again at return." },
      { title: "Washed separately", body: "Always handled as its own load - never combined with anyone else's." },
      { title: "Fully covered", body: "Protected under our guarantee, with an initial investigation update within 48 hours." },
    ],
  },
  benefits: {
    eyebrow: "06 · The difference",
    title: "Why members stay with Washd",
    cards: [
      { title: "Your weekends back", body: "Reclaim 3 to 5 hours every week for what matters." },
      { title: "A professional finish", body: "Crisp, properly pressed shirts - better than at home." },
      { title: "Effortless updates", body: "Simple WhatsApp alerts at collection and return. No app needed." },
      { title: "Total predictability", body: "Same days, same routine, every week." },
    ],
  },
  building: {
    eyebrow: "For building partners",
    title: "One building. One reliable laundry rhythm.",
    body: "Fixed routes make collection simple for residents and efficient for management teams.",
    points: ["A single collection point", "Predictable fixed days", "No rider traffic throughout the week", "A dedicated Washd contact"],
    cta: "Bring Washd to your building",
  },
  faq: {
    eyebrow: "Questions, answered",
    title: "Everything before your first drop.",
    intro: "Clear answers about collections, garment care, tracking, payments and changing your membership.",
    items: [
      { question: "How does the fixed collection schedule work?", answer: "Drop your numbered Washd bag at your building's collection point by 9:30am on a route day. A Monday drop returns Wednesday, and a Wednesday drop returns Friday at 5:30pm." },
      { question: "Can I track my laundry after collection?", answer: "Yes. Your member dashboard updates as your bag is received, cleaned, finished and made ready for collection. You will also see the latest update time and expected return." },
      { question: "Are my clothes washed with another customer's laundry?", answer: "No. Every numbered bag is photographed, counted and processed as its own load. Your garments are never mixed with another household's laundry." },
      { question: "What can go into an Everyday Bag?", answer: "Everyday clothes, towels and suitable bed linen can go into the zipped bag. Delicates, specialty fabrics and items with unusual care labels should be discussed with us first." },
      { question: "Can I add ironing or another bag without changing plans?", answer: "Yes. Choose an à-la-carte add-on while reviewing your plan, or send us a custom-plan enquiry if you need a different recurring combination." },
      { question: "What happens if I miss my building's drop time?", answer: "Your bag moves to the next scheduled route day. Message Washd as soon as possible and we will confirm the next available collection for your building." },
      { question: "How do payments and cancellations work?", answer: "Memberships are billed monthly through secure Stripe checkout. You can manage your payment method and cancel from your account, with two weeks' notice before the next service period." },
      { question: "What if an item is damaged or missing?", answer: "Report the issue within 24 hours of collection. Our photographed count and bag history help us investigate quickly, and qualifying issues are handled under the Washd care guarantee." },
    ],
  },
  enquiry: {
    eyebrow: "Need something different?",
    title: "Let’s build your Washd plan.",
    body: "Share your weekly laundry rhythm, preferred collection point and the mix of wash-fold and pressing you need. Our team will reply with a tailored option.",
    button: "Send my enquiry",
    success: "Thank you — your custom-plan enquiry is with the Washd team. We’ll contact you shortly.",
  },
  finalCta: {
    eyebrow: "Get started this week",
    title: "Ready to never iron again?",
    body: "Setup takes two minutes on WhatsApp. Your first collection can be this week.",
    button: "Message us on WhatsApp",
    steps: ["Message us to sign up", "Receive your two personal bags", "Drop your first bag on the next collection day"],
  },
  policies: {
    privacy: {
      eyebrow: "Your data",
      title: "Privacy Notice",
      intro: "This notice explains how Washd collects, uses, discloses, stores and protects personal data when you visit our website, create an account, make a payment or use our laundry service.",
      lastUpdated: "Last updated 4 August 2026",
      body: "",
    },
    terms: {
      eyebrow: "Clear from the start",
      title: "Service Terms",
      intro: "These terms apply when you create a Washd account, purchase a membership or add-on, or give items to us for collection and care.",
      lastUpdated: "Last updated 4 August 2026",
      body: "",
    },
    serviceInformation: {
      eyebrow: "Before you subscribe",
      title: "Service Information",
      intro: "The supplier, service, price, payment, timing, correction and complaint information for a Washd membership, collected in one place.",
      lastUpdated: "Last updated 4 August 2026",
      body: "",
    },
    careGuarantee: {
      eyebrow: "Tracked and accountable",
      title: "Washd Care Guarantee",
      intro: "Our numbered-bag and service-history process is designed to keep each member’s laundry identifiable from collection to return.",
      lastUpdated: "Last updated 4 August 2026",
      body: "",
    },
  },
  contact: {
    name: "Pravena K",
    legalName: "",
    registrationNumber: "",
    registeredAddress: "",
    phoneDisplay: "017-649 4749",
    whatsappNumber: "60176494749",
    email: "washdmy@gmail.com",
    serviceArea: "Selected residential buildings in Kuala Lumpur",
  },
};

function mergeContentValue(base: unknown, incoming: unknown): unknown {
  if (Array.isArray(base)) return Array.isArray(incoming) ? incoming : base;
  if (base && typeof base === "object") {
    const incomingRecord = incoming && typeof incoming === "object" && !Array.isArray(incoming) ? incoming as Record<string, unknown> : {};
    return Object.fromEntries(Object.entries(base as Record<string, unknown>).map(([key, value]) => [key, mergeContentValue(value, incomingRecord[key])]));
  }
  return incoming === undefined || incoming === null ? base : incoming;
}

export function mergeSiteContent(incoming: unknown): SiteContent {
  return mergeContentValue(defaultSiteContent, incoming) as SiteContent;
}

export function whatsappUrl(content: SiteContent, message = "Hi Washd, I'd like to know more about the laundry membership.") {
  return `https://wa.me/${content.contact.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
