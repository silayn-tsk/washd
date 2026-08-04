import type { Metadata } from "next";
import { LegalShell } from "../../legal-shell";
import { PrivacyLocalized } from "../../localized-policies";

export const metadata: Metadata = { title: "개인정보 처리방침 — Washd", description: "Washd의 개인정보 수집, 이용, 제공 및 보호 방법입니다.", alternates: { canonical: "/privacy/ko", languages: { "en-MY": "/privacy", "ms-MY": "/privacy/bm", "zh-CN": "/privacy/zh", "ko-KR": "/privacy/ko" } } };

export default function PrivacyKoPage() {
  return <LegalShell policyPath="/privacy" locale="ko" eyebrow="귀하의 정보" title="개인정보 처리방침" intro="웹사이트 방문, 계정 생성, 결제 또는 세탁 서비스 이용 시 Washd가 개인정보를 수집·이용·제공·보관·보호하는 방법을 설명합니다."><PrivacyLocalized locale="ko" /></LegalShell>;
}
