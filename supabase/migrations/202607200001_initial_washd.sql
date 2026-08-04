create extension if not exists pgcrypto;

create table public.plans (
  id text primary key,
  name text not null,
  description text not null,
  price_rm integer not null check (price_rm > 0),
  popular boolean not null default false,
  features text[] not null default '{}',
  stripe_price_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  unit text,
  pickup_location jsonb not null default '{"label":"Residence lobby","notes":""}'::jsonb,
  notify_via text not null default 'whatsapp',
  plan_id text references public.plans(id),
  pending_plan_id text references public.plans(id),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  checkout_session_id text,
  subscription_status text,
  latest_invoice_status text,
  latest_invoice_id text,
  payment_brand text,
  payment_last4 text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bags (
  id text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null,
  cycle_started_at timestamptz,
  events jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table public.collections (
  id text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('dropoff', 'collection')),
  due timestamptz not null,
  location text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

create index profiles_stripe_customer_idx on public.profiles(stripe_customer_id);
create index bags_user_started_idx on public.bags(user_id, cycle_started_at desc);
create index collections_user_due_idx on public.collections(user_id, due);

insert into public.plans (id, name, description, price_rm, popular, features)
values
  ('everyday', 'Everyday', '1 wash & fold bag / week', 89, false, array['Weekly wash & fold bag', 'Lobby collection', '48-hour return']),
  ('everyday-plus', 'Everyday Plus', '2 wash & fold bags / week', 139, false, array['Two weekly bags', 'Priority processing', 'WhatsApp reminders']),
  ('professional', 'Professional', '1 bag + 3 pressed / week', 169, true, array['Weekly bag', 'Three pressed pieces', 'Priority support']),
  ('executive', 'Executive', '1 bag + 6 pressed / week', 239, false, array['Weekly bag', 'Six pressed pieces', 'Concierge handling'])
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price_rm = excluded.price_rm,
  popular = excluded.popular,
  features = excluded.features,
  updated_at = now();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  pickup_label text;
begin
  pickup_label := coalesce(new.raw_user_meta_data ->> 'unit', 'Residence lobby');
  insert into public.profiles (id, email, name, unit, pickup_location)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    pickup_label,
    coalesce(new.raw_user_meta_data -> 'pickup_location', jsonb_build_object('label', pickup_label, 'notes', ''))
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name),
    unit = coalesce(excluded.unit, public.profiles.unit),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email, raw_user_meta_data on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.plans enable row level security;
alter table public.profiles enable row level security;
alter table public.bags enable row level security;
alter table public.collections enable row level security;
alter table public.stripe_events enable row level security;

create policy "Plans are publicly readable"
  on public.plans for select
  to anon, authenticated
  using (true);

create policy "Members can read their profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Members can update their profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Members can read their bags"
  on public.bags for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Members can read their collections"
  on public.collections for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.plans from anon, authenticated;
grant select on public.plans to anon, authenticated;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (name, unit, pickup_location, notify_via, updated_at) on public.profiles to authenticated;

revoke all on public.bags from anon, authenticated;
grant select on public.bags to authenticated;

revoke all on public.collections from anon, authenticated;
grant select on public.collections to authenticated;

revoke all on public.stripe_events from anon, authenticated;
