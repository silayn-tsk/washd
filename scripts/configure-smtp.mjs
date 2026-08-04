import { spawnSync } from "node:child_process";

const projectRef = process.env.SUPABASE_PROJECT_REF || "egrhyqdrqdaupvxiyurf";
const apply = process.argv.includes("--apply");
const enableConfirmation = process.argv.includes("--enable-confirmation");

function accessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN;
  if (process.platform !== "darwin") return "";
  const result = spawnSync("security", ["find-generic-password", "-a", "supabase", "-s", "Supabase CLI", "-w"], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
}

function patchAuth(token, payload) {
  const result = spawnSync("curl", [
    "--silent", "--show-error", "--fail-with-body", "--request", "PATCH",
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    "--header", `Authorization: Bearer ${token}`,
    "--header", "Content-Type: application/json",
    "--data-binary", JSON.stringify(payload),
  ], { encoding: "utf8", maxBuffer: 5 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`SMTP configuration failed: ${[result.stderr, result.stdout].filter(Boolean).join(" ").trim()}`);
  return JSON.parse(result.stdout);
}

if (enableConfirmation) {
  if (!apply) {
    console.log("Confirmation activation preflight passed. Use --apply only after a real signup and reset email have arrived successfully.");
    process.exit(0);
  }
  if (process.env.WASHD_EMAIL_TEST_CONFIRMED !== "true") {
    throw new Error("Set WASHD_EMAIL_TEST_CONFIRMED=true only after both a real signup email and password-reset email have been received and opened.");
  }
  const token = accessToken();
  if (!token) throw new Error("SUPABASE_ACCESS_TOKEN is required, or log in with the Supabase CLI on this Mac.");
  const configured = patchAuth(token, { mailer_autoconfirm: false, mailer_allow_unverified_email_sign_ins: false });
  console.log(`Customer email confirmation is now ${configured.mailer_autoconfirm ? "not enforced" : "ENFORCED"}.`);
  process.exit(0);
}

const requiredNames = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_ADMIN_EMAIL"];
const missing = requiredNames.filter((name) => !process.env[name]);
if (missing.length) {
  if (apply) throw new Error(`Missing required SMTP settings: ${missing.join(", ")}`);
  console.log(`SMTP preflight is waiting for: ${missing.join(", ")}.`);
  console.log("Create and verify the production sending domain first. Never paste SMTP_PASS into chat or commit it to an env file.");
  process.exit(0);
}

const port = String(process.env.SMTP_PORT);
if (!/^\d{2,5}$/.test(port)) throw new Error("SMTP_PORT must be a valid numeric port.");
if (!/^\S+@\S+\.\S+$/.test(process.env.SMTP_ADMIN_EMAIL)) throw new Error("SMTP_ADMIN_EMAIL must be a valid verified sender address.");

if (!apply) {
  console.log(`SMTP preflight passed for ${process.env.SMTP_ADMIN_EMAIL} via ${process.env.SMTP_HOST}:${port}.`);
  console.log("Run with --apply to connect the sender while leaving signup auto-confirmation on for safe delivery testing.");
  process.exit(0);
}

const token = accessToken();
if (!token) throw new Error("SUPABASE_ACCESS_TOKEN is required, or log in with the Supabase CLI on this Mac.");
const configured = patchAuth(token, {
  smtp_host: process.env.SMTP_HOST,
  smtp_port: port,
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,
  smtp_admin_email: process.env.SMTP_ADMIN_EMAIL,
  smtp_sender_name: process.env.SMTP_SENDER_NAME || "Washd",
  smtp_max_frequency: 60,
  mailer_autoconfirm: true,
});
console.log(`Custom SMTP connected for ${configured.smtp_admin_email}.`);
console.log("Signup auto-confirmation is still ON. Apply branded templates and complete real delivery tests before enforcing confirmation.");
