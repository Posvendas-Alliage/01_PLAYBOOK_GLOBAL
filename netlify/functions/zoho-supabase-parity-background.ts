import type { Config, Context } from "@netlify/functions";

const DEFAULT_SUPABASE_URL = "https://bryegtpdjqpwtyefoznq.supabase.co";
const DEFAULT_DEPARTMENT_IDS = [
  "1128522000000453544",
  "1128522000008788112",
  "1128522000000006907",
];
const PAGE_LIMIT = 100;
const SUPABASE_PAGE_LIMIT = 1000;
const REQUIRED_SYNC_TYPES = [
  "v1e_incremental",
  "open_tickets_sweep",
  "v1g_ticket_history_sync",
  "v1f_deletion_sweep",
];

type TicketRow = {
  id?: string;
  ticket_id?: string;
  ticket_number?: string;
  status?: string;
  status_type?: string;
  created_time?: string;
  createdTime?: string;
  closed_time?: string | null;
  closedTime?: string | null;
  last_detail_sync_at?: string | null;
  raw_metrics?: unknown;
  is_open?: boolean;
  is_closed?: boolean;
  is_weekly_report_filter_included?: boolean;
  is_sla_eligible?: boolean;
  sla_status_bi?: string;
  mtfc_horas_bi?: number | string | null;
  mtts_dias_bi?: number | string | null;
};

type PeriodBucket = {
  period: string;
  total: number;
  open: number;
  closed: number;
  missingMetrics: number;
  missingDetail: number;
  ids: Set<string>;
};

type SyncHealth = {
  syncType: string;
  lastFinishedAt: string | null;
  ageHours: number | null;
  within24h: boolean;
  status: string | null;
};

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

function optionalEnv(names: string[], fallback = ""): string {
  for (const name of names) {
    const value = env(name).trim();
    if (value) return value;
  }
  return fallback;
}

function requiredEnv(name: string): string {
  const value = env(name).trim();
  if (!value) throw new Error(`Variavel obrigatoria ausente: ${name}`);
  return value;
}

function supabaseKey(): string {
  const key = optionalEnv([
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SECRET_KEY",
    "PLAYBOOK_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
    "PLAYBOOK_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
  ]);
  if (!key) throw new Error("Configure uma chave Supabase no Netlify.");
  return key;
}

function supabaseHeaders(key: string): HeadersInit {
  const headers: Record<string, string> = {
    apikey: key,
    Accept: "application/json",
  };
  if (key.includes(".")) headers.Authorization = `Bearer ${key}`;
  return headers;
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function authOk(req: Request): boolean {
  const token = optionalEnv(["MONITOR_AUTH_TOKEN"]);
  if (!token) return true;
  return req.headers.get("Authorization") === `Bearer ${token}` ||
    req.headers.get("x-monitor-token") === token;
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function defaultSinceDate(): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - Number(optionalEnv(["MONITOR_LOOKBACK_DAYS"], "90")));
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function departmentIds(): string[] {
  const raw = optionalEnv(["ZOHO_DEPARTMENT_IDS"]);
  return raw ? raw.split(",").map((item) => item.trim()).filter(Boolean) : DEFAULT_DEPARTMENT_IDS;
}

async function fetchJson(url: URL | string, options: RequestInit = {}, label = "request", retry = 0): Promise<unknown> {
  const response = await fetch(url, options);
  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    if ((response.status === 429 || response.status >= 500) && retry < 3) {
      await new Promise((resolve) => setTimeout(resolve, (retry + 1) * 1500));
      return fetchJson(url, options, label, retry + 1);
    }
    throw new Error(`${label} falhou: HTTP ${response.status} ${typeof payload === "string" ? payload : JSON.stringify(payload)}`);
  }
  return payload;
}

async function getZohoAccessToken(): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: requiredEnv("ZOHO_CLIENT_ID"),
    client_secret: requiredEnv("ZOHO_CLIENT_SECRET"),
    refresh_token: requiredEnv("ZOHO_REFRESH_TOKEN"),
  });

  const payload = await fetchJson("https://accounts.zoho.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }, "Zoho token") as { access_token?: string };

  if (!payload.access_token) throw new Error("Zoho nao retornou access_token.");
  return payload.access_token;
}

function normalizeZohoTicket(raw: Record<string, unknown>): TicketRow {
  return {
    id: String(raw.id || "").trim(),
    ticket_number: String(raw.ticketNumber || raw.ticket_number || "").trim(),
    status: String(raw.status || "").trim(),
    status_type: String(raw.statusType || raw.status_type || "").trim(),
    created_time: String(raw.createdTime || raw.created_time || ""),
    closed_time: raw.closedTime || raw.closed_time ? String(raw.closedTime || raw.closed_time) : null,
  };
}

async function fetchZohoTickets(accessToken: string, sinceDate: Date): Promise<TicketRow[]> {
  const tickets = new Map<string, TicketRow>();
  const orgId = requiredEnv("ZOHO_ORG_ID");
  const maxPages = Number(optionalEnv(["MONITOR_MAX_ZOHO_PAGES_PER_DEPARTMENT"], "500"));

  for (const departmentId of departmentIds()) {
    for (let page = 0; page < maxPages; page += 1) {
      const url = new URL("https://desk.zoho.com/api/v1/tickets");
      url.searchParams.set("departmentId", departmentId);
      url.searchParams.set("from", String(page * PAGE_LIMIT));
      url.searchParams.set("limit", String(PAGE_LIMIT));
      url.searchParams.set("sortBy", "-createdTime");
      url.searchParams.set("fields", "id,ticketNumber,status,statusType,createdTime,closedTime,modifiedTime,departmentId");

      const payload = await fetchJson(url, {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          orgId,
        },
      }, `Zoho tickets ${departmentId} pagina ${page + 1}`) as { data?: Record<string, unknown>[] } | Record<string, unknown>[];

      const data = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : [];
      if (data.length === 0) break;

      let reachedOlder = false;
      for (const item of data) {
        const ticket = normalizeZohoTicket(item);
        const id = String(ticket.id || "");
        const created = toDate(ticket.created_time);
        if (!id) continue;
        if (created && created < sinceDate) {
          reachedOlder = true;
          continue;
        }
        tickets.set(id, ticket);
      }

      if (data.length < PAGE_LIMIT || reachedOlder) break;
    }
  }

  return Array.from(tickets.values());
}

async function fetchSupabaseRows(supabaseUrl: string, key: string, table: string, select: string, sinceDate: Date): Promise<TicketRow[]> {
  const rows: TicketRow[] = [];
  let offset = 0;
  while (true) {
    const url = new URL(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`);
    url.searchParams.set("select", select);
    url.searchParams.set("order", "created_time.desc");
    url.searchParams.set("limit", String(SUPABASE_PAGE_LIMIT));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("created_time", `gte.${sinceDate.toISOString()}`);

    const data = await fetchJson(url, { headers: supabaseHeaders(key) }, `${table} offset ${offset}`) as TicketRow[];
    if (!Array.isArray(data) || data.length === 0) break;
    rows.push(...data);
    if (data.length < SUPABASE_PAGE_LIMIT) break;
    offset += SUPABASE_PAGE_LIMIT;
  }
  return rows;
}

async function fetchSyncHealth(supabaseUrl: string, key: string): Promise<SyncHealth[]> {
  const url = new URL(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/sync_runs`);
  url.searchParams.set("select", "sync_type,status,finished_at");
  url.searchParams.set("sync_type", `in.(${REQUIRED_SYNC_TYPES.join(",")})`);
  url.searchParams.set("status", "in.(success,partial_success)");
  url.searchParams.set("order", "finished_at.desc.nullslast");
  url.searchParams.set("limit", "200");

  const data = await fetchJson(url, { headers: supabaseHeaders(key) }, "sync_runs") as Array<{
    sync_type?: string;
    status?: string;
    finished_at?: string;
  }>;

  const latestByType = new Map<string, { status?: string; finished_at?: string }>();
  for (const row of Array.isArray(data) ? data : []) {
    const type = String(row.sync_type || "");
    if (type && !latestByType.has(type)) latestByType.set(type, row);
  }

  const now = Date.now();
  return REQUIRED_SYNC_TYPES.map((type) => {
    const row = latestByType.get(type) || null;
    const finished = row ? toDate(row.finished_at) : null;
    const ageHours = finished ? (now - finished.getTime()) / 3600000 : Infinity;
    return {
      syncType: type,
      lastFinishedAt: finished ? finished.toISOString() : null,
      ageHours: Number.isFinite(ageHours) ? Number(ageHours.toFixed(2)) : null,
      within24h: Number.isFinite(ageHours) && ageHours <= 24,
      status: row ? String(row.status || "") : null,
    };
  });
}

function buildPeriodMap(rows: TicketRow[], periodFn: (date: Date) => string): Map<string, PeriodBucket> {
  const map = new Map<string, PeriodBucket>();
  for (const row of rows) {
    const date = toDate(row.created_time || row.createdTime);
    if (!date) continue;
    if (Object.prototype.hasOwnProperty.call(row, "is_weekly_report_filter_included") && row.is_weekly_report_filter_included !== true) continue;

    const key = periodFn(date);
    const item = map.get(key) || {
      period: key,
      total: 0,
      open: 0,
      closed: 0,
      missingMetrics: 0,
      missingDetail: 0,
      ids: new Set<string>(),
    };

    const status = String(row.status || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const statusType = String(row.status_type || "").toLowerCase();
    const isClosed = Object.prototype.hasOwnProperty.call(row, "is_closed")
      ? row.is_closed === true
      : Boolean(row.closed_time || row.closedTime) || statusType === "closed" || ["fechado", "closed", "resolvido", "resolved"].includes(status);
    const isOpen = Object.prototype.hasOwnProperty.call(row, "is_open") ? row.is_open === true : !isClosed;

    item.total += 1;
    item.ids.add(String(row.id || row.ticket_id || ""));
    if (isOpen) item.open += 1;
    if (isClosed) item.closed += 1;
    if (Object.prototype.hasOwnProperty.call(row, "raw_metrics") && row.raw_metrics == null) item.missingMetrics += 1;
    if (Object.prototype.hasOwnProperty.call(row, "last_detail_sync_at") && row.last_detail_sync_at == null) item.missingDetail += 1;
    map.set(key, item);
  }
  return map;
}

function recentKeys(a: Map<string, PeriodBucket>, b: Map<string, PeriodBucket>, limit: number): string[] {
  return Array.from(new Set([...a.keys(), ...b.keys()])).sort().reverse().slice(0, limit).reverse();
}

function comparePeriods(zohoMap: Map<string, PeriodBucket>, supabaseMap: Map<string, PeriodBucket>, limit: number, tolerance: number) {
  return recentKeys(zohoMap, supabaseMap, limit).map((key) => {
    const z = zohoMap.get(key) || { total: 0, open: 0, closed: 0, missingMetrics: 0, missingDetail: 0, ids: new Set<string>() };
    const s = supabaseMap.get(key) || { total: 0, open: 0, closed: 0, missingMetrics: 0, missingDetail: 0, ids: new Set<string>() };
    const diffTotal = s.total - z.total;
    const diffOpen = s.open - z.open;
    const diffClosed = s.closed - z.closed;
    return {
      period: key,
      zohoTotal: z.total,
      supabaseTotal: s.total,
      diffTotal,
      zohoOpen: z.open,
      supabaseOpen: s.open,
      diffOpen,
      zohoClosed: z.closed,
      supabaseClosed: s.closed,
      diffClosed,
      supabaseMissingMetrics: s.missingMetrics,
      supabaseMissingDetail: s.missingDetail,
      ok: Math.abs(diffTotal) <= tolerance && Math.abs(diffOpen) <= tolerance && Math.abs(diffClosed) <= tolerance,
    };
  });
}

async function insertMonitorRun(supabaseUrl: string, key: string, payload: Record<string, unknown>): Promise<void> {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/sync_runs`, {
    method: "POST",
    headers: {
      ...supabaseHeaders(key),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Falha ao gravar sync_runs do monitor: HTTP ${response.status} ${await response.text()}`);
  }
}

async function runMonitor() {
  const startedAt = new Date();
  const supabaseUrl = optionalEnv(["PLAYBOOK_SUPABASE_URL", "SUPABASE_URL"], DEFAULT_SUPABASE_URL);
  const key = supabaseKey();
  const sinceDate = optionalEnv(["MONITOR_SINCE"])
    ? new Date(`${optionalEnv(["MONITOR_SINCE"])}T00:00:00.000Z`)
    : defaultSinceDate();
  const tolerance = Number(optionalEnv(["MONITOR_COUNT_TOLERANCE"], "0"));
  const weeks = Number(optionalEnv(["MONITOR_WEEKS"], "12"));
  const months = Number(optionalEnv(["MONITOR_MONTHS"], "6"));

  const accessToken = await getZohoAccessToken();
  const zohoRows = await fetchZohoTickets(accessToken, sinceDate);
  const supabaseRows = await fetchSupabaseRows(
    supabaseUrl,
    key,
    "zoho_tickets",
    "id,ticket_number,status,status_type,created_time,closed_time,last_detail_sync_at,raw_metrics",
    sinceDate,
  );
  const officialRows = await fetchSupabaseRows(
    supabaseUrl,
    key,
    "vw_tickets_bi_base",
    "ticket_id,ticket_number,created_time,closed_time,is_weekly_report_filter_included,is_open,is_closed,is_sla_eligible,sla_status_bi,mtfc_horas_bi,mtts_dias_bi",
    sinceDate,
  );
  const syncHealth = await fetchSyncHealth(supabaseUrl, key);

  const weekly = comparePeriods(buildPeriodMap(zohoRows, isoWeekKey), buildPeriodMap(supabaseRows, isoWeekKey), weeks, tolerance);
  const monthly = comparePeriods(buildPeriodMap(zohoRows, monthKey), buildPeriodMap(supabaseRows, monthKey), months, tolerance);
  const officialWeekly = Array.from(buildPeriodMap(officialRows, isoWeekKey).values()).sort((a, b) => a.period.localeCompare(b.period)).slice(-weeks);
  const officialMonthly = Array.from(buildPeriodMap(officialRows, monthKey).values()).sort((a, b) => a.period.localeCompare(b.period)).slice(-months);
  const staleSync = syncHealth.filter((row) => !row.within24h);
  const missingMetrics = supabaseRows.filter((row) => row.raw_metrics == null).length;
  const missingDetail = supabaseRows.filter((row) => row.last_detail_sync_at == null).length;
  const divergentWeekly = weekly.filter((row) => !row.ok);
  const divergentMonthly = monthly.filter((row) => !row.ok);

  const ok = divergentWeekly.length === 0 &&
    divergentMonthly.length === 0 &&
    staleSync.length === 0 &&
    missingMetrics === 0 &&
    missingDetail === 0;

  const finishedAt = new Date();
  const report = {
    generatedAt: finishedAt.toISOString(),
    ok,
    config: {
      supabaseUrl,
      since: isoDate(sinceDate),
      weeks,
      months,
      tolerance,
    },
    summary: {
      zohoTickets: zohoRows.length,
      supabaseTickets: supabaseRows.length,
      missingMetrics,
      missingDetail,
      divergentWeeks: divergentWeekly.map((row) => row.period),
      divergentMonths: divergentMonthly.map((row) => row.period),
      staleSyncTypes: staleSync.map((row) => row.syncType),
    },
    weekly,
    monthly,
    officialWeekly: officialWeekly.map(({ ids, ...row }) => row),
    officialMonthly: officialMonthly.map(({ ids, ...row }) => row),
    syncHealth,
  };

  await insertMonitorRun(supabaseUrl, key, {
    source: "netlify",
    sync_type: "netlify_parity_monitor",
    started_at: startedAt.toISOString(),
    finished_at: finishedAt.toISOString(),
    status: ok ? "success" : "partial_success",
    health_status: ok ? "healthy" : "divergent",
    total_records: zohoRows.length,
    success_records: ok ? zohoRows.length : Math.max(0, zohoRows.length - divergentWeekly.length - divergentMonthly.length),
    error_records: ok ? 0 : 1,
    message: ok ? "Zoho x Supabase parity OK" : "Zoho x Supabase parity divergente",
    function_name: "zoho-supabase-parity-background",
    function_version: "netlify-v1",
    observations: JSON.stringify(report).slice(0, 12000),
    duration_ms: finishedAt.getTime() - startedAt.getTime(),
    warnings_count: divergentWeekly.length + divergentMonthly.length + staleSync.length + missingMetrics + missingDetail,
  });

  return report;
}

export default async (req: Request, _context: Context) => {
  if (!authOk(req)) return json({ success: false, error: "Nao autorizado." }, 401);
  if (req.method !== "POST") return json({ success: false, error: "Metodo nao permitido." }, 405);

  try {
    const report = await runMonitor();
    console.log("zoho-supabase-parity", JSON.stringify(report.summary));
    return json({ success: true, ok: report.ok, summary: report.summary }, report.ok ? 200 : 202);
  } catch (error) {
    console.error("zoho-supabase-parity erro", error);
    return json({ success: false, error: error instanceof Error ? error.message : String(error) }, 500);
  }
};

export const config: Config = {};
