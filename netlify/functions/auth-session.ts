import type { Config, Context } from "@netlify/functions";

const ACCESS_COOKIE = "pb_access_token";
const REFRESH_COOKIE = "pb_refresh_token";

function env(name: string): string {
  return Netlify.env.get(name) ?? "";
}

function getSupabaseUrl(): string {
  return env("PLAYBOOK_SUPABASE_URL") || env("SUPABASE_URL");
}

function getPublishableKey(): string {
  return env("PLAYBOOK_SUPABASE_PUBLISHABLE_KEY") ||
    env("SUPABASE_PUBLISHABLE_KEY") ||
    env("PLAYBOOK_SUPABASE_ANON_KEY") ||
    env("SUPABASE_ANON_KEY");
}

function isLocalRequest(req: Request): boolean {
  const url = new URL(req.url);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}

function cookieOptions(req: Request, maxAge: number): string {
  const secure = isLocalRequest(req) ? "" : "; Secure";
  return `Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function setCookie(req: Request, name: string, value: string, maxAge: number): string {
  return `${name}=${encodeURIComponent(value)}; ${cookieOptions(req, maxAge)}`;
}

function json(payload: unknown, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(headers ?? {}),
    },
  });
}

async function verifyAccessToken(accessToken: string): Promise<boolean> {
  const supabaseUrl = getSupabaseUrl();
  const publishableKey = getPublishableKey();
  if (!supabaseUrl || !publishableKey) return false;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.ok;
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return json({ success: false, error: "Metodo nao permitido." }, 405);
  }

  const body = await req.json().catch(() => ({})) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };

  const accessToken = String(body.access_token ?? "");
  const refreshToken = String(body.refresh_token ?? "");

  if (!accessToken || !refreshToken) {
    return json({ success: false, error: "Sessao incompleta." }, 400);
  }

  const isValid = await verifyAccessToken(accessToken);
  if (!isValid) {
    return json({ success: false, error: "Access token invalido." }, 401);
  }

  const headers = new Headers();
  headers.append("Set-Cookie", setCookie(req, ACCESS_COOKIE, accessToken, Number(body.expires_in) || 3600));
  headers.append("Set-Cookie", setCookie(req, REFRESH_COOKIE, refreshToken, 60 * 60 * 24 * 30));

  return json({ success: true }, 200, headers);
};

export const config: Config = {
  path: "/api/auth/session",
  method: ["POST"],
};
