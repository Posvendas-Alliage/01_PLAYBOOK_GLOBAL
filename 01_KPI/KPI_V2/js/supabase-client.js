const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_KEY = window.SUPABASE_ANON_KEY || '';
const HISTORICAL_SOURCE_CUTOFF_DATE = window.PLAYBOOK_HISTORICAL_SOURCE_CUTOFF_DATE || '2026-07-12';

let _cache = null;
let _cacheTime = null;
let _dashboardCache = {};
let _dashboardCacheTime = {};
const CACHE_TTL = 5 * 60 * 1000;
const BI_DASHBOARD_TYPES = ['bi-kpis', 'bi-region-summary', 'bi-summary', 'bi-backlog', 'bi-tickets', 'sync-health'];
const KPI_AUTH_SESSION_KEY = 'playbookKpiAuthRequired';


const LOCAL_REST_BI_TICKET_COLUMNS = 'ticket_id,ticket_number,subject,status,priority,department_name,agent_name,pais,region,categoria,produtos,tipo_atendimento,created_time,closed_time,due_date,response_due_date,regiao_grupo,priority_standard,mtfc_horas_bi,mtts_dias_bi,aging_backlog_dias,is_open,is_closed,is_sla_eligible,meta_mtts_dias,meta_mtfc_horas,sla_status_bi,agent_email,contact_name,contact_email,regiao,grupo_operacional_agente';

function isLocalDashboardDevHost() {
    const host = window.location.hostname;
    return host === '127.0.0.1' || host === 'localhost';
}

async function fetchRestPagedLocal(source, table, select, params = {}, limit = 10000) {
    const pageSize = Math.min(1000, limit);
    const rows = [];
    for (let offset = 0; offset < limit; offset += pageSize) {
        const search = new URLSearchParams({ select, limit: String(pageSize), offset: String(offset) });
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') search.set(key, String(value));
        });
        const res = await fetch(`${source.url}/rest/v1/${table}?${search.toString()}`, {
            headers: {
                apikey: source.anonKey,
                Authorization: `Bearer ${source.anonKey}`,
                Accept: 'application/json'
            }
        });
        if (!res.ok) throw new Error(`REST local fallback error (${table}): ${res.status}`);
        const page = await res.json();
        if (!Array.isArray(page)) throw new Error(`REST local fallback retornou formato invalido (${table}).`);
        rows.push(...page);
        if (page.length < pageSize) break;
    }
    return rows.slice(0, limit);
}

async function fetchDashboardLocalFallback(type, params, source) {
    if (!isLocalDashboardDevHost()) return null;
    if (!source.url || !source.anonKey) return null;

    if (type === 'bi-tickets') {
        const limit = Math.min(Number(params.limit || 10000) || 10000, 10000);
        const rows = await fetchRestPagedLocal(
            source,
            'vw_tickets_bi_base',
            LOCAL_REST_BI_TICKET_COLUMNS,
            {
                or: '(is_weekly_report_filter_included.eq.true,department_name.eq.SAC)',
                order: 'created_time.desc'
            },
            limit
        );
        return { success: true, data: rows, source: 'local-rest-fallback', type };
    }

    if (type === 'bi-backlog') {
        const limit = Math.min(Number(params.limit || 500) || 500, 10000);
        const rows = await fetchRestPagedLocal(
            source,
            'vw_dashboard_bi_backlog',
            '*',
            { order: 'aging_backlog_dias.desc' },
            limit
        );
        return { success: true, data: rows, source: 'local-rest-fallback', type };
    }

    if (type === 'bi-kpis') {
        const rows = await fetchRestPagedLocal(source, 'vw_dashboard_bi_kpis', '*', {}, 1000);
        return { success: true, data: rows, source: 'local-rest-fallback', type };
    }

    if (type === 'bi-region-summary') {
        const rows = await fetchRestPagedLocal(source, 'vw_dashboard_bi_region_summary', '*', {}, 1000);
        return { success: true, data: rows, source: 'local-rest-fallback', type };
    }

    if (type === 'bi-summary') {
        const rows = await fetchRestPagedLocal(source, 'vw_dashboard_bi_summary', '*', {}, 10000);
        return { success: true, data: rows, source: 'local-rest-fallback', type };
    }

    return null;
}

function readDashboardBooleanFlag(value) {
    if (value === true) return true;
    const normalized = String(value || '').trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

function isDashboardAuthRequired() {
    if (readDashboardBooleanFlag(window.PLAYBOOK_KPI_AUTH_REQUIRED)) return true;
    try {
        return window.sessionStorage.getItem(KPI_AUTH_SESSION_KEY) === '1';
    } catch (_error) {
        return false;
    }
}

function dashboardLoginUrl(reason) {
    const loginUrl = new URL('/login.html', window.location.origin);
    loginUrl.searchParams.set('returnTo', window.location.pathname + window.location.search + window.location.hash);
    loginUrl.searchParams.set('reason', reason || 'missing_session');
    loginUrl.searchParams.set('auto', '0');
    return loginUrl.href;
}

function showDashboardLoginNotice(reason) {
    const normalizedReason = reason || 'missing_session';
    const existing = document.getElementById('dashboard-login-notice');
    if (existing) existing.remove();

    ['loading', 'page-body', 'error-banner', 'error-message'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });

    const target = document.querySelector('.app-main') || document.querySelector('main') || document.body;
    const notice = document.createElement('section');
    notice.id = 'dashboard-login-notice';
    notice.className = 'dashboard-login-notice';
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');

    const title = document.createElement('h2');
    title.textContent = 'Login necessario para acessar a dashboard';

    const text = document.createElement('p');
    text.textContent = normalizedReason === 'not_approved'
        ? 'Sua conta precisa estar aprovada para visualizar os indicadores protegidos.'
        : 'Os dados desta dashboard sao protegidos. Entre com sua conta aprovada para visualizar os indicadores.';

    const action = document.createElement('a');
    action.className = 'dashboard-login-notice-action';
    action.href = dashboardLoginUrl(normalizedReason);
    action.textContent = 'Fazer login';

    notice.appendChild(title);
    notice.appendChild(text);
    notice.appendChild(action);
    target.prepend(notice);
}

function redirectToDashboardLogin(reason) {
    showDashboardLoginNotice(reason);
}

function waitForDashboardLogin() {
    return new Promise(() => {});
}
function handleDashboardAuthFailure(status) {
    if (status !== 401 && status !== 403) return false;
    showDashboardLoginNotice(status === 403 ? 'not_approved' : 'missing_session');
    return true;
}

function shouldUseLegacyDashboardSource(dateFrom, dateTo) {
    return false;
}

function getDashboardSourceKeyForPeriod(dateFrom, dateTo) {
    return 'current';
}

function normalizeDashboardOptions(options) {
    if (typeof options === 'string') return { source: options };
    return options || {};
}

function resolveDashboardSource(options) {
    const opts = normalizeDashboardOptions(options);
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

    if (isDashboardAuthRequired()) {
        redirectToDashboardLogin('missing_session');
        return waitForDashboardLogin();
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

function clearDashboardCacheForType(type) {
    const marker = `:type=${type}`;
    Object.keys(_dashboardCache).forEach(key => {
        if (key.includes(marker)) {
            delete _dashboardCache[key];
            delete _dashboardCacheTime[key];
        }
    });
}

function postgrestInValue(value) {
    return String(value).replace(/,/g, "").trim();
}

async function fetchBacklogTicketObservations(ticketIds, options = {}) {
    const ids = [...new Set((ticketIds || []).map(id => String(id || "").trim()).filter(Boolean))];
    if (!ids.length) return new Map();

    const source = resolveDashboardSource(options);
    if (!source.url || !source.anonKey) return new Map();

    const observations = new Map();
    const chunkSize = 80;
    for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        const search = new URLSearchParams({ select: "ticket_id,observation,updated_at,updated_by" });
        search.set("ticket_id", `in.(${chunk.map(postgrestInValue).join(",")})`);
        const res = await fetch(`${source.url}/rest/v1/playbook_ticket_observations?${search.toString()}`, {
            headers: await supabaseHeaders(source)
        });

        if (!res.ok) {
            console.warn(`[Supabase] Observacoes do backlog indisponiveis: ${res.status}`);
            return observations;
        }

        const rows = await res.json();
        if (Array.isArray(rows)) {
            rows.forEach(row => observations.set(String(row.ticket_id), row));
        }
    }
    return observations;
}

async function saveBacklogTicketObservation(ticketId, observation, options = {}) {
    const id = String(ticketId || "").trim();
    if (!id) throw new Error("Ticket invalido para salvar observacao.");

    const source = resolveDashboardSource(options);
    if (!source.url || !source.anonKey) throw new Error("SUPABASE_URL / SUPABASE_ANON_KEY ausentes.");

    const res = await fetch(`${source.url}/rest/v1/playbook_ticket_observations`, {
        method: "POST",
        headers: {
            ...(await supabaseHeaders(source)),
            Prefer: "resolution=merge-duplicates,return=representation"
        },
        body: JSON.stringify({
            ticket_id: id,
            observation: String(observation || "").trim()
        })
    });

    if (!res.ok) throw new Error(`Falha ao salvar observacao (${res.status}).`);
    clearDashboardCacheForType("bi-backlog");
    const payload = await res.json();
    return Array.isArray(payload) ? payload[0] : payload;
}

async function fetchDashboard(type, params = {}, options = {}) {
    if (!BI_DASHBOARD_TYPES.includes(type)) {
        throw new Error(`Dashboard endpoint nao permitido: ${type}`);
    }
    const source = resolveDashboardSource(options);
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

    if (!source.url || !source.anonKey) {
        throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY ausentes.');
    }
    const dashboardReadUrl = `${source.url}/functions/v1/dashboard-read`;
    const res = await fetch(`${dashboardReadUrl}?${search.toString()}`, {
        method: 'GET',
        headers: await supabaseHeaders(source)
    });
    if (!res.ok) {
        const localFallback = await fetchDashboardLocalFallback(type, params, source).catch(error => {
            console.warn('[Supabase] REST local fallback falhou.', error);
            return null;
        });
        if (localFallback) {
            _dashboardCache[cacheKey] = localFallback;
            _dashboardCacheTime[cacheKey] = Date.now();
            return localFallback;
        }
        if (handleDashboardAuthFailure(res.status)) {
            return waitForDashboardLogin();
        }
        throw new Error(`Dashboard API error (${type}/${source.key}): ${res.status}`);
    }

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
    return !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY);
}
