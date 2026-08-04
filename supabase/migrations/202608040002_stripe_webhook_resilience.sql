alter table public.profiles
  add column if not exists checkout_event_created bigint not null default 0,
  add column if not exists subscription_event_created bigint not null default 0,
  add column if not exists invoice_event_created bigint not null default 0;

alter table public.stripe_events
  add column if not exists status text not null default 'processed',
  add column if not exists event_created bigint,
  add column if not exists last_error text;

alter table public.stripe_events
  drop constraint if exists stripe_events_status_check;

alter table public.stripe_events
  add constraint stripe_events_status_check check (status in ('processing', 'processed', 'failed'));

create index if not exists stripe_events_status_idx on public.stripe_events(status, processed_at desc);
