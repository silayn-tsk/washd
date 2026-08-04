alter table public.profiles add column if not exists member_id text;
alter table public.profiles add column if not exists active_addons text[] not null default '{}';

with ranked as (
  select id, row_number() over (order by created_at, id) as member_number
  from public.profiles
  where member_id is null
)
update public.profiles as profile
set member_id = 'washd' || lpad(ranked.member_number::text, 2, '0')
from ranked
where profile.id = ranked.id;

create unique index if not exists profiles_member_id_key on public.profiles(member_id);
alter table public.profiles alter column member_id set not null;

create sequence if not exists public.washd_member_number_seq minvalue 1;
do $$
declare
  highest integer;
begin
  select coalesce(max(substring(member_id from '[0-9]+$')::integer), 0) into highest from public.profiles;
  perform setval('public.washd_member_number_seq', greatest(highest, 1), highest > 0);
end;
$$;

create or replace function public.assign_washd_member_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.member_id is null then
    new.member_id := 'washd' || lpad(nextval('public.washd_member_number_seq')::text, 2, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists before_profile_member_id on public.profiles;
create trigger before_profile_member_id
before insert on public.profiles
for each row execute procedure public.assign_washd_member_id();

create table public.plan_addons (
  id text primary key,
  name text not null,
  description text not null,
  price_rm integer not null check (price_rm > 0),
  stripe_price_id text unique,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.plan_addons (id, name, description, price_rm, active, sort_order)
values
  ('extra-shirts', '4 extra pressed shirts', 'Four additional shirts washed, pressed and returned on hangers each month.', 30, true, 1),
  ('extra-bag', 'One extra 5kg bag', 'Add one extra wash, dry and fold bag to your monthly allowance.', 18, true, 2),
  ('fragrance-free', 'Fragrance-free care', 'A fragrance-free detergent preference for every bag in your membership.', 12, true, 3),
  ('priority-return', 'Priority 24-hour return', 'Move one collection each month to our priority 24-hour return service.', 35, true, 4)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price_rm = excluded.price_rm,
  active = excluded.active,
  sort_order = excluded.sort_order,
  updated_at = now();

alter table public.plan_addons enable row level security;
create policy "Plan add-ons are publicly readable"
  on public.plan_addons for select
  to anon, authenticated
  using (active = true);
create policy "Admins can read inactive add-ons"
  on public.plan_addons for select
  to authenticated
  using ((select public.is_site_admin()));
revoke all on public.plan_addons from anon, authenticated;
grant select on public.plan_addons to anon, authenticated;

create policy "Admins can read member profiles"
  on public.profiles for select
  to authenticated
  using ((select public.is_site_admin()));
create policy "Admins can read all bags"
  on public.bags for select
  to authenticated
  using ((select public.is_site_admin()));
create policy "Admins can read all collections"
  on public.collections for select
  to authenticated
  using ((select public.is_site_admin()));

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bags') then
    alter publication supabase_realtime add table public.bags;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'collections') then
    alter publication supabase_realtime add table public.collections;
  end if;
end;
$$;

update public.site_content
set content = content || $json$
{
  "heritage": {
    "eyebrow": "Laundry expertise since 1964",
    "title": "Sixty years of care,",
    "accent": "reimagined for today.",
    "body": "Washd is built on a family laundry heritage that began in 1964. We have carried that practical knowledge forward into a simpler, more transparent membership for modern residential life.",
    "points": ["Generations of garment-care experience", "Modern tracking and accountable handling", "A local service designed for Malaysian homes"]
  },
  "customPlan": {
    "title": "Build your own plan",
    "body": "Need a different bag size, more pressed shirts or a schedule for your household? Tell us what would work.",
    "features": ["Flexible bag allowance", "Custom pressing mix", "Household or corporate options"],
    "cta": "Enquire about a custom plan"
  },
  "faq": {
    "eyebrow": "Questions, answered",
    "title": "Everything before your first drop.",
    "intro": "Clear answers about collections, garment care, tracking, payments and changing your membership.",
    "items": [
      {"question":"How does the fixed collection schedule work?","answer":"Drop your numbered Washd bag at your building's collection point by 9:30am on a route day. A Monday drop returns Wednesday, and a Wednesday drop returns Friday at 5:30pm."},
      {"question":"Can I track my laundry after collection?","answer":"Yes. Your member dashboard updates as your bag is received, cleaned, finished and made ready for collection. You will also see the latest update time and expected return."},
      {"question":"Are my clothes washed with another customer's laundry?","answer":"No. Every numbered bag is photographed, counted and processed as its own load. Your garments are never mixed with another household's laundry."},
      {"question":"What can go into an Everyday Bag?","answer":"Everyday clothes, towels and suitable bed linen can go into the zipped bag. Delicates, specialty fabrics and items with unusual care labels should be discussed with us first."},
      {"question":"Can I add ironing or another bag without changing plans?","answer":"Yes. Choose an à-la-carte add-on while reviewing your plan, or send us a custom-plan enquiry if you need a different recurring combination."},
      {"question":"What happens if I miss my building's drop time?","answer":"Your bag moves to the next scheduled route day. Message Washd as soon as possible and we will confirm the next available collection for your building."},
      {"question":"How do payments and cancellations work?","answer":"Memberships are billed monthly through secure Stripe checkout. You can manage your payment method and cancel from your account, with two weeks' notice before the next service period."},
      {"question":"What if an item is damaged or missing?","answer":"Report the issue within 24 hours of collection. Our photographed count and bag history help us investigate quickly, and qualifying issues are handled under the Washd care guarantee."}
    ]
  },
  "enquiry": {
    "eyebrow": "Need something different?",
    "title": "Let’s build your Washd plan.",
    "body": "Share your weekly laundry rhythm, preferred collection point and the mix of wash-fold and pressing you need. Our team will reply with a tailored option.",
    "button": "Send my enquiry",
    "success": "Thank you — your custom-plan enquiry is with the Washd team. We’ll contact you shortly."
  }
}
$json$::jsonb,
updated_at = now()
where key = 'main';

insert into public.bags (id, user_id, status, cycle_started_at, events, updated_at)
select
  'WSHD-01', profile.id, 'washing', now() - interval '3 hours',
  jsonb_build_array(
    jsonb_build_object('status','received','label','Bag received at your building collection point','at',now() - interval '3 hours'),
    jsonb_build_object('status','washing','label','Your laundry is being washed separately','at',now() - interval '90 minutes')
  ),
  now() - interval '90 minutes'
from public.profiles as profile
where lower(profile.email) = 'messilan10@gmail.com'
  and not exists (select 1 from public.bags where user_id = profile.id);

insert into public.collections (id, user_id, type, due, location, status)
select 'return-01', profile.id, 'collection', now() + interval '2 days', coalesce(profile.unit, 'Residence lobby'), 'scheduled'
from public.profiles as profile
where lower(profile.email) = 'messilan10@gmail.com'
  and not exists (select 1 from public.collections where user_id = profile.id and due > now());
