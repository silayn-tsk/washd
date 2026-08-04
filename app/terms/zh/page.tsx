import type { Metadata } from "next";
import { LegalShell } from "../../legal-shell";
import { TermsLocalized } from "../../localized-policies";

export const metadata: Metadata = { title: "服务条款 — Washd", description: "Washd 洗衣会员、收集、付款及取消条款。", alternates: { canonical: "/terms/zh", languages: { "en-MY": "/terms", "ms-MY": "/terms/bm", "zh-CN": "/terms/zh", "ko-KR": "/terms/ko" } } };

export default function TermsZhPage() {
  return <LegalShell policyPath="/terms" locale="zh" eyebrow="从一开始就清楚" title="服务条款" intro="当您建立 Washd 账户、购买会员计划或附加项目，或将物品交给我们收集及护理时，本条款适用。"><TermsLocalized locale="zh" /></LegalShell>;
}
