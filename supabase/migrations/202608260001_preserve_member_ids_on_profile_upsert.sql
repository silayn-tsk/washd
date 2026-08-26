-- Auth metadata changes upsert an existing profile. PostgreSQL runs BEFORE
-- INSERT triggers before it resolves ON CONFLICT, so the old trigger consumed
-- a sequence number for those updates. Reuse the existing member ID first.
create or replace function public.assign_washd_member_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_member_id text;
begin
  if new.member_id is not null then
    return new;
  end if;

  select member_id
    into existing_member_id
    from public.profiles
   where id = new.id;

  if existing_member_id is not null then
    new.member_id := existing_member_id;
  else
    new.member_id := 'washd' || lpad(nextval('public.washd_member_number_seq')::text, 2, '0');
  end if;

  return new;
end;
$$;
