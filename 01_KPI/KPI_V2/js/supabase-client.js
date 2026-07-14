const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_KEY = window.SUPABASE_ANON_KEY || '';
const LEGACY_SUPABASE_URL = window.PLAYBOOK_LEGACY_SUPABASE_URL || 'https://hqaxpbnduupjdhuuwpmg.supabase.co';
const LEGACY_SUPABASE_KEY = window.PLAYBOOK_LEGACY_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYXhwYm5kdXVwamRodXV3cG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTk4NDUsImV4cCI6MjA5MzQ5NTg0NX0.8mfyVws9T8EnCOKkc0r4F56OP_wDQyIac3Xbxt2KaFs';
const HISTORICAL_SOURCE_CUTOFF_DATE = window.PLAYBOOK_HISTORICAL_SOURCE_CUTOFF_DATE || '2026-07-12';

let _cache = null;
let _cacheTime = null;
let _dashboardCache = {};
let _dashboardCacheTime = {};
const CACHE_TTL = 5 * 60 * 1000;
const BI_DASHBOARD_TYPES = ['bi-kpis', 'bi-region-summary', 'bi-summary', 'bi-backlog', 'bi-tickets', 'sync-health'];

function shouldUseLegacyDashboardSource(dateFrom, dateTo) {
    const end = String(dateTo || dateFrom || '').slice(0, 10);
    return !!end && end < HISTORICAL_SOURCE_CUTOFF_DATE;
}

function getDashboardSourceKeyForPeriod(dateFrom, dateTo) {
    return shouldUseLegacyDashboardSource(dateFrom, dateTo) ? 'legacy' : 'current';
}

function normalizeDashboardOptions(options) {
    if (typeof options === 'string') return { source: options };
    return options || {};
}

function resolveDashboardSource(options) {
    const opts = normalizeDashboardOptions(options);
    if (opts.source === 'legacy') {
        return {
            key: 'legacy',
            url: LEGACY_SUPABASE_URL,
            anonKey: LEGACY_SUPABASE_KEY,
            useSession: false
        };
    }
    return {
        key: 'current',
        url: SUPABASE_URL,
        anonKey: SUPABASE_KEY,
        useSession: true
    };
}

async function supabaseAccessToken() {
    try {
        if (window.PlaybookAuth && typeof window.PlaybookAuth.getSession === 'function') {
            const session = await window.PlaybookAuth.getSession();
            if (session && session.access_token) return session.access_token;
        }
    } catch (error) {
        console.warn('[Supabase] Nao foi possivel recuperar sessao autenticada.', error);
    }

    return SUPABASE_KEY;
}

async function supabaseHeaders(source) {
    const accessToken = source.useSession ? await supabaseAccessToken() : source.anonKey;

    return {
        'apikey': source.anonKey,
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    };
}

async function fetchDashboard(type, params = {}, options = {}) {
    if (!BI_DASHBOARD_TYPES.includes(type)) {
        throw new Error(`Dashboard endpoint nao permitido: ${type}`);
    }
    const source = resolveDashboardSource(options);
    if (!source.url || !source.anonKey) {
        throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY ausentes.');
    }
    const dashboardReadUrl = `${source.url}/functions/v1/dashboard-read`;
    const search = new URLSearchParams({ type });
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            search.set(key, String(value));
        }
    });
    const cacheKey = `${source.key}:${search.toString()}`;
    if (_dashboardCache[cacheKey] && (Date.now() - _dashboardCacheTime[cacheKey] < CACHE_TTL)) {
        return _dashboardCache[cacheKey];
    }

    const res = await fetch(`${dashboardReadUrl}?${search.toString()}`, {
        method: 'GET',
        headers: await supabaseHeaders(source)
    });
    if (!res.ok) throw new Error(`Dashboard API error (${type}/${source.key}): ${res.status}`);

    const payload = await res.json();
    if (!payload || payload.success !== true || !Array.isArray(payload.data)) {
        throw new Error(`Dashboard API retornou formato invalido (${type}).`);
    }

    _dashboardCache[cacheKey] = payload;
    _dashboardCacheTime[cacheKey] = Date.now();
    return payload;
}

async function fetchDashboardBiData(options = {}) {
    const [kpis, regionSummary, summary] = await Promise.all([
        fetchDashboard('bi-kpis', {}, options),
        fetchDashboard('bi-region-summary', {}, options),
        fetchDashboard('bi-summary', {}, options)
    ]);

    return {
        kpis: kpis.data,
        regionSummary: regionSummary.data,
        summary: summary.data,
        meta: {
            kpis,
            regionSummary,
            summary
        }
    };
}

async function fetchDashboardBiBacklog(options = {}) {
    const backlog = await fetchDashboard('bi-backlog', { limit: 500 }, options);
    const OFICINA_DEPT_ID = '1128522000008788112';
    const data = backlog.data
        .filter(row => row.department_id !== OFICINA_DEPT_ID)
        .filter(row => !isExcludedTicket(row));
    return {
        backlog: data,
        meta: backlog
    };
}

async function fetchDashboardBiTickets(limit = 10000, options = {}) {
    const payload = await fetchDashboard('bi-tickets', { limit }, options);
    const tickets = payload.data.map(row => ({
        ...row,
        id: row.ticket_id,
        source_region: row.region,
        region_group: row.regiao_grupo || row.region,
        region: row.regiao_grupo || row.region,
        priority: row.priority_standard || row.priority,
        mtfc_horas: row.mtfc_horas_bi,
        mtts_dias: row.mtts_dias_bi,
        resolution_horas: row.mtts_dias_bi === null || row.mtts_dias_bi === undefined
            ? null
            : Number(row.mtts_dias_bi) * 24,
        assignee_id: row.agent_name || row.agent_email,
        solicitante: row.contact_name || row.contact_email,
        marca_produto: row.produtos,
        categoria_custom: row.categoria,
        numero_serie: row.numero_serie
    })).filter(row => !isExcludedTicket(row));
    return {
        tickets,
        meta: payload
    };
}

async function fetchSyncHealth(options = {}) {
    const payload = await fetchDashboard('sync-health', {}, options);
    return {
        health: payload.data && payload.data[0] ? payload.data[0] : null,
        meta: payload
    };
}

async function fetchAgents() {
    window.AGENT_FIRST_NAMES = window.AGENT_FIRST_NAMES || {};
    window.EXCLUDED_AGENT_IDS = window.EXCLUDED_AGENT_IDS || [];
}

async function fetchAllTickets() {
    if (_cache && (Date.now() - _cacheTime < CACHE_TTL)) return _cache;

    const { tickets } = await fetchDashboardBiTickets(10000);
    _cache = tickets;
    _cacheTime = Date.now();
    return tickets;
}
function clearCache() {
    _cache = null;
    _cacheTime = null;
    _dashboardCache = {};
    _dashboardCacheTime = {};
    window.AGENT_FIRST_NAMES = undefined;
    window.EXCLUDED_AGENT_IDS = undefined;
}

function hasSupabaseCredentials() {
    return !!((window.SUPABASE_URL && window.SUPABASE_ANON_KEY) || (LEGACY_SUPABASE_URL && LEGACY_SUPABASE_KEY));
}