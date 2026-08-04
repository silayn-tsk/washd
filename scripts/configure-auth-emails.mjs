import { spawnSync } from "node:child_process";
import { authEmailConfiguration } from "./auth-email-templates.mjs";

const projectRef = process.env.SUPABASE_PROJECT_REF || "egrhyqdrqdaupvxiyurf";
const siteUrl = (process.env.WASHD_SITE_URL || "https://washd-my-86c6d.web.app").replace(/\/$/, "");
const apply = process.argv.includes("--apply");

function accessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN;
  if (process.platform !== "darwin") return "";
  const result = spawnSync("security", ["find-generic-password", "-a", "supabase", "-s", "Supabase CLI", "-w"], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
}

const payload = {
  site_url: siteUrl,
  uri_allow_list: `${siteUrl}/**`,
  mailer_allow_unverified_email_sign_ins: false,
  ...authEmailConfiguration,
};

for (const [key, value] of Object.entries(payload)) {
  if (typeof value === "string" && value.includes("{{") && !value.match(/{{\s*\.(ConfirmationURL|Token|Email|NewEmail|OldEmail|FactorType)\s*}}/)) {
    throw new Error(`Unsupported Go template variable in ${key}`);
  }
}

if (!apply) {
  console.log(`Auth email preflight passed for ${projectRef}.`);
  console.log(`${Object.keys(authEmailConfiguration).length} template and notification settings are ready.`);
  console.log(`Allowed redirect origin will be restricted to ${siteUrl}.`);
  console.log("Run this command with --apply to update hosted Auth. Email confirmation remains unchanged until SMTP is verified.");
  process.exit(0);
}

const token = accessToken();
if (!token) throw new Error("SUPABASE_ACCESS_TOKEN is required, or log in with the Supabase CLI on this Mac.");
const result = spawnSync("curl", [
  "--silent", "--show-error", "--fail-with-body", "--request", "PATCH",
  `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
  "--header", `Authorization: Bearer ${token}`,
  "--header", "Content-Type: application/json",
  "--data-binary", JSON.stringify(payload),
], { encoding: "utf8", maxBuffer: 5 * 1024 * 1024 });

if (result.status !== 0) {
  const failure = [result.stderr, result.stdout].filter(Boolean).join(" ").trim();
  if (failure.includes("Email template modification is not available") && failure.includes("custom SMTP")) {
    const safeConfiguration = {
      site_url: siteUrl,
      uri_allow_list: `${siteUrl}/**`,
      mailer_allow_unverified_email_sign_ins: false,
    };
    const safeResult = spawnSync("curl", [
      "--silent", "--show-error", "--fail-with-body", "--request", "PATCH",
      `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
      "--header", `Authorization: Bearer ${token}`,
      "--header", "Content-Type: application/json",
      "--data-binary", JSON.stringify(safeConfiguration),
    ], { encoding: "utf8", maxBuffer: 5 * 1024 * 1024 });
    if (safeResult.status !== 0) throw new Error(`Auth redirect update failed: ${[safeResult.stderr, safeResult.stdout].filter(Boolean).join(" ").trim()}`);
    console.log("Production Auth URL and redirect restrictions updated.");
    console.log("Branded templates remain staged because Supabase requires custom SMTP before free-tier template changes.");
    console.log("Connect SMTP, then rerun npm run auth:emails:apply.");
    process.exit(0);
  }
  throw new Error(`Auth update failed: ${failure || "unknown error"}`);
}
const configured = JSON.parse(result.stdout);
console.log("Hosted Washd Auth templates and security notifications updated.");
console.log(`Site URL: ${configured.site_url}`);
console.log(`Redirect allow list: ${configured.uri_allow_list}`);
console.log(`Email confirmation auto-approval remains ${configured.mailer_autoconfirm ? "ON (awaiting SMTP test)" : "OFF"}.`);
