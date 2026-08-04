import type { Metadata } from "next";
import { LegalShell } from "../../legal-shell";
import { CareGuaranteeLocalized } from "../../localized-policies";

export const metadata: Metadata = { title: "护理保障 — Washd", description: "Washd 如何记录、护理及调查洗衣服务问题。", alternates: { canonical: "/care-guarantee/zh", languages: { "en-MY": "/care-guarantee", "ms-MY": "/care-guarantee/bm", "zh-CN": "/care-guarantee/zh", "ko-KR": "/care-guarantee/ko" } } };

export default function CareGuaranteeZhPage() {
  return <LegalShell policyPath="/care-guarantee" locale="zh" eyebrow="可追踪、有责任" title="Washd 护理保障" intro="我们的编号洗衣袋及服务记录流程，旨在确保每位会员的衣物从收集至送回均可识别。"><CareGuaranteeLocalized locale="zh" /></LegalShell>;
}
