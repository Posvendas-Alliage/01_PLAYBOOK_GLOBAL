const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_KEY = window.SUPABASE_ANON_KEY || '';
const DASHBOARD_READ_URL = SUPABASE_URL
    ? `${SUPABASE_URL}/functions/v1/dashboard-read`
    : '';

let _cache = null;
let _cacheTime = null;
let _dashboardCache = {};
let _dashboardCacheTime = {};
const CACHE_TTL = 5 * 60 * 1000;
const BI_DASHBOARD_TYPES = ['bi-kpis', 'bi-region-summary', 'bi-summary', 'bi-backlog', 'bi-tickets', 'bi-country-options', 'sync-health'];

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

async function supabaseHeaders() {
    const accessToken = await supabaseAccessToken();

    return {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    };
}

async function fetchDashboard(type, params = {}) {
    if (!BI_DASHBOARD_TYPES.includes(type)) {
        throw new Error(`Dashboard endpoint nao permitido: ${type}`);
    }
    if (!DASHBOARD_READ_URL || !SUPABASE_KEY) {
        throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY ausentes.');
    }
    const search = new URLSearchParams({ type });
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            search.set(key, String(value));
        }
    });
    const cacheKey = search.toString();
    if (_dashboardCache[cacheKey] && (Date.now() - _dashboardCacheTime[cacheKey] < CACHE_TTL)) {
        return _dashboardCache[cacheKey];
    }

    const res = await fetch(`${DASHBOARD_READ_URL}?${search.toString()}`, {
        method: 'GET',
        headers: await supabaseHeaders()
    });
    if (!res.ok) throw new Error(`Dashboard API error (${type}): ${res.status}`);

    const payload = await res.json();
    if (!payload || payload.success !== true || !Array.isArray(payload.data)) {
        throw new Error(`Dashboard API retornou formato invalido (${type}).`);
    }

    _dashboardCache[cacheKey] = payload;
    _dashboardCacheTime[cacheKey] = Date.now();
    return payload;
}

async function fetchDashboardBiData() {
    const [kpis, regionSummary, summary] = await Promise.all([
        fetchDashboard('bi-kpis'),
        fetchDashboard('bi-region-summary'),
        fetchDashboard('bi-summary')
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

async function fetchDashboardBiBacklog() {
    const backlog = await fetchDashboard('bi-backlog', { limit: 500 });
    const OFICINA_DEPT_ID = '1128522000008788112';
    const data = backlog.data
        .filter(row => row.department_id !== OFICINA_DEPT_ID)
        .filter(row => !isExcludedTicket(row));
    return {
        backlog: data,
        meta: backlog
    };
}

async function fetchDashboardBiTickets(limit = 10000) {
    const payload = await fetchDashboard('bi-tickets', { limit });
    const tickets = payload.data.map(normalizeBiTicketRow).filter(row => !isExcludedTicket(row));
    return {
        tickets,
        meta: payload
    };
}

function normalizeBiTicketRow(row) {
    return {
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
    };
}

async function fetchDashboardBiCountryOptions(limit = 50000) {
    const payload = await fetchDashboard('bi-country-options', { limit });
    const countries = payload.data.map(row => ({
        ...row,
        id: row.ticket_id,
        country_filter: row.pais_detalhado || row.cf_pais_1 || row.pais
    })).filter(row => !isExcludedTicket(row));
    return {
        countries,
        meta: payload
    };
}

async function fetchDashboardBiCountryOptionsFallback() {
    try {
        const result = await fetchDashboardBiCountryOptions();
        if (result.countries.length) return result;
    } catch (error) {
        console.warn('[Supabase] bi-country-options indisponivel; usando bi-tickets como fallback.', error);
    }

    const { tickets, meta } = await fetchDashboardBiTickets();
    return {
        countries: tickets,
        meta
    };
}

async function fetchSyncHealth() {
    const payload = await fetchDashboard('sync-health');
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
    return !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY);
}
