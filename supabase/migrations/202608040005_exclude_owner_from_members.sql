create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  pickup_label text;
begin
  -- The owner identity is an operations account, not a laundry member. Keeping
  -- it out of profiles preserves washd01 for the first real customer.
  if lower(coalesce(new.email, '')) = 'washdmy@gmail.com' then
    return new;
  end if;

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
