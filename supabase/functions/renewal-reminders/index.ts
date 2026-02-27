import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

serve(async (request: Request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const appBaseUrl = Deno.env.get("APP_BASE_URL");
  if (!appBaseUrl) {
    return new Response(
      JSON.stringify({
        message: "Missing APP_BASE_URL env var for renewal reminder relay.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const cronSecret = Deno.env.get("CRON_SECRET");
  const endpoint = `${normalizeBaseUrl(appBaseUrl)}/api/cron/renewal-reminders`;

  const relayResponse = await fetch(endpoint, {
    method: "POST",
    headers: cronSecret ? { "x-cron-secret": cronSecret } : undefined,
  });

  const responseText = await relayResponse.text();

  return new Response(
    JSON.stringify({
      status: relayResponse.ok ? "ok" : "error",
      endpoint,
      upstream_status: relayResponse.status,
      upstream_body: responseText,
    }),
    {
      status: relayResponse.ok ? 200 : 502,
      headers: { "Content-Type": "application/json" },
    },
  );
});
