const TRANSLATIONS = {
    pt: {
        nav_overview: "Visão Global",
        nav_backlog: "Daily",
        nav_quality: "Qualidade de Dados",
        nav_weekly: "Weekly",
        nav_monthly: "Monthly",
        filter_region: "Região",
        filter_priority: "Prioridade",
        filter_period: "Período (Closed Time)",
        filter_type: "Tipo",
        filter_agent: "Agente",
        filter_product: "Produto",
        filter_all: "Todos",
        kpi_sla: "SLA Compliance",
        kpi_mtts: "MTTS (dias)",
        kpi_mtfc: "MTFC (horas)",
        kpi_tickets: "Total Tickets",
        kpi_backlog: "Backlog Aberto",
        kpi_csat: "CSAT",
        sla_on_target: "No alvo",
        sla_attention: "Atenção",
        sla_critical: "Crítico",
        loading: "Carregando dados...",
        error_fetch: "Erro ao carregar dados. Verifique a conexão.",
        globe_hover: "Passe o mouse sobre uma região",
        within_sla: "Dentro do SLA",
        outside_sla: "Fora do SLA",
        not_eligible: "Não elegível",
        with_first_response: "Com primeira resposta",
        without_first_response: "Sem primeira resposta",
        open_tickets: "Tickets Abertos",
        closed_tickets: "Tickets Fechados",
        backlog_aging: "Aging do Backlog",
        days: "dias",
        hours: "horas",
        week: "Semana",
        month: "Mês",
        region_brazil: "Brasil",
        region_argentina: "Argentina",
        region_mexico: "México",
        region_latam: "LATAM",
        region_usa: "Estados Unidos",
        region_row: "ROW",
        btn_refresh: "Atualizar",
        btn_export_pdf: "Exportar PDF",
        filter_agent_group: "Grupo do Agente",
        no_data: "Sem dados",
        app_title: "Global Service Governance — KPI Dashboard",
        app_subtitle: "Playbook Global | Módulo KPI",
        back_to_playbook: "Voltar ao Playbook",
        hub_title: "Global Service Governance — KPI Dashboard",
        hub_intro: "Hub central para as tres visoes oficiais do modulo KPI: Daily, Weekly e Monthly. Cada pagina usa os endpoints BI alinhados ao Power BI.",
        sync_title: "Supabase Sync Health",
        sync_loading: "Carregando status da Edge Function...",
        sync_updated_24h: "Atualizados 24h",
        sync_errors_24h: "Erros 24h",
        sync_sla_7d: "SLA 7d",
        sync_last_run: "Última execução",
        sync_ok: "Edge Function e base operacional sem alertas recentes.",
        sync_attention: "Há alertas de sincronização para revisar.",
        sync_unavailable: "Status indisponível no momento.",
        sync_load_error: "Não foi possível carregar o status do Supabase.",
        conn_missing: "Supabase não configurado",
        conn_ok: "Supabase conectado",
        conn_error: "Erro de conexão:",
        conn_network: "Falha de rede",
        hub_overview_desc: "Globo 3D interativo com semáforo SLA por região, KPIs consolidados e comparação regional.",
        hub_backlog_desc: "Controle diario da fila aberta com aging, primeira resposta, dependencias e tickets que precisam de decisao no dia.",
        hub_quality_desc: "Completude dos campos obrigatórios usando a mesma base BI filtrada do report.",
        hub_weekly_desc: "Leitura semanal em formato de report, com indicadores comparativos e follow-up operacional.",
        hub_monthly_desc: "Visao mensal direta para diretoria: key metrics do periodo e backlog consolidado por regiao.",
        audience_daily: "Linha de frente + Coordenador",
        audience_weekly: "Coordenadores + Gerente",
        audience_monthly: "Gerente + Diretor",
        btn_open: "Abrir",
        app_footer: "Playbook Global · Global Service · Módulo KPI",
        banner_validity: "Análises válidas a partir de 01/06/2026 — dados anteriores podem conter inconsistências de classificação",
        no_filter_data: "Nenhum dado encontrado para os filtros selecionados",
        last_sync_label: "Última atualização:"
    },
    en: {
        nav_overview: "Global Overview",
        nav_backlog: "Daily",
        nav_quality: "Data Quality",
        nav_weekly: "Weekly",
        nav_monthly: "Monthly",
        filter_region: "Region",
        filter_priority: "Priority",
        filter_period: "Period (Closed Time)",
        filter_type: "Type",
        filter_agent: "Agent",
        filter_product: "Product",
        filter_all: "All",
        kpi_sla: "SLA Compliance",
        kpi_mtts: "MTTS (days)",
        kpi_mtfc: "MTFC (hours)",
        kpi_tickets: "Total Tickets",
        kpi_backlog: "Open Backlog",
        kpi_csat: "CSAT",
        sla_on_target: "On Target",
        sla_attention: "Attention",
        sla_critical: "Critical",
        loading: "Loading data...",
        error_fetch: "Error loading data. Check connection.",
        globe_hover: "Hover over a region",
        within_sla: "Within SLA",
        outside_sla: "Outside SLA",
        not_eligible: "Not eligible",
        with_first_response: "With first response",
        without_first_response: "Without first response",
        open_tickets: "Open Tickets",
        closed_tickets: "Closed Tickets",
        backlog_aging: "Backlog Aging",
        days: "days",
        hours: "hours",
        week: "Week",
        month: "Month",
        region_brazil: "Brazil",
        region_argentina: "Argentina",
        region_mexico: "Mexico",
        region_latam: "LATAM",
        region_usa: "United States",
        region_row: "ROW",
        btn_refresh: "Refresh",
        btn_export_pdf: "Export PDF",
        filter_agent_group: "Agent Group",
        no_data: "No data",
        app_title: "Global Service Governance — KPI Dashboard",
        app_subtitle: "Global Playbook | KPI Module",
        back_to_playbook: "Back to Playbook",
        hub_title: "Global Service Governance — KPI Dashboard",
        hub_intro: "Central hub for the three official KPI views: Daily, Weekly and Monthly. Each page uses BI endpoints aligned with Power BI.",
        sync_title: "Supabase Sync Health",
        sync_loading: "Loading Edge Function status...",
        sync_updated_24h: "Updated 24h",
        sync_errors_24h: "Errors 24h",
        sync_sla_7d: "SLA 7d",
        sync_last_run: "Last run",
        sync_ok: "Edge Function and operational database have no recent alerts.",
        sync_attention: "There are sync alerts to review.",
        sync_unavailable: "Status is currently unavailable.",
        sync_load_error: "Unable to load Supabase status.",
        conn_missing: "Supabase not configured",
        conn_ok: "Supabase connected",
        conn_error: "Connection error:",
        conn_network: "Network failure",
        hub_overview_desc: "Interactive 3D globe with regional SLA status, consolidated KPIs and regional comparison.",
        hub_backlog_desc: "Daily control of the open queue with aging, first response, dependencies and tickets requiring same-day decisions.",
        hub_quality_desc: "Required-field completeness using the same filtered BI base as the report.",
        hub_weekly_desc: "Weekly report view with comparative indicators and operational follow-up.",
        hub_monthly_desc: "Direct executive monthly view: period key metrics and consolidated backlog by region.",
        audience_daily: "Front line + Coordinator",
        audience_weekly: "Coordinators + Manager",
        audience_monthly: "Manager + Director",
        btn_open: "Open",
        app_footer: "Global Playbook · Global Service · KPI Module",
        banner_validity: "Analytics valid from 06/01/2026 — prior data may contain classification inconsistencies",
        no_filter_data: "No data found for the selected filters",
        last_sync_label: "Last updated:"
    },
    es: {
        nav_overview: "Visión Global",
        nav_backlog: "Daily",
        nav_quality: "Calidad de Datos",
        nav_weekly: "Weekly",
        nav_monthly: "Monthly",
        filter_region: "Región",
        filter_priority: "Prioridad",
        filter_period: "Período (Closed Time)",
        filter_type: "Tipo",
        filter_agent: "Agente",
        filter_product: "Producto",
        filter_all: "Todos",
        kpi_sla: "Cumplimiento SLA",
        kpi_mtts: "MTTS (días)",
        kpi_mtfc: "MTFC (horas)",
        kpi_tickets: "Total Tickets",
        kpi_backlog: "Backlog Abierto",
        kpi_csat: "CSAT",
        sla_on_target: "En objetivo",
        sla_attention: "Atención",
        sla_critical: "Crítico",
        loading: "Cargando datos...",
        error_fetch: "Error al cargar datos. Verifique la conexión.",
        globe_hover: "Pase el cursor sobre una región",
        within_sla: "Dentro del SLA",
        outside_sla: "Fuera del SLA",
        not_eligible: "No elegible",
        with_first_response: "Con primera respuesta",
        without_first_response: "Sin primera respuesta",
        open_tickets: "Tickets Abiertos",
        closed_tickets: "Tickets Cerrados",
        backlog_aging: "Envejecimiento del Backlog",
        days: "días",
        hours: "horas",
        week: "Semana",
        month: "Mes",
        region_brazil: "Brasil",
        region_argentina: "Argentina",
        region_mexico: "México",
        region_latam: "LATAM",
        region_usa: "Estados Unidos",
        region_row: "ROW",
        btn_refresh: "Actualizar",
        btn_export_pdf: "Exportar PDF",
        filter_agent_group: "Grupo del Agente",
        no_data: "Sin datos",
        app_title: "Global Service Governance — KPI Dashboard",
        app_subtitle: "Playbook Global | Módulo KPI",
        back_to_playbook: "Volver al Playbook",
        hub_title: "Global Service Governance — KPI Dashboard",
        hub_intro: "Hub central para las tres vistas oficiales de KPI: Daily, Weekly y Monthly. Cada pagina usa endpoints BI alineados con Power BI.",
        sync_title: "Supabase Sync Health",
        sync_loading: "Cargando estado de la Edge Function...",
        sync_updated_24h: "Actualizados 24h",
        sync_errors_24h: "Errores 24h",
        sync_sla_7d: "SLA 7d",
        sync_last_run: "Última ejecución",
        sync_ok: "Edge Function y base operativa sin alertas recientes.",
        sync_attention: "Hay alertas de sincronización para revisar.",
        sync_unavailable: "Estado no disponible en este momento.",
        sync_load_error: "No fue posible cargar el estado de Supabase.",
        conn_missing: "Supabase no configurado",
        conn_ok: "Supabase conectado",
        conn_error: "Error de conexión:",
        conn_network: "Falla de red",
        hub_overview_desc: "Globo 3D interactivo con semáforo SLA por región, KPIs consolidados y comparación regional.",
        hub_backlog_desc: "Control diario de la fila abierta con aging, primera respuesta, dependencias y tickets que requieren decisión en el día.",
        hub_quality_desc: "Completitud de campos obligatorios usando la misma base BI filtrada del reporte.",
        hub_weekly_desc: "Vista semanal en formato de reporte, con indicadores comparativos y follow-up operacional.",
        hub_monthly_desc: "Vista mensual directa para direccion: key metrics del periodo y backlog consolidado por region.",
        audience_daily: "Linea de frente + Coordinador",
        audience_weekly: "Coordinadores + Gerente",
        audience_monthly: "Gerente + Director",
        btn_open: "Abrir",
        app_footer: "Playbook Global · Global Service · Módulo KPI",
        banner_validity: "Análisis válidos a partir del 01/06/2026 — los datos anteriores pueden contener inconsistencias de clasificación",
        no_filter_data: "No se encontraron datos para los filtros seleccionados",
        last_sync_label: "Última actualización:"
    }
};

let currentLang = localStorage.getItem('dashboard_lang') || 'pt';

function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || key;
}

function getLang() {
    return currentLang;
}

function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('dashboard_lang', lang);
    applyTranslations();
    document.dispatchEvent(new Event('langchange'));
    const bannerText = document.getElementById('banner-validity-text');
    if (bannerText) bannerText.textContent = t('banner_validity');
}

function initTheme() {
    const saved = localStorage.getItem('kpi-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kpi-theme', next);
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

function initValidityBanner() {
    if (localStorage.getItem('kpi-banner-closed') === '1') return;
    const banner = document.getElementById('banner-validity');
    if (!banner) return;
    banner.style.display = 'flex';
    const textEl = document.getElementById('banner-validity-text');
    if (textEl) textEl.textContent = t('banner_validity');
    banner.querySelector('.banner-validity-close')?.addEventListener('click', () => {
        banner.style.display = 'none';
        localStorage.setItem('kpi-banner-closed', '1');
    });
}

function applyTranslations(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(node => {
        const key = node.getAttribute('data-i18n');
        node.textContent = t(key);
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
        const key = node.getAttribute('data-i18n-placeholder');
        node.setAttribute('placeholder', t(key));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(node => {
        const key = node.getAttribute('data-i18n-title');
        node.setAttribute('title', t(key));
    });

    document.documentElement.setAttribute('lang', currentLang);
    document.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.lang === currentLang);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    applyTranslations();

    document.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
    document.getElementById('btn-theme-toggle')?.addEventListener('click', toggleTheme);
    initValidityBanner();
});
