import type { Config, Context } from "@netlify/functions";

function env(name: string): string {
  const globals = globalThis as unknown as {
    Netlify?: { env?: { get?: (key: string) => string | undefined } };
    process?: { env?: Record<string, string | undefined> };
  };

  try {
    if (typeof globals.Netlify?.env?.get === "function") {
      return globals.Netlify.env.get(name) ?? "";
    }
  } catch (_error) {
    // Fall through to process.env.
  }

  return globals.process?.env?.[name] ?? "";
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export default async (req: Request, _context: Context) => {
  const token = env("MONITOR_AUTH_TOKEN").trim();
  const url = new URL("/.netlify/functions/zoho-supabase-parity-background", req.url);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ source: "schedule" }),
  });

  const text = await response.text();
  return json({
    success: response.ok,
    backgroundStatus: response.status,
    body: text.slice(0, 1000),
  }, response.ok ? 202 : 500);
};

export const config: Config = {
  schedule: "0 * * * *",
};
