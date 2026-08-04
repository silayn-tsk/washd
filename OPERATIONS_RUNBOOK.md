# Washd operations and incident runbook

Owner: Washd operations owner

Primary support: washdmy@gmail.com / 017-649 4749
Launch target: 11 August 2026

This is the minimum operating procedure for taking real subscriptions. Replace any role marked **assign before launch** with a named person and telephone number in the private team copy.

## 1. Opening and closing checks

At the start of every service day:

1. Open **Admin → Payment health**. Investigate every failed Stripe event and member marked for payment attention before accepting a bag.
2. Open **Admin → Enquiry inbox**. Contact every new enquiry and change its status to `Contacted`.
3. Open **Admin → Member tracking**. Compare today's expected bags and returns with the physical route sheet.
4. Check Stripe for disputes, failed payments and subscriptions requiring action.
5. Check Supabase Edge Function logs for checkout or webhook errors.

Admin access must use a verified authenticator. The owner completes initial setup at `/admin/security`; after the first successful code, database policies and sensitive Edge Functions require an `aal2` session automatically.

At close:

1. Every physically held bag must have a matching member ID, bag ID, current status and expected return.
2. Every ready bag must be at the stated collection point or have a documented exception.
3. New enquiries, payment failures and care cases must have an owner and next-action time.

## 2. Standard bag journey

Never accept an unlabelled bag.

1. Confirm the member is active and the bag ID matches their account.
2. Photograph the sealed bag, record the item/bag count and note visible concerns.
3. In **Member tracking**, record `Received`, the bag ID, return time and collection location.
4. When processing begins, update to `Washing` only after the bag is physically at that stage.
5. Update to `Finishing` during folding, pressing and final quality control.
6. Recount and photograph the completed order. Resolve discrepancies before marking it ready.
7. Place it at the correct collection point and update to `Ready`.
8. Never type a status in advance to make the dashboard look complete.

## 3. Missed collection or delayed return

- Missed customer drop: do not create a false received scan. Tell the customer the next available route day and record the conversation.
- Operational delay: contact the customer before the promised return time, give a specific new time and keep tracking at the truthful stage.
- Wrong collection point: stop handover, verify member and bag IDs, and move the bag only after the receiving location confirms custody.
- More than two hours late or affecting multiple members: escalate to the operations owner immediately.

## 4. Missing or damaged item

1. Acknowledge the report promptly and ask for member ID, bag ID, collection date, item description and photographs.
2. Preserve the bag photos, counts, tracking history, care labels and team notes. Do not edit or delete evidence.
3. Search the relevant processing and collection areas and compare all bags from the same route.
4. Provide an initial investigation update within 48 hours, even if the investigation is still open.
5. Apply the published Care Guarantee consistently. Possible remedies are re-cleaning, repair, service credit, refund of the affected service or fair current-value compensation.
6. Only the operations owner may approve cash refunds or compensation. Record the decision and reason.

## 5. Payments, cancellations and refunds

- Stripe is the source of truth for charges, subscriptions, refunds and disputes; Supabase mirrors service status for the member experience.
- Retain the order, acknowledgement, Stripe charge/subscription/refund records, selected plan/add-ons and recorded terms version/acceptance for at least three years where required by Malaysian electronic-trade law. Preserve longer where another lawful accounting, tax, dispute or regulatory requirement applies.
- Do not ask a customer to send card details by email, WhatsApp or the enquiry form.
- For a failed payment, ask the customer to update their payment method through **Manage billing**. Pause service if payment remains unresolved.
- For cancellation, confirm the effective end date and two-week notice rule. Do not promise an immediate refund unless the case qualifies under the published terms.
- Issue approved refunds in Stripe against the original charge. Record the refund ID, amount, reason and approver in the private case record.
- After any manual Stripe change, confirm the webhook was processed in **Admin → Payment health** and that the member dashboard reflects the result.

## 6. Custom-plan enquiries

1. New enquiries appear in **Admin → Enquiry inbox**.
2. Contact the person within one business day using the details they provided.
3. Confirm residence, collection point, bags, pressing pieces, frequency and requested start date.
4. Do not take payment for a custom plan until its price, inclusions, route capacity and written terms are approved.
5. Mark the enquiry `Closed` only after it is declined, withdrawn or converted and recorded elsewhere.

## 7. Incident severity

- **SEV-1:** suspected data exposure, unauthorised admin access, payment compromise, widespread incorrect charges or the service unavailable during launch. Stop affected operations, preserve evidence and contact the technical and operations owners immediately.
- **SEV-2:** multiple customers affected, tracking materially wrong, webhook failures accumulating or a route breakdown. Assign an owner within 30 minutes and notify affected customers.
- **SEV-3:** one-customer service issue, individual payment failure or ordinary enquiry. Handle in the normal queue with a recorded next step.

For every SEV-1/2 incident record: start time, reporter, systems affected, customer impact, actions, decisions, evidence links, recovery time and follow-up owner.

## 8. Technical recovery

### Website regression

1. Stop further deployments.
2. In Firebase Console → Hosting → Release history, roll back to the last verified release.
3. Run `npm run launch:check` against the restored site.
4. Verify login, a plan page and the member dashboard before announcing recovery.

### Stripe webhook failure

1. Check **Admin → Payment health** and Supabase function logs.
2. Do not manually invent subscription state in Supabase.
3. Correct the configuration or handler, then use Stripe's webhook event page to resend failed events.
4. Confirm each event becomes `processed` and the relevant profile is correct.

### Database recovery

1. Do not import a backup over production while writes continue.
2. Restrict access and record the incident time.
3. Prefer Supabase managed restore/support where available.
4. If using the project snapshot, restore first into a separate recovery project and verify row counts, RLS, admin access and a member journey.
5. Obtain operations-owner approval before changing production DNS or credentials.

## 9. Backup procedure

Before live mode and after material schema/configuration changes:

```bash
SUPABASE_DB_PASSWORD='copy temporarily from Supabase' npm run backup:production
```

The command creates a permission-restricted, git-ignored snapshot under `backups/`. It includes public schema/data, roles, a secret-name inventory and deployment configuration. It intentionally does not print or store secret values. The snapshot contains customer data; verify it, move it to encrypted access-controlled storage, and remove insecure copies.

This local snapshot supplements rather than replaces Supabase managed backups. Confirm the managed retention/restore capability before launch.

## 10. Launch-day ownership — assign before launch

- Operations and customer support owner: **assign before launch**
- Stripe/refund approver: **assign before launch**
- Technical incident owner: **assign before launch**
- Building/collection-point contact: **assign per venue before launch**

No launch announcement should be sent until the real-payment test, production-email test, recovery snapshot and critical customer journey have passed.

Production email setup and its safe confirmation-enforcement sequence are documented in `PRODUCTION_EMAIL_SETUP.md`.
The implemented disclosure mapping and remaining owner approvals are documented in `LEGAL_READINESS_AUDIT.md`.
