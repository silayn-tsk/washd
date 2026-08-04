export type ContentCard = {
  title: string;
  body: string;
};

export type PolicyPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
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
      sections: [
        { heading: "1. Who is responsible for your data?", body: "Washd is the data controller for the personal data described in this notice. You can contact us at {email}, call or WhatsApp {phone}, or write to us through the enquiry form on this website." },
        { heading: "2. Personal data we collect", body: "Depending on how you interact with Washd, we may collect:\n\n- your name, email address, telephone number, residence, unit and collection-point information;\n- account identifiers, login and security information;\n- membership, add-on, billing status and Stripe transaction references—we do not store your full card number;\n- bag identifiers, garment or item counts, collection details, service history, photographs used for service verification and care requests;\n- enquiry messages, support conversations and preferences; and\n- technical and security information such as browser, device, IP address, timestamps and authentication activity." },
        { heading: "3. Where the data comes from", body: "We receive data directly from you when you register, subscribe, submit a form or contact us; from our team when we collect and process your laundry; automatically when you use our website or account; and from payment and technology providers when they confirm a transaction, login or system event." },
        { heading: "4. Why we process it", body: "We process personal data to:\n\n- create and secure your account;\n- provide collections, garment care, tracking, returns and customer support;\n- process subscriptions, add-ons, payments, cancellations and refunds;\n- send service, security and account communications;\n- respond to enquiries and prepare custom plans;\n- prevent fraud, investigate incidents and protect customers, staff and the service; and\n- maintain records and comply with legal, accounting, tax and regulatory obligations.\n\nWhere marketing consent is required, we will ask before sending promotional messages. You may opt out at any time." },
        { heading: "5. Is providing the data required?", body: "Fields identified as required are necessary to create your account, provide the requested service or respond to an enquiry. If you do not provide them, we may be unable to complete that request. Optional information helps us tailor collections or support and may be left blank." },
        { heading: "6. Who we disclose it to", body: "We disclose only the data reasonably needed to service providers and authorised people supporting Washd, including Supabase for accounts and operational data, Stripe for payment processing, Google Firebase for website hosting, communication providers, building or collection-point personnel where necessary to complete a collection, professional advisers and public authorities where disclosure is required or permitted by law. We do not sell personal data." },
        { heading: "7. International processing", body: "Some technology providers may process or store data outside Malaysia. We make such transfers only where permitted by applicable Malaysian data-protection law and take reasonable steps to use reputable providers, contractual protection and safeguards appropriate to the data and transfer." },
        { heading: "8. Security and retention", body: "We use access controls, encrypted connections, restricted administrator permissions and service-provider security measures. No system can be guaranteed completely secure. We retain data only for as long as needed for the purposes above, to resolve disputes and to meet applicable legal, accounting and tax requirements. Electronic trade transaction records are retained for at least three years where required by law. Data is then deleted or anonymised where reasonably practicable." },
        { heading: "9. Your choices and rights", body: "Subject to applicable law, you may ask whether we hold your data, request access or correction, withdraw consent, object to direct marketing, ask us to restrict or stop certain processing, or request data portability where that right applies. Email {email} with ‘Personal data request’ in the subject. We may need to verify your identity before acting." },
        { heading: "10. Cookies and account storage", body: "The website uses storage necessary to keep members securely signed in and operate account features. We will ask for consent before introducing non-essential advertising or analytics cookies where consent is required." },
        { heading: "11. Changes and complaints", body: "We may update this notice when our service or legal obligations change and will post the updated date here. Please contact us first if you have a concern so we can investigate. You may also contact Malaysia’s Personal Data Protection Department." },
      ],
    },
    terms: {
      eyebrow: "Clear from the start",
      title: "Service Terms",
      intro: "These terms apply when you create a Washd account, purchase a membership or add-on, or give items to us for collection and care.",
      lastUpdated: "Last updated 4 August 2026",
      sections: [
        { heading: "1. The service", body: "Washd provides recurring laundry collection and return services at {serviceArea}. Availability depends on an active route, collection point and service capacity. The plan detail shown before payment states the included bag size, frequency, pressed pieces, add-ons, price and current collection rhythm." },
        { heading: "2. Accounts and eligibility", body: "You must provide accurate contact, residence and collection information and keep your login secure. An account is personal to the member and should not be shared. You must be at least 18 years old or have permission from a parent or legal guardian to subscribe." },
        { heading: "3. Memberships, prices and payment", body: "Prices are displayed in Malaysian Ringgit before checkout. A membership renews monthly until cancelled. Stripe processes payment using the method you provide. By confirming checkout, you authorise the recurring plan price and selected recurring add-ons. Any taxes or unavoidable additional charges will be shown before payment where applicable.\n\nIf payment fails, we may retry payment, ask you to update the payment method, pause collections or end the membership. A successful checkout is confirmed on screen and in your Washd account." },
        { heading: "4. Cancellation and refunds", body: "You may request cancellation through the billing portal or by contacting Washd. Please give at least two weeks’ notice before the next service period. Cancellation normally takes effect at the end of the paid billing period; a late request may take effect for the following period.\n\nMembership charges are normally non-refundable once the service period has begun or included collections have been used. We will correct duplicate or incorrect charges and consider refunds where Washd cannot provide the purchased service. Nothing in these terms limits rights or remedies that cannot lawfully be excluded under Malaysian consumer law." },
        { heading: "5. Collections and returns", body: "Place your sealed, numbered Washd bag at the confirmed collection point by the stated time. Late bags may move to the next available collection. A bag dropped by 9:30am on a confirmed Monday route is normally ready at 5:30pm Wednesday; a Wednesday drop is normally ready at 5:30pm Friday. Returns are estimates and can change because of building access, garment-care requirements, equipment issues, weather or events outside reasonable control. We will communicate material delays using the contact details on your account.\n\nYou are responsible for collecting returned items promptly and for keeping access and collection information current." },
        { heading: "6. Items and customer responsibilities", body: "Check all pockets and remove cash, jewellery, documents, electronics, sharp objects and valuables. Tell us about delicate items, stains, colour-fastness concerns or special care before collection. Do not submit contaminated, hazardous, illegal or pest-infested items. Washd may refuse an unsafe or unsuitable item.\n\nWe follow available care labels and reasonable professional judgement. Some stains, wear, dye transfer, shrinkage or pre-existing weakness cannot be safely corrected. See the Washd Care Guarantee for reporting and investigation details." },
        { heading: "7. Communications", body: "We may contact you by email, telephone or WhatsApp about collections, tracking, payments, security and support. Service messages are part of operating the membership. Promotional messages will include a way to opt out where required." },
        { heading: "8. Changes to plans or service", body: "We may update routes, collection times, service features or future prices. We will give reasonable advance notice of a material change affecting an existing paid membership. Changes do not alter a completed payment without your agreement except where required by law." },
        { heading: "9. Responsibility and events beyond control", body: "Washd is responsible for providing the service with reasonable care and skill. We are not responsible for delay or failure caused by events outside reasonable control, or for loss caused by inaccurate instructions, undeclared item characteristics, valuables left in pockets or breach of these terms. Nothing here excludes liability that cannot lawfully be excluded." },
        { heading: "10. Contact and governing law", body: "Questions, cancellation requests and complaints can be sent to {email} or WhatsApp {phone}. These terms are governed by the laws of Malaysia. We will first try to resolve any complaint directly and fairly." },
      ],
    },
    serviceInformation: {
      eyebrow: "Before you subscribe",
      title: "Service Information",
      intro: "The supplier, service, price, payment, timing, correction and complaint information for a Washd membership, collected in one place.",
      lastUpdated: "Last updated 4 August 2026",
      sections: [
        { heading: "1. Supplier and website", body: "This service is offered by {businessName} through {website}. The email address is {email} and the telephone/WhatsApp number is {phone}.\n\nCurrent service area: {serviceArea}." },
        { heading: "2. Main features and full prices", body: "The current membership plans are:\n\n{plans}\n\nOptional monthly add-ons:\n\n{addons}\n\nDisplayed prices include collection and return at the confirmed building collection point. The complete total for the selected plan and add-ons, including any applicable tax or other charge, is displayed before payment is confirmed. No additional charge will be imposed without your agreement." },
        { heading: "3. Payment method and timing", body: "Payment is made in Malaysian Ringgit through secure Stripe-hosted checkout using a card or another payment method displayed by Stripe. The plan and selected add-ons recur monthly until cancelled. Washd does not store the complete card number." },
        { heading: "4. Supply of the service", body: "Bags are dropped by 9:30am on the confirmed building route day and are normally ready at 5:30pm two days later: Monday to Wednesday or Wednesday to Friday. Your building-specific schedule is confirmed before service starts. Material delays will be communicated." },
        { heading: "5. Terms, cancellation and corrections", body: "Read the Service Terms before payment. You can change the plan and add-ons or return from Stripe before confirming payment. After an order is made, contact Washd promptly to correct an error. Cancellation requires at least two weeks’ notice before the next service period." },
        { heading: "6. Acknowledgement and records", body: "A successful payment is acknowledged on screen, in the Washd account and through the Stripe transaction/receipt record. Washd retains electronic trade transaction records for at least three years where required by law." },
        { heading: "7. Complaints and remedies", body: "Send a complaint or correction request to {email} or WhatsApp {phone}. If a service is not reasonably fit or is not supplied as offered, Washd will investigate and provide a fair remedy according to the circumstances and applicable law. See the Washd Care Guarantee." },
        { heading: "8. Care and safety", body: "Washd follows care labels and reasonable professional garment-care practices. Hazardous, contaminated, illegal or unsuitable items must not be included. Where a competent authority specifies a safety or health standard applicable to the service, Washd will follow it." },
      ],
    },
    careGuarantee: {
      eyebrow: "Tracked and accountable",
      title: "Washd Care Guarantee",
      intro: "Our numbered-bag and service-history process is designed to keep each member’s laundry identifiable from collection to return.",
      lastUpdated: "Last updated 4 August 2026",
      sections: [
        { heading: "What we promise", body: "- We associate each collection with your member and bag identifiers.\n- We record the collection and major handling stages in your service history.\n- We handle each wash load separately unless you clearly agree otherwise.\n- We follow care labels and reasonable professional garment-care practices.\n- We investigate a reported missing or damaged item using the available collection, count, photograph and tracking records." },
        { heading: "Before handing over your bag", body: "Empty every pocket and remove valuables, cash, jewellery, documents, electronics and sharp objects. Check that items are suitable for the selected service. Tell us in writing about delicate materials, loose trims, valuable garments, stains or special instructions before collection. Items without readable care labels are processed using reasonable professional judgement at the customer’s risk." },
        { heading: "How to report an issue", body: "Inspect returned items as soon as possible and report a missing or damaged item within 24 hours of receiving the returned bag. Email {email} or WhatsApp {phone} with your member ID, bag ID, collection date, item description and clear photographs. Keep the item and packaging available while we investigate." },
        { heading: "What happens next", body: "We aim to acknowledge and provide an initial investigation update within 48 hours. Depending on the evidence and circumstances, a fair remedy may include re-cleaning or re-pressing, service credit, refund of the affected service, repair, or compensation based on the item’s reasonable current value. We may request proof of purchase, age or condition." },
        { heading: "What the guarantee does not cover", body: "The guarantee does not cover ordinary wear, pre-existing damage, inherent fabric weakness, colour loss or shrinkage that occurs despite following the care label, undisclosed special requirements, unremovable stains, valuables left in pockets, unsafe or prohibited items, or an issue reported too late for us to investigate reasonably. Each request is assessed on its facts." },
        { heading: "Your statutory rights", body: "This guarantee is an additional service commitment. It does not remove or reduce any rights or remedies that cannot be excluded under applicable Malaysian law." },
      ],
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
