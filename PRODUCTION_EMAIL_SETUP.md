# Washd production email setup

Production Auth email is not complete until a real signup email and password-reset email arrive through a verified Washd sending domain.

## Required from the owner

1. Choose the production website domain.
2. Create a sender such as `accounts@your-domain.my` with an SMTP provider.
3. Verify the domain and publish the provider's SPF and DKIM records.
4. Add a DMARC record, initially using a monitoring policy if necessary.
5. Keep the SMTP password in a password manager. Never paste it into chat or commit it to the repository.

## Safe connection sequence

From `/Users/thana.silan/washd-site`, provide the SMTP values only in the current Terminal command:

```bash
SMTP_HOST='provider-host' \
SMTP_PORT='587' \
SMTP_USER='provider-user' \
SMTP_PASS='provider-password' \
SMTP_ADMIN_EMAIL='accounts@your-domain.my' \
SMTP_SENDER_NAME='Washd' \
npm run auth:smtp:apply
```

This connects SMTP but deliberately leaves signup auto-confirmation on.

Then:

1. Run `npm run auth:emails:apply` to install the staged Washd templates and security notifications.
2. Request a password reset for an existing test member and verify the message arrives, looks correct and opens the Washd reset page.
3. Temporarily create a new test member with email confirmation enabled only during the controlled rehearsal, or use the Supabase email testing workflow to prove confirmation delivery.
4. Disable the SMTP provider's link tracking; rewritten authentication links can fail.
5. Confirm the From name/address, subject, mobile layout, spam-folder behavior and link destination.
6. Only after both flows pass, enforce confirmation:

```bash
WASHD_EMAIL_TEST_CONFIRMED=true npm run auth:smtp:enable-confirmation
```

## Go/no-go rules

- Do not enforce confirmation before SMTP delivery works; doing so can lock every new customer out.
- Do not launch with Supabase's default mail provider.
- Do not launch if SPF/DKIM are failing or the reset link points to localhost/a preview domain.
- Record the SMTP provider, sender, DNS status and successful test time in the private launch record.
