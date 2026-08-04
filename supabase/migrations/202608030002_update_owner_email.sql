create or replace function public.bootstrap_washd_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(coalesce(new.email, '')) = 'washdmy@gmail.com' then
    insert into public.site_admins (user_id) values (new.id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

insert into public.site_admins (user_id)
select id from auth.users where lower(email) = 'washdmy@gmail.com'
on conflict (user_id) do nothing;
