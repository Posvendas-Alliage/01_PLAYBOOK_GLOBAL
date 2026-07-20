#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

function loadDotEnv() {
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 0) continue;

    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function envAny(names) {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  throw new Error("Variavel obrigatoria ausente: " + names.join(" ou "));
}

function normalizeUrl(url) {
  return url.replace(/\/+$/, "");
}

async function main() {
  loadDotEnv();

  const supabaseUrl = normalizeUrl(envAny(["SUPABASE_URL", "PLAYBOOK_SUPABASE_URL"]));
  const bootstrapToken = envAny(["PLAYBOOK_BOOTSTRAP_TOKEN"]);

  if (bootstrapToken.length < 24) {
    throw new Error("PLAYBOOK_BOOTSTRAP_TOKEN deve ter pelo menos 24 caracteres.");
  }

  const response = await fetch(supabaseUrl + "/functions/v1/playbook-bootstrap-admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-bootstrap-token": bootstrapToken,
    },
    body: "{}",
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.error || payload?.message || "Bootstrap retornou erro HTTP " + response.status);
  }

  console.log(JSON.stringify({
    success: true,
    created: Boolean(payload.created),
    email: payload.email,
    user_id: payload.user_id,
    force_password_change: Boolean(payload.force_password_change),
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
