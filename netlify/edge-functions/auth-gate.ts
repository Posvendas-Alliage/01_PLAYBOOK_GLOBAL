import type { Context } from "@netlify/edge-functions";

type PlaybookProfile = {
  user_id: string;
  email: string;
  role: "user" | "admin";
  status: "Pendente" | "Aprovado" | "Recusado" | "Suspenso" | "pending" | "approved" | "rejected" | "suspended";
  force_password_change: boolean;
  must_change_password?: boolean;
};

type ValidationResult =
  | { ok: true; accessToken: string; refreshToken?: string; profile: PlaybookProfile; setCookies: string[] }
  | { ok: false; reason: string; clearCookies?: boolean };

const SESSION_COOKIE = "pb_session";
const CLIENT_ACCESS_COOKIE = "pb_client_access";

function env(name: string): string {
  const globals = globalThis as unknown as {
    Netlify?: { env?: { get?: (key: string) => string | undefined } };
    Deno?: { env?: { get?: (key: string) => string | undefined } };
    process?: { env?: Record<string, string | undefined> };
  };

  try {
    if (typeof globals.Netlify?.env?.get === "function") {
      return globals.Netlify.env.get(name) ?? "";
    }
  } catch (_error) {
    // Fall through to other runtime providers.
  }

  try {
    if (typeof globals.Deno?.env?.get === "function") {
      return globals.Deno.env.get(name) ?? "";
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

function clearCookie(req: Request, name: string): string {
  return setCookie(req, name, "", 0);
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

function encodeSessionCookie(accessToken: string, refreshToken?: string): string {
  return btoa(JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken || "",
  })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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

function isPublicPath(pathname: string): boolean {
  const path = pathname.toLowerCase();

  if (path === "/auth.html") return true;
  if (path === "/login.html" || path === "/alterar-senha.html") return true;
  if (path === "/api/auth/session" || path === "/api/auth/logout") return true;
  if (path === "/.netlify/functions/auth-session" || path === "/.netlify/functions/auth-logout") return true;
  if (path === "/config/supabase.js") return true;
  if (path === "/js/auth.js") return true;
  if (path === "/js/playbook-auth.js") return true;
  if (path === "/js/playbook-login.js") return true;
  if (path === "/js/playbook-password.js") return true;
  if (path === "/js/playbook-auth-guard.js") return true;
  if (path === "/css/auth.css" || path === "/css/global.css") return true;
  if (path === "/css/security.css") return true;
  if (path.startsWith("/i18n/")) return true;
  if (path === "/robots.txt" || path === "/favicon.ico" || path === "/site.webmanifest") return true;

  return false;
}

function isAdminPath(pathname: string): boolean {
  const path = pathname.toLowerCase();
  return path === "/administracao-playbook.html" || path === "/admin.html";
}

function isApprovedStatus(status: string): boolean {
  return status === "Aprovado" || status === "approved";
}

function canonicalPlaybookPath(pathname: string): string {
  const path = String(pathname || "");
  const lowerPath = path.toLowerCase();

  if (lowerPath === "/01_kpi" || lowerPath === "/01_kpi/" || lowerPath === "/01_kpi/index.html") {
    return "/01_KPI/";
  }

  if (lowerPath === "/01_kpi/kpi_v2" || lowerPath === "/01_kpi/kpi_v2/") {
    return "/01_KPI/KPI_V2/";
  }

  if (lowerPath.startsWith("/01_kpi/kpi_v2/")) {
    const rest = path.slice("/01_kpi/kpi_v2/".length);
    const normalizedRest = rest || "";
    if (!normalizedRest || normalizedRest.toLowerCase() === "index.html") return "/01_KPI/KPI_V2/";
    const hasExtension = /\.[a-z0-9]+$/i.test(normalizedRest);
    return "/01_KPI/KPI_V2/" + normalizedRest + (hasExtension ? "" : ".html");
  }

  if (lowerPath.startsWith("/01_kpi/")) {
    return "/01_KPI/" + path.slice("/01_kpi/".length);
  }

  return path;
}

function canonicalRedirectPath(pathname: string): string {
  const path = String(pathname || "");
  const lowerPath = path.toLowerCase();

  if (lowerPath === "/01_kpi" || lowerPath === "/01_kpi/") {
    return "/01_KPI/";
  }

  if (lowerPath === "/01_kpi/index.html") {
    return "/01_KPI/index.html";
  }

  if (lowerPath === "/01_kpi/kpi_v2" || lowerPath === "/01_kpi/kpi_v2/") {
    return "/01_KPI/KPI_V2/";
  }

  if (lowerPath === "/01_kpi/kpi_v2/index.html") {
    return "/01_KPI/KPI_V2/index.html";
  }

  if (lowerPath.startsWith("/01_kpi/kpi_v2/")) {
    const rest = path.slice("/01_kpi/kpi_v2/".length);
    const normalizedRest = rest || "";
    const hasExtension = /\.[a-z0-9]+$/i.test(normalizedRest);
    return "/01_KPI/KPI_V2/" + normalizedRest + (hasExtension ? "" : ".html");
  }

  if (lowerPath.startsWith("/01_kpi/")) {
    return "/01_KPI/" + path.slice("/01_kpi/".length);
  }

  return path;
}
function canonicalReturnTo(url: URL): string {
  return canonicalPlaybookPath(url.pathname) + url.search + url.hash;
}

function shouldDisableLoginAutoRedirect(reason: string): boolean {
  return reason === "invalid_session" ||
    reason === "missing_session" ||
    reason === "missing_user" ||
    reason === "server_not_configured";
}

function redirectToAuth(req: Request, reason: string, mode?: string): Response {
  const requestUrl = new URL(req.url);
  const authUrl = new URL("/login.html", requestUrl.origin);
  authUrl.searchParams.set("returnTo", canonicalReturnTo(requestUrl));
  authUrl.searchParams.set("reason", reason);
  if (shouldDisableLoginAutoRedirect(reason)) authUrl.searchParams.set("auto", "0");
  if (mode) authUrl.searchParams.set("mode", mode);

  const headers = new Headers({
    Location: authUrl.toString(),
    "Cache-Control": "no-store",
  });

  if (reason === "invalid_session" || reason === "missing_session") {
    headers.append("Set-Cookie", clearCookie(req, SESSION_COOKIE));
    headers.append("Set-Cookie", clearCookie(req, CLIENT_ACCESS_COOKIE));
  }

  return new Response(null, { status: 302, headers });
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
    return { ok: false, reason: "server_not_configured" };
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
    return { ok: false, reason: "missing_session", clearCookies: true };
  }

  const profile = await fetchProfile(supabaseUrl, publishableKey, accessToken, user.id);

  if (!profile) {
    return { ok: false, reason: "profile_missing" };
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
    return { ok: false, reason: reasonByStatus[profile.status] ?? "not_approved" };
  }

  if (profile.force_password_change || profile.must_change_password) {
    return { ok: false, reason: "must_change_password" };
  }

  return { ok: true, accessToken, refreshToken, profile, setCookies };
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);

  if (req.method === "OPTIONS" || isPublicPath(url.pathname)) {
    return context.next();
  }

  const validation = await validateSession(req);

  if (!validation.ok) {
    if (validation.reason === "must_change_password") {
      const passwordUrl = new URL("/alterar-senha.html", url.origin);
      passwordUrl.searchParams.set("returnTo", url.pathname + url.search + url.hash);
      return new Response(null, {
        status: 302,
        headers: {
          Location: passwordUrl.toString(),
          "Cache-Control": "no-store",
        },
      });
    }
    return redirectToAuth(req, validation.reason);
  }

  if (isAdminPath(url.pathname) && validation.profile.role !== "admin") {
    return redirectToAuth(req, "admin_required");
  }

  const canonicalPath = canonicalRedirectPath(url.pathname);
  if (canonicalPath !== url.pathname) {
    const canonicalUrl = new URL(req.url);
    canonicalUrl.pathname = canonicalPath;
    const headers = new Headers({
      Location: canonicalUrl.toString(),
      "Cache-Control": "no-store",
    });
    validation.setCookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
    return new Response(null, { status: 302, headers });
  }
  const response = await context.next();
  response.headers.set("Cache-Control", "private, no-store");
  validation.setCookies.forEach((cookie) => response.headers.append("Set-Cookie", cookie));

  return response;
};
