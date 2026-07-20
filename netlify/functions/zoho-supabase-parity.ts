import type { Config, Context } from "@netlify/functions";

const DEFAULT_SUPABASE_URL = "https://bryegtpdjqpwtyefoznq.supabase.co";

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

function optionalEnv(names: string[], fallback = ""): string {
  for (const name of names) {
    const value = env(name).trim();
    if (value) return value;
  }
  return fallback;
}

function supabaseKey(): string {
  const key = optionalEnv([
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SECRET_KEY",
    "PLAYBOOK_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
    "PLAYBOOK_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
  ]);
  if (!key) throw new Error("Configure uma chave Supabase no Netlify.");
  return key;
}

function supabaseHeaders(key: string): HeadersInit {
  const headers: Record<string, string> = {
    apikey: key,
    Accept: "application/json",
  };
  if (key.includes(".")) headers.Authorization = `Bearer ${key}`;
  return headers;
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

function authOk(req: Request): boolean {
  const token = optionalEnv(["MONITOR_AUTH_TOKEN"]);
  if (!token) return true;
  return req.headers.get("Authorization") === `Bearer ${token}` ||
    req.headers.get("x-monitor-token") === token;
}

async function latestRuns() {
  const supabaseUrl = optionalEnv(["PLAYBOOK_SUPABASE_URL", "SUPABASE_URL"], DEFAULT_SUPABASE_URL);
  const key = supabaseKey();
  const url = new URL(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/sync_runs`);
  url.searchParams.set("select", "id,started_at,finished_at,status,health_status,message,total_records,error_records,warnings_count,duration_ms,observations");
  url.searchParams.set("sync_type", "eq.netlify_parity_monitor");
  url.searchParams.set("order", "started_at.desc");
  url.searchParams.set("limit", "5");

  const response = await fetch(url, { headers: supabaseHeaders(key) });
  if (!response.ok) throw new Error(`Falha ao ler sync_runs: HTTP ${response.status} ${await response.text()}`);
  return await response.json();
}

async function triggerBackground(req: Request) {
  const token = optionalEnv(["MONITOR_AUTH_TOKEN"]);
  const url = new URL("/.netlify/functions/zoho-supabase-parity-background", req.url);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ source: "manual" }),
  });

  const text = await response.text();
  let payload: unknown = text;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  return json({ success: response.ok, backgroundStatus: response.status, result: payload }, response.ok ? 202 : 500);
}

export default async (req: Request, _context: Context) => {
  if (!authOk(req)) return json({ success: false, error: "Nao autorizado." }, 401);

  try {
    if (req.method === "GET") return json({ success: true, runs: await latestRuns() });
    if (req.method === "POST") return await triggerBackground(req);
    return json({ success: false, error: "Metodo nao permitido." }, 405);
  } catch (error) {
    return json({ success: false, error: error instanceof Error ? error.message : String(error) }, 500);
  }
};

export const config: Config = {
  path: "/api/monitor/zoho-supabase-parity",
};
