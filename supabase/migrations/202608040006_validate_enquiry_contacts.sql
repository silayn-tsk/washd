-- Reject unreachable contact details on all new and updated enquiries.
-- NOT VALID preserves historical test rows while enforcing the rule immediately
-- for every future insert or update.

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'contact_requests_valid_email') then
    alter table public.contact_requests
      add constraint contact_requests_valid_email
      check (
        email ~* '^[A-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$'
      ) not valid;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'contact_requests_valid_malaysian_mobile') then
    alter table public.contact_requests
      add constraint contact_requests_valid_malaysian_mobile
      check (
        phone is not null
        and regexp_replace(phone, '[^0-9]', '', 'g') ~ '^(601[0-9]{8,9}|01[0-9]{8,9})$'
      ) not valid;
  end if;
end $$;
