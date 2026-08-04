"use client";

import { useSiteContent } from "./use-site-content";

export function BusinessDisclosure({ locale = "en" }: { locale?: "en" | "ms" | "zh" | "ko" }) {
  const { content } = useSiteContent();
  const contact = content.contact;
  const serviceArea = contact.serviceArea === "Selected residential buildings in Kuala Lumpur"
    ? locale === "ms" ? "Bangunan kediaman terpilih di Kuala Lumpur" : locale === "zh" ? "吉隆坡指定住宅大楼" : locale === "ko" ? "쿠알라룸푸르 내 지정 주거 건물" : contact.serviceArea
    : contact.serviceArea;
  const label = locale === "ms" ? "Penyedia perkhidmatan" : locale === "zh" ? "服务提供者" : locale === "ko" ? "서비스 제공자" : "Service provider";
  return (
    <aside className="business-disclosure" aria-label={label}>
      <strong>{label}</strong>
      <span>{contact.legalName || "Washd"}{contact.registrationNumber && ` · ${contact.registrationNumber}`}</span>
      {contact.registeredAddress && <span>{contact.registeredAddress}</span>}
      <span>{contact.email} · {contact.phoneDisplay}</span>
      <span>{serviceArea}</span>
    </aside>
  );
}
