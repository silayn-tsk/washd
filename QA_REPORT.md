# Washd release QA report

Date: 4 August 2026

Target launch: 11 August 2026
Release checked: <https://washd-my-86c6d.web.app>

## Result

The current Firebase release is visually stable on desktop and mobile Chrome, has no known broken internal routes, and passes the automated quality baseline. It is not yet approved for production payments because live Stripe, production email, legal business details and the remaining physical-device journeys still need to be completed.

## Verified on the live release

- Desktop homepage at 1440 × 900 with no horizontal overflow.
- Mobile homepage and menu at 390 × 844.
- Mobile navigation to plans and direct custom-enquiry anchor behavior.
- Plan detail page, add-on presentation and responsive layout.
- Login and signup layouts at mobile width.
- Authenticated member dashboard and tracking presentation.
- Owner-only payments and enquiries admin screens.
- Owner-only Stripe environment readiness audit; unauthenticated invocation is rejected by the hosted function gateway.
- Twenty-one public/member/admin/metadata routes return HTTP 200, including bilingual service information, terms and care-guarantee routes.
- One hundred and seventy internal link references across fourteen paths resolve with no failures.
- Browser console showed no errors during the checked journeys.

## Automated baseline

Latest mobile Lighthouse run:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.1 s |
| Largest Contentful Paint | 1.1 s |
| Total Blocking Time | 70 ms |
| Cumulative Layout Shift | 0 |

Lighthouse is a lab test and results can vary with network and server conditions. The earlier runs ranged from 69–77 for performance before CSS delivery and above-the-fold rendering were corrected; accessibility rose from 96 to 100 after contrast fixes.

Build verification:

- ESLint: pass
- TypeScript: pass
- Firebase static export: pass
- Rendered-HTML tests: 3/3 pass

## Issues corrected in this QA pass

- Prevented member-header links from crowding narrow screens.
- Restored direct links to the custom-plan enquiry after CMS content loads.
- Removed internal implementation wording from the customer account experience.
- Prevented billing management before a customer has a payment method.
- Increased important mobile touch targets.
- Removed slow above-the-fold reveal behavior.
- Corrected five text/background contrast failures.
- Replaced page `no-store` caching with revalidation while preserving immutable static assets.
- Inlined the release CSS to remove the render-blocking stylesheet request.
- Added enforceable owner MFA, CSP/HSTS headers and configurable production-domain metadata.
- Added direct test/live Stripe mode, payout, price, webhook and portal verification to payment operations.
- Added safe recovery from stale cross-mode Stripe customer references during checkout.
- Added bilingual electronic-trade disclosures, terms and care-guarantee pages with correct `lang` and alternate-language metadata.
- Required terms acceptance before payment and added a live-mode supplier-identity safety gate.

## Still required before go-live approval

- Test signup confirmation, password reset and security emails using production SMTP.
- Test CAPTCHA after it is enabled.
- Test all four plans and add-on combinations against Stripe live mode.
- Complete one low-value real payment, webhook update, portal visit, cancellation and refund.
- Verify checkout cancel, failed payment, past-due and cancelled dashboard states.
- Test admin content save, plan sync, enquiry status changes and tracking updates end to end.
- Run keyboard-only coverage and physical iPhone/Safari, Android/Chrome and desktop Edge checks.
- Add the approved legal business name, registration number and registered address.
- Obtain owner/professional approval of the implemented bilingual legal drafts and confirm tax/certification statements.
- Connect and test the production domain.
- Confirm the production backup and recovery procedure.

The release must remain a no-go until the real-payment and production-email journeys pass.
