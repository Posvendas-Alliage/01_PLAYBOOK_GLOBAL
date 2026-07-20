'use strict';

const fs = require('fs/promises');
const path = require('path');

const DEFAULT_SUPABASE_URL = 'https://bryegtpdjqpwtyefoznq.supabase.co';
const DEFAULT_DEPARTMENT_IDS = [
  '1128522000000453544',
  '1128522000008788112',
  '1128522000000006907'
];

const PAGE_LIMIT = 100;
const SUPABASE_PAGE_LIMIT = 1000;
const MAX_TARGETED_FIX_BATCH = 50;

function parseArgs(argv) {
  const args = {
    fix: false,
    dryRun: false,
    weeks: 12,
    months: 12,
    maxZohoPagesPerDepartment: Number(process.env.MONITOR_MAX_ZOHO_PAGES_PER_DEPARTMENT || 500),
    maxFixTickets: Number(process.env.MONITOR_MAX_FIX_TICKETS || 200),
    outputDir: process.env.MONITOR_OUTPUT_DIR || 'reports/parity',
    since: process.env.MONITOR_SINCE || null,
    tolerance: Number(process.env.MONITOR_COUNT_TOLERANCE || 0)
  };

  for (const arg of argv) {
    if (arg === '--fix') args.fix = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg.startsWith('--weeks=')) args.weeks = Number(arg.slice('--weeks='.length));
    else if (arg.startsWith('--months=')) args.months = Number(arg.slice('--months='.length));
    else if (arg.startsWith('--since=')) args.since = arg.slice('--since='.length);
    else if (arg.startsWith('--max-fix-tickets=')) args.maxFixTickets = Number(arg.slice('--max-fix-tickets='.length));
    else if (arg.startsWith('--max-zoho-pages-per-department=')) {
      args.maxZohoPagesPerDepartment = Number(arg.slice('--max-zoho-pages-per-department='.length));
    } else if (arg.startsWith('--output-dir=')) {
      args.outputDir = arg.slice('--output-dir='.length);
    } else if (arg.startsWith('--tolerance=')) {
      args.tolerance = Number(arg.slice('--tolerance='.length));
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Argumento desconhecido: ${arg}`);
    }
  }

  return args;
}

function usage() {
  return [
    'Uso:',
    '  node tools/monitor-zoho-supabase-parity.js [--weeks=12] [--months=12] [--since=YYYY-MM-DD]',
    '  node tools/monitor-zoho-supabase-parity.js --fix --max-fix-tickets=200',
    '',
    'Variaveis obrigatorias:',
    '  ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ORG_ID',
    '  SUPABASE_URL ou PLAYBOOK_SUPABASE_URL',
    '  SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_SECRET_KEY ou SUPABASE_ANON_KEY',
    '',
    'Variaveis opcionais:',
    '  ZOHO_DEPARTMENT_IDS=dep1,dep2,dep3',
    '  SYNC_FUNCTION_KEY=<key para /functions/v1/sync-tickets-v0>',
    '  MONITOR_OUTPUT_DIR=reports/parity',
    '  MONITOR_COUNT_TOLERANCE=0'
  ].join('\n');
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) throw new Error(`Variavel obrigatoria ausente: ${name}`);
  return String(value).trim();
}

function optionalEnv(names, fallback = '') {
  for (const name of names) {
    const value = process.env[name];
    if (value && String(value).trim()) return String(value).trim();
  }
  return fallback;
}

function parseJsonEnv(name) {
  const value = process.env[name];
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function resolveSupabaseKey() {
  const explicit = optionalEnv(['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY', 'SUPABASE_ANON_KEY', 'PLAYBOOK_SUPABASE_PUBLISHABLE_KEY']);
  if (explicit) return explicit;

  const secretKeys = parseJsonEnv('SUPABASE_SECRET_KEYS');
  if (secretKeys && typeof secretKeys.default === 'string') return secretKeys.default;

  const publishableKeys = parseJsonEnv('SUPABASE_PUBLISHABLE_KEYS');
  if (publishableKeys && typeof publishableKeys.default === 'string') return publishableKeys.default;

  throw new Error('Configure uma chave Supabase para leitura: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SECRET_KEY ou SUPABASE_ANON_KEY.');
}

function authHeadersForSupabase(key) {
  const headers = { apikey: key };
  if (key.includes('.')) headers.Authorization = `Bearer ${key}`;
  return headers;
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, options = {}, label = 'request', retry = 0) {
  const response = await fetch(url, options);
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const details = typeof payload === 'string' ? payload : JSON.stringify(payload);
    if ((response.status === 429 || response.status >= 500) && retry < 3) {
      await sleep((retry + 1) * 1500);
      return fetchJson(url, options, label, retry + 1);
    }
    throw new Error(`${label} falhou: HTTP ${response.status} ${details}`);
  }

  return payload;
}

async function getZohoAccessToken() {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: requiredEnv('ZOHO_CLIENT_ID'),
    client_secret: requiredEnv('ZOHO_CLIENT_SECRET'),
    refresh_token: requiredEnv('ZOHO_REFRESH_TOKEN')
  });

  const payload = await fetchJson('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  }, 'Zoho token');

  if (!payload || !payload.access_token) throw new Error('Zoho nao retornou access_token.');
  return payload.access_token;
}

function departmentIds() {
  const raw = optionalEnv(['ZOHO_DEPARTMENT_IDS']);
  if (!raw) return DEFAULT_DEPARTMENT_IDS;
  return raw.split(',').map((item) => item.trim()).filter(Boolean);
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function isoWeekKey(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function monthKey(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function withinSince(ticket, sinceDate) {
  if (!sinceDate) return true;
  const created = toDate(ticket.created_time || ticket.createdTime);
  return created && created >= sinceDate;
}

function normalizeZohoTicket(ticket) {
  return {
    id: String(ticket.id || '').trim(),
    ticket_number: String(ticket.ticketNumber || ticket.ticket_number || '').trim(),
    status: String(ticket.status || '').trim(),
    status_type: String(ticket.statusType || ticket.status_type || '').trim(),
    created_time: ticket.createdTime || ticket.created_time || null,
    closed_time: ticket.closedTime || ticket.closed_time || null,
    modified_time: ticket.modifiedTime || ticket.modified_time || null,
    department_id: String(ticket.departmentId || ticket.department_id || '').trim()
  };
}

async function fetchZohoTickets({ accessToken, sinceDate, maxPagesPerDepartment }) {
  const tickets = new Map();
  const orgId = requiredEnv('ZOHO_ORG_ID');

  for (const departmentId of departmentIds()) {
    for (let page = 0; page < maxPagesPerDepartment; page += 1) {
      const from = page * PAGE_LIMIT;
      const url = new URL('https://desk.zoho.com/api/v1/tickets');
      url.searchParams.set('departmentId', departmentId);
      url.searchParams.set('from', String(from));
      url.searchParams.set('limit', String(PAGE_LIMIT));
      url.searchParams.set('sortBy', '-createdTime');
      url.searchParams.set('fields', 'id,ticketNumber,status,statusType,createdTime,closedTime,modifiedTime,departmentId');

      const payload = await fetchJson(url, {
        method: 'GET',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          orgId
        }
      }, `Zoho tickets departamento ${departmentId} pagina ${page + 1}`);

      const data = Array.isArray(payload) ? payload : Array.isArray(payload && payload.data) ? payload.data : [];
      if (data.length === 0) break;

      let reachedOlderThanSince = false;
      for (const raw of data) {
        const ticket = normalizeZohoTicket(raw);
        if (!ticket.id) continue;
        const created = toDate(ticket.created_time);
        if (sinceDate && created && created < sinceDate) {
          reachedOlderThanSince = true;
          continue;
        }
        tickets.set(ticket.id, ticket);
      }

      if (data.length < PAGE_LIMIT || reachedOlderThanSince) break;
    }
  }

  return Array.from(tickets.values());
}

async function fetchSupabaseRows({ supabaseUrl, supabaseKey, sinceDate }) {
  const rows = [];
  const headers = authHeadersForSupabase(supabaseKey);
  let offset = 0;

  while (true) {
    const url = new URL(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/zoho_tickets`);
    url.searchParams.set('select', 'id,ticket_number,status,status_type,created_time,closed_time,modified_time,last_detail_sync_at,last_metrics_sync_at,raw_metrics');
    url.searchParams.set('order', 'created_time.desc');
    url.searchParams.set('limit', String(SUPABASE_PAGE_LIMIT));
    url.searchParams.set('offset', String(offset));
    if (sinceDate) url.searchParams.set('created_time', `gte.${sinceDate.toISOString()}`);

    const data = await fetchJson(url, { headers }, `Supabase zoho_tickets offset ${offset}`);
    if (!Array.isArray(data) || data.length === 0) break;
    rows.push(...data);
    if (data.length < SUPABASE_PAGE_LIMIT) break;
    offset += SUPABASE_PAGE_LIMIT;
  }

  return rows;
}

async function fetchOfficialBiRows({ supabaseUrl, supabaseKey, sinceDate }) {
  const rows = [];
  const headers = authHeadersForSupabase(supabaseKey);
  let offset = 0;

  while (true) {
    const url = new URL(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/vw_tickets_bi_base`);
    url.searchParams.set('select', 'ticket_id,ticket_number,created_time,closed_time,is_weekly_report_filter_included,is_open,is_closed,is_sla_eligible,sla_status_bi,mtfc_horas_bi,mtts_dias_bi');
    url.searchParams.set('order', 'created_time.desc');
    url.searchParams.set('limit', String(SUPABASE_PAGE_LIMIT));
    url.searchParams.set('offset', String(offset));
    if (sinceDate) url.searchParams.set('created_time', `gte.${sinceDate.toISOString()}`);

    const data = await fetchJson(url, { headers }, `Supabase vw_tickets_bi_base offset ${offset}`);
    if (!Array.isArray(data) || data.length === 0) break;
    rows.push(...data);
    if (data.length < SUPABASE_PAGE_LIMIT) break;
    offset += SUPABASE_PAGE_LIMIT;
  }

  return rows;
}

async function fetchSyncHealth({ supabaseUrl, supabaseKey }) {
  const headers = authHeadersForSupabase(supabaseKey);
  const url = new URL(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/sync_runs`);
  url.searchParams.set('select', 'sync_type,status,started_at,finished_at,error_records,success_records,has_more,tickets_pending');
  url.searchParams.set('sync_type', 'in.(v1e_incremental,open_tickets_sweep,v1g_ticket_history_sync,v1f_deletion_sweep)');
  url.searchParams.set('status', 'in.(success,partial_success)');
  url.searchParams.set('order', 'finished_at.desc.nullslast');
  url.searchParams.set('limit', '200');

  const rows = await fetchJson(url, { headers }, 'Supabase sync_runs');
  const requiredTypes = ['v1e_incremental', 'open_tickets_sweep', 'v1g_ticket_history_sync', 'v1f_deletion_sweep'];
  const latestByType = new Map();
  for (const row of Array.isArray(rows) ? rows : []) {
    if (!latestByType.has(row.sync_type)) latestByType.set(row.sync_type, row);
  }

  const now = Date.now();
  return requiredTypes.map((type) => {
    const row = latestByType.get(type) || null;
    const finished = row ? toDate(row.finished_at) : null;
    const ageHours = finished ? (now - finished.getTime()) / 3600000 : Infinity;
    return {
      syncType: type,
      lastFinishedAt: finished ? finished.toISOString() : null,
      ageHours: Number.isFinite(ageHours) ? Number(ageHours.toFixed(2)) : null,
      within24h: Number.isFinite(ageHours) && ageHours <= 24,
      status: row ? row.status : null,
      errorRecords: row ? Number(row.error_records || 0) : null,
      successRecords: row ? Number(row.success_records || 0) : null,
      hasMore: row ? Boolean(row.has_more) : null,
      ticketsPending: row ? row.tickets_pending : null
    };
  });
}
function buildPeriodMap(rows, periodFn) {
  const map = new Map();
  for (const row of rows) {
    const date = toDate(row.created_time || row.createdTime);
    if (!date) continue;
    if (Object.prototype.hasOwnProperty.call(row, 'is_weekly_report_filter_included') && row.is_weekly_report_filter_included !== true) continue;

    const key = periodFn(date);
    const item = map.get(key) || {
      period: key,
      total: 0,
      open: 0,
      closed: 0,
      missingMetrics: 0,
      missingDetail: 0,
      slaEligible: 0,
      insideSla: 0,
      mtfcSum: 0,
      mtfcCount: 0,
      mttsSum: 0,
      mttsCount: 0,
      ids: new Set()
    };

    item.total += 1;
    item.ids.add(String(row.id || row.ticket_id));
    const status = String(row.status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const statusType = String(row.status_type || row.statusType || '').toLowerCase();
    const isClosed = Object.prototype.hasOwnProperty.call(row, 'is_closed')
      ? row.is_closed === true
      : Boolean(row.closed_time || row.closedTime) || statusType === 'closed' || ['fechado', 'closed', 'resolvido', 'resolved'].includes(status);
    const isOpen = Object.prototype.hasOwnProperty.call(row, 'is_open') ? row.is_open === true : !isClosed;
    if (isClosed) item.closed += 1;
    if (isOpen) item.open += 1;
    if (Object.prototype.hasOwnProperty.call(row, 'raw_metrics') && row.raw_metrics == null) item.missingMetrics += 1;
    if (Object.prototype.hasOwnProperty.call(row, 'last_detail_sync_at') && row.last_detail_sync_at == null) item.missingDetail += 1;
    if (row.is_sla_eligible === true) item.slaEligible += 1;
    if (String(row.sla_status_bi || '').toLowerCase().includes('dentro')) item.insideSla += 1;

    const mtfc = Number(row.mtfc_horas_bi);
    if (Number.isFinite(mtfc)) {
      item.mtfcSum += mtfc;
      item.mtfcCount += 1;
    }
    const mtts = Number(row.mtts_dias_bi);
    if (Number.isFinite(mtts)) {
      item.mttsSum += mtts;
      item.mttsCount += 1;
    }
    map.set(key, item);
  }
  return map;
}

function periodMetricRows(map, limit) {
  return recentKeys(map, new Map(), limit).map((key) => {
    const row = map.get(key);
    const slaPct = row.slaEligible ? row.insideSla / row.slaEligible * 100 : null;
    return {
      period: key,
      total: row.total,
      open: row.open,
      closed: row.closed,
      slaEligible: row.slaEligible,
      insideSla: row.insideSla,
      slaPct: slaPct === null ? null : Number(slaPct.toFixed(2)),
      avgMtfcHours: row.mtfcCount ? Number((row.mtfcSum / row.mtfcCount).toFixed(2)) : null,
      avgMttsDays: row.mttsCount ? Number((row.mttsSum / row.mttsCount).toFixed(2)) : null
    };
  });
}
function recentKeys(mapA, mapB, limit, sortDesc = true) {
  const keys = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort();
  if (sortDesc) keys.reverse();
  return keys.slice(0, limit).reverse();
}

function comparePeriods(zohoMap, supabaseMap, limit, tolerance) {
  const rows = [];
  for (const key of recentKeys(zohoMap, supabaseMap, limit)) {
    const z = zohoMap.get(key) || { total: 0, open: 0, closed: 0, ids: new Set() };
    const s = supabaseMap.get(key) || { total: 0, open: 0, closed: 0, missingMetrics: 0, missingDetail: 0, ids: new Set() };
    const diffTotal = s.total - z.total;
    const diffOpen = s.open - z.open;
    const diffClosed = s.closed - z.closed;
    rows.push({
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
      supabaseMissingMetrics: s.missingMetrics || 0,
      supabaseMissingDetail: s.missingDetail || 0,
      ok: Math.abs(diffTotal) <= tolerance && Math.abs(diffOpen) <= tolerance && Math.abs(diffClosed) <= tolerance
    });
  }
  return rows;
}

function diffIds(zohoRows, supabaseRows) {
  const zoho = new Map(zohoRows.map((row) => [String(row.id), row]));
  const supabase = new Map(supabaseRows.map((row) => [String(row.id), row]));

  const missingInSupabase = [];
  const extraInSupabase = [];
  const statusMismatch = [];

  for (const [id, row] of zoho) {
    const local = supabase.get(id);
    if (!local) {
      missingInSupabase.push(row);
      continue;
    }
    const zohoStatus = String(row.status || '').trim();
    const localStatus = String(local.status || '').trim();
    const zohoClosed = row.closed_time ? new Date(row.closed_time).toISOString() : null;
    const localClosed = local.closed_time ? new Date(local.closed_time).toISOString() : null;
    if (zohoStatus !== localStatus || zohoClosed !== localClosed) {
      statusMismatch.push({ id, ticket_number: row.ticket_number || local.ticket_number, zohoStatus, localStatus, zohoClosed, localClosed });
    }
  }

  for (const [id, row] of supabase) {
    if (!zoho.has(id)) extraInSupabase.push(row);
  }

  return { missingInSupabase, extraInSupabase, statusMismatch };
}

async function invokeSyncFunction({ supabaseUrl, syncKey, payload }) {
  if (!syncKey) throw new Error('SYNC_FUNCTION_KEY ausente. Necessario para --fix.');
  const headers = {
    apikey: syncKey,
    'Content-Type': 'application/json'
  };
  if (syncKey.includes('.')) headers.Authorization = `Bearer ${syncKey}`;

  return fetchJson(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/sync-tickets-v0`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  }, `sync-tickets-v0 ${payload.mode}`);
}

function chunk(array, size) {
  const chunks = [];
  for (let index = 0; index < array.length; index += size) chunks.push(array.slice(index, index + size));
  return chunks;
}

async function runFixes({ args, supabaseUrl, syncKey, idDiff, supabaseRows }) {
  const actions = [];
  const targetIds = [
    ...idDiff.missingInSupabase.map((row) => row.id),
    ...idDiff.statusMismatch.map((row) => row.id)
  ].slice(0, args.maxFixTickets);

  for (const ids of chunk(targetIds, MAX_TARGETED_FIX_BATCH)) {
    if (ids.length === 0) continue;
    const payload = { mode: 'targeted_reconciliation_backfill', ticketIds: ids };
    actions.push({ type: 'targeted_reconciliation_backfill', ticketIds: ids, result: args.dryRun ? { dryRun: true } : await invokeSyncFunction({ supabaseUrl, syncKey, payload }) });
  }

  const missingMetrics = supabaseRows.filter((row) => row.raw_metrics == null).length;
  if (missingMetrics > 0 && actions.length < 10) {
    const payload = {
      mode: 'missing_metrics_sweep',
      limit: Math.min(100, missingMetrics),
      batchSize: 20,
      maxBatches: 5,
      maxRuntimeSeconds: 90
    };
    actions.push({ type: 'missing_metrics_sweep', planned: payload.limit, result: args.dryRun ? { dryRun: true } : await invokeSyncFunction({ supabaseUrl, syncKey, payload }) });
  }

  return actions;
}

function markdownTable(rows) {
  const header = '| Periodo | Zoho | Supabase | Diff | Aberto Z/S | Fechado Z/S | Sem metricas | Sem detalhe | OK |';
  const sep = '|---|---:|---:|---:|---:|---:|---:|---:|:---:|';
  const lines = rows.map((row) => [
    row.period,
    row.zohoTotal,
    row.supabaseTotal,
    row.diffTotal,
    `${row.zohoOpen}/${row.supabaseOpen}`,
    `${row.zohoClosed}/${row.supabaseClosed}`,
    row.supabaseMissingMetrics,
    row.supabaseMissingDetail,
    row.ok ? 'sim' : 'NAO'
  ].join(' | ')).map((line) => `| ${line} |`);
  return [header, sep, ...lines].join('\n');
}

function metricMarkdownTable(rows) {
  const header = '| Periodo | Total | Aberto | Fechado | SLA elegivel | Dentro SLA | SLA % | MTFC h | MTTS dias |';
  const sep = '|---|---:|---:|---:|---:|---:|---:|---:|---:|';
  const lines = rows.map((row) => [
    row.period,
    row.total,
    row.open,
    row.closed,
    row.slaEligible,
    row.insideSla,
    row.slaPct == null ? '' : row.slaPct,
    row.avgMtfcHours == null ? '' : row.avgMtfcHours,
    row.avgMttsDays == null ? '' : row.avgMttsDays
  ].join(' | ')).map((line) => `| ${line} |`);
  return [header, sep, ...lines].join('\n');
}

function syncMarkdownTable(rows) {
  const header = '| Sync | Ultima execucao | Idade h | Status | Registros OK | Erros | Pendente | <24h |';
  const sep = '|---|---|---:|---|---:|---:|---:|:---:|';
  const lines = rows.map((row) => [
    row.syncType,
    row.lastFinishedAt || '',
    row.ageHours == null ? '' : row.ageHours,
    row.status || '',
    row.successRecords == null ? '' : row.successRecords,
    row.errorRecords == null ? '' : row.errorRecords,
    row.ticketsPending == null ? '' : row.ticketsPending,
    row.within24h ? 'sim' : 'NAO'
  ].join(' | ')).map((line) => `| ${line} |`);
  return [header, sep, ...lines].join('\n');
}
async function writeReport({ args, report }) {
  await fs.mkdir(args.outputDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.join(args.outputDir, `zoho-supabase-parity-${stamp}.json`);
  const mdPath = path.join(args.outputDir, `zoho-supabase-parity-${stamp}.md`);

  const md = [
    '# Zoho x Supabase Parity',
    '',
    `Gerado em: ${report.generatedAt}`,
    `Status: ${report.ok ? 'OK' : 'DIVERGENTE'}`,
    '',
    '## Resumo',
    '',
    `- Zoho tickets: ${report.summary.zohoTickets}`,
    `- Supabase tickets: ${report.summary.supabaseTickets}`,
    `- Faltando no Supabase: ${report.summary.missingInSupabase}`,
    `- Extra no Supabase: ${report.summary.extraInSupabase}`,
    `- Status/closed divergente: ${report.summary.statusMismatch}`,
    `- Supabase sem metricas: ${report.summary.supabaseMissingMetrics}`,
    `- Supabase sem detalhe: ${report.summary.supabaseMissingDetail}`,
    '',
    '## Semanas',
    '',
    markdownTable(report.weekly),
    '',
    '## Meses',
    '',
    markdownTable(report.monthly),
    '',
    '## Metricas Oficiais Semanais',
    '',
    metricMarkdownTable(report.officialWeeklyMetrics),
    '',
    '## Metricas Oficiais Mensais',
    '',
    metricMarkdownTable(report.officialMonthlyMetrics),
    '',
    '## Frescor Do Sync',
    '',
    syncMarkdownTable(report.syncHealth),
    '',
    '## Correcoes',
    '',
    report.fixActions.length ? '```json\n' + JSON.stringify(report.fixActions, null, 2) + '\n```' : 'Nenhuma correcao executada.'
  ].join('\n');

  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), 'utf8');
  await fs.writeFile(mdPath, md, 'utf8');
  return { jsonPath, mdPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const supabaseUrl = optionalEnv(['SUPABASE_URL', 'PLAYBOOK_SUPABASE_URL'], DEFAULT_SUPABASE_URL);
  const supabaseKey = resolveSupabaseKey();
  const syncKey = optionalEnv(['SYNC_FUNCTION_KEY', 'SUPABASE_FUNCTION_KEY', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']);
  const sinceDate = args.since ? new Date(`${args.since}T00:00:00.000Z`) : null;
  if (sinceDate && Number.isNaN(sinceDate.getTime())) throw new Error(`--since invalido: ${args.since}`);

  console.log('[parity] autenticando Zoho...');
  const accessToken = await getZohoAccessToken();

  console.log('[parity] lendo Zoho Desk...');
  const zohoRows = await fetchZohoTickets({ accessToken, sinceDate, maxPagesPerDepartment: args.maxZohoPagesPerDepartment });

  console.log('[parity] lendo Supabase...');
  const supabaseRows = await fetchSupabaseRows({ supabaseUrl, supabaseKey, sinceDate });
  const officialBiRows = await fetchOfficialBiRows({ supabaseUrl, supabaseKey, sinceDate });
  const syncHealth = await fetchSyncHealth({ supabaseUrl, supabaseKey });

  const zohoWeeks = buildPeriodMap(zohoRows, isoWeekKey);
  const supabaseWeeks = buildPeriodMap(supabaseRows, isoWeekKey);
  const zohoMonths = buildPeriodMap(zohoRows, monthKey);
  const supabaseMonths = buildPeriodMap(supabaseRows, monthKey);
  const weekly = comparePeriods(zohoWeeks, supabaseWeeks, args.weeks, args.tolerance);
  const monthly = comparePeriods(zohoMonths, supabaseMonths, args.months, args.tolerance);
  const officialWeeks = buildPeriodMap(officialBiRows, isoWeekKey);
  const officialMonths = buildPeriodMap(officialBiRows, monthKey);
  const officialWeeklyMetrics = periodMetricRows(officialWeeks, args.weeks);
  const officialMonthlyMetrics = periodMetricRows(officialMonths, args.months);
  const staleSync = syncHealth.filter((row) => !row.within24h);
  const idDiff = diffIds(zohoRows, supabaseRows);
  const supabaseMissingMetrics = supabaseRows.filter((row) => row.raw_metrics == null).length;
  const supabaseMissingDetail = supabaseRows.filter((row) => row.last_detail_sync_at == null).length;

  let fixActions = [];
  if (args.fix) {
    console.log('[parity] executando correcoes seguras...');
    fixActions = await runFixes({ args, supabaseUrl, syncKey, idDiff, supabaseRows });
  }

  const ok = weekly.every((row) => row.ok) &&
    monthly.every((row) => row.ok) &&
    idDiff.missingInSupabase.length === 0 &&
    idDiff.statusMismatch.length === 0 &&
    supabaseMissingMetrics === 0 &&
    supabaseMissingDetail === 0 &&
    staleSync.length === 0;

  const report = {
    generatedAt: new Date().toISOString(),
    ok,
    config: {
      supabaseUrl,
      since: sinceDate ? isoDate(sinceDate) : null,
      weeks: args.weeks,
      months: args.months,
      tolerance: args.tolerance,
      fix: args.fix,
      dryRun: args.dryRun
    },
    summary: {
      zohoTickets: zohoRows.length,
      supabaseTickets: supabaseRows.length,
      missingInSupabase: idDiff.missingInSupabase.length,
      extraInSupabase: idDiff.extraInSupabase.length,
      statusMismatch: idDiff.statusMismatch.length,
      supabaseMissingMetrics,
      supabaseMissingDetail,
      staleSyncTypes: staleSync.map((row) => row.syncType)
    },
    weekly,
    monthly,
    officialWeeklyMetrics,
    officialMonthlyMetrics,
    syncHealth,
    samples: {
      missingInSupabase: idDiff.missingInSupabase.slice(0, 50),
      extraInSupabase: idDiff.extraInSupabase.slice(0, 50),
      statusMismatch: idDiff.statusMismatch.slice(0, 50)
    },
    fixActions
  };

  const paths = await writeReport({ args, report });
  console.log(`[parity] relatorio JSON: ${paths.jsonPath}`);
  console.log(`[parity] relatorio MD: ${paths.mdPath}`);
  console.log(`[parity] status: ${ok ? 'OK' : 'DIVERGENTE'}`);

  if (!ok) process.exitCode = 2;
}

main().catch((error) => {
  console.error(`[parity] erro: ${error && error.stack ? error.stack : error}`);
  process.exitCode = 1;
});
