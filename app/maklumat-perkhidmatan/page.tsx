import type { Metadata } from "next";
import { LegalShell } from "../legal-shell";
import { ServiceInformationContent } from "../service-information-content";

export const metadata: Metadata = { title: "Maklumat Perkhidmatan — Washd", description: "Maklumat pembekal, perkhidmatan, harga, bayaran, masa pembekalan dan aduan untuk keahlian Washd.", alternates: { canonical: "/service-information/bm", languages: { "en-MY": "/service-information", "ms-MY": "/service-information/bm", "zh-CN": "/service-information/zh", "ko-KR": "/service-information/ko" } } };

export default function ServiceInformationBmPage() {
  return <LegalShell policyPath="/service-information" locale="ms" eyebrow="Sebelum anda melanggan" title="Maklumat Perkhidmatan" intro="Maklumat pembekal, perkhidmatan, harga, bayaran, masa pembekalan, pembetulan dan aduan bagi keahlian Washd dalam satu halaman."><ServiceInformationContent locale="ms" /></LegalShell>;
}
