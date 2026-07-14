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

function firstEnv(names: string[], fallback = ""): string {
  for (const name of names) {
    const value = env(name).trim();
    if (value) return value;
  }
  return fallback;
}

function jsString(value: string): string {
  return JSON.stringify(value);
}

export default async (_req: Request, _context: Context) => {
  const supabaseUrl = firstEnv(["PLAYBOOK_SUPABASE_URL", "SUPABASE_URL"], DEFAULT_SUPABASE_URL);
  const anonKey = firstEnv([
    "PLAYBOOK_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
    "PLAYBOOK_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
  ]);

  if (!anonKey) {
    return new Response("window.SUPABASE_URL = ''; window.SUPABASE_ANON_KEY = '';\n", {
      status: 503,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(
    [
      `window.SUPABASE_URL = ${jsString(supabaseUrl)};`,
      `window.SUPABASE_ANON_KEY = ${jsString(anonKey)};`,
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
};

export const config: Config = {
  path: "/config/supabase.js",
};
