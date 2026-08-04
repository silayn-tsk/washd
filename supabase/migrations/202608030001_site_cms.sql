alter table public.plans add column if not exists active boolean not null default true;
alter table public.plans add column if not exists sort_order integer not null default 0;

update public.plans
set active = false
where id in ('everyday', 'everyday-plus');

insert into public.plans (id, name, description, price_rm, popular, features, active, sort_order)
values
  ('starter', 'Starter', '5kg wash-fold bag once a week', 109, false, array['5kg wash-fold bag', 'Once a week', 'Fixed building collection'], true, 1),
  ('active', 'Active', '5kg wash-fold bag twice a week', 199, false, array['5kg wash-fold bag', 'Twice a week', 'Fixed building collection'], true, 2),
  ('professional', 'Professional', '7kg bag + 4 pressed shirts, once a week', 259, true, array['7kg wash-fold bag', '4 pressed shirts', 'Once a week'], true, 3),
  ('executive', 'Executive', '7kg bag + 7 pressed shirts, once a week', 299, false, array['7kg wash-fold bag', '7 pressed shirts', 'Once a week'], true, 4)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price_rm = excluded.price_rm,
  popular = excluded.popular,
  features = excluded.features,
  active = excluded.active,
  sort_order = excluded.sort_order,
  updated_at = now();

create table public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.site_admins where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_site_admin() from public, anon;
grant execute on function public.is_site_admin() to authenticated;

alter table public.site_admins enable row level security;
create policy "Admins can verify their own access"
  on public.site_admins for select
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.site_admins from anon, authenticated;
grant select on public.site_admins to authenticated;

create or replace function public.bootstrap_washd_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(coalesce(new.email, '')) = 'pravena2110@gmail.com' then
    insert into public.site_admins (user_id) values (new.id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_washd_owner_created on auth.users;
create trigger on_washd_owner_created
after insert or update of email on auth.users
for each row execute procedure public.bootstrap_washd_owner();

insert into public.site_admins (user_id)
select id from auth.users where lower(email) = 'pravena2110@gmail.com'
on conflict (user_id) do nothing;

create table public.site_content (
  key text primary key,
  content jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.site_content (key, content)
values ('main', $json$
{
  "brand":{"name":"Washd","tagline":"Laundry, handled.","modelLabel":"The milkman model for laundry"},
  "hero":{"title":"Laundry,","accent":"handled.","body":"Like the milkman of old, we come to your building on fixed days and return your laundry washed, ironed and folded.","primaryCta":"Message us on WhatsApp","secondaryCta":"See monthly plans"},
  "schedule":{"label":"The fixed weekly rhythm","firstRoute":"Drop Mon → Collect Wed","secondRoute":"Drop Wed → Collect Fri","dropTime":"Drop by 9:30am","returnTime":"Collect at 5:30pm"},
  "burden":{"eyebrow":"01 · The everyday burden","title":"Your weekend deserves better","intro":"A washing machine handles one step. The hours, the drying and the ironing still fall on you.","cards":[{"title":"Hours every week","body":"Washing, drying, folding and ironing eat 3 to 5 hours of your week."},{"title":"Nowhere to dry","body":"No balcony, strict condo rules or rain - and clothes hang for days."},{"title":"The dreaded ironing","body":"Even with a machine, the folding and pressing still fall on you."}],"footer":"We handle every step - including the one you hate most."},
  "routine":{"eyebrow":"02 · The routine","title":"Three simple steps","intro":"No app to learn and no appointments to book. A simple rhythm built around the week you already keep.","steps":[{"title":"Drop your bag","body":"Leave your sealed, numbered bag at the collection point by 9:30am."},{"title":"We do the work","body":"We wash, dry, fold and press - each bag on its own, never mixed."},{"title":"Collect, all done","body":"Collect it fresh at 5:30pm, two days later, ready to wear."}],"footer":"Same days. Same routine. Every week."},
  "services":{"eyebrow":"03 · What we offer","title":"Two services, combined however you like","intro":"Most members pair them: everyday clothes washed and folded, work shirts pressed and hung.","items":[{"title":"The Everyday Bag","label":"Wash · Dry · Fold","body":"Casual wear, towels and bedsheets. One price per bag - whatever fits, zipped up."},{"title":"Pressed & Pristine","label":"Wash · Iron · Hang","body":"Office shirts and work wear, counted by the piece and returned crisp on hangers."}],"footer":"Keep washing your daily personal items at home - leave everything else to us."},
  "membership":{"eyebrow":"04 · Membership","title":"Simple monthly plans","intro":"All plans run on the fixed Mon / Wed / Fri schedule. Cancel anytime with two weeks' notice.","extraNote":"Extra pressed shirt: +RM 8 each."},
  "safety":{"eyebrow":"05 · Your peace of mind","title":"Your clothes, tracked and safe","intro":"A simple, disciplined system so nothing is ever lost, mixed up or unaccounted for.","cards":[{"title":"Your own numbered bags","body":"Two personal bags with a unique ID - your identity in our system."},{"title":"Photographed & counted","body":"Photographed and counted at collection, and again at return."},{"title":"Washed separately","body":"Always handled as its own load - never combined with anyone else's."},{"title":"Fully covered","body":"Protected under our guarantee, with any issue resolved within 48 hours."}]},
  "benefits":{"eyebrow":"06 · The difference","title":"Why members stay with Washd","cards":[{"title":"Your weekends back","body":"Reclaim 3 to 5 hours every week for what matters."},{"title":"A professional finish","body":"Crisp, properly pressed shirts - better than at home."},{"title":"Effortless updates","body":"Simple WhatsApp alerts at collection and return. No app needed."},{"title":"Total predictability","body":"Same days, same routine, every week."}]},
  "building":{"eyebrow":"For building partners","title":"One building. One reliable laundry rhythm.","body":"Fixed routes make collection simple for residents and efficient for management teams.","points":["A single collection point","Predictable fixed days","No rider traffic throughout the week","A dedicated Washd contact"],"cta":"Bring Washd to your building"},
  "finalCta":{"eyebrow":"Get started this week","title":"Ready to never iron again?","body":"Setup takes two minutes on WhatsApp. Your first collection can be this week.","button":"Message us on WhatsApp","steps":["Message us to sign up","Receive your two personal bags","Drop your first bag on the next collection day"]},
  "contact":{"name":"Pravena K","phoneDisplay":"017-649 4749","whatsappNumber":"60176494749","email":"washdmy@gmail.com","serviceArea":"Selected residential buildings in Kuala Lumpur"}
}
$json$::jsonb)
on conflict (key) do nothing;

alter table public.site_content enable row level security;
create policy "Site content is publicly readable"
  on public.site_content for select
  to anon, authenticated
  using (true);
create policy "Site admins can update content"
  on public.site_content for update
  to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant update (content, updated_by, updated_at) on public.site_content to authenticated;

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 40),
  organisation text not null check (char_length(organisation) between 2 and 160),
  interest text not null check (interest in ('residence', 'hotel', 'business', 'other')),
  message text not null check (char_length(message) between 10 and 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.contact_requests enable row level security;
create policy "Visitors can submit contact requests"
  on public.contact_requests for insert
  to anon, authenticated
  with check (status = 'new');
create policy "Admins can read contact requests"
  on public.contact_requests for select
  to authenticated
  using ((select public.is_site_admin()));
create policy "Admins can update contact requests"
  on public.contact_requests for update
  to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

revoke all on public.contact_requests from anon, authenticated;
grant insert on public.contact_requests to anon, authenticated;
grant select, update (status) on public.contact_requests to authenticated;
