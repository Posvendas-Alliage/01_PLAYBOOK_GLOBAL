import { createClient } from "npm:@supabase/supabase-js@2";

type DashboardType =
  | "kpis"
  | "summary"
  | "backlog"
  | "status-priority"
  | "data-quality"
  | "health"
  | "bi-kpis"
  | "bi-region-summary"
  | "bi-summary"
  | "bi-backlog"
  | "bi-backlog-kpis"
  | "bi-tickets"
  | "sync-health";

type PlaybookProfile = {
  user_id: string;
  email: string;
  role: "user" | "admin";
  status: "Pendente" | "Aprovado" | "Recusado" | "Suspenso" | "pending" | "approved" | "rejected" | "suspended";
  force_password_change: boolean;
  must_change_password?: boolean;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  }

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

  throw new Error("Configure SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_SECRET_KEYS/default.");
}

function createAdminClient() {
  return createClient(
    getRequiredEnv("SUPABASE_URL"),
    getAdminKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

function bearerToken(req: Request): string | null {
  const value = req.headers.get("Authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

async function requireApprovedPlaybookUser(req: Request, supabase: ReturnType<typeof createAdminClient>) {
  const token = bearerToken(req);

  if (!token) {
    return {
      ok: false as const,
      response: jsonResponse({
        success: false,
        error: "Sessao obrigatoria para acessar dados do Playbook.",
      }, 401),
    };
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData.user) {
    return {
      ok: false as const,
      response: jsonResponse({
        success: false,
        error: "Sessao invalida ou expirada.",
      }, 401),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("playbook_profiles")
    .select("user_id,email,role,status,force_password_change")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (profileError) {
    return {
      ok: false as const,
      response: jsonResponse({
        success: false,
        error: `Erro ao validar perfil do Playbook: ${profileError.message}`,
      }, 500),
    };
  }

  const typedProfile = profile as PlaybookProfile | null;

  if (!typedProfile || (typedProfile.status !== "Aprovado" && typedProfile.status !== "approved")) {
    return {
      ok: false as const,
      response: jsonResponse({
        success: false,
        error: typedProfile
          ? `Cadastro ${typedProfile.status}.`
          : "Perfil do Playbook nao encontrado.",
      }, 403),
    };
  }

  if (typedProfile.force_password_change || typedProfile.must_change_password) {
    return {
      ok: false as const,
      response: jsonResponse({
        success: false,
        error: "Troque a senha inicial antes de acessar dados do Playbook.",
      }, 403),
    };
  }

  return {
    ok: true as const,
    user: userData.user,
    profile: typedProfile,
  };
}

function parseDashboardType(value: string | null): DashboardType | null {
  const type = value ?? "kpis";

  if (
    type === "kpis" ||
    type === "summary" ||
    type === "backlog" ||
    type === "status-priority" ||
    type === "data-quality" ||
    type === "health" ||
    type === "bi-kpis" ||
    type === "bi-region-summary" ||
    type === "bi-summary" ||
    type === "bi-backlog" ||
    type === "bi-backlog-kpis" ||
    type === "bi-tickets" ||
    type === "sync-health"
  ) {
    return type;
  }

  return null;
}

function parseLimit(value: string | null, defaultLimit: number, maxLimit: number): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return defaultLimit;
  }

  return Math.min(Math.max(1, Math.trunc(parsed)), maxLimit);
}

const BI_TICKET_COLUMNS = "ticket_id,ticket_number,subject,status,priority,department_name,agent_name,pais,region,categoria,produtos,tipo_atendimento,created_time,closed_time,due_date,response_due_date,regiao_grupo,priority_standard,mtfc_horas_bi,mtts_dias_bi,aging_backlog_dias,is_open,is_closed,is_sla_eligible,meta_mtts_dias,meta_mtfc_horas,sla_status_bi,agent_email,contact_name,contact_email,regiao,grupo_operacional_agente";

async function fetchPagedBiTickets(supabase: any, limit: number) {
  const pageSize = 1000;
  const rows: unknown[] = [];

  for (let offset = 0; offset < limit; offset += pageSize) {
    const to = Math.min(offset + pageSize - 1, limit - 1);
    const { data, error } = await supabase
      .from("vw_tickets_bi_base")
      .select(BI_TICKET_COLUMNS)
      .or("is_weekly_report_filter_included.eq.true,department_name.eq.SAC")
      .order("created_time", { ascending: false })
      .range(offset, to);

    if (error) {
      return { rows, error };
    }

    const pageRows = Array.isArray(data) ? data : [];
    rows.push(...pageRows);

    if (pageRows.length < pageSize) {
      break;
    }
  }

  return { rows: rows.slice(0, limit), error: null };
}

function textValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function rawCfValue(rawCf: unknown, key: string): string | null {
  if (!rawCf || typeof rawCf !== "object") return null;
  return textValue((rawCf as Record<string, unknown>)[key]);
}

function detailedCountry(row: Record<string, unknown>): string | null {
  const rawCf = row.raw_cf;
  return rawCfValue(rawCf, "cf_pais_1") ??
    rawCfValue(rawCf, "cf_country") ??
    rawCfValue(rawCf, "country") ??
    rawCfValue(rawCf, "pais") ??
    textValue(row.pais) ??
    textValue(row.regiao) ??
    textValue(row.region);
}

function countryOptionRow(row: Record<string, unknown>): Record<string, unknown> {
  const country = detailedCountry(row);
  return {
    ticket_id: textValue(row.id),
    ticket_number: textValue(row.ticket_number),
    pais: textValue(row.pais),
    regiao: textValue(row.regiao),
    region: textValue(row.region),
    cf_pais_1: country,
    pais_detalhado: country,
    created_time: textValue(row.created_time),
  };
}

async function fetchCountryOptions(supabase: any, limit: number) {
  const pageSize = 1000;
  const rows: Record<string, unknown>[] = [];

  for (let offset = 0; offset < limit; offset += pageSize) {
    const to = Math.min(offset + pageSize - 1, limit - 1);
    const { data, error } = await supabase
      .from("zoho_tickets")
      .select("id,ticket_number,pais,regiao,region,raw_cf,created_time")
      .order("created_time", { ascending: false })
      .range(offset, to);

    if (error) return { rows, error };

    const pageRows = Array.isArray(data) ? data : [];
    rows.push(...pageRows.map((row: Record<string, unknown>) => countryOptionRow(row)));

    if (pageRows.length < pageSize) break;
  }

  return { rows: rows.slice(0, limit), error: null };
}

function backlogTicketKey(row: Record<string, unknown>): string {
  return String(row.ticket_id ?? row.id ?? "").trim();
}

async function fetchBiBacklogWithObservations(supabase: any, limit: number) {
  const { data, error } = await supabase
    .from("vw_dashboard_bi_backlog")
    .select("*")
    .order("aging_backlog_dias", { ascending: false })
    .limit(limit);

  if (error) return { rows: [], error };

  const rows = Array.isArray(data) ? data as Record<string, unknown>[] : [];
  const ticketIds = [...new Set(rows.map(backlogTicketKey).filter(Boolean))];

  if (!ticketIds.length) return { rows, error: null };

  const observationsResult = await supabase
    .from("playbook_ticket_observations")
    .select("ticket_id,observation,updated_at,updated_by")
    .in("ticket_id", ticketIds);

  if (observationsResult.error) {
    console.warn("dashboard-read: observacoes do backlog indisponiveis", observationsResult.error.message);
    return {
      rows: rows.map((row) => ({
        ...row,
        backlog_observation: null,
        observation: null,
        observation_updated_at: null,
        observation_updated_by: null,
      })),
      error: null,
    };
  }

  const observations = new Map(
    (Array.isArray(observationsResult.data) ? observationsResult.data : [])
      .map((item: Record<string, unknown>) => [String(item.ticket_id || ""), item])
  );

  return {
    rows: rows.map((row) => {
      const item = observations.get(backlogTicketKey(row));
      const observation = item ? textValue(item.observation) : null;
      return {
        ...row,
        backlog_observation: observation,
        observation,
        observation_updated_at: item?.updated_at ?? null,
        observation_updated_by: item?.updated_by ?? null,
      };
    }),
    error: null,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "GET") {
    return jsonResponse({
      success: false,
      error: "Metodo nao permitido. Use GET ou OPTIONS.",
    }, 405);
  }

  try {
    const url = new URL(req.url);
    const type = parseDashboardType(url.searchParams.get("type"));

    if (!type) {
      return jsonResponse({
        success: false,
        error: "Type invalido. Use kpis, summary, backlog, status-priority, data-quality, health, bi-kpis, bi-region-summary, bi-summary, bi-backlog, bi-backlog-kpis, bi-tickets, bi-country-options ou sync-health.",
      }, 400);
    }

    if (type === "health") {
      return jsonResponse({
        success: true,
        type,
        count: 1,
        data: [{
        status: "ok",
        function: "dashboard-read",
        timestamp: new Date().toISOString(),
        }],
      });
    }

    const supabase = createAdminClient();
    const authCheck = await requireApprovedPlaybookUser(req, supabase);

    if (!authCheck.ok) {
      return authCheck.response;
    }

    if (type === "sync-health") {
      const now = new Date();
      const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [
        runsResult,
        errorsResult,
        updatedCountResult,
        updatedFreshnessResult,
        detailFreshnessResult,
        metricsFreshnessResult,
        staleOpenOldResult,
        staleOpenNeverResult,
        weeklyRowsResult,
      ] = await Promise.all([
        supabase
          .from("sync_runs")
          .select("id,source,sync_type,started_at,finished_at,status,total_records,success_records,error_records,message,from_datetime,to_datetime")
          .order("started_at", { ascending: false })
          .limit(5),
        supabase
          .from("sync_errors")
          .select("id,run_id,source,entity_type,entity_id,endpoint,error_message,created_at")
          .gte("created_at", since24h)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("zoho_tickets")
          .select("id", { count: "exact", head: true })
          .gte("updated_in_supabase_at", since24h),
        supabase
          .from("zoho_tickets")
          .select("updated_in_supabase_at")
          .order("updated_in_supabase_at", { ascending: false })
          .limit(1),
        supabase
          .from("zoho_tickets")
          .select("last_detail_sync_at")
          .not("last_detail_sync_at", "is", null)
          .order("last_detail_sync_at", { ascending: false })
          .limit(1),
        supabase
          .from("zoho_tickets")
          .select("last_metrics_sync_at")
          .not("last_metrics_sync_at", "is", null)
          .order("last_metrics_sync_at", { ascending: false })
          .limit(1),
        supabase
          .from("zoho_tickets")
          .select("id", { count: "exact", head: true })
          .is("closed_time", null)
          .lt("last_detail_sync_at", since24h),
        supabase
          .from("zoho_tickets")
          .select("id", { count: "exact", head: true })
          .is("closed_time", null)
          .is("last_detail_sync_at", null),
        supabase
          .from("vw_tickets_bi_base")
          .select("ticket_id,sla_status_bi,status,closed_time")
          .eq("is_weekly_report_filter_included", true)
          .gte("closed_time", since7d)
          .order("closed_time", { ascending: false })
          .limit(1000),
      ]);

      const queryErrors = [
        runsResult.error,
        errorsResult.error,
        updatedCountResult.error,
        updatedFreshnessResult.error,
        detailFreshnessResult.error,
        metricsFreshnessResult.error,
        staleOpenOldResult.error,
        staleOpenNeverResult.error,
        weeklyRowsResult.error,
      ].filter(Boolean);

      if (queryErrors.length > 0) {
        return jsonResponse({
          success: false,
          error: `Erro ao consultar sync-health: ${queryErrors.map((error) => error?.message).join(" | ")}`,
        }, 500);
      }

      const runs = Array.isArray(runsResult.data) ? runsResult.data : [];
      const recentErrors = Array.isArray(errorsResult.data) ? errorsResult.data : [];
      const weeklyRows = Array.isArray(weeklyRowsResult.data) ? weeklyRowsResult.data : [];
      const closedRows = weeklyRows.filter((row) =>
        ["closed", "resolved", "fechado", "resolvido"].includes(String(row.status ?? "").trim().toLowerCase())
      );
      const slaEligible = closedRows.filter((row) =>
        row.sla_status_bi === "Dentro SLA" || row.sla_status_bi === "Fora SLA"
      );
      const withinSla = closedRows.filter((row) => row.sla_status_bi === "Dentro SLA").length;
      const outsideSla = closedRows.filter((row) => row.sla_status_bi === "Fora SLA").length;
      const notEligible = closedRows.filter((row) => row.sla_status_bi === "Não elegível").length;
      const staleOpenTickets = (staleOpenOldResult.count ?? 0) + (staleOpenNeverResult.count ?? 0);
      const latestRun = runs[0] ?? null;
      const status = recentErrors.length > 0 || staleOpenTickets > 0 || latestRun?.status === "error"
        ? "attention"
        : "ok";

      return jsonResponse({
        success: true,
        type,
        count: 1,
        data: [{
          status,
          generated_at: now.toISOString(),
          latest_run: latestRun,
          recent_runs: runs,
          recent_errors_count: recentErrors.length,
          recent_errors: recentErrors,
          tickets_updated_24h: updatedCountResult.count ?? 0,
          stale_open_tickets_24h: staleOpenTickets,
          freshness: {
            updated_in_supabase_at: updatedFreshnessResult.data?.[0]?.updated_in_supabase_at ?? null,
            last_detail_sync_at: detailFreshnessResult.data?.[0]?.last_detail_sync_at ?? null,
            last_metrics_sync_at: metricsFreshnessResult.data?.[0]?.last_metrics_sync_at ?? null,
          },
          weekly_snapshot: {
            period_start: since7d,
            period_end: now.toISOString(),
            closed_tickets: closedRows.length,
            within_sla: withinSla,
            outside_sla: outsideSla,
            not_eligible: notEligible,
            sla_compliance_pct: slaEligible.length > 0
              ? Number(((withinSla / slaEligible.length) * 100).toFixed(2))
              : null,
          },
        }],
      });
    }

    if (type === "bi-tickets") {
      const limit = parseLimit(url.searchParams.get("limit"), 10000, 10000);
      const { rows, error } = await fetchPagedBiTickets(supabase, limit);

      if (error) {
        return jsonResponse({
          success: false,
          error: `Erro ao consultar ${type}: ${error.message}`,
        }, 500);
      }

      return jsonResponse({
        success: true,
        type,
        count: rows.length,
        data: rows,
      });
    }

    if (type === "bi-backlog") {
      const limit = parseLimit(url.searchParams.get("limit"), 100, 500);
      const { rows, error } = await fetchBiBacklogWithObservations(supabase, limit);

      if (error) {
        return jsonResponse({
          success: false,
          error: "Erro ao consultar " + type + ": " + error.message,
        }, 500);
      }

      return jsonResponse({
        success: true,
        type,
        count: rows.length,
        data: rows,
      });
    }

    if (type === "bi-country-options") {
      const limit = parseLimit(url.searchParams.get("limit"), 50000, 50000);
      const { rows, error } = await fetchCountryOptions(supabase, limit);

      if (error) {
        return jsonResponse({
          success: false,
          error: `Erro ao consultar ${type}: ${error.message}`,
        }, 500);
      }

      return jsonResponse({
        success: true,
        type,
        count: rows.length,
        data: rows,
      });
    }

    let query;

    if (type === "kpis") {
      query = supabase.from("vw_dashboard_kpis").select("*");
    } else if (type === "summary") {
      query = supabase.from("vw_dashboard_summary").select("*").order("total_tickets", { ascending: false });
    } else if (type === "bi-kpis") {
      query = supabase.from("vw_dashboard_bi_kpis").select("*");
    } else if (type === "bi-region-summary") {
      query = supabase.from("vw_dashboard_bi_region_summary").select("*").order("total_tickets", { ascending: false });
    } else if (type === "bi-summary") {
      query = supabase.from("vw_dashboard_bi_summary").select("*").order("total_tickets", { ascending: false });
    } else if (type === "bi-backlog-kpis") {
      query = supabase.from("vw_dashboard_bi_backlog_kpis").select("*");
    } else if (type === "bi-backlog") {
      const limit = parseLimit(url.searchParams.get("limit"), 100, 500);
      query = supabase
        .from("vw_dashboard_bi_backlog")
        .select("*")
        .order("aging_backlog_dias", { ascending: false })
        .limit(limit);
    } else if (type === "backlog") {
      const limit = parseLimit(url.searchParams.get("limit"), 50, 500);
      query = supabase
        .from("vw_backlog_operational")
        .select("*")
        .order("aging_days", { ascending: false })
        .limit(limit);
    } else if (type === "status-priority") {
      query = supabase.from("vw_status_priority_summary").select("*").order("total_tickets", { ascending: false });
    } else {
      const limit = parseLimit(url.searchParams.get("limit"), 100, 500);
      query = supabase
        .from("vw_data_quality_operational")
        .select("*")
        .order("operational_data_quality_pct", { ascending: true })
        .order("total_tickets", { ascending: false })
        .limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      return jsonResponse({
        success: false,
        error: `Erro ao consultar ${type}: ${error.message}`,
      }, 500);
    }

    const rows = Array.isArray(data) ? data : [];

    return jsonResponse({
      success: true,
      type,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";

    return jsonResponse({
      success: false,
      error: message,
    }, 500);
  }
});
