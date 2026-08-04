import type { Metadata } from "next";
import { LegalShell } from "../../legal-shell";
import { TermsLocalized } from "../../localized-policies";

export const metadata: Metadata = { title: "서비스 약관 — Washd", description: "Washd 세탁 멤버십, 수거, 결제 및 취소 약관입니다.", alternates: { canonical: "/terms/ko", languages: { "en-MY": "/terms", "ms-MY": "/terms/bm", "zh-CN": "/terms/zh", "ko-KR": "/terms/ko" } } };

export default function TermsKoPage() {
  return <LegalShell policyPath="/terms" locale="ko" eyebrow="처음부터 명확하게" title="서비스 약관" intro="Washd 계정을 만들거나 멤버십·추가 서비스를 구매하거나 수거 및 관리를 위해 품목을 맡길 때 적용되는 약관입니다."><TermsLocalized locale="ko" /></LegalShell>;
}
