# Washd owner launch actions — due 11 August 2026

This is the short owner-only companion to `LAUNCH_CHECKLIST.md`. Do not paste passwords, payment keys, SMTP credentials or identity documents into chat or this repository.

## Do now

### 1. Secure the owner account

- Open `https://washd-my-86c6d.web.app/admin/security`.
- Sign in as `washdmy@gmail.com`.
- Enrol an authenticator app and verify the first six-digit code.
- Change the password that was previously shared in chat.
- Store the new password and MFA recovery details in an owner-controlled password manager.

Completion evidence: the security page reports MFA enabled and the owner can log out, log back in and pass the MFA challenge.

### 2. Approve or reject removal of test data

Review `PRELAUNCH_DATA_AUDIT.md`. If the listed records are all test records, give the exact written approval `Approve test-data cleanup`.

This approval permits only the scoped records in that audit to be removed. A restricted pre-cleanup snapshot already exists and must be copied to encrypted owner-controlled storage before launch.

### 3. Supply the public business details

Provide the exact text below as it appears in SSM records:

- Registered business/entity name
- SSM registration number
- Registered or principal business address suitable for customer notices
- Public support email (currently `washdmy@gmail.com`)
- Public WhatsApp/phone (currently `017-649 4749`)
- Confirmed launch collection venue or service-area wording

After confirmation, enter these in Admin → Website content → Contact details and save. They will populate the website disclosure and policy pages.

### 4. Choose the production domain

Choose one final domain before SMTP is configured. The preferred pattern is a short Washd-owned `.com` or `.com.my` domain. The same domain should be used for the website, authentication links and business email.

Do not purchase a domain based only on a chat suggestion; confirm availability, registrant ownership and renewal price at checkout.

## Complete with guided technical setup

### 5. Activate Stripe live mode

- Finish Stripe business and bank-account verification.
- Confirm the bank account that should receive MYR payouts.
- Create live products/prices, customer portal and signed webhook using the guarded setup script.
- Set the live Stripe public Terms of Service URL to the final Washd `/terms` page, then enable Stripe's own required checkbox with the `STRIPE_REQUIRE_TERMS_CONSENT=true` Edge Function secret.
- Store live secrets only in Stripe/Supabase secret storage and the owner password manager.
- Complete one real low-value subscription, verify the database/dashboard update, cancel/refund it and confirm the payout/refund records.

Test-mode card `4242 4242 4242 4242` never moves real money and is not acceptable launch evidence.

### 6. Connect production email

- Create a sender such as `accounts@your-domain` with a production SMTP provider.
- Publish SPF, DKIM and DMARC DNS records.
- Follow `PRODUCTION_EMAIL_SETUP.md` to connect SMTP without prematurely locking out signups.
- Verify a real signup confirmation and password-reset email on mobile before enforcing confirmation.

### 7. Enable signup abuse protection

- Create a Cloudflare Turnstile site for the final production domain.
- Store the secret in Supabase Auth and set the public site key for the frontend build.
- Verify signup, login and password recovery on a real phone after enabling it.

## Approvals needed before announcement

- Approve the English and Bahasa Malaysia privacy notices.
- Approve service terms, two-week cancellation wording, refund rules and the garment-care guarantee.
- Name the people responsible for customer support, refunds, technical incidents and each collection venue on launch day.
- Copy the source repository and recovery snapshot to owner-controlled off-device storage.
- Confirm a production database backup/recovery option.

## Go/no-go rule

Do not announce the launch until all of these are true: owner MFA works, test data is removed, Stripe is live and has passed a real refunded-payment test, transactional email works, legal identity is published, the final domain is secured, and the full signup → plan → payment → dashboard journey passes on both iPhone and Android.
