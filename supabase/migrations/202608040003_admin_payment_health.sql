create policy "Admins can read Stripe event health"
  on public.stripe_events for select
  to authenticated
  using ((select public.is_site_admin()));

grant select on public.stripe_events to authenticated;
