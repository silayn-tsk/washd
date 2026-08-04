import type { Metadata } from "next";
import { LegalShell } from "../legal-shell";
import { ServiceInformationContent } from "../service-information-content";

export const metadata: Metadata = { title: "Service Information — Washd", description: "Supplier, service, pricing, payment, delivery and complaint information for Washd memberships.", alternates: { canonical: "/service-information", languages: { "en-MY": "/service-information", "ms-MY": "/service-information/bm", "zh-CN": "/service-information/zh", "ko-KR": "/service-information/ko" } } };

export default function ServiceInformationPage() {
  return <LegalShell policyPath="/service-information" eyebrow="Before you subscribe" title="Service Information" intro="The supplier, service, price, payment, timing, correction and complaint information for a Washd membership, collected in one place."><ServiceInformationContent locale="en" /></LegalShell>;
}
