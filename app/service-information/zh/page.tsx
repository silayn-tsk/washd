import type { Metadata } from "next";
import { LegalShell } from "../../legal-shell";
import { ServiceInformationLocalized } from "../../localized-policies";

export const metadata: Metadata = { title: "服务资料 — Washd", description: "Washd 会员的供应商、服务、价格、付款、时间及投诉资料。", alternates: { canonical: "/service-information/zh", languages: { "en-MY": "/service-information", "ms-MY": "/service-information/bm", "zh-CN": "/service-information/zh", "ko-KR": "/service-information/ko" } } };

export default function ServiceInformationZhPage() {
  return <LegalShell policyPath="/service-information" locale="zh" eyebrow="订阅之前" title="服务资料" intro="Washd 会员计划的供应商、服务、价格、付款、时间、更正及投诉资料均集中于此。"><ServiceInformationLocalized locale="zh" /></LegalShell>;
}
