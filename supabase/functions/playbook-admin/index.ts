import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2";

type JsonRecord = Record<string, unknown>;
type UserStatus = "pending" | "approved" | "rejected" | "suspended";
type UserRole = "user" | "admin";

type PlaybookProfile = {
  user_id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  force_password_change: boolean;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
  status_changed_at: string | null;
  status_changed_by: string | null;
};

const PROFILE_SELECT =
  "user_id,email,role,status,force_password_change,created_at,updated_at,approved_at,approved_by,status_changed_at,status_changed_by";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ success: false, error: message }, status);
}

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  return value;
}

function getFirstJsonSecret(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return Object.values(parsed).find((value) => typeof value === "string" && value.length > 0) ?? null;
  } catch {
    return null;
  }
}

function getAdminKey(): string {
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    getFirstJsonSecret(Deno.env.get("SUPABASE_SECRET_KEYS")) ??
    Deno.env.get("SUPABASE_SECRET_KEY") ??
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
}

function createAdminClient(): SupabaseClient {
  return createClient(getRequiredEnv("SUPABASE_URL"), getAdminKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getBearerToken(req: Request): string {
  const header = req.headers.get("Authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new Error("Authorization Bearer ausente.");
  return match[1].trim();
}

async function readBody(req: Request): Promise<JsonRecord> {
  const text = await req.text();
  if (!text.trim()) return {};

  const parsed = JSON.parse(text) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Body JSON deve ser um objeto.");
  }

  return parsed as JsonRecord;
}

function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStatus(value: unknown): UserStatus | "" {
  const raw = toText(value);
  const aliases: Record<string, UserStatus> = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    suspended: "suspended",
    Pendente: "pending",
    Aprovado: "approved",
    Recusado: "rejected",
    Rejeitado: "rejected",
    Suspenso: "suspended",
  };

  if (!raw) return "";
  if (aliases[raw]) return aliases[raw];
  throw new Error("Status invalido.");
}

function normalizeAction(value: unknown): string {
  const action = toText(value);
  if (
    [
      "complete_password_change",
      "list_users",
      "set_status",
      "list",
      "approve",
      "reject",
      "suspend",
      "reactivate",
      "set_role",
      "make_admin",
      "remove_admin",
    ].includes(action)
  ) {
    return action;
  }
  throw new Error("Acao invalida.");
}

function validatePassword(password: string): string | null {
  if (password.length < 12) return "A nova senha precisa ter pelo menos 12 caracteres.";
  if (password.length > 128) return "A nova senha pode ter no maximo 128 caracteres.";
  if (!/[a-z]/.test(password)) return "A nova senha precisa conter letra minuscula.";
  if (!/[A-Z]/.test(password)) return "A nova senha precisa conter letra maiuscula.";
  if (!/[0-9]/.test(password)) return "A nova senha precisa conter numero.";
  if (!/[^A-Za-z0-9]/.test(password)) return "A nova senha precisa conter simbolo.";
  return null;
}

function normalizeRole(value: unknown): UserRole | "" {
  const raw = toText(value).toLowerCase();
  if (!raw) return "";
  if (raw === "user" || raw === "admin") return raw;
  throw new Error("Perfil invalido.");
}

async function getCaller(req: Request, admin: SupabaseClient): Promise<{ user: User; profile: PlaybookProfile }> {
  const token = getBearerToken(req);
  const userResult = await admin.auth.getUser(token);

  if (userResult.error || !userResult.data.user) {
    throw new Error("Sessao invalida ou expirada.");
  }

  const user = userResult.data.user;
  const profileResult = await admin
    .from("playbook_profiles")
    .select(PROFILE_SELECT)
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileResult.error) throw profileResult.error;
  if (!profileResult.data) throw new Error("Perfil do Playbook nao encontrado.");

  return {
    user,
    profile: profileResult.data as PlaybookProfile,
  };
}

function requireApprovedUser(profile: PlaybookProfile): void {
  if (profile.status !== "approved") {
    throw new Error("Usuario ainda nao esta aprovado.");
  }
}

function requireApprovedAdmin(profile: PlaybookProfile): void {
  requireApprovedUser(profile);
  if (profile.force_password_change) {
    throw new Error("Troque a senha inicial antes de administrar usuarios.");
  }
  if (profile.role !== "admin") {
    throw new Error("Acesso negado: administrador aprovado requerido.");
  }
}

async function getProfile(admin: SupabaseClient, userId: string): Promise<PlaybookProfile> {
  const result = await admin
    .from("playbook_profiles")
    .select(PROFILE_SELECT)
    .eq("user_id", userId)
    .maybeSingle();

  if (result.error) throw result.error;
  if (!result.data) throw new Error("Usuario alvo nao encontrado.");
  return result.data as PlaybookProfile;
}

async function listUsers(admin: SupabaseClient, body: JsonRecord, currentUserId: string): Promise<Response> {
  const search = toText(body.search).toLowerCase();
  const status = normalizeStatus(body.status);

  let query = admin
    .from("playbook_profiles")
    .select(PROFILE_SELECT)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("email", `%${search.replace(/[%_]/g, "\\$&")}%`);

  const result = await query;
  if (result.error) throw result.error;

  return jsonResponse({
    success: true,
    current_user_id: currentUserId,
    users: result.data ?? [],
  });
}

function statusFromAction(action: string, body: JsonRecord): UserStatus {
  if (action === "approve" || action === "reactivate") return "approved";
  if (action === "reject") return "rejected";
  if (action === "suspend") return "suspended";

  const status = normalizeStatus(body.status);
  if (!status) throw new Error("Status alvo ausente.");
  return status;
}

function auditAction(oldStatus: UserStatus, newStatus: UserStatus): string {
  if (newStatus === "approved" && oldStatus === "pending") return "approved";
  if (newStatus === "approved") return "reactivated";
  if (newStatus === "rejected") return "rejected";
  if (newStatus === "suspended") return "suspended";
  return "reactivated";
}

async function ensureAnotherApprovedAdmin(admin: SupabaseClient, target: PlaybookProfile): Promise<void> {
  const result = await admin
    .from("playbook_profiles")
    .select("user_id", { count: "exact", head: true })
    .eq("role", "admin")
    .eq("status", "approved")
    .eq("force_password_change", false)
    .neq("user_id", target.user_id);

  if (result.error) throw result.error;
  if ((result.count ?? 0) < 1) {
    throw new Error("Nao e permitido remover ou bloquear o ultimo administrador aprovado.");
  }
}

async function syncAuthMetadata(
  admin: SupabaseClient,
  targetUserId: string,
  role: UserRole,
  status: UserStatus,
): Promise<void> {
  const authUserResult = await admin.auth.admin.getUserById(targetUserId);
  if (authUserResult.error) throw authUserResult.error;

  const existingMetadata = authUserResult.data.user?.app_metadata &&
    typeof authUserResult.data.user.app_metadata === "object"
    ? authUserResult.data.user.app_metadata
    : {};

  const updateResult = await admin.auth.admin.updateUserById(targetUserId, {
    app_metadata: {
      ...existingMetadata,
      playbook_role: role,
      playbook_status: status,
    },
  });

  if (updateResult.error) throw updateResult.error;
}

async function updateUserStatus(
  admin: SupabaseClient,
  action: string,
  body: JsonRecord,
  callerUserId: string,
): Promise<Response> {
  const targetUserId = toText(body.user_id ?? body.userId);
  if (!targetUserId) throw new Error("Usuario alvo ausente.");
  if (targetUserId === callerUserId) {
    throw new Error("A conta administrativa atual nao pode alterar o proprio status.");
  }

  const target = await getProfile(admin, targetUserId);
  const nextStatus = statusFromAction(action, body);
  if (
    target.role === "admin" &&
    target.status === "approved" &&
    !target.force_password_change &&
    nextStatus !== "approved"
  ) {
    await ensureAnotherApprovedAdmin(admin, target);
  }

  const now = new Date().toISOString();
  const updatePayload: Record<string, unknown> = {
    status: nextStatus,
    status_changed_by: callerUserId,
    status_changed_at: now,
  };

  if (nextStatus === "approved") {
    updatePayload.approved_by = callerUserId;
    updatePayload.approved_at = now;
  }

  const updateResult = await admin
    .from("playbook_profiles")
    .update(updatePayload)
    .eq("user_id", targetUserId)
    .select(PROFILE_SELECT)
    .single();

  if (updateResult.error) throw updateResult.error;

  const auditResult = await admin
    .from("playbook_profile_audit")
    .insert({
      target_user_id: targetUserId,
      actor_user_id: callerUserId,
      action: auditAction(target.status, nextStatus),
      old_status: target.status,
      new_status: nextStatus,
      old_role: target.role,
      new_role: target.role,
      notes: toText(body.note) || null,
    });

  if (auditResult.error) throw auditResult.error;

  await syncAuthMetadata(admin, targetUserId, target.role, nextStatus);

  return jsonResponse({
    success: true,
    user: updateResult.data,
  });
}

function roleFromAction(action: string, body: JsonRecord): UserRole {
  if (action === "make_admin") return "admin";
  if (action === "remove_admin") return "user";

  const role = normalizeRole(body.role);
  if (!role) throw new Error("Perfil alvo ausente.");
  return role;
}

async function updateUserRole(
  admin: SupabaseClient,
  action: string,
  body: JsonRecord,
  callerUserId: string,
): Promise<Response> {
  const targetUserId = toText(body.user_id ?? body.userId);
  if (!targetUserId) throw new Error("Usuario alvo ausente.");

  const target = await getProfile(admin, targetUserId);
  const nextRole = roleFromAction(action, body);

  if (targetUserId === callerUserId && nextRole !== "admin") {
    throw new Error("A conta administrativa atual nao pode remover o proprio perfil admin.");
  }

  if (nextRole === "admin" && target.status !== "approved") {
    throw new Error("Aprove o usuario antes de torna-lo administrador.");
  }

  if (
    target.role === "admin" &&
    nextRole !== "admin" &&
    target.status === "approved" &&
    !target.force_password_change
  ) {
    await ensureAnotherApprovedAdmin(admin, target);
  }

  const now = new Date().toISOString();
  const updateResult = await admin
    .from("playbook_profiles")
    .update({
      role: nextRole,
      status_changed_by: callerUserId,
      status_changed_at: now,
    })
    .eq("user_id", targetUserId)
    .select(PROFILE_SELECT)
    .single();

  if (updateResult.error) throw updateResult.error;

  const auditResult = await admin
    .from("playbook_profile_audit")
    .insert({
      target_user_id: targetUserId,
      actor_user_id: callerUserId,
      action: "role_changed",
      old_status: target.status,
      new_status: target.status,
      old_role: target.role,
      new_role: nextRole,
      notes: toText(body.note) || null,
    });

  if (auditResult.error) throw auditResult.error;

  await syncAuthMetadata(admin, targetUserId, nextRole, target.status);

  return jsonResponse({
    success: true,
    user: updateResult.data,
  });
}

async function completePasswordChange(
  admin: SupabaseClient,
  body: JsonRecord,
  caller: { user: User; profile: PlaybookProfile },
): Promise<Response> {
  requireApprovedUser(caller.profile);

  const password = toText(body.password);
  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(passwordError);

  const updateAuthResult = await admin.auth.admin.updateUserById(caller.user.id, {
    password,
  });

  if (updateAuthResult.error) throw updateAuthResult.error;

  const profileResult = await admin
    .from("playbook_profiles")
    .update({
      force_password_change: false,
      status_changed_by: caller.user.id,
      status_changed_at: new Date().toISOString(),
    })
    .eq("user_id", caller.user.id)
    .select(PROFILE_SELECT)
    .single();

  if (profileResult.error) throw profileResult.error;

  const auditResult = await admin
    .from("playbook_profile_audit")
    .insert({
      target_user_id: caller.user.id,
      actor_user_id: caller.user.id,
      action: "password_changed",
      old_status: caller.profile.status,
      new_status: caller.profile.status,
      old_role: caller.profile.role,
      new_role: caller.profile.role,
      notes: "User completed required password change.",
    });

  if (auditResult.error) throw auditResult.error;

  return jsonResponse({
    success: true,
    user: profileResult.data,
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return errorResponse("Metodo nao permitido.", 405);

  try {
    const admin = createAdminClient();
    const body = await readBody(req);
    const action = normalizeAction(body.action);
    const caller = await getCaller(req, admin);

    if (action === "complete_password_change") {
      return await completePasswordChange(admin, body, caller);
    }

    requireApprovedAdmin(caller.profile);

    if (action === "list" || action === "list_users") {
      return await listUsers(admin, body, caller.user.id);
    }

    if (action === "set_role" || action === "make_admin" || action === "remove_admin") {
      return await updateUserRole(admin, action, body, caller.user.id);
    }

    return await updateUserStatus(admin, action, body, caller.user.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = /Authorization|Sessao|Perfil|aprovado|administrador|negado|required|ausente/i.test(message)
      ? 403
      : 400;
    return errorResponse(message, status);
  }
});
