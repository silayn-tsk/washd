-- Add editable supplier-disclosure fields without replacing existing CMS content.
update public.site_content
set content = jsonb_set(
  jsonb_set(
    jsonb_set(content, '{contact,legalName}', coalesce(content #> '{contact,legalName}', '""'::jsonb), true),
    '{contact,registrationNumber}', coalesce(content #> '{contact,registrationNumber}', '""'::jsonb), true
  ),
  '{contact,registeredAddress}', coalesce(content #> '{contact,registeredAddress}', '""'::jsonb), true
), updated_at = now()
where key = 'main';

-- Align the public promise with the detailed Care Guarantee language.
update public.site_content
set content = jsonb_set(
  content,
  '{safety,cards,3,body}',
  to_jsonb('Protected under our guarantee, with an initial investigation update within 48 hours.'::text),
  true
), updated_at = now()
where key = 'main';
