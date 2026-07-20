import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://washd.test/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete Washd landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Washd — Laundry, seamlessly handled<\/title>/i);
  assert.match(html, /Laundry,/);
  assert.match(html, /seamlessly/);
  assert.match(html, /Schedule a pickup/);
  assert.match(html, /Simple, honest pricing/);
  assert.match(html, /Washd for business/);
  assert.match(html, /https?:\/\/[^"']+\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the product implementation free of starter preview code", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /IntersectionObserver/);
  assert.match(page, /prefers-reduced-motion|bookingOpen|estimate/);
  assert.match(layout, /metadataBase: new URL\("https:\/\/washd-my-86c6d\.web\.app"\)/);
  assert.match(packageJson, /"name": "washd-laundry"/);
  assert.doesNotMatch(page + layout + packageJson, /SkeletonPreview|codex-preview|react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
