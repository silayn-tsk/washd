import type { Metadata } from "next";
import { LegalShell } from "../../legal-shell";
import { CareGuaranteeLocalized } from "../../localized-policies";

export const metadata: Metadata = { title: "케어 보장 — Washd", description: "Washd의 세탁 기록, 관리 및 문제 조사 절차입니다.", alternates: { canonical: "/care-guarantee/ko", languages: { "en-MY": "/care-guarantee", "ms-MY": "/care-guarantee/bm", "zh-CN": "/care-guarantee/zh", "ko-KR": "/care-guarantee/ko" } } };

export default function CareGuaranteeKoPage() {
  return <LegalShell policyPath="/care-guarantee" locale="ko" eyebrow="추적 가능하고 책임 있게" title="Washd 케어 보장" intro="번호가 있는 가방과 서비스 이력 절차를 통해 수거부터 반환까지 각 회원의 세탁물을 식별할 수 있도록 합니다."><CareGuaranteeLocalized locale="ko" /></LegalShell>;
}
