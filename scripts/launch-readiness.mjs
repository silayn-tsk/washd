import { setTimeout as delay } from "node:timers/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const runFile = promisify(execFile);

const baseUrl = (process.env.WASHD_BASE_URL || "https://washd-my-86c6d.web.app").replace(/\/$/, "");
const timeoutMs = Number(process.env.WASHD_CHECK_TIMEOUT_MS || 15000);
const attempts = Number(process.env.WASHD_CHECK_ATTEMPTS || 2);

const routes = [
  "/", "/login", "/signup", "/plans", "/account", "/privacy", "/privacy/bm", "/privacy/zh", "/privacy/ko",
  "/terms", "/terms/bm", "/terms/zh", "/terms/ko", "/service-information", "/service-information/bm", "/service-information/zh", "/service-information/ko",
  "/care-guarantee", "/care-guarantee/bm", "/care-guarantee/zh", "/care-guarantee/ko", "/admin", "/admin/enquiries", "/admin/payments",
  "/admin/security", "/admin/tracking", "/mfa", "/robots.txt", "/sitemap.xml",
];

async function request(path) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const marker = "__WASHD_HTTP_STATUS__";
      const { stdout } = await runFile("curl", [
        "--silent", "--show-error", "--location", "--max-time", String(Math.ceil(timeoutMs / 1000)),
        "--user-agent", "Washd launch readiness check", "--dump-header", "-", "--write-out", `\n${marker}%{http_code}`,
        `${baseUrl}${path}`,
      ], { maxBuffer: 5 * 1024 * 1024 });
      const markerIndex = stdout.lastIndexOf(`\n${marker}`);
      if (markerIndex === -1) throw new Error("curl did not return an HTTP status");
      const payload = stdout.slice(0, markerIndex);
      const status = Number(stdout.slice(markerIndex + marker.length + 1));
      const separator = payload.indexOf("\r\n\r\n");
      const rawHeaders = separator >= 0 ? payload.slice(0, separator) : "";
      const body = separator >= 0 ? payload.slice(separator + 4) : payload;
      const headers = new Map();
      for (const line of rawHeaders.split("\r\n").slice(1)) {
        const colon = line.indexOf(":");
        if (colon > 0) headers.set(line.slice(0, colon).toLowerCase(), line.slice(colon + 1).trim());
      }
      return { status, headers: { get: (name) => headers.get(name.toLowerCase()) || null }, text: async () => body };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await delay(500 * attempt);
    }
  }
  throw lastError;
}

const results = [];
let failed = false;
for (const route of routes) {
  try {
    const response = await request(route);
    const ok = response.status === 200;
    results.push({ check: `GET ${route}`, ok, detail: `HTTP ${response.status}` });
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    results.push({ check: `GET ${route}`, ok: false, detail: error instanceof Error ? error.message : String(error) });
  }
}

try {
  const homepage = await request("/");
  const html = await homepage.text();
  const expectedCopy = ["Laundry,", "Simple monthly plans", "Since", "1964"];
  for (const copy of expectedCopy) {
    const ok = html.includes(copy);
    results.push({ check: `Homepage contains “${copy}”`, ok, detail: ok ? "present" : "missing" });
    if (!ok) failed = true;
  }

  const requiredHeaders = {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "content-security-policy": "default-src 'self'",
    "strict-transport-security": "max-age=",
  };
  for (const [name, expected] of Object.entries(requiredHeaders)) {
    const actual = homepage.headers.get(name) || "";
    const ok = actual.toLowerCase().includes(expected.toLowerCase());
    results.push({ check: `Header ${name}`, ok, detail: actual || "missing" });
    if (!ok) failed = true;
  }
} catch (error) {
  failed = true;
  results.push({ check: "Homepage content and headers", ok: false, detail: error instanceof Error ? error.message : String(error) });
}

try {
  const robots = await (await request("/robots.txt")).text();
  const sitemap = await (await request("/sitemap.xml")).text();
  const robotsOk = robots.includes("Disallow: /admin") && robots.includes("Disallow: /mfa") && robots.includes("Sitemap:");
  const sitemapOk = sitemap.includes("<urlset") && sitemap.includes("/plans") && sitemap.includes("/service-information/bm") && sitemap.includes("/terms/zh") && sitemap.includes("/privacy/ko");
  results.push({ check: "robots.txt launch rules", ok: robotsOk, detail: robotsOk ? "present" : "incomplete" });
  results.push({ check: "sitemap.xml", ok: sitemapOk, detail: sitemapOk ? "valid baseline" : "incomplete" });
  failed ||= !robotsOk || !sitemapOk;
} catch (error) {
  failed = true;
  results.push({ check: "Search metadata", ok: false, detail: error instanceof Error ? error.message : String(error) });
}

const width = Math.max(...results.map((result) => result.check.length));
for (const result of results) {
  console.log(`${result.ok ? "PASS" : "FAIL"}  ${result.check.padEnd(width)}  ${result.detail}`);
}
console.log(`\n${results.filter((result) => result.ok).length}/${results.length} automated public-release checks passed for ${baseUrl}.`);
if (failed) process.exitCode = 1;
