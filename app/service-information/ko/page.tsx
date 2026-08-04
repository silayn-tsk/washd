import type { Metadata } from "next";
import { LegalShell } from "../../legal-shell";
import { ServiceInformationLocalized } from "../../localized-policies";

export const metadata: Metadata = { title: "서비스 정보 — Washd", description: "Washd 멤버십의 제공업체, 서비스, 가격, 결제, 일정 및 민원 정보입니다.", alternates: { canonical: "/service-information/ko", languages: { "en-MY": "/service-information", "ms-MY": "/service-information/bm", "zh-CN": "/service-information/zh", "ko-KR": "/service-information/ko" } } };

export default function ServiceInformationKoPage() {
  return <LegalShell policyPath="/service-information" locale="ko" eyebrow="구독하기 전에" title="서비스 정보" intro="Washd 멤버십의 제공업체, 서비스, 가격, 결제, 일정, 정정 및 민원 정보를 한곳에서 확인할 수 있습니다."><ServiceInformationLocalized locale="ko" /></LegalShell>;
}
