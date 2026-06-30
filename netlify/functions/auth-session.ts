import type { Config, Context } from "@netlify/functions";

const SESSION_COOKIE = "pb_session";

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

function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function encodeSessionCookie(accessToken: string, refreshToken: string): string {
  return base64UrlEncode(JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken,
  }));
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

  const headers = new Headers({
    "Set-Cookie": setCookie(req, SESSION_COOKIE, encodeSessionCookie(accessToken, refreshToken), 60 * 60 * 24 * 30),
  });

  return json({ success: true }, 200, headers);
};

export const config: Config = {
  path: "/api/auth/session",
  method: ["POST"],
};
