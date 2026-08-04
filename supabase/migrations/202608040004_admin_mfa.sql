alter table public.site_admins
  add column if not exists mfa_required boolean not null default false,
  add column if not exists mfa_enabled_at timestamptz;

create or replace function public.is_site_admin_identity()
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

revoke all on function public.is_site_admin_identity() from public, anon;
grant execute on function public.is_site_admin_identity() to authenticated;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.site_admins
    where user_id = (select auth.uid())
      and (not mfa_required or coalesce((select auth.jwt()->>'aal'), 'aal1') = 'aal2')
  );
$$;

create or replace function public.enable_admin_mfa_enforcement()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_site_admin_identity() then
    raise exception 'Admin access required';
  end if;
  if coalesce((select auth.jwt()->>'aal'), 'aal1') <> 'aal2' then
    raise exception 'A verified second factor is required';
  end if;

  update public.site_admins
  set mfa_required = true, mfa_enabled_at = now()
  where user_id = (select auth.uid());
end;
$$;

revoke all on function public.enable_admin_mfa_enforcement() from public, anon;
grant execute on function public.enable_admin_mfa_enforcement() to authenticated;
