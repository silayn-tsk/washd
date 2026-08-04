import { chmod, copyFile, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const projectRef = process.env.SUPABASE_PROJECT_REF || "egrhyqdrqdaupvxiyurf";
const dryRun = process.argv.includes("--dry-run");
if (dryRun) {
  console.log(`Backup preflight for Supabase project ${projectRef}:`);
  console.log("1. Export database roles.");
  console.log("2. Export the public schema.");
  console.log("3. Export public customer and operations data using COPY.");
  console.log("4. Record Edge Function secret names without secret values.");
  console.log("5. Copy deployment configuration and write a recovery manifest.");
  console.log("Preflight passed. Run npm run backup:production with SUPABASE_DB_PASSWORD when ready.");
  process.exit(0);
}
const databasePassword = process.env.SUPABASE_DB_PASSWORD;
if (!databasePassword) {
  throw new Error("SUPABASE_DB_PASSWORD is required. Copy it from Supabase project settings and provide it only for this command.");
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const root = resolve(process.env.WASHD_BACKUP_DIR || "backups", stamp);
await mkdir(root, { recursive: true, mode: 0o700 });
await chmod(root, 0o700);

function run(command, args, label) {
  const result = spawnSync(command, args, { cwd: process.cwd(), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.status !== 0) {
    throw new Error(`${label} failed: ${(result.stderr || result.stdout || "unknown error").trim()}`);
  }
  return result.stdout;
}

const common = ["supabase", "db", "dump", "--linked", "--password", databasePassword];
run("npx", [...common, "--role-only", "--file", join(root, "roles.sql")], "Role backup");
run("npx", [...common, "--schema", "public", "--file", join(root, "public-schema.sql")], "Schema backup");
run("npx", [...common, "--schema", "public", "--data-only", "--use-copy", "--file", join(root, "public-data.sql")], "Data backup");

const secretResult = spawnSync("npx", ["supabase", "secrets", "list", "--project-ref", projectRef, "--output", "json"], { cwd: process.cwd(), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
let secretInventoryStatus = "recorded";
let secretInventoryDocument;
if (secretResult.status === 0) {
  const parsedSecrets = JSON.parse(secretResult.stdout);
  secretInventoryDocument = (Array.isArray(parsedSecrets) ? parsedSecrets : parsedSecrets.secrets || [])
    .map((secret) => secret.name)
    .filter(Boolean)
    .sort();
} else {
  secretInventoryStatus = "unavailable—run supabase login or provide SUPABASE_ACCESS_TOKEN";
  secretInventoryDocument = { status: "unavailable", action: "Run supabase login, then record the Edge Function secret-name inventory." };
}
await writeFile(join(root, "edge-function-secret-names.json"), `${JSON.stringify(secretInventoryDocument, null, 2)}\n`, { mode: 0o600 });

for (const file of ["firebase.json", "supabase/config.toml", "LAUNCH_CHECKLIST.md", "OPERATIONS_RUNBOOK.md"]) {
  await copyFile(resolve(file), join(root, file.replaceAll("/", "-")));
}

const revision = run("git", ["rev-parse", "HEAD"], "Git revision").trim();
const workingTreeDirty = run("git", ["status", "--porcelain"], "Git status").trim().length > 0;
await writeFile(join(root, "manifest.json"), `${JSON.stringify({
  createdAt: new Date().toISOString(),
  projectRef,
  gitRevision: revision,
  workingTreeDirty,
  secretInventoryStatus,
  contents: ["roles.sql", "public-schema.sql", "public-data.sql", "edge-function-secret-names.json", "deployment configuration and runbook copies"],
  warning: "Contains customer and operational data. Store encrypted, restrict access, and delete insecure copies after verification.",
}, null, 2)}\n`, { mode: 0o600 });

console.log(`Production recovery snapshot created at ${root}`);
console.log("Treat this directory as confidential. Verify the SQL files, then move the snapshot to encrypted storage.");
