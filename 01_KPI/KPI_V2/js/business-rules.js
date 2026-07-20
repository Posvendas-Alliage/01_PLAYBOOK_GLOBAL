const REGION_MAP = {
    'Brasil': 'Brasil',
    'Argentina': 'Argentina',
    'M\u00e9xico': 'M\u00e9xico',
    'Mexico': 'M\u00e9xico',
    'Am\u00e9rica latina - Exceto Argentina e M\u00e9xico': 'LATAM',
    'Estados Unidos': 'USA',
    'EUA': 'USA',
    'USA': 'USA',
    '\u00c1frica': 'ROW',
    '\u00c1sia': 'ROW',
    'Europa': 'ROW',
    '\u00cdndia': 'ROW',
    'Oceania': 'ROW',
    'ROW': 'ROW',
    'LATAM': 'LATAM'
};

const MTTS_TARGET = {
    Brasil: 4,
    Argentina: 5,
    'M\u00e9xico': 6,
    LATAM: 6,
    USA: 10,
    ROW: 10
};

const MTFC_TARGET = {
    'Urgente': 1,
    'Alta': 2,
    'M\u00e9dia': 3,
    'Media': 3,
    'Baixa': 5,
    'Muito Baixa': 6
};

const REGION_GROUPS = ['Brasil', 'Argentina', 'M\u00e9xico', 'LATAM', 'USA', 'ROW'];

// Em horas \u2014 para comparar com resolution_horas no c\u00e1lculo de SLA%
const MTTS_TARGET_BY_REGION = {
    'Brasil':    4  * 24,
    'Argentina': 5  * 24,
    'M\u00e9xico':    6  * 24,
    'LATAM':     6  * 24,
    'USA':       10 * 24,
    'ROW':       10 * 24
};

const MTFC_TARGET_DEFAULT = 3;
const MTTS_DEFAULT_TARGET = 7 * 24;

const EXCLUDED_DEPARTMENTS = ['1128522000008788112']; // Oficina — nunca mostrar

// ─────────────────────────────────────────────────────
// EXCLUDED_CONTACT_DOMAINS
// Domínios de email do SOLICITANTE (campo email do ticket) que devem ser
// excluídos de todos os cálculos de backlog e KPIs.
// Motivo: são distribuidores/parceiros externos que não representam
// atendimento operacional da Alliage.
//   - unicorndenmart.com → distribuidor Índia (Unicorn Denmart)
//   - webpeak.com.br     → fornecedor de TI (Webpeak)
// Validado em 01/jun/2026: apenas 1 ticket aberto afetado (#237565).
// ─────────────────────────────────────────────────────
const EXCLUDED_CONTACT_DOMAINS = [
    'unicorndenmart.com',
    'webpeak.com.br'
];

// ─────────────────────────────────────────────────────
// EXCLUDED_TICKET_NUMBERS
// Tickets específicos excluídos manualmente por decisão operacional.
//   - 220822 → ticket de teste/anomalia identificado em 01/jun/2026
// ─────────────────────────────────────────────────────
const EXCLUDED_TICKET_NUMBERS = ['220822', '236429', '236430'];

// Regiões com dashboard próprio — não são ROW
const REGIOES_PRINCIPAIS = [
    'Brasil',
    'Argentina',
    'México',
    'Estados Unidos',
    'América latina - Exceto Argentina e México',
];
function normalizeRegionText(value) {
    return String(value || '')
        .trim()
        .replace(/M\u00c3\u00a9xico/g, 'México')
        .replace(/Am\u00c3\u00a9rica/g, 'América')
        .replace(/\u00c3\u0081frica/g, 'África')
        .replace(/\u00c3\u0081sia/g, 'Ásia')
        .replace(/\u00c3\u008dndia/g, 'Índia');
}
// Critério único de ROW — usado em todos os componentes
function isROW(regiao) {
    const normalized = normalizeRegionText(regiao);
    return normalized !== '' &&
        normalized !== '-Nenhum-' &&
        !REGIOES_PRINCIPAIS.includes(normalized) &&
        !REGIOES_PRINCIPAIS.includes(REGION_MAP[normalized]);
}

function isExcludedTicket(ticket) {
    if (EXCLUDED_TICKET_NUMBERS.includes(String(ticket.ticket_number || ''))) return true;
    const email = (ticket.email || ticket.contact_email || '').toLowerCase().trim();
    if (EXCLUDED_CONTACT_DOMAINS.some(domain => email.endsWith('@' + domain) || email.includes('@' + domain))) return true;
    return false;
}

function slaColor(pct) {
    if (pct >= 80) return 'green';
    if (pct >= 50) return 'yellow';
    return 'red';
}

function mttsColor(value, target) {
    if (value <= target) return 'green';
    if (value <= target * 1.2) return 'yellow';
    return 'red';
}

function mtfcColor(value, target) {
    if (value <= target) return 'green';
    if (value <= target * 1.2) return 'yellow';
    return 'red';
}

function colorHex(name) {
    const map = {
        green: '#12DF34',
        yellow: '#E4BF14',
        red: '#E31424',
        gray: '#7d8590'
    };
    return map[name] || '#7d8590';
}

function normalizeStatus(value) {
    return String(value || '')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function metricNumber(...values) {
    for (const value of values) {
        if (value === null || value === undefined || value === '') continue;
        const parsed = Number(value);
        if (Number.isFinite(parsed)) return parsed;
    }
    return NaN;
}

function isClosedStatus(value) {
    return ['fechado', 'resolvido', 'closed', 'resolved'].includes(normalizeStatus(value));
}

function isOpenByStatusAndClosedTime(ticket) {
    return !ticket.closed_time && !isClosedStatus(ticket.status);
}

function isEligible(ticket) {
    if (Object.prototype.hasOwnProperty.call(ticket, 'is_sla_eligible')) {
        return ticket.is_sla_eligible === true;
    }
    return !!(ticket.created_time && ticket.closed_time && getTicketRegionGroup(ticket) && getTicketPriority(ticket));
}

function ticketSlaStatus(ticket) {
    if (ticket.sla_status_bi === 'Dentro SLA') return 'within';
    if (ticket.sla_status_bi === 'Fora SLA') return 'outside';
    if (ticket.sla_status_bi === 'Não elegível') return 'not_eligible';
    if (!ticket.closed_time) return 'open';
    if (!isEligible(ticket)) return 'not_eligible';

    const region = getTicketRegionGroup(ticket);
    const priority = getTicketPriority(ticket);
    const mtfcTarget = ticket.meta_mtfc_horas || MTFC_TARGET[priority];
    const mttsTarget = ticket.meta_mtts_dias || MTTS_TARGET[region];
    const mtfc = metricNumber(ticket.mtfc_horas_bi, ticket.mtfc_horas);
    const directMtts = metricNumber(ticket.mtts_dias_bi, ticket.mtts_dias);
    const resolutionHours = metricNumber(ticket.resolution_horas);
    const mtts = Number.isFinite(directMtts)
        ? directMtts
        : (Number.isFinite(resolutionHours) ? resolutionHours / 24 : NaN);

    if (!mtfcTarget || !mttsTarget || !isFinite(mtfc) || !isFinite(mtts)) return 'not_eligible';
    return mtfc <= mtfcTarget && mtts <= mttsTarget ? 'within' : 'outside';
}

function computeMetrics(tickets, regionGroup) {
    const closedTickets = tickets.filter(t => t.closed_time || isClosedStatus(t.status));
    const mtfcValues = closedTickets
        .map(t => metricNumber(t.mtfc_horas_bi, t.mtfc_horas))
        .filter(Number.isFinite);
    const mttsValues = closedTickets
        .map(t => {
            const directMtts = metricNumber(t.mtts_dias_bi, t.mtts_dias);
            if (Number.isFinite(directMtts)) return directMtts;
            const resolutionHours = metricNumber(t.resolution_horas);
            return Number.isFinite(resolutionHours) ? resolutionHours / 24 : NaN;
        })
        .filter(Number.isFinite);
    const avg = values => values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;

    // SLA% canonico do BI: elegibilidade + status SLA ja normalizados na base.
    const eligibleTickets = closedTickets.filter(isEligible);
    const withinSla = eligibleTickets.filter(t => ticketSlaStatus(t) === 'within');

    const slaCompliance = eligibleTickets.length ? (withinSla.length / eligibleTickets.length) * 100 : 0;
    const targetRegion = regionGroup || getTicketRegionGroup(tickets.find(t => getTicketRegionGroup(t)) || {});
    // mttsColor opera em dias; MTTS_TARGET está em dias, MTTS_DEFAULT_TARGET está em horas
    const mttsColorTarget = MTTS_TARGET[targetRegion] || (MTTS_DEFAULT_TARGET / 24);
    const avgMtts = avg(mttsValues);

    return {
        total: tickets.length,
        closed: closedTickets.length,
        eligible: eligibleTickets.length,
        withinSla: withinSla.length,
        outsideSla: eligibleTickets.length - withinSla.length,
        slaCompliance,
        slaColor: slaColor(slaCompliance),
        avgMtfc: avg(mtfcValues),
        avgMtts,
        mttsColor: mttsColor(avgMtts, mttsColorTarget)
    };
}

function computeByRegion(tickets) {
    const byRegion = {};
    REGION_GROUPS.forEach(regionGroup => {
        byRegion[regionGroup] = computeMetrics(
            tickets.filter(ticket => getTicketRegionGroup(ticket) === regionGroup),
            regionGroup
        );
    });
    return byRegion;
}

function getTicketRegionGroup(ticket) {
    const raw = normalizeRegionText(ticket.regiao_grupo || ticket.region || '');
    return REGION_MAP[raw] || raw;
}

function getTicketPriority(ticket) {
    return ticket.priority_standard || ticket.priority || '';
}

function getTicketDepartment(ticket) {
    return ticket.department_name || ticket.department || '';
}

function getTicketType(ticket) {
    return ticket.tipo_atendimento || ticket.type || '';
}

function getTicketStatus(ticket) {
    return ticket.status || '';
}

function getTicketProduct(ticket) {
    return ticket.marca_produto || ticket.produtos || ticket.product || '';
}

function normalizeProductText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function getTicketProductLine(ticket) {
    const product = normalizeProductText(getTicketProduct(ticket));
    if (!product) return '';

    if (
        product.includes('digitalizador') ||
        product.includes('eagle') ||
        product.includes('raio-x') ||
        product.includes('raio x') ||
        product.includes('scanner') ||
        product.includes('sensor intraoral') ||
        product.includes('tomografo') ||
        product.includes('panoramico')
    ) {
        return 'imaging';
    }

    if (
        product.includes('autoclave') ||
        product.includes('bomba vacuo') ||
        product.includes('compressor') ||
        product.includes('consultorio') ||
        product.includes('fotopolimerizador') ||
        product.includes('micro motor') ||
        product.includes('pecas de mao') ||
        product.includes('perfilaxia') ||
        product.includes('profilaxia')
    ) {
        return 'dental';
    }

    return '';
}

function getTicketOperationalGroup(ticket, agent) {
    const categoria = (ticket.categoria_custom || ticket.categoria || '').toLowerCase().trim();
    const tipoAtend = (ticket.tipo_atendimento || '').toLowerCase().trim();
    const agenteName = (agent?.first_name || '').trim();

    if (categoria.includes('instala') || tipoAtend.includes('instala')) return 'Instalação';
    if (agenteName === 'Geovana') return 'Instalação';

    if (!agenteName || agenteName === '') return 'Sem dono';
    if (['Alliage', 'Norberto'].includes(agenteName)) return 'Sem dono';

    if (['Danielly', 'Contato'].includes(agenteName)) return 'Terceiro';

    if (['Camila', 'Ademar'].includes(agenteName)) return 'Especialista';

    return 'Suporte geral';
}

function getTicketAgentGroup(ticket) {
    if (ticket.grupo_operacional_agente) return ticket.grupo_operacional_agente;
    const rawAgentName = ticket.agent_name || '';
    const firstName = rawAgentName.split(' ')[0].trim();
    return getTicketOperationalGroup(ticket, { first_name: firstName });
}

function applyFilters(tickets, filters) {
    return tickets.filter(t => {
        if (isExcludedTicket(t)) return false;
        if (filters.region && filters.region !== 'all') {
            if (filters.region === 'ROW') {
                if (getTicketRegionGroup(t) !== 'ROW') return false;
            } else {
                if (getTicketRegionGroup(t) !== filters.region) return false;
            }
        }
        if (filters.department && filters.department !== 'all') {
            if (getTicketDepartment(t) !== filters.department) return false;
        }
        if (filters.priority && filters.priority !== 'all') {
            if (getTicketPriority(t) !== filters.priority) return false;
        }
        if (filters.type && filters.type !== 'all') {
            if (getTicketType(t) !== filters.type) return false;
        }
        if (filters.productLine && filters.productLine !== 'all') {
            if (getTicketProductLine(t) !== filters.productLine) return false;
        }
        if (filters.product && filters.product !== 'all') {
            if (String(filters.product).startsWith('line:')) {
                if (getTicketProductLine(t) !== String(filters.product).replace('line:', '')) return false;
            } else {
                const values = [getTicketProduct(t), getTicketStatus(t)].filter(Boolean);
                if (!values.includes(filters.product)) return false;
            }
        }
        if (filters.dateFrom) {
            if (!t.closed_time || new Date(t.closed_time) < new Date(filters.dateFrom)) return false;
        }
        if (filters.dateTo) {
            if (!t.closed_time) return false;
            const to = new Date(filters.dateTo);
            to.setHours(23, 59, 59, 999);
            if (new Date(t.closed_time) > to) return false;
        }
        if (Array.isArray(filters.agentGroups) && Object.prototype.hasOwnProperty.call(t, 'grupo_operacional_agente')) {
            if (filters.agentGroups.length === 0) return false;
            if (!filters.agentGroups.includes(getTicketAgentGroup(t))) return false;
        }
        return true;
    });
}

const AGENT_GROUPS = ['Suporte geral', 'Especialista', 'Instala\u00e7\u00e3o', 'Terceiro', 'Sem dono'];
const DEFAULT_AGENT_GROUPS = ['Suporte geral', 'Especialista', 'Sem dono'];


const HISTORICAL_KPI_SNAPSHOTS_URL = 'data/historical-kpi-snapshots.json';
let _historicalKpiSnapshotsPromise = null;
let _historicalKpiSnapshots = null;

async function loadHistoricalKpiSnapshots() {
    if (_historicalKpiSnapshots) return _historicalKpiSnapshots;
    if (!_historicalKpiSnapshotsPromise) {
        _historicalKpiSnapshotsPromise = fetch(HISTORICAL_KPI_SNAPSHOTS_URL, { method: 'GET' }).then(async response => {
            if (!response.ok) return null;
            return response.json();
        }).catch(() => null);
    }
    _historicalKpiSnapshots = await _historicalKpiSnapshotsPromise;
    return _historicalKpiSnapshots;
}

function getHistoricalWeeklyKpiSnapshot(dateFrom, dateTo) {
    const snapshots = _historicalKpiSnapshots && _historicalKpiSnapshots.weekly;
    if (!snapshots || !dateFrom || !dateTo) return null;
    return snapshots[String(dateFrom).slice(0, 10) + '__' + String(dateTo).slice(0, 10)] || null;
}

function getHistoricalMonthlyKpiSnapshot(monthKey) {
    const snapshots = _historicalKpiSnapshots && _historicalKpiSnapshots.monthly;
    if (!snapshots || !monthKey) return null;
    return snapshots[String(monthKey).slice(0, 7)] || null;
}
