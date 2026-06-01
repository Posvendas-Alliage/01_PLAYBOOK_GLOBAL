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

    // SLA%: fechados com mtfc_horas E resolution_horas preenchidos — ambas as metas devem ser atendidas
    const withBoth = closedTickets.filter(t =>
        Number.isFinite(metricNumber(t.mtfc_horas_bi, t.mtfc_horas)) &&
        Number.isFinite(metricNumber(t.resolution_horas))
    );
    const withinSla = withBoth.filter(t => {
        const mtfc = metricNumber(t.mtfc_horas_bi, t.mtfc_horas);
        const resolutionHoras = metricNumber(t.resolution_horas);
        const priority = getTicketPriority(t);
        const region = getTicketRegionGroup(t);
        const mtfcTarget = MTFC_TARGET[priority] || MTFC_TARGET_DEFAULT;
        const mttsTarget = MTTS_TARGET_BY_REGION[region] ?? MTTS_DEFAULT_TARGET;
        return mtfc <= mtfcTarget && resolutionHoras <= mttsTarget;
    });

    const slaCompliance = withBoth.length ? (withinSla.length / withBoth.length) * 100 : 0;
    const targetRegion = regionGroup || getTicketRegionGroup(tickets.find(t => getTicketRegionGroup(t)) || {});
    // mttsColor opera em dias; MTTS_TARGET está em dias, MTTS_DEFAULT_TARGET está em horas
    const mttsColorTarget = MTTS_TARGET[targetRegion] || (MTTS_DEFAULT_TARGET / 24);
    const avgMtts = avg(mttsValues);

    return {
        total: tickets.length,
        closed: closedTickets.length,
        eligible: withBoth.length,
        withinSla: withinSla.length,
        outsideSla: withBoth.length - withinSla.length,
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
    return ticket.regiao_grupo || REGION_MAP[ticket.region] || ticket.region || '';
}

function getTicketPriority(ticket) {
    return ticket.priority_standard || ticket.priority || '';
}

function getTicketDepartment(ticket) {
    return ticket.department_name || ticket.tipo_atendimento || '';
}

function getTicketStatus(ticket) {
    return ticket.status || '';
}

function getTicketProduct(ticket) {
    return ticket.marca_produto || ticket.produtos || ticket.product || '';
}

function getTicketAgentGroup(ticket) {
    return ticket.grupo_operacional_agente || '';
}

function applyFilters(tickets, filters) {
    return tickets.filter(t => {
        if (filters.region && filters.region !== 'all') {
            if (getTicketRegionGroup(t) !== filters.region) return false;
        }
        if (filters.priority && filters.priority !== 'all') {
            if (getTicketPriority(t) !== filters.priority) return false;
        }
        if (filters.type && filters.type !== 'all') {
            if (getTicketDepartment(t) !== filters.type) return false;
        }
        if (filters.product && filters.product !== 'all') {
            const values = [getTicketProduct(t), getTicketStatus(t)].filter(Boolean);
            if (!values.includes(filters.product)) return false;
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
