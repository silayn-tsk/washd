-- Require each new Washd member to select a fixed Monday or Wednesday route.
-- The selected day and the one-time-change flag are stored within pickup_location.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  pickup_label text;
  pickup_day text;
  accepted_terms boolean;
  accepted_version text;
begin
  -- The owner identity is an operations account, not a laundry member.
  if lower(coalesce(new.email, '')) = 'washdmy@gmail.com' then
    return new;
  end if;

  accepted_terms := coalesce((new.raw_user_meta_data ->> 'terms_accepted')::boolean, false);
  accepted_version := nullif(new.raw_user_meta_data ->> 'terms_version', '');
  if not accepted_terms or accepted_version is null then
    raise exception 'TERMS_REQUIRED';
  end if;

  pickup_day := lower(nullif(new.raw_user_meta_data -> 'pickup_location' ->> 'weeklyPickupDay', ''));
  if pickup_day is null or pickup_day not in ('monday', 'wednesday') then
    raise exception 'PICKUP_DAY_REQUIRED';
  end if;

  pickup_label := coalesce(new.raw_user_meta_data ->> 'unit', 'Residence lobby');
  insert into public.profiles (id, email, name, unit, pickup_location, terms_version, terms_accepted_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    pickup_label,
    coalesce(new.raw_user_meta_data -> 'pickup_location', jsonb_build_object('label', pickup_label, 'notes', '', 'weeklyPickupDay', pickup_day, 'pickupDayChangeUsed', false)),
    accepted_version,
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name),
    unit = coalesce(excluded.unit, public.profiles.unit),
    pickup_location = coalesce(excluded.pickup_location, public.profiles.pickup_location),
    terms_version = coalesce(excluded.terms_version, public.profiles.terms_version),
    terms_accepted_at = coalesce(excluded.terms_accepted_at, public.profiles.terms_accepted_at),
    updated_at = now();
  return new;
end;
$$;
