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
const BI_DASHBOARD_TYPES = ['bi-kpis', 'bi-region-summary', 'bi-summary', 'bi-backlog', 'bi-tickets', 'sync-health'];

function supabaseHeaders() {
    return {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
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
        headers: supabaseHeaders()
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
    return {
        backlog: backlog.data,
        meta: backlog
    };
}

async function fetchDashboardBiTickets(limit = 10000) {
    const payload = await fetchDashboard('bi-tickets', { limit });
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
    }));
    return {
        tickets,
        meta: payload
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
    if (window.AGENT_FIRST_NAMES) return;

    const url = `${SUPABASE_URL}/rest/v1/zoho_agents?select=id,first_name,email`;
    const res = await fetch(url, {
        headers: supabaseHeaders()
    });
    if (!res.ok) throw new Error(`Supabase agents error: ${res.status}`);
    const agents = await res.json();

    window.AGENT_FIRST_NAMES = {};
    window.EXCLUDED_AGENT_IDS = [];

    agents.forEach(a => {
        window.AGENT_FIRST_NAMES[a.id] = a.first_name || '';
        if (a.first_name === 'Vitor' || (a.email || '').includes('@unicorn')) {
            window.EXCLUDED_AGENT_IDS.push(a.id);
        }
    });

    console.log('[Exclusions] Agentes excluídos:', window.EXCLUDED_AGENT_IDS);
}

async function fetchAllTickets() {
    if (_cache && (Date.now() - _cacheTime < CACHE_TTL)) return _cache;

    await fetchAgents();
    const excluded = window.EXCLUDED_AGENT_IDS || [];

    const LIMIT = 1000;
    let offset = 0;
    let allData = [];
    let hasMore = true;

    const fields = [
        'id', 'ticket_number', 'region', 'priority', 'status',
        'mtfc_horas', 'resolution_horas', 'created_time', 'closed_time',
        'tipo_atendimento', 'marca_produto', 'produtos', 'assignee_id',
        'pais', 'department_id', 'categoria_custom', 'solicitante',
        'numero_serie', 'regiao'
    ].join(',');

    while (hasMore) {
        const url = `${SUPABASE_URL}/rest/v1/zoho_tickets?select=${fields}&is_deleted=eq.false&order=created_time.desc&limit=${LIMIT}&offset=${offset}`;
        const res = await fetch(url, {
            headers: supabaseHeaders()
        });
        if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
        const batch = await res.json();
        const filteredBatch = excluded.length
            ? batch.filter(t => !excluded.includes(t.assignee_id))
            : batch;
        allData = allData.concat(filteredBatch);
        hasMore = batch.length === LIMIT;
        offset += LIMIT;
    }

    _cache = allData;
    _cacheTime = Date.now();
    return allData;
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
