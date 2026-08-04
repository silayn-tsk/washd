# Washd launch checklist — target 11 August 2026

This is the production go/no-go list. A box should only be checked after it is verified on the live domain.

Owner decisions and secure setup handoffs are condensed in `OWNER_LAUNCH_ACTIONS.md`.

## Day 1 — Security and readiness audit

- [x] Confirm Supabase Row Level Security is enabled for member, content, enquiry and operations data.
- [x] Add baseline Firebase browser-security headers.
- [x] Add an owner-only enquiry inbox with follow-up statuses.
- [x] Require at least 10 characters in new-password forms.
- [x] Deploy TOTP authenticator enrollment, MFA login challenge and database/Edge Function enforcement for protected admin operations.
- [ ] Change the owner password from the credential previously shared in chat and complete MFA enrollment at `/admin/security`.
- [x] Set the hosted Supabase minimum password length to 10 so the server matches the forms.
- [ ] Decide the custom production domain.

## Day 2 — Live payments

- [ ] Complete Stripe account activation and business verification.
- [ ] Switch Edge Function secrets from Stripe test mode to live mode.
- [ ] Create or sync live MYR Products and recurring Prices.
- [ ] Create the live Stripe webhook and replace `STRIPE_WEBHOOK_SECRET`.
- [ ] Configure the live Customer Portal cancellation and payment-method rules.
- [ ] Make one low-value real payment, verify the subscription in Stripe and Supabase, then refund it.
- [ ] Verify duplicate, delayed and out-of-order webhook events are safe.
- [x] Deploy webhook event claiming, retry status, and stale-event protection in the test environment.
- [x] Deploy an owner-only Stripe environment audit covering account activation, payout capability, MYR recurring prices, webhook events and customer portal configuration.
- [x] Make checkout recover safely when a stored test-mode customer reference is not present in the active Stripe environment.

## Day 3 — Customer operations

- [ ] Connect a production email provider for signup, password reset and security emails.
- [ ] Enable email confirmation after production SMTP is working.
- [x] Stage branded signup, reset, reauthentication and security-notification email templates with guarded SMTP/confirmation commands.
- [x] Add conditional Cloudflare Turnstile support to signup, login and password recovery.
- [ ] Create the Turnstile production site, add its site/secret keys and enable CAPTCHA in hosted Supabase Auth.
- [ ] Confirm who receives and answers custom-plan enquiries.
- [x] Add owner-only enquiry and payment-health screens to the admin.
- [x] Write the operating process for bag handling, missed collection, damaged items, enquiries, payment failures, cancellations and refunds.
- [ ] Assign named owners for support, refunds, technical incidents and each collection venue in the private operations copy.
- [ ] Verify member IDs, bag IDs, tracking updates and collection timestamps with a test member.

## Day 4 — Trust, legal and discoverability

- [ ] Approve and publish Privacy Notice / Notis Privasi in English and Bahasa Malaysia.
- [ ] Approve and publish Terms of Service, cancellation/refund rules and garment-care policy.
- [x] Publish owner-review drafts of the privacy notice, service terms, care guarantee and consolidated service information in English and Bahasa Malaysia.
- [x] Add full-price, payment-method, estimated-supply, correction, acknowledgement and complaint disclosures required for electronic trade.
- [x] Require terms acceptance before checkout, record the version/time in Stripe metadata and block live checkout while registered supplier details are incomplete.
- [ ] Add the registered business name, registration number, address and support contact.
- [ ] Connect the custom domain and verify HTTPS.
- [x] Make canonical metadata, sitemap and robots host configurable through `NEXT_PUBLIC_SITE_URL` for the custom-domain build.
- [ ] Configure SPF, DKIM and DMARC for the sending domain.
- [ ] Add analytics and consent handling if non-essential cookies are used.
- [ ] Add `robots.txt`, `sitemap.xml`, canonical URL and production social-share metadata.
- [x] Publish `robots.txt`, `sitemap.xml`, canonical metadata and policy-page metadata on the current Firebase domain.

## Day 5 — Full QA

- [ ] Test signup, confirmation, login, logout and password reset on iPhone, Android, Safari, Chrome and Edge.
- [ ] Test all four plans, add-ons, custom-plan enquiry, checkout success/cancel and billing portal.
- [ ] Test member dashboard empty, active, failed-payment and cancelled states.
- [ ] Test admin content editing, plan syncing, enquiry statuses and live tracking.
- [x] Verify the current release in Chrome at desktop and 390 px mobile widths, including navigation, plan details, authenticated dashboard and admin operations screens.
- [x] Run automated accessibility, contrast, performance, SEO and internal broken-link checks on the live Firebase release.
- [ ] Complete physical-device/browser coverage, keyboard-only testing and the production payment states above.

## Day 6 — Launch rehearsal

- [ ] Remove demo users, test subscriptions and misleading sample data from production.
- [x] Inventory prelaunch member, enquiry, tracking and Stripe-event data without deleting records.
- [x] Create a permission-restricted pre-cleanup snapshot of Auth and operational records.
- [ ] Move the pre-cleanup snapshot to encrypted owner-controlled storage.
- [x] Commit the verified launch candidate after checking tracked filenames and pending content for common private-key and payment-secret patterns.
- [ ] Push/copy the launch branch to an owner-controlled off-device source repository.
- [ ] Export/record the current Supabase schema, secrets list and Stripe configuration.
- [x] Add a permission-restricted, git-ignored production recovery-snapshot command and document the restore procedure.
- [ ] Confirm database backup/recovery capability and Firebase rollback steps.
- [ ] Freeze content and complete a full rehearsal on the production domain.
- [ ] Record who owns payments, customer support and technical incidents on launch day.

## Day 7 — Go live

- [ ] Deploy the verified build.
- [ ] Re-run the critical signup → plan → payment → dashboard journey.
- [ ] Monitor Stripe events, Supabase logs, signup errors and enquiries throughout launch day.
- [ ] Announce only after the real payment and customer-email checks pass.

## Current hard blockers

1. Stripe is still in test mode; test payments do not collect real money.
2. Supabase email is using non-production defaults, confirmations are disabled, SMTP is not configured and CAPTCHA is off.
3. Legal/customer-care policies and registered business details are not yet published.
4. The owner password previously appeared in chat and must be replaced before launch.
5. A custom domain and production email sender have not yet been confirmed.
6. Supabase currently reports no stored backups and point-in-time recovery is disabled; a production backup plan is required.
7. Launch-day operating roles and collection-venue contacts still need named owners.
8. Cloudflare Turnstile keys have not been created or enabled in Supabase yet; the frontend integration is staged but intentionally dormant.
9. The launch source is committed locally, but the legacy source remote is inaccessible; create an owner-controlled off-device copy before launch.
10. Production still contains one demo member, two test enquiries, admin test checkout data and the Stripe test event ledger; owner approval is required before destructive cleanup.
11. The bilingual legal pages are implemented but still require the registered supplier details, tax/certification confirmations and owner/professional approval recorded in `LEGAL_READINESS_AUDIT.md`.

## Latest QA baseline — 4 August 2026

- Live Firebase routes checked: 21/21 returned HTTP 200.
- Exported-site internal links checked: 170 references across 14 internal paths, with no broken targets.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100 and SEO 100 on the latest run.
- Mobile Core Web Vitals lab baseline: LCP 1.1 s, FCP 1.1 s, TBT 70 ms and CLS 0.
- `eslint`, TypeScript, application build and all three rendered-HTML tests pass.
- Full evidence and remaining test coverage are recorded in `QA_REPORT.md`.
- `npm run launch:check` now provides a repeatable public-release gate; the current release passes 32/32 checks.
- Operating, incident, refund, tracking and recovery procedures are recorded in `OPERATIONS_RUNBOOK.md`.
- Admin MFA is deployed but intentionally not enforced until the owner scans the QR code and verifies the first six-digit code.
- Hosted Auth now permits redirects only to the production Firebase origin; localhost recovery redirects were removed.
- Branded Auth templates are staged, but Supabase requires custom SMTP before free-tier template changes can be applied.
- `PRELAUNCH_DATA_AUDIT.md` records the exact test-data cleanup proposal. The owner/member separation fix is deployed so the admin account will not consume a future customer ID.
- `/admin/payments` now verifies Stripe mode, account capability, all active prices, the signed webhook and customer portal directly against Stripe without exposing identifiers or keys.
