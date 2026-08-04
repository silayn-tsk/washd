# Washd legal-readiness audit — 4 August 2026

This is a technical implementation audit, not legal advice. The owner must have the final wording and business details reviewed and approved before accepting real customers.

## Authoritative baseline reviewed

- Malaysia Personal Data Protection Department guidance on the seven PDPA principles, Section 7 notice requirements, and privacy notices in Bahasa Malaysia and English.
- Consumer Protection (Electronic Trade Transaction) Regulations 2024, P.U. (A) 449, effective 25 December 2024.
- Stripe Checkout documentation for recording active acceptance of terms.

## Electronic-trade disclosure mapping

| Prescribed information | Washd implementation | Launch state |
| --- | --- | --- |
| Supplier/company name | Shared supplier disclosure on every legal page | **Owner must replace the contact-name fallback with the registered entity name** |
| Website address | Current production origin shown on both service-information pages | Ready for current host; update with final domain |
| Email and telephone | `washdmy@gmail.com` and `017-649 4749` | Published; owner to confirm |
| Place of trade/business | Shared supplier disclosure | **Registered/business address missing** |
| Main service characteristics | Plan details plus bilingual consolidated service-information pages | Published |
| Full price including other costs | Current plan/add-on totals and pre-payment total statement | Published; verify tax treatment with owner/accountant |
| Payment method | MYR payment through Stripe-hosted checkout | Published; Stripe remains test mode |
| Terms and conditions | English and Bahasa Malaysia service terms | Published as owner-review drafts |
| Estimated service time | Confirmed route statement: Monday-Wednesday or Wednesday-Friday, normally two days | Published |
| Applicable safety/health certification | No unsupported certification claim; applicable-authority standard commitment only | Owner to confirm whether any specific certification applies |

Additional 2024 requirements addressed:

- National-language disclosure: `/maklumat-perkhidmatan`, `/terms/bm`, `/privacy/bm` and `/care-guarantee/bm`.
- Error correction: customers can revise plan/add-ons or return from Stripe before payment and use the published support channels after confirmation.
- Order acknowledgement: successful checkout is shown on screen, in the member account and in Stripe's transaction/receipt record.
- Complaint channel: email and WhatsApp are published throughout the legal pages.
- Electronic transaction retention: the operations runbook requires retaining payment, subscription, terms-acceptance and related transaction records for at least three years where required.

## Personal-data notice mapping

- English and Bahasa Malaysia notices are published and linked at the signup and enquiry collection points.
- The notices describe data categories, sources, purposes, required/optional fields, disclosure classes, international processing, security, retention, rights, cookies, changes and complaint channels.
- The notices now state the minimum three-year electronic-transaction retention requirement and data portability where applicable.
- Marketing is not bundled into account creation; promotional messages require the appropriate consent and opt-out.

## Checkout safeguards

- A customer must accept the Service Terms and Service Information before the website enables “Make payment”.
- The checkout function rejects requests without acceptance and records terms version `2026-08-04` plus the acceptance timestamp in Stripe Checkout and subscription metadata.
- When Stripe is in live mode, checkout refuses to proceed unless registered supplier name, SSM number and business address are populated in the CMS.
- Stripe's own terms checkbox can be enabled with `STRIPE_REQUIRE_TERMS_CONSENT=true` after the public terms URL is configured in the live Stripe Dashboard.

## Remaining owner/legal gates

1. Supply the registered entity name, SSM registration number and business address.
2. Confirm the final domain and update all website/auth/payment URLs.
3. Confirm whether displayed prices include all applicable SST/tax and whether any specific safety or health certification applies.
4. Approve the English and Bahasa Malaysia notices, service terms, cancellation/refund rules and care guarantee after appropriate professional review.
5. Confirm the public support contact and service/collection area.

The website remains a legal no-go for live checkout until these facts and approvals are complete.
