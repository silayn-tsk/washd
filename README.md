# Washd web

Washd is a Malaysian laundry membership website. Its public frontend can remain on Firebase Hosting while Supabase provides authentication, PostgreSQL data, Row Level Security, and Stripe Edge Functions.

## Local configuration

Copy `.env.example` to `.env.local` and add the browser-safe values from the Supabase project API settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
NEXT_PUBLIC_SITE_URL=https://washd-my-86c6d.web.app
# Add after creating the production Cloudflare Turnstile site:
NEXT_PUBLIC_TURNSTILE_SITE_KEY=replace_with_site_key
```

Never add a Supabase secret key, service-role key, Stripe secret key, or webhook secret to a `NEXT_PUBLIC_` variable.

## Supabase backend

The migration in `supabase/migrations` creates:

- four Washd plans;
- private member profiles;
- bags and collection schedules;
- Stripe subscription fields protected from browser writes;
- Row Level Security policies; and
- a signed-event ledger for idempotent Stripe webhooks.

Deploy the migration and Edge Functions with the Supabase CLI after linking the project:

```sh
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-billing-portal-session
npx supabase functions deploy stripe-webhook --no-verify-jwt
npx supabase functions deploy admin-save-plans admin-update-tracking
```

Set these hosted Edge Function secrets through the Supabase Dashboard or CLI:

```env
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME
STRIPE_PORTAL_CONFIGURATION_ID=bpc_REPLACE_ME
APP_BASE_URL=https://washd-my-86c6d.web.app
ALLOWED_ORIGINS=https://washd-my-86c6d.web.app
```

The helper `npm run supabase:stripe` creates or reuses the four monthly MYR Stripe Prices, configures the customer portal and webhook, and writes the resulting identifiers to a permission-restricted output file. It refuses live Stripe keys unless `ALLOW_LIVE_STRIPE=true` is explicitly provided.

## Validate

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build:firebase
npm run launch:check
```

`npm run launch:check` checks the live routes, required content, search metadata and security headers. It exits unsuccessfully if a release gate fails.

## Production operations

- `LAUNCH_CHECKLIST.md` is the authoritative go/no-go list.
- `OPERATIONS_RUNBOOK.md` covers bag handling, support, payments, incidents and recovery.
- `QA_REPORT.md` records verified coverage and remaining physical-device tests.
- `PRODUCTION_EMAIL_SETUP.md` describes the guarded SMTP and email-confirmation sequence.
- `npm run backup:production:dry-run` validates the recovery-snapshot procedure.
- `npm run auth:emails:check` validates staged Auth templates without changing hosted settings.
- `/admin/security` lets the owner enroll an authenticator and replace the shared password. Admin database policies and sensitive functions require MFA after enrollment.
- `/admin/payments` checks Stripe mode, charge/payout capability, every active MYR price, webhook coverage and the billing portal without exposing payment credentials or account identifiers.

## Public deployment

The current public Firebase Hosting site is `https://washd-my-86c6d.web.app`. Build it with `npm run build:firebase`, then deploy the generated `out` directory with `firebase deploy --only hosting`.

For a custom domain build, set `NEXT_PUBLIC_SITE_URL` before building so canonical links, Open Graph metadata, `robots.txt` and `sitemap.xml` use the final origin. Update Supabase Auth URLs plus the Stripe `APP_BASE_URL` and `ALLOWED_ORIGINS` at the same time.
