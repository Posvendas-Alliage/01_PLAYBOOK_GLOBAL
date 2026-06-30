import type { Config, Context } from "@netlify/functions";

const SESSION_COOKIE = "pb_session";

function isLocalRequest(req: Request): boolean {
  const url = new URL(req.url);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}

function clearCookie(req: Request, name: string): string {
  const secure = isLocalRequest(req) ? "" : "; Secure";
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Metodo nao permitido." }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  headers.append("Set-Cookie", clearCookie(req, SESSION_COOKIE));

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
};

export const config: Config = {
  path: "/api/auth/logout",
  method: ["POST"],
};
