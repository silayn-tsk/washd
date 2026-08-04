import { spawnSync } from "node:child_process";
import { chmod, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRef = process.env.SUPABASE_PROJECT_REF || "egrhyqdrqdaupvxiyurf";

function accessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN;
  if (process.platform !== "darwin") return "";
  const result = spawnSync("security", ["find-generic-password", "-a", "supabase", "-s", "Supabase CLI", "-w"], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
}

const token = accessToken();
if (!token) throw new Error("SUPABASE_ACCESS_TOKEN is required, or log in with the Supabase CLI on this Mac.");

const query = `select jsonb_build_object(
  'captured_at', now(),
  'auth_users', coalesce((select jsonb_agg(jsonb_build_object('id',id,'email',email,'created_at',created_at,'updated_at',updated_at,'raw_user_meta_data',raw_user_meta_data) order by created_at) from auth.users), '[]'::jsonb),
  'site_admins', coalesce((select jsonb_agg(to_jsonb(row_data)) from public.site_admins row_data), '[]'::jsonb),
  'profiles', coalesce((select jsonb_agg(to_jsonb(row_data)) from public.profiles row_data), '[]'::jsonb),
  'bags', coalesce((select jsonb_agg(to_jsonb(row_data)) from public.bags row_data), '[]'::jsonb),
  'collections', coalesce((select jsonb_agg(to_jsonb(row_data)) from public.collections row_data), '[]'::jsonb),
  'contact_requests', coalesce((select jsonb_agg(to_jsonb(row_data)) from public.contact_requests row_data), '[]'::jsonb),
  'plans', coalesce((select jsonb_agg(to_jsonb(row_data)) from public.plans row_data), '[]'::jsonb),
  'plan_addons', coalesce((select jsonb_agg(to_jsonb(row_data)) from public.plan_addons row_data), '[]'::jsonb),
  'site_content', coalesce((select jsonb_agg(to_jsonb(row_data)) from public.site_content row_data), '[]'::jsonb),
  'stripe_events', coalesce((select jsonb_agg(to_jsonb(row_data)) from public.stripe_events row_data), '[]'::jsonb)
) as snapshot;`;

const result = spawnSync("curl", [
  "--silent", "--show-error", "--fail-with-body", "--request", "POST",
  `https://api.supabase.com/v1/projects/${projectRef}/database/query/read-only`,
  "--header", `Authorization: Bearer ${token}`,
  "--header", "Content-Type: application/json",
  "--data-binary", JSON.stringify({ query }),
], { encoding: "utf8", maxBuffer: 25 * 1024 * 1024 });

if (result.status !== 0) throw new Error(`Snapshot failed: ${[result.stderr, result.stdout].filter(Boolean).join(" ").trim()}`);
const rows = JSON.parse(result.stdout);
const snapshot = rows?.[0]?.snapshot;
if (!snapshot || !Array.isArray(snapshot.profiles)) throw new Error("Snapshot response was incomplete");

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const directory = resolve("backups", `prelaunch-${stamp}`);
await mkdir(directory, { recursive: true, mode: 0o700 });
await chmod(directory, 0o700);
await writeFile(resolve(directory, "snapshot.json"), `${JSON.stringify(snapshot, null, 2)}\n`, { mode: 0o600 });
await writeFile(resolve(directory, "manifest.json"), `${JSON.stringify({
  createdAt: new Date().toISOString(),
  projectRef,
  purpose: "Recovery snapshot before removing Washd prelaunch test records",
  counts: Object.fromEntries(Object.entries(snapshot).filter(([, value]) => Array.isArray(value)).map(([key, value]) => [key, value.length])),
  warning: "Contains personal and operational data. Keep encrypted and access-controlled.",
}, null, 2)}\n`, { mode: 0o600 });

console.log(`Confidential prelaunch snapshot created with ${snapshot.profiles.length} profiles, ${snapshot.contact_requests.length} enquiries and ${snapshot.stripe_events.length} Stripe event records.`);
console.log("The snapshot is git-ignored and permission-restricted under backups/. Move it to encrypted storage before launch.");
