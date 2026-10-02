# Washd project handover

Updated 2 October 2026. Read this file when moving to a new laptop or continuing the project in a fresh chat.

## Project and services

Washd is a Malaysian residential laundry membership website with a public frontend, member dashboard, admin tools, Supabase authentication/database, and Stripe subscriptions.

- GitHub repository: `https://github.com/silayn-tsk/washd`
- GitHub branch: `main`
- Public domain: `https://washdmy.com`
- Firebase Hosting URL: `https://washd-my-86c6d.web.app`
- Firebase project: `kleen-86c6d`
- Firebase Hosting site: `washd-my-86c6d`
- Supabase project reference: `egrhyqdrqdaupvxiyurf` (the Washd project)

Moving the source code does not move or erase the hosted Supabase database, Firebase site, Stripe subscriptions, or domain. Existing hosted resources remain in their respective accounts. Payment mode and hosted configuration must be checked in their dashboards; this source transfer does not establish their current state.

## Current behavior

The latest application commit before this transfer was `dd9c529` (26 August 2026).

- New signups must accept the service terms and select Monday or Wednesday for their fixed weekly pickup.
- Members receive one online change of their pickup day. Further requests go through WhatsApp.
- The pickup lead rule uses **two calendar days**, rather than an exact elapsed 48 hours: Saturday registration can join Monday; Sunday registration waits until the following Monday. Monday registration can join Wednesday; Tuesday registration waits until the following Wednesday.
- Routes begin from September 2026 and show the next eligible future collection.
- Existing members without a chosen pickup day have a blank admin weekly-pickup field and no invented collection date.
- Admin → Member tracking shows the selected weekly day. Expected return is blank until a day is selected. Suggested returns are Wednesday at 5:30pm for Monday collection and Friday at 5:30pm for Wednesday collection, with manual adjustment available.
- Member IDs remain fixed across profile updates. A new member's first bag defaults to the matching number, such as `washd12` → `WASHD12`. Existing IDs and tracking history are preserved.
- Profile/residence edits preserve the pickup-day selection.
- Plans include editable care clauses, and one-off additional services use WhatsApp support. Recurring add-on selection was removed.
- Existing subscribers manage membership and billing through Stripe Customer Portal.
- Managed service information formats plan names with a colon and links to `https://washdmy.com`.

The supplied conversation reports that the member-ID and required-pickup-day SQL changes were applied through the Supabase SQL Editor, and that the frontend was deployed. These hosted changes were not independently rechecked during the GitHub transfer.

## Important files

- `app/signup/page.tsx`: required pickup day and account creation.
- `app/account/page.tsx`: member dashboard, next collection, and one-time day change.
- `app/profile/page.tsx`: residence/profile editing.
- `app/admin/tracking/page.tsx`: bag tracking, weekly day, and expected return.
- `app/admin/page.tsx`: content, plans, clauses, and support settings.
- `app/plans/page.tsx`: plan selection and checkout/portal flow.
- `lib/`: shared site content and integration helpers.
- `supabase/functions/`: Stripe and admin backend functions.
- `supabase/migrations/`: database changes, including the August 2026 ID and pickup-day fixes.
- `firebase.json` / `.firebaserc`: hosting configuration.
- `OPERATIONS_RUNBOOK.md`, `LAUNCH_CHECKLIST.md`, and `QA_REPORT.md`: operations and validation references.

## Starting on a new laptop

Install Git and Node.js 22.13 or newer, then:

```sh
git clone https://github.com/silayn-tsk/washd.git ~/washd-site
cd ~/washd-site
```

Privately copy `.env.local` from the old laptop's transfer backup into this folder before running the website. Alternatively, copy `.env.example` to `.env.local` and fill in the project settings. Never paste private keys into chat or commit environment files. Supabase service-role and Stripe secret keys must never be used in `NEXT_PUBLIC_` variables.

```sh
npm ci
npm run dev
```

Open the local address printed by the development server. The dependency ZIP and generated `out`/`dist` folders are unnecessary; dependencies and builds are recreated from the source and lockfile.

For later updates, commit local work and use `git pull --ff-only` to receive changes. This computer's existing branch is `master`; after the transfer it tracks GitHub's `origin/main`. A fresh clone uses `main`.

## Validation and Firebase publishing

```sh
npm run lint
npm run build:firebase
npx firebase-tools login
npx firebase-tools deploy --only hosting --project kleen-86c6d
```

GitHub updates alone do not publish changes to `washdmy.com`. Build and deploy through Firebase when a website change is ready. Recheck production URLs and payment flows after a deployment.

## Supabase and Stripe management

The old laptop had difficulty using the Supabase CLI. SQL changes can instead be run in Supabase Dashboard → Washd → SQL Editor. Paste SQL from the required migration file, not shell commands such as `pbcopy`. Check which changes are already applied before rerunning migrations.

If billing or membership buttons fail on the custom domain, verify the hosted Edge Function settings:

- `APP_BASE_URL`: `https://washdmy.com`
- `ALLOWED_ORIGINS`: includes `https://washdmy.com`, `https://www.washdmy.com`, and `https://washd-my-86c6d.web.app`
- Supabase Auth Site URL and Redirect URLs allow the customer-facing domain.
- Stripe Customer Portal allows switching between the intended Washd prices with the chosen proration policy.

Deploy affected Edge Functions after changing their code. Existing credentials and account permissions must be available separately; cloning GitHub does not authenticate the new computer to these services.

## Preserving the chat and private configuration

A private transfer-backup folder was created beside the project on the old laptop. It contains the original conversation export, private local environment files, a Git bundle of the repository before synchronization, and restore instructions. Copy that entire folder privately to the new laptop. Its contents are not committed to GitHub.

The conversation export preserves the text context and can be attached to a fresh chat; it does not recreate the original chat in the application's sidebar or recover images referenced only by old temporary paths. Copy any original images or other attachments you need separately.

Suggested continuation prompt:

> Open `~/washd-site`, read `PROJECT_HANDOFF.md`, inspect Git status, and continue the Washd website project. Preserve the current membership, tracking, and two-calendar-day pickup behavior. Keep private configuration out of Git. Ask which change I want next before changing product behavior.
