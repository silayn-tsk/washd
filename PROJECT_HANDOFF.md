# Washd project handover

Use this file when opening the project on a new laptop or starting a fresh Codex task.

## What this project is

Washd is a Malaysian residential laundry membership website. It includes the public website, account/member dashboard, admin content tools, Supabase-backed authentication and Stripe subscription flows.

## Important live services

- Public Firebase Hosting URL: `https://washd-my-86c6d.web.app`
- Intended custom domain: `https://washdmy.com`
- Firebase project: `kleen-86c6d`
- Firebase Hosting target: `washd-my-86c6d`
- Supabase project reference: `egrhyqdrqdaupvxiyurf`
- Payments: Stripe (currently test/sandbox setup until live keys are deliberately enabled)

Never store Stripe secret keys, Supabase service keys, Firebase service-account files, or passwords in Git or in this document.

## Project structure

- `app/` - Next.js pages and UI
- `app/plans/page.tsx` - plan selection, add-ons, checkout and plan-change flow
- `app/account/page.tsx` - member dashboard including billing and current membership controls
- `app/admin/` - admin pages
- `lib/` - shared content and integration helpers
- `supabase/functions/` - Supabase Edge Functions for Stripe checkout, billing portal and other backend operations
- `firebase.json` / `.firebaserc` - Firebase Hosting configuration
- `.env.local` - local environment settings; keep private and do not commit

## Current customer experience

- New members can create an account, accept the terms, choose a plan/add-ons and enter Stripe Checkout.
- Existing subscribers opening a plan should go to Stripe Customer Portal to manage/change their plan rather than create a duplicate subscription.
- The Account page has controls to manage billing and change plan through Stripe Customer Portal.
- Mobile plan add-ons use a bottom-sheet selection experience and a sticky monthly-total bar.
- Checkout errors are displayed as immediate pop-ups rather than only at the top of the page.

## Important current task: custom-domain support

`washdmy.com` has been pointed to the frontend, but member buttons such as **Current membership** and **Billing** can fail on that domain. The browser is calling Supabase Edge Functions, which currently only allow the old Firebase URL.

After signing in to the Supabase CLI on the new computer, set these hosted secrets:

```sh
npx supabase secrets set --project-ref egrhyqdrqdaupvxiyurf \
  ALLOWED_ORIGINS='https://washdmy.com,https://www.washdmy.com,https://washd-my-86c6d.web.app' \
  APP_BASE_URL='https://washdmy.com'
```

Then deploy the affected functions:

```sh
npx supabase functions deploy create-billing-portal-session create-checkout-session \
  --project-ref egrhyqdrqdaupvxiyurf
```

Also add `https://washdmy.com` and `https://www.washdmy.com` to Supabase Auth's Site URL / Redirect URLs in the Supabase dashboard.

## Stripe plan changes still need dashboard configuration

In Stripe Dashboard, configure Customer Portal to allow customers to switch subscription prices. Add the Washd plan products/prices and choose a proration policy before enabling it for real customers. The website can open the portal; Stripe controls the actual plan-change options.

## Starting locally on a new laptop

```sh
cd ~/washd-site
npm install
npm run dev
```

Open the local address shown by the command, normally `http://localhost:3000`.

For access to deployment/back-end management, authenticate on the new computer:

```sh
npx firebase login
npx supabase login
```

## Build and deploy

Run checks and build:

```sh
npm run lint
npm run build:firebase
```

Deploy the website:

```sh
firebase deploy --only hosting --project kleen-86c6d
```

## Source-control status

The project has Git history on branch `master`. The most recent commits include mobile add-on selection, immediate checkout error pop-ups, and the Stripe billing-portal plan-change route.

There is an untracked `node_modules.zip` archive in the project. It is large and not needed on another laptop. Do not commit it.

## Recommended prompt for a new Codex task

> Open `/path/to/washd-site`, read `PROJECT_HANDOFF.md`, inspect the current Git status, and continue the Washd website work. Do not expose or commit secrets. First, help me verify the custom-domain CORS and Stripe billing portal flows.
