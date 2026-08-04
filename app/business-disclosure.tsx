"use client";

import { useSiteContent } from "./use-site-content";

export function BusinessDisclosure() {
  const { content } = useSiteContent();
  const contact = content.contact;
  return (
    <aside className="business-disclosure" aria-label="Washd supplier details">
      <strong>Service provider</strong>
      <span>{contact.legalName || "Washd"}{contact.registrationNumber && ` · ${contact.registrationNumber}`}</span>
      {contact.registeredAddress && <span>{contact.registeredAddress}</span>}
      <span>{contact.email} · {contact.phoneDisplay}</span>
    </aside>
  );
}
