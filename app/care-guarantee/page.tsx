import type { Metadata } from "next";
import { LegalShell } from "../legal-shell";

export const metadata: Metadata = { title: "Care Guarantee — Washd", description: "How Washd records, cares for and investigates issues with your laundry.", alternates: { canonical: "/care-guarantee", languages: { "en-MY": "/care-guarantee", "ms-MY": "/care-guarantee/bm", "zh-CN": "/care-guarantee/zh", "ko-KR": "/care-guarantee/ko" } } };

export default function CareGuaranteePage() {
  return (
    <LegalShell policyPath="/care-guarantee" eyebrow="Tracked and accountable" title="Washd Care Guarantee" intro="Our numbered-bag and service-history process is designed to keep each member’s laundry identifiable from collection to return.">
      <section><h2>What we promise</h2><ul><li>We associate each collection with your member and bag identifiers.</li><li>We record the collection and major handling stages in your service history.</li><li>We handle each wash load separately unless you clearly agree otherwise.</li><li>We follow care labels and reasonable professional garment-care practices.</li><li>We investigate a reported missing or damaged item using the available collection, count, photograph and tracking records.</li></ul></section>
      <section><h2>Before handing over your bag</h2><p>Empty every pocket and remove valuables, cash, jewellery, documents, electronics and sharp objects. Check that items are suitable for the selected service. Tell us in writing about delicate materials, loose trims, valuable garments, stains or special instructions before collection. Items without readable care labels are processed using reasonable professional judgement at the customer’s risk.</p></section>
      <section><h2>How to report an issue</h2><p>Inspect returned items as soon as possible and report a missing or damaged item within 24 hours of receiving the returned bag. Email <a href="mailto:washdmy@gmail.com?subject=Care%20Guarantee%20request">washdmy@gmail.com</a> or WhatsApp <a href="https://wa.me/60176494749">017-649 4749</a> with your member ID, bag ID, collection date, item description and clear photographs. Keep the item and packaging available while we investigate.</p></section>
      <section><h2>What happens next</h2><p>We aim to acknowledge and provide an initial investigation update within 48 hours. Depending on the evidence and circumstances, a fair remedy may include re-cleaning or re-pressing, service credit, refund of the affected service, repair, or compensation based on the item’s reasonable current value. We may request proof of purchase, age or condition.</p></section>
      <section><h2>What the guarantee does not cover</h2><p>The guarantee does not cover ordinary wear, pre-existing damage, inherent fabric weakness, colour loss or shrinkage that occurs despite following the care label, undisclosed special requirements, unremovable stains, valuables left in pockets, unsafe or prohibited items, or an issue reported too late for us to investigate reasonably. Each request is assessed on its facts.</p></section>
      <section><h2>Your statutory rights</h2><p>This guarantee is an additional service commitment. It does not remove or reduce any rights or remedies that cannot be excluded under applicable Malaysian law.</p></section>
    </LegalShell>
  );
}
