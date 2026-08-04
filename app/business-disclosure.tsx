"use client";

import { useSiteContent } from "./use-site-content";

export function BusinessDisclosure({ locale = "en" }: { locale?: "en" | "ms" }) {
  const { content } = useSiteContent();
  const contact = content.contact;
  const serviceArea = locale === "ms" && contact.serviceArea === "Selected residential buildings in Kuala Lumpur"
    ? "Bangunan kediaman terpilih di Kuala Lumpur"
    : contact.serviceArea;
  return (
    <aside className="business-disclosure" aria-label={locale === "ms" ? "Butiran pembekal Washd" : "Washd supplier details"}>
      <strong>{locale === "ms" ? "Penyedia perkhidmatan" : "Service provider"}</strong>
      <span>{contact.legalName || contact.name || "Washd"}{contact.registrationNumber && ` · ${contact.registrationNumber}`}</span>
      {contact.registeredAddress && <span>{contact.registeredAddress}</span>}
      <span>{contact.email} · {contact.phoneDisplay}</span>
      <span>{serviceArea}</span>
    </aside>
  );
}
