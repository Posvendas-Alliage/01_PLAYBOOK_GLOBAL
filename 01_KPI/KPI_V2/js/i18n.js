const TRANSLATIONS = {
    pt: {
        // ── Navegação ─────────────────────────────────────────
        nav_daily: "Daily",
        nav_overview: "Visão Global",
        nav_backlog: "Daily",
        nav_quality: "Qualidade de Dados",
        nav_weekly: "Weekly",
        nav_monthly: "Monthly",
        // ── Header ────────────────────────────────────────────
        btn_refresh: "Atualizar",
        btn_export_pdf: "Exportar PDF",
        last_update: "Última atualização",
        back_to_playbook: "Voltar",
        // ── Filtros ───────────────────────────────────────────
        filter_region: "Região",
        filter_priority: "Prioridade",
        filter_period: "Período (Closed Time)",
        filter_type: "Tipo",
        filter_agent: "Agente",
        filter_product: "Produto",
        filter_to: "Até",
        filter_month_year: "Mês/Ano",
        filter_agent_group: "Grupo do Agente",
        filter_department: "Departamento",
        filter_status: "Status",
        filter_all: "Todos",
        btn_apply: "Aplicar",
        btn_clear: "Limpar",
        btn_retry: "Tentar novamente",
        // ── Países/Regiões ────────────────────────────────────
        country_all: "Todos",
        country_brazil: "Brasil",
        country_usa: "EUA",
        country_argentina: "Argentina",
        country_mexico: "México",
        country_latam: "LATAM",
        country_row: "ROW",
        // ── KPIs Daily ────────────────────────────────────────
        kpi_backlog: "Backlog Atual",
        kpi_backlog_current: "Backlog Atual",
        kpi_no_response: "Sem Primeira Resposta",
        kpi_critical_queue: "Fila Crítica",
        kpi_external_dep: "Dependência Externa",
        kpi_p1p2_open: "P1/P2 Abertos",
        kpi_avg_aging: "Aging Médio (dias)",
        sub_tickets_open: "tickets em aberto agora",
        sub_waiting_response: "aguardando primeiro contato",
        sub_over_10_days: "tickets acima de 10 dias",
        sub_external_wait: "aguardando resposta externa",
        sub_urgent_high: "tickets urgentes/alta prioridade",
        sub_avg_days: "dias em aberto em média",
        // ── KPIs Semanais/Mensais ─────────────────────────────
        kpi_sla: "SLA Compliance",
        kpi_closed_tickets: "Tickets Fechados",
        kpi_mtfc_label: "MTFC",
        kpi_mtts_label: "MTTS",
        kpi_mtts: "MTTS (dias)",
        kpi_mtfc: "MTFC (horas)",
        kpi_tickets: "Total Tickets",
        kpi_csat: "CSAT",
        delta_vs_prev_week: "vs semana anterior",
        delta_vs_prev_month: "vs mês anterior",
        // ── Colunas de tabela ─────────────────────────────────
        col_ticket: "Ticket #",
        col_region: "Região",
        col_region_name: "Região",
        col_priority: "Prioridade",
        col_status: "Status",
        col_agent: "Agente",
        col_mtfc: "MTFC",
        col_aging: "Aging (dias)",
        col_action: "Ação",
        col_closed: "Fechados",
        col_sla: "SLA",
        col_mtts: "MTTS",
        col_closed_date: "Data Fechamento",
        col_avg_mtfc: "MTFC médio",
        col_avg_mtts: "MTTS médio",
        col_sla_pct: "SLA %",
        col_region_status: "Status",
        // ── Ações da tabela ───────────────────────────────────
        action_first_response: "Dar primeira resposta",
        action_review_aging: "Revisar aging",
        action_check_dependency: "Verificar dependência",
        action_update_status: "Atualizar status",
        no_response_label: "Sem resposta",
        no_owner_label: "Sem dono",
        // ── Status dos tickets ────────────────────────────────
        status_open: "Aberto",
        status_in_progress: "Em atendimento",
        status_waiting_client: "Aguardando Cliente",
        status_waiting_part: "Aguardando Peça",
        status_waiting_third: "Aguardando Terceiro / Visita Técnica",
        status_resolved: "Resolvido",
        status_closed: "Fechado",
        // ── Prioridades ───────────────────────────────────────
        priority_urgent: "Urgente",
        priority_high: "Alta",
        priority_medium: "Média",
        priority_low: "Baixa",
        priority_very_low: "Muito Baixa",
        priority_none: "Sem prioridade",
        // ── Badges de status ──────────────────────────────────
        badge_on_target: "Meta atingida",
        badge_attention: "Atenção",
        badge_critical: "Crítico",
        // ── SLA ───────────────────────────────────────────────
        sla_on_target: "No alvo",
        sla_attention: "Atenção",
        sla_critical: "Crítico",
        sla_within: "Dentro do SLA",
        sla_outside: "Fora do SLA",
        sla_not_eligible: "Não elegível",
        within_sla: "Dentro do SLA",
        outside_sla: "Fora do SLA",
        not_eligible: "Não elegível",
        // ── Regiões ───────────────────────────────────────────
        region_brazil: "Brasil",
        region_argentina: "Argentina",
        region_mexico: "México",
        region_latam: "América Latina",
        region_usa: "Estados Unidos",
        region_row: "Resto do Mundo",
        // ── Alertas Daily ─────────────────────────────────────
        alert_no_response: "ticket(s) sem primeira resposta — ação imediata necessária",
        alert_p1_open: "ticket(s) URGENTE(S) em aberto",
        alert_aging_critical: "ticket(s) com mais de 15 dias sem resolução",
        alert_sla_risk: "ticket(s) P1/P2 com SLA em risco",
        alert_no_alerts: "Nenhum alerta crítico no momento",
        // ── Monthly ───────────────────────────────────────────
        monthly_title: "Resumo executivo do mês",
        monthly_audience: "Gerente + Diretor",
        sec_backlog_region: "Backlog por Região",
        sec_sla_region: "SLA Compliance por Região",
        sec_mtfc_region: "MTFC Médio por Região (horas)",
        sec_mtts_region: "MTTS Médio por Região (dias)",
        sec_closed_tickets: "Tickets Fechados",
        // ── Paginação ─────────────────────────────────────────
        search_ticket: "Buscar ticket #...",
        pagination_prev: "Anterior",
        pagination_next: "Próximo",
        pagination_page: "Página",
        pagination_of: "de",
        // ── Geral ─────────────────────────────────────────────
        no_data: "Nenhum dado encontrado para os filtros selecionados",
        no_filter_data: "Nenhum dado encontrado para os filtros selecionados",
        loading: "Carregando dados...",
        error_fetch: "Erro ao carregar dados. Verifique a conexão.",
        // ── Weekly ────────────────────────────────────────────
        weekly_title: "Relatório Semanal",
        weekly_audience: "Gerente + Coordenador",
        week_label: "Semana de",
        week_to: "a",
        // ── Daily ─────────────────────────────────────────────
        daily_title: "Controle Diário de Backlog",
        daily_audience: "Linha de frente + Coordenador",
        action_today: "AÇÃO HOJE",
        // ── Público ───────────────────────────────────────────
        audience_daily: "Linha de frente + Coordenador",
        audience_weekly: "Gerente + Coordenador",
        audience_monthly: "Gerente + Diretor",
        // ── Com/Sem primeira resposta ─────────────────────────
        with_first_response: "Com primeira resposta",
        without_first_response: "Sem primeira resposta",
        // ── Unidades ─────────────────────────────────────────
        tickets_label: "tickets",
        hours_label: "h",
        days_label: "d",
        days: "dias",
        hours: "horas",
        week: "Semana",
        month: "Mês",
        // ── Semanas/Meses ─────────────────────────────────────
        week_current: "Semana atual",
        week_previous: "Semana anterior",
        month_current: "Mês atual",
        // ── Banner e Tema ─────────────────────────────────────
        banner_validity: "Análises válidas a partir de 01/06/2026 — dados anteriores podem conter inconsistências de classificação",
        theme_dark: "Modo escuro",
        theme_light: "Modo claro",
        // ── PDF ──────────────────────────────────────────────
        print_generated: "Gerado em",
        print_filters: "Filtros ativos",
        print_footer: "Global Service Governance — Alliage",
        // ── App ──────────────────────────────────────────────
        app_title: "Global Service Governance — KPI Dashboard",
        app_subtitle: "Playbook Global | Módulo KPI",
        app_footer: "Playbook Global · Global Service · Módulo KPI",
        btn_open: "Abrir",
        last_sync_label: "Última atualização:",
        open_tickets: "Tickets Abertos",
        closed_tickets: "Tickets Fechados",
        backlog_aging: "Aging do Backlog",
        globe_hover: "Passe o mouse sobre uma região",
        // ── Hub ──────────────────────────────────────────────
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
    },
    en: {
        // ── Navegação ─────────────────────────────────────────
        nav_daily: "Daily",
        nav_overview: "Global Overview",
        nav_backlog: "Daily",
        nav_quality: "Data Quality",
        nav_weekly: "Weekly",
        nav_monthly: "Monthly",
        // ── Header ────────────────────────────────────────────
        btn_refresh: "Refresh",
        btn_export_pdf: "Export PDF",
        last_update: "Last update",
        back_to_playbook: "Back",
        // ── Filtros ───────────────────────────────────────────
        filter_region: "Region",
        filter_priority: "Priority",
        filter_period: "Period (Closed Time)",
        filter_type: "Type",
        filter_agent: "Agent",
        filter_product: "Product",
        filter_to: "To",
        filter_month_year: "Month/Year",
        filter_agent_group: "Agent Group",
        filter_department: "Department",
        filter_status: "Status",
        filter_all: "All",
        btn_apply: "Apply",
        btn_clear: "Clear",
        btn_retry: "Retry",
        // ── Países/Regiões ────────────────────────────────────
        country_all: "All",
        country_brazil: "Brazil",
        country_usa: "USA",
        country_argentina: "Argentina",
        country_mexico: "Mexico",
        country_latam: "LATAM",
        country_row: "ROW",
        // ── KPIs Daily ────────────────────────────────────────
        kpi_backlog: "Current Backlog",
        kpi_backlog_current: "Current Backlog",
        kpi_no_response: "No First Response",
        kpi_critical_queue: "Critical Queue",
        kpi_external_dep: "External Dependency",
        kpi_p1p2_open: "P1/P2 Open",
        kpi_avg_aging: "Avg Aging (days)",
        sub_tickets_open: "tickets open now",
        sub_waiting_response: "waiting first contact",
        sub_over_10_days: "tickets over 10 days",
        sub_external_wait: "waiting external response",
        sub_urgent_high: "urgent/high priority tickets",
        sub_avg_days: "avg days open",
        // ── KPIs Semanais/Mensais ─────────────────────────────
        kpi_sla: "SLA Compliance",
        kpi_closed_tickets: "Closed Tickets",
        kpi_mtfc_label: "MTFC",
        kpi_mtts_label: "MTTS",
        kpi_mtts: "MTTS (days)",
        kpi_mtfc: "MTFC (hours)",
        kpi_tickets: "Total Tickets",
        kpi_csat: "CSAT",
        delta_vs_prev_week: "vs previous week",
        delta_vs_prev_month: "vs previous month",
        // ── Colunas de tabela ─────────────────────────────────
        col_ticket: "Ticket #",
        col_region: "Region",
        col_region_name: "Region",
        col_priority: "Priority",
        col_status: "Status",
        col_agent: "Agent",
        col_mtfc: "MTFC",
        col_aging: "Aging (days)",
        col_action: "Action",
        col_closed: "Closed",
        col_sla: "SLA",
        col_mtts: "MTTS",
        col_closed_date: "Closing Date",
        col_avg_mtfc: "Avg MTFC",
        col_avg_mtts: "Avg MTTS",
        col_sla_pct: "SLA %",
        col_region_status: "Status",
        // ── Ações da tabela ───────────────────────────────────
        action_first_response: "Give first response",
        action_review_aging: "Review aging",
        action_check_dependency: "Check dependency",
        action_update_status: "Update status",
        no_response_label: "No response",
        no_owner_label: "No owner",
        // ── Status dos tickets ────────────────────────────────
        status_open: "Open",
        status_in_progress: "In progress",
        status_waiting_client: "Waiting Client",
        status_waiting_part: "Waiting Part",
        status_waiting_third: "Waiting Third Party / Technical Visit",
        status_resolved: "Resolved",
        status_closed: "Closed",
        // ── Prioridades ───────────────────────────────────────
        priority_urgent: "Urgent",
        priority_high: "High",
        priority_medium: "Medium",
        priority_low: "Low",
        priority_very_low: "Very Low",
        priority_none: "No priority",
        // ── Badges de status ──────────────────────────────────
        badge_on_target: "On Target",
        badge_attention: "Attention",
        badge_critical: "Critical",
        // ── SLA ───────────────────────────────────────────────
        sla_on_target: "On Target",
        sla_attention: "Attention",
        sla_critical: "Critical",
        sla_within: "Within SLA",
        sla_outside: "Outside SLA",
        sla_not_eligible: "Not eligible",
        within_sla: "Within SLA",
        outside_sla: "Outside SLA",
        not_eligible: "Not eligible",
        // ── Regiões ───────────────────────────────────────────
        region_brazil: "Brazil",
        region_argentina: "Argentina",
        region_mexico: "Mexico",
        region_latam: "Latin America",
        region_usa: "United States",
        region_row: "Rest of World",
        // ── Alertas Daily ─────────────────────────────────────
        alert_no_response: "ticket(s) without first response — immediate action needed",
        alert_p1_open: "URGENT ticket(s) open",
        alert_aging_critical: "ticket(s) with more than 15 days unresolved",
        alert_sla_risk: "P1/P2 ticket(s) with SLA at risk",
        alert_no_alerts: "No critical alerts at the moment",
        // ── Monthly ───────────────────────────────────────────
        monthly_title: "Executive monthly summary",
        monthly_audience: "Manager + Director",
        sec_backlog_region: "Backlog by Region",
        sec_sla_region: "SLA Compliance by Region",
        sec_mtfc_region: "Avg MTFC by Region (hours)",
        sec_mtts_region: "Avg MTTS by Region (days)",
        sec_closed_tickets: "Closed Tickets",
        // ── Paginação ─────────────────────────────────────────
        search_ticket: "Search ticket #...",
        pagination_prev: "Previous",
        pagination_next: "Next",
        pagination_page: "Page",
        pagination_of: "of",
        // ── Geral ─────────────────────────────────────────────
        no_data: "No data found for the selected filters",
        no_filter_data: "No data found for the selected filters",
        loading: "Loading data...",
        error_fetch: "Error loading data. Check your connection.",
        // ── Weekly ────────────────────────────────────────────
        weekly_title: "Weekly Report",
        weekly_audience: "Manager + Coordinator",
        week_label: "Week of",
        week_to: "to",
        // ── Daily ─────────────────────────────────────────────
        daily_title: "Daily Backlog Control",
        daily_audience: "Front line + Coordinator",
        action_today: "ACTION TODAY",
        // ── Público ───────────────────────────────────────────
        audience_daily: "Front line + Coordinator",
        audience_weekly: "Manager + Coordinator",
        audience_monthly: "Manager + Director",
        // ── Com/Sem primeira resposta ─────────────────────────
        with_first_response: "With first response",
        without_first_response: "Without first response",
        // ── Unidades ─────────────────────────────────────────
        tickets_label: "tickets",
        hours_label: "h",
        days_label: "d",
        days: "days",
        hours: "hours",
        week: "Week",
        month: "Month",
        // ── Semanas/Meses ─────────────────────────────────────
        week_current: "Current week",
        week_previous: "Previous week",
        month_current: "Current month",
        // ── Banner e Tema ─────────────────────────────────────
        banner_validity: "Analytics valid from 06/01/2026 — prior data may contain classification inconsistencies",
        theme_dark: "Dark mode",
        theme_light: "Light mode",
        // ── PDF ──────────────────────────────────────────────
        print_generated: "Generated on",
        print_filters: "Active filters",
        print_footer: "Global Service Governance — Alliage",
        // ── App ──────────────────────────────────────────────
        app_title: "Global Service Governance — KPI Dashboard",
        app_subtitle: "Global Playbook | KPI Module",
        app_footer: "Global Playbook · Global Service · KPI Module",
        btn_open: "Open",
        last_sync_label: "Last updated:",
        open_tickets: "Open Tickets",
        closed_tickets: "Closed Tickets",
        backlog_aging: "Backlog Aging",
        globe_hover: "Hover over a region",
        // ── Hub ──────────────────────────────────────────────
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
    },
    es: {
        // ── Navegação ─────────────────────────────────────────
        nav_daily: "Daily",
        nav_overview: "Visión Global",
        nav_backlog: "Daily",
        nav_quality: "Calidad de Datos",
        nav_weekly: "Weekly",
        nav_monthly: "Monthly",
        // ── Header ────────────────────────────────────────────
        btn_refresh: "Actualizar",
        btn_export_pdf: "Exportar PDF",
        last_update: "Última actualización",
        back_to_playbook: "Volver",
        // ── Filtros ───────────────────────────────────────────
        filter_region: "Región",
        filter_priority: "Prioridad",
        filter_period: "Período (Closed Time)",
        filter_type: "Tipo",
        filter_agent: "Agente",
        filter_product: "Producto",
        filter_to: "Hasta",
        filter_month_year: "Mes/Año",
        filter_agent_group: "Grupo del Agente",
        filter_department: "Departamento",
        filter_status: "Estado",
        filter_all: "Todos",
        btn_apply: "Aplicar",
        btn_clear: "Limpiar",
        btn_retry: "Reintentar",
        // ── Países/Regiões ────────────────────────────────────
        country_all: "Todos",
        country_brazil: "Brasil",
        country_usa: "EE.UU.",
        country_argentina: "Argentina",
        country_mexico: "México",
        country_latam: "LATAM",
        country_row: "ROW",
        // ── KPIs Daily ────────────────────────────────────────
        kpi_backlog: "Backlog Actual",
        kpi_backlog_current: "Backlog Actual",
        kpi_no_response: "Sin Primera Respuesta",
        kpi_critical_queue: "Cola Crítica",
        kpi_external_dep: "Dependencia Externa",
        kpi_p1p2_open: "P1/P2 Abiertos",
        kpi_avg_aging: "Envejecimiento Medio (días)",
        sub_tickets_open: "tickets abiertos ahora",
        sub_waiting_response: "esperando primer contacto",
        sub_over_10_days: "tickets con más de 10 días",
        sub_external_wait: "esperando respuesta externa",
        sub_urgent_high: "tickets urgentes/alta prioridad",
        sub_avg_days: "días abiertos en promedio",
        // ── KPIs Semanais/Mensais ─────────────────────────────
        kpi_sla: "Cumplimiento SLA",
        kpi_closed_tickets: "Tickets Cerrados",
        kpi_mtfc_label: "MTFC",
        kpi_mtts_label: "MTTS",
        kpi_mtts: "MTTS (días)",
        kpi_mtfc: "MTFC (horas)",
        kpi_tickets: "Total Tickets",
        kpi_csat: "CSAT",
        delta_vs_prev_week: "vs semana anterior",
        delta_vs_prev_month: "vs mes anterior",
        // ── Colunas de tabela ─────────────────────────────────
        col_ticket: "Ticket #",
        col_region: "Región",
        col_region_name: "Región",
        col_priority: "Prioridad",
        col_status: "Estado",
        col_agent: "Agente",
        col_mtfc: "MTFC",
        col_aging: "Antigüedad (días)",
        col_action: "Acción",
        col_closed: "Cerrados",
        col_sla: "SLA",
        col_mtts: "MTTS",
        col_closed_date: "Fecha de Cierre",
        col_avg_mtfc: "MTFC promedio",
        col_avg_mtts: "MTTS promedio",
        col_sla_pct: "SLA %",
        col_region_status: "Estado",
        // ── Ações da tabela ───────────────────────────────────
        action_first_response: "Dar primera respuesta",
        action_review_aging: "Revisar antigüedad",
        action_check_dependency: "Verificar dependencia",
        action_update_status: "Actualizar estado",
        no_response_label: "Sin respuesta",
        no_owner_label: "Sin responsable",
        // ── Status dos tickets ────────────────────────────────
        status_open: "Abierto",
        status_in_progress: "En atención",
        status_waiting_client: "Esperando Cliente",
        status_waiting_part: "Esperando Pieza",
        status_waiting_third: "Esperando Tercero / Visita Técnica",
        status_resolved: "Resuelto",
        status_closed: "Cerrado",
        // ── Prioridades ───────────────────────────────────────
        priority_urgent: "Urgente",
        priority_high: "Alta",
        priority_medium: "Media",
        priority_low: "Baja",
        priority_very_low: "Muy Baja",
        priority_none: "Sin prioridad",
        // ── Badges de status ──────────────────────────────────
        badge_on_target: "En objetivo",
        badge_attention: "Atención",
        badge_critical: "Crítico",
        // ── SLA ───────────────────────────────────────────────
        sla_on_target: "En objetivo",
        sla_attention: "Atención",
        sla_critical: "Crítico",
        sla_within: "Dentro del SLA",
        sla_outside: "Fuera del SLA",
        sla_not_eligible: "No elegible",
        within_sla: "Dentro del SLA",
        outside_sla: "Fuera del SLA",
        not_eligible: "No elegible",
        // ── Regiões ───────────────────────────────────────────
        region_brazil: "Brasil",
        region_argentina: "Argentina",
        region_mexico: "México",
        region_latam: "América Latina",
        region_usa: "Estados Unidos",
        region_row: "Resto del Mundo",
        // ── Alertas Daily ─────────────────────────────────────
        alert_no_response: "ticket(s) sin primera respuesta — acción inmediata necesaria",
        alert_p1_open: "ticket(s) URGENTE(S) abiertos",
        alert_aging_critical: "ticket(s) con más de 15 días sin resolver",
        alert_sla_risk: "ticket(s) P1/P2 con SLA en riesgo",
        alert_no_alerts: "Sin alertas críticas en este momento",
        // ── Monthly ───────────────────────────────────────────
        monthly_title: "Resumen ejecutivo del mes",
        monthly_audience: "Gerente + Director",
        sec_backlog_region: "Backlog por Región",
        sec_sla_region: "Cumplimiento SLA por Región",
        sec_mtfc_region: "MTFC Promedio por Región (horas)",
        sec_mtts_region: "MTTS Promedio por Región (días)",
        sec_closed_tickets: "Tickets Cerrados",
        // ── Paginação ─────────────────────────────────────────
        search_ticket: "Buscar ticket #...",
        pagination_prev: "Anterior",
        pagination_next: "Siguiente",
        pagination_page: "Página",
        pagination_of: "de",
        // ── Geral ─────────────────────────────────────────────
        no_data: "No se encontraron datos para los filtros seleccionados",
        no_filter_data: "No se encontraron datos para los filtros seleccionados",
        loading: "Cargando datos...",
        error_fetch: "Error al cargar datos. Verifique la conexión.",
        // ── Weekly ────────────────────────────────────────────
        weekly_title: "Informe Semanal",
        weekly_audience: "Gerente + Coordinador",
        week_label: "Semana del",
        week_to: "al",
        // ── Daily ─────────────────────────────────────────────
        daily_title: "Control Diario de Backlog",
        daily_audience: "Primera línea + Coordinador",
        action_today: "ACCIÓN HOY",
        // ── Público ───────────────────────────────────────────
        audience_daily: "Primera línea + Coordinador",
        audience_weekly: "Gerente + Coordinador",
        audience_monthly: "Gerente + Director",
        // ── Com/Sem primeira resposta ─────────────────────────
        with_first_response: "Con primera respuesta",
        without_first_response: "Sin primera respuesta",
        // ── Unidades ─────────────────────────────────────────
        tickets_label: "tickets",
        hours_label: "h",
        days_label: "d",
        days: "días",
        hours: "horas",
        week: "Semana",
        month: "Mes",
        // ── Semanas/Meses ─────────────────────────────────────
        week_current: "Semana actual",
        week_previous: "Semana anterior",
        month_current: "Mes actual",
        // ── Banner e Tema ─────────────────────────────────────
        banner_validity: "Análisis válidos a partir del 01/06/2026 — los datos anteriores pueden contener inconsistencias de clasificación",
        theme_dark: "Modo oscuro",
        theme_light: "Modo claro",
        // ── PDF ──────────────────────────────────────────────
        print_generated: "Generado el",
        print_filters: "Filtros activos",
        print_footer: "Global Service Governance — Alliage",
        // ── App ──────────────────────────────────────────────
        app_title: "Global Service Governance — KPI Dashboard",
        app_subtitle: "Playbook Global | Módulo KPI",
        app_footer: "Playbook Global · Global Service · Módulo KPI",
        btn_open: "Abrir",
        last_sync_label: "Última actualización:",
        open_tickets: "Tickets Abiertos",
        closed_tickets: "Tickets Cerrados",
        backlog_aging: "Envejecimiento del Backlog",
        globe_hover: "Pase el cursor sobre una región",
        // ── Hub ──────────────────────────────────────────────
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
