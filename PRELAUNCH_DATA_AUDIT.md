# Washd prelaunch data audit

Audit date: 4 August 2026

No records have been removed. This report identifies the exact cleanup proposed before Stripe live mode.

## Current hosted state

- 2 Auth-backed member profiles.
- 1 owner/admin identity, currently also represented as member `washd02`.
- 1 demo member, `washd01`, with a test subscription, one demo bag and two demo return records.
- 2 custom-plan enquiries submitted during testing.
- 133 Stripe test webhook ledger entries.
- Both profiles contain Stripe test-mode checkout/customer references.
- No real customer production payment has been taken.

## Proposed cleanup requiring owner approval

1. Delete demo Auth user/member `washd01`; its profile, bag and collections will cascade safely.
2. Keep the `washdmy@gmail.com` Auth user and admin permission, but remove its customer profile and test checkout/customer references.
3. Delete the two confirmed test enquiries.
4. Clear the Stripe webhook event ledger before attaching live-mode secrets.
5. Reset `washd_member_number_seq` so the first real customer receives `washd01`.
6. Recheck that zero profiles contain `cs_test_` checkout references before enabling live checkout.

The owner/admin exclusion migration prevents future account updates from recreating a customer profile for the Washd owner email.

## Evidence required after cleanup

- Admin identity can still open `/admin` after MFA.
- Member/profile count is zero before the first real customer signup.
- Bag, collection, enquiry and Stripe-event test counts are zero.
- Member sequence next value produces `washd01` during the controlled signup rehearsal.
- Stripe live checkout creates a new live customer instead of reusing any test customer ID.
