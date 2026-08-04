import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://washd.test${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete Washd fixed-route website", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Washd — Laundry, handled\.<\/title>/i);
  assert.match(html, /The milkman model for laundry/i);
  assert.match(html, /Drop Mon/);
  assert.match(html, /Three simple steps/);
  assert.match(html, /Two services, combined however you like/);
  assert.match(html, /Simple monthly plans/);
  assert.match(html, /Laundry expertise since 1964/);
  assert.match(html, /Everything before your first drop/);
  assert.match(html, /build your Washd plan/i);
  assert.match(html, /https?:\/\/[^"']+\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("renders Supabase member pages and the protected admin editor", async () => {
  const pages = await Promise.all([
    render("/login").then((response) => response.text()),
    render("/signup").then((response) => response.text()),
    render("/plans").then((response) => response.text()),
    render("/account").then((response) => response.text()),
    render("/admin").then((response) => response.text()),
    render("/admin/enquiries").then((response) => response.text()),
    render("/privacy").then((response) => response.text()),
    render("/privacy/bm").then((response) => response.text()),
    render("/terms").then((response) => response.text()),
    render("/terms/bm").then((response) => response.text()),
    render("/service-information").then((response) => response.text()),
    render("/maklumat-perkhidmatan").then((response) => response.text()),
    render("/care-guarantee").then((response) => response.text()),
    render("/care-guarantee/bm").then((response) => response.text()),
    render("/admin/payments").then((response) => response.text()),
    render("/mfa").then((response) => response.text()),
    render("/admin/security").then((response) => response.text()),
  ]);

  assert.match(pages[0], /Welcome back/);
  assert.match(pages[0], /Secure encrypted member access/);
  assert.doesNotMatch(pages[0], /Protected by Supabase|Supabase protected|managed by Supabase/i);
  assert.match(pages[1], /Create account/);
  assert.match(pages[1], /Secure Stripe-hosted payments/);
  assert.match(pages[2], /Choose your monthly/);
  assert.match(pages[2], /Professional/);
  assert.match(pages[3], /Loading your Washd dashboard/);
  assert.match(pages[4], /Opening the Washd editor/);
  assert.match(pages[5], /Opening enquiry inbox/);
  assert.match(pages[6], /Privacy Notice/);
  assert.match(pages[7], /Notis Privasi/);
  assert.match(pages[8], /Service Terms/);
  assert.match(pages[9], /Terma Perkhidmatan/);
  assert.match(pages[10], /Service Information/);
  assert.match(pages[11], /Maklumat Perkhidmatan/);
  assert.match(pages[12], /Washd Care Guarantee/);
  assert.match(pages[13], /Jaminan Penjagaan Washd/);
  assert.match(pages[14], /Checking payment health/);
  assert.match(pages[15], /Checking account security/);
  assert.match(pages[16], /Opening admin security/);
});

test("keeps the product implementation free of starter preview code", async () => {
  const [page, layout, siteUrl, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/site-url.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /IntersectionObserver/);
  assert.match(page, /Message us on WhatsApp|whatsappUrl/);
  assert.match(layout, /metadataBase: new URL\(siteUrl\)/);
  assert.match(siteUrl, /NEXT_PUBLIC_SITE_URL/);
  assert.match(siteUrl, /https:\/\/washd-my-86c6d\.web\.app/);
  assert.match(packageJson, /"name": "washd-laundry"/);
  assert.doesNotMatch(page + layout + siteUrl + packageJson, /SkeletonPreview|codex-preview|react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});

test("renders each policy in English, Malay, Chinese and Korean", async () => {
  const pages = await Promise.all([
    render("/privacy/zh").then((response) => response.text()),
    render("/privacy/ko").then((response) => response.text()),
    render("/terms/zh").then((response) => response.text()),
    render("/terms/ko").then((response) => response.text()),
    render("/service-information/bm").then((response) => response.text()),
    render("/service-information/zh").then((response) => response.text()),
    render("/service-information/ko").then((response) => response.text()),
    render("/care-guarantee/zh").then((response) => response.text()),
    render("/care-guarantee/ko").then((response) => response.text()),
  ]);

  assert.match(pages[0], /隐私声明/);
  assert.match(pages[1], /개인정보 처리방침/);
  assert.match(pages[2], /服务条款/);
  assert.match(pages[3], /서비스 약관/);
  assert.match(pages[4], /Maklumat Perkhidmatan/);
  assert.match(pages[5], /服务资料/);
  assert.match(pages[6], /서비스 정보/);
  assert.match(pages[7], /护理保障/);
  assert.match(pages[8], /케어 보장/);
  for (const html of pages) {
    assert.match(html, /English/);
    assert.match(html, /Bahasa Malaysia/);
    assert.match(html, /中文/);
    assert.match(html, /한국어/);
  }
});
