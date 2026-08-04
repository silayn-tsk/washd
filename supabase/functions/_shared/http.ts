const defaultOrigin = "https://washd-my-86c6d.web.app";

export function allowedOrigins() {
  return (Deno.env.get("ALLOWED_ORIGINS") || defaultOrigin)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
export function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") || defaultOrigin;
  const allowed = allowedOrigins();
  const selected = allowed.includes(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ? origin
    : allowed[0];

  return {
    "Access-Control-Allow-Origin": selected,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

export function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json" },
  });
}

export function safeReturnUrl(value: unknown, fallbackPath: string) {
  const base = new URL(Deno.env.get("APP_BASE_URL") || defaultOrigin);
  if (typeof value === "string") {
    try {
      const candidate = new URL(value, base);
      const local = ["localhost", "127.0.0.1"].includes(candidate.hostname) && ["http:", "https:"].includes(candidate.protocol);
      if (candidate.origin === base.origin || local) return candidate.toString();
    } catch {
      // Use the known-safe fallback.
    }
  }
  return new URL(fallbackPath, base).toString();
}
