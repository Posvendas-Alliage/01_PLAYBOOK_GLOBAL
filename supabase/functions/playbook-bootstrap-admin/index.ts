import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2";

const INITIAL_ADMIN_EMAIL = "posvendas@alliage-global.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-bootstrap-token, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  return value;
}

function getAdminKey(): string {
  const legacyServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacyServiceRole) return legacyServiceRole;

  const secretKeysJson = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (secretKeysJson) {
    const secretKeys = JSON.parse(secretKeysJson) as Record<string, string>;
    if (secretKeys.default) return secretKeys.default;
  }

  const singleSecretKey = Deno.env.get("SUPABASE_SECRET_KEY");
  if (singleSecretKey) return singleSecretKey;

  throw new Error("Configure SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_SECRET_KEYS/default para o bootstrap.");
}

function createAdminClient(): SupabaseClient {
  return createClient(getRequiredEnv("SUPABASE_URL"), getAdminKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function safeTrim(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

function validatePassword(password: string): string | null {
  if (password.length < 12) return "A senha inicial precisa ter pelo menos 12 caracteres.";
  if (password.length > 128) return "A senha inicial pode ter no maximo 128 caracteres.";
  if (!/[a-z]/.test(password)) return "A senha inicial precisa conter letra minuscula.";
  if (!/[A-Z]/.test(password)) return "A senha inicial precisa conter letra maiuscula.";
  if (!/[0-9]/.test(password)) return "A senha inicial precisa conter numero.";
  if (!/[^A-Za-z0-9]/.test(password)) return "A senha inicial precisa conter simbolo.";
  return null;
}

function isAuthorizedBootstrapCall(req: Request): boolean {
  const expected = safeTrim(Deno.env.get("PLAYBOOK_BOOTSTRAP_TOKEN"));
  const received = safeTrim(req.headers.get("x-bootstrap-token"));
  return expected.length >= 24 && received === expected;
}

async function findUserByEmail(admin: SupabaseClient, email: string): Promise<User | null> {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`Erro ao listar usuarios Auth: ${error.message}`);

    const match = data.users.find((user) => (user.email ?? "").toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (data.users.length < 1000) break;
  }

  return null;
}

async function createOrUpdateInitialAdmin(admin: SupabaseClient) {
  const email = safeTrim(Deno.env.get("PLAYBOOK_INITIAL_ADMIN_EMAIL")) || INITIAL_ADMIN_EMAIL;
  const password = safeTrim(Deno.env.get("PLAYBOOK_ADMIN_INITIAL_PASSWORD"));
  const resetPassword = safeTrim(Deno.env.get("PLAYBOOK_BOOTSTRAP_RESET_PASSWORD")).toLowerCase() === "true";
  const forcePasswordChange =
    safeTrim(Deno.env.get("PLAYBOOK_ADMIN_FORCE_PASSWORD_CHANGE")).toLowerCase() === "true";

  const passwordError = validatePassword(password);
  if (passwordError) {
    return jsonResponse({ success: false, error: passwordError }, 400);
  }

  let user = await findUserByEmail(admin, email);
  let created = false;

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: {
        playbook_role: "admin",
      },
    });

    if (error) throw new Error(`Erro ao criar administrador inicial: ${error.message}`);
    if (!data.user) throw new Error("Supabase Auth nao retornou o usuario criado.");

    user = data.user;
    created = true;
  } else {
    const updatePayload: {
      app_metadata: Record<string, string>;
      password?: string;
      email_confirm?: boolean;
    } = {
      app_metadata: {
        ...(user.app_metadata as Record<string, string> | null ?? {}),
        playbook_role: "admin",
      },
      email_confirm: true,
    };

    if (resetPassword) updatePayload.password = password;

    const { data, error } = await admin.auth.admin.updateUserById(user.id, updatePayload);
    if (error) throw new Error(`Erro ao atualizar administrador inicial: ${error.message}`);
    if (data.user) user = data.user;
  }

  const now = new Date().toISOString();
  const { data: existingProfile, error: profileReadError } = await admin
    .from("playbook_profiles")
    .select("user_id,role,status,force_password_change")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileReadError) {
    throw new Error(`Erro ao consultar perfil do administrador: ${profileReadError.message}`);
  }

  const { error: upsertError } = await admin
    .from("playbook_profiles")
    .upsert({
      user_id: user.id,
      email,
      role: "admin",
      status: "approved",
      force_password_change: forcePasswordChange,
      approved_by: user.id,
      approved_at: now,
      status_changed_by: user.id,
      status_changed_at: now,
    }, { onConflict: "user_id" });

  if (upsertError) {
    throw new Error(`Erro ao criar/atualizar perfil admin: ${upsertError.message}`);
  }

  const { error: auditError } = await admin.from("playbook_profile_audit").insert({
    target_user_id: user.id,
    actor_user_id: user.id,
    action: forcePasswordChange ? "password_change_required" : "approved",
    old_status: existingProfile?.status ?? null,
    new_status: "approved",
    old_role: existingProfile?.role ?? null,
    new_role: "admin",
    notes: created
      ? "Initial administrator created by secure bootstrap."
      : "Initial administrator reconciled by secure bootstrap.",
  });

  if (auditError) {
    throw new Error(`Administrador configurado, mas houve erro ao auditar: ${auditError.message}`);
  }

  return jsonResponse({
    success: true,
    created,
    reset_password: resetPassword,
    email,
    user_id: user.id,
    force_password_change: forcePasswordChange,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Metodo nao permitido." }, 405);
  }

  if (!isAuthorizedBootstrapCall(req)) {
    return jsonResponse({ success: false, error: "Bootstrap nao autorizado." }, 401);
  }

  try {
    return await createOrUpdateInitialAdmin(createAdminClient());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return jsonResponse({ success: false, error: message }, 500);
  }
});
