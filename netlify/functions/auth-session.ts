import type { Config, Context } from "@netlify/functions";

const SESSION_COOKIE = "pb_session";
const CLIENT_ACCESS_COOKIE = "pb_client_access";

type PlaybookProfile = {
  user_id: string;
  email: string;
  role: "user" | "admin";
  status: "Pendente" | "Aprovado" | "Recusado" | "Suspenso" | "pending" | "approved" | "rejected" | "suspended";
  force_password_change: boolean;
  must_change_password?: boolean;
};

type ValidationResult =
  | { ok: true; accessToken: string; refreshToken?: string; profile: PlaybookProfile; user: { id: string; email?: string }; setCookies: string[] }
  | { ok: false; reason: string; status: number; clearCookies?: boolean };

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

function cookieOptions(req: Request, maxAge: number, httpOnly = true): string {
  const secure = isLocalRequest(req) ? "" : "; Secure";
  const httpOnlyPart = httpOnly ? "; HttpOnly" : "";
  return `Path=/${httpOnlyPart}; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function setCookie(req: Request, name: string, value: string, maxAge: number, httpOnly = true): string {
  return `${name}=${encodeURIComponent(value)}; ${cookieOptions(req, maxAge, httpOnly)}`;
}

function clearCookie(req: Request, name: string, httpOnly = true): string {
  return setCookie(req, name, "", 0, httpOnly);
}

function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;

  header.split(";").forEach((part) => {
    const [name, ...rest] = part.trim().split("=");
    if (!name) return;
    cookies[name] = decodeURIComponent(rest.join("=") || "");
  });

  return cookies;
}

function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

function encodeSessionCookie(accessToken: string, refreshToken: string): string {
  return base64UrlEncode(JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken,
  }));
}

function getClientAccessToken(cookies: Record<string, string>): string {
  return cookies[CLIENT_ACCESS_COOKIE] || "";
}

function getSessionTokens(cookies: Record<string, string>): { accessToken: string; refreshToken: string } {
  const rawSession = cookies[SESSION_COOKIE] || "";
  if (!rawSession) return { accessToken: getClientAccessToken(cookies), refreshToken: "" };

  try {
    const payload = JSON.parse(base64UrlDecode(rawSession)) as {
      access_token?: string;
      refresh_token?: string;
    };

    return {
      accessToken: String(payload.access_token || ""),
      refreshToken: String(payload.refresh_token || ""),
    };
  } catch (_error) {
    return { accessToken: getClientAccessToken(cookies), refreshToken: "" };
  }
}

function json(payload: unknown, status = 200, headers?: HeadersInit): Response {
  const responseHeaders = new Headers(headers ?? {});
  responseHeaders.set("Content-Type", "application/json");
  responseHeaders.set("Cache-Control", "no-store");

  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders,
  });
}

function isApprovedStatus(status: string): boolean {
  return status === "Aprovado" || status === "approved";
}

async function fetchUser(supabaseUrl: string, publishableKey: string, accessToken: string) {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) return null;
  return await response.json();
}

async function fetchProfile(
  supabaseUrl: string,
  publishableKey: string,
  accessToken: string,
  userId: string,
): Promise<PlaybookProfile | null> {
  const url = new URL(supabaseUrl + "/rest/v1/playbook_profiles");
  url.searchParams.set("select", "user_id,email,role,status,force_password_change");
  url.searchParams.set("user_id", "eq." + userId);
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) return null;

  const rows = await response.json();
  return Array.isArray(rows) && rows[0] ? rows[0] as PlaybookProfile : null;
}

async function refreshSession(
  req: Request,
  supabaseUrl: string,
  publishableKey: string,
  refreshToken: string,
) {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) return null;

  const payload = await response.json();
  if (!payload.access_token || !payload.refresh_token) return null;

  const accessMaxAge = Number(payload.expires_in) || 3600;
  return {
    accessToken: String(payload.access_token),
    refreshToken: String(payload.refresh_token),
    setCookies: [
      setCookie(
        req,
        SESSION_COOKIE,
        encodeSessionCookie(String(payload.access_token), String(payload.refresh_token)),
        Math.max(accessMaxAge, 60 * 60 * 24 * 30),
      ),
    ],
  };
}

async function validateSession(req: Request): Promise<ValidationResult> {
  const supabaseUrl = getSupabaseUrl();
  const publishableKey = getPublishableKey();

  if (!supabaseUrl || !publishableKey) {
    return { ok: false, reason: "server_not_configured", status: 503 };
  }

  const cookies = parseCookies(req.headers.get("Cookie"));
  const sessionTokens = getSessionTokens(cookies);
  const clientAccessToken = getClientAccessToken(cookies);
  let accessToken = sessionTokens.accessToken;
  let refreshToken = sessionTokens.refreshToken;
  let setCookies: string[] = [];

  let user = accessToken ? await fetchUser(supabaseUrl, publishableKey, accessToken) : null;

  if (!user && clientAccessToken && clientAccessToken !== accessToken) {
    accessToken = clientAccessToken;
    refreshToken = "";
    user = await fetchUser(supabaseUrl, publishableKey, accessToken);
  }

  if (!user && refreshToken) {
    const refreshed = await refreshSession(req, supabaseUrl, publishableKey, refreshToken);
    if (refreshed) {
      accessToken = refreshed.accessToken;
      refreshToken = refreshed.refreshToken;
      setCookies = refreshed.setCookies;
      user = await fetchUser(supabaseUrl, publishableKey, accessToken);
    }
  }

  if (!user || !accessToken) {
    return { ok: false, reason: "missing_session", status: 401, clearCookies: true };
  }

  const profile = await fetchProfile(supabaseUrl, publishableKey, accessToken, user.id);

  if (!profile) {
    return { ok: false, reason: "profile_missing", status: 403 };
  }

  if (!isApprovedStatus(profile.status)) {
    const reasonByStatus: Record<string, string> = {
      Pendente: "pendente",
      pending: "pending",
      Recusado: "recusado",
      rejected: "rejected",
      Suspenso: "suspenso",
      suspended: "suspended",
    };
    return { ok: false, reason: reasonByStatus[profile.status] ?? "not_approved", status: 403 };
  }

  if (profile.force_password_change || profile.must_change_password) {
    return { ok: false, reason: "must_change_password", status: 403 };
  }

  return {
    ok: true,
    accessToken,
    refreshToken,
    profile,
    user: { id: String(user.id || ""), email: String(user.email || profile.email || "") },
    setCookies,
  };
}

async function handlePost(req: Request): Promise<Response> {
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

  const headers = new Headers({
    "Set-Cookie": setCookie(req, SESSION_COOKIE, encodeSessionCookie(accessToken, refreshToken), 60 * 60 * 24 * 30),
  });

  return json({ success: true }, 200, headers);
}

async function handleGet(req: Request): Promise<Response> {
  const validation = await validateSession(req);

  if (!validation.ok) {
    const headers = new Headers();
    if (validation.clearCookies) {
      headers.append("Set-Cookie", clearCookie(req, SESSION_COOKIE));
      headers.append("Set-Cookie", clearCookie(req, CLIENT_ACCESS_COOKIE, false));
    }
    return json({ success: false, authenticated: false, reason: validation.reason }, validation.status, headers);
  }

  const headers = new Headers();
  validation.setCookies.forEach((cookie) => headers.append("Set-Cookie", cookie));

  return json({
    success: true,
    authenticated: true,
    user: validation.user,
    profile: validation.profile,
  }, 200, headers);
}

export default async (req: Request, _context: Context) => {
  if (req.method === "POST") return handlePost(req);
  if (req.method === "GET") return handleGet(req);

  return json({ success: false, error: "Metodo nao permitido." }, 405);
};

export const config: Config = {
  path: "/api/auth/session",
};
