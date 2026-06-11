import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const SOURCE = "zoho_desk";
const FUNCTION_NAME = "sync-ticket-status-history";
const FUNCTION_CODE_VERSION = "2026-06-09-v1-status-history-only";
const STATUS_HISTORY_SYNC_TYPE = "v1h_status_history_only";
const ZOHO_TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token";
const ZOHO_TICKETS_URL = "https://desk.zoho.com/api/v1/tickets";
const TICKET_HISTORY_PAGE_LIMIT = 50;
const MAX_TICKET_HISTORY_PAGES = 10;
const DEFAULT_MAX_TICKETS = 100;
const MAX_TICKETS = 250;
const DEFAULT_LOOKBACK_HOURS = 24;
const DEFAULT_MAX_RUNTIME_SECONDS = 110;
const MAX_RUNTIME_SECONDS = 125;
const RUNTIME_SAFETY_MARGIN_MS = 8_000;
const USED_DEPARTMENT_IDS = [
  "1128522000000453544",
  "1128522000000006907",
] as const;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type JsonRecord = Record<string, unknown>;
type SupabaseCallResult<TData = unknown> = {
  data?: TData | null;
  error?: {
    message?: string;
  } | null;
};
type SyncMode = "backlog" | "recent" | "all";
type SyncParams = {
  syncMode: SyncMode;
  maxTickets: number;
  startOffset: number;
  dryRun: boolean;
  lookbackHours: number;
  maxRuntimeSeconds: number;
  ticketIds: string[];
};
type TicketRow = {
  id: string;
  ticket_number?: string | null;
  status?: string | null;
  created_time?: string | null;
  closed_time?: string | null;
  regiao?: string | null;
  modified_time?: string | null;
};
type StatusChangeDraft = {
  ticket_id: string;
  event_id: string;
  event_time: string;
  previous_status: string | null;
  new_status: string;
  actor_id: string | null;
  actor_name: string | null;
  actor_email: string | null;
  source_event_type: string | null;
  source_field_name: string;
  raw_event: JsonRecord;
  synced_at: string;
};

function toText(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }

  return null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toBool(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y", "sim"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "n", "nao"].includes(normalized)) {
      return false;
    }
  }

  return null;
}

function asRecord(value: unknown): JsonRecord {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonRecord;
  }

  return {};
}

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  }

  return value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function supabaseErrorMessage(result: SupabaseCallResult | undefined, fallback: string): string {
  return result?.error?.message ?? fallback;
}

function functionVersion(): string {
  return Deno.env.get("DENO_DEPLOYMENT_ID") ?? FUNCTION_CODE_VERSION;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readRequestBody(req: Request): Promise<JsonRecord> {
  const bodyText = await req.text();
  if (!bodyText.trim()) {
    return {};
  }

  const parsed = JSON.parse(bodyText) as unknown;
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Body JSON deve ser um objeto");
  }

  return parsed as JsonRecord;
}

function normalizeParams(body: JsonRecord): SyncParams {
  const requestedSyncMode = toText(body.syncMode ?? body.sync_mode)?.trim().toLowerCase();
  const syncMode: SyncMode = requestedSyncMode === "all"
    ? "all"
    : requestedSyncMode === "recent"
    ? "recent"
    : "backlog";
  const rawMaxTickets = toNumber(body.maxTickets ?? body.max_tickets);
  const rawStartOffset = toNumber(body.startOffset ?? body.start_offset);
  const rawLookbackHours = toNumber(body.lookbackHours ?? body.lookback_hours);
  const rawMaxRuntimeSeconds = toNumber(body.maxRuntimeSeconds ?? body.max_runtime_seconds);
  const rawTicketIds = Array.isArray(body.ticketIds ?? body.ticket_ids) ? body.ticketIds ?? body.ticket_ids : [];

  return {
    syncMode,
    maxTickets: Math.min(
      rawMaxTickets === null ? DEFAULT_MAX_TICKETS : Math.max(1, Math.trunc(rawMaxTickets)),
      MAX_TICKETS,
    ),
    startOffset: rawStartOffset === null ? 0 : Math.max(0, Math.trunc(rawStartOffset)),
    dryRun: toBool(body.dryRun ?? body.dry_run) ?? false,
    lookbackHours: rawLookbackHours === null ? DEFAULT_LOOKBACK_HOURS : Math.max(1, Math.trunc(rawLookbackHours)),
    maxRuntimeSeconds: Math.min(
      rawMaxRuntimeSeconds === null ? DEFAULT_MAX_RUNTIME_SECONDS : Math.max(1, Math.trunc(rawMaxRuntimeSeconds)),
      MAX_RUNTIME_SECONDS,
    ),
    ticketIds: rawTicketIds.map((item) => toText(item)).filter((item): item is string => Boolean(item)),
  };
}

async function getZohoAccessToken(attempt = 1): Promise<string> {
  const body = new URLSearchParams({
    client_id: getRequiredEnv("ZOHO_CLIENT_ID"),
    client_secret: getRequiredEnv("ZOHO_CLIENT_SECRET"),
    refresh_token: getRequiredEnv("ZOHO_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  });

  const response = await fetch(ZOHO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const responseText = await response.text();
  let payload: JsonRecord = {};
  try {
    payload = JSON.parse(responseText) as JsonRecord;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const details = toText(payload.error_description) ?? toText(payload.error) ?? responseText;
    if (response.status === 400 && details.toLowerCase().includes("too many requests") && attempt < 4) {
      await sleep(5_000 * attempt);
      return getZohoAccessToken(attempt + 1);
    }

    throw new Error(`Falha ao gerar access token Zoho: ${response.status} ${details}`);
  }

  const accessToken = toText(payload.access_token);
  if (!accessToken) {
    throw new Error("Resposta do Zoho nao retornou access_token");
  }

  return accessToken;
}

async function fetchTicketHistory(accessToken: string, ticketId: string): Promise<JsonRecord[]> {
  const fetchHistoryPage = async (pageFrom: number, filterByStatus: boolean): Promise<JsonRecord[]> => {
    const url = new URL(`${ZOHO_TICKETS_URL}/${encodeURIComponent(ticketId)}/History`);
    url.searchParams.set("limit", String(TICKET_HISTORY_PAGE_LIMIT));
    url.searchParams.set("from", String(pageFrom));
    if (filterByStatus) {
      url.searchParams.set("fieldName", "status");
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        orgId: getRequiredEnv("ZOHO_ORG_ID"),
      },
    });

    const responseText = await response.text();
    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`fetchTicketHistory ${ticketId}: ${response.status} ${responseText.slice(0, 200)}`);
    }

    let payload: unknown = {};
    try {
      payload = JSON.parse(responseText) as unknown;
    } catch {
      payload = {};
    }

    const payloadRecord = asRecord(payload);
    const data = payloadRecord.data;
    if (Array.isArray(data)) {
      return data.filter((item): item is JsonRecord =>
        item !== null && typeof item === "object" && !Array.isArray(item)
      );
    }

    if (Array.isArray(payload)) {
      return payload.filter((item): item is JsonRecord =>
        item !== null && typeof item === "object" && !Array.isArray(item)
      );
    }

    return [];
  };

  const fetchHistoryPages = async (filterByStatus: boolean): Promise<JsonRecord[]> => {
    const allEvents: JsonRecord[] = [];
    for (let pageIndex = 0; pageIndex < MAX_TICKET_HISTORY_PAGES; pageIndex += 1) {
      const pageEvents = await fetchHistoryPage(pageIndex * TICKET_HISTORY_PAGE_LIMIT, filterByStatus);
      allEvents.push(...pageEvents);
      if (pageEvents.length < TICKET_HISTORY_PAGE_LIMIT) {
        break;
      }
    }

    return allEvents;
  };

  const filteredEvents = await fetchHistoryPages(true);
  if (filteredEvents.length > 0) {
    return filteredEvents;
  }

  return fetchHistoryPages(false);
}

function toIsoDateText(value: unknown): string | null {
  const text = toText(value);
  if (!text) {
    return null;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseStatusValue(value: unknown): { previousStatus: string | null; newStatus: string | null } {
  if (typeof value === "string") {
    return { previousStatus: null, newStatus: value };
  }

  const record = asRecord(value);
  return {
    previousStatus: toText(record.previousValue ?? record.oldValue ?? record.from),
    newStatus: toText(record.updatedValue ?? record.newValue ?? record.to ?? record.value),
  };
}

function parseHistoryEvents(ticketId: string, events: JsonRecord[]): JsonRecord[] {
  const now = new Date().toISOString();
  const drafts: StatusChangeDraft[] = [];
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(toText(a.eventTime) ?? "").getTime();
    const timeB = new Date(toText(b.eventTime) ?? "").getTime();
    return (Number.isFinite(timeA) ? timeA : 0) - (Number.isFinite(timeB) ? timeB : 0);
  });

  sortedEvents.forEach((event) => {
    const eventTime = toIsoDateText(event.eventTime);
    if (!eventTime) {
      return;
    }

    const actor = asRecord(event.actor);
    const eventName = toText(event.eventName);
    const eventInfo = Array.isArray(event.eventInfo)
      ? event.eventInfo.filter((item): item is JsonRecord =>
        item !== null && typeof item === "object" && !Array.isArray(item)
      )
      : [];

    eventInfo.forEach((info) => {
      const propertyName = toText(info.propertyName);
      if (propertyName?.trim().toLowerCase() !== "status") {
        return;
      }

      const { previousStatus, newStatus } = parseStatusValue(info.propertyValue);
      if (!newStatus) {
        return;
      }

      const eventId = `${ticketId}_${eventTime.replace(/[^0-9]/g, "")}_${newStatus.replace(/\s/g, "_")}`;
      drafts.push({
        ticket_id: ticketId,
        event_id: eventId,
        event_time: eventTime,
        previous_status: previousStatus,
        new_status: newStatus,
        actor_id: toText(actor.id),
        actor_name: toText(actor.name),
        actor_email: toText(actor.email),
        source_event_type: eventName,
        source_field_name: "status",
        raw_event: event,
        synced_at: now,
      });
    });
  });

  const uniqueDraftsByEventId = new Map<string, StatusChangeDraft>();
  for (const draft of drafts) {
    uniqueDraftsByEventId.set(`${ticketId}:${draft.event_id}`, draft);
  }

  const uniqueDrafts = Array.from(uniqueDraftsByEventId.values()).sort((a, b) =>
    new Date(a.event_time).getTime() - new Date(b.event_time).getTime()
  );

  return uniqueDrafts.map((draft, index) => {
    const nextDraft = uniqueDrafts[index + 1];
    const nextEventTime = nextDraft?.event_time ?? null;
    let timeInPreviousStatusHours: number | null = null;
    let timeInPreviousStatusMinutes: number | null = null;

    if (nextEventTime) {
      const diffMs = new Date(nextEventTime).getTime() - new Date(draft.event_time).getTime();
      if (Number.isFinite(diffMs) && diffMs > 0) {
        timeInPreviousStatusHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
        timeInPreviousStatusMinutes = Math.round(diffMs / (1000 * 60));
      }
    }

    return {
      ...draft,
      next_event_time: nextEventTime,
      time_in_previous_status_hours: timeInPreviousStatusHours,
      time_in_previous_status_minutes: timeInPreviousStatusMinutes,
    };
  });
}

function createServiceClient(): SupabaseClient {
  return createClient(
    getRequiredEnv("SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

async function createSyncRun(supabase: SupabaseClient, params: SyncParams): Promise<number> {
  const result = await supabase
    .from("sync_runs")
    .insert({
      source: SOURCE,
      sync_type: STATUS_HISTORY_SYNC_TYPE,
      status: "running",
      started_at: new Date().toISOString(),
      message: `Status history sync iniciado (mode=${params.syncMode})`,
      function_name: FUNCTION_NAME,
      function_version: functionVersion(),
      total_records: params.maxTickets,
      batch_size: params.maxTickets,
      execution_id: crypto.randomUUID(),
      observations: `status_history_only=true; sync_mode=${params.syncMode}; dry_run=${params.dryRun}`,
    })
    .select("id")
    .single() as SupabaseCallResult<{ id: number }> | undefined;

  if (!result || result.error || !result.data?.id) {
    throw new Error(`Falha ao criar sync_run: ${supabaseErrorMessage(result, "retorno vazio")}`);
  }

  return result.data.id;
}

async function finishSyncRun(
  supabase: SupabaseClient,
  runId: number,
  status: "success" | "partial_success" | "error",
  startedAt: number,
  summary: {
    ticketsPlanned: number;
    ticketsProcessed: number;
    ticketsSucceeded: number;
    ticketsFailed: number;
    eventsFetched: number;
    statusEventsParsed: number;
    statusEventsUpdated: number;
    stoppedByRuntimeGuard: boolean;
    observations: string;
  },
): Promise<void> {
  const durationMs = Date.now() - startedAt;
  const result = await supabase
    .from("sync_runs")
    .update({
      finished_at: new Date().toISOString(),
      status,
      total_records: summary.ticketsPlanned,
      success_records: summary.ticketsSucceeded,
      error_records: summary.ticketsFailed,
      tickets_processed: summary.ticketsProcessed,
      tickets_updated: summary.ticketsSucceeded,
      tickets_failed: summary.ticketsFailed,
      tickets_pending: summary.stoppedByRuntimeGuard
        ? Math.max(0, summary.ticketsPlanned - summary.ticketsProcessed)
        : 0,
      metrics_fetched: summary.statusEventsParsed,
      metrics_updated: summary.statusEventsUpdated,
      has_more: summary.stoppedByRuntimeGuard || summary.ticketsProcessed === summary.ticketsPlanned,
      duration_ms: durationMs,
      duration_seconds: Math.round(durationMs / 1000),
      health_status: status === "success" ? "SUCCESS" : status === "partial_success" ? "WARNING" : "FAILED",
      message: "Status history sync finalizado",
      observations: summary.observations,
    })
    .eq("id", runId) as SupabaseCallResult | undefined;

  if (!result || result.error) {
    throw new Error(`Falha ao finalizar sync_run ${runId}: ${supabaseErrorMessage(result, "retorno vazio")}`);
  }
}

async function logError(
  supabase: SupabaseClient,
  runId: number,
  ticketId: string,
  ticketNumber: string | null,
  error: unknown,
): Promise<void> {
  await supabase
    .from("sync_errors")
    .insert({
      run_id: runId,
      source: SOURCE,
      sync_type: STATUS_HISTORY_SYNC_TYPE,
      entity_type: "ticket_status_history",
      entity_id: ticketId,
      ticket_id: ticketId,
      endpoint: `/api/v1/tickets/${ticketId}/history`,
      error_message: errorMessage(error),
      raw_error: { ticket_id: ticketId, ticket_number: ticketNumber },
      operation: "sync_ticket_status_history",
      error_type: "application_error",
      retryable: false,
    });
}

async function fetchTickets(supabase: SupabaseClient, params: SyncParams): Promise<TicketRow[]> {
  if (params.ticketIds.length > 0) {
    const result = await supabase
      .from("zoho_tickets")
      .select("id,ticket_number,status,created_time,closed_time,regiao,modified_time")
      .in("id", params.ticketIds)
      .eq("is_deleted", false) as SupabaseCallResult<TicketRow[]> | undefined;

    if (!result || result.error) {
      throw new Error(`Falha ao buscar tickets por id: ${supabaseErrorMessage(result, "retorno vazio")}`);
    }

    return Array.isArray(result.data) ? result.data : [];
  }

  if (params.syncMode === "backlog") {
    const result = await supabase
      .from("vw_ticket_history_sync_backlog")
      .select("id,ticket_number,status,created_time,closed_time,regiao,modified_time")
      .order("sync_priority", { ascending: true })
      .order("modified_time", { ascending: false, nullsFirst: false })
      .range(params.startOffset, params.startOffset + params.maxTickets - 1) as
        SupabaseCallResult<TicketRow[]> | undefined;

    if (!result || result.error) {
      throw new Error(`Falha ao buscar backlog de historico: ${supabaseErrorMessage(result, "retorno vazio")}`);
    }

    return Array.isArray(result.data) ? result.data : [];
  }

  let query = supabase
    .from("zoho_tickets")
    .select("id,ticket_number,status,created_time,closed_time,regiao,modified_time")
    .eq("is_deleted", false)
    .in("department_id", [...USED_DEPARTMENT_IDS])
    .order("modified_time", { ascending: false })
    .range(params.startOffset, params.startOffset + params.maxTickets - 1);

  if (params.syncMode === "recent") {
    const sinceDate = new Date(Date.now() - params.lookbackHours * 60 * 60 * 1000).toISOString();
    query = query.gte("modified_time", sinceDate);
  }

  const result = await query as SupabaseCallResult<TicketRow[]> | undefined;
  if (!result || result.error) {
    throw new Error(`Falha ao buscar tickets: ${supabaseErrorMessage(result, "retorno vazio")}`);
  }

  return Array.isArray(result.data) ? result.data : [];
}

async function markTicketStatusHistorySynced(
  supabase: SupabaseClient,
  ticketId: string,
  statusEventCount: number,
): Promise<void> {
  const result = await supabase
    .from("zoho_tickets")
    .update({
      last_status_history_sync_at: new Date().toISOString(),
      status_history_event_count: statusEventCount,
    })
    .eq("id", ticketId) as SupabaseCallResult | undefined;

  if (!result || result.error) {
    throw new Error(`Falha ao marcar status history sync do ticket ${ticketId}: ${supabaseErrorMessage(result, "retorno vazio")}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Metodo nao permitido. Use POST ou OPTIONS." }, 405);
  }

  const startedAt = Date.now();
  let supabase: SupabaseClient | null = null;
  let syncRunId: number | null = null;

  try {
    const body = await readRequestBody(req);
    const params = normalizeParams(body);
    supabase = createServiceClient();
    syncRunId = await createSyncRun(supabase, params);

    const tickets = await fetchTickets(supabase, params);
    const accessToken = await getZohoAccessToken();
    const failedTickets: string[] = [];
    let ticketsProcessed = 0;
    let ticketsSucceeded = 0;
    let eventsFetched = 0;
    let statusEventsParsed = 0;
    let statusEventsUpdated = 0;
    let stoppedByRuntimeGuard = false;

    for (const ticket of tickets) {
      if (Date.now() - startedAt > params.maxRuntimeSeconds * 1000 - RUNTIME_SAFETY_MARGIN_MS) {
        stoppedByRuntimeGuard = true;
        break;
      }

      const ticketId = toText(ticket.id);
      const ticketNumber = toText(ticket.ticket_number);
      if (!ticketId) {
        continue;
      }

      ticketsProcessed += 1;

      try {
        const events = await fetchTicketHistory(accessToken, ticketId);
        const rows = parseHistoryEvents(ticketId, events);
        eventsFetched += events.length;
        statusEventsParsed += rows.length;

        if (!params.dryRun) {
          if (rows.length > 0) {
            const upsertResult = await supabase
              .from("zoho_ticket_status_history")
              .upsert(rows, { onConflict: "ticket_id,event_id" }) as SupabaseCallResult | undefined;

            if (!upsertResult || upsertResult.error) {
              throw new Error(
                `Falha no upsert historico ticket ${ticketNumber ?? ticketId}: ${
                  supabaseErrorMessage(upsertResult, "retorno vazio")
                }`,
              );
            }
          }

          await markTicketStatusHistorySynced(supabase, ticketId, rows.length);
          statusEventsUpdated += rows.length;
        }

        ticketsSucceeded += 1;
      } catch (error) {
        failedTickets.push(ticketNumber ?? ticketId);
        await logError(supabase, syncRunId, ticketId, ticketNumber, error);
      }

      await sleep(150);
    }

    const status = failedTickets.length > 0 || stoppedByRuntimeGuard ? "partial_success" : "success";
    const observations = [
      "status_history_only=true",
      `sync_mode=${params.syncMode}`,
      `start_offset=${params.startOffset}`,
      `dry_run=${params.dryRun}`,
      `tickets_processed=${ticketsProcessed}`,
      `events_fetched=${eventsFetched}`,
      `status_events_parsed=${statusEventsParsed}`,
      `status_events_updated=${statusEventsUpdated}`,
      `errors=${failedTickets.length}`,
      stoppedByRuntimeGuard ? "runtime_guard=true" : "runtime_guard=false",
      failedTickets.length > 0 ? `failed=${failedTickets.slice(0, 10).join(",")}` : "",
    ].filter(Boolean).join("; ");

    await finishSyncRun(supabase, syncRunId, status, startedAt, {
      ticketsPlanned: tickets.length,
      ticketsProcessed,
      ticketsSucceeded,
      ticketsFailed: failedTickets.length,
      eventsFetched,
      statusEventsParsed,
      statusEventsUpdated: params.dryRun ? 0 : statusEventsUpdated,
      stoppedByRuntimeGuard,
      observations,
    });

    return jsonResponse({
      success: status === "success",
      status,
      mode: params.syncMode,
      sync_run_id: syncRunId,
      dry_run: params.dryRun,
      start_offset: params.startOffset,
      tickets_planned: tickets.length,
      tickets_processed: ticketsProcessed,
      tickets_succeeded: ticketsSucceeded,
      tickets_failed: failedTickets.length,
      events_fetched: eventsFetched,
      status_events_parsed: statusEventsParsed,
      status_events_updated: params.dryRun ? 0 : statusEventsUpdated,
      failed_tickets: failedTickets,
      runtime_guard: stoppedByRuntimeGuard,
      function_version: functionVersion(),
    });
  } catch (error) {
    if (supabase && syncRunId !== null) {
      try {
        await finishSyncRun(supabase, syncRunId, "error", startedAt, {
          ticketsPlanned: 0,
          ticketsProcessed: 0,
          ticketsSucceeded: 0,
          ticketsFailed: 1,
          eventsFetched: 0,
          statusEventsParsed: 0,
          statusEventsUpdated: 0,
          stoppedByRuntimeGuard: false,
          observations: `status_history_only=true; fatal_error=${errorMessage(error)}`,
        });
      } catch (finishError) {
        console.error("Falha ao finalizar sync_run com erro", errorMessage(finishError));
      }
    }

    return jsonResponse({ success: false, status: "error", error: errorMessage(error) }, 500);
  }
});
