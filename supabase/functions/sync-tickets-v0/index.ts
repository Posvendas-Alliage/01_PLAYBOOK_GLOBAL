import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const SOURCE = "zoho_desk";
const HISTORICAL_WINDOW_LOAD_STRATEGY = "v1b_tickets_basic_historical_window";
const BACKFILL_LOAD_STRATEGY = "v1b_tickets_basic_backfill";
const DEPARTMENTS_LOAD_STRATEGY = "v1b_departments";
const AGENTS_LOAD_STRATEGY = "v1b_agents";
const CONTACTS_LOAD_STRATEGY = "v1b_contacts";
const ZOHO_TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token";
const ZOHO_TICKETS_URL = "https://desk.zoho.com/api/v1/tickets";
const ZOHO_DEPARTMENTS_URL = "https://desk.zoho.com/api/v1/departments";
const ZOHO_DEPARTMENTS_ENDPOINT = "/api/v1/departments";
const ZOHO_AGENTS_URL = "https://desk.zoho.com/api/v1/agents";
const ZOHO_AGENTS_ENDPOINT = "/api/v1/agents";
const ZOHO_CONTACTS_URL = "https://desk.zoho.com/api/v1/contacts";
const ZOHO_CONTACTS_ENDPOINT = "/api/v1/contacts";
const PAGE_LIMIT = 100;
const DEFAULT_START_DATE = "2026-01-01";
const DEFAULT_MAX_PAGES_PER_DEPARTMENT = 100;
const DEFAULT_BACKFILL_MAX_PAGES = 50;
const DEFAULT_CONTACTS_MAX_PAGES = 10;
const FUNCTION_NAME = "sync-tickets-v0";
const FUNCTION_CODE_VERSION = "2026-06-08-v36d-ignore-workshop-in-sweeps";
const ZOHO_FETCH_MAX_ATTEMPTS = 3;
const ZOHO_FETCH_BASE_BACKOFF_MS = 750;
const DEFAULT_MAX_RUNTIME_SECONDS = 110;
const MAX_RUNTIME_SECONDS = 125;
const RUNTIME_SAFETY_MARGIN_MS = 8_000;
const OPTIONAL_SWEEP_MIN_REMAINING_MS = 20_000;
const DEFAULT_SWEEP_BATCH_SIZE = 25;
const MAX_SWEEP_BATCH_SIZE = 50;
const DEFAULT_SWEEP_MAX_BATCHES = 2;
const MAX_SWEEP_MAX_BATCHES = 10;
const STALE_RUNNING_MINUTES = 30;
const INCREMENTAL_CHECKPOINT_OVERLAP_MINUTES = 30;

// ─────────────────────────────────────────────────────
// DELETION_SWEEP
// Verifica tickets suspeitos de deletados no Zoho.
// Critério: abertos no Supabase, sem modificação há N dias.
// Custo: 1 chamada API por ticket. Máx 200 tickets por run.
// Cron recomendado: 1x por semana (segunda-feira 06:00 UTC).
// Validado em 02/jun/2026: detectou #221072, #222036, #236724
// como fantasmas e 6 tickets de teste.
// ─────────────────────────────────────────────────────
const DELETION_SWEEP_LOAD_STRATEGY = "v1f_deletion_sweep";
const DEFAULT_DELETION_SWEEP_MAX_TICKETS = 50;
const MAX_DELETION_SWEEP_MAX_TICKETS = 200;
const DEFAULT_DELETION_SWEEP_STALE_DAYS = 30;
const MIN_DELETION_SWEEP_STALE_DAYS = 7;
const TICKET_HISTORY_LOAD_STRATEGY = "v1g_ticket_history_sync";
const DEFAULT_HISTORY_MAX_TICKETS = 100;
const MAX_HISTORY_MAX_TICKETS = 500;
const HISTORY_STALE_DAYS = 1;
const TICKET_HISTORY_PAGE_LIMIT = 50;
const MAX_TICKET_HISTORY_PAGES = 10;
const WORKSHOP_DEPARTMENT_ID = "1128522000008788112";

const DEPARTMENT_IDS = [
  "1128522000000453544",
  "1128522000008788112",
  "1128522000000006907",
] as const;

type JsonRecord = Record<string, unknown>;
type ZohoTicket = JsonRecord;
type ZohoDepartment = JsonRecord;
type ZohoAgent = JsonRecord;
type ZohoContact = JsonRecord;

type DepartmentResult = {
  department_id: string;
  fetched_records: number;
  accepted_records: number;
  duplicate_records: number;
  ignored_outside_window_records: number;
  pages_read: number;
  error?: string;
};

type SyncStatus = "running" | "success" | "partial_success" | "error";

type SyncSummary = {
  totalRecords: number;
  successRecords: number;
  errorRecords: number;
  ticketsFetched?: number;
  ticketsInserted?: number;
  ticketsUpdated?: number;
  ticketsDeleted?: number;
  ticketsIgnored?: number;
  metricsFetched?: number;
  metricsUpdated?: number;
  retryableErrors?: number;
  nonRetryableErrors?: number;
  batchSize?: number;
  maxBatches?: number;
  batchesProcessed?: number;
  ticketsPlanned?: number;
  ticketsProcessed?: number;
  ticketsFailed?: number;
  ticketsPending?: number;
  hasMore?: boolean;
  nextCursor?: string | null;
  openTicketsTotal?: number | null;
  openTicketsChecked?: number;
  openTicketsPending?: number | null;
  warningsCount?: number;
  observations?: string;
};

type HealthStatus = "SUCCESS" | "WARNING" | "FAILED";

type ValidationSnapshot = {
  rawMetricsMissing: number | null;
  closedRawMetricsMissing: number | null;
  currentMonthClosedRawMetricsMissing: number | null;
  reportPeriodClosedWithoutMtfc: number | null;
  openStaleTickets: number | null;
  assignedWithoutAgentEmail: number | null;
  closedStatusWithoutClosedTime: number | null;
  duplicateTicketIds: number | null;
  ticketsWithoutRegion: number | null;
  ticketsWithoutOperationalGroup: number | null;
};

type FetchJsonResult = {
  payload: unknown;
  status: number;
  responseText: string;
};

type SupabaseCallResult<TData = unknown> = {
  data?: TData | null;
  error?: {
    message?: string;
  } | null;
};

type DateWindow = {
  startDate: string;
  endDate: string;
  startDateInclusive: Date;
  endDateExclusive: Date;
  maxPagesPerDepartment: number;
};

type BackfillParams = {
  departmentId: string;
  startOffset: number;
  maxPages: number;
};

type ContactsParams = {
  startOffset: number;
  maxPages: number;
};

type IncrementalParams = {
  lookbackHours: number;
  maxPages: number;
  includeDetails: boolean;
  includeMetrics: boolean;
  includeOpenTicketSweep: boolean;
  openTicketSweepMaxTickets: number;
  includeMissingMetricsSweep: boolean;
  missingMetricsSweepMaxTickets: number;
  batchSize: number;
  maxBatches: number;
  maxRuntimeSeconds: number;
  cursor: string | null;
  dryRun: boolean;
};

type IncrementalWindow = {
  fromDateTime: Date;
  toDateTime: Date;
  source: "lookback" | "checkpoint" | "lookback_and_checkpoint" | "gap_repair";
  checkpointRunId: string | null;
  checkpointToDateTime: string | null;
  cappedByMaxLookback: boolean;
};

class BadRequestError extends Error {
  status = 400;
}

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

  if (Array.isArray(value)) {
    const parts = value.map((item) => toText(item)).filter((item): item is string => item !== null);
    return parts.length > 0 ? parts.join(", ") : null;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toDate(value: unknown): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toBool(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }
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
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
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

function isRetryableHttpStatus(status: number | null): boolean {
  return status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function httpStatusFromError(error: unknown): number | null {
  if (error instanceof ZohoTicketDetailFetchError || error instanceof ZohoTicketMetricsFetchError) {
    return error.httpStatus;
  }

  return null;
}

function isRetryableError(error: unknown): boolean {
  const status = httpStatusFromError(error);
  if (status !== null) {
    return isRetryableHttpStatus(status);
  }

  return error instanceof TypeError;
}

function errorType(error: unknown): string {
  const status = httpStatusFromError(error);
  if (status === 401 || status === 403) {
    return "auth_or_permission";
  }

  if (status === 404) {
    return "not_found";
  }

  if (status === 429) {
    return "rate_limit";
  }

  if (isRetryableHttpStatus(status)) {
    return "temporary_http_error";
  }

  if (error instanceof SyntaxError) {
    return "parsing_error";
  }

  if (error instanceof TypeError) {
    return "network_error";
  }

  return "application_error";
}

function summarizePayload(payload: unknown): JsonRecord {
  const text = toText(payload) ?? "";
  return {
    type: payload === null ? "null" : Array.isArray(payload) ? "array" : typeof payload,
    preview: text.length > 500 ? `${text.slice(0, 500)}...` : text,
  };
}

function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDateOnly(value: string, fieldName: string): Date {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new Error(`${fieldName} deve estar no formato YYYY-MM-DD`);
  }

  const date = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || formatDateOnly(date) !== trimmed) {
    throw new Error(`${fieldName} invalida`);
  }

  return date;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date.getTime());
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function normalizeMaxPages(value: unknown): number {
  if (value === null || value === undefined || value === "") {
    return DEFAULT_MAX_PAGES_PER_DEPARTMENT;
  }

  const parsed = toNumber(value);
  if (parsed === null || parsed < 1) {
    throw new Error("maxPagesPerDepartment deve ser maior que zero");
  }

  return Math.trunc(parsed);
}

function normalizeIntegerParam(value: unknown, defaultValue: number, fieldName: string, minValue: number): number {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }

  const parsed = toNumber(value);
  if (parsed === null || parsed < minValue) {
    throw new BadRequestError(`${fieldName} deve ser maior ou igual a ${minValue}`);
  }

  return Math.trunc(parsed);
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

function normalizeBackfillParams(body: JsonRecord): BackfillParams {
  const departmentId = toText(body.departmentId)?.trim();
  if (!departmentId) {
    throw new BadRequestError("departmentId e obrigatorio no modo backfill");
  }

  return {
    departmentId,
    startOffset: normalizeIntegerParam(body.startOffset, 0, "startOffset", 0),
    maxPages: normalizeIntegerParam(body.maxPages, DEFAULT_BACKFILL_MAX_PAGES, "maxPages", 1),
  };
}

function normalizeContactsParams(body: JsonRecord): ContactsParams {
  return {
    startOffset: normalizeIntegerParam(body.startOffset, 0, "startOffset", 0),
    maxPages: normalizeIntegerParam(body.maxPages, DEFAULT_CONTACTS_MAX_PAGES, "maxPages", 1),
  };
}

function normalizeDateWindow(body: JsonRecord): DateWindow {
  const startDate = typeof body.startDate === "string" && body.startDate.trim()
    ? body.startDate.trim()
    : DEFAULT_START_DATE;
  const endDate = typeof body.endDate === "string" && body.endDate.trim()
    ? body.endDate.trim()
    : formatDateOnly(new Date());

  const startDateInclusive = parseDateOnly(startDate, "startDate");
  const endDateInclusive = parseDateOnly(endDate, "endDate");
  const endDateExclusive = addDays(endDateInclusive, 1);

  if (startDateInclusive >= endDateExclusive) {
    throw new Error("startDate deve ser menor ou igual a endDate");
  }

  return {
    startDate,
    endDate,
    startDateInclusive,
    endDateExclusive,
    maxPagesPerDepartment: normalizeMaxPages(body.maxPagesPerDepartment),
  };
}

function isTicketInsideDateWindow(ticket: ZohoTicket, startDate: Date, endDateExclusive: Date): boolean {
  const createdTime = toDate(ticket.createdTime);
  if (!createdTime) {
    return false;
  }

  const createdDate = new Date(createdTime);
  return createdDate >= startDate && createdDate < endDateExclusive;
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

  const details = toText(payload.error_description) ?? toText(payload.error) ?? responseText;

  if (!response.ok) {
    if (
      response.status === 400 &&
      details.toLowerCase().includes("too many requests") &&
      attempt < 4
    ) {
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

async function fetchTicketsPage(accessToken: string, departmentId: string, pageFrom: number): Promise<ZohoTicket[]> {
  const url = new URL(ZOHO_TICKETS_URL);
  url.searchParams.set("departmentId", departmentId);
  url.searchParams.set("limit", String(PAGE_LIMIT));
  url.searchParams.set("from", String(pageFrom));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      orgId: getRequiredEnv("ZOHO_ORG_ID"),
    },
  });

  const responseText = await response.text();
  let payload: JsonRecord = {};

  try {
    payload = JSON.parse(responseText) as JsonRecord;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const details = toText(payload.message) ?? toText(payload.error_description) ?? responseText;
    throw new Error(`Falha ao buscar tickets do departamento ${departmentId}: ${response.status} ${details}`);
  }

  const data = payload.data;
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter((item): item is ZohoTicket => item !== null && typeof item === "object" && !Array.isArray(item));
}

async function fetchDepartments(accessToken: string): Promise<ZohoDepartment[]> {
  const response = await fetch(ZOHO_DEPARTMENTS_URL, {
    method: "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      orgId: getRequiredEnv("ZOHO_ORG_ID"),
    },
  });

  const responseText = await response.text();
  let payload: unknown = {};

  try {
    payload = JSON.parse(responseText) as unknown;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const payloadRecord = asRecord(payload);
    const details = toText(payloadRecord.message) ?? toText(payloadRecord.error_description) ?? responseText;
    throw new Error(`Falha ao buscar departments: ${response.status} ${details}`);
  }

  if (Array.isArray(payload)) {
    return payload.filter((item): item is ZohoDepartment =>
      item !== null && typeof item === "object" && !Array.isArray(item)
    );
  }

  const payloadRecord = asRecord(payload);
  const data = payloadRecord.data;

  if (Array.isArray(data)) {
    return data.filter((item): item is ZohoDepartment =>
      item !== null && typeof item === "object" && !Array.isArray(item)
    );
  }

  const nestedData = asRecord(data).data;
  if (Array.isArray(nestedData)) {
    return nestedData.filter((item): item is ZohoDepartment =>
      item !== null && typeof item === "object" && !Array.isArray(item)
    );
  }

  return [];
}

async function fetchZohoListPage(
  accessToken: string,
  endpointUrl: string,
  endpointPath: string,
  pageFrom: number,
  params: Record<string, string> = {},
): Promise<JsonRecord[]> {
  const url = new URL(endpointUrl);
  url.searchParams.set("limit", String(PAGE_LIMIT));
  url.searchParams.set("from", String(pageFrom));
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      orgId: getRequiredEnv("ZOHO_ORG_ID"),
    },
  });

  const responseText = await response.text();
  let payload: unknown = {};

  try {
    payload = JSON.parse(responseText) as unknown;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const payloadRecord = asRecord(payload);
    const details = toText(payloadRecord.message) ?? toText(payloadRecord.error_description) ?? responseText;
    throw new Error(`Falha ao buscar ${endpointPath}: ${response.status} ${details}`);
  }

  if (Array.isArray(payload)) {
    return payload.filter((item): item is JsonRecord =>
      item !== null && typeof item === "object" && !Array.isArray(item)
    );
  }

  const payloadRecord = asRecord(payload);
  const data = payloadRecord.data;

  if (Array.isArray(data)) {
    return data.filter((item): item is JsonRecord =>
      item !== null && typeof item === "object" && !Array.isArray(item)
    );
  }

  const nestedData = asRecord(data).data;
  if (Array.isArray(nestedData)) {
    return nestedData.filter((item): item is JsonRecord =>
      item !== null && typeof item === "object" && !Array.isArray(item)
    );
  }

  return [];
}

async function fetchAgentsPage(accessToken: string, pageFrom: number): Promise<ZohoAgent[]> {
  return await fetchZohoListPage(accessToken, ZOHO_AGENTS_URL, ZOHO_AGENTS_ENDPOINT, pageFrom) as ZohoAgent[];
}

async function fetchContactsPage(accessToken: string, pageFrom: number): Promise<ZohoContact[]> {
  return await fetchZohoListPage(accessToken, ZOHO_CONTACTS_URL, ZOHO_CONTACTS_ENDPOINT, pageFrom) as ZohoContact[];
}

async function fetchRecentTicketsPage(
  accessToken: string,
  pageFrom: number,
  departmentId: string,
): Promise<ZohoTicket[]> {
  return await fetchZohoListPage(accessToken, ZOHO_TICKETS_URL, "/api/v1/tickets", pageFrom, {
    departmentId,
    sortBy: "-modifiedTime",
    fields: "id,ticketNumber,status,statusType,createdTime,closedTime,modifiedTime,departmentId,assigneeId,priority,dueDate,responseDueDate",
  }) as ZohoTicket[];
}

const TICKET_DETAILS_LOAD_STRATEGY = "v1c_ticket_details";
const DEFAULT_TICKET_DETAILS_MAX_TICKETS = 50;
const MAX_TICKET_DETAILS_BATCH_SIZE = 400;
const TICKET_METRICS_LOAD_STRATEGY = "v1d_ticket_metrics";
const DEFAULT_TICKET_METRICS_MAX_TICKETS = 200;
const MAX_TICKET_METRICS_BATCH_SIZE = 250;
const INCREMENTAL_LOAD_STRATEGY = "v1e_incremental";
const DEFAULT_INCREMENTAL_LOOKBACK_HOURS = 48;
const MAX_INCREMENTAL_LOOKBACK_HOURS = 168;
const DEFAULT_INCREMENTAL_MAX_PAGES = 10;
const MAX_INCREMENTAL_MAX_PAGES = 50;
const MAX_INCREMENTAL_TICKETS = 500;
const DEFAULT_OPEN_TICKET_SWEEP_MAX_TICKETS = 50;
const MAX_OPEN_TICKET_SWEEP_MAX_TICKETS = 100;
const DEFAULT_MISSING_METRICS_SWEEP_MAX_TICKETS = 50;
const MAX_MISSING_METRICS_SWEEP_MAX_TICKETS = 100;

class ZohoTicketDetailFetchError extends Error {
  rawPayload: unknown;
  httpStatus: number | null;

  constructor(message: string, rawPayload: unknown, httpStatus: number | null = null) {
    super(message);
    this.name = "ZohoTicketDetailFetchError";
    this.rawPayload = rawPayload;
    this.httpStatus = httpStatus;
  }
}

class ZohoTicketMetricsFetchError extends Error {
  rawPayload: unknown;
  httpStatus: number | null;

  constructor(message: string, rawPayload: unknown, httpStatus: number | null = null) {
    super(message);
    this.name = "ZohoTicketMetricsFetchError";
    this.rawPayload = rawPayload;
    this.httpStatus = httpStatus;
  }
}

function normalizeTicketDetailsParams(requestBody: unknown): { startOffset: number; maxTickets: number } {
  const requestRecord = asRecord(requestBody);
  const rawStartOffset = toNumber(requestRecord.startOffset);
  const rawMaxTickets = toNumber(requestRecord.maxTickets);
  const startOffset = rawStartOffset === null ? 0 : Math.max(0, Math.trunc(rawStartOffset));
  const requestedMaxTickets = rawMaxTickets === null
    ? DEFAULT_TICKET_DETAILS_MAX_TICKETS
    : Math.max(1, Math.trunc(rawMaxTickets));
  const maxTickets = Math.min(requestedMaxTickets, MAX_TICKET_DETAILS_BATCH_SIZE);

  return { startOffset, maxTickets };
}

function normalizeTicketMetricsParams(requestBody: unknown): { startOffset: number; maxTickets: number } {
  const requestRecord = asRecord(requestBody);
  const rawStartOffset = toNumber(requestRecord.startOffset);
  const rawMaxTickets = toNumber(requestRecord.maxTickets);
  const startOffset = rawStartOffset === null ? 0 : Math.max(0, Math.trunc(rawStartOffset));
  const requestedMaxTickets = rawMaxTickets === null
    ? DEFAULT_TICKET_METRICS_MAX_TICKETS
    : Math.max(1, Math.trunc(rawMaxTickets));
  const maxTickets = Math.min(requestedMaxTickets, MAX_TICKET_METRICS_BATCH_SIZE);

  return { startOffset, maxTickets };
}

function normalizeIncrementalParams(requestBody: unknown): IncrementalParams {
  const requestRecord = asRecord(requestBody);
  const rawLookbackHours = toNumber(requestRecord.lookbackHours);
  const rawMaxPages = toNumber(requestRecord.maxPages);
  const rawIncludeDetails = toBool(requestRecord.includeDetails);
  const rawIncludeMetrics = toBool(requestRecord.includeMetrics);
  const rawIncludeOpenTicketSweep = toBool(
    requestRecord.includeOpenTicketSweep ?? requestRecord.includeOpenSweep ?? requestRecord.include_open_sweep,
  );
  const rawOpenTicketSweepMaxTickets = toNumber(
    requestRecord.openTicketSweepMaxTickets ?? requestRecord.openSweepLimit ?? requestRecord.open_sweep_limit,
  );
  const rawIncludeMissingMetricsSweep = toBool(
    requestRecord.includeMissingMetricsSweep ?? requestRecord.includeMissingMetrics ?? requestRecord.include_missing_metrics,
  );
  const rawMissingMetricsSweepMaxTickets = toNumber(
    requestRecord.missingMetricsSweepMaxTickets ?? requestRecord.missingMetricsLimit ?? requestRecord.missing_metrics_limit,
  );
  const rawBatchSize = toNumber(requestRecord.batchSize ?? requestRecord.batch_size);
  const rawMaxBatches = toNumber(requestRecord.maxBatches ?? requestRecord.max_batches);
  const rawMaxRuntimeSeconds = toNumber(requestRecord.maxRuntimeSeconds ?? requestRecord.max_runtime_seconds);
  const rawDryRun = toBool(requestRecord.dryRun ?? requestRecord.dry_run);
  const cursor = toText(requestRecord.cursor ?? requestRecord.next_cursor);

  const requestedLookbackHours = rawLookbackHours === null
    ? DEFAULT_INCREMENTAL_LOOKBACK_HOURS
    : Math.max(1, Math.trunc(rawLookbackHours));
  const requestedMaxPages = rawMaxPages === null
    ? DEFAULT_INCREMENTAL_MAX_PAGES
    : Math.max(1, Math.trunc(rawMaxPages));
  const requestedOpenTicketSweepMaxTickets = rawOpenTicketSweepMaxTickets === null
    ? DEFAULT_OPEN_TICKET_SWEEP_MAX_TICKETS
    : Math.max(1, Math.trunc(rawOpenTicketSweepMaxTickets));
  const requestedMissingMetricsSweepMaxTickets = rawMissingMetricsSweepMaxTickets === null
    ? DEFAULT_MISSING_METRICS_SWEEP_MAX_TICKETS
    : Math.max(1, Math.trunc(rawMissingMetricsSweepMaxTickets));
  const requestedBatchSize = rawBatchSize === null ? DEFAULT_SWEEP_BATCH_SIZE : Math.max(1, Math.trunc(rawBatchSize));
  const requestedMaxBatches = rawMaxBatches === null ? DEFAULT_SWEEP_MAX_BATCHES : Math.max(1, Math.trunc(rawMaxBatches));
  const requestedMaxRuntimeSeconds = rawMaxRuntimeSeconds === null
    ? DEFAULT_MAX_RUNTIME_SECONDS
    : Math.max(10, Math.trunc(rawMaxRuntimeSeconds));

  return {
    lookbackHours: Math.min(requestedLookbackHours, MAX_INCREMENTAL_LOOKBACK_HOURS),
    maxPages: Math.min(requestedMaxPages, MAX_INCREMENTAL_MAX_PAGES),
    includeDetails: rawIncludeDetails === null ? true : rawIncludeDetails,
    includeMetrics: rawIncludeMetrics === null ? true : rawIncludeMetrics,
    includeOpenTicketSweep: rawIncludeOpenTicketSweep === null ? true : rawIncludeOpenTicketSweep,
    openTicketSweepMaxTickets: Math.min(
      requestedOpenTicketSweepMaxTickets,
      MAX_OPEN_TICKET_SWEEP_MAX_TICKETS,
    ),
    includeMissingMetricsSweep: rawIncludeMissingMetricsSweep === null ? true : rawIncludeMissingMetricsSweep,
    missingMetricsSweepMaxTickets: Math.min(
      requestedMissingMetricsSweepMaxTickets,
      MAX_MISSING_METRICS_SWEEP_MAX_TICKETS,
    ),
    batchSize: Math.min(requestedBatchSize, MAX_SWEEP_BATCH_SIZE),
    maxBatches: Math.min(requestedMaxBatches, MAX_SWEEP_MAX_BATCHES),
    maxRuntimeSeconds: Math.min(requestedMaxRuntimeSeconds, MAX_RUNTIME_SECONDS),
    cursor: cursor && cursor.trim() ? cursor.trim() : null,
    dryRun: rawDryRun ?? false,
  };
}

function createRuntimeGuard(startedAtMs: number, maxRuntimeSeconds: number): {
  elapsedMs: () => number;
  remainingMs: () => number;
  canStartWork: () => boolean;
  shouldStop: () => boolean;
  shouldStopSweep: () => boolean;
} {
  const maxRuntimeMs = Math.min(Math.max(maxRuntimeSeconds, 10), MAX_RUNTIME_SECONDS) * 1000;
  const deadlineMs = startedAtMs + maxRuntimeMs - RUNTIME_SAFETY_MARGIN_MS;
  const shouldStop = () => Date.now() >= deadlineMs;

  return {
    elapsedMs: () => Date.now() - startedAtMs,
    remainingMs: () => deadlineMs - Date.now(),
    canStartWork: () => Date.now() < deadlineMs,
    shouldStop,
    shouldStopSweep: shouldStop,
  };
}

function isClosedLikeStatus(status: unknown): boolean {
  const normalized = toText(status)?.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return [
    "closed",
    "resolved",
    "fechado",
    "resolvido",
    "cerrado",
    "resuelto",
    "solved",
    "completed",
    "concluido",
    "concluído",
    "cancelled",
    "canceled",
    "cancelado",
  ].includes(normalized);
}

function shouldSyncMetricsForTicket(detail: JsonRecord, existingTicket?: JsonRecord): boolean {
  const existingHasRawMetricsField = existingTicket
    ? Object.prototype.hasOwnProperty.call(existingTicket, "raw_metrics")
    : false;

  return Boolean(toDate(detail.closedTime) ?? toDate(detail.closed_time) ?? toDate(existingTicket?.closed_time)) ||
    isClosedLikeStatus(detail.status ?? existingTicket?.status) ||
    Boolean(existingHasRawMetricsField && existingTicket && existingTicket.raw_metrics === null);
}

function encodeCursor(ticketId: string | null, syncedAt: string | null): string | null {
  if (!ticketId && !syncedAt) {
    return null;
  }

  return btoa(JSON.stringify({ ticketId, syncedAt }));
}

function decodeCursor(cursor: string | null): JsonRecord {
  if (!cursor) {
    return {};
  }

  try {
    return asRecord(JSON.parse(atob(cursor)));
  } catch {
    return {};
  }
}

function ticketDetailEndpoint(ticketId: string): string {
  return `/api/v1/tickets/${encodeURIComponent(ticketId)}`;
}

function ticketMetricsEndpoint(ticketId: string): string {
  return `/api/v1/tickets/${encodeURIComponent(ticketId)}/metrics`;
}

async function fetchZohoJsonWithRetry(
  url: URL,
  endpointPath: string,
  accessToken: string,
  errorFactory: (message: string, rawPayload: unknown, httpStatus: number | null) => Error,
): Promise<FetchJsonResult> {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= ZOHO_FETCH_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          orgId: getRequiredEnv("ZOHO_ORG_ID"),
        },
      });

      const responseText = await response.text();
      let payload: unknown = {};

      try {
        payload = JSON.parse(responseText) as unknown;
      } catch {
        payload = {};
      }

      if (!response.ok) {
        const payloadRecord = asRecord(payload);
        const details = toText(payloadRecord.message) ?? toText(payloadRecord.error_description) ?? responseText;
        const error = errorFactory(
          `Falha ao buscar ${endpointPath}: ${response.status} ${details}`,
          payload || responseText,
          response.status,
        );

        lastError = error;

        if (attempt < ZOHO_FETCH_MAX_ATTEMPTS && isRetryableHttpStatus(response.status)) {
          const retryAfterSeconds = Number(response.headers.get("Retry-After"));
          const delayMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
            ? retryAfterSeconds * 1000
            : ZOHO_FETCH_BASE_BACKOFF_MS * attempt;
          await sleep(delayMs);
          continue;
        }

        throw error;
      }

      return { payload, status: response.status, responseText };
    } catch (error) {
      lastError = error;

      if (attempt < ZOHO_FETCH_MAX_ATTEMPTS && isRetryableError(error)) {
        await sleep(ZOHO_FETCH_BASE_BACKOFF_MS * attempt);
        continue;
      }

      throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Falha ao buscar ${endpointPath}`);
}

async function fetchTicketDetail(accessToken: string, ticketId: string): Promise<JsonRecord> {
  const endpointPath = ticketDetailEndpoint(ticketId);
  const url = new URL(`${ZOHO_TICKETS_URL.replace(/\/$/, "")}/${encodeURIComponent(ticketId)}`);

  const { payload } = await fetchZohoJsonWithRetry(
    url,
    endpointPath,
    accessToken,
    (message, rawPayload, httpStatus) => new ZohoTicketDetailFetchError(message, rawPayload, httpStatus),
  );

  if (payload !== null && typeof payload === "object" && !Array.isArray(payload)) {
    const detail = payload as JsonRecord;
    if (toBool(detail.isTrashed) === true || toBool(detail.isDeleted) === true) {
      throw new ZohoTicketDetailFetchError(
        `Ticket ${ticketId} esta na lixeira do Zoho (isTrashed/isDeleted=true)`,
        detail,
        410,
      );
    }

    return detail;
  }

  throw new ZohoTicketDetailFetchError(`Detalhe do ticket ${ticketId} retornou payload invalido`, payload);
}

async function fetchTicketMetrics(accessToken: string, ticketId: string): Promise<JsonRecord> {
  const endpointPath = ticketMetricsEndpoint(ticketId);
  const url = new URL(`${ZOHO_TICKETS_URL.replace(/\/$/, "")}/${encodeURIComponent(ticketId)}/metrics`);

  const { payload } = await fetchZohoJsonWithRetry(
    url,
    endpointPath,
    accessToken,
    (message, rawPayload, httpStatus) => new ZohoTicketMetricsFetchError(message, rawPayload, httpStatus),
  );

  if (payload !== null && typeof payload === "object" && !Array.isArray(payload)) {
    return payload as JsonRecord;
  }

  throw new ZohoTicketMetricsFetchError(`Metricas do ticket ${ticketId} retornaram payload invalido`, payload);
}

function ticketDetailRawError(error: unknown, fallbackPayload: unknown): unknown {
  if (error instanceof ZohoTicketDetailFetchError) {
    return error.rawPayload;
  }

  return fallbackPayload;
}

function ticketMetricsRawError(error: unknown, fallbackPayload: unknown): unknown {
  if (error instanceof ZohoTicketMetricsFetchError) {
    return error.rawPayload;
  }

  return fallbackPayload;
}

function isZohoTicketNotFoundError(error: unknown): boolean {
  const status = httpStatusFromError(error);
  if (status === 404) {
    return true;
  }

  if (status !== 400 && status !== 422) {
    return false;
  }

  const rawPayload = error instanceof ZohoTicketDetailFetchError ? error.rawPayload : null;
  const haystack = `${errorMessage(error)} ${toText(rawPayload) ?? ""}`.toLowerCase();
  return haystack.includes("not found") ||
    haystack.includes("does not exist") ||
    haystack.includes("not exist") ||
    haystack.includes("invalid ticket");
}

function isZohoTicketDetailNotFoundOrGone(error: unknown): boolean {
  return error instanceof ZohoTicketDetailFetchError && (error.httpStatus === 404 || error.httpStatus === 410);
}

async function markZohoTicketDeletedInSupabase(
  supabase: SupabaseClient,
  ticketId: string,
  dryRun = false,
): Promise<void> {
  if (dryRun) {
    return;
  }

  const now = new Date().toISOString();
  const result = await supabase
    .from("zoho_tickets")
    .update({
      is_deleted: true,
      synced_at: now,
      updated_in_supabase_at: now,
    })
    .eq("id", ticketId) as SupabaseCallResult | undefined;

  if (!result || result.error) {
    throw new Error(
      `Falha ao marcar ticket ${ticketId} como deletado no Supabase: ${
        supabaseErrorMessage(result, "retorno vazio do Supabase")
      }`,
    );
  }
}

async function deleteZohoTicketFromSupabase(
  supabase: SupabaseClient,
  ticketId: string,
  dryRun = false,
): Promise<void> {
  if (dryRun) {
    return;
  }

  const result = await supabase
    .from("zoho_tickets")
    .delete()
    .eq("id", ticketId) as SupabaseCallResult | undefined;

  if (!result || result.error) {
    const deleteError = supabaseErrorMessage(result, "retorno vazio do Supabase");
    const now = new Date().toISOString();
    const fallbackResult = await supabase
      .from("zoho_tickets")
      .update({
        status: "Excluido no ZohoDesk",
        status_type: "Deleted",
        closed_time: now,
        modified_time: now,
        last_detail_sync_at: now,
        updated_in_supabase_at: now,
        synced_at: now,
        load_strategy: "zoho_deleted_tombstone",
      })
      .eq("id", ticketId) as SupabaseCallResult | undefined;

    if (!fallbackResult || fallbackResult.error) {
      throw new Error(
        `Falha ao remover ou tombstonar ticket ${ticketId} excluido no ZohoDesk do Supabase: delete=${deleteError}; update=${
          supabaseErrorMessage(fallbackResult, "retorno vazio do Supabase")
        }`,
      );
    }
  }
}

async function checkTicketExistsInZoho(
  accessToken: string,
  ticketId: string,
): Promise<boolean> {
  try {
    const url = new URL(
      `${ZOHO_TICKETS_URL.replace(/\/$/, "")}/${encodeURIComponent(ticketId)}`,
    );
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        orgId: getRequiredEnv("ZOHO_ORG_ID"),
      },
    });
    if (response.status === 200) {
      const responseText = await response.text();
      let payload: JsonRecord = {};
      try {
        const parsed = JSON.parse(responseText) as unknown;
        if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
          payload = parsed as JsonRecord;
        }
      } catch {
        payload = {};
      }

      if (toBool(payload.isTrashed) === true || toBool(payload.isDeleted) === true) {
        console.log(
          `checkTicketExistsInZoho: ticket ${ticketId} esta na lixeira — tratando como nao existente`,
        );
        return false;
      }

      return true;
    }
    if (response.status === 404) return false;
    // Qualquer outro erro (401, 429, 500) — assume que existe.
    // NUNCA deletar por engano devido a erro de rede ou rate limit.
    console.warn(
      `checkTicketExistsInZoho: status inesperado ${response.status} para ticket ${ticketId} — assumindo que existe`,
    );
    return true;
  } catch (error) {
    console.warn(
      `checkTicketExistsInZoho: erro de rede para ticket ${ticketId} — assumindo que existe`,
      errorMessage(error),
    );
    return true;
  }
}

async function fetchTicketHistory(
  accessToken: string,
  ticketId: string,
): Promise<JsonRecord[]> {
  const fetchHistoryPage = async (pageFrom: number, filterByStatus: boolean): Promise<JsonRecord[]> => {
    const url = new URL(`${ZOHO_TICKETS_URL.replace(/\/$/, "")}/${encodeURIComponent(ticketId)}/History`);
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
    let pageEvents: JsonRecord[] = [];
    if (Array.isArray(data)) {
      pageEvents = data.filter((item): item is JsonRecord =>
        item !== null && typeof item === "object" && !Array.isArray(item)
      );
    } else if (Array.isArray(payload)) {
      pageEvents = payload.filter((item): item is JsonRecord =>
        item !== null && typeof item === "object" && !Array.isArray(item)
      );
    }

    return pageEvents;
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

  return await fetchHistoryPages(false);
}

function toIsoDateText(value: unknown): string | null {
  const text = toText(value);
  if (!text) {
    return null;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function stablePositiveBigintText(value: string): string {
  const maxBigint = 9_223_372_036_854_775_783n;
  let hash = 1_469_598_103_934_665_603n;

  for (const char of value) {
    hash ^= BigInt(char.codePointAt(0) ?? 0);
    hash = (hash * 1_099_511_628_211n) % maxBigint;
  }

  return (hash === 0n ? 1n : hash).toString();
}

function historyEventText(event: JsonRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = toText(event[key]);
    if (value) {
      return value;
    }
  }

  return null;
}

function parseHistoryEvents(ticketId: string, events: JsonRecord[]): JsonRecord[] {
  const now = new Date().toISOString();
  const rows: JsonRecord[] = [];
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(toText(a.eventTime) ?? "").getTime();
    const timeB = new Date(toText(b.eventTime) ?? "").getTime();
    return (Number.isFinite(timeA) ? timeA : 0) - (Number.isFinite(timeB) ? timeB : 0);
  });

  sortedEvents.forEach((event, eventIndex) => {
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

    for (const info of eventInfo) {
      const propertyName = toText(info.propertyName);
      if (propertyName?.trim().toLowerCase() !== "status") {
        continue;
      }

      const propertyValue = info.propertyValue;
      let previousStatus: string | null = null;
      let newStatus: string | null = null;

      if (typeof propertyValue === "string") {
        newStatus = propertyValue;
      } else if (propertyValue !== null && typeof propertyValue === "object" && !Array.isArray(propertyValue)) {
        const propertyValueRecord = asRecord(propertyValue);
        previousStatus = toText(propertyValueRecord.previousValue);
        newStatus = toText(propertyValueRecord.updatedValue);
      }

      if (!newStatus) {
        continue;
      }

      const nextEvent = sortedEvents[eventIndex + 1];
      const nextEventTime = nextEvent ? toIsoDateText(nextEvent.eventTime) : null;
      let timeInPreviousStatusHours: number | null = null;
      let timeInPreviousStatusMinutes: number | null = null;

      if (nextEventTime) {
        const diffMs = new Date(nextEventTime).getTime() - new Date(eventTime).getTime();
        if (Number.isFinite(diffMs) && diffMs > 0) {
          timeInPreviousStatusHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
          timeInPreviousStatusMinutes = Math.round(diffMs / (1000 * 60));
        }
      }

      const eventId = `${ticketId}_${eventTime.replace(/[^0-9]/g, "")}_${newStatus.replace(/\s/g, "_")}`;
      rows.push({
        id: stablePositiveBigintText(`${ticketId}:${eventId}`),
        ticket_id: ticketId,
        event_id: eventId,
        event_time: eventTime,
        previous_status: previousStatus,
        new_status: newStatus,
        actor_id: toText(actor.id),
        actor_name: toText(actor.name),
        actor_email: null,
        source_event_type: eventName,
        source_field_name: "status",
        next_event_time: nextEventTime,
        time_in_previous_status_hours: timeInPreviousStatusHours,
        time_in_previous_status_minutes: timeInPreviousStatusMinutes,
        raw_event: event,
        synced_at: now,
      });
    }
  });

  return rows;
}

function convertTimeTextToHours(value: unknown): number | null {
  const text = toText(value)?.trim();

  if (!text) {
    return null;
  }

  const match = text.match(/^(\d+):(\d{1,2})(?:\s*(?:h|hr|hrs))?$/i);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || minutes < 0 || minutes >= 60) {
    return null;
  }

  return hours + minutes / 60;
}

function convertHoursToMinutes(value: number | null): number | null {
  return value === null ? null : value * 60;
}

function metricText(metrics: JsonRecord, fieldName: string): string | null {
  const nestedData = asRecord(metrics.data);
  return toText(metrics[fieldName]) ?? toText(nestedData[fieldName]);
}

async function ticketResolutionColumnExists(supabase: SupabaseClient): Promise<boolean> {
  try {
    const result = await supabase
      .from("zoho_tickets")
      .select("resolution")
      .limit(1) as SupabaseCallResult<JsonRecord[]> | undefined;

    if (!result || result.error) {
      console.warn(
        "Coluna resolution nao sera atualizada em zoho_tickets",
        supabaseErrorMessage(result, "retorno vazio do Supabase"),
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Coluna resolution nao sera atualizada em zoho_tickets", errorMessage(error));
    return false;
  }
}

function mapTicketDetailToUpdateRow(detail: JsonRecord, includeResolution: boolean): JsonRecord {
  const now = new Date().toISOString();
  const cf = asRecord(detail.cf);
  const modifiedTime = detail.modifiedTime ?? detail.modified_time;

  const row: JsonRecord = {
    ticket_number: toText(detail.ticketNumber),
    layout_id: toText(detail.layoutId),
    email: toText(detail.email),
    phone: toText(detail.phone),
    subject: toText(detail.subject),
    status: toText(detail.status),
    status_type: toText(detail.statusType),
    created_time: toDate(detail.createdTime),
    modified_time: toDate(modifiedTime),
    closed_time: toDate(detail.closedTime),
    category: toText(detail.category),
    language: toText(detail.language),
    sub_category: toText(detail.subCategory),
    priority: toText(detail.priority),
    channel: toText(detail.channel),
    due_date: toDate(detail.dueDate),
    response_due_date: toDate(detail.responseDueDate),
    comment_count: toNumber(detail.commentCount),
    sentiment: toText(detail.sentiment),
    thread_count: toNumber(detail.threadCount),
    onhold_time: toText(detail.onholdTime),
    account_id: toText(detail.accountId),
    department_id: toText(detail.departmentId),
    contact_id: toText(detail.contactId),
    product_id: toText(detail.productId),
    assignee_id: toText(detail.assigneeId),
    team_id: toText(detail.teamId),
    relationship_type: toText(detail.relationshipType),
    channel_code: toText(detail.channelCode),
    customer_response_time: toDate(detail.customerResponseTime),
    is_archived: toBool(detail.isArchived),
    is_spam: toBool(detail.isSpam),
    web_url: toText(detail.webUrl),
    raw_cf: detail.cf ?? null,
    raw_ticket: detail,
    numero_serie: toText(cf.cf_numero_de_serie_do_equipamento),
    produtos: toText(cf.cf_produtos),
    marca_produto: toText(cf.cf_marca_do_produto),
    tipo_atendimento: toText(cf.cf_tipo_de_atendimento),
    tipo_chamado: toText(cf.cf_tipo_de_chamado),
    categoria_custom: toText(cf.cf_categoria),
    status_alliage: toText(cf.cf_status_alliage),
    solicitante: toText(cf.cf_solicitante),
    regiao: toText(cf.cf_regiao_region) ?? toText(cf.cf_pais),
    pais: toText(cf.cf_pais) ?? toText(cf.cf_pais_1),
    region: toText(cf.cf_regiao_region) ?? toText(cf.cf_pais),
    cidade: toText(cf.cf_cidade),
    last_detail_sync_at: now,
    updated_in_supabase_at: now,
    synced_at: now,
  };

  if (includeResolution) {
    row.resolution = toText(detail.resolution);
  }

  return row;
}

function mapTicketMetricsToUpdateRow(metrics: JsonRecord): JsonRecord {
  const now = new Date().toISOString();
  const firstResponseTimeTxt = metricText(metrics, "firstResponseTime");
  const resolutionTimeTxt = metricText(metrics, "resolutionTime");
  const responseTimeTxt = metricText(metrics, "totalResponseTime");
  const mtfcHours = convertTimeTextToHours(firstResponseTimeTxt);
  const resolutionHours = convertTimeTextToHours(resolutionTimeTxt);
  const responseHours = convertTimeTextToHours(responseTimeTxt);

  return {
    raw_metrics: metrics,
    first_response_time_txt: firstResponseTimeTxt,
    resolution_time_txt: resolutionTimeTxt,
    response_time_txt: responseTimeTxt,
    mtfc_horas: mtfcHours,
    mtfc_minutos: convertHoursToMinutes(mtfcHours),
    resolution_horas: resolutionHours,
    resolution_minutos: convertHoursToMinutes(resolutionHours),
    response_horas: responseHours,
    response_minutos: convertHoursToMinutes(responseHours),
    last_metrics_sync_at: now,
    updated_in_supabase_at: now,
    synced_at: now,
  };
}

function mapTicketToRow(ticket: ZohoTicket, loadStrategy: string): JsonRecord {
  const id = toText(ticket.id);
  if (!id) {
    throw new Error("Ticket sem id");
  }

  const now = new Date().toISOString();
  const source = asRecord(ticket.source);
  const lastThread = asRecord(ticket.lastThread);
  const cf = asRecord(ticket.cf);

  return {
    id,
    ticket_number: toText(ticket.ticketNumber),
    layout_id: toText(ticket.layoutId),
    email: toText(ticket.email),
    phone: toText(ticket.phone),
    subject: toText(ticket.subject),
    status: toText(ticket.status),
    status_type: toText(ticket.statusType),
    created_time: toDate(ticket.createdTime),
    modified_time: toDate(ticket.modifiedTime),
    closed_time: toDate(ticket.closedTime),
    category: toText(ticket.category),
    language: toText(ticket.language),
    sub_category: toText(ticket.subCategory),
    priority: toText(ticket.priority),
    channel: toText(ticket.channel),
    due_date: toDate(ticket.dueDate),
    response_due_date: toDate(ticket.responseDueDate),
    comment_count: toNumber(ticket.commentCount),
    sentiment: toText(ticket.sentiment),
    thread_count: toNumber(ticket.threadCount),
    onhold_time: toText(ticket.onholdTime),
    account_id: toText(ticket.accountId),
    department_id: toText(ticket.departmentId),
    contact_id: toText(ticket.contactId),
    product_id: toText(ticket.productId),
    assignee_id: toText(ticket.assigneeId),
    team_id: toText(ticket.teamId),
    relationship_type: toText(ticket.relationshipType),
    channel_code: toText(ticket.channelCode),
    customer_response_time: toDate(ticket.customerResponseTime),
    is_archived: toBool(ticket.isArchived),
    is_spam: toBool(ticket.isSpam),
    web_url: toText(ticket.webUrl),
    source_ext_id: toText(source.extId),
    source_app_name: toText(source.appName),
    source_app_photo_url: toText(source.appPhotoURL),
    source_permalink: toText(source.permalink),
    source_type: toText(source.type),
    last_thread_channel: toText(lastThread.channel),
    last_thread_is_draft: toBool(lastThread.isDraft),
    last_thread_is_forward: toBool(lastThread.isForward),
    last_thread_direction: toText(lastThread.direction),
    numero_serie: toText(cf.cf_numero_de_serie_do_equipamento),
    produtos: toText(cf.cf_produtos),
    marca_produto: toText(cf.cf_marca_do_produto),
    tipo_atendimento: toText(cf.cf_tipo_de_atendimento),
    tipo_chamado: toText(cf.cf_tipo_de_chamado),
    categoria_custom: toText(cf.cf_categoria),
    status_alliage: toText(cf.cf_status_alliage),
    solicitante: toText(cf.cf_solicitante),
    regiao: toText(cf.cf_regiao_region) ?? toText(cf.cf_pais),
    pais: toText(cf.cf_pais) ?? toText(cf.cf_pais_1),
    region: toText(cf.cf_regiao_region) ?? toText(cf.cf_pais),
    cidade: toText(cf.cf_cidade),
    raw_ticket: ticket,
    raw_cf: ticket.cf ?? null,
    updated_in_supabase_at: now,
    synced_at: now,
    load_strategy: loadStrategy,
  };
}

function removeNullishFields(row: JsonRecord, preserveNullKeys: string[] = []): JsonRecord {
  const preserveNullKeySet = new Set(preserveNullKeys);
  return Object.fromEntries(
    Object.entries(row).filter(([key, value]) =>
      value !== undefined && (value !== null || preserveNullKeySet.has(key))
    ),
  );
}

function attachSyncRunId(row: JsonRecord, syncRunId: string | null): JsonRecord {
  const parsed = syncRunId ? Number(syncRunId) : Number.NaN;
  if (Number.isFinite(parsed)) {
    row.last_sync_run_id = parsed;
  }

  return row;
}

function hasAnyOwnKey(record: JsonRecord, keys: string[]): boolean {
  return keys.some((key) => Object.prototype.hasOwnProperty.call(record, key));
}

function nullableTicketFieldKeys(ticket: JsonRecord): string[] {
  const keys: string[] = [];

  if (hasAnyOwnKey(ticket, ["closedTime", "closed_time"])) keys.push("closed_time");
  if (hasAnyOwnKey(ticket, ["dueDate", "due_date"])) keys.push("due_date");
  if (hasAnyOwnKey(ticket, ["responseDueDate", "response_due_date"])) keys.push("response_due_date");
  if (hasAnyOwnKey(ticket, ["priority"])) keys.push("priority");
  if (hasAnyOwnKey(ticket, ["assigneeId", "assignee_id"])) keys.push("assignee_id");
  if (hasAnyOwnKey(ticket, ["status"])) keys.push("status");
  if (hasAnyOwnKey(ticket, ["statusType", "status_type"])) keys.push("status_type");

  return keys;
}

function mapIncrementalTicketToUpsertRow(ticket: ZohoTicket): JsonRecord {
  const row = mapTicketToRow(ticket, "incremental");
  row.load_strategy = "incremental";
  row.updated_in_supabase_at = new Date().toISOString();
  row.synced_at = row.updated_in_supabase_at;

  return removeNullishFields(row, nullableTicketFieldKeys(ticket));
}

function mapIncrementalTicketDetailToUpdateRow(detail: JsonRecord, includeResolution: boolean): JsonRecord {
  return removeNullishFields(mapTicketDetailToUpdateRow(detail, includeResolution), nullableTicketFieldKeys(detail));
}

function mapIncrementalTicketMetricsToUpdateRow(metrics: JsonRecord): JsonRecord {
  return removeNullishFields(mapTicketMetricsToUpdateRow(metrics), [
    "first_response_time_txt",
    "resolution_time_txt",
    "response_time_txt",
    "mtfc_horas",
    "mtfc_minutos",
    "resolution_horas",
    "resolution_minutos",
    "response_horas",
    "response_minutos",
  ]);
}

function ticketIncrementalDate(ticket: ZohoTicket): Date | null {
  const dateText = toDate(ticket.modifiedTime) ??
    toDate(ticket.modified_time) ??
    toDate(ticket.updatedTime) ??
    toDate(ticket.updated_time) ??
    toDate(ticket.createdTime) ??
    toDate(ticket.created_time);

  if (!dateText) {
    return null;
  }

  const date = new Date(dateText);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isTicketInsideIncrementalWindow(ticket: ZohoTicket, fromDateTime: Date, toDateTime: Date): boolean {
  const ticketDate = ticketIncrementalDate(ticket);

  if (!ticketDate) {
    return true;
  }

  return ticketDate >= fromDateTime && ticketDate <= toDateTime;
}

function isTicketOlderThanIncrementalWindow(ticket: ZohoTicket, fromDateTime: Date): boolean {
  const ticketDate = ticketIncrementalDate(ticket);
  return Boolean(ticketDate && ticketDate < fromDateTime);
}

function mapDepartmentToRow(department: ZohoDepartment): JsonRecord {
  const id = toText(department.id);
  if (!id) {
    throw new Error("Department sem id");
  }

  return {
    id,
    name: toText(department.name),
    is_enabled: toBool(department.isEnabled),
    raw_department: department,
    synced_at: new Date().toISOString(),
  };
}

function mapAgentToRow(agent: ZohoAgent): JsonRecord {
  const id = toText(agent.id);
  if (!id) {
    throw new Error("Agent sem id");
  }

  return {
    id,
    email: toText(agent.emailId),
    first_name: toText(agent.firstName),
    last_name: toText(agent.lastName),
    status: toText(agent.status),
    role_id: toText(agent.roleId),
    is_confirmed: toBool(agent.isConfirmed),
    raw_agent: agent,
    synced_at: new Date().toISOString(),
  };
}

function mapContactToRow(contact: ZohoContact): JsonRecord {
  const id = toText(contact.id);
  if (!id) {
    throw new Error("Contact sem id");
  }

  return {
    id,
    first_name: toText(contact.firstName),
    last_name: toText(contact.lastName),
    email: toText(contact.email),
    phone: toText(contact.phone),
    mobile: toText(contact.mobile),
    account_id: toText(contact.accountId),
    raw_contact: contact,
    synced_at: new Date().toISOString(),
  };
}

function toSnapshotNumber(row: JsonRecord, column: string): number | null {
  return toNumber(row[column]);
}

async function collectValidationSnapshot(supabase: SupabaseClient): Promise<ValidationSnapshot> {
  try {
    const result = await supabase
      .from("vw_sync_validation_snapshot")
      .select(
        "raw_metrics_missing,closed_raw_metrics_missing,current_month_closed_raw_metrics_missing,report_period_closed_without_mtfc,open_stale_tickets,assigned_without_agent_email,closed_status_without_closed_time,duplicate_ticket_ids,tickets_without_region,tickets_without_operational_group",
      )
      .single() as SupabaseCallResult<JsonRecord> | undefined;

    if (!result || result.error || !result.data) {
      console.error("Falha ao coletar snapshot de validacao", supabaseErrorMessage(result, "retorno vazio do Supabase"));
      return emptyValidationSnapshot();
    }

    return {
      rawMetricsMissing: toSnapshotNumber(result.data, "raw_metrics_missing"),
      closedRawMetricsMissing: toSnapshotNumber(result.data, "closed_raw_metrics_missing"),
      currentMonthClosedRawMetricsMissing: toSnapshotNumber(result.data, "current_month_closed_raw_metrics_missing"),
      reportPeriodClosedWithoutMtfc: toSnapshotNumber(result.data, "report_period_closed_without_mtfc"),
      openStaleTickets: toSnapshotNumber(result.data, "open_stale_tickets"),
      assignedWithoutAgentEmail: toSnapshotNumber(result.data, "assigned_without_agent_email"),
      closedStatusWithoutClosedTime: toSnapshotNumber(result.data, "closed_status_without_closed_time"),
      duplicateTicketIds: toSnapshotNumber(result.data, "duplicate_ticket_ids"),
      ticketsWithoutRegion: toSnapshotNumber(result.data, "tickets_without_region"),
      ticketsWithoutOperationalGroup: toSnapshotNumber(result.data, "tickets_without_operational_group"),
    };
  } catch (error) {
    console.error("Falha ao coletar snapshot de validacao", errorMessage(error));
    return emptyValidationSnapshot();
  }
}

function emptyValidationSnapshot(): ValidationSnapshot {
  return {
    rawMetricsMissing: null,
    closedRawMetricsMissing: null,
    currentMonthClosedRawMetricsMissing: null,
    reportPeriodClosedWithoutMtfc: null,
    openStaleTickets: null,
    assignedWithoutAgentEmail: null,
    closedStatusWithoutClosedTime: null,
    duplicateTicketIds: null,
    ticketsWithoutRegion: null,
    ticketsWithoutOperationalGroup: null,
  };
}

function classifyHealth(status: SyncStatus, summary: SyncSummary, snapshot: ValidationSnapshot): HealthStatus {
  if (status === "error") {
    return "FAILED";
  }

  const structuralFailure = (snapshot.duplicateTicketIds ?? 0) > 0 ||
    (snapshot.assignedWithoutAgentEmail ?? 0) > 0 ||
    (snapshot.closedStatusWithoutClosedTime ?? 0) > 0;

  if (structuralFailure) {
    return "FAILED";
  }

  const hasControlledPending = status === "partial_success" ||
    summary.errorRecords > 0 ||
    (snapshot.closedRawMetricsMissing ?? 0) > 0 ||
    (snapshot.reportPeriodClosedWithoutMtfc ?? 0) > 0;

  return hasControlledPending ? "WARNING" : "SUCCESS";
}

async function createSyncRun(
  supabase: SupabaseClient,
  startedAt: string,
  syncType: string,
  message: string,
  fromDateTime?: string,
  toDateTime?: string,
  executionId?: string,
  initialMeta: JsonRecord = {},
): Promise<string> {
  const snapshot = await collectValidationSnapshot(supabase);
  const syncRunRow: JsonRecord = {
    execution_id: executionId ?? crypto.randomUUID(),
    source: SOURCE,
    sync_type: syncType,
    function_name: FUNCTION_NAME,
    function_version: functionVersion(),
    health_status: "RUNNING",
    status: "running",
    started_at: startedAt,
    total_records: 0,
    success_records: 0,
    error_records: 0,
    raw_metrics_missing_before: snapshot.rawMetricsMissing,
    closed_raw_metrics_missing_before: snapshot.closedRawMetricsMissing,
    current_month_closed_raw_metrics_missing_before: snapshot.currentMonthClosedRawMetricsMissing,
    report_period_closed_without_mtfc_before: snapshot.reportPeriodClosedWithoutMtfc,
    message,
    status_message: message,
    ...initialMeta,
  };

  if (fromDateTime) {
    syncRunRow.from_datetime = fromDateTime;
  }

  if (toDateTime) {
    syncRunRow.to_datetime = toDateTime;
  }

  const result = await supabase
    .from("sync_runs")
    .insert(syncRunRow)
    .select("id")
    .single() as SupabaseCallResult<JsonRecord> | undefined;

  if (!result || result.error) {
    throw new Error(`Falha ao criar sync_run: ${supabaseErrorMessage(result, "retorno vazio do Supabase")}`);
  }

  const syncRunId = toText(result.data?.id);
  if (!syncRunId) {
    throw new Error("sync_runs nao retornou id");
  }

  return syncRunId;
}

async function finishSyncRun(
  supabase: SupabaseClient,
  syncRunId: string,
  status: SyncStatus,
  summary: SyncSummary,
  message: string,
): Promise<void> {
  try {
    const finishedAt = new Date();
    const snapshot = await collectValidationSnapshot(supabase);
    const runResult = await supabase
      .from("sync_runs")
      .select("started_at")
      .eq("id", syncRunId)
      .single() as SupabaseCallResult<JsonRecord> | undefined;
    const startedAtText = toText(runResult?.data?.started_at);
    const startedAtTime = startedAtText ? new Date(startedAtText).getTime() : Number.NaN;
    const durationMs = Number.isFinite(startedAtTime) ? finishedAt.getTime() - startedAtTime : null;
    const healthStatus = classifyHealth(status, summary, snapshot);
    const result = await supabase
    .from("sync_runs")
    .update({
      status,
      health_status: healthStatus,
      status_message: message,
      total_records: summary.totalRecords,
      success_records: summary.successRecords,
      error_records: summary.errorRecords,
      tickets_fetched: summary.ticketsFetched ?? summary.totalRecords,
      tickets_inserted: summary.ticketsInserted ?? 0,
      tickets_updated: summary.ticketsUpdated ?? summary.successRecords,
      tickets_ignored: summary.ticketsIgnored ?? 0,
      metrics_fetched: summary.metricsFetched ?? 0,
      metrics_updated: summary.metricsUpdated ?? 0,
      retryable_errors: summary.retryableErrors ?? 0,
      non_retryable_errors: summary.nonRetryableErrors ?? summary.errorRecords,
      batch_size: summary.batchSize ?? null,
      max_batches: summary.maxBatches ?? null,
      batches_processed: summary.batchesProcessed ?? null,
      tickets_planned: summary.ticketsPlanned ?? summary.totalRecords,
      tickets_processed: summary.ticketsProcessed ?? summary.successRecords,
      tickets_failed: summary.ticketsFailed ?? summary.errorRecords,
      tickets_pending: summary.ticketsPending ?? null,
      has_more: summary.hasMore ?? false,
      next_cursor: summary.nextCursor ?? null,
      open_tickets_total: summary.openTicketsTotal ?? null,
      open_tickets_checked: summary.openTicketsChecked ?? null,
      open_tickets_pending: summary.openTicketsPending ?? null,
      errors_count: summary.errorRecords,
      warnings_count: summary.warningsCount ?? (healthStatus === "WARNING" ? 1 : 0),
      raw_metrics_missing_after: snapshot.rawMetricsMissing,
      closed_raw_metrics_missing_after: snapshot.closedRawMetricsMissing,
      current_month_closed_raw_metrics_missing_after: snapshot.currentMonthClosedRawMetricsMissing,
      report_period_closed_without_mtfc_after: snapshot.reportPeriodClosedWithoutMtfc,
      open_stale_tickets_after: snapshot.openStaleTickets,
      assigned_without_agent_email_after: snapshot.assignedWithoutAgentEmail,
      closed_status_without_closed_time_after: snapshot.closedStatusWithoutClosedTime,
      duplicate_ticket_ids_after: snapshot.duplicateTicketIds,
      tickets_without_region_after: snapshot.ticketsWithoutRegion,
      tickets_without_operational_group_after: snapshot.ticketsWithoutOperationalGroup,
      duration_ms: durationMs,
      duration_seconds: durationMs === null ? null : Math.round(durationMs / 1000),
      observations: summary.observations,
      finished_at: finishedAt.toISOString(),
      message,
    })
      .eq("id", syncRunId) as SupabaseCallResult | undefined;

    if (!result || result.error) {
      console.error(`Falha ao finalizar sync_run ${syncRunId}: ${supabaseErrorMessage(result, "retorno vazio do Supabase")}`);
    }
  } catch (error) {
    console.error(`Falha ao finalizar sync_run ${syncRunId}`, errorMessage(error));
  }
}

async function markStaleRunningSyncRuns(supabase: SupabaseClient): Promise<number> {
  const staleBefore = new Date(Date.now() - STALE_RUNNING_MINUTES * 60 * 1000).toISOString();
  const result = await supabase
    .from("sync_runs")
    .update({
      status: "error",
      health_status: "FAILED",
      finished_at: new Date().toISOString(),
      status_message: `FAILED_STALE: run ficou running por mais de ${STALE_RUNNING_MINUTES} minutos`,
      message: `FAILED_STALE: run ficou running por mais de ${STALE_RUNNING_MINUTES} minutos`,
      observations: "stale_running_guard=true",
    })
    .eq("status", "running")
    .lt("started_at", staleBefore)
    .select("id") as SupabaseCallResult<JsonRecord[]> | undefined;

  if (!result || result.error) {
    console.warn("Falha ao marcar sync_runs running antigos", supabaseErrorMessage(result, "retorno vazio do Supabase"));
    return 0;
  }

  return Array.isArray(result.data) ? result.data.length : 0;
}

async function logError(
  supabase: SupabaseClient,
  syncRunId: string,
  syncType: string,
  ticketId: string | null,
  error: unknown,
  rawPayload: unknown,
  entityType = "ticket",
  endpoint?: string,
): Promise<void> {
  try {
    const httpStatus = httpStatusFromError(error);
    const retryable = isRetryableError(error);
    const errorRow: JsonRecord = {
      run_id: syncRunId,
      execution_id: syncRunId,
      ticket_id: ticketId,
      source: SOURCE,
      sync_type: syncType,
      operation: entityType,
      entity_type: entityType,
      entity_id: ticketId,
      error_type: errorType(error),
      http_status: httpStatus,
      error_message: errorMessage(error),
      raw_error: summarizePayload(rawPayload),
      attempt: 1,
      retryable,
      next_retry_at: retryable ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null,
      payload_summary: summarizePayload(rawPayload),
      created_at: new Date().toISOString(),
    };

    if (endpoint) {
      errorRow.endpoint = endpoint;
    }

    const result = await supabase
      .from("sync_errors")
      .insert(errorRow) as SupabaseCallResult | undefined;

    if (!result || result.error) {
      console.error("Falha ao registrar erro em sync_errors", supabaseErrorMessage(result, "retorno vazio do Supabase"));
    }
  } catch (insertError) {
    console.error("Falha ao registrar erro em sync_errors", errorMessage(insertError));
  }
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

async function resolveIncrementalWindow(
  supabase: SupabaseClient,
  toDateTime: Date,
  lookbackHours: number,
): Promise<IncrementalWindow> {
  const fallbackFromTime = toDateTime.getTime() - lookbackHours * 60 * 60 * 1000;
  let selectedFromTime = fallbackFromTime;
  let checkpointRunId: string | null = null;
  let checkpointToDateTime: string | null = null;
  let source: IncrementalWindow["source"] = "lookback";

  const checkpointResult = await supabase
    .from("sync_runs")
    .select("id,from_datetime,to_datetime")
    .eq("function_name", FUNCTION_NAME)
    .eq("status", "success")
    .eq("health_status", "SUCCESS")
    .eq("has_more", false)
    .in("sync_type", [INCREMENTAL_LOAD_STRATEGY, "modified_window_sync"])
    .not("to_datetime", "is", null)
    .order("to_datetime", { ascending: false })
    .limit(25) as SupabaseCallResult<JsonRecord[]> | undefined;

  if (!checkpointResult || checkpointResult.error) {
    console.warn(
      "Falha ao buscar checkpoint incremental; usando lookback",
      supabaseErrorMessage(checkpointResult, "retorno vazio do Supabase"),
    );
  } else {
    const checkpoints = Array.isArray(checkpointResult.data) ? checkpointResult.data : [];
    const overlapMs = INCREMENTAL_CHECKPOINT_OVERLAP_MINUTES * 60 * 1000;
    let latestCheckpointFromTime = Number.NaN;
    let latestCheckpointToTime = Number.NaN;
    let contiguousFromTime = Number.NaN;
    let gapRepairFromTime = Number.NaN;

    for (const [index, checkpoint] of checkpoints.entries()) {
      const fromText = toText(checkpoint.from_datetime);
      const toTextValue = toText(checkpoint.to_datetime);
      const fromTime = fromText ? new Date(fromText).getTime() : Number.NaN;
      const toTime = toTextValue ? new Date(toTextValue).getTime() : Number.NaN;

      if (!Number.isFinite(toTime)) {
        continue;
      }

      if (index === 0) {
        checkpointRunId = toText(checkpoint.id);
        checkpointToDateTime = new Date(toTime).toISOString();
        latestCheckpointFromTime = fromTime;
        latestCheckpointToTime = toTime;
        contiguousFromTime = Number.isFinite(fromTime) ? fromTime : toTime - overlapMs;
        continue;
      }

      if (!Number.isFinite(contiguousFromTime)) {
        break;
      }

      if (toTime + overlapMs >= contiguousFromTime) {
        if (Number.isFinite(fromTime)) {
          contiguousFromTime = Math.min(contiguousFromTime, fromTime);
        }
        continue;
      }

      checkpointRunId = toText(checkpoint.id);
      checkpointToDateTime = new Date(toTime).toISOString();
      gapRepairFromTime = toTime - overlapMs;
      break;
    }

    if (Number.isFinite(gapRepairFromTime)) {
      selectedFromTime = gapRepairFromTime;
      source = "gap_repair";
    } else if (Number.isFinite(latestCheckpointToTime)) {
      const checkpointFromTime = latestCheckpointToTime - overlapMs;
      selectedFromTime = checkpointFromTime;
      source = Number.isFinite(latestCheckpointFromTime) && checkpointFromTime < fallbackFromTime
        ? "lookback_and_checkpoint"
        : "checkpoint";
    }
  }

  const maxLookbackFromTime = toDateTime.getTime() - MAX_INCREMENTAL_LOOKBACK_HOURS * 60 * 60 * 1000;
  const cappedByMaxLookback = selectedFromTime < maxLookbackFromTime;
  selectedFromTime = Math.max(selectedFromTime, maxLookbackFromTime);

  return {
    fromDateTime: new Date(selectedFromTime),
    toDateTime,
    source,
    checkpointRunId,
    checkpointToDateTime,
    cappedByMaxLookback,
  };
}

async function countOpenTickets(supabase: SupabaseClient): Promise<number | null> {
  const result = await supabase
    .from("vw_tickets_bi_base")
    .select("ticket_id", { count: "exact", head: true })
    .eq("is_open", true) as unknown as { count?: number | null; error?: { message?: string } | null };

  if (result.error) {
    console.warn("Falha ao contar tickets abertos", result.error.message ?? "erro sem mensagem");
    return null;
  }

  return result.count ?? null;
}

async function countRows(
  supabase: SupabaseClient,
  tableName: string,
  build: (query: unknown) => unknown,
): Promise<number | null> {
  const baseQuery = supabase.from(tableName).select("id", { count: "exact", head: true });
  const result = build(baseQuery) as { count?: number | null; error?: { message?: string } | null };

  if (result.error) {
    console.warn(`Falha ao contar ${tableName}`, result.error.message ?? "erro sem mensagem");
    return null;
  }

  return result.count ?? null;
}

Deno.serve(async (req) => {
  let supabase: SupabaseClient | null = null;
  let syncRunId: string | null = null;

  let totalRecords = 0;
  let successRecords = 0;
  let errorRecords = 0;
  let startDate = DEFAULT_START_DATE;
  let endDate = formatDateOnly(new Date());
  let maxPagesPerDepartment = DEFAULT_MAX_PAGES_PER_DEPARTMENT;
  let mode = "window";
  let backfillDepartmentId: string | null = null;
  let backfillStartOffset = 0;
  let backfillNextOffset = 0;
  let backfillPagesRead = 0;
  let backfillFetchedRecords = 0;
  let backfillAcceptedRecords = 0;
  let backfillDuplicateRecords = 0;
  let backfillHasMore = false;
  let agentsPagesRead = 0;
  let agentsHasMore = false;
  let contactsStartOffset = 0;
  let contactsNextOffset = 0;
  let contactsPagesRead = 0;
  let contactsFetchedRecords = 0;
  let contactsHasMore = false;
  let ticketDetailsStartOffset = 0;
  let ticketDetailsNextOffset = 0;
  let ticketDetailsRequestedTickets = DEFAULT_TICKET_DETAILS_MAX_TICKETS;
  let ticketDetailsProcessedRecords = 0;
  let ticketDetailsDeletedRecords = 0;
  let ticketDetailsHasMore = false;
  let ticketMetricsStartOffset = 0;
  let ticketMetricsNextOffset = 0;
  let ticketMetricsRequestedTickets = DEFAULT_TICKET_METRICS_MAX_TICKETS;
  let ticketMetricsProcessedRecords = 0;
  let ticketMetricsHasMore = false;
  let incrementalLookbackHours = DEFAULT_INCREMENTAL_LOOKBACK_HOURS;
  let incrementalMaxPages = DEFAULT_INCREMENTAL_MAX_PAGES;
  let incrementalFromDateTime = "";
  let incrementalToDateTime = "";
  let incrementalWindowSource = "lookback";
  let incrementalCheckpointRunId: string | null = null;
  let incrementalCheckpointToDateTime: string | null = null;
  let incrementalWindowCappedByMaxLookback = false;
  let incrementalPagesRead = 0;
  let incrementalFetchedRecords = 0;
  let incrementalProcessedRecords = 0;
  let incrementalDetailsUpdated = 0;
  let incrementalMetricsUpdated = 0;
  let incrementalTicketsDeleted = 0;
  let incrementalOpenTicketSweepMaxTickets = DEFAULT_OPEN_TICKET_SWEEP_MAX_TICKETS;
  let incrementalOpenTicketSweepProcessed = 0;
  let incrementalOpenTicketSweepUpdated = 0;
  let incrementalMissingMetricsSweepMaxTickets = DEFAULT_MISSING_METRICS_SWEEP_MAX_TICKETS;
  let incrementalMissingMetricsSweepProcessed = 0;
  let incrementalHasMore = false;

  try {
    const requestBody = await readRequestBody(req);
    const requestedMode = toText(requestBody.mode);
    mode = requestedMode === "recent_window_sync"
      ? "incremental"
      : requestedMode === "backfill" || requestedMode === "departments" || requestedMode === "agents" ||
          requestedMode === "contacts" || requestedMode === "ticket_details" || requestedMode === "ticket_metrics" ||
          requestedMode === "incremental" || requestedMode === "modified_window_sync" || requestedMode === "validation_only" ||
          requestedMode === "open_tickets_sweep" || requestedMode === "missing_metrics_sweep" ||
          requestedMode === "single_ticket_debug" || requestedMode === "targeted_reconciliation_backfill" ||
          requestedMode === "targeted_modified_tickets_sync" ||
          requestedMode === "deletion_sweep" || requestedMode === "ticket_history_sync"
      ? requestedMode
      : "window";

    if (mode === "validation_only") {
      supabase = createServiceClient();
      const startedAt = Date.now();
      const params = normalizeIncrementalParams(requestBody);
      const staleRunsMarked = await markStaleRunningSyncRuns(supabase);
      syncRunId = await createSyncRun(
        supabase,
        new Date(startedAt).toISOString(),
        "validation_only",
        "Validacao operacional iniciada",
        undefined,
        undefined,
        crypto.randomUUID(),
        {
          batch_size: params.batchSize,
          max_batches: params.maxBatches,
          has_more: false,
        },
      );
      const snapshot = await collectValidationSnapshot(supabase);
      const runningResult = await supabase
        .from("sync_runs")
        .select("id")
        .eq("status", "running") as SupabaseCallResult<JsonRecord[]> | undefined;
      const runningCount = Array.isArray(runningResult?.data) ? runningResult.data.length : 0;
      const openTicketsTotal = await countOpenTickets(supabase);
      const warningCount = staleRunsMarked > 0 || runningCount > 1 ||
          (snapshot.closedRawMetricsMissing ?? 0) > 0 || (snapshot.rawMetricsMissing ?? 0) > 0
        ? 1
        : 0;
      const status: SyncStatus = warningCount > 0 ? "partial_success" : "success";

      await finishSyncRun(
        supabase,
        syncRunId,
        status,
        {
          totalRecords: 0,
          successRecords: 0,
          errorRecords: 0,
          openTicketsTotal,
          openTicketsPending: snapshot.openStaleTickets,
          warningsCount: warningCount,
          observations: `validation_only=true; stale_runs_marked=${staleRunsMarked}; running_runs=${runningCount}`,
        },
        "Validacao operacional finalizada",
      );

      return jsonResponse({
        status,
        health_status: warningCount > 0 ? "WARNING" : "SUCCESS",
        mode,
        sync_run_id: syncRunId,
        stale_runs_marked: staleRunsMarked,
        running_runs: runningCount,
        open_tickets_total: openTicketsTotal,
        snapshot,
      });
    }

    if (mode === "deletion_sweep") {
      supabase = createServiceClient();
      const startedAt = Date.now();
      const runtimeGuard = createRuntimeGuard(startedAt, DEFAULT_MAX_RUNTIME_SECONDS);

      const requestRecord = asRecord(requestBody);
      const rawMaxTickets = toNumber(requestRecord.maxTickets ?? requestRecord.max_tickets);
      const rawStaleDays = toNumber(requestRecord.staleDays ?? requestRecord.stale_days);
      const dryRun = toBool(requestRecord.dryRun ?? requestRecord.dry_run) ?? false;

      const maxTickets = Math.min(
        rawMaxTickets === null
          ? DEFAULT_DELETION_SWEEP_MAX_TICKETS
          : Math.max(1, Math.trunc(rawMaxTickets)),
        MAX_DELETION_SWEEP_MAX_TICKETS,
      );
      const staleDays = Math.max(
        rawStaleDays === null
          ? DEFAULT_DELETION_SWEEP_STALE_DAYS
          : Math.max(MIN_DELETION_SWEEP_STALE_DAYS, Math.trunc(rawStaleDays)),
        MIN_DELETION_SWEEP_STALE_DAYS,
      );

      const staleRunsMarked = await markStaleRunningSyncRuns(supabase);

      syncRunId = await createSyncRun(
        supabase,
        new Date(startedAt).toISOString(),
        DELETION_SWEEP_LOAD_STRATEGY,
        "Deletion sweep iniciado",
        undefined,
        undefined,
        crypto.randomUUID(),
        { tickets_planned: maxTickets, has_more: true },
      );

      const staleDate = new Date(
        Date.now() - staleDays * 24 * 60 * 60 * 1000,
      ).toISOString();

      const suspectResult = await supabase
        .from("zoho_tickets")
        .select(
          "id, ticket_number, status, modified_time, created_time, regiao, department_id",
        )
        .eq("is_deleted", false)
        .neq("department_id", WORKSHOP_DEPARTMENT_ID)
        .is("closed_time", null)
        .lt("modified_time", staleDate)
        .not("status", "in", '("Fechado","Resolvido","closed","resolved")')
        .order("modified_time", { ascending: true })
        .limit(maxTickets + 1) as SupabaseCallResult<JsonRecord[]> | undefined;

      if (!suspectResult || suspectResult.error) {
        throw new Error(
          `Falha ao buscar tickets suspeitos: ${
            supabaseErrorMessage(suspectResult, "retorno vazio")
          }`,
        );
      }

      const suspects = Array.isArray(suspectResult.data)
        ? suspectResult.data
        : [];
      const ticketsToCheck = suspects.slice(0, maxTickets);
      const hasMore = suspects.length > maxTickets;

      const accessToken = await getZohoAccessToken();

      let ticketsChecked = 0;
      let ticketsMarkedDeleted = 0;
      let ticketsConfirmedExist = 0;
      let checkErrors = 0;
      const deletedTicketNumbers: string[] = [];

      for (const ticket of ticketsToCheck) {
        if (runtimeGuard.shouldStopSweep()) break;

        const ticketId = toText(ticket.id);
        const ticketNumber = toText(ticket.ticket_number);
        if (!ticketId) continue;

        ticketsChecked++;

        try {
          const exists = await checkTicketExistsInZoho(accessToken, ticketId);

          if (!exists) {
            if (!dryRun) {
              const updateResult = await supabase
                .from("zoho_tickets")
                .update({
                  is_deleted: true,
                  synced_at: new Date().toISOString(),
                  updated_in_supabase_at: new Date().toISOString(),
                })
                .eq("id", ticketId) as SupabaseCallResult | undefined;

              if (!updateResult || updateResult.error) {
                console.error(
                  `Falha ao marcar ticket ${ticketNumber} como deletado: ${
                    supabaseErrorMessage(updateResult, "retorno vazio")
                  }`,
                );
                checkErrors++;
                continue;
              }
            }
            ticketsMarkedDeleted++;
            if (ticketNumber) deletedTicketNumbers.push(ticketNumber);
            console.log(
              `Deletion sweep: ticket #${ticketNumber} (id: ${ticketId}) marcado como deletado${
                dryRun ? " [DRY RUN]" : ""
              }`,
            );
          } else {
            ticketsConfirmedExist++;
          }

          await sleep(250);
        } catch (error) {
          checkErrors++;
          await logError(
            supabase,
            syncRunId,
            DELETION_SWEEP_LOAD_STRATEGY,
            ticketId,
            error,
            { ticket_id: ticketId, ticket_number: ticketNumber },
            "deletion_sweep_check",
            `/api/v1/tickets/${ticketId}`,
          );
        }
      }

      const deletionSweepStatus: SyncStatus =
        checkErrors > 0 || hasMore ? "partial_success" : "success";
      const observationParts = [
        `deletion_sweep=true`,
        `dry_run=${dryRun}`,
        `stale_days=${staleDays}`,
        `suspects_found=${suspects.length}`,
        `tickets_checked=${ticketsChecked}`,
        `tickets_marked_deleted=${ticketsMarkedDeleted}`,
        `tickets_confirmed_exist=${ticketsConfirmedExist}`,
        `check_errors=${checkErrors}`,
        `stale_runs_marked=${staleRunsMarked}`,
        deletedTicketNumbers.length > 0
          ? `deleted_numbers=${deletedTicketNumbers.join(",")}`
          : "",
      ].filter(Boolean);

      await finishSyncRun(
        supabase,
        syncRunId,
        deletionSweepStatus,
        {
          totalRecords: ticketsToCheck.length,
          successRecords: ticketsChecked - checkErrors,
          errorRecords: checkErrors,
          ticketsProcessed: ticketsChecked,
          ticketsUpdated: ticketsMarkedDeleted,
          ticketsPending: hasMore ? suspects.length - maxTickets : 0,
          hasMore,
          warningsCount: hasMore || checkErrors > 0 ? 1 : 0,
          observations: observationParts.join("; "),
        },
        "Deletion sweep finalizado",
      );

      return jsonResponse({
        status: deletionSweepStatus,
        mode,
        sync_run_id: syncRunId,
        dry_run: dryRun,
        stale_days: staleDays,
        suspects_found: suspects.length,
        tickets_checked: ticketsChecked,
        tickets_marked_deleted: ticketsMarkedDeleted,
        tickets_confirmed_exist: ticketsConfirmedExist,
        check_errors: checkErrors,
        deleted_ticket_numbers: deletedTicketNumbers,
        has_more: hasMore,
        stale_runs_marked: staleRunsMarked,
        function_version: FUNCTION_CODE_VERSION,
      });
    }

    if (mode === "ticket_history_sync") {
      supabase = createServiceClient();
      const startedAt = Date.now();
      const runtimeGuard = createRuntimeGuard(startedAt, DEFAULT_MAX_RUNTIME_SECONDS);
      const requestRecord = asRecord(requestBody);
      const rawMaxTickets = toNumber(requestRecord.maxTickets ?? requestRecord.max_tickets);
      const maxTickets = Math.min(
        rawMaxTickets === null ? DEFAULT_HISTORY_MAX_TICKETS : Math.max(1, Math.trunc(rawMaxTickets)),
        MAX_HISTORY_MAX_TICKETS,
      );
      const rawStartOffset = toNumber(requestRecord.startOffset ?? requestRecord.start_offset);
      const startOffset = rawStartOffset === null ? 0 : Math.max(0, Math.trunc(rawStartOffset));
      const requestedSyncMode = toText(requestRecord.syncMode ?? requestRecord.sync_mode)?.trim().toLowerCase();
      const syncMode = requestedSyncMode === "all" ? "all" : "recent";
      const dryRun = toBool(requestRecord.dryRun ?? requestRecord.dry_run) ?? false;
      const staleRunsMarked = await markStaleRunningSyncRuns(supabase);

      syncRunId = await createSyncRun(
        supabase,
        new Date(startedAt).toISOString(),
        TICKET_HISTORY_LOAD_STRATEGY,
        `Ticket history sync iniciado (mode=${syncMode})`,
        undefined,
        undefined,
        crypto.randomUUID(),
        { tickets_planned: maxTickets },
      );

      let ticketsQuery = supabase
        .from("zoho_tickets")
        .select("id,ticket_number,status,created_time,closed_time,regiao,modified_time")
        .eq("is_deleted", false)
        .neq("department_id", WORKSHOP_DEPARTMENT_ID)
        .order("modified_time", { ascending: false })
        .range(startOffset, startOffset + maxTickets - 1);

      if (syncMode === "recent") {
        const sinceDate = new Date(Date.now() - HISTORY_STALE_DAYS * 24 * 60 * 60 * 1000).toISOString();
        ticketsQuery = ticketsQuery.gte("modified_time", sinceDate);
      }

      const ticketsResult = await ticketsQuery as SupabaseCallResult<JsonRecord[]> | undefined;
      if (!ticketsResult || ticketsResult.error) {
        throw new Error(
          `Falha ao buscar tickets para historico: ${supabaseErrorMessage(ticketsResult, "retorno vazio")}`,
        );
      }

      const tickets = Array.isArray(ticketsResult.data) ? ticketsResult.data : [];
      const accessToken = await getZohoAccessToken();
      let historyTicketsProcessed = 0;
      let historyEventsInserted = 0;
      let historyErrors = 0;
      let stoppedByRuntimeGuard = false;
      const failedTickets: string[] = [];

      for (const ticket of tickets) {
        if (runtimeGuard.shouldStopSweep()) {
          stoppedByRuntimeGuard = true;
          break;
        }

        const ticketId = toText(ticket.id);
        const ticketNumber = toText(ticket.ticket_number);
        if (!ticketId) {
          continue;
        }

        historyTicketsProcessed += 1;

        try {
          const events = await fetchTicketHistory(accessToken, ticketId);
          const rows = parseHistoryEvents(ticketId, events);

          if (rows.length > 0 && !dryRun) {
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

          historyEventsInserted += rows.length;
          console.log(
            `history_sync: #${ticketNumber} -> ${events.length} eventos totais, ${rows.length} mudancas de status${
              dryRun ? " [DRY RUN]" : ""
            }`,
          );
        } catch (error) {
          historyErrors += 1;
          failedTickets.push(ticketNumber ?? ticketId);
          await logError(
            supabase,
            syncRunId,
            TICKET_HISTORY_LOAD_STRATEGY,
            ticketId,
            error,
            { ticket_id: ticketId, ticket_number: ticketNumber },
            "ticket_history_sync",
            `/api/v1/tickets/${ticketId}/history`,
          );
        }

        await sleep(150);
      }

      const historyStatus: SyncStatus = historyErrors > 0 || stoppedByRuntimeGuard ? "partial_success" : "success";

      await finishSyncRun(
        supabase,
        syncRunId,
        historyStatus,
        {
          totalRecords: tickets.length,
          successRecords: historyTicketsProcessed - historyErrors,
          errorRecords: historyErrors,
          ticketsProcessed: historyTicketsProcessed,
          ticketsUpdated: historyTicketsProcessed - historyErrors,
          metricsFetched: historyEventsInserted,
          metricsUpdated: dryRun ? 0 : historyEventsInserted,
          ticketsPending: stoppedByRuntimeGuard ? Math.max(0, tickets.length - historyTicketsProcessed) : 0,
          hasMore: stoppedByRuntimeGuard,
          warningsCount: historyErrors > 0 || stoppedByRuntimeGuard ? 1 : 0,
          observations: [
            "ticket_history_sync=true",
            `sync_mode=${syncMode}`,
            `start_offset=${startOffset}`,
            `dry_run=${dryRun}`,
            `tickets_processed=${historyTicketsProcessed}`,
            `events_inserted=${historyEventsInserted}`,
            `errors=${historyErrors}`,
            stoppedByRuntimeGuard ? "runtime_guard=true" : "runtime_guard=false",
            failedTickets.length > 0 ? `failed=${failedTickets.slice(0, 10).join(",")}` : "",
            `stale_runs_marked=${staleRunsMarked}`,
          ].filter(Boolean).join("; "),
        },
        "Ticket history sync finalizado",
      );

      return jsonResponse({
        status: historyStatus,
        mode,
        sync_run_id: syncRunId,
        dry_run: dryRun,
        sync_mode: syncMode,
        start_offset: startOffset,
        tickets_processed: historyTicketsProcessed,
        events_inserted: historyEventsInserted,
        errors: historyErrors,
        failed_tickets: failedTickets,
        runtime_guard: stoppedByRuntimeGuard,
        stale_runs_marked: staleRunsMarked,
        function_version: FUNCTION_CODE_VERSION,
      });
    }

    if (mode === "open_tickets_sweep") {
      supabase = createServiceClient();
      const startedAt = Date.now();
      const params = normalizeIncrementalParams(requestBody);
      const runtimeGuard = createRuntimeGuard(startedAt, params.maxRuntimeSeconds);
      const maxTicketsToProcess = params.batchSize * params.maxBatches;
      const staleRunsMarked = await markStaleRunningSyncRuns(supabase);
      const accessToken = await getZohoAccessToken();
      const includeResolution = await ticketResolutionColumnExists(supabase);
      const openTicketsTotal = await countOpenTickets(supabase);
      const cursorState = decodeCursor(params.cursor);

      syncRunId = await createSyncRun(
        supabase,
        new Date(startedAt).toISOString(),
        "open_tickets_sweep",
        "Open tickets sweep iniciado",
        undefined,
        undefined,
        crypto.randomUUID(),
        {
          batch_size: params.batchSize,
          max_batches: params.maxBatches,
          tickets_planned: maxTicketsToProcess,
          has_more: true,
          next_cursor: params.cursor,
        },
      );

      const openTicketsResult = await supabase
        .from("vw_tickets_bi_base")
        .select("ticket_id,ticket_number,status,closed_time,created_time,last_detail_sync_at,department_name,regiao_grupo,grupo_operacional_agente,agent_name,agent_email,priority")
        .eq("is_open", true)
        .order("last_detail_sync_at", { ascending: true, nullsFirst: true })
        .order("created_time", { ascending: true })
        .order("ticket_id", { ascending: true })
        .limit(maxTicketsToProcess + 1) as SupabaseCallResult<JsonRecord[]> | undefined;

      if (!openTicketsResult || openTicketsResult.error) {
        throw new Error(
          `Falha ao buscar tickets abertos para open_tickets_sweep: ${
            supabaseErrorMessage(openTicketsResult, "retorno vazio do Supabase")
          }`,
        );
      }

      const openTickets = Array.isArray(openTicketsResult.data) ? openTicketsResult.data : [];
      const ticketsToProcess = openTickets.slice(0, maxTicketsToProcess);
      let batchesProcessed = 0;
      let ticketsProcessed = 0;
      let ticketsUpdated = 0;
      let ticketsDeleted = 0;
      let metricsUpdated = 0;
      let lastCursor: string | null = params.cursor;
      let stoppedByRuntimeGuard = false;

      for (let batchStart = 0; batchStart < ticketsToProcess.length; batchStart += params.batchSize) {
        if (!runtimeGuard.canStartWork()) {
          stoppedByRuntimeGuard = true;
          break;
        }

        batchesProcessed += 1;
        const batch = ticketsToProcess.slice(batchStart, batchStart + params.batchSize);

        for (const ticket of batch) {
          if (runtimeGuard.shouldStop()) {
            stoppedByRuntimeGuard = true;
            break;
          }

          const ticketId = toText(ticket.ticket_id);
          if (!ticketId) {
            continue;
          }

          const endpoint = ticketDetailEndpoint(ticketId);
          ticketsProcessed += 1;
          lastCursor = encodeCursor(ticketId, toText(ticket.last_detail_sync_at));

          try {
            const detail = await fetchTicketDetail(accessToken, ticketId);
            const detailRow = attachSyncRunId(mapIncrementalTicketDetailToUpdateRow(detail, includeResolution), syncRunId);

            if (!params.dryRun) {
              const detailResult = await supabase
                .from("zoho_tickets")
                .update(detailRow)
                .eq("id", ticketId) as SupabaseCallResult | undefined;

              if (!detailResult || detailResult.error) {
                throw new Error(
                  `Falha no update open_tickets_sweep do ticket ${ticketId}: ${
                    supabaseErrorMessage(detailResult, "retorno vazio do Supabase")
                  }`,
                );
              }
            }

            ticketsUpdated += 1;
            successRecords += 1;

            if (shouldSyncMetricsForTicket(detail, { status: ticket.status, closed_time: ticket.closed_time })) {
              const metricsEndpoint = ticketMetricsEndpoint(ticketId);
              const metrics = await fetchTicketMetrics(accessToken, ticketId);
              const metricsRow = attachSyncRunId(mapIncrementalTicketMetricsToUpdateRow(metrics), syncRunId);

              if (!params.dryRun) {
                const metricsResult = await supabase
                  .from("zoho_tickets")
                  .update(metricsRow)
                  .eq("id", ticketId) as SupabaseCallResult | undefined;

                if (!metricsResult || metricsResult.error) {
                  throw new Error(
                    `Falha no update de metricas open_tickets_sweep do ticket ${ticketId}: ${
                      supabaseErrorMessage(metricsResult, "retorno vazio do Supabase")
                    }`,
                  );
                }
              }

              metricsUpdated += 1;
            }
          } catch (error) {
            if (isZohoTicketDetailNotFoundOrGone(error)) {
              const ticketNumber = toText(ticket.ticket_number);
              const detailHttpStatus = error instanceof ZohoTicketDetailFetchError ? error.httpStatus : null;
              console.log(
                `open_tickets_sweep: ticket #${ticketNumber} retornou ${detailHttpStatus ?? "deleted"} — marcando como deletado${
                  params.dryRun ? " [DRY RUN]" : ""
                }`,
              );

              try {
                await markZohoTicketDeletedInSupabase(supabase, ticketId, params.dryRun);
                ticketsUpdated += 1;
                ticketsDeleted += 1;
                successRecords += 1;
              } catch (deleteError) {
                errorRecords += 1;
                await logError(
                  supabase,
                  syncRunId,
                  "open_tickets_sweep",
                  ticketId,
                  deleteError,
                  { ticket_id: ticketId, ticket_number: ticketNumber, reason: "failed_to_mark_deleted_after_missing_or_gone" },
                  "open_tickets_sweep_mark_deleted",
                  endpoint,
                );
              }
              continue;
            }

            errorRecords += 1;
            await logError(
              supabase,
              syncRunId,
              "open_tickets_sweep",
              ticketId,
              error,
              ticketDetailRawError(error, { ticket, endpoint }),
              "open_tickets_sweep",
              endpoint,
            );
          }
        }

        if (stoppedByRuntimeGuard) {
          break;
        }
      }

      const remainingFromFetch = Math.max(0, ticketsToProcess.length - ticketsProcessed);
      const openTicketsPending = openTicketsTotal === null ? null : Math.max(0, openTicketsTotal - ticketsProcessed);
      const hasMore = openTickets.length > maxTicketsToProcess || stoppedByRuntimeGuard ||
        remainingFromFetch > 0 || (openTicketsPending ?? 0) > 0;
      const status: SyncStatus = hasMore || errorRecords > 0 || staleRunsMarked > 0 ? "partial_success" : "success";
      const message = stoppedByRuntimeGuard
        ? "Open tickets sweep pausado por guarda de tempo"
        : hasMore
        ? "Open tickets sweep finalizado com pendencias controladas"
        : "Open tickets sweep finalizado";

      await finishSyncRun(
        supabase,
        syncRunId,
        status,
        {
          totalRecords: ticketsToProcess.length,
          successRecords,
          errorRecords,
          ticketsFetched: openTickets.length,
          ticketsUpdated,
          ticketsDeleted,
          metricsFetched: metricsUpdated + errorRecords,
          metricsUpdated,
          retryableErrors: 0,
          nonRetryableErrors: errorRecords,
          batchSize: params.batchSize,
          maxBatches: params.maxBatches,
          batchesProcessed,
          ticketsPlanned: maxTicketsToProcess,
          ticketsProcessed,
          ticketsFailed: errorRecords,
          ticketsPending: openTicketsPending,
          hasMore,
          nextCursor: hasMore ? lastCursor : null,
          openTicketsTotal,
          openTicketsChecked: ticketsProcessed,
          openTicketsPending,
          warningsCount: hasMore || staleRunsMarked > 0 ? 1 : 0,
          observations:
            `stale_runs_marked=${staleRunsMarked}; runtime_guard=${stoppedByRuntimeGuard}; dry_run=${params.dryRun}`,
        },
        message,
      );

      return jsonResponse({
        status,
        health_status: status === "success" ? "SUCCESS" : "WARNING",
        mode,
        sync_run_id: syncRunId,
        batch_size: params.batchSize,
        max_batches: params.maxBatches,
        batches_processed: batchesProcessed,
        tickets_planned: maxTicketsToProcess,
        tickets_processed: ticketsProcessed,
        tickets_updated: ticketsUpdated,
        tickets_deleted: ticketsDeleted,
        metrics_updated: metricsUpdated,
        tickets_pending: openTicketsPending,
        has_more: hasMore,
        next_cursor: hasMore ? lastCursor : null,
        runtime_guard_stopped: stoppedByRuntimeGuard,
        stale_runs_marked: staleRunsMarked,
      });
    }

    if (mode === "missing_metrics_sweep") {
      supabase = createServiceClient();
      const startedAt = Date.now();
      const params = normalizeIncrementalParams(requestBody);
      const runtimeGuard = createRuntimeGuard(startedAt, params.maxRuntimeSeconds);
      const requestRecord = asRecord(requestBody);
      const onlyClosed = toBool(requestRecord.onlyClosed ?? requestRecord.only_closed) ?? false;
      const rawLimit = toNumber(requestRecord.limit);
      const maxTicketsToProcess = Math.min(
        rawLimit === null ? params.batchSize * params.maxBatches : Math.max(1, Math.trunc(rawLimit)),
        params.batchSize * params.maxBatches,
      );
      const staleRunsMarked = await markStaleRunningSyncRuns(supabase);
      const accessToken = await getZohoAccessToken();

      syncRunId = await createSyncRun(
        supabase,
        new Date(startedAt).toISOString(),
        "missing_metrics_sweep",
        "Missing metrics sweep iniciado",
        undefined,
        undefined,
        crypto.randomUUID(),
        {
          batch_size: params.batchSize,
          max_batches: params.maxBatches,
          tickets_planned: maxTicketsToProcess,
          has_more: true,
          next_cursor: params.cursor,
        },
      );

      let query = supabase
        .from("zoho_tickets")
        .select("id,ticket_number,status,created_time,closed_time,last_metrics_sync_at,raw_metrics")
        .is("raw_metrics", null)
        .order("closed_time", { ascending: false, nullsFirst: false })
        .order("created_time", { ascending: false })
        .limit(maxTicketsToProcess + 1);

      if (onlyClosed) {
        query = query.not("closed_time", "is", null);
      }

      const missingMetricsResult = await query as SupabaseCallResult<JsonRecord[]> | undefined;

      if (!missingMetricsResult || missingMetricsResult.error) {
        throw new Error(
          `Falha ao buscar tickets sem raw_metrics: ${
            supabaseErrorMessage(missingMetricsResult, "retorno vazio do Supabase")
          }`,
        );
      }

      const missingMetricTickets = Array.isArray(missingMetricsResult.data) ? missingMetricsResult.data : [];
      const ticketsToProcess = missingMetricTickets.slice(0, maxTicketsToProcess);
      let batchesProcessed = 0;
      let ticketsProcessed = 0;
      let metricsUpdated = 0;
      let lastCursor: string | null = params.cursor;
      let stoppedByRuntimeGuard = false;

      for (let batchStart = 0; batchStart < ticketsToProcess.length; batchStart += params.batchSize) {
        if (!runtimeGuard.canStartWork()) {
          stoppedByRuntimeGuard = true;
          break;
        }

        batchesProcessed += 1;
        const batch = ticketsToProcess.slice(batchStart, batchStart + params.batchSize);

        for (const ticket of batch) {
          if (runtimeGuard.shouldStop()) {
            stoppedByRuntimeGuard = true;
            break;
          }

          const ticketId = toText(ticket.id);
          if (!ticketId) {
            continue;
          }

          ticketsProcessed += 1;
          lastCursor = encodeCursor(ticketId, toText(ticket.last_metrics_sync_at));
          const endpoint = ticketMetricsEndpoint(ticketId);

          try {
            const metrics = await fetchTicketMetrics(accessToken, ticketId);
            const row = attachSyncRunId(mapIncrementalTicketMetricsToUpdateRow(metrics), syncRunId);

            if (!params.dryRun) {
              const result = await supabase
                .from("zoho_tickets")
                .update(row)
                .eq("id", ticketId) as SupabaseCallResult | undefined;

              if (!result || result.error) {
                throw new Error(
                  `Falha no update missing_metrics_sweep do ticket ${ticketId}: ${
                    supabaseErrorMessage(result, "retorno vazio do Supabase")
                  }`,
                );
              }
            }

            metricsUpdated += 1;
            successRecords += 1;
          } catch (error) {
            errorRecords += 1;
            await logError(
              supabase,
              syncRunId,
              "missing_metrics_sweep",
              ticketId,
              error,
              ticketMetricsRawError(error, { ticket, endpoint }),
              "missing_metrics_sweep",
              endpoint,
            );
          }
        }

        if (stoppedByRuntimeGuard) {
          break;
        }
      }

      const hasMore = missingMetricTickets.length > maxTicketsToProcess || stoppedByRuntimeGuard ||
        ticketsProcessed < ticketsToProcess.length;
      const status: SyncStatus = hasMore || errorRecords > 0 || staleRunsMarked > 0 ? "partial_success" : "success";
      const message = stoppedByRuntimeGuard
        ? "Missing metrics sweep pausado por guarda de tempo"
        : hasMore
        ? "Missing metrics sweep finalizado com pendencias controladas"
        : "Missing metrics sweep finalizado";

      await finishSyncRun(
        supabase,
        syncRunId,
        status,
        {
          totalRecords: ticketsToProcess.length,
          successRecords,
          errorRecords,
          ticketsFetched: missingMetricTickets.length,
          ticketsUpdated: metricsUpdated,
          metricsFetched: metricsUpdated + errorRecords,
          metricsUpdated,
          retryableErrors: 0,
          nonRetryableErrors: errorRecords,
          batchSize: params.batchSize,
          maxBatches: params.maxBatches,
          batchesProcessed,
          ticketsPlanned: maxTicketsToProcess,
          ticketsProcessed,
          ticketsFailed: errorRecords,
          ticketsPending: hasMore ? Math.max(0, missingMetricTickets.length - ticketsProcessed) : 0,
          hasMore,
          nextCursor: hasMore ? lastCursor : null,
          warningsCount: hasMore || staleRunsMarked > 0 ? 1 : 0,
          observations:
            `stale_runs_marked=${staleRunsMarked}; runtime_guard=${stoppedByRuntimeGuard}; only_closed=${onlyClosed}; dry_run=${params.dryRun}`,
        },
        message,
      );

      return jsonResponse({
        status,
        health_status: status === "success" ? "SUCCESS" : "WARNING",
        mode,
        sync_run_id: syncRunId,
        only_closed: onlyClosed,
        batch_size: params.batchSize,
        max_batches: params.maxBatches,
        batches_processed: batchesProcessed,
        tickets_planned: maxTicketsToProcess,
        tickets_processed: ticketsProcessed,
        metrics_updated: metricsUpdated,
        has_more: hasMore,
        next_cursor: hasMore ? lastCursor : null,
        runtime_guard_stopped: stoppedByRuntimeGuard,
        stale_runs_marked: staleRunsMarked,
      });
    }

    if (mode === "single_ticket_debug") {
      supabase = createServiceClient();
      const startedAt = Date.now();
      const params = normalizeIncrementalParams(requestBody);
      const requestRecord = asRecord(requestBody);
      const ticketId = toText(requestRecord.ticketId ?? requestRecord.ticket_id)?.trim();
      if (!ticketId) {
        throw new BadRequestError("ticketId e obrigatorio no modo single_ticket_debug");
      }

      await markStaleRunningSyncRuns(supabase);
      syncRunId = await createSyncRun(
        supabase,
        new Date(startedAt).toISOString(),
        "single_ticket_debug",
        `Single ticket debug iniciado para ${ticketId}`,
      );
      const accessToken = await getZohoAccessToken();
      const includeResolution = await ticketResolutionColumnExists(supabase);
      let detail: JsonRecord;
      try {
        detail = await fetchTicketDetail(accessToken, ticketId);
      } catch (error) {
        if (!isZohoTicketNotFoundError(error)) {
          throw error;
        }

        await deleteZohoTicketFromSupabase(supabase, ticketId, params.dryRun);
        await finishSyncRun(
          supabase,
          syncRunId,
          "success",
          {
            totalRecords: 1,
            successRecords: 1,
            errorRecords: 0,
            ticketsProcessed: 1,
            ticketsDeleted: params.dryRun ? 0 : 1,
            observations: `single_ticket_debug=${ticketId}; zoho_not_found_deleted=true; dry_run=${params.dryRun}`,
          },
          `Single ticket debug removeu ticket excluido no ZohoDesk ${ticketId}`,
        );

        return jsonResponse({
          status: "success",
          mode,
          sync_run_id: syncRunId,
          ticket_id: ticketId,
          zoho_not_found_deleted: true,
          tickets_deleted: params.dryRun ? 0 : 1,
          dry_run: params.dryRun,
        });
      }

      const metrics = await fetchTicketMetrics(accessToken, ticketId);

      if (!params.dryRun) {
        const detailResult = await supabase
          .from("zoho_tickets")
          .update(attachSyncRunId(mapIncrementalTicketDetailToUpdateRow(detail, includeResolution), syncRunId))
          .eq("id", ticketId) as SupabaseCallResult | undefined;

        if (!detailResult || detailResult.error) {
          throw new Error(`Falha no update single_ticket_debug: ${supabaseErrorMessage(detailResult, "retorno vazio")}`);
        }

        const metricsResult = await supabase
          .from("zoho_tickets")
          .update(attachSyncRunId(mapIncrementalTicketMetricsToUpdateRow(metrics), syncRunId))
          .eq("id", ticketId) as SupabaseCallResult | undefined;

        if (!metricsResult || metricsResult.error) {
          throw new Error(`Falha no update metrics single_ticket_debug: ${supabaseErrorMessage(metricsResult, "retorno vazio")}`);
        }
      }

      await finishSyncRun(
        supabase,
        syncRunId,
        "success",
        {
          totalRecords: 1,
          successRecords: 1,
          errorRecords: 0,
          ticketsProcessed: 1,
          ticketsUpdated: params.dryRun ? 0 : 1,
          metricsFetched: 1,
          metricsUpdated: params.dryRun ? 0 : 1,
          observations: `single_ticket_debug=${ticketId}; dry_run=${params.dryRun}`,
        },
        `Single ticket debug finalizado para ${ticketId}`,
      );

      return jsonResponse({
        status: "success",
        mode,
        sync_run_id: syncRunId,
        ticket_id: ticketId,
        dry_run: params.dryRun,
        detail_status: detail.status,
        detail_closed_time: detail.closedTime ?? detail.closed_time,
        metrics_preview: summarizePayload(metrics),
      });
    }

    if (mode === "targeted_reconciliation_backfill" || mode === "targeted_modified_tickets_sync") {
      supabase = createServiceClient();
      const startedAt = Date.now();
      const requestRecord = asRecord(requestBody);
      const rawTicketIds = Array.isArray(requestRecord.ticketIds)
        ? requestRecord.ticketIds
        : Array.isArray(requestRecord.ticket_ids)
        ? requestRecord.ticket_ids
        : [];
      const ticketIds = rawTicketIds
        .map((value) => toText(value)?.trim())
        .filter((value): value is string => Boolean(value));

      if (ticketIds.length === 0) {
        throw new BadRequestError("ticketIds e obrigatorio no modo targeted");
      }

      const maxTickets = Math.min(ticketIds.length, 50);
      const ticketsToProcess = ticketIds.slice(0, maxTickets);

      await markStaleRunningSyncRuns(supabase);
      syncRunId = await createSyncRun(
        supabase,
        new Date(startedAt).toISOString(),
        mode,
        `${mode} iniciado para ${ticketsToProcess.length} tickets`,
      );

      const accessToken = await getZohoAccessToken();
      const includeResolution = await ticketResolutionColumnExists(supabase);
      let detailsUpdated = 0;
      let ticketsDeleted = 0;
      let metricsUpdated = 0;

      for (const ticketId of ticketsToProcess) {
        const detailEndpoint = ticketDetailEndpoint(ticketId);
        try {
          const detail = await fetchTicketDetail(accessToken, ticketId);
          const detailRow = attachSyncRunId(
            mapIncrementalTicketDetailToUpdateRow(detail, includeResolution),
            syncRunId,
          );
          detailRow.id = toText(detail.id) ?? ticketId;

          const detailResult = await supabase
            .from("zoho_tickets")
            .upsert(detailRow, { onConflict: "id" }) as SupabaseCallResult | undefined;

          if (!detailResult || detailResult.error) {
            throw new Error(`Falha no upsert targeted detail do ticket ${ticketId}: ${supabaseErrorMessage(detailResult, "retorno vazio")}`);
          }

          detailsUpdated += 1;
        } catch (error) {
          if (isZohoTicketNotFoundError(error)) {
            await deleteZohoTicketFromSupabase(supabase, ticketId);
            ticketsDeleted += 1;
            continue;
          }

          errorRecords += 1;
          await logError(
            supabase,
            syncRunId,
            mode,
            ticketId,
            error,
            ticketDetailRawError(error, { ticket_id: ticketId, endpoint: detailEndpoint }),
            "targeted_reconciliation_detail",
            detailEndpoint,
          );
          continue;
        }

        const metricsEndpoint = ticketMetricsEndpoint(ticketId);
        try {
          const metrics = await fetchTicketMetrics(accessToken, ticketId);
          const metricsRow = attachSyncRunId(mapIncrementalTicketMetricsToUpdateRow(metrics), syncRunId);
          const metricsResult = await supabase
            .from("zoho_tickets")
            .update(metricsRow)
            .eq("id", ticketId) as SupabaseCallResult | undefined;

          if (!metricsResult || metricsResult.error) {
            throw new Error(`Falha no update targeted metrics do ticket ${ticketId}: ${supabaseErrorMessage(metricsResult, "retorno vazio")}`);
          }

          metricsUpdated += 1;
        } catch (error) {
          errorRecords += 1;
          await logError(
            supabase,
            syncRunId,
            mode,
            ticketId,
            error,
            ticketMetricsRawError(error, { ticket_id: ticketId, endpoint: metricsEndpoint }),
            "targeted_reconciliation_metrics",
            metricsEndpoint,
          );
        }
      }

      const status: SyncStatus = errorRecords === 0 ? "success" : "partial_success";
      await finishSyncRun(
        supabase,
        syncRunId,
        status,
        {
          totalRecords: ticketsToProcess.length,
          successRecords: detailsUpdated + ticketsDeleted,
          errorRecords,
          ticketsProcessed: ticketsToProcess.length,
          ticketsUpdated: detailsUpdated,
          ticketsDeleted,
          metricsFetched: metricsUpdated + Math.max(0, errorRecords - (ticketsToProcess.length - detailsUpdated)),
          metricsUpdated,
          ticketsPending: Math.max(0, ticketIds.length - ticketsToProcess.length),
          hasMore: ticketIds.length > ticketsToProcess.length,
          observations: `${mode}; requested=${ticketIds.length}; processed=${ticketsToProcess.length}`,
        },
        `${mode} finalizado para ${ticketsToProcess.length} tickets`,
      );

      return jsonResponse({
        status,
        health_status: status === "success" ? "SUCCESS" : "WARNING",
        mode,
        sync_run_id: syncRunId,
        requested_tickets: ticketIds.length,
        processed_tickets: ticketsToProcess.length,
        details_updated: detailsUpdated,
        tickets_deleted: ticketsDeleted,
        metrics_updated: metricsUpdated,
        error_records: errorRecords,
        has_more: ticketIds.length > ticketsToProcess.length,
        pending_tickets: Math.max(0, ticketIds.length - ticketsToProcess.length),
      });
    }

    if (mode === "incremental" || mode === "modified_window_sync") {
      const startedAtMs = Date.now();
      const incrementalParams = normalizeIncrementalParams(requestBody);
      const runtimeGuard = createRuntimeGuard(startedAtMs, incrementalParams.maxRuntimeSeconds);
      let runtimeGuardStopped = false;
      let optionalSweepRuntimeStopped = false;
      incrementalLookbackHours = incrementalParams.lookbackHours;
      incrementalMaxPages = incrementalParams.maxPages;
      incrementalOpenTicketSweepMaxTickets = incrementalParams.openTicketSweepMaxTickets;
      incrementalMissingMetricsSweepMaxTickets = incrementalParams.missingMetricsSweepMaxTickets;

      supabase = createServiceClient();
      const staleRunsMarkedForIncremental = await markStaleRunningSyncRuns(supabase);
      const toDateTime = new Date();
      const incrementalWindow = await resolveIncrementalWindow(supabase, toDateTime, incrementalLookbackHours);
      const fromDateTime = incrementalWindow.fromDateTime;
      incrementalToDateTime = incrementalWindow.toDateTime.toISOString();
      incrementalFromDateTime = incrementalWindow.fromDateTime.toISOString();
      incrementalWindowSource = incrementalWindow.source;
      incrementalCheckpointRunId = incrementalWindow.checkpointRunId;
      incrementalCheckpointToDateTime = incrementalWindow.checkpointToDateTime;
      incrementalWindowCappedByMaxLookback = incrementalWindow.cappedByMaxLookback;
      const incrementalSyncType = mode === "modified_window_sync" ? "modified_window_sync" : INCREMENTAL_LOAD_STRATEGY;

      syncRunId = await createSyncRun(
        supabase,
        new Date(startedAtMs).toISOString(),
        incrementalSyncType,
        `${incrementalSyncType} iniciada`,
        incrementalFromDateTime,
        incrementalToDateTime,
        crypto.randomUUID(),
        {
          batch_size: incrementalParams.batchSize,
          max_batches: incrementalParams.maxBatches,
          has_more: true,
        },
      );

      const accessToken = await getZohoAccessToken();
      const includeResolution = incrementalParams.includeDetails
        ? await ticketResolutionColumnExists(supabase)
        : false;
      const seenTicketIds = new Set<string>();
      const ticketsToProcess: ZohoTicket[] = [];
      let incrementalPageLimitReached = false;

      for (const departmentId of DEPARTMENT_IDS) {
        for (let pageIndex = 0; pageIndex < incrementalMaxPages; pageIndex += 1) {
          if (!runtimeGuard.canStartWork()) {
            runtimeGuardStopped = true;
            incrementalHasMore = true;
            break;
          }

          if (ticketsToProcess.length >= MAX_INCREMENTAL_TICKETS) {
            incrementalHasMore = true;
            break;
          }

          const pageFrom = pageIndex * PAGE_LIMIT;
          const tickets = await fetchRecentTicketsPage(accessToken, pageFrom, departmentId);
          incrementalPagesRead += 1;
          incrementalFetchedRecords += tickets.length;
          const reachedOlderBoundary = tickets.some((ticket) => isTicketOlderThanIncrementalWindow(ticket, fromDateTime));

          for (const ticket of tickets) {
            if (ticketsToProcess.length >= MAX_INCREMENTAL_TICKETS) {
              incrementalHasMore = true;
              break;
            }

            if (!isTicketInsideIncrementalWindow(ticket, fromDateTime, toDateTime)) {
              continue;
            }

            const ticketId = toText(ticket.id);

            if (ticketId && seenTicketIds.has(ticketId)) {
              continue;
            }

            if (ticketId) {
              seenTicketIds.add(ticketId);
            }

            ticketsToProcess.push(ticket);
          }

          if (tickets.length < PAGE_LIMIT) {
            break;
          }

          if (reachedOlderBoundary) {
            break;
          }

          if (pageIndex === incrementalMaxPages - 1) {
            incrementalPageLimitReached = true;
            incrementalHasMore = true;
          }
        }

        if (runtimeGuardStopped || ticketsToProcess.length >= MAX_INCREMENTAL_TICKETS) {
          break;
        }
      }

      totalRecords = ticketsToProcess.length;
      incrementalProcessedRecords = ticketsToProcess.length;
      incrementalHasMore = incrementalHasMore || incrementalPageLimitReached || ticketsToProcess.length >= MAX_INCREMENTAL_TICKETS;

      for (const ticket of ticketsToProcess) {
        if (runtimeGuard.shouldStop()) {
          runtimeGuardStopped = true;
          incrementalHasMore = true;
          break;
        }

        const ticketId = toText(ticket.id);

        try {
          const row = attachSyncRunId(mapIncrementalTicketToUpsertRow(ticket), syncRunId);
          const result = await supabase
            .from("zoho_tickets")
            .upsert(row, { onConflict: "id" }) as SupabaseCallResult | undefined;

          if (!result || result.error) {
            throw new Error(
              `Falha no upsert incremental do ticket ${ticketId ?? "sem id"}: ${
                supabaseErrorMessage(result, "retorno vazio do Supabase")
              }`,
            );
          }

          successRecords += 1;
        } catch (error) {
          errorRecords += 1;
          await logError(
            supabase,
            syncRunId,
            incrementalSyncType,
            ticketId,
            error,
            ticket,
            "zoho_ticket_incremental",
            "/api/v1/tickets",
          );
          continue;
        }

        if (incrementalParams.includeDetails && ticketId) {
          const endpoint = ticketDetailEndpoint(ticketId);

          try {
            const detail = await fetchTicketDetail(accessToken, ticketId);
            const row = attachSyncRunId(mapIncrementalTicketDetailToUpdateRow(detail, includeResolution), syncRunId);
            const result = await supabase
              .from("zoho_tickets")
              .update(row)
              .eq("id", ticketId) as SupabaseCallResult | undefined;

            if (!result || result.error) {
              throw new Error(
                `Falha no update incremental do detalhe do ticket ${ticketId}: ${
                  supabaseErrorMessage(result, "retorno vazio do Supabase")
                }`,
              );
            }

            incrementalDetailsUpdated += 1;
          } catch (error) {
            if (isZohoTicketNotFoundError(error)) {
              await deleteZohoTicketFromSupabase(supabase, ticketId, incrementalParams.dryRun);
              incrementalTicketsDeleted += 1;
              continue;
            }

            errorRecords += 1;
            await logError(
              supabase,
              syncRunId,
              incrementalSyncType,
              ticketId,
              error,
              ticketDetailRawError(error, { ticket, endpoint }),
              "zoho_ticket_incremental_detail",
              endpoint,
            );
          }
        }

        if (incrementalParams.includeMetrics && ticketId) {
          const endpoint = ticketMetricsEndpoint(ticketId);

          try {
            const metrics = await fetchTicketMetrics(accessToken, ticketId);
            const row = attachSyncRunId(mapIncrementalTicketMetricsToUpdateRow(metrics), syncRunId);
            const result = await supabase
              .from("zoho_tickets")
              .update(row)
              .eq("id", ticketId) as SupabaseCallResult | undefined;

            if (!result || result.error) {
              throw new Error(
                `Falha no update incremental das metricas do ticket ${ticketId}: ${
                  supabaseErrorMessage(result, "retorno vazio do Supabase")
                }`,
              );
            }

            incrementalMetricsUpdated += 1;
          } catch (error) {
            errorRecords += 1;
            await logError(
              supabase,
              syncRunId,
              incrementalSyncType,
              ticketId,
              error,
              ticketMetricsRawError(error, { ticket, endpoint }),
              "zoho_ticket_incremental_metrics",
              endpoint,
            );
          }
        }
      }

      if (
        incrementalParams.includeDetails &&
        incrementalParams.includeOpenTicketSweep &&
        !incrementalHasMore &&
        runtimeGuard.remainingMs() > OPTIONAL_SWEEP_MIN_REMAINING_MS
      ) {
        const openTicketsResult = await supabase
          .from("vw_tickets_bi_base")
          .select("ticket_id,ticket_number,status,closed_time,last_detail_sync_at")
          .eq("is_open", true)
          .order("last_detail_sync_at", { ascending: true, nullsFirst: true })
          .order("created_time", { ascending: true })
          .limit(incrementalParams.openTicketSweepMaxTickets) as SupabaseCallResult<JsonRecord[]> | undefined;

        if (!openTicketsResult || openTicketsResult.error) {
          throw new Error(
            `Falha ao buscar tickets abertos para varredura incremental: ${
              supabaseErrorMessage(openTicketsResult, "retorno vazio do Supabase")
            }`,
          );
        }

        const openTickets = Array.isArray(openTicketsResult.data) ? openTicketsResult.data : [];

        for (const ticket of openTickets) {
          if (runtimeGuard.shouldStop()) {
            runtimeGuardStopped = true;
            optionalSweepRuntimeStopped = true;
            break;
          }

          const ticketId = toText(ticket.ticket_id) ?? toText(ticket.id);

          if (!ticketId || seenTicketIds.has(ticketId)) {
            continue;
          }

          seenTicketIds.add(ticketId);
          incrementalOpenTicketSweepProcessed += 1;
          const endpoint = ticketDetailEndpoint(ticketId);

          try {
            const detail = await fetchTicketDetail(accessToken, ticketId);
            const row = attachSyncRunId(mapIncrementalTicketDetailToUpdateRow(detail, includeResolution), syncRunId);
            const result = await supabase
              .from("zoho_tickets")
              .update(row)
              .eq("id", ticketId) as SupabaseCallResult | undefined;

            if (!result || result.error) {
              throw new Error(
                `Falha no update incremental do ticket aberto ${ticketId}: ${
                  supabaseErrorMessage(result, "retorno vazio do Supabase")
                }`,
              );
            }

            incrementalOpenTicketSweepUpdated += 1;
            incrementalDetailsUpdated += 1;
          } catch (error) {
            if (isZohoTicketDetailNotFoundOrGone(error)) {
              const ticketNumber = toText(ticket.ticket_number);
              const detailHttpStatus = error instanceof ZohoTicketDetailFetchError ? error.httpStatus : null;
              console.log(
                `incremental open_sweep: ticket #${ticketNumber} retornou ${detailHttpStatus ?? "deleted"} — marcando como deletado${
                  incrementalParams.dryRun ? " [DRY RUN]" : ""
                }`,
              );

              try {
                await markZohoTicketDeletedInSupabase(supabase, ticketId, incrementalParams.dryRun);
                incrementalOpenTicketSweepUpdated += 1;
                incrementalTicketsDeleted += 1;
              } catch (deleteError) {
                errorRecords += 1;
                await logError(
                  supabase,
                  syncRunId,
                  incrementalSyncType,
                  ticketId,
                  deleteError,
                  { ticket_id: ticketId, ticket_number: ticketNumber, reason: "failed_to_mark_deleted_after_missing_or_gone" },
                  "zoho_ticket_incremental_open_sweep_mark_deleted",
                  endpoint,
                );
              }
              continue;
            }

            errorRecords += 1;
            await logError(
              supabase,
              syncRunId,
              incrementalSyncType,
              ticketId,
              error,
              ticketDetailRawError(error, { ticket, endpoint }),
              "zoho_ticket_incremental_open_sweep",
              endpoint,
            );
          }

          if (incrementalParams.includeMetrics) {
            const metricsEndpoint = ticketMetricsEndpoint(ticketId);

            try {
              const metrics = await fetchTicketMetrics(accessToken, ticketId);
              const row = attachSyncRunId(mapIncrementalTicketMetricsToUpdateRow(metrics), syncRunId);
              const result = await supabase
                .from("zoho_tickets")
                .update(row)
                .eq("id", ticketId) as SupabaseCallResult | undefined;

              if (!result || result.error) {
                throw new Error(
                  `Falha no update incremental das metricas do ticket aberto ${ticketId}: ${
                    supabaseErrorMessage(result, "retorno vazio do Supabase")
                  }`,
                );
              }

              incrementalMetricsUpdated += 1;
            } catch (error) {
              errorRecords += 1;
              await logError(
                supabase,
                syncRunId,
                incrementalSyncType,
                ticketId,
                error,
                ticketMetricsRawError(error, { ticket, endpoint: metricsEndpoint }),
                "zoho_ticket_incremental_open_sweep_metrics",
                metricsEndpoint,
              );
            }
          }
        }
      }

      if (
        incrementalParams.includeMissingMetricsSweep &&
        !incrementalHasMore &&
        runtimeGuard.remainingMs() > OPTIONAL_SWEEP_MIN_REMAINING_MS
      ) {
        const missingMetricsResult = await supabase
          .from("zoho_tickets")
          .select("id,ticket_number,created_time,closed_time,last_metrics_sync_at")
          .is("raw_metrics", null)
          .order("closed_time", { ascending: false, nullsFirst: false })
          .order("created_time", { ascending: false })
          .limit(incrementalParams.missingMetricsSweepMaxTickets) as SupabaseCallResult<JsonRecord[]> | undefined;

        if (!missingMetricsResult || missingMetricsResult.error) {
          throw new Error(
            `Falha ao buscar tickets fechados sem metricas para varredura incremental: ${
              supabaseErrorMessage(missingMetricsResult, "retorno vazio do Supabase")
            }`,
          );
        }

        const missingMetricTickets = Array.isArray(missingMetricsResult.data) ? missingMetricsResult.data : [];

        for (const ticket of missingMetricTickets) {
          if (runtimeGuard.shouldStop()) {
            runtimeGuardStopped = true;
            optionalSweepRuntimeStopped = true;
            break;
          }

          const ticketId = toText(ticket.id);

          if (!ticketId || seenTicketIds.has(ticketId)) {
            continue;
          }

          seenTicketIds.add(ticketId);
          incrementalMissingMetricsSweepProcessed += 1;
          const endpoint = ticketMetricsEndpoint(ticketId);

          try {
            const metrics = await fetchTicketMetrics(accessToken, ticketId);
            const row = attachSyncRunId(mapIncrementalTicketMetricsToUpdateRow(metrics), syncRunId);
            const result = await supabase
              .from("zoho_tickets")
              .update(row)
              .eq("id", ticketId) as SupabaseCallResult | undefined;

            if (!result || result.error) {
              throw new Error(
                `Falha no update incremental das metricas faltantes do ticket ${ticketId}: ${
                  supabaseErrorMessage(result, "retorno vazio do Supabase")
                }`,
              );
            }

            incrementalMetricsUpdated += 1;
          } catch (error) {
            errorRecords += 1;
            await logError(
              supabase,
              syncRunId,
              incrementalSyncType,
              ticketId,
              error,
              ticketMetricsRawError(error, { ticket, endpoint }),
              "zoho_ticket_incremental_missing_metrics",
              endpoint,
            );
          }
        }
      }

      const status: SyncStatus = errorRecords === 0 && !incrementalHasMore && staleRunsMarkedForIncremental === 0
        ? "success"
        : "partial_success";
      totalRecords += incrementalMissingMetricsSweepProcessed;
      const summary: SyncSummary = {
        totalRecords,
        successRecords,
        errorRecords,
        ticketsFetched: incrementalFetchedRecords + incrementalOpenTicketSweepProcessed + incrementalMissingMetricsSweepProcessed,
        ticketsUpdated: successRecords + incrementalDetailsUpdated + incrementalOpenTicketSweepUpdated,
        ticketsDeleted: incrementalTicketsDeleted,
        metricsFetched: incrementalMetricsUpdated + errorRecords,
        metricsUpdated: incrementalMetricsUpdated,
        nonRetryableErrors: errorRecords,
        batchSize: incrementalParams.batchSize,
        maxBatches: incrementalParams.maxBatches,
        ticketsProcessed: incrementalProcessedRecords + incrementalOpenTicketSweepProcessed + incrementalMissingMetricsSweepProcessed,
        ticketsPending: incrementalHasMore ? 1 : 0,
        hasMore: incrementalHasMore,
        nextCursor: incrementalHasMore ? encodeCursor(null, new Date().toISOString()) : null,
        warningsCount: incrementalHasMore || staleRunsMarkedForIncremental > 0 || optionalSweepRuntimeStopped ? 1 : 0,
        observations:
          `window_source=${incrementalWindowSource}; checkpoint_run_id=${incrementalCheckpointRunId ?? "none"}; checkpoint_to=${incrementalCheckpointToDateTime ?? "none"}; max_lookback_cap=${incrementalWindowCappedByMaxLookback}; open_sweep=${incrementalOpenTicketSweepProcessed}; missing_metrics_sweep=${incrementalMissingMetricsSweepProcessed}; runtime_guard=${runtimeGuardStopped}; optional_sweep_runtime_guard=${optionalSweepRuntimeStopped}; stale_runs_marked=${staleRunsMarkedForIncremental}`,
      };

      await finishSyncRun(supabase, syncRunId, status, summary, `${incrementalSyncType} finalizada`);

      return jsonResponse({
        status,
        mode,
        lookbackHours: incrementalLookbackHours,
        maxPages: incrementalMaxPages,
        from_datetime: incrementalFromDateTime,
        to_datetime: incrementalToDateTime,
        window_source: incrementalWindowSource,
        checkpoint_run_id: incrementalCheckpointRunId,
        checkpoint_to_datetime: incrementalCheckpointToDateTime,
        max_lookback_cap: incrementalWindowCappedByMaxLookback,
        pages_read: incrementalPagesRead,
        fetched_records: incrementalFetchedRecords,
        processed_records: incrementalProcessedRecords,
        success_records: successRecords,
        error_records: errorRecords,
        details_updated: incrementalDetailsUpdated,
        tickets_deleted: incrementalTicketsDeleted,
        metrics_updated: incrementalMetricsUpdated,
        open_ticket_sweep_max_tickets: incrementalOpenTicketSweepMaxTickets,
        open_ticket_sweep_processed: incrementalOpenTicketSweepProcessed,
        open_ticket_sweep_updated: incrementalOpenTicketSweepUpdated,
        missing_metrics_sweep_max_tickets: incrementalMissingMetricsSweepMaxTickets,
        missing_metrics_sweep_processed: incrementalMissingMetricsSweepProcessed,
        has_more: incrementalHasMore,
        next_cursor: incrementalHasMore ? encodeCursor(null, new Date().toISOString()) : null,
        runtime_guard_stopped: runtimeGuardStopped,
        optional_sweep_runtime_guard_stopped: optionalSweepRuntimeStopped,
        stale_runs_marked: staleRunsMarkedForIncremental,
      });
    }

    if (mode === "departments") {
      supabase = createClient(
        getRequiredEnv("SUPABASE_URL"),
        getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      );

      syncRunId = await createSyncRun(
        supabase,
        new Date().toISOString(),
        DEPARTMENTS_LOAD_STRATEGY,
        "V1B departments iniciada",
      );

      let departments: ZohoDepartment[] = [];

      try {
        const accessToken = await getZohoAccessToken();
        departments = await fetchDepartments(accessToken);
      } catch (error) {
        errorRecords += 1;
        await logError(
          supabase,
          syncRunId,
          DEPARTMENTS_LOAD_STRATEGY,
          null,
          error,
          { endpoint: ZOHO_DEPARTMENTS_ENDPOINT },
          "zoho_departments",
          ZOHO_DEPARTMENTS_ENDPOINT,
        );
        throw error;
      }

      totalRecords = departments.length;

      for (const department of departments) {
        const departmentId = toText(department.id);

        try {
          const row = mapDepartmentToRow(department);
          const result = await supabase
            .from("zoho_departments")
            .upsert(row, { onConflict: "id" }) as SupabaseCallResult | undefined;

          if (!result || result.error) {
            throw new Error(
              `Falha no upsert do department ${departmentId ?? "sem id"}: ${supabaseErrorMessage(result, "retorno vazio do Supabase")}`,
            );
          }

          successRecords += 1;
        } catch (error) {
          errorRecords += 1;
          await logError(
            supabase,
            syncRunId,
            DEPARTMENTS_LOAD_STRATEGY,
            departmentId,
            error,
            department,
            "zoho_departments",
            ZOHO_DEPARTMENTS_ENDPOINT,
          );
        }
      }

      const status: SyncStatus = errorRecords === 0 ? "success" : "partial_success";
      const summary = { totalRecords, successRecords, errorRecords };

      await finishSyncRun(supabase, syncRunId, status, summary, "V1B departments finalizada");

      return jsonResponse({
        status,
        mode,
        total_records: totalRecords,
        success_records: successRecords,
        error_records: errorRecords,
      });
    }

    if (mode === "agents") {
      supabase = createClient(
        getRequiredEnv("SUPABASE_URL"),
        getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      );

      syncRunId = await createSyncRun(
        supabase,
        new Date().toISOString(),
        AGENTS_LOAD_STRATEGY,
        "V1B agents iniciada",
      );

      const agents: ZohoAgent[] = [];

      try {
        const accessToken = await getZohoAccessToken();
        let pageFrom = 0;
        let lastPageRecords = 0;

        while (true) {
          const page = await fetchAgentsPage(accessToken, pageFrom);
          agentsPagesRead += 1;
          lastPageRecords = page.length;
          agents.push(...page);
          pageFrom += PAGE_LIMIT;

          if (page.length < PAGE_LIMIT) {
            break;
          }
        }

        agentsHasMore = lastPageRecords === PAGE_LIMIT;
      } catch (error) {
        errorRecords += 1;
        await logError(
          supabase,
          syncRunId,
          AGENTS_LOAD_STRATEGY,
          null,
          error,
          { endpoint: ZOHO_AGENTS_ENDPOINT },
          "zoho_agents",
          ZOHO_AGENTS_ENDPOINT,
        );
        throw error;
      }

      totalRecords = agents.length;

      for (const agent of agents) {
        const agentId = toText(agent.id);

        try {
          const row = mapAgentToRow(agent);
          const result = await supabase
            .from("zoho_agents")
            .upsert(row, { onConflict: "id" }) as SupabaseCallResult | undefined;

          if (!result || result.error) {
            throw new Error(
              `Falha no upsert do agent ${agentId ?? "sem id"}: ${supabaseErrorMessage(result, "retorno vazio do Supabase")}`,
            );
          }

          successRecords += 1;
        } catch (error) {
          errorRecords += 1;
          await logError(
            supabase,
            syncRunId,
            AGENTS_LOAD_STRATEGY,
            agentId,
            error,
            agent,
            "zoho_agents",
            ZOHO_AGENTS_ENDPOINT,
          );
        }
      }

      const status: SyncStatus = errorRecords === 0 ? "success" : "partial_success";
      const summary = { totalRecords, successRecords, errorRecords };

      await finishSyncRun(supabase, syncRunId, status, summary, "V1B agents finalizada");

      return jsonResponse({
        status,
        mode,
        total_records: totalRecords,
        success_records: successRecords,
        error_records: errorRecords,
        pages_read: agentsPagesRead,
        has_more: agentsHasMore,
      });
    }

    if (mode === "contacts") {
      const contactsParams = normalizeContactsParams(requestBody);
      const contacts: ZohoContact[] = [];
      contactsStartOffset = contactsParams.startOffset;
      contactsNextOffset = contactsParams.startOffset;
      let lastPageRecords = 0;

      supabase = createClient(
        getRequiredEnv("SUPABASE_URL"),
        getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      );

      syncRunId = await createSyncRun(
        supabase,
        new Date().toISOString(),
        CONTACTS_LOAD_STRATEGY,
        "V1B contacts iniciada",
      );

      try {
        const accessToken = await getZohoAccessToken();

        for (let pageIndex = 0; pageIndex < contactsParams.maxPages; pageIndex += 1) {
          const page = await fetchContactsPage(accessToken, contactsNextOffset);
          contactsPagesRead += 1;
          contactsFetchedRecords += page.length;
          lastPageRecords = page.length;
          contactsNextOffset += PAGE_LIMIT;
          contacts.push(...page);

          if (page.length < PAGE_LIMIT) {
            break;
          }
        }

        contactsHasMore = lastPageRecords === PAGE_LIMIT && contactsPagesRead === contactsParams.maxPages;
      } catch (error) {
        errorRecords += 1;
        await logError(
          supabase,
          syncRunId,
          CONTACTS_LOAD_STRATEGY,
          null,
          error,
          { endpoint: ZOHO_CONTACTS_ENDPOINT, startOffset: contactsStartOffset },
          "zoho_contacts",
          ZOHO_CONTACTS_ENDPOINT,
        );
        throw error;
      }

      totalRecords = contacts.length;

      for (const contact of contacts) {
        const contactId = toText(contact.id);

        try {
          const row = mapContactToRow(contact);
          const result = await supabase
            .from("zoho_contacts")
            .upsert(row, { onConflict: "id" }) as SupabaseCallResult | undefined;

          if (!result || result.error) {
            throw new Error(
              `Falha no upsert do contact ${contactId ?? "sem id"}: ${supabaseErrorMessage(result, "retorno vazio do Supabase")}`,
            );
          }

          successRecords += 1;
        } catch (error) {
          errorRecords += 1;
          await logError(
            supabase,
            syncRunId,
            CONTACTS_LOAD_STRATEGY,
            contactId,
            error,
            contact,
            "zoho_contacts",
            ZOHO_CONTACTS_ENDPOINT,
          );
        }
      }

      const status: SyncStatus = errorRecords === 0 ? "success" : "partial_success";
      const summary = { totalRecords, successRecords, errorRecords };

      await finishSyncRun(supabase, syncRunId, status, summary, "V1B contacts finalizada");

      return jsonResponse({
        status,
        mode,
        startOffset: contactsStartOffset,
        nextOffset: contactsNextOffset,
        pages_read: contactsPagesRead,
        fetched_records: contactsFetchedRecords,
        total_records: totalRecords,
        success_records: successRecords,
        error_records: errorRecords,
        has_more: contactsHasMore,
      });
    }

    if (mode === "ticket_details") {
      const detailParams = normalizeTicketDetailsParams(requestBody);
      ticketDetailsStartOffset = detailParams.startOffset;
      ticketDetailsNextOffset = detailParams.startOffset;
      ticketDetailsRequestedTickets = detailParams.maxTickets;

      supabase = createClient(
        getRequiredEnv("SUPABASE_URL"),
        getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      );

      syncRunId = await createSyncRun(
        supabase,
        new Date().toISOString(),
        TICKET_DETAILS_LOAD_STRATEGY,
        "V1C ticket details iniciada",
      );

      const localTicketsResult = await supabase
        .from("zoho_tickets")
        .select("id")
        .order("created_time", { ascending: false })
        .range(ticketDetailsStartOffset, ticketDetailsStartOffset + ticketDetailsRequestedTickets - 1) as
          SupabaseCallResult<JsonRecord[]> | undefined;

      if (!localTicketsResult || localTicketsResult.error) {
        throw new Error(
          `Falha ao buscar tickets locais para detalhes: ${
            supabaseErrorMessage(localTicketsResult, "retorno vazio do Supabase")
          }`,
        );
      }

      const localTickets = Array.isArray(localTicketsResult.data) ? localTicketsResult.data : [];
      totalRecords = localTickets.length;
      ticketDetailsProcessedRecords = localTickets.length;
      ticketDetailsNextOffset = ticketDetailsStartOffset + ticketDetailsProcessedRecords;
      ticketDetailsHasMore = ticketDetailsProcessedRecords === ticketDetailsRequestedTickets;

      const accessToken = await getZohoAccessToken();
      const includeResolution = await ticketResolutionColumnExists(supabase);

      for (const ticket of localTickets) {
        const ticketId = toText(ticket.id);
        const endpoint = ticketId ? ticketDetailEndpoint(ticketId) : "/api/v1/tickets";

        if (!ticketId) {
          const error = new Error("Ticket local sem id");
          errorRecords += 1;
          await logError(
            supabase,
            syncRunId,
            TICKET_DETAILS_LOAD_STRATEGY,
            null,
            error,
            ticket,
            "zoho_ticket_details",
            endpoint,
          );
          continue;
        }

        try {
          const detail = await fetchTicketDetail(accessToken, ticketId);
          const row = removeNullishFields(mapTicketDetailToUpdateRow(detail, includeResolution));
          const result = await supabase
            .from("zoho_tickets")
            .update(row)
            .eq("id", ticketId) as SupabaseCallResult | undefined;

          if (!result || result.error) {
            throw new Error(
              `Falha no update do detalhe do ticket ${ticketId}: ${
                supabaseErrorMessage(result, "retorno vazio do Supabase")
              }`,
            );
          }

          successRecords += 1;
        } catch (error) {
          if (isZohoTicketNotFoundError(error)) {
            await deleteZohoTicketFromSupabase(supabase, ticketId);
            ticketDetailsDeletedRecords += 1;
            successRecords += 1;
            continue;
          }

          errorRecords += 1;
          await logError(
            supabase,
            syncRunId,
            TICKET_DETAILS_LOAD_STRATEGY,
            ticketId,
            error,
            ticketDetailRawError(error, { ticket, endpoint }),
            "zoho_ticket_details",
            endpoint,
          );
        }
      }

      const status: SyncStatus = errorRecords === 0 ? "success" : "partial_success";
      const summary = { totalRecords, successRecords, errorRecords, ticketsDeleted: ticketDetailsDeletedRecords };

      await finishSyncRun(supabase, syncRunId, status, summary, "V1C ticket details finalizada");

      return jsonResponse({
        status,
        mode,
        startOffset: ticketDetailsStartOffset,
        nextOffset: ticketDetailsNextOffset,
        requested_tickets: ticketDetailsRequestedTickets,
        processed_records: ticketDetailsProcessedRecords,
        tickets_deleted: ticketDetailsDeletedRecords,
        success_records: successRecords,
        error_records: errorRecords,
        has_more: ticketDetailsHasMore,
      });
    }

    if (mode === "ticket_metrics") {
      const metricsParams = normalizeTicketMetricsParams(requestBody);
      ticketMetricsStartOffset = metricsParams.startOffset;
      ticketMetricsNextOffset = metricsParams.startOffset;
      ticketMetricsRequestedTickets = metricsParams.maxTickets;

      supabase = createClient(
        getRequiredEnv("SUPABASE_URL"),
        getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      );

      syncRunId = await createSyncRun(
        supabase,
        new Date().toISOString(),
        TICKET_METRICS_LOAD_STRATEGY,
        "V1D ticket metrics iniciada",
      );

      const localTicketsResult = await supabase
        .from("zoho_tickets")
        .select("id")
        .order("created_time", { ascending: false })
        .range(ticketMetricsStartOffset, ticketMetricsStartOffset + ticketMetricsRequestedTickets - 1) as
          SupabaseCallResult<JsonRecord[]> | undefined;

      if (!localTicketsResult) {
        throw new Error("Falha ao buscar tickets locais para metricas: retorno vazio do Supabase");
      }

      if (localTicketsResult.error) {
        throw new Error(
          `Falha ao buscar tickets locais para metricas: ${
            supabaseErrorMessage(localTicketsResult, "retorno vazio do Supabase")
          }`,
        );
      }

      const localTickets = Array.isArray(localTicketsResult.data) ? localTicketsResult.data : [];
      totalRecords = localTickets.length;
      ticketMetricsProcessedRecords = localTickets.length;
      ticketMetricsNextOffset = ticketMetricsStartOffset + ticketMetricsProcessedRecords;
      ticketMetricsHasMore = ticketMetricsProcessedRecords === ticketMetricsRequestedTickets;

      const accessToken = await getZohoAccessToken();

      for (const ticket of localTickets) {
        const ticketId = toText(ticket.id);
        const endpoint = ticketId ? ticketMetricsEndpoint(ticketId) : "/api/v1/tickets/{id}/metrics";

        if (!ticketId) {
          const error = new Error("Ticket local sem id");
          errorRecords += 1;
          await logError(
            supabase,
            syncRunId,
            TICKET_METRICS_LOAD_STRATEGY,
            null,
            error,
            ticket,
            "zoho_ticket_metrics",
            endpoint,
          );
          continue;
        }

        try {
          const metrics = await fetchTicketMetrics(accessToken, ticketId);
          const row = mapTicketMetricsToUpdateRow(metrics);
          const result = await supabase
            .from("zoho_tickets")
            .update(row)
            .eq("id", ticketId) as SupabaseCallResult | undefined;

          if (!result) {
            throw new Error(`Falha no update das metricas do ticket ${ticketId}: retorno vazio do Supabase`);
          }

          if (result.error) {
            throw new Error(
              `Falha no update das metricas do ticket ${ticketId}: ${
                supabaseErrorMessage(result, "retorno vazio do Supabase")
              }`,
            );
          }

          successRecords += 1;
        } catch (error) {
          errorRecords += 1;
          await logError(
            supabase,
            syncRunId,
            TICKET_METRICS_LOAD_STRATEGY,
            ticketId,
            error,
            ticketMetricsRawError(error, { ticket, endpoint }),
            "zoho_ticket_metrics",
            endpoint,
          );
        }
      }

      const status: SyncStatus = errorRecords === 0 ? "success" : "partial_success";
      const summary = { totalRecords, successRecords, errorRecords };

      await finishSyncRun(supabase, syncRunId, status, summary, "V1D ticket metrics finalizada");

      return jsonResponse({
        status,
        mode,
        startOffset: ticketMetricsStartOffset,
        nextOffset: ticketMetricsNextOffset,
        requested_tickets: ticketMetricsRequestedTickets,
        processed_records: ticketMetricsProcessedRecords,
        success_records: successRecords,
        error_records: errorRecords,
        has_more: ticketMetricsHasMore,
      });
    }

    if (mode === "backfill") {
      const backfillParams = normalizeBackfillParams(requestBody);
      const seenTicketIds = new Set<string>();
      const ticketsToProcess: ZohoTicket[] = [];

      backfillDepartmentId = backfillParams.departmentId;
      backfillStartOffset = backfillParams.startOffset;
      backfillNextOffset = backfillParams.startOffset;
      let lastPageRecords = 0;

      supabase = createClient(
        getRequiredEnv("SUPABASE_URL"),
        getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      );

      syncRunId = await createSyncRun(
        supabase,
        new Date().toISOString(),
        BACKFILL_LOAD_STRATEGY,
        "V1B tickets basicos backfill iniciada",
      );

      const accessToken = await getZohoAccessToken();

      for (let pageIndex = 0; pageIndex < backfillParams.maxPages; pageIndex += 1) {
        const tickets = await fetchTicketsPage(accessToken, backfillParams.departmentId, backfillNextOffset);
        backfillPagesRead += 1;
        backfillFetchedRecords += tickets.length;
        lastPageRecords = tickets.length;
        backfillNextOffset += PAGE_LIMIT;

        for (const ticket of tickets) {
          const ticketId = toText(ticket.id);

          if (ticketId && seenTicketIds.has(ticketId)) {
            backfillDuplicateRecords += 1;
            continue;
          }

          if (ticketId) {
            seenTicketIds.add(ticketId);
          }

          ticketsToProcess.push(ticket);
          backfillAcceptedRecords += 1;
        }

        if (tickets.length < PAGE_LIMIT) {
          break;
        }
      }

      totalRecords = ticketsToProcess.length;

      for (const ticket of ticketsToProcess) {
        const ticketId = toText(ticket.id);

        try {
          const row = removeNullishFields(mapTicketToRow(ticket, BACKFILL_LOAD_STRATEGY));
          const result = await supabase
            .from("zoho_tickets")
            .upsert(row, { onConflict: "id" }) as SupabaseCallResult | undefined;

          if (!result || result.error) {
            throw new Error(
              `Falha no upsert do ticket ${ticketId ?? "sem id"}: ${supabaseErrorMessage(result, "retorno vazio do Supabase")}`,
            );
          }

          successRecords += 1;
        } catch (error) {
          errorRecords += 1;
          await logError(supabase, syncRunId, BACKFILL_LOAD_STRATEGY, ticketId, error, ticket);
        }
      }

      const status: SyncStatus = errorRecords === 0 ? "success" : "partial_success";
      const summary = { totalRecords, successRecords, errorRecords };
      backfillHasMore = lastPageRecords === PAGE_LIMIT && backfillPagesRead === backfillParams.maxPages;

      await finishSyncRun(supabase, syncRunId, status, summary, "V1B tickets basicos backfill finalizada");

      return jsonResponse({
        status,
        mode,
        departmentId: backfillParams.departmentId,
        startOffset: backfillParams.startOffset,
        nextOffset: backfillNextOffset,
        pages_read: backfillPagesRead,
        fetched_records: backfillFetchedRecords,
        accepted_records: backfillAcceptedRecords,
        duplicate_records: backfillDuplicateRecords,
        total_records: totalRecords,
        success_records: successRecords,
        error_records: errorRecords,
        has_more: backfillHasMore,
      });
    }

    const dateWindow = normalizeDateWindow(requestBody);
    startDate = dateWindow.startDate;
    endDate = dateWindow.endDate;
    maxPagesPerDepartment = dateWindow.maxPagesPerDepartment;

    supabase = createClient(
      getRequiredEnv("SUPABASE_URL"),
      getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    syncRunId = await createSyncRun(
      supabase,
      new Date().toISOString(),
      HISTORICAL_WINDOW_LOAD_STRATEGY,
      "V1B tickets básicos por janela iniciada",
    );

    const accessToken = await getZohoAccessToken();
    const seenTicketIds = new Set<string>();
    const ticketsToProcess: ZohoTicket[] = [];
    const departamentos: DepartmentResult[] = [];

    for (const departmentId of DEPARTMENT_IDS) {
      try {
        let fetchedRecords = 0;
        let acceptedRecords = 0;
        let duplicateRecords = 0;
        let ignoredOutsideWindowRecords = 0;
        let pagesRead = 0;

        for (let pageIndex = 0; pageIndex < maxPagesPerDepartment; pageIndex += 1) {
          const pageFrom = pageIndex * PAGE_LIMIT;
          const tickets = await fetchTicketsPage(accessToken, departmentId, pageFrom);
          fetchedRecords += tickets.length;
          pagesRead += 1;

          for (const ticket of tickets) {
            if (!isTicketInsideDateWindow(ticket, dateWindow.startDateInclusive, dateWindow.endDateExclusive)) {
              ignoredOutsideWindowRecords += 1;
              continue;
            }

            const ticketId = toText(ticket.id);

            if (ticketId && seenTicketIds.has(ticketId)) {
              duplicateRecords += 1;
              continue;
            }

            if (ticketId) {
              seenTicketIds.add(ticketId);
            }

            ticketsToProcess.push(ticket);
            acceptedRecords += 1;
          }

          if (tickets.length < PAGE_LIMIT) {
            break;
          }
        }

        departamentos.push({
          department_id: departmentId,
          fetched_records: fetchedRecords,
          accepted_records: acceptedRecords,
          duplicate_records: duplicateRecords,
          ignored_outside_window_records: ignoredOutsideWindowRecords,
          pages_read: pagesRead,
        });
      } catch (error) {
        errorRecords += 1;
        departamentos.push({
          department_id: departmentId,
          fetched_records: 0,
          accepted_records: 0,
          duplicate_records: 0,
          ignored_outside_window_records: 0,
          pages_read: 0,
          error: errorMessage(error),
        });

        await logError(supabase, syncRunId, HISTORICAL_WINDOW_LOAD_STRATEGY, null, error, { department_id: departmentId });
      }
    }

    totalRecords = ticketsToProcess.length;

    for (const ticket of ticketsToProcess) {
      const ticketId = toText(ticket.id);

      try {
        const row = removeNullishFields(mapTicketToRow(ticket, HISTORICAL_WINDOW_LOAD_STRATEGY));
        const result = await supabase
          .from("zoho_tickets")
          .upsert(row, { onConflict: "id" }) as SupabaseCallResult | undefined;

        if (!result || result.error) {
          throw new Error(
            `Falha no upsert do ticket ${ticketId ?? "sem id"}: ${supabaseErrorMessage(result, "retorno vazio do Supabase")}`,
          );
        }

        successRecords += 1;
      } catch (error) {
        errorRecords += 1;
        await logError(supabase, syncRunId, HISTORICAL_WINDOW_LOAD_STRATEGY, ticketId, error, ticket);
      }
    }

    const status: SyncStatus = errorRecords === 0 ? "success" : "partial_success";
    const summary = { totalRecords, successRecords, errorRecords };

    await finishSyncRun(supabase, syncRunId, status, summary, "V1B tickets básicos por janela finalizada");

    return jsonResponse({
      status,
      startDate,
      endDate,
      maxPagesPerDepartment,
      departamentos,
      total_records: totalRecords,
      success_records: successRecords,
      error_records: errorRecords,
    });
  } catch (error) {
    const statusCode = error instanceof BadRequestError ? error.status : 500;
    const failureMessage = mode === "backfill"
      ? `V1B tickets basicos backfill falhou: ${errorMessage(error)}`
      : `V1B tickets básicos por janela falhou: ${errorMessage(error)}`;
    const finalFailureMessage = mode === "departments"
      ? `V1B departments falhou: ${errorMessage(error)}`
      : mode === "agents"
      ? `V1B agents falhou: ${errorMessage(error)}`
      : mode === "contacts"
      ? `V1B contacts falhou: ${errorMessage(error)}`
      : mode === "ticket_details"
      ? `V1C ticket details falhou: ${errorMessage(error)}`
      : mode === "ticket_metrics"
      ? `V1D ticket metrics falhou: ${errorMessage(error)}`
      : mode === "incremental" || mode === "modified_window_sync"
      ? `${mode} falhou: ${errorMessage(error)}`
      : mode === "deletion_sweep"
      ? `Deletion sweep falhou: ${errorMessage(error)}`
      : mode === "ticket_history_sync"
      ? `Ticket history sync falhou: ${errorMessage(error)}`
      : failureMessage;
    const summary = {
      totalRecords,
      successRecords,
      errorRecords: errorRecords > 0 ? errorRecords : 1,
    };

    if (supabase && syncRunId) {
      try {
        await finishSyncRun(
          supabase,
          syncRunId,
          "error",
          summary,
          finalFailureMessage,
        );
      } catch (finishError) {
        console.error("Falha ao atualizar sync_run com status error", errorMessage(finishError));
      }
    }

    if (mode === "backfill") {
      return jsonResponse({
        success: false,
        status: "error",
        error: errorMessage(error),
        mode,
        departmentId: backfillDepartmentId,
        startOffset: backfillStartOffset,
        nextOffset: backfillNextOffset,
        pages_read: backfillPagesRead,
        fetched_records: backfillFetchedRecords,
        accepted_records: backfillAcceptedRecords,
        duplicate_records: backfillDuplicateRecords,
        total_records: totalRecords,
        success_records: successRecords,
        error_records: summary.errorRecords,
        has_more: backfillHasMore,
      }, statusCode);
    }

    if (mode === "departments") {
      return jsonResponse({
        success: false,
        status: "error",
        error: errorMessage(error),
        mode,
        total_records: totalRecords,
        success_records: successRecords,
        error_records: summary.errorRecords,
      }, statusCode);
    }

    if (mode === "agents") {
      return jsonResponse({
        success: false,
        status: "error",
        error: errorMessage(error),
        mode,
        total_records: totalRecords,
        success_records: successRecords,
        error_records: summary.errorRecords,
        pages_read: agentsPagesRead,
        has_more: agentsHasMore,
      }, statusCode);
    }

    if (mode === "contacts") {
      return jsonResponse({
        success: false,
        status: "error",
        error: errorMessage(error),
        mode,
        startOffset: contactsStartOffset,
        nextOffset: contactsNextOffset,
        pages_read: contactsPagesRead,
        fetched_records: contactsFetchedRecords,
        total_records: totalRecords,
        success_records: successRecords,
        error_records: summary.errorRecords,
        has_more: contactsHasMore,
      }, statusCode);
    }

    if (mode === "ticket_details") {
      return jsonResponse({
        success: false,
        status: "error",
        error: errorMessage(error),
        mode,
        startOffset: ticketDetailsStartOffset,
        nextOffset: ticketDetailsNextOffset,
        requested_tickets: ticketDetailsRequestedTickets,
        processed_records: ticketDetailsProcessedRecords,
        tickets_deleted: ticketDetailsDeletedRecords,
        success_records: successRecords,
        error_records: summary.errorRecords,
        has_more: ticketDetailsHasMore,
      }, statusCode);
    }

    if (mode === "ticket_metrics") {
      return jsonResponse({
        success: false,
        status: "error",
        error: errorMessage(error),
        mode,
        startOffset: ticketMetricsStartOffset,
        nextOffset: ticketMetricsNextOffset,
        requested_tickets: ticketMetricsRequestedTickets,
        processed_records: ticketMetricsProcessedRecords,
        success_records: successRecords,
        error_records: summary.errorRecords,
        has_more: ticketMetricsHasMore,
      }, statusCode);
    }

    if (mode === "incremental" || mode === "modified_window_sync") {
      return jsonResponse({
        success: false,
        status: "error",
        error: errorMessage(error),
        mode,
        lookbackHours: incrementalLookbackHours,
        maxPages: incrementalMaxPages,
        from_datetime: incrementalFromDateTime,
        to_datetime: incrementalToDateTime,
        window_source: incrementalWindowSource,
        checkpoint_run_id: incrementalCheckpointRunId,
        checkpoint_to_datetime: incrementalCheckpointToDateTime,
        max_lookback_cap: incrementalWindowCappedByMaxLookback,
        pages_read: incrementalPagesRead,
        fetched_records: incrementalFetchedRecords,
        processed_records: incrementalProcessedRecords,
        success_records: successRecords,
        error_records: summary.errorRecords,
        details_updated: incrementalDetailsUpdated,
        metrics_updated: incrementalMetricsUpdated,
        open_ticket_sweep_processed: incrementalOpenTicketSweepProcessed,
        open_ticket_sweep_updated: incrementalOpenTicketSweepUpdated,
        missing_metrics_sweep_processed: incrementalMissingMetricsSweepProcessed,
        has_more: incrementalHasMore,
      }, statusCode);
    }

    return jsonResponse({
      success: false,
      status: "error",
      error: errorMessage(error),
      mode,
      startDate,
      endDate,
      maxPagesPerDepartment,
      departamentos: DEPARTMENT_IDS.map((departmentId) => ({ department_id: departmentId })),
      total_records: totalRecords,
      success_records: successRecords,
      error_records: summary.errorRecords,
    }, statusCode);
  }
});
