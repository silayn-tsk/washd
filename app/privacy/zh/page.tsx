import type { Metadata } from "next";
import { LegalShell } from "../../legal-shell";
import { PrivacyLocalized } from "../../localized-policies";

export const metadata: Metadata = { title: "隐私声明 — Washd", description: "Washd 如何收集、使用、共享及保护个人数据。", alternates: { canonical: "/privacy/zh", languages: { "en-MY": "/privacy", "ms-MY": "/privacy/bm", "zh-CN": "/privacy/zh", "ko-KR": "/privacy/ko" } } };

export default function PrivacyZhPage() {
  return <LegalShell policyPath="/privacy" locale="zh" eyebrow="您的数据" title="隐私声明" intro="本声明说明您浏览网站、建立账户、付款或使用洗衣服务时，Washd 如何收集、使用、披露、储存及保护个人数据。"><PrivacyLocalized locale="zh" /></LegalShell>;
}
