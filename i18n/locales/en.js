window.PLAYBOOK_I18N_LOCALES = window.PLAYBOOK_I18N_LOCALES || {};

(function () {
    const base = window.PLAYBOOK_I18N_LOCALES["pt-BR"] || {};
    const en = JSON.parse(JSON.stringify(base));

    en.common.buttons.backToPlaybook = "Back to Playbook";
    en.common.buttons.viewGlobalServiceEpic = "View Global Service epic";
    en.common.buttons.viewZohoDeskEpic = "View Zoho Desk epic";
    en.common.buttons.openPage = "Open page";
    en.common.buttons.open = "Open";
    en.common.buttons.view = "View";
    en.common.buttons.start = "Start";
    en.common.buttons.nextPage = "Next page";
    en.common.buttons.previousPage = "Previous page";
    en.common.buttons.backToModuleHome = "Back to module home";
    en.common.language.selectorLabel = "Language";
    en.common.language.selectorAriaLabel = "Select interface language";
    en.common.language.selectorTitle = "Change language";
    en.common.labels.epicGlobalService = "Global Service epic";
    en.common.labels.epicZohoDesk = "Zoho Desk epic";
    en.common.contexts.globalServiceModule = "This module belongs to the Global Service epic.";
    en.common.contexts.zohoDeskModule = "This module belongs to the Zoho Desk epic.";
    en.common.ux = en.common.ux || {};
    en.common.ux.pageNavigation = "Page navigation";
    en.common.ux.nextAction = en.common.ux.nextAction || {};
    en.common.ux.nextAction.title = "Next action";
    en.common.ux.nextAction.description = "Continue with the recommended next step.";
    en.common.ux.related = en.common.ux.related || {};
    en.common.ux.related.title = "Related pages";

    en.navigation.main.home = "Home";
    en.navigation.main.globalService = "Global Service";
    en.navigation.main.zohoDesk = "Zoho Desk";
    en.navigation.main.executiveBi = "Executive BI";

    en.home.title = "Playbook Global - Home";
    en.home.header.subtitle = "Global Service Governance Operations Portal";
    en.home.header.menuAria = "Open main menu";
    en.home.header.ctaBi = "Access BI";
    en.home.navigation.executiveBi = "Executive BI";
    en.home.hero.kicker = "Global Operations Hub";
    en.home.hero.mainTitle = "Standardize global service and make our customer the hero";
    en.home.hero.mainSubtitle = "Choose your workstream and follow clear paths to operate with global consistency.";
    en.home.hero.ctaBi = "Access BI";
    en.home.hero.ctaModules = "View axes and modules";
    en.home.hero.subtitle = "Architecture with two complementary pillars for global standardization";
    en.home.hero.description = "The Global Playbook is now organized into two epic modules: Global Service, which consolidates the operational and management service model, and Zoho Desk, which consolidates system configuration and operations standards.";
    en.home.hero.globalServiceCta = "Explore Global Service";
    en.home.hero.zohoDeskCta = "Explore Zoho Desk";
    en.home.sections.epicsTitle = "Two epics, one integrated governance model";
    en.home.sections.epicsDescription = "Global Service defines the global standard for customer service. Zoho Desk defines the standard for system configuration and operations. Future evolution happens on top of this architecture.";
    en.home.epics.globalService.kicker = "EPIC 1";
    en.home.epics.globalService.title = "GLOBAL SERVICE";
    en.home.epics.globalService.description = "Global standardization of customer service focused on the operating model, execution consistency, and management visibility.";
    en.home.epics.zohoDesk.kicker = "EPIC 2";
    en.home.epics.zohoDesk.title = "ZOHO DESK";
    en.home.epics.zohoDesk.description = "Standardized system configuration and operation, with an active training track and structured space for future modules.";
    en.home.quickAccess.title = "Start Here";
    en.home.quickAccess.subtitle = "New here? Start with the Zoho Tutorial. For management visibility, go straight to Executive BI.";
    en.home.quickAccess.items.bi.pill = "Priority";
    en.home.quickAccess.items.bi.title = "Executive BI";
    en.home.quickAccess.items.bi.desc = "Track indicators, performance, and operational risks.";
    en.home.quickAccess.items.tutorial.pill = "Onboarding";
    en.home.quickAccess.items.tutorial.title = "New Here? Zoho Tutorial";
    en.home.quickAccess.items.tutorial.desc = "Learn system usage and daily operations step by step.";
    en.home.quickAccess.items.globalService.pill = "Governance";
    en.home.quickAccess.items.globalService.title = "Global Service";
    en.home.quickAccess.items.globalService.desc = "Check global standards, operational rules, and governance.";
    en.home.quickAccess.items.zohoDesk.pill = "Platform";
    en.home.quickAccess.items.zohoDesk.title = "Zoho Desk";
    en.home.quickAccess.items.zohoDesk.desc = "Access guidance for system usage, setup, and practical operation.";
    en.home.axes.title = "Global Service and Zoho Desk: choose the right axis for your need";
    en.home.axes.subtitle = "Global Service defines service governance standards. Zoho Desk guides practical platform usage and operation.";
    en.home.axes.modulesTitle = "Axis modules";
    en.home.axes.globalService.badge = "Global Service";
    en.home.axes.globalService.title = "Global Service | Service Governance";
    en.home.axes.globalService.desc = "Global guidelines to standardize operations, controls, and management visibility.";
    en.home.axes.globalService.cta = "Enter Global Service";
    en.home.axes.globalService.items.priority = "Priority, criticality, and queues";
    en.home.axes.globalService.items.requiredFields = "Required fields and record quality";
    en.home.axes.globalService.items.channels = "Intake channels and governance rules";
    en.home.axes.globalService.items.kpis = "KPIs, performance, and operational reading";
    en.home.axes.zohoDesk.badge = "Zoho Desk";
    en.home.axes.zohoDesk.title = "Zoho Desk | Platform Operations";
    en.home.axes.zohoDesk.desc = "Practical guidance to use, configure, and operate Zoho Desk with consistency.";
    en.home.axes.zohoDesk.cta = "Enter Zoho Desk";
    en.home.axes.zohoDesk.items.tutorial = "Onboarding and guided tutorial";
    en.home.axes.zohoDesk.items.config = "Functional setup and layouts";
    en.home.axes.zohoDesk.items.rules = "Operational rules and automations";
    en.home.axes.zohoDesk.items.operation = "Daily execution in the tool";
    en.home.value.title = "What This Portal Delivers";
    en.home.value.items.standards.title = "Official global standard";
    en.home.value.items.standards.desc = "A single source for service policies, rules, and governance.";
    en.home.value.items.zoho.title = "Zoho Desk operations";
    en.home.value.items.zoho.desc = "Objective guidance to execute processes inside the platform.";
    en.home.value.items.bi.title = "BI and indicators";
    en.home.value.items.bi.desc = "Fast visibility for performance monitoring and decisions.";
    en.home.value.items.onboarding.title = "Onboarding and regional rollout";
    en.home.value.items.onboarding.desc = "Support base for new collaborators, key users, and new regions.";
    en.home.footer.support = "Official base for global governance, Zoho Desk operations, and regional rollout.";
    en.home.labels.available = "Available";
    en.home.labels.comingSoon = "Coming soon";
    en.home.labels.plannedModule = "Planned module";

    en.home.moduleCtas.fluxo = "Open global flow";
    en.home.moduleCtas.matriz = "Open priority matrix";
    en.home.moduleCtas.campos = "Open required fields";
    en.home.moduleCtas.kanban = "Open global kanban";
    en.home.moduleCtas.operacao_zoho = "Start Zoho tutorial";
    en.home.moduleCtas.governanca = "Open global governance";
    en.home.moduleCtas.kpi = "Open global KPIs";
    en.home.moduleCtas.canais_entrada = "Open intake channels";
    en.home.moduleCtas.fallback = "Access module";
    en.home.moduleCtas.fallbackDashboard = "Open dashboard";
    en.home.moduleCtas.fallbackMap = "Open map";
    en.home.moduleCtas.fallbackGeneric = "Open module";

    en.home.modules.kpi.title = "Global KPIs";
    en.home.modules.kpi.description = "Executive view of performance, SLA, backlog, aging, and operational quality.";
    en.home.modules.kanban.title = "Global Kanban";
    en.home.modules.kanban.description = "Operational flow layer with statuses, ownership, and movement discipline.";
    en.home.modules.campos.title = "Required Fields";
    en.home.modules.campos.description = "Global model of required, recommended, and automatic ticket fields.";
    en.home.modules.fluxo.title = "Global Flow";
    en.home.modules.fluxo.description = "Defines the global service flow, responsibilities, fields, SLAs, and operating rules. This module is the foundation of global service governance.";
    en.home.modules.matriz.title = "Priority Matrix";
    en.home.modules.matriz.description = "Global criticality rule to sequence queue, risk, and service urgency.";
    en.home.modules.governanca.title = "Global Governance";
    en.home.modules.governanca.description = "Rituals, responsibilities, auditing, and operational consistency control.";
    en.home.modules.operacao_zoho.title = "Daily Operations in Zoho Desk";
    en.home.modules.operacao_zoho.description = "Complementary operational tutorial for daily Zoho Desk usage with disciplined record keeping.";
    en.home.modules.canais_entrada.title = "Input Channels";
    en.home.modules.canais_entrada.description = "Minimum intake standard across phone, WhatsApp, form, and email.";
    en.home.modules.automacoes.title = "Automations";
    en.home.modules.automacoes.description = "Automation track to standardize operational execution with less manual variation.";
    en.home.modules.round_robin.title = "Round Robin and Distribution";
    en.home.modules.round_robin.description = "Future ticket distribution standard for workload balancing and ownership.";
    en.home.modules.regras_layout.title = "Layout Rules";
    en.home.modules.regras_layout.description = "System layout and field standards to ensure consistency across teams and regions.";
    en.home.modules.evolucao_zoho.title = "Zoho Desk Functional Evolution";
    en.home.modules.evolucao_zoho.description = "Reserved space for upcoming functional system configuration modules.";

    en.kpi.title = "Playbook Global - Global KPIs";
    en.kpi.index.header.title = "Global KPIs";
    en.kpi.index.header.subtitle = "Management view of performance, SLA, backlog, and operational quality";
    en.kpi.index.header.openArchitecture = "Open KPI architecture";
    en.kpi.v1.header.brand = "GLOBAL SERVICE GOVERNANCE";
    en.kpi.v1.header.architecture = "Architecture";
    en.kpi.v1.header.dashboard = "Dashboard";
    en.kpi.v1.header.expandedMap = "Expanded map";

    en.prioridade.title = "Playbook Global - Priority Matrix";
    en.prioridade.index.header.title = "Priority Matrix";
    en.prioridade.index.header.subtitle = "Global criticality classification for operational ordering and decision-making";
    en.prioridade.index.footer = "Playbook Global - Priority Matrix";
    en.prioridade.data.messages.fillAllFieldsPrefix = "Complete all fields to calculate priority. Missing: ";
    en.prioridade.data.messages.simulationSuccess = "Simulation calculated successfully.";
    en.prioridade.data.matrixConfig.campos.solicitante.label = "Requester";
    en.prioridade.data.matrixConfig.campos.solicitante.opcoes.assistencia_distribuidor.label = "Technical Assistance / Distributor";
    en.prioridade.data.matrixConfig.campos.solicitante.opcoes.cliente.label = "Customer";
    en.prioridade.data.matrixConfig.campos.solicitante.opcoes.cliente_locacao.label = "Rental customer";
    en.prioridade.data.matrixConfig.campos.tipo_atendimento.label = "Service type";
    en.prioridade.data.matrixConfig.campos.tipo_atendimento.opcoes.dentista_especialista_produto.label = "I want to speak with a product specialist dentist";
    en.prioridade.data.matrixConfig.campos.tipo_atendimento.opcoes.falar_com_sac.label = "Speak with Customer Care";
    en.prioridade.data.matrixConfig.campos.tipo_atendimento.opcoes.tecnico_especializado.label = "I want support from a specialized technician";
    en.prioridade.data.matrixConfig.campos.tipo_atendimento.opcoes.locacao_suporte_tecnico.label = "I am a rental customer and need technical support";
    en.prioridade.data.matrixConfig.campos.categoria.label = "Category";
    en.prioridade.data.matrixConfig.campos.categoria.opcoes.duvidas_gerais_sac.label = "General inquiries (Customer Care)";
    en.prioridade.data.matrixConfig.campos.categoria.opcoes.instalacao_linha_imagem.label = "Imaging product installation";
    en.prioridade.data.matrixConfig.campos.categoria.opcoes.duvidas_gerais_equipamento.label = "General equipment inquiries";
    en.prioridade.data.matrixConfig.campos.categoria.opcoes.assuntos_financeiros.label = "Financial matters";
    en.prioridade.data.matrixConfig.campos.categoria.opcoes.problemas_tecnicos_equipamento.label = "Technical issues with equipment";
    en.prioridade.data.matrixConfig.campos.produto.label = "Product";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.fotopolimerizador.label = "Curing light";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.peca_de_mao.label = "Handpiece";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.bomba_vacuo.label = "Vacuum pump";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.compressor.label = "Compressor";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.micro_motor_eletrico.label = "Electric micromotor";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.raio_x_periapical.label = "Periapical X-ray";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.autoclave.label = "Autoclave";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.profilaxia.label = "Prophylaxis";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.digitalizador_eagle_ps.label = "Eagle PS scanner";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.raio_x_portatil.label = "Portable X-ray";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.sensor_intraoral.label = "Intraoral sensor";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.consultorios.label = "Dental units";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.eagle_scan.label = "Eagle Scan";
    en.prioridade.data.matrixConfig.campos.produto.opcoes.tomografo_panoramico.label = "Tomograph / Panoramic";
    en.prioridade.data.matrixConfig.metadadosPrioridade.P1.descricao = "Urgent";
    en.prioridade.data.matrixConfig.metadadosPrioridade.P2.descricao = "High";
    en.prioridade.data.matrixConfig.metadadosPrioridade.P3.descricao = "Medium";
    en.prioridade.data.matrixConfig.metadadosPrioridade.P4.descricao = "Low";
    en.prioridade.data.matrixConfig.metadadosPrioridade.P5.descricao = "Very low";
    en.prioridade.data.matrixConfig.metadadosPrioridade.NC.descricao = "Unclassified";
    en.prioridade.main.opening.breadcrumb = "Home > Global Service > Priority Matrix";
    en.prioridade.main.opening.moduleLabel = "Module: Priority Matrix";
    en.prioridade.main.opening.operationalContext = "Operational context: official rule to order service, queue, and SLA reading by criticality.";
    en.prioridade.main.opening.title = "Priority Matrix";
    en.prioridade.main.opening.description = "Rule that transforms ticket context into operational priority, reducing subjective decisions and guiding the ideal service order.";
    en.prioridade.main.nav.label = "Module internal navigation";
    en.prioridade.main.nav.matrix = "Priority Matrix";
    en.prioridade.main.nav.simulation = "Priority Simulation";
    en.prioridade.main.rule.kicker = "Official Priority Map";
    en.prioridade.main.rule.title = "Ticket input -> criteria and weights -> Score -> P1-P5 -> MTFC -> queue usage";
    en.prioridade.main.rule.summary = "Priority summarizes operational criticality. It guides service order and must be applied as a rule, not as an agent's subjective choice.";
    en.prioridade.main.rule.flow.ticketInput = "Ticket input";
    en.prioridade.main.rule.flow.criteriaWeights = "Criteria and weights";
    en.prioridade.main.rule.flow.score = "Final score";
    en.prioridade.main.rule.flow.priorityClass = "P1-P5 classification";
    en.prioridade.main.rule.flow.mtfc = "MTFC / First response";
    en.prioridade.main.rule.flow.queueUsage = "Queue usage";
    en.prioridade.main.rule.whatIs.title = "What the Priority Matrix is";
    en.prioridade.main.rule.whatIs.text = "It is the rule that transforms ticket context into operational priority. Priority summarizes criticality and guides the ideal order of service.";
    en.prioridade.main.rule.forWho.title = "Who it is for";
    en.prioridade.main.rule.forWho.agent = "Agents: understand which ticket to handle first.";
    en.prioridade.main.rule.forWho.coordinator = "Coordinators: organize queue, backlog, and aging.";
    en.prioridade.main.rule.forWho.manager = "Managers: monitor operations by priority, SLA, and volume.";
    en.prioridade.main.rule.whereAppears.title = "Where it appears";
    en.prioridade.main.rule.whereAppears.ticket = "In the Zoho Desk ticket.";
    en.prioridade.main.rule.whereAppears.queue = "In the ticket queue/list.";
    en.prioridade.main.rule.whereAppears.boards = "In priority/board views.";
    en.prioridade.main.rule.whereAppears.dashboards = "In dashboards and operational analytics.";
    en.prioridade.main.criteria.title = "How it is calculated: official criteria and weights";
    en.prioridade.main.criteria.description = "Priority is calculated by Requester, Service type, Category, and Product. Each option has a Weight used to compose the final Score.";
    en.prioridade.main.criteria.formula = "Score = Requester x Service type x Category x Product";
    en.prioridade.main.criteria.columns.code = "Code";
    en.prioridade.main.criteria.columns.option = "Option";
    en.prioridade.main.criteria.columns.weight = "Weight";
    en.prioridade.main.criteria.solicitante.title = "Requester";
    en.prioridade.main.criteria.tipoAtendimento.title = "Service type";
    en.prioridade.main.criteria.categoria.title = "Category";
    en.prioridade.main.criteria.produto.title = "Product";
    en.prioridade.main.classification.title = "Official classification by Score, Priority and MTFC/SLA";
    en.prioridade.main.classification.description = "The official classification is determined from the calculated score, with P1-P5 priority and corresponding MTFC/SLA.";
    en.prioridade.main.classification.scoreCalculationNote = "Priority is calculated directly from score: Score = Requester x Service type x Category x Product.";
    en.prioridade.main.classification.scaleLegend = "Operational scale: from most urgent to least urgent.";
    en.prioridade.main.classification.highestUrgency = "Highest urgency";
    en.prioridade.main.classification.lowestUrgency = "Lowest urgency";
    en.prioridade.main.classification.columns.priority = "Priority";
    en.prioridade.main.classification.columns.scoreRange = "Score range";
    en.prioridade.main.classification.columns.mtfcSla = "MTFC/SLA";
    en.prioridade.main.classification.levels.p1.name = "Urgent";
    en.prioridade.main.classification.levels.p1.scoreRange = "50 to 90";
    en.prioridade.main.classification.levels.p1.mtfc = "1h";
    en.prioridade.main.classification.levels.p1.interpretation = "Immediate handling and top queue priority.";
    en.prioridade.main.classification.levels.p2.name = "High";
    en.prioridade.main.classification.levels.p2.scoreRange = "31 to 49";
    en.prioridade.main.classification.levels.p2.mtfc = "2h";
    en.prioridade.main.classification.levels.p2.interpretation = "High criticality with a short first-response window.";
    en.prioridade.main.classification.levels.p3.name = "Medium";
    en.prioridade.main.classification.levels.p3.scoreRange = "21 to 30";
    en.prioridade.main.classification.levels.p3.mtfc = "3h";
    en.prioridade.main.classification.levels.p3.interpretation = "Standard flow with continuous SLA monitoring.";
    en.prioridade.main.classification.levels.p4.name = "Low";
    en.prioridade.main.classification.levels.p4.scoreRange = "11 to 20";
    en.prioridade.main.classification.levels.p4.mtfc = "5h";
    en.prioridade.main.classification.levels.p4.interpretation = "Routine prioritization focused on queue stability.";
    en.prioridade.main.classification.levels.p5.name = "Very low";
    en.prioridade.main.classification.levels.p5.scoreRange = "1 to 10";
    en.prioridade.main.classification.levels.p5.mtfc = "6h";
    en.prioridade.main.classification.levels.p5.interpretation = "Low criticality, keeping volume and aging under control.";
    en.prioridade.main.classification.firstResponseNote = "In this reading, SLA is focused on MTFC/SLA for first response.";
    en.prioridade.main.classification.resolutionNote = "The Resolution rule can be handled separately from first response differentiation.";
    en.prioridade.main.classification.exceptionTitle = "Official exception";
    en.prioridade.main.classification.exceptionText = "Out of the box / Zero hour must become Urgent priority.";
    en.prioridade.main.operation.title = "How to use in operations";
    en.prioridade.main.operation.agent = "Agent uses priority to sort service order in the queue.";
    en.prioridade.main.operation.coordinator = "Coordinator uses priority to monitor queue, backlog, and aging.";
    en.prioridade.main.operation.manager = "Manager uses priority to read SLA and volume.";
    en.prioridade.main.operation.antiSubjective = "Priority helps avoid subjective decisions in routine.";
    en.prioridade.main.exception.title = "Exceptions and precautions";
    en.prioridade.main.exception.zeroHour = "Out of the box / Zero hour = Urgent.";
    en.prioridade.main.exception.reviewInvalidData = "Priority must be reviewed if required data is incorrect.";
    en.prioridade.main.exception.wrongFields = "Wrong fields can generate wrong priority.";
    en.prioridade.main.exception.humanFollowUp = "Priority does not replace human follow-up.";
    en.prioridade.simulation.opening.pageTitle = "Playbook Global - Priority Simulation";
    en.prioridade.simulation.opening.headerSubtitle = "Quick training for operational ticket prioritization";
    en.prioridade.simulation.opening.breadcrumb = "Home > Global Service > Priority Matrix > Priority Simulation";
    en.prioridade.simulation.opening.moduleLabel = "Module: Priority Matrix";
    en.prioridade.simulation.opening.operationalContext = "Operational context: training to turn ticket data into P1-P5 priority and guide queue order with less subjectivity.";
    en.prioridade.simulation.opening.title = "Priority Simulation";
    en.prioridade.simulation.opening.description = "Short submodule to practice the official priority calculation with real score, expected MTFC, and operational result reading.";
    en.prioridade.simulation.form.kicker = "Simulation Panel";
    en.prioridade.simulation.form.title = "Fill in the official criteria";
    en.prioridade.simulation.form.description = "Score is calculated by multiplying Requester, Service type, Category, and Product weights.";
    en.prioridade.simulation.form.formula = "Score = Requester x Service type x Category x Product";
    en.prioridade.simulation.form.fields.solicitante = "Requester";
    en.prioridade.simulation.form.fields.tipoAtendimento = "Service type";
    en.prioridade.simulation.form.fields.categoria = "Category";
    en.prioridade.simulation.form.fields.produto = "Product";
    en.prioridade.simulation.form.fields.outOfBoxZeroHour = "Out of the box / Zero hour";
    en.prioridade.simulation.form.selectPlaceholder = "Select...";
    en.prioridade.simulation.form.submitButton = "Calculate priority";
    en.prioridade.simulation.result.title = "Result";
    en.prioridade.simulation.result.pendingState = "Fill in the fields and calculate to view the final priority.";
    en.prioridade.simulation.result.readyState = "Result calculated using the official priority rule.";
    en.prioridade.simulation.result.finalPriority = "Final priority";
    en.prioridade.simulation.result.scoreCalculated = "Calculated score";
    en.prioridade.simulation.result.mtfc = "MTFC/SLA";
    en.prioridade.simulation.result.scoreFormula = "Score composition";
    en.prioridade.simulation.result.operationalInterpretation = "Operational interpretation";
    en.prioridade.simulation.result.pendingInterpretation = "After calculation, you will see the operational interpretation for this priority level.";
    en.prioridade.simulation.result.exceptionForced = "Exception applied: Out of the box / Zero hour always forces P1 (Urgent) with MTFC 1h.";
    en.prioridade.simulation.result.levels.p1.name = "Urgent";
    en.prioridade.simulation.result.levels.p1.mtfc = "1h";
    en.prioridade.simulation.result.levels.p1.interpretation = "Immediate handling with maximum queue priority.";
    en.prioridade.simulation.result.levels.p2.name = "High";
    en.prioridade.simulation.result.levels.p2.mtfc = "2h";
    en.prioridade.simulation.result.levels.p2.interpretation = "Critical case with a short first-response window.";
    en.prioridade.simulation.result.levels.p3.name = "Medium";
    en.prioridade.simulation.result.levels.p3.mtfc = "3h";
    en.prioridade.simulation.result.levels.p3.interpretation = "Handled in standard flow with continuous monitoring.";
    en.prioridade.simulation.result.levels.p4.name = "Low";
    en.prioridade.simulation.result.levels.p4.mtfc = "5h";
    en.prioridade.simulation.result.levels.p4.interpretation = "Routine queue handling with lower immediate pressure.";
    en.prioridade.simulation.result.levels.p5.name = "Very low";
    en.prioridade.simulation.result.levels.p5.mtfc = "6h";
    en.prioridade.simulation.result.levels.p5.interpretation = "Low urgency while keeping volume and aging under control.";
    en.prioridade.simulation.result.levels.nc.name = "Unclassified";
    en.prioridade.simulation.result.levels.nc.mtfc = "-";
    en.prioridade.simulation.result.levels.nc.interpretation = "Result without priority classification.";
    en.prioridade.simulation.interpretation.title = "How to interpret the simulation";
    en.prioridade.simulation.interpretation.point1 = "The simulation is a training aid to standardize priority reading.";
    en.prioridade.simulation.interpretation.point2 = "The result depends on the quality of the fields filled in the ticket.";
    en.prioridade.simulation.interpretation.point3 = "Priority guides the queue, but does not replace coordinator follow-up.";
    en.prioridade.simulation.interpretation.point4 = "Zero hour / Out of the box always forces urgency (P1 and MTFC 1h).";
    en.prioridade.simulation.options.yes = "Yes";
    en.prioridade.simulation.options.no = "No";

    en.camposObrigatorios.title = "Playbook Global - Required Fields";
    en.camposObrigatorios.index.header.title = "Required Fields";
    en.camposObrigatorios.index.header.subtitle = "Executive field architecture for the global model";
    en.camposObrigatorios.index.footer = "Playbook Global - Required Fields";
    en.camposObrigatorios.data.labels.requiredGlobal = "Globally required";
    en.camposObrigatorios.data.labels.alternativeRule = "Operational rule";
    en.camposObrigatorios.data.labels.contactChannelRule = "Email and Phone/Mobile";
    en.camposObrigatorios.home = en.camposObrigatorios.home || {};
    en.camposObrigatorios.home.opening = en.camposObrigatorios.home.opening || {};
    en.camposObrigatorios.home.opening.pageTitle = "Playbook Global - Mandatory Fields";
    en.camposObrigatorios.home.opening.breadcrumb = "Home > Global Service > Mandatory Fields";
    en.camposObrigatorios.home.opening.moduleLabel = "Module: Mandatory Fields";
    en.camposObrigatorios.home.opening.title = "Mandatory Fields";
    en.camposObrigatorios.home.opening.description = "Mandatory fields define the minimum information required to open, follow up, and analyze tickets with quality. They reduce rework, prevent information loss, and sustain flow, priority, SLA, and KPIs.";
    en.camposObrigatorios.home.opening.operationalContext = "Operational context: minimum standard for ticket opening, follow-up, and quality.";
    en.camposObrigatorios.home.nav = en.camposObrigatorios.home.nav || {};
    en.camposObrigatorios.home.nav.label = "Module internal navigation";
    en.camposObrigatorios.home.nav.fields = "Mandatory Fields";
    en.camposObrigatorios.home.nav.matrix = "Consolidated Matrix";
    en.camposObrigatorios.home.dominant = en.camposObrigatorios.home.dominant || {};
    en.camposObrigatorios.home.dominant.eyebrow = "Ticket Fields Map";
    en.camposObrigatorios.home.dominant.title = "Ticket Fields Map";
    en.camposObrigatorios.home.dominant.description = "Visual summary of the official groups and how each one impacts operations.";
    en.camposObrigatorios.home.dominant.whoLabel = "Who fills it";
    en.camposObrigatorios.home.dominant.whenLabel = "When it enters the flow";
    en.camposObrigatorios.home.dominant.whyLabel = "Why it matters";
    en.camposObrigatorios.home.dominant.ctaMatrix = "Open Consolidated Matrix";
    en.camposObrigatorios.home.classifications = en.camposObrigatorios.home.classifications || {};
    en.camposObrigatorios.home.classifications.mandatory = en.camposObrigatorios.home.classifications.mandatory || {};
    en.camposObrigatorios.home.classifications.mandatory.label = "Mandatory";
    en.camposObrigatorios.home.classifications.mandatory.description = "It must be filled according to the rule.";
    en.camposObrigatorios.home.classifications.recommended = en.camposObrigatorios.home.classifications.recommended || {};
    en.camposObrigatorios.home.classifications.recommended.label = "Recommended";
    en.camposObrigatorios.home.classifications.recommended.description = "Improves traceability and analysis without blocking operations.";
    en.camposObrigatorios.home.classifications.automatic = en.camposObrigatorios.home.classifications.automatic || {};
    en.camposObrigatorios.home.classifications.automatic.label = "Automatic";
    en.camposObrigatorios.home.classifications.automatic.description = "Filled by the system.";
    en.camposObrigatorios.home.classifications.conditional = en.camposObrigatorios.home.classifications.conditional || {};
    en.camposObrigatorios.home.classifications.conditional.label = "Conditional";
    en.camposObrigatorios.home.classifications.conditional.description = "Mandatory only when the condition applies.";
    en.camposObrigatorios.home.required = en.camposObrigatorios.home.required || {};
    en.camposObrigatorios.home.required.title = "Main mandatory fields";
    en.camposObrigatorios.home.required.ticketLabel = "Ticket - opening";
    en.camposObrigatorios.home.required.ticket = en.camposObrigatorios.home.required.ticket || {};
    en.camposObrigatorios.home.required.ticket.requesterName = "Requester/customer name";
    en.camposObrigatorios.home.required.ticket.email = "Email";
    en.camposObrigatorios.home.required.ticket.phone = "Phone";
    en.camposObrigatorios.home.required.ticket.requester = "Requester";
    en.camposObrigatorios.home.required.ticket.serviceType = "Service type";
    en.camposObrigatorios.home.required.ticket.category = "Category";
    en.camposObrigatorios.home.required.ticket.product = "Product";
    en.camposObrigatorios.home.required.ticket.productBrand = "Product brand";
    en.camposObrigatorios.home.required.ticket.serialNumber = "Equipment serial number, with contextual exception";
    en.camposObrigatorios.home.required.ticket.subject = "Subject";
    en.camposObrigatorios.home.required.ticket.description = "Description";
    en.camposObrigatorios.home.required.contactLabel = "Contact/Customer";
    en.camposObrigatorios.home.required.contact = en.camposObrigatorios.home.required.contact || {};
    en.camposObrigatorios.home.required.contact.firstName = "First name";
    en.camposObrigatorios.home.required.contact.lastName = "Last name";
    en.camposObrigatorios.home.required.contact.accountName = "Account name";
    en.camposObrigatorios.home.required.contact.email = "Email";
    en.camposObrigatorios.home.required.contact.phoneMobile = "Phone/Mobile";
    en.camposObrigatorios.home.required.meta = en.camposObrigatorios.home.required.meta || {};
    en.camposObrigatorios.home.required.meta.who = "Customer and agent, depending on the stage.";
    en.camposObrigatorios.home.required.meta.when = "Mostly at opening and initial qualification.";
    en.camposObrigatorios.home.required.meta.why = "Without this data, triage quality drops and rework increases.";
    en.camposObrigatorios.home.required.conditionalLabel = "Conditional";
    en.camposObrigatorios.home.required.conditional = en.camposObrigatorios.home.required.conditional || {};
    en.camposObrigatorios.home.required.conditional.stateBrazil = "State: mandatory only for Brazil";
    en.camposObrigatorios.home.required.conditional.provinceArgentina = "Province: mandatory only for Argentina";
    en.camposObrigatorios.home.required.conditional.assistanceDistributor = "Service partner/distributor name: mandatory for Assistance / Distributor";
    en.camposObrigatorios.home.required.conditionalMeta = en.camposObrigatorios.home.required.conditionalMeta || {};
    en.camposObrigatorios.home.required.conditionalMeta.who = "Agent during data validation.";
    en.camposObrigatorios.home.required.conditionalMeta.when = "At opening and registration reviews.";
    en.camposObrigatorios.home.required.conditionalMeta.why = "Avoids regional errors and responsibility inconsistencies.";
    en.camposObrigatorios.home.required.automaticLabel = "Automatic/system fields";
    en.camposObrigatorios.home.required.automatic = en.camposObrigatorios.home.required.automatic || {};
    en.camposObrigatorios.home.required.automatic.ticketId = "Ticket ID";
    en.camposObrigatorios.home.required.automatic.openingDate = "Opening date";
    en.camposObrigatorios.home.required.automatic.channel = "Channel";
    en.camposObrigatorios.home.required.automatic.owner = "Ticket owner";
    en.camposObrigatorios.home.required.automatic.status = "Status";
    en.camposObrigatorios.home.required.automatic.priority = "Priority, calculated by the matrix";
    en.camposObrigatorios.home.required.automatic.slaFirstResponse = "First response SLA";
    en.camposObrigatorios.home.required.automatic.slaResolution = "Resolution SLA";
    en.camposObrigatorios.home.required.automatic.slaIndicators = "SLA times and indicators";
    en.camposObrigatorios.home.required.automaticMeta = en.camposObrigatorios.home.required.automaticMeta || {};
    en.camposObrigatorios.home.required.automaticMeta.who = "System.";
    en.camposObrigatorios.home.required.automaticMeta.when = "Across the full ticket journey.";
    en.camposObrigatorios.home.required.automaticMeta.why = "Supports SLA, performance, and audit reading.";
    en.camposObrigatorios.home.recommended = en.camposObrigatorios.home.recommended || {};
    en.camposObrigatorios.home.recommended.title = "Official recommended fields";
    en.camposObrigatorios.home.recommended.country = "Country";
    en.camposObrigatorios.home.recommended.zeroHour = "Zero hour / Out of the box";
    en.camposObrigatorios.home.recommended.needsPart = "Needs part";
    en.camposObrigatorios.home.recommended.partnerDistributor = "Partner/distributor, when not mandatory";
    en.camposObrigatorios.home.recommended.racSent = "RAC Sent? - Yes/No";
    en.camposObrigatorios.home.recommended.assistanceType = "Technical assistance type";
    en.camposObrigatorios.home.recommended.closingReason = "Closing reason";
    en.camposObrigatorios.home.recommended.solutionMode = "On-site/remote solution";
    en.camposObrigatorios.home.recommended.usedPart = "Used part";
    en.camposObrigatorios.home.recommended.finalPartsQty = "Final parts quantity";
    en.camposObrigatorios.home.recommended.meta = en.camposObrigatorios.home.recommended.meta || {};
    en.camposObrigatorios.home.recommended.meta.who = "Agent and coordination to improve analytical quality.";
    en.camposObrigatorios.home.recommended.meta.when = "Mostly during service and closing.";
    en.camposObrigatorios.home.recommended.meta.why = "Improves traceability, priority reading, and KPI consistency.";
    en.camposObrigatorios.home.excluded = en.camposObrigatorios.home.excluded || {};
    en.camposObrigatorios.home.excluded.note = "Not part of the official recommended list in this phase:";
    en.camposObrigatorios.home.excluded.actionsExecuted = "Actions executed";
    en.camposObrigatorios.home.excluded.partsQuantity = "Parts quantity";
    en.camposObrigatorios.home.excluded.requestedPart = "Requested part";
    en.camposObrigatorios.home.excluded.partCode = "Part code";
    en.camposObrigatorios.home.excluded.partDatesStatus = "Part dates/status";
    en.camposObrigatorios.home.excluded.orderNumber = "Order number";
    en.camposObrigatorios.home.excluded.probableCause = "Probable cause";
    en.camposObrigatorios.home.excluded.returnDate = "Expected customer return date";
    en.camposObrigatorios.home.impact = en.camposObrigatorios.home.impact || {};
    en.camposObrigatorios.home.impact.title = "Operational impact";
    en.camposObrigatorios.home.impact.dataQuality = "Data quality";
    en.camposObrigatorios.home.impact.flow = "Flow";
    en.camposObrigatorios.home.impact.priority = "Priority";
    en.camposObrigatorios.home.impact.sla = "SLA";
    en.camposObrigatorios.home.impact.kpi = "KPI";
    en.camposObrigatorios.home.impact.audit = "Audit";
    en.camposObrigatorios.home.impact.backlogAging = "Backlog and aging";
    en.camposObrigatorios.home.rules = en.camposObrigatorios.home.rules || {};
    en.camposObrigatorios.home.rules.title = "Critical rules";
    en.camposObrigatorios.home.rules.serialException = "Serial number is mandatory, with contextual exception.";
    en.camposObrigatorios.home.rules.stateBrazil = "State only for Brazil.";
    en.camposObrigatorios.home.rules.provinceArgentina = "Province only for Argentina.";
    en.camposObrigatorios.home.rules.assistanceDistributor = "Service partner/distributor name only when applicable.";
    en.camposObrigatorios.home.rules.priorityCalculated = "Priority is mandatory and calculated by the matrix.";
    en.camposObrigatorios.home.rules.zeroHourImpact = "Zero hour / Out of the box is recommended, but impacts priority.";
    en.camposObrigatorios.home.usage = en.camposObrigatorios.home.usage || {};
    en.camposObrigatorios.home.usage.title = "How to use this module";
    en.camposObrigatorios.home.usage.homeRule = "Use the home page to understand the rule.";
    en.camposObrigatorios.home.usage.matrixDetails = "Use the Consolidated Matrix for full details.";
    en.camposObrigatorios.home.usage.coordinators = "Coordinators should use the matrix to enforce completeness.";
    en.camposObrigatorios.home.usage.agents = "Agents should use it as a reference for correct field completion.";
    en.camposObrigatorios.matrix = en.camposObrigatorios.matrix || {};
    en.camposObrigatorios.matrix.opening = en.camposObrigatorios.matrix.opening || {};
    en.camposObrigatorios.matrix.opening.pageTitle = "Playbook Global - Mandatory Fields: Consolidated Field Matrix";
    en.camposObrigatorios.matrix.opening.headerTitle = "Mandatory Fields";
    en.camposObrigatorios.matrix.opening.headerSubtitle = "Official reference for field structure, rules, and operational interpretation.";
    en.camposObrigatorios.matrix.opening.breadcrumb = "Home > Global Service > Mandatory Fields > Consolidated Matrix";
    en.camposObrigatorios.matrix.opening.moduleLabel = "Module: Mandatory Fields";
    en.camposObrigatorios.matrix.opening.title = "Consolidated Field Matrix";
    en.camposObrigatorios.matrix.opening.description = "This page consolidates the official source of Ticket and Contact/Customer fields with updated rules for operations, priority, SLA, and governance.";
    en.camposObrigatorios.matrix.opening.operationalContext = "Operational context: single reference for field completion, auditability, and service data quality reading.";

    en.camposObrigatorios.matrix.nav = en.camposObrigatorios.matrix.nav || {};
    en.camposObrigatorios.matrix.nav.label = "Module internal navigation";
    en.camposObrigatorios.matrix.nav.home = "Mandatory Fields";
    en.camposObrigatorios.matrix.nav.matrix = "Consolidated Matrix";
    en.camposObrigatorios.matrix.nav.operation = "Operation by Stage";
    en.camposObrigatorios.matrix.nav.governance = "Field Governance";

    en.camposObrigatorios.matrix.dominant = en.camposObrigatorios.matrix.dominant || {};
    en.camposObrigatorios.matrix.dominant.title = "Official Consolidated Matrix";
    en.camposObrigatorios.matrix.dominant.description = "Filter by entity, classification, stage, or owner to quickly consult each field rule.";

    en.camposObrigatorios.matrix.columns = en.camposObrigatorios.matrix.columns || {};
    en.camposObrigatorios.matrix.columns.entity = "Entity";
    en.camposObrigatorios.matrix.columns.field = "Field";
    en.camposObrigatorios.matrix.columns.classification = "Classification";
    en.camposObrigatorios.matrix.columns.condition = "Condition";
    en.camposObrigatorios.matrix.columns.stage = "Stage";
    en.camposObrigatorios.matrix.columns.owner = "Owner";
    en.camposObrigatorios.matrix.columns.impact = "Impact";
    en.camposObrigatorios.matrix.columns.rule = "Rule";

    en.camposObrigatorios.matrix.filters = en.camposObrigatorios.matrix.filters || {};
    en.camposObrigatorios.matrix.filters.entity = "Entity";
    en.camposObrigatorios.matrix.filters.classification = "Classification";
    en.camposObrigatorios.matrix.filters.stage = "Stage";
    en.camposObrigatorios.matrix.filters.owner = "Owner";
    en.camposObrigatorios.matrix.filters.all = "All";
    en.camposObrigatorios.matrix.filters.resultSingular = "field found";
    en.camposObrigatorios.matrix.filters.resultPlural = "fields found";
    en.camposObrigatorios.matrix.filters.noResults = "No fields found for the selected filters.";

    en.camposObrigatorios.matrix.entities = en.camposObrigatorios.matrix.entities || {};
    en.camposObrigatorios.matrix.entities.ticket = "Ticket";
    en.camposObrigatorios.matrix.entities.contact_customer = "Contact/Customer";

    en.camposObrigatorios.matrix.classifications = en.camposObrigatorios.matrix.classifications || {};
    en.camposObrigatorios.matrix.classifications.mandatory = "Mandatory";
    en.camposObrigatorios.matrix.classifications.recommended = "Recommended";
    en.camposObrigatorios.matrix.classifications.automatic = "Automatic";
    en.camposObrigatorios.matrix.classifications.conditional = "Conditional";

    en.camposObrigatorios.matrix.stages = en.camposObrigatorios.matrix.stages || {};
    en.camposObrigatorios.matrix.stages.opening = "Opening";
    en.camposObrigatorios.matrix.stages.in_progress = "In Progress";
    en.camposObrigatorios.matrix.stages.waiting_customer = "Waiting for Customer";
    en.camposObrigatorios.matrix.stages.waiting_parts = "Waiting for Parts";
    en.camposObrigatorios.matrix.stages.waiting_third_party = "Waiting for Third Party / Technical Visit";
    en.camposObrigatorios.matrix.stages.resolution_closing = "Resolution / Closing";
    en.camposObrigatorios.matrix.stages.system = "System";

    en.camposObrigatorios.matrix.owners = en.camposObrigatorios.matrix.owners || {};
    en.camposObrigatorios.matrix.owners.customer = "Customer";
    en.camposObrigatorios.matrix.owners.agent = "Agent";
    en.camposObrigatorios.matrix.owners.system = "System";
    en.camposObrigatorios.matrix.owners.coordinator = "Coordinator";

    en.camposObrigatorios.matrix.impacts = en.camposObrigatorios.matrix.impacts || {};
    en.camposObrigatorios.matrix.impacts.data_quality = "Data quality";
    en.camposObrigatorios.matrix.impacts.flow = "Flow";
    en.camposObrigatorios.matrix.impacts.priority = "Priority";
    en.camposObrigatorios.matrix.impacts.sla = "SLA";
    en.camposObrigatorios.matrix.impacts.kpi = "KPI";
    en.camposObrigatorios.matrix.impacts.audit = "Audit";

    en.camposObrigatorios.matrix.inputTypes = en.camposObrigatorios.matrix.inputTypes || {};
    en.camposObrigatorios.matrix.inputTypes.text = "Text";
    en.camposObrigatorios.matrix.inputTypes.list = "List";
    en.camposObrigatorios.matrix.inputTypes.yes_no = "Yes/No";
    en.camposObrigatorios.matrix.inputTypes.date = "Date";
    en.camposObrigatorios.matrix.inputTypes.automatic = "Automatic";

    en.camposObrigatorios.matrix.conditions = en.camposObrigatorios.matrix.conditions || {};
    en.camposObrigatorios.matrix.conditions.serial_exception = "Contextual exception: when unavailable at opening, register justification and complete later.";
    en.camposObrigatorios.matrix.conditions.requester_assistance_distributor = "Mandatory when Requester = Assistance / Distributor.";
    en.camposObrigatorios.matrix.conditions.country_brazil = "Mandatory only for Brazil.";
    en.camposObrigatorios.matrix.conditions.country_argentina = "Mandatory only for Argentina.";
    en.camposObrigatorios.matrix.conditions.partner_not_captured = "Fill when it was not captured in the conditional mandatory field.";
    en.camposObrigatorios.matrix.conditions.priority_calculated_matrix = "Calculated by the official matrix, not by subjective agent choice.";

    en.camposObrigatorios.matrix.rules = en.camposObrigatorios.matrix.rules || {};
    en.camposObrigatorios.matrix.rules.mandatory_opening = "Mandatory at opening by official rule.";
    en.camposObrigatorios.matrix.rules.mandatory_serial_exception = "Mandatory with a justified contextual exception.";
    en.camposObrigatorios.matrix.rules.conditional_brazil_state = "Fill when Country = Brazil.";
    en.camposObrigatorios.matrix.rules.conditional_argentina_province = "Fill when Country = Argentina.";
    en.camposObrigatorios.matrix.rules.conditional_assistance_distributor = "Mandatory in Assistance / Distributor context.";
    en.camposObrigatorios.matrix.rules.country_not_mandatory = "Not mandatory in this phase.";
    en.camposObrigatorios.matrix.rules.automatic_system = "Automatically filled by the system.";
    en.camposObrigatorios.matrix.rules.mandatory_priority_matrix = "Mandatory and calculated by the priority matrix.";
    en.camposObrigatorios.matrix.rules.recommended_zero_hour = "Recommended; when informed, it impacts priority interpretation.";
    en.camposObrigatorios.matrix.rules.recommended_general = "Recommended field to increase data quality and traceability.";
    en.camposObrigatorios.matrix.rules.recommended_partner_if_missing = "Recommended when not captured in the mandatory conditional field.";
    en.camposObrigatorios.matrix.rules.recommended_rac_yes_no = "Recommended Yes/No field.";
    en.camposObrigatorios.matrix.rules.mandatory_closing_summary = "Mandatory before final closure.";

    en.camposObrigatorios.matrix.regionalRules = en.camposObrigatorios.matrix.regionalRules || {};
    en.camposObrigatorios.matrix.regionalRules.br_only_state = "Brazil regional rule.";
    en.camposObrigatorios.matrix.regionalRules.ar_only_province = "Argentina regional rule.";

    en.camposObrigatorios.matrix.fields = en.camposObrigatorios.matrix.fields || {};
    en.camposObrigatorios.matrix.fields.ticket_requester_name = "Requester / customer name";
    en.camposObrigatorios.matrix.fields.ticket_email = "Email";
    en.camposObrigatorios.matrix.fields.ticket_phone = "Phone";
    en.camposObrigatorios.matrix.fields.ticket_requester_profile = "Requester profile";
    en.camposObrigatorios.matrix.fields.ticket_service_type = "Service type";
    en.camposObrigatorios.matrix.fields.ticket_category = "Category";
    en.camposObrigatorios.matrix.fields.ticket_product = "Product";
    en.camposObrigatorios.matrix.fields.ticket_product_brand = "Product brand";
    en.camposObrigatorios.matrix.fields.ticket_equipment_serial_number = "Equipment serial number";
    en.camposObrigatorios.matrix.fields.ticket_subject = "Subject";
    en.camposObrigatorios.matrix.fields.ticket_description = "Description";
    en.camposObrigatorios.matrix.fields.ticket_state = "State";
    en.camposObrigatorios.matrix.fields.ticket_province = "Province";
    en.camposObrigatorios.matrix.fields.ticket_assistance_distributor_name = "Service partner/distributor name";
    en.camposObrigatorios.matrix.fields.ticket_country = "Country";
    en.camposObrigatorios.matrix.fields.ticket_id = "Ticket ID";
    en.camposObrigatorios.matrix.fields.ticket_opening_date = "Opening date";
    en.camposObrigatorios.matrix.fields.ticket_channel = "Channel";
    en.camposObrigatorios.matrix.fields.ticket_owner = "Ticket owner";
    en.camposObrigatorios.matrix.fields.ticket_status = "Status";
    en.camposObrigatorios.matrix.fields.ticket_priority = "Priority";
    en.camposObrigatorios.matrix.fields.ticket_sla_first_response = "First response SLA";
    en.camposObrigatorios.matrix.fields.ticket_sla_resolution = "Resolution SLA";
    en.camposObrigatorios.matrix.fields.ticket_first_response_date = "First response date";
    en.camposObrigatorios.matrix.fields.ticket_closing_date = "Closing date";
    en.camposObrigatorios.matrix.fields.ticket_time_to_first_response = "Time to first response";
    en.camposObrigatorios.matrix.fields.ticket_total_time_to_close = "Total time to close";
    en.camposObrigatorios.matrix.fields.ticket_sla_compliance_indicator = "SLA compliance indicator";
    en.camposObrigatorios.matrix.fields.ticket_zero_hour_out_of_box = "Zero hour / Out of the box";
    en.camposObrigatorios.matrix.fields.ticket_needs_part = "Needs part";
    en.camposObrigatorios.matrix.fields.ticket_partner_distributor = "Partner/distributor";
    en.camposObrigatorios.matrix.fields.ticket_rac_sent = "RAC sent?";
    en.camposObrigatorios.matrix.fields.ticket_technical_assistance_type = "Technical assistance type";
    en.camposObrigatorios.matrix.fields.ticket_resolution_summary = "Resolution / resolution summary";
    en.camposObrigatorios.matrix.fields.ticket_closing_reason = "Closing reason";
    en.camposObrigatorios.matrix.fields.ticket_on_site_or_remote_solution = "On-site/remote solution";
    en.camposObrigatorios.matrix.fields.ticket_used_part = "Used part";
    en.camposObrigatorios.matrix.fields.ticket_final_parts_quantity = "Final parts quantity";
    en.camposObrigatorios.matrix.fields.contact_first_name = "First name";
    en.camposObrigatorios.matrix.fields.contact_last_name = "Last name";
    en.camposObrigatorios.matrix.fields.contact_account_name = "Account name";
    en.camposObrigatorios.matrix.fields.contact_email = "Email";
    en.camposObrigatorios.matrix.fields.contact_phone_mobile = "Phone/Mobile";
    en.camposObrigatorios.matrix.fields.contact_legal_name = "Legal name";
    en.camposObrigatorios.matrix.fields.contact_trade_name = "Trade name";
    en.camposObrigatorios.matrix.fields.contact_language = "Language";
    en.camposObrigatorios.matrix.fields.contact_address = "Address";
    en.camposObrigatorios.matrix.fields.contact_scanner_model = "Scanner Model";
    en.camposObrigatorios.matrix.fields.contact_installation_date = "Installation Date";
    en.camposObrigatorios.matrix.fields.contact_dealer = "Dealer";
    en.camposObrigatorios.matrix.fields.contact_scanner_serial_number = "Scanner Serial Number";
    en.camposObrigatorios.matrix.fields.contact_pc_model = "PC Model";
    en.camposObrigatorios.matrix.fields.contact_pc_serial_number = "PC Serial Number";
    en.camposObrigatorios.matrix.fields.contact_parts_warranty = "Parts Warranty";
    en.camposObrigatorios.matrix.fields.contact_labor_warranty = "Labor Warranty";
    en.camposObrigatorios.matrix.fields.contact_fda_2579_form_number = "FDA 2579 Form Number";
    en.camposObrigatorios.matrix.fields.contact_fda_2579_form_date = "FDA 2579 Form Date";

    en.camposObrigatorios.matrix.support = en.camposObrigatorios.matrix.support || {};
    en.camposObrigatorios.matrix.support.interpretation = en.camposObrigatorios.matrix.support.interpretation || {};
    en.camposObrigatorios.matrix.support.interpretation.title = "How to interpret the matrix";
    en.camposObrigatorios.matrix.support.interpretation.mandatory = "Mandatory = it must be filled according to the rule.";
    en.camposObrigatorios.matrix.support.interpretation.recommended = "Recommended = improves operational quality, but does not block ticket opening.";
    en.camposObrigatorios.matrix.support.interpretation.automatic = "Automatic = filled by the system.";
    en.camposObrigatorios.matrix.support.interpretation.conditional = "Conditional = mandatory only when the condition applies.";

    en.camposObrigatorios.matrix.support.criticalRules = en.camposObrigatorios.matrix.support.criticalRules || {};
    en.camposObrigatorios.matrix.support.criticalRules.title = "Critical conditional rules";
    en.camposObrigatorios.matrix.support.criticalRules.stateBrazil = "State is mandatory only for Brazil.";
    en.camposObrigatorios.matrix.support.criticalRules.provinceArgentina = "Province is mandatory only for Argentina.";
    en.camposObrigatorios.matrix.support.criticalRules.assistanceDistributor = "Service partner/distributor name is mandatory only for Assistance / Distributor.";
    en.camposObrigatorios.matrix.support.criticalRules.serialException = "Serial number is mandatory with a justified contextual exception.";
    en.camposObrigatorios.matrix.support.criticalRules.priorityCalculated = "Priority is mandatory and matrix-calculated, not subjectively chosen.";
    en.camposObrigatorios.matrix.support.criticalRules.zeroHourImpact = "Zero hour / Out of the box is recommended, but impacts priority interpretation.";

    en.camposObrigatorios.matrix.common = en.camposObrigatorios.matrix.common || {};
    en.camposObrigatorios.matrix.common.notApplicable = "-";

    en.governanca.title = "Playbook Global - Global Governance";
    en.governanca.index.header.title = "Global Governance";
    en.governanca.index.header.subtitle = "Operational governance for daily, biweekly, and monthly operation reading";
    en.governanca.index.footer = "Playbook Global - Global Governance";
    en.governanca.main.opening.pageTitle = "Playbook Global - Global Governance";
    en.governanca.main.opening.breadcrumb = "Home > Global Service > Global Governance";
    en.governanca.main.opening.moduleLabel = "Module: Global Governance";
    en.governanca.main.opening.operationalContext = "Operational context: short follow-up to keep queue visibility, service pace, and correction decisions.";
    en.governanca.main.opening.title = "Global Governance";
    en.governanca.main.opening.description = "Single page to track what to monitor by frequency, how to read Power BI, and how to act when there is a deviation.";
    en.governanca.main.opening.context = "Scope of this page: what to track, at what frequency, why it matters, and the expected action by layer.";
    en.governanca.main.nav.label = "Module internal navigation";
    en.governanca.main.nav.layers = "Governance by Layer";
    en.governanca.main.nav.bi = "How to track in Power BI";
    en.governanca.main.nav.deviations = "What to do when there is a deviation";
    en.governanca.main.layers.kicker = "Main panel";
    en.governanca.main.layers.title = "Governance by Layer";
    en.governanca.main.layers.description = "The three layers below show frequency, focus, reading, and expected action to keep operations under control.";
    en.governanca.main.layers.operationalReading = "Operational reading";
    en.governanca.main.layers.executiveReading = "Executive reading";
    en.governanca.main.layers.frequencyLabel = "Frequency";
    en.governanca.main.layers.focusLabel = "Main focus";
    en.governanca.main.layers.toolLabel = "Tool";
    en.governanca.main.layers.trackLabel = "What to track";
    en.governanca.main.layers.whyLabel = "Why track";
    en.governanca.main.layers.expectedActionLabel = "Expected action";
    en.governanca.main.layers.daily.step = "Layer 1";
    en.governanca.main.layers.daily.name = "Daily";
    en.governanca.main.layers.daily.frequency = "Daily";
    en.governanca.main.layers.daily.focus = "Backlog";
    en.governanca.main.layers.daily.tool = "Power BI";
    en.governanca.main.layers.daily.track.backlog = "Open backlog by queue";
    en.governanca.main.layers.daily.track.paused = "Stalled tickets without progress";
    en.governanca.main.layers.daily.track.aging = "Early aging and queue reading";
    en.governanca.main.layers.daily.why = "Prevents forgotten tickets, invisible queue, and uncontrolled backlog aging.";
    en.governanca.main.layers.daily.expectedAction = "Quickly identify accumulation and prioritize immediate action on critical queue.";
    en.governanca.main.layers.biweekly.step = "Layer 2";
    en.governanca.main.layers.biweekly.name = "Biweekly";
    en.governanca.main.layers.biweekly.frequency = "Biweekly";
    en.governanca.main.layers.biweekly.focus = "MTTS, MTFC, CSAT, backlog, and aging";
    en.governanca.main.layers.biweekly.tool = "Power BI";
    en.governanca.main.layers.biweekly.track.kpis = "MTTS, MTFC, CSAT, backlog, and aging";
    en.governanca.main.layers.biweekly.track.status = "Correct status usage and improper concentration";
    en.governanca.main.layers.biweekly.track.fields = "Field completeness as reading support";
    en.governanca.main.layers.biweekly.why = "Takes the team out of daily urgency and checks whether operations run within the expected standard.";
    en.governanca.main.layers.biweekly.expectedAction = "Correct process deviations, align operational behavior, and define action owners.";
    en.governanca.main.layers.monthly.step = "Layer 3";
    en.governanca.main.layers.monthly.name = "Monthly";
    en.governanca.main.layers.monthly.frequency = "Monthly";
    en.governanca.main.layers.monthly.focus = "SLA compliance";
    en.governanca.main.layers.monthly.tool = "Power BI";
    en.governanca.main.layers.monthly.track.sla = "Consolidated SLA compliance";
    en.governanca.main.layers.monthly.track.mtts = "MTTS as supporting metric";
    en.governanca.main.layers.monthly.track.priority = "Correction priorities for the next cycle";
    en.governanca.main.layers.monthly.why = "Shows whether service standards are sustained and operations deliver executive consistency.";
    en.governanca.main.layers.monthly.expectedAction = "Consolidate executive reading of operational health and prioritize structural corrections.";
    en.governanca.main.bi.title = "How to track in Power BI";
    en.governanca.main.bi.description = "Use BI as the single tool for daily, biweekly, and monthly reading to turn signals into objective action.";
    en.governanca.main.bi.daily.title = "Daily";
    en.governanca.main.bi.daily.item1 = "Track open backlog by queue and team.";
    en.governanca.main.bi.daily.item2 = "Identify stalled tickets without movement.";
    en.governanca.main.bi.daily.item3 = "Watch early aging for preventive action.";
    en.governanca.main.bi.biweekly.title = "Biweekly";
    en.governanca.main.bi.biweekly.item1 = "Review MTTS, MTFC, CSAT, backlog, and aging.";
    en.governanca.main.bi.biweekly.item2 = "Identify process and status deviations.";
    en.governanca.main.bi.biweekly.item3 = "Compare evolution across periods and teams.";
    en.governanca.main.bi.monthly.title = "Monthly";
    en.governanca.main.bi.monthly.item1 = "Track consolidated SLA compliance.";
    en.governanca.main.bi.monthly.item2 = "Use MTTS as a supporting reading.";
    en.governanca.main.bi.monthly.item3 = "Consolidate executive reading for prioritization.";
    en.governanca.main.bi.placeholder.title = "Space for dashboard screenshot";
    en.governanca.main.bi.placeholder.description = "When the official screenshot is available, place the consolidated view here for quick reading.";
    en.governanca.main.deviations.title = "What to do when there is a deviation";
    en.governanca.main.deviations.description = "When signals move outside expected ranges, execute short actions with clear ownership in the right cadence.";
    en.governanca.main.deviations.deviationLabel = "Deviation";
    en.governanca.main.deviations.expectedActionLabel = "Expected action";
    en.governanca.main.deviations.items.backlog.name = "Backlog increasing";
    en.governanca.main.deviations.items.backlog.action = "Review queue, rebalance priority, and address forgotten tickets in the daily routine.";
    en.governanca.main.deviations.items.aging.name = "Aging increasing";
    en.governanca.main.deviations.items.aging.action = "Map where tickets are stalling and fix the operational blocking point.";
    en.governanca.main.deviations.items.sla.name = "SLA compliance dropping";
    en.governanca.main.deviations.items.sla.action = "Reprioritize critical queue and align a recovery plan in monthly governance.";
    en.governanca.main.deviations.items.mtts.name = "MTTS worsening";
    en.governanca.main.deviations.items.mtts.action = "Review triage time and remove blockers in handoff to handling.";
    en.governanca.main.deviations.items.mtfc.name = "MTFC worsening";
    en.governanca.main.deviations.items.mtfc.action = "Adjust first-response prioritization and monitor compliance by team.";
    en.governanca.main.deviations.items.csat.name = "CSAT dropping";
    en.governanca.main.deviations.items.csat.action = "Review handling quality and align customer communication on critical queues.";
    en.governanca.main.deviations.items.status.name = "Incorrect status usage";
    en.governanca.main.deviations.items.status.action = "Correct status discipline in daily routine and reinforce rule in biweekly cadence.";
    en.governanca.main.deviations.items.fields.name = "Incomplete fields";
    en.governanca.main.deviations.items.fields.action = "Enforce proper completion and prevent recurrence with objective team guidance.";

    en.canaisEntrada.title = "Playbook Global - Input Channels";
    en.canaisEntrada.index.header.title = "Input Channels";
    en.canaisEntrada.index.header.subtitle = "Customer access channels and minimum consistency assurance in ticket opening";
    en.canaisEntrada.index.footer = "Playbook Global - Input Channels";

    en.simulador.title = "Playbook Global - Ticket Simulator";
    en.simulador.index.header.title = "Ticket Simulator";
    en.simulador.index.header.subtitle = "Guided simulation of a ticket operational journey in the global service model";
    en.simulador.index.footer = "Playbook Global - Ticket Simulator";
    en.simulador.data.scenarios.ticketIdeal.title = "Ideal ticket";
    en.simulador.data.scenarios.ticketIdeal.description = "Ticket opened with complete information and correct classification.";
    en.simulador.data.scenarios.ticketIncompleto.title = "Incomplete ticket";
    en.simulador.data.scenarios.ticketIncompleto.description = "Ticket opened with insufficient information.";
    en.simulador.data.scenarios.prioridadeIncorreta.title = "Incorrect priority";
    en.simulador.data.scenarios.prioridadeIncorreta.description = "Ticket with incorrect priority classification.";
    en.simulador.data.scenarios.dependenciaPeca.title = "Parts dependency";
    en.simulador.data.scenarios.dependenciaPeca.description = "Ticket that moves to waiting for parts.";
    en.simulador.data.scenarios.dependenciaAT.title = "Technical assistance dependency";
    en.simulador.data.scenarios.dependenciaAT.description = "Ticket with external dependency.";
    en.simulador.data.scenarios.canalNaoEstruturado.title = "Unstructured channel";
    en.simulador.data.scenarios.canalNaoEstruturado.description = "Ticket coming from a low-standardization channel.";
    en.simulador.data.scenarios.cenarioCritico.title = "Critical scenario";
    en.simulador.data.scenarios.cenarioCritico.description = "Ticket with high operational impact.";
    en.simulador.data.scenarioToneMeta.positivo.label = "Positive";
    en.simulador.data.scenarioToneMeta.negativo.label = "Negative";
    en.simulador.data.scenarioToneMeta.neutro.label = "Neutral";

    en.tutorialZoho.title = "Playbook Global - Daily Operations in Zoho Desk";
    en.tutorialZoho.index.header.title = "Daily Operations in Zoho Desk";
    en.tutorialZoho.index.header.subtitle = "Guided manual for operational usage with disciplined records and governance";
    en.tutorialZoho.index.footer = "Playbook Global - Daily Operations in Zoho Desk";
    en.tutorialZoho.data.labels.stepPrefix = "Step";
    en.tutorialZoho.data.labels.stepCurrentSuffix = "(current step)";
    en.tutorialZoho.data.labels.startStep = "Start step";
    en.tutorialZoho.data.labels.openStep = "Open step";
    en.tutorialZoho.data.labels.backToHome = "Back to module home";
    en.tutorialZoho.data.labels.viewJourney = "View full journey";
    en.tutorialZoho.data.labels.backPrefix = "Back:";
    en.tutorialZoho.data.labels.nextPrefix = "Next:";
    en.tutorialZoho.data.labels.finishToGovernance = "Go to Global Governance";
    en.tutorialZoho.data.journey = [
        { file: "visao-geral-interface.html", title: "Interface overview", summary: "Understand menus, shortcuts, and initial reading of the operations screen." },
        { file: "tickets-rotina-operacional.html", title: "Tickets and operational routine", summary: "Organize daily ticket review with ownership, status, and progress." },
        { file: "views-filtros-work-modes.html", title: "Views, filters, and work modes", summary: "Work the queue focusing on priority, backlog, and operational pace." },
        { file: "departamentos-na-pratica.html", title: "Departments in practice", summary: "Apply the right scope per team and avoid queue mixing." },
        { file: "atualizacao-campos-ticket.html", title: "Ticket field updates", summary: "Ensure consistent records for governance and comparability." },
        { file: "resposta-interacao-ticket.html", title: "Customer response and interaction", summary: "Separate external communication and internal notes with traceability." },
        { file: "criacao-de-tickets.html", title: "Ticket creation", summary: "Open tickets with quality from intake and proper data linking." },
        { file: "boas-praticas-operacionais.html", title: "Operational best practices", summary: "Consolidate operating discipline for reliable SLA, aging, and backlog." }
    ];

    en.kanban.title = "Playbook Global - Operational Kanban";
    en.kanban.index.header.title = "02 - Global Kanban";
    en.kanban.index.header.subtitle = "Operational view of ticket flow by official status";
    en.kanban.index.footer = "Playbook Global - Module 02 Kanban";
    en.kanban.data.nav = [
        { label: "Overview", href: "index.html" },
        { label: "Statuses and Objectives", href: "estrutura.html" },
        { label: "Rules and Management", href: "regras.html" }
    ];
    en.kanban.data.statuses = [
        { key: "aberto", title: "Open", lane: "ativo", objective: "Register the ticket and make it ready for triage.", when: "At opening, with minimum information to start service.", correctStay: "Short stay until first handling.", risk: "Stalling here creates hidden intake backlog." },
        { key: "em_atendimento", title: "In Progress", lane: "ativo", objective: "Perform actual technical work on the ticket.", when: "Only while effective action is underway.", correctStay: "Frequent updates and concrete progress.", risk: "Using it as a generic status hides waiting queues." },
        { key: "aguardando_cliente", title: "Waiting for Customer", lane: "espera", objective: "Wait for customer response or action.", when: "When the next step objectively depends on the customer.", correctStay: "With a clear waiting reason and registered context.", risk: "Waiting without context reduces aging and SLA control." },
        { key: "aguardando_peca", title: "Waiting for Parts", lane: "espera", objective: "Wait for parts, materials, or logistics to continue.", when: "When execution depends on physical item availability.", correctStay: "With traceable order and monitored arrival forecast.", risk: "Without control, aging increases without cause visibility." },
        { key: "aguardando_terceiro", title: "Waiting for Third Party / Technical Visit", lane: "espera", objective: "Wait for third-party work or a technical visit.", when: "When the ticket depends on technical assistance/third party, internal or external.", correctStay: "With dependency logged and return ETA monitored.", risk: "Without dependency control, bottlenecks become invisible." },
        { key: "resolvido", title: "Resolved", lane: "final", objective: "Record applied solution before final closure.", when: "When handling is complete but closure validation is still pending.", correctStay: "With a clear solution summary and completion evidence.", risk: "Skipping this stage distorts rework and quality visibility." },
        { key: "fechado", title: "Closed", lane: "final", objective: "Formalize closure with minimum resolution records.", when: "After passing through Resolved and validating closure conditions.", correctStay: "Ticket completed with a consistent closure trail.", risk: "Closing too early distorts SLA and causes rework through reopenings." }
    ];
    en.kanban.data.languageRows = [
        { pt: "Aberto", en: "Open", es: "Abierto" },
        { pt: "Em Atendimento", en: "In Progress", es: "En Atencion" },
        { pt: "Aguardando Cliente", en: "Waiting for Customer", es: "Esperando al Cliente" },
        { pt: "Aguardando Peca", en: "Waiting for Parts", es: "Esperando Repuesto" },
        { pt: "Aguardando Terceiro / Visita Tecnica", en: "Waiting for Third Party / Technical Visit", es: "Esperando Tercero / Visita Tecnica" },
        { pt: "Resolvido", en: "Resolved", es: "Resuelto" },
        { pt: "Fechado", en: "Closed", es: "Cerrado" }
    ];
    en.kanban.data.validTransitions = [
        "Entry -> Open -> In Progress",
        "In Progress -> Waiting for Customer",
        "In Progress -> Waiting for Parts",
        "In Progress -> Waiting for Third Party / Technical Visit",
        "In Progress -> Resolved",
        "Waiting for Customer -> In Progress",
        "Waiting for Parts -> In Progress",
        "Waiting for Third Party / Technical Visit -> In Progress",
        "Resolved -> Closed"
    ];
    en.kanban.data.avoidMoves = [
        "Open -> Closed without actual handling",
        "Using In Progress without effective action",
        "Moving to waiting without minimum context",
        "Closing ticket without passing through Resolved",
        "Movements by profiles outside internal technical support"
    ];
    en.kanban.data.managementSignals = [
        { topic: "Active backlog", reading: "High volume in Open/In Progress with no daily turnover.", action: "Prioritize triage and rebalance active queue capacity." },
        { topic: "Waiting bottleneck", reading: "Concentration in Waiting for Customer, Third Party/Technical Visit, or Parts.", action: "Act on the dominant blocker and monitor waiting time." },
        { topic: "Aging", reading: "Tickets aging in the same column.", action: "Launch an action plan by stage root cause." },
        { topic: "SLA", reading: "Response/resolution time pressured by incorrect queues.", action: "Correct statuses to recover real compliance visibility." }
    ];
    en.kanban.data.labels.objective = "Objective:";
    en.kanban.data.labels.when = "When the ticket should be here:";
    en.kanban.data.labels.correctStay = "Correct stay:";
    en.kanban.data.labels.risk = "Risk of incorrect use:";
    en.kanban.data.labels.reading = "How to read:";
    en.kanban.data.labels.action = "Management action:";
    en.kanban.data.labels.tablePt = "Portuguese";
    en.kanban.data.labels.tableEn = "English";
    en.kanban.data.labels.tableEs = "Spanish";

    en.fluxoGlobal.title = "Playbook Global - Global Flow";
    en.fluxoGlobal.index.header.title = "Global Flow";
    en.fluxoGlobal.index.header.subtitle = "Consolidated structure of the ticket operational journey in the global service model";
    en.fluxoGlobal.index.footer = "Playbook Global - Global Flow";
    en.fluxoGlobal.rulesPage = en.fluxoGlobal.rulesPage || {};
    en.fluxoGlobal.rulesPage.title = "Global Flow - Rules and Automations";
    en.fluxoGlobal.rulesPage.header = en.fluxoGlobal.rulesPage.header || {};
    en.fluxoGlobal.rulesPage.header.title = "Rules and Automations";
    en.fluxoGlobal.rulesPage.header.subtitle = "System logic that sustains operational consistency";
    en.fluxoGlobal.rulesPage.header.backToFlow = "Back to Global Flow";
    en.fluxoGlobal.rulesPage.hero = en.fluxoGlobal.rulesPage.hero || {};
    en.fluxoGlobal.rulesPage.hero.badge = "System engine of the process";
    en.fluxoGlobal.rulesPage.hero.title = "Rules and Automations";
    en.fluxoGlobal.rulesPage.hero.description = "This page presents the operational rules and system automations that govern ticket behavior in the global flow.";
    en.fluxoGlobal.rulesPage.map = {
        title: "Visual Rules Map",
        description: "Quick view of the logic that controls the full ticket lifecycle.",
        steps: [
            { title: "Ticket entry", detail: "Demand is registered by form or assisted service." },
            { title: "Automatic routing", detail: "System reads key fields and organizes the initial queue." },
            { title: "Service and automations", detail: "Events, records, and status control are updated automatically." },
            { title: "Flow metrics", detail: "MTFC, SLA, and MTTS track operational pace and compliance." },
            { title: "Resolved", detail: "Operational closure with a 24-hour reopening window." },
            { title: "Closed", detail: "Final closure with no active handling remaining." }
        ]
    };
    en.fluxoGlobal.rulesPage.entry = {
        title: "Ticket Entry and Creation",
        description: "Entry may vary by channel or country, but the global standard requires formal registration as a ticket.",
        channels: [
            {
                title: "Form",
                detail: "Customer fills the form and the ticket is created automatically in the flow.",
                actor: "Customer + System"
            },
            {
                title: "Assisted service",
                detail: "Agent finds the customer record and creates or links a new ticket.",
                actor: "Agent"
            }
        ],
        globalRule: "Entry methods may vary by country/channel, but every demand must be registered as a ticket."
    };
    en.fluxoGlobal.rulesPage.routing = {
        title: "Initial Automatic Routing",
        description: "Critical rule: right after creation, the system uses four fields to direct and organize the initial queue.",
        fieldsTitle: "Fields that route the ticket",
        flowTitle: "Routing logic",
        fields: ["Region", "Service Type", "Product", "Category"],
        flow: ["Ticket created", "System reads the fields", "Initial queue routed automatically"]
    };
    en.fluxoGlobal.rulesPage.automations = {
        title: "Automations and System Fields",
        description: "The system registers, calculates, and controls key events to keep traceability and global consistency.",
        groups: [
            {
                id: "register",
                title: "Automatic registration",
                items: ["Ticket ID", "Opening date", "Channel", "Ticket owner (when applicable)", "Status", "Update date/time"]
            },
            {
                id: "calculation",
                title: "Automatic calculation",
                items: ["Priority", "First-response SLA", "Resolution SLA", "Operational times", "SLA indicators"]
            },
            {
                id: "control",
                title: "Flow control",
                items: ["Status change", "Stage time tracking", "Movement history", "Resolution date", "Closing date"]
            }
        ],
        priorityNote: "Priority is calculated from the defined fields and drives SLA, urgency, and operational reading."
    };
    en.fluxoGlobal.rulesPage.metrics = {
        title: "Metrics and Closure",
        description: "Operational reading of the main metrics and cycle-closing rules.",
        bars: [
            { tag: "MTFC", range: "Open -> First contact / first response", note: "Measures initial response time to the customer." },
            { tag: "SLA", range: "Only in In Progress", note: "Monitored only during active work time." },
            { tag: "MTTS", range: "Open -> Resolved", note: "Measures time until operational closure." }
        ],
        closure: [
            {
                title: "Resolved",
                points: ["Ticket operationally closed", "Final information recorded", "Customer can reopen within 24 hours"]
            },
            {
                title: "Closed",
                points: ["Final closure", "Ticket with no active handling remaining"]
            }
        ]
    };
    en.fluxoGlobal.rulesPage.regional = {
        title: "Future Regional Adaptation",
        description: "The current flow is the global standard. Regional adaptations are not yet applied. As rollout advances, small operational differences may be documented by region without changing the global minimum.",
        selectorLabel: "View baseline",
        option: "Global Standard"
    };
    en.fluxoGlobal.rulesPage.related = {
        title: "Related",
        links: [
            { label: "Flow Stages", href: "etapas-do-fluxo.html" },
            { label: "Required Fields", href: "../05_Campos_Obrigatorios/index.html" },
            { label: "Priority", href: "../04_Prioridade/index.html" },
            { label: "KPIs", href: "../01_KPI/KPI_V2/index.html" },
            { label: "Governance", href: "../06_Governanca/index.html" }
        ]
    };
    en.fluxoGlobal.data.moduleName = "Global Flow";
    en.fluxoGlobal.data.pages = [
        { href: "index.html", label: "Home", title: "Consolidated global flow board in an operational format." },
        { href: "etapas-do-fluxo.html", label: "Flow Stages", title: "Meaning, usage, owner, and fields by stage." },
        { href: "regras-e-automacoes.html", label: "Rules and Automations", title: "Priority, status, ownership, and systemic logic." },
        { href: "slas-e-tempos.html", label: "SLAs and Timing", title: "Active time, waiting time, first response, and resolution." },
        { href: "excecoes-e-cenarios.html", label: "Exceptions and Scenarios", title: "Non-linear paths, waiting states, and reopenings." },
        { href: "governanca-do-fluxo.html", label: "Flow Governance", title: "Backlog, aging, and management flow reading." }
    ];
    en.fluxoGlobal.data.stages = [
        { name: "Open" },
        { name: "In Progress" },
        { name: "Waiting for Customer" },
        { name: "Waiting for Parts" },
        { name: "Waiting for Third Party / Technical Visit" },
        { name: "Resolved" },
        { name: "Closed" }
    ];
    en.fluxoGlobal.data.labels.breadcrumbHome = "Home";
    en.fluxoGlobal.data.labels.pagerPrevious = "Previous page:";
    en.fluxoGlobal.data.labels.pagerNext = "Next page:";
    en.fluxoGlobal.data.labels.pagerBackHome = "Back to module home";
    en.fluxoGlobal.data.labels.currentTrackPrefix = "Current reading:";
    en.fluxoGlobal.nav = en.fluxoGlobal.nav || {};
    en.fluxoGlobal.nav.home = "Global Flow";
    en.fluxoGlobal.nav.homeTitle = "Official visual guide to the flow.";
    en.fluxoGlobal.nav.flowRead = "Stage-by-stage view";
    en.fluxoGlobal.nav.flowReadTitle = "Operational detail of the official statuses.";
    en.fluxoGlobal.nav.rulesRead = "Rules and Automations";
    en.fluxoGlobal.nav.rulesReadTitle = "Systemic rules and process automations.";
    en.fluxoGlobal.nav.label = "Essential module navigation";
    en.fluxoGlobal.nav.legacyStages = "Flow Stages";
    en.fluxoGlobal.nav.legacyTimes = "SLAs and Timing";
    en.fluxoGlobal.nav.legacyExceptions = "Exceptions and Scenarios";
    en.fluxoGlobal.nav.legacyGovernance = "Flow Governance";
    en.fluxoGlobal.globalPattern = en.fluxoGlobal.globalPattern || {};
    en.fluxoGlobal.globalPattern.moduleLabel = "Module: Global Flow";
    en.fluxoGlobal.globalPattern.indexObjective = "Context: official operational view of the flow and service logic.";
    en.fluxoGlobal.globalPattern.rulesObjective = "Context: system and operational rules for consistent flow execution.";
    en.fluxoGlobal.globalPattern.indexSupport = en.fluxoGlobal.globalPattern.indexSupport || {};
    en.fluxoGlobal.globalPattern.indexSupport.readingTitle = "Operational attention points";
    en.fluxoGlobal.globalPattern.indexSupport.responsibilitiesTitle = "Responsibilities by status";
    en.fluxoGlobal.globalPattern.rulesPanel = en.fluxoGlobal.globalPattern.rulesPanel || {};
    en.fluxoGlobal.globalPattern.rulesPanel.statusTitle = "Statuses and transitions";
    en.fluxoGlobal.globalPattern.rulesPanel.transitionsNote = "Correct transitions keep queue, aging, and productivity readings reliable.";
    en.fluxoGlobal.globalPattern.rulesPanel.priorityTitle = "Priority and SLA";
    en.fluxoGlobal.globalPattern.rulesPanel.exceptionsTitle = "Essential exceptions";
    en.fluxoGlobal.globalPattern.rulesPanel.closureTitle = "Operational closure";
    en.fluxoGlobal.globalPattern.rulesPanel.exceptionWaiting = "Waiting statuses must be used only with a clear external dependency context.";
    en.fluxoGlobal.globalPattern.rulesSupport = en.fluxoGlobal.globalPattern.rulesSupport || {};
    en.fluxoGlobal.globalPattern.rulesSupport.quickReadTitle = "Quick operational reading";
    en.fluxoGlobal.globalPattern.rulesSupport.ownershipTitle = "Critical responsibilities";
    en.fluxoGlobal.globalPattern.rulesSupport.ownershipRule = "The system closes the cycle and the agent ensures traceability across the whole handling journey.";

    en.fluxoGlobal.landing = en.fluxoGlobal.landing || {};
    en.fluxoGlobal.landing.guideHero = en.fluxoGlobal.landing.guideHero || {};
    en.fluxoGlobal.landing.guideHero.badge = "Official process guide";
    en.fluxoGlobal.landing.guideHero.title = "End-to-end Global Flow";
    en.fluxoGlobal.landing.guideHero.description = "Visual and operational reading of ticket handling: entry, automatic routing, official statuses, automation points, metrics, and closure rules.";

    en.fluxoGlobal.kanban = en.fluxoGlobal.kanban || {};
    en.fluxoGlobal.kanban.fieldLabels = en.fluxoGlobal.kanban.fieldLabels || {};
    en.fluxoGlobal.kanban.fieldLabels.automatic = "Automatic";
    en.fluxoGlobal.kanban.fieldLabels.required = "Required Fields";
    en.fluxoGlobal.kanban.fieldLabels.conditional = "Conditional";
    en.fluxoGlobal.kanban.fieldLabels.desirable = "Desired Fields";
    en.fluxoGlobal.kanban.labels = en.fluxoGlobal.kanban.labels || {};
    en.fluxoGlobal.kanban.labels.actors = "Actors:";
    en.fluxoGlobal.kanban.labels.happens = "What happens:";
    en.fluxoGlobal.kanban.labels.rule = "Rule/Automation:";
    en.fluxoGlobal.kanban.labels.stageFields = "Stage Information";
    en.fluxoGlobal.kanban.labels.legendTitle = "Legend";
    en.fluxoGlobal.kanban.metrics = en.fluxoGlobal.kanban.metrics || {};
    en.fluxoGlobal.kanban.metrics.mtfcRange = "Open -> First contact / first response";
    en.fluxoGlobal.kanban.metrics.slaRange = "Measured only in In Progress";
    en.fluxoGlobal.kanban.metrics.mttsRange = "Open -> Resolved";

    en.fluxoGlobal.homeGuideKanban = {
        summary: {
            title: "Global Process Kanban",
            description: "Single official board for reading the global flow: entry, routing, statuses, rules, and metrics in one view."
        },
        topStrip: {
            entryTitle: "Ticket Entry",
            entries: [
                { title: "Form", detail: "The customer submits a form and the ticket is created automatically with initial data.", actor: "Customer + System" },
                { title: "Assisted Service", detail: "The agent finds the customer record and creates or links a new ticket to start handling.", actor: "Agent" }
            ],
            routingTitle: "Automatic Routing",
            routingFields: ["Region", "Service Type", "Product", "Category"],
            routingNote: "The system reads these four fields to route the ticket to the correct initial queue."
        },
        columns: [
            {
                name: "Open",
                objective: "Ticket officially registered and ready for handling.",
                actors: "System / Agent",
                happens: "Formal ticket creation with minimum validation for classification and routing.",
                autoRule: "The system records opening time, initial data, and baseline indicators.",
                metricTag: "MTTS starts",
                fields: {
                    automatic: ["Ticket ID", "Opening date/time", "Channel", "Ticket owner", "Priority", "First-response SLA", "Resolution SLA"],
                    required: ["Region", "Requester", "Service Type", "Category", "Product(s)", "Product brand", "Subject", "Description", "Phone"],
                    conditional: ["Equipment serial number", "State (Brazil)", "Province (Argentina)", "Service partner/distributor when applicable"],
                    desirable: []
                },
                note: "MTTS counting starts at formal opening.",
                tone: "open"
            },
            {
                name: "In Progress",
                objective: "Active case handling and diagnosis.",
                actors: "Agent",
                happens: "Execution of triage, customer interaction, analysis, and solution actions.",
                autoRule: "The system records movements, operational times, and update history.",
                metricTag: "SLA runs here",
                fields: {
                    automatic: ["Status", "Update date/time", "Operational times", "System movement records"],
                    required: [],
                    conditional: [],
                    desirable: ["Zero-hour or Out of the box", "Requires part? Yes/No", "RAC sent? Yes/No", "Technical support type", "Partner/distributor when not captured as required"]
                },
                note: "This is the core active-work stage.",
                tone: "active"
            },
            {
                name: "Waiting for Customer",
                objective: "Wait for customer response or confirmation.",
                actors: "Customer / Agent",
                happens: "Flow depends on customer information or confirmation to continue.",
                autoRule: "The system records the status change and waiting-time tracking.",
                metricTag: "Waiting",
                fields: {
                    automatic: ["Status change", "Stage time record"],
                    required: [],
                    conditional: [],
                    desirable: ["Pending item registered for follow-up"]
                },
                note: "Separates external dependency from active work.",
                tone: "waiting"
            },
            {
                name: "Waiting for Part",
                objective: "Wait for required part or supply.",
                actors: "Agent / Supply",
                happens: "Execution depends on material availability to complete the planned solution.",
                autoRule: "The system records logistics waiting and stage evolution.",
                metricTag: "Waiting",
                fields: {
                    automatic: ["Status change", "Stage record", "Waiting time"],
                    required: [],
                    conditional: [],
                    desirable: ["Requires part? Yes/No", "Operational complement when applicable"]
                },
                note: "Separates material dependency from active handling.",
                tone: "waiting"
            },
            {
                name: "Waiting for Third Party / Technical Visit",
                objective: "Wait for external technical execution.",
                actors: "Agent / Third Party",
                happens: "Flow depends on partner execution or external technical visit.",
                autoRule: "The system records handoff and expected return.",
                metricTag: "Waiting",
                fields: {
                    automatic: ["Status change", "Stage record"],
                    required: [],
                    conditional: [],
                    desirable: ["Technical support type", "RAC sent? Yes/No when applicable"]
                },
                note: "Separates external queue from internal execution.",
                tone: "waiting"
            },
            {
                name: "Resolved",
                objective: "Operational closure with final information recorded.",
                actors: "Agent / System",
                happens: "Solution delivered and final communication registered.",
                autoRule: "Customer can reopen within 24 hours before final closure.",
                metricTag: "MTTS ends",
                fields: {
                    automatic: ["Resolution date/time", "MTTS end"],
                    required: ["Resolution summary"],
                    conditional: [],
                    desirable: ["Closure reason", "On-site/remote solution", "Part used", "Final parts quantity"]
                },
                note: "Operational closure with 24-hour reopening window.",
                tone: "resolved"
            },
            {
                name: "Closed",
                objective: "Final ticket closure.",
                actors: "System",
                happens: "Ticket finished with no active handling remaining.",
                autoRule: "Definitive closure after reopening window ends.",
                metricTag: "Closed",
                fields: {
                    automatic: ["Closing date/time", "Final ticket closure"],
                    required: [],
                    conditional: [],
                    desirable: []
                },
                note: "Represents the definitive end of the ticket journey.",
                tone: "closed"
            }
        ],
        compactRules: [
            "Ticket entry is automatic or agent-assisted",
            "Initial routing uses Region, Service Type, Product, and Category",
            "The system records and calculates flow events",
            "Resolved allows reopening within 24 hours",
            "Closed is the final closure"
        ],
        metricsLegend: {
            title: "Metric reading on the board",
            mtfc: "MTFC: from opening to first contact / first response",
            sla: "SLA: measured only in In Progress",
            mtts: "MTTS: from Open to Resolved"
        },
        regional: {
            title: "Future Regional Adaptation",
            description: "The current flow is the global standard. In future rollouts, small regional differences may be added without changing the global minimum.",
            selectorLabel: "View baseline",
            option: "Global Standard"
        },
        related: {
            text: "Related:",
            links: [
                { label: "Required Fields", href: "../05_Campos_Obrigatorios/index.html" },
                { label: "Priority", href: "../04_Prioridade/index.html" },
                { label: "Governance", href: "../06_Governanca/index.html" },
                { label: "KPIs", href: "../01_KPI/KPI_V2/index.html" },
                { label: "Kanban", href: "../02_Kanban/index.html" }
            ]
        }
    };

    en.fluxoGlobal.stagesPage = {
        title: "Global Flow - Flow Stages",
        header: {
            title: "Flow Stages",
            subtitle: "Operational meaning of each ticket status",
            backToFlow: "Back to Global Flow"
        },
        hero: {
            title: "Flow Stages",
            description: "Understand the role of each status, who acts, and which information is captured in each stage."
        },
        overview: {
            title: "Stages Overview",
            description: "Quick read of the official sequence before stage-by-stage detail."
        },
        details: {
            title: "Detailed Stages",
            empty: "Not applicable in this stage.",
            stages: [
                {
                    id: "opened",
                    title: "Open",
                    objective: "Ticket formally registered and ready for handling.",
                    actors: ["System", "Agent"],
                    happens: [
                        "Ticket registration",
                        "Formal entry into the flow",
                        "Preparation for triage and service"
                    ],
                    info: {
                        automatic: ["Ticket ID", "Opening date", "Channel", "Ticket owner", "Priority", "First-response SLA", "Resolution SLA"],
                        required: ["Region", "Requester", "Service Type", "Category", "Product(s)", "Product brand", "Subject", "Description", "Phone"],
                        conditional: ["Equipment serial number", "State (Brazil)", "Province (Argentina)", "Service partner/distributor when applicable"],
                        desirable: []
                    },
                    notes: [
                        "The ticket can be created automatically from a form or by agent action.",
                        "MTTS starts counting from opening.",
                        "MTFC measures from opening to first contact / first response."
                    ]
                },
                {
                    id: "inProgress",
                    title: "In Progress",
                    objective: "Conduct active case handling.",
                    actors: ["Agent"],
                    happens: [
                        "Analysis and triage",
                        "Customer response",
                        "Next-step definition",
                        "Operational handling and resolution when applicable"
                    ],
                    info: {
                        automatic: ["Status", "Update date/time", "Operational times", "System movement records"],
                        required: [],
                        conditional: [],
                        desirable: ["Zero-hour or Out of the box", "Requires part? Yes/No", "RAC sent? Yes/No", "Technical support type", "Partner/distributor when not captured as required"]
                    },
                    notes: [
                        "SLA is measured only in this stage.",
                        "MTFC relates to the first contact within the active journey.",
                        "This is the core operational work stage."
                    ]
                },
                {
                    id: "waitingCustomer",
                    title: "Waiting for Customer",
                    objective: "Separate customer dependency from the agent's active work.",
                    actors: ["Customer", "Agent"],
                    happens: [
                        "Waiting for confirmation",
                        "Waiting for additional information",
                        "Waiting for required return to continue"
                    ],
                    info: {
                        automatic: ["Status change", "Stage time record"],
                        required: [],
                        conditional: [],
                        desirable: ["Additional information required for the case"]
                    },
                    notes: [
                        "This stage differentiates customer waiting from active work.",
                        "It must not be read as active handling."
                    ]
                },
                {
                    id: "waitingPart",
                    title: "Waiting for Part",
                    objective: "Separate part/material dependency from active handling.",
                    actors: ["Agent", "Supply"],
                    happens: [
                        "Waiting for part",
                        "Waiting for material",
                        "Waiting for supply/logistics"
                    ],
                    info: {
                        automatic: ["Status change", "Stage record", "Waiting time"],
                        required: [],
                        conditional: [],
                        desirable: ["Requires part? Yes/No", "Operational complement when applicable"]
                    },
                    notes: [
                        "This stage differentiates logistics dependency from active agent work."
                    ]
                },
                {
                    id: "waitingThirdParty",
                    title: "Waiting for Third Party / Technical Visit",
                    objective: "Separate third-party dependency or technical visit from internal execution.",
                    actors: ["Agent", "Third Party"],
                    happens: [
                        "Waiting for external service",
                        "Waiting for technical visit",
                        "Field execution follow-up"
                    ],
                    info: {
                        automatic: ["Status change", "Stage record"],
                        required: [],
                        conditional: [],
                        desirable: ["Technical support type", "RAC sent? Yes/No when applicable"]
                    },
                    notes: [
                        "This stage differentiates external dependency from internal execution."
                    ]
                },
                {
                    id: "resolved",
                    title: "Resolved",
                    objective: "Operationally close the ticket with final information recorded.",
                    actors: ["Agent", "System"],
                    happens: [
                        "Resolution applied",
                        "Operational conclusion",
                        "Final solution record",
                        "Operational journey closure"
                    ],
                    info: {
                        automatic: ["Resolution date", "MTTS closure"],
                        required: ["Resolution / final resolution summary"],
                        conditional: [],
                        desirable: ["Closure reason", "On-site/remote solution", "Part used", "Final part quantity"]
                    },
                    notes: [
                        "Customer can reopen the ticket within 24 hours.",
                        "This status supports the reopening window."
                    ]
                },
                {
                    id: "closed",
                    title: "Closed",
                    objective: "Final and definitive ticket closure.",
                    actors: ["System"],
                    happens: [
                        "Definitive closure",
                        "No remaining active handling"
                    ],
                    info: {
                        automatic: ["Closing date", "Final ticket closure"],
                        required: [],
                        conditional: [],
                        desirable: []
                    },
                    notes: [
                        "Closed represents the definitive end of the journey."
                    ]
                }
            ]
        },
        infoLabels: {
            automatic: "Automatic",
            required: "Required",
            conditional: "Conditional",
            desirable: "Desired"
        },
        labels: {
            objective: "Objective:",
            actors: "Who acts",
            happens: "What happens in this stage",
            stageInfo: "Stage information",
            notes: "Quick rules and notes"
        },
        finalNotes: {
            title: "Important rules and notes",
            items: [
                "The ticket can start automatically or by agent action.",
                "Initial routing is automatic based on Region, Service Type, Product, and Category.",
                "SLA is measured only in In Progress.",
                "MTFC measures from opening to first contact / first response.",
                "MTTS measures from opening to Resolved.",
                "Resolved allows reopening for up to 24 hours.",
                "Closed represents the final closure."
            ]
        }
    };

    window.PLAYBOOK_I18N_LOCALES["en"] = en;
})();

(function () {
    const en = window.PLAYBOOK_I18N_LOCALES["en"];
    if (!en || !en.security) return;

    en.security.login.title = "Sign in - Global Playbook";
    en.security.login.kicker = "New security layer";
    en.security.login.heroTitle = "Approved access to protect the Global Playbook";
    en.security.login.notice = "This is a new Global Playbook security feature. To protect project information, it is now necessary to sign in with an approved account. Thank you for your understanding during this update.";
    en.security.login.cardTitle = "Sign in to the Playbook";
    en.security.login.cardLead = "Use your corporate email and password. New registrations remain pending until administrative approval.";
    en.security.auth.loginTab = "Sign in";
    en.security.auth.signupTab = "Register";
    en.security.auth.loginAction = "Sign in";
    en.security.auth.signupAction = "Request access";
    en.security.auth.resetAction = "Send recovery email";
    en.security.auth.forgotPassword = "Forgot password";
    en.security.auth.backToLogin = "Back to sign in";
    en.security.auth.loading = "Processing...";
    en.security.auth.logout = "Sign out";
    en.security.auth.signupSuccess = "Registration received. After email confirmation, wait for administrative approval.";
    en.security.auth.resetSent = "If the email is registered, you will receive a password reset link.";
    en.security.fields.email = "Email";
    en.security.fields.password = "Password";
    en.security.fields.newPassword = "New password";
    en.security.fields.confirmPassword = "Confirm password";
    en.security.validation.email = "Enter a valid email address.";
    en.security.validation.passwordRequired = "Enter your password.";
    en.security.validation.passwordStrength = "Use at least 12 characters with uppercase, lowercase, number, and symbol.";
    en.security.validation.passwordHint = "Use at least 12 characters with uppercase, lowercase, number, and symbol.";
    en.security.validation.passwordMatch = "Password confirmation does not match.";
    en.security.status.Pendente = "Registration received. Wait for administrative approval to access the Playbook.";
    en.security.status.Aprovado = "Account approved.";
    en.security.status.Recusado = "Registration refused. Contact the Playbook administrator.";
    en.security.status.Suspenso = "Account suspended. Contact the Playbook administrator.";
    en.security.statusLabel.Pendente = "Pending";
    en.security.statusLabel.Aprovado = "Approved";
    en.security.statusLabel.Recusado = "Refused";
    en.security.statusLabel.Suspenso = "Suspended";
    en.security.errors.invalidCredentials = "Invalid email or password. Check your details and try again.";
    en.security.errors.signupExists = "This email is already registered or awaiting confirmation.";
    en.security.errors.signupFailed = "Could not complete registration right now.";
    en.security.errors.resetFailed = "Could not send password recovery right now.";
    en.security.errors.authUnavailableTitle = "Could not validate access.";
    en.security.errors.authUnavailable = "Refresh the page or try again shortly.";
    en.security.user.account = "Account";
    en.security.user.admin = "Admin";
    en.security.user.user = "User";
    en.security.user.approved = "Approved";
    en.security.password.title = "Change password - Global Playbook";
    en.security.password.kicker = "Required update";
    en.security.password.heroTitle = "Set a new secure password";
    en.security.password.heroText = "To complete your access to the Global Playbook, update your password before continuing.";
    en.security.password.cardTitle = "Change password";
    en.security.password.cardLead = "Choose a strong and unique password for this account.";
    en.security.password.submit = "Save new password";
    en.security.password.success = "Password changed successfully.";
    en.security.password.error = "Could not change password right now.";
    en.security.password.profileWarning = "Password changed, but the profile could not be updated. Try signing in again.";
    en.security.admin.title = "Playbook Administration";
    en.security.admin.nav = "Administration";
    en.security.admin.headerTitle = "Playbook Administration";
    en.security.admin.headerSubtitle = "User approval and governance";
    en.security.admin.breadcrumb = "Security > Users";
    en.security.admin.pageTitle = "Playbook Administration";
    en.security.admin.pageLead = "Approve, refuse, suspend, or reactivate users with administrative traceability.";
    en.security.admin.usersTitle = "Registered users";
    en.security.admin.searchLabel = "Search email";
    en.security.admin.searchPlaceholder = "name@company.com";
    en.security.admin.statusFilter = "Filter by status";
    en.security.admin.allStatuses = "All";
    en.security.admin.refresh = "Refresh";
    en.security.admin.loading = "Loading users...";
    en.security.admin.empty = "No users found for the current filters.";
    en.security.admin.loaded = "Users loaded successfully.";
    en.security.admin.loadError = "Error loading users.";
    en.security.admin.actionSuccess = "Action completed successfully.";
    en.security.admin.actionError = "Error executing action.";
    en.security.admin.selfProtected = "Current account protected";
    en.security.admin.actions = en.security.admin.actions && typeof en.security.admin.actions === "object"
        ? en.security.admin.actions : {};
    en.security.admin.confirm = en.security.admin.confirm && typeof en.security.admin.confirm === "object"
        ? en.security.admin.confirm : {};
    en.security.admin.table = en.security.admin.table && typeof en.security.admin.table === "object"
        ? en.security.admin.table : {};
    en.security.admin.actions.approve = "Approve";
    en.security.admin.actions.reject = "Refuse";
    en.security.admin.actions.suspend = "Suspend";
    en.security.admin.actions.reactivate = "Reactivate";
    en.security.admin.confirm.approve = "Confirm approval for this user?";
    en.security.admin.confirm.reject = "Confirm refusal for this user?";
    en.security.admin.confirm.suspend = "Confirm suspension for this user?";
    en.security.admin.confirm.reactivate = "Confirm reactivation for this user?";
    en.security.admin.table.email = "Email";
    en.security.admin.table.status = "Status";
    en.security.admin.table.role = "Role";
    en.security.admin.table.created = "Registered";
    en.security.admin.table.updated = "Last change";
    en.security.admin.table.actions = "Actions";
})();

(function () {
    const en = window.PLAYBOOK_I18N_LOCALES["en"];
    if (!en) return;

    en.home = en.home || {};
    en.home.header = en.home.header || {};
    en.home.hero = en.home.hero || {};
    en.home.quickAccess = en.home.quickAccess || {};
    en.home.quickAccess.items = en.home.quickAccess.items || {};

    en.home.title = "Playbook Global - Home";
    en.home.logo = "PLAYBOOK GLOBAL";

    en.home.header.subtitle = "Global Service Governance Operations Portal";
    en.home.header.menuAria = "Open main menu";
    en.home.header.primaryNavAria = "Portal main navigation";
    en.home.header.ctaBi = "Access BI";

    en.home.hero.kicker = "Global Operations Hub";
    en.home.hero.mainTitle = "Standardize global service and make our customer the hero";
    en.home.hero.mainSubtitle = "Choose your workstream and follow clear paths to operate with global consistency.";
    en.home.hero.ctaModules = "Onboarding (Learn)";
    en.home.hero.ctaBi = "Access BI (Analyze)";

    en.home.quickAccess.title = "Quick access";
    en.home.quickAccess.subtitle = "Start with global standards, continue with practical Zoho Desk guidance, and use BI to track operations.";

    en.home.quickAccess.items.globalService = en.home.quickAccess.items.globalService || {};
    en.home.quickAccess.items.globalService.pill = "First step";
    en.home.quickAccess.items.globalService.title = "Global Service";
    en.home.quickAccess.items.globalService.desc = "Understand the global service standard, operating rules, governance, and core service structure.";

    en.home.quickAccess.items.zohoHelp = en.home.quickAccess.items.zohoHelp || {};
    en.home.quickAccess.items.zohoHelp.pill = "Practical guidance";
    en.home.quickAccess.items.zohoHelp.title = "Questions about Zoho?";
    en.home.quickAccess.items.zohoHelp.desc = "Go straight to the Zoho Desk axis and find operational guidance available now.";

    en.home.quickAccess.items.bi = en.home.quickAccess.items.bi || {};
    en.home.quickAccess.items.bi.pill = "Tracking";
    en.home.quickAccess.items.bi.title = "Executive BI";
    en.home.quickAccess.items.bi.desc = "Track indicators, performance, and operational risks after aligning standards and operations.";

    en.home.quickAccess.items.tutorial = en.home.quickAccess.items.tutorial || {};
    en.home.quickAccess.items.tutorial.pill = "Tutorial";
    en.home.quickAccess.items.tutorial.title = "Zoho Desk Tutorial";
    en.home.quickAccess.items.tutorial.desc = "Learn Zoho Desk operational usage with a practical daily guide.";
    en.home.quickAccess.items.tutorial.status = "";

    en.home.quickAccess.items.zohoDesk = en.home.quickAccess.items.zohoDesk || {};
    en.home.quickAccess.items.zohoDesk.pill = en.home.quickAccess.items.zohoHelp.pill;
    en.home.quickAccess.items.zohoDesk.title = en.home.quickAccess.items.zohoHelp.title;
    en.home.quickAccess.items.zohoDesk.desc = en.home.quickAccess.items.zohoHelp.desc;

    en.home.training = en.home.training || {};
    en.home.training.badge_initial = "Initial track";
    en.home.training.badge_basic = "Basic track available";
    en.home.training.title = "First Steps in Zoho Desk";
    en.home.training.description = "Basic training for beginners: tickets, views, and essential day-to-day actions.";
    en.home.training.description_full = "Learn how to access the system, understand tickets, navigate views, and execute essential service updates.";

    en.home.axes = en.home.axes || {};
    en.home.axes.zohoDesk = en.home.axes.zohoDesk || {};
    en.home.axes.zohoDesk.badge = "ZOHO DESK";
    en.home.axes.zohoDesk.title = "Zoho Desk | Operation and Administration";
    en.home.axes.zohoDesk.desc = "Practical guides to use, document, reply to customers and manage Zoho Desk consistently within the global model.";
    en.home.axes.zohoDesk.cta = "Open Zoho Desk";

    en.home.axes.zohoDesk.mainCards = en.home.axes.zohoDesk.mainCards || {};
    en.home.axes.zohoDesk.mainCards.tutorial = en.home.axes.zohoDesk.mainCards.tutorial || {};
    en.home.axes.zohoDesk.mainCards.tutorial.title = "Zoho Desk Tutorial";
    en.home.axes.zohoDesk.mainCards.tutorial.desc = "Learn how to use Zoho Desk in daily operations: handle tickets, reply to customers, document information, attach evidence, and correctly apply status, priority and closure rules.";
    en.home.axes.zohoDesk.mainCards.tutorial.cta = "Open tutorial";
    en.home.axes.zohoDesk.mainCards.admin = en.home.axes.zohoDesk.mainCards.admin || {};
    en.home.axes.zohoDesk.mainCards.admin.title = "Editing and Administration";
    en.home.axes.zohoDesk.mainCards.admin.desc = "Learn how to edit and maintain the system structure: layouts, fields, rules, automations, distribution and operational adjustments in Zoho Desk.";
    en.home.axes.zohoDesk.mainCards.admin.cta = "Open administration";

    en.home.axes.zohoDesk.summary = en.home.axes.zohoDesk.summary || {};
    en.home.axes.zohoDesk.summary.tutorial = en.home.axes.zohoDesk.summary.tutorial || {};
    en.home.axes.zohoDesk.summary.tutorial.title = "In the Zoho Desk Tutorial";
    en.home.axes.zohoDesk.summary.tutorial.items = en.home.axes.zohoDesk.summary.tutorial.items || {};
    en.home.axes.zohoDesk.summary.tutorial.items.gettingStarted = "Getting started";
    en.home.axes.zohoDesk.summary.tutorial.items.handleTicket = "How to handle a ticket";
    en.home.axes.zohoDesk.summary.tutorial.items.replyCustomer = "How to reply to the customer";
    en.home.axes.zohoDesk.summary.tutorial.items.documentEvidence = "How to document information and evidence";
    en.home.axes.zohoDesk.summary.tutorial.items.statusPriorityClosure = "Status, priority and closure";
    en.home.axes.zohoDesk.summary.admin = en.home.axes.zohoDesk.summary.admin || {};
    en.home.axes.zohoDesk.summary.admin.title = "In Editing and Administration";
    en.home.axes.zohoDesk.summary.admin.items = en.home.axes.zohoDesk.summary.admin.items || {};
    en.home.axes.zohoDesk.summary.admin.items.layoutsFields = "Layouts and fields";
    en.home.axes.zohoDesk.summary.admin.items.rulesAutomations = "Rules and automations";
    en.home.axes.zohoDesk.summary.admin.items.roundRobinDistribution = "Round robin and distribution";
    en.home.axes.zohoDesk.summary.admin.items.structuralAdjustments = "Structural adjustments";
    en.home.axes.zohoDesk.summary.admin.items.functionalEvolution = "Functional evolution";

    en.home.axes.zohoDesk.tutorialInfo = en.home.axes.zohoDesk.tutorialInfo || {};
    en.home.axes.zohoDesk.tutorialInfo.title = "How the tutorial works";
    en.home.axes.zohoDesk.tutorialInfo.text = "The Zoho Desk tutorial was structured to support the practical use of the platform in daily operations. The content starts with the first steps in the system and progresses through ticket handling, customer replies, information logging, evidence, status, priority and closure. The goal is to provide simple topic-based navigation for both initial learning and quick consultation during operations.";

    en.home.axes.zohoDesk.tutorialHome = en.home.axes.zohoDesk.tutorialHome || {};
    en.home.axes.zohoDesk.tutorialHome.hero = en.home.axes.zohoDesk.tutorialHome.hero || {};
    en.home.axes.zohoDesk.tutorialHome.hero.tag = "ZOHO DESK TUTORIAL";
    en.home.axes.zohoDesk.tutorialHome.hero.title = "Zoho Desk Tutorial";
    en.home.axes.zohoDesk.tutorialHome.hero.description = "Learn how to use Zoho Desk according to the Alliage operational standard, with practical guidance to handle tickets, reply to customers, log information, attach evidence, and correctly apply status, priority and closure.";
    en.home.axes.zohoDesk.tutorialHome.hero.primaryCta = "Start the tutorial";
    en.home.axes.zohoDesk.tutorialHome.hero.secondaryCta = "Open Zoho Desk";

    en.home.axes.zohoDesk.tutorialHome.howToUse = en.home.axes.zohoDesk.tutorialHome.howToUse || {};
    en.home.axes.zohoDesk.tutorialHome.howToUse.title = "How to use this tutorial";
    en.home.axes.zohoDesk.tutorialHome.howToUse.kicker = "Navigation guide";
    en.home.axes.zohoDesk.tutorialHome.howToUse.text = "Use this page as a navigation guide: start with the official 5-step recommended path, then consult the 9-module library according to operational needs.";
    en.home.axes.zohoDesk.tutorialHome.howToUse.points = en.home.axes.zohoDesk.tutorialHome.howToUse.points || {};
    en.home.axes.zohoDesk.tutorialHome.howToUse.points.organizedByTheme = "Organized by topic to make navigation faster.";
    en.home.axes.zohoDesk.tutorialHome.howToUse.points.initialTraining = "Can be used as initial training for the operation.";
    en.home.axes.zohoDesk.tutorialHome.howToUse.points.quickConsultation = "Also works as quick consultation during daily routine.";
    en.home.axes.zohoDesk.tutorialHome.howToUse.points.followPathThenLibrary = "Follow the official 5-step path first, then use the 9 modules as needed.";

    en.home.axes.zohoDesk.tutorialHome.recommendedPath = en.home.axes.zohoDesk.tutorialHome.recommendedPath || {};
    en.home.axes.zohoDesk.tutorialHome.recommendedPath.kicker = "Official 5-step journey";
    en.home.axes.zohoDesk.tutorialHome.recommendedPath.title = "Recommended path";
    en.home.axes.zohoDesk.tutorialHome.recommendedPath.description = "This tutorial always follows the same official 5-step journey. Complete it before moving to the full module library.";
    en.home.axes.zohoDesk.tutorialHome.recommendedPath.steps = en.home.axes.zohoDesk.tutorialHome.recommendedPath.steps || {};
    en.home.axes.zohoDesk.tutorialHome.recommendedPath.steps.gettingStarted = "Getting started";
    en.home.axes.zohoDesk.tutorialHome.recommendedPath.steps.handleTicket = "Handle ticket";
    en.home.axes.zohoDesk.tutorialHome.recommendedPath.steps.replyCustomer = "Reply to customer";
    en.home.axes.zohoDesk.tutorialHome.recommendedPath.steps.logEvidence = "Log evidence";
    en.home.axes.zohoDesk.tutorialHome.recommendedPath.steps.closeProperly = "Close correctly";

    en.home.axes.zohoDesk.tutorialHome.modules = en.home.axes.zohoDesk.tutorialHome.modules || {};
    en.home.axes.zohoDesk.tutorialHome.modules.kicker = "Complete 9-module library";
    en.home.axes.zohoDesk.tutorialHome.modules.title = "Tutorial modules";
    en.home.axes.zohoDesk.tutorialHome.modules.description = "Complete library with 9 modules for topic-based consultation. Keep the recommended path as the main learning route.";
    en.home.axes.zohoDesk.tutorialHome.modules.badgeComingSoon = "Coming soon";
    en.home.axes.zohoDesk.tutorialHome.modules.ctaComingSoon = "Content in preparation";
    en.home.axes.zohoDesk.tutorialHome.modules.cards = en.home.axes.zohoDesk.tutorialHome.modules.cards || {};
    en.home.axes.zohoDesk.tutorialHome.modules.cards.gettingStarted = en.home.axes.zohoDesk.tutorialHome.modules.cards.gettingStarted || {};
    en.home.axes.zohoDesk.tutorialHome.modules.cards.gettingStarted.title = "Getting started";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.gettingStarted.description = "Learn the basic platform structure, screen reading and the main service elements.";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.handleTicket = en.home.axes.zohoDesk.tutorialHome.modules.cards.handleTicket || {};
    en.home.axes.zohoDesk.tutorialHome.modules.cards.handleTicket.title = "How to handle a ticket";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.handleTicket.description = "Understand the service flow from start to finish, focusing on updates, follow-up and correct ticket handling.";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.replyCustomer = en.home.axes.zohoDesk.tutorialHome.modules.cards.replyCustomer || {};
    en.home.axes.zohoDesk.tutorialHome.modules.cards.replyCustomer.title = "How to reply to the customer";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.replyCustomer.description = "Learn how to reply with clarity, alignment and proper communication logging in the ticket.";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.logInformation = en.home.axes.zohoDesk.tutorialHome.modules.cards.logInformation || {};
    en.home.axes.zohoDesk.tutorialHome.modules.cards.logInformation.title = "How to log information and evidence";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.logInformation.description = "See how to properly document the handling, attach evidence and preserve the service history.";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.serviceStatus = en.home.axes.zohoDesk.tutorialHome.modules.cards.serviceStatus || {};
    en.home.axes.zohoDesk.tutorialHome.modules.cards.serviceStatus.title = "Service status";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.serviceStatus.description = "Understand when to use each status and how to keep the ticket flow aligned with the operation.";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.prioritySla = en.home.axes.zohoDesk.tutorialHome.modules.cards.prioritySla || {};
    en.home.axes.zohoDesk.tutorialHome.modules.cards.prioritySla.title = "Priority and SLA";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.prioritySla.description = "Understand how priority guides service and how expected times should be interpreted in daily operations.";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.properClosure = en.home.axes.zohoDesk.tutorialHome.modules.cards.properClosure || {};
    en.home.axes.zohoDesk.tutorialHome.modules.cards.properClosure.title = "Proper closure";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.properClosure.description = "Learn how to close tickets consistently, with complete documentation and proper closure.";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.practicalScenarios = en.home.axes.zohoDesk.tutorialHome.modules.cards.practicalScenarios || {};
    en.home.axes.zohoDesk.tutorialHome.modules.cards.practicalScenarios.title = "Practical scenarios";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.practicalScenarios.description = "Review common operational situations and see how to handle each case in the system.";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.faq = en.home.axes.zohoDesk.tutorialHome.modules.cards.faq || {};
    en.home.axes.zohoDesk.tutorialHome.modules.cards.faq.title = "FAQ";
    en.home.axes.zohoDesk.tutorialHome.modules.cards.faq.description = "Quick answers to recurring questions about using Zoho Desk in operations.";

    en.home.axes.zohoDesk.tutorialHome.bestPractices = en.home.axes.zohoDesk.tutorialHome.bestPractices || {};
    en.home.axes.zohoDesk.tutorialHome.bestPractices.title = "Service best practices";
    en.home.axes.zohoDesk.tutorialHome.bestPractices.items = en.home.axes.zohoDesk.tutorialHome.bestPractices.items || {};
    en.home.axes.zohoDesk.tutorialHome.bestPractices.items.item1 = "Reply clearly and objectively";
    en.home.axes.zohoDesk.tutorialHome.bestPractices.items.item2 = "Log important information in the ticket";
    en.home.axes.zohoDesk.tutorialHome.bestPractices.items.item3 = "Attach evidence when necessary";
    en.home.axes.zohoDesk.tutorialHome.bestPractices.items.item4 = "Use the correct status for each stage";
    en.home.axes.zohoDesk.tutorialHome.bestPractices.items.item5 = "Close tickets with consistent history";
})();

(function () {
    const en = window.PLAYBOOK_I18N_LOCALES["en"];
    if (!en) return;

    en.kpi = en.kpi || {};
    en.kpi.main = en.kpi.main || {};
    en.kpi.main.meta = en.kpi.main.meta || {};
    en.kpi.main.header = en.kpi.main.header || {};
    en.kpi.main.opening = en.kpi.main.opening || {};
    en.kpi.main.nav = en.kpi.main.nav || {};
    en.kpi.main.dashboard = en.kpi.main.dashboard || {};
    en.kpi.main.pages = en.kpi.main.pages || {};
    en.kpi.main.usage = en.kpi.main.usage || {};
    en.kpi.main.readingAccess = en.kpi.main.readingAccess || {};
    en.kpi.main.footer = en.kpi.main.footer || {};
    en.kpi.reading = en.kpi.reading || {};
    en.kpi.reading.opening = en.kpi.reading.opening || {};
    en.kpi.reading.nav = en.kpi.reading.nav || {};
    en.kpi.reading.labels = en.kpi.reading.labels || {};
    en.kpi.reading.pages = en.kpi.reading.pages || {};
    en.kpi.reading.pages.executive = en.kpi.reading.pages.executive || {};
    en.kpi.reading.pages.executive.watch = en.kpi.reading.pages.executive.watch || {};
    en.kpi.reading.pages.executive.when = en.kpi.reading.pages.executive.when || {};
    en.kpi.reading.pages.dataGovernance = en.kpi.reading.pages.dataGovernance || {};
    en.kpi.reading.pages.dataGovernance.watch = en.kpi.reading.pages.dataGovernance.watch || {};
    en.kpi.reading.pages.dataGovernance.when = en.kpi.reading.pages.dataGovernance.when || {};
    en.kpi.reading.pages.agentManagement = en.kpi.reading.pages.agentManagement || {};
    en.kpi.reading.pages.agentManagement.watch = en.kpi.reading.pages.agentManagement.watch || {};
    en.kpi.reading.pages.agentManagement.when = en.kpi.reading.pages.agentManagement.when || {};
    en.kpi.reading.usage = en.kpi.reading.usage || {};
    en.kpi.reading.roles = en.kpi.reading.roles || {};
    en.kpi.reading.roles.manager = en.kpi.reading.roles.manager || {};
    en.kpi.reading.roles.coordinator = en.kpi.reading.roles.coordinator || {};
    en.kpi.reading.roles.operations = en.kpi.reading.roles.operations || {};
    en.kpi.reading.stage = en.kpi.reading.stage || {};
    en.kpi.reading.next = en.kpi.reading.next || {};
    en.kpi.reading.cta = en.kpi.reading.cta || {};
    en.kpi.legacy = en.kpi.legacy || {};
    en.kpi.legacy.meta = en.kpi.legacy.meta || {};
    en.kpi.legacy.notice = en.kpi.legacy.notice || {};

    en.kpi.main.meta.pageTitleDashboard = "Playbook Global - KPI Dashboard";
    en.kpi.main.meta.pageTitleReading = "Playbook Global - KPI Reading";
    en.kpi.main.header.brand = "KPI Dashboard";
    en.kpi.main.header.meta = "Global Service | KPI Module";
    en.kpi.main.header.contextLabel = "Context:";
    en.kpi.main.header.contextValue = "Global Service";
    en.kpi.main.header.mainNavAria = "KPI module main navigation";
    en.kpi.main.opening.breadcrumb = "Home > Global Service > KPI Dashboard";
    en.kpi.main.opening.eyebrow = "Global Service Governance";
    en.kpi.main.opening.moduleLabel = "Module: KPI Dashboard";
    en.kpi.main.opening.title = "KPI Dashboard";
    en.kpi.main.opening.description = "Follow the official KPI module dashboard and use guided reading to interpret the three executive pages.";
    en.kpi.main.opening.operationalContext = "Operational context: official entry point for executive and operational reading of global indicators.";
    en.kpi.main.nav.label = "Module internal navigation";
    en.kpi.main.nav.dashboard = "KPI Dashboard";
    en.kpi.main.nav.reading = "KPI Reading";
    en.kpi.main.dashboard.sectionTitle = "Official dashboard in 3 pages";
    en.kpi.main.dashboard.sectionDescription = "Use this sequence for quick global reading and operational drill-down.";
    en.kpi.main.dashboard.embedAria = "Embedded Power BI KPI Dashboard";
    en.kpi.main.dashboard.embedTitle = "Power BI - KPI Dashboard";
    en.kpi.main.pages.executive = en.kpi.main.pages.executive || {};
    en.kpi.main.pages.executive.title = "Global Executive View";
    en.kpi.main.pages.executive.description = "Macro health reading with Volume, SLA compliance, MTTS, MTFC, CSAT, and regional comparison.";
    en.kpi.main.pages.governance = en.kpi.main.pages.governance || {};
    en.kpi.main.pages.governance.title = "Data Governance";
    en.kpi.main.pages.governance.description = "Track data quality and completeness, required field completion, failed tickets, and operational risk.";
    en.kpi.main.pages.agents = en.kpi.main.pages.agents || {};
    en.kpi.main.pages.agents.title = "Agent Management";
    en.kpi.main.pages.agents.description = "Team operations reading with open/closed tickets, backlog, productivity, SLA/performance, and aging.";
    en.kpi.main.usage.title = "How to use the dashboard";
    en.kpi.main.usage.executive = "Use the executive page for global operations reading.";
    en.kpi.main.usage.governance = "Use data governance to monitor completeness and failures.";
    en.kpi.main.usage.agents = "Use agent management for team operational reading.";
    en.kpi.main.readingAccess.title = "Access detailed reading";
    en.kpi.main.readingAccess.description = "Open KPI Reading to follow the interpretation guide for the dashboard pages.";
    en.kpi.main.readingAccess.cta = "Open KPI Reading";
    en.kpi.main.footer.dashboard = "Playbook Global - KPI Dashboard";
    en.kpi.main.footer.reading = "Playbook Global - KPI Reading";

    en.kpi.reading.opening.breadcrumb = "Home > Global Service > KPI Reading";
    en.kpi.reading.opening.eyebrow = "Global Service Governance";
    en.kpi.reading.opening.moduleLabel = "Module: KPI Reading";
    en.kpi.reading.opening.title = "KPI Reading";
    en.kpi.reading.opening.description = "Short guide to understand what each BI page shows, what to watch, and when to use it.";
    en.kpi.reading.opening.operationalContext = "Operational context: fast interpretation of the 3 official dashboard pages.";

    en.kpi.reading.nav.label = "Module internal navigation";
    en.kpi.reading.nav.dashboard = "KPI Dashboard";
    en.kpi.reading.nav.reading = "KPI Reading";

    en.kpi.reading.labels.forWhat = "What it is for";
    en.kpi.reading.labels.watch = "What to watch";
    en.kpi.reading.labels.whenToUse = "When to use";

    en.kpi.reading.pages.title = "Reading the 3 official BI pages";
    en.kpi.reading.pages.description = "Use this order for quick reading: global view, data quality, and team management.";

    en.kpi.reading.pages.executive.order = "Page 1";
    en.kpi.reading.pages.executive.title = "Global Executive View";
    en.kpi.reading.pages.executive.forWhat = "Macro reading of overall operations health.";
    en.kpi.reading.pages.executive.watch.totalTickets = "Total Tickets";
    en.kpi.reading.pages.executive.watch.slaCompliance = "SLA Compliance";
    en.kpi.reading.pages.executive.watch.mtts = "MTTS";
    en.kpi.reading.pages.executive.watch.mtfc = "MTFC";
    en.kpi.reading.pages.executive.watch.csat = "CSAT";
    en.kpi.reading.pages.executive.watch.regionalComparison = "Regional comparison";
    en.kpi.reading.pages.executive.when.executiveReading = "Executive reading";
    en.kpi.reading.pages.executive.when.regionalComparison = "Cross-region comparison";
    en.kpi.reading.pages.executive.when.globalTracking = "Global operations tracking";

    en.kpi.reading.pages.dataGovernance.order = "Page 2";
    en.kpi.reading.pages.dataGovernance.title = "Data Governance";
    en.kpi.reading.pages.dataGovernance.forWhat = "Track base quality and completeness.";
    en.kpi.reading.pages.dataGovernance.watch.requiredCompletion = "Mandatory field completion";
    en.kpi.reading.pages.dataGovernance.watch.failedTickets = "Tickets with failures";
    en.kpi.reading.pages.dataGovernance.watch.operationalRisk = "Tickets with operational risk";
    en.kpi.reading.pages.dataGovernance.watch.fieldQuality = "Field-level quality";
    en.kpi.reading.pages.dataGovernance.watch.regionQuality = "Region-level quality";
    en.kpi.reading.pages.dataGovernance.when.qualityReview = "Data quality review";
    en.kpi.reading.pages.dataGovernance.when.audit = "Fill-in audit";
    en.kpi.reading.pages.dataGovernance.when.processCorrection = "Process correction";

    en.kpi.reading.pages.agentManagement.order = "Page 3";
    en.kpi.reading.pages.agentManagement.title = "Agent Management";
    en.kpi.reading.pages.agentManagement.forWhat = "Track team productivity and operations.";
    en.kpi.reading.pages.agentManagement.watch.openClosed = "Open/closed tickets";
    en.kpi.reading.pages.agentManagement.watch.currentBacklog = "Current backlog";
    en.kpi.reading.pages.agentManagement.watch.statusBacklog = "Backlog by status";
    en.kpi.reading.pages.agentManagement.watch.productivity = "Productivity";
    en.kpi.reading.pages.agentManagement.watch.slaPerformance = "SLA/performance";
    en.kpi.reading.pages.agentManagement.watch.agingRisk = "aging/risk";
    en.kpi.reading.pages.agentManagement.watch.detailTable = "Detailed table";
    en.kpi.reading.pages.agentManagement.when.operationRoutine = "Operational routine";
    en.kpi.reading.pages.agentManagement.when.teamFollowUp = "Team follow-up";
    en.kpi.reading.pages.agentManagement.when.queueManagement = "Queue management";

    en.kpi.reading.usage.title = "How to use the BI";
    en.kpi.reading.usage.page1 = "Page 1 = global operations view.";
    en.kpi.reading.usage.page2 = "Page 2 = data quality and completeness.";
    en.kpi.reading.usage.page3 = "Page 3 = team operational management.";

    en.kpi.reading.roles.title = "Quick reading by role";
    en.kpi.reading.roles.manager.label = "Manager";
    en.kpi.reading.roles.manager.description = "Global executive view.";
    en.kpi.reading.roles.coordinator.label = "Coordinator";
    en.kpi.reading.roles.coordinator.description = "Data governance + agent management.";
    en.kpi.reading.roles.operations.label = "Operations/local leadership";
    en.kpi.reading.roles.operations.description = "Agent management + backlog/status.";

    en.kpi.reading.stage.title = "KPI Reading";
    en.kpi.reading.stage.description = "The official reading page is active with practical guidance for the 3 BI pages.";
    en.kpi.reading.next.title = "Official dashboard sequence";
    en.kpi.reading.next.executive = "Global Executive View: macro reading with Total Tickets, SLA Compliance, MTTS, MTFC, and CSAT.";
    en.kpi.reading.next.governance = "Data Governance: mandatory completion, failures, and operational risk.";
    en.kpi.reading.next.agents = "Agent Management: productivity, backlog, SLA/performance, and aging.";
    en.kpi.reading.cta.dashboard = "Go to KPI Dashboard";

    en.kpi.legacy.meta.pageTitle = "Playbook Global - KPI Dashboard (Legacy URL)";
    en.kpi.legacy.notice.tag = "Compatibility URL";
    en.kpi.legacy.notice.title = "This page was consolidated into the official KPI Dashboard";
    en.kpi.legacy.notice.description = "Use the official home for embedded Power BI and use KPI Reading for interpretation guidance.";
    en.kpi.legacy.notice.ctaDashboard = "Go to KPI Dashboard";
    en.kpi.legacy.notice.ctaReading = "Go to KPI Reading";
    en.kpi.legacy.footer = "Playbook Global - KPI Dashboard (Legacy URL)";
})();

(function () {
    const en = window.PLAYBOOK_I18N_LOCALES["en"];
    if (!en) return;

    en.camposObrigatorios = en.camposObrigatorios || {};
    en.camposObrigatorios.home = en.camposObrigatorios.home || {};

    en.camposObrigatorios.home.opening = en.camposObrigatorios.home.opening || {};
    en.camposObrigatorios.home.opening.pageTitle = "Playbook Global - Mandatory Fields";
    en.camposObrigatorios.home.opening.breadcrumb = "Home > Global Service > Mandatory Fields";
    en.camposObrigatorios.home.opening.moduleLabel = "Module: Mandatory Fields";
    en.camposObrigatorios.home.opening.title = "Mandatory Fields";
    en.camposObrigatorios.home.opening.description = "Executive reading of the fields that sustain correct ticket opening, flow, priority, SLA, KPI, and data quality.";
    en.camposObrigatorios.home.opening.operationalContext = "Operational context: minimum standard for ticket opening, follow-up, and quality.";

    en.camposObrigatorios.home.nav = en.camposObrigatorios.home.nav || {};
    en.camposObrigatorios.home.nav.label = "Module internal navigation";
    en.camposObrigatorios.home.nav.fields = "Mandatory Fields";
    en.camposObrigatorios.home.nav.matrix = "Consolidated Matrix";

    en.camposObrigatorios.home.visual = en.camposObrigatorios.home.visual || {};
    en.camposObrigatorios.home.visual.eyebrow = "Mandatory Fields Map";
    en.camposObrigatorios.home.visual.title = "Ticket Fields Map";
    en.camposObrigatorios.home.visual.description = "Single view of the 4 official groups for fast operational reading.";
    en.camposObrigatorios.home.visual.impactLabel = "Direct impact on";
    en.camposObrigatorios.home.visual.matrixCta = "Open Consolidated Matrix";
    en.camposObrigatorios.home.visual.impact = en.camposObrigatorios.home.visual.impact || {};
    en.camposObrigatorios.home.visual.impact.dataQuality = "Data quality";
    en.camposObrigatorios.home.visual.impact.flow = "Flow";
    en.camposObrigatorios.home.visual.impact.priority = "Priority";
    en.camposObrigatorios.home.visual.impact.sla = "SLA";
    en.camposObrigatorios.home.visual.impact.kpi = "KPI";
    en.camposObrigatorios.home.visual.impact.audit = "Audit";

    en.camposObrigatorios.home.groups = en.camposObrigatorios.home.groups || {};

    en.camposObrigatorios.home.groups.mandatory = en.camposObrigatorios.home.groups.mandatory || {};
    en.camposObrigatorios.home.groups.mandatory.tag = "Mandatory";
    en.camposObrigatorios.home.groups.mandatory.title = "Main mandatory fields";
    en.camposObrigatorios.home.groups.mandatory.definition = "Minimum base to open and qualify the ticket without rework.";
    en.camposObrigatorios.home.groups.mandatory.ticketLabel = "Ticket - opening";
    en.camposObrigatorios.home.groups.mandatory.ticket = en.camposObrigatorios.home.groups.mandatory.ticket || {};
    en.camposObrigatorios.home.groups.mandatory.ticket.requesterName = "Requester/customer name";
    en.camposObrigatorios.home.groups.mandatory.ticket.email = "Email";
    en.camposObrigatorios.home.groups.mandatory.ticket.phone = "Phone";
    en.camposObrigatorios.home.groups.mandatory.ticket.requester = "Requester";
    en.camposObrigatorios.home.groups.mandatory.ticket.serviceType = "Service type";
    en.camposObrigatorios.home.groups.mandatory.ticket.category = "Category";
    en.camposObrigatorios.home.groups.mandatory.ticket.product = "Product";
    en.camposObrigatorios.home.groups.mandatory.ticket.productBrand = "Product brand";
    en.camposObrigatorios.home.groups.mandatory.ticket.serialNumber = "Equipment serial number, with contextual exception";
    en.camposObrigatorios.home.groups.mandatory.ticket.subject = "Subject";
    en.camposObrigatorios.home.groups.mandatory.ticket.description = "Description";
    en.camposObrigatorios.home.groups.mandatory.contactLabel = "Contact/Customer";
    en.camposObrigatorios.home.groups.mandatory.contact = en.camposObrigatorios.home.groups.mandatory.contact || {};
    en.camposObrigatorios.home.groups.mandatory.contact.firstName = "First name";
    en.camposObrigatorios.home.groups.mandatory.contact.lastName = "Last name";
    en.camposObrigatorios.home.groups.mandatory.contact.accountName = "Account name";
    en.camposObrigatorios.home.groups.mandatory.contact.email = "Email";
    en.camposObrigatorios.home.groups.mandatory.contact.phoneMobile = "Phone/Mobile";

    en.camposObrigatorios.home.groups.conditional = en.camposObrigatorios.home.groups.conditional || {};
    en.camposObrigatorios.home.groups.conditional.tag = "Conditional";
    en.camposObrigatorios.home.groups.conditional.title = "Conditional";
    en.camposObrigatorios.home.groups.conditional.definition = "Mandatory only when regional or requester context requires it.";
    en.camposObrigatorios.home.groups.conditional.stateBrazil = "State: mandatory only for Brazil";
    en.camposObrigatorios.home.groups.conditional.provinceArgentina = "Province: mandatory only for Argentina";
    en.camposObrigatorios.home.groups.conditional.assistanceDistributor = "Service partner/distributor name: mandatory for Assistance / Distributor";

    en.camposObrigatorios.home.groups.automatic = en.camposObrigatorios.home.groups.automatic || {};
    en.camposObrigatorios.home.groups.automatic.tag = "Automatic";
    en.camposObrigatorios.home.groups.automatic.title = "Automatic/system fields";
    en.camposObrigatorios.home.groups.automatic.definition = "System-filled data updated across the full ticket journey.";
    en.camposObrigatorios.home.groups.automatic.ticketId = "Ticket ID";
    en.camposObrigatorios.home.groups.automatic.openingDate = "Opening date";
    en.camposObrigatorios.home.groups.automatic.channel = "Channel";
    en.camposObrigatorios.home.groups.automatic.owner = "Ticket owner";
    en.camposObrigatorios.home.groups.automatic.status = "Status";
    en.camposObrigatorios.home.groups.automatic.priority = "Priority, calculated by the matrix";
    en.camposObrigatorios.home.groups.automatic.slaFirstResponse = "First response SLA";
    en.camposObrigatorios.home.groups.automatic.slaResolution = "Resolution SLA";
    en.camposObrigatorios.home.groups.automatic.slaIndicators = "SLA times and indicators";

    en.camposObrigatorios.home.groups.recommended = en.camposObrigatorios.home.groups.recommended || {};
    en.camposObrigatorios.home.groups.recommended.tag = "Recommended";
    en.camposObrigatorios.home.groups.recommended.title = "Official recommended fields";
    en.camposObrigatorios.home.groups.recommended.definition = "They do not block opening, but improve operational reading quality.";
    en.camposObrigatorios.home.groups.recommended.country = "Country";
    en.camposObrigatorios.home.groups.recommended.zeroHour = "Zero hour / Out of the box";
    en.camposObrigatorios.home.groups.recommended.needsPart = "Needs part";
    en.camposObrigatorios.home.groups.recommended.partnerDistributor = "Partner/distributor, when not mandatory";
    en.camposObrigatorios.home.groups.recommended.racSent = "RAC Sent? - Yes/No";
    en.camposObrigatorios.home.groups.recommended.assistanceType = "Technical assistance type";
    en.camposObrigatorios.home.groups.recommended.closingReason = "Closing reason";
    en.camposObrigatorios.home.groups.recommended.solutionMode = "On-site/remote solution";
    en.camposObrigatorios.home.groups.recommended.usedPart = "Used part";
    en.camposObrigatorios.home.groups.recommended.finalPartsQty = "Final parts quantity";

    en.camposObrigatorios.home.note = en.camposObrigatorios.home.note || {};
    en.camposObrigatorios.home.note.excludedOfficial = "Not part of the official recommended list in this phase: actions executed, parts quantity, requested part, part code, part dates/status, order number, probable cause, and expected customer return date.";

    en.camposObrigatorios.home.rules = en.camposObrigatorios.home.rules || {};
    en.camposObrigatorios.home.rules.title = "Critical rules";
    en.camposObrigatorios.home.rules.serialException = "Serial number is mandatory, with contextual exception.";
    en.camposObrigatorios.home.rules.stateBrazil = "State only for Brazil.";
    en.camposObrigatorios.home.rules.provinceArgentina = "Province only for Argentina.";
    en.camposObrigatorios.home.rules.assistanceDistributor = "Service partner/distributor name only when applicable.";
    en.camposObrigatorios.home.rules.priorityCalculated = "Priority is mandatory and calculated by the matrix.";
    en.camposObrigatorios.home.rules.zeroHourImpact = "Zero hour / Out of the box is recommended, but impacts priority.";

    en.camposObrigatorios.home.usage = en.camposObrigatorios.home.usage || {};
    en.camposObrigatorios.home.usage.title = "How to use this module";
    en.camposObrigatorios.home.usage.homeRule = "Use the home page to understand the rule.";
    en.camposObrigatorios.home.usage.matrixDetails = "Use the Consolidated Matrix for full details.";
    en.camposObrigatorios.home.usage.coordinators = "Coordinators should use the matrix to enforce completeness.";
    en.camposObrigatorios.home.usage.agents = "Agents should use it as reference for correct field completion.";

    en.kanban = en.kanban || {};
    en.kanban.main = en.kanban.main || {};

    en.kanban.main.header = en.kanban.main.header || {};
    en.kanban.main.header.title = "02 - Global Kanban";
    en.kanban.main.header.subtitle = "Fast visual reading of tickets by official status";
    en.kanban.main.footer = "Playbook Global - Module 02 Kanban";

    en.kanban.main.opening = en.kanban.main.opening || {};
    en.kanban.main.opening.pageTitle = "Playbook Global - Global Kanban";
    en.kanban.main.opening.breadcrumb = "Home > Global Service > Global Kanban";
    en.kanban.main.opening.moduleLabel = "Module: Global Kanban";
    en.kanban.main.opening.title = "Global Kanban";
    en.kanban.main.opening.description = "Single-page visual reading of the flow: official statuses, essential transitions, operational bottlenecks, and mistakes that distort backlog and aging.";
    en.kanban.main.opening.operationalContext = "Operational context: quick reading to place tickets in the correct status and expose the real queue.";

    en.kanban.main.nav = en.kanban.main.nav || {};
    en.kanban.main.nav.label = "Module internal navigation";
    en.kanban.main.nav.board = "Kanban Board";
    en.kanban.main.nav.transitions = "Transitions";
    en.kanban.main.nav.operations = "Operational Reading";
    en.kanban.main.nav.mistakes = "Common Mistakes";

    en.kanban.main.board = en.kanban.main.board || {};
    en.kanban.main.board.kicker = "Official operational board";
    en.kanban.main.board.title = "Kanban Board with the 7 official statuses";
    en.kanban.main.board.description = "Each column shows only what matters to quickly decide where the ticket should be.";
    en.kanban.main.board.goalLabel = "Purpose";
    en.kanban.main.board.whenLabel = "When to use";

    en.kanban.main.statuses = en.kanban.main.statuses || {};
    en.kanban.main.statuses.open = {
        name: "Open",
        purpose: "Register and qualify the ticket to start handling.",
        when: "When the ticket has just entered and technical action has not started yet."
    };
    en.kanban.main.statuses.inProgress = {
        name: "In Progress",
        purpose: "Run active technical analysis and execution.",
        when: "When the team is directly working on the ticket."
    };
    en.kanban.main.statuses.waitingCustomer = {
        name: "Waiting for Customer",
        purpose: "Wait for customer response or action to move forward.",
        when: "When the next step objectively depends on the customer."
    };
    en.kanban.main.statuses.waitingParts = {
        name: "Waiting for Parts",
        purpose: "Wait for parts, materials, or logistics to continue.",
        when: "When execution depends on a physical item to proceed."
    };
    en.kanban.main.statuses.waitingThirdParty = {
        name: "Waiting for Third Party / Technical Visit",
        purpose: "Wait for third-party work or technical visit execution.",
        when: "When the ticket depends on technical assistance or a third party, internal or external."
    };
    en.kanban.main.statuses.resolved = {
        name: "Resolved",
        purpose: "Record that the solution was applied before final closure.",
        when: "When handling is complete but final closure validation is still pending."
    };
    en.kanban.main.statuses.closed = {
        name: "Closed",
        purpose: "Formalize final ticket closure.",
        when: "When the ticket has already passed through Resolved and has no pending action."
    };

    en.kanban.main.transitions = en.kanban.main.transitions || {};
    en.kanban.main.transitions.title = "Transitions";
    en.kanban.main.transitions.description = "Base logic for moving tickets through the Kanban.";
    en.kanban.main.transitions.entryFlow = "Entry -> Open -> In Progress";
    en.kanban.main.transitions.branchLabel = "From In Progress, the ticket can move to:";
    en.kanban.main.transitions.branchCustomer = "Waiting for Customer";
    en.kanban.main.transitions.branchParts = "Waiting for Parts";
    en.kanban.main.transitions.branchThirdParty = "Waiting for Third Party / Technical Visit";
    en.kanban.main.transitions.branchResolved = "Resolved";
    en.kanban.main.transitions.finalFlow = "Resolved -> Closed";
    en.kanban.main.transitions.notes = en.kanban.main.transitions.notes || {};
    en.kanban.main.transitions.notes.resolveNotClose = "Resolving is not closing.";
    en.kanban.main.transitions.notes.waitingMustBeReal = "Stopped tickets must move to the correct waiting status.";
    en.kanban.main.transitions.notes.waitingReflectsDependency = "Waiting statuses must reflect real dependency.";

    en.kanban.main.operations = en.kanban.main.operations || {};
    en.kanban.main.operations.title = "Operational Reading";
    en.kanban.main.operations.backlog = "Backlog is not only volume: it also means stuck or misclassified tickets.";
    en.kanban.main.operations.aging = "Aging gets worse when tickets stay in the wrong status.";
    en.kanban.main.operations.bottlenecks = "The Kanban board makes Bottlenecks and dependencies visible.";
    en.kanban.main.operations.flowAndSla = "Correct status usage improves flow, SLA, and operational reading.";

    en.kanban.main.mistakes = en.kanban.main.mistakes || {};
    en.kanban.main.mistakes.title = "Common Mistakes";
    en.kanban.main.mistakes.waitingCustomer = "Do not keep tickets In Progress when they are Waiting for Customer.";
    en.kanban.main.mistakes.waitingParts = "Do not keep tickets In Progress when they are Waiting for Parts.";
    en.kanban.main.mistakes.maskQueue = "Do not use the wrong status to hide queue volume.";
    en.kanban.main.mistakes.skipResolved = "Do not close tickets directly without passing through Resolved.";
    en.kanban.main.mistakes.realStatus = "The status must reflect the real ticket situation.";

    en.security = en.security || {};
    en.security.auth = {
        metaTitle: "Global Playbook - Secure access",
        kicker: "New security layer",
        heroTitle: "Protected Global Playbook",
        heroText: "Sign in with an approved account to access project content, indicators, and materials.",
        securityNotice: "This feature protects internal Playbook information. New registrations require email confirmation and administrative approval.",
        benefits: {
            approved: "Access restricted to approved accounts",
            protected: "Protected content and indicators",
            governed: "Centralized user governance"
        },
        accountLabel: "Corporate account",
        adminAccountLabel: "Default administrator account",
        secureFooter: "Protected authentication and encrypted session",
        title: "Access your account",
        subtitle: "Use email and password. New registrations require email confirmation and administrative approval.",
        tabs: {
            login: "Sign in",
            register: "Register",
            reset: "Recover"
        },
        email: "Email",
        password: "Password",
        newPassword: "New password",
        confirmPassword: "Confirm password",
        emailHint: "Use your approved corporate email.",
        registerEmailHint: "After registering, confirm the email you receive and wait for administrative approval.",
        loginPasswordHint: "Passwords are case-sensitive.",
        passwordHint: "Use 12 or more characters with uppercase, lowercase, number, and symbol.",
        passwordRules: {
            length: "12 or more characters",
            upper: "One uppercase letter",
            lower: "One lowercase letter",
            number: "One number",
            symbol: "One symbol"
        },
        resetHint: "For security, the response does not confirm whether the email is registered.",
        actions: {
            login: "Sign in",
            forgot: "Forgot my password",
            register: "Request registration",
            reset: "Send recovery",
            changePassword: "Change password",
            showPassword: "Show",
            hidePassword: "Hide",
            backToLogin: "Back to sign in"
        }
    };
    en.security.admin = {
        metaTitle: "Playbook Administration",
        headerTitle: "Playbook Administration",
        headerSubtitle: "Access approval and governance",
        backToPlaybook: "Back to Playbook",
        kicker: "Access control",
        title: "Playbook Administration",
        description: "List users, search registrations, and change approval status with Supabase audit history.",
        searchLabel: "Search by email",
        searchPlaceholder: "name@company.com",
        statusLabel: "Status",
        loading: "Loading users...",
        empty: "No users found.",
        status: {
            all: "All",
            pending: "Pending",
            approved: "Approved",
            rejected: "Rejected",
            suspended: "Suspended"
        },
        actions: {
            filter: "Apply filters",
            makeAdmin: "Make admin",
            removeAdmin: "Remove admin"
        },
        roles: {
            admin: "Admin",
            user: "User"
        },
        confirmMakeAdmin: "Confirm promoting this user to administrator?",
        confirmRemoveAdmin: "Confirm removing this user's administrator profile?",
        roleChanged: "Profile updated successfully.",
        table: {
            email: "Email",
            createdAt: "Registered",
            status: "Status",
            role: "Role",
            updatedAt: "Last change",
            actions: "Actions"
        }
    };
    en.security.messages = {
        invalidCredentials: "Invalid email or password.",
        pending: "Your registration is pending administrative approval.",
        rejected: "Your registration was rejected. Contact the Playbook administrator.",
        suspended: "Your access is suspended. Contact the Playbook administrator.",
        profileMissing: "Playbook profile not found. Contact the administrator.",
        signingIn: "Validating access...",
        loginTakingLong: "Validation is taking longer than usual. We are still trying to connect to Supabase...",
        authClientTimeout: "Authentication could not be loaded in time.",
        loginTimeout: "Validation took too long. Reload the page and try again.",
        profileValidationTimeout: "Sign-in succeeded, but profile validation took too long. Reload the page.",
        authUnavailable: "Authentication could not be loaded. Check your connection and reload the page.",
        loginSuccess: "Signed in. Redirecting...",
        emailNotConfirmed: "Confirm the email sent by Supabase and wait for administrative approval before signing in.",
        registerSuccess: "Registration submitted. Confirm the email you received and wait for administrative approval before accessing the Playbook.",
        resetSuccess: "If the email is registered, recovery instructions will be sent.",
        passwordChanged: "Password changed successfully. Sign in again with the new password.",
        forcePasswordChange: "Change the initial password before accessing the Playbook.",
        passwordMismatch: "Password confirmation does not match.",
        passwordWeak: "Use 12 or more characters, including uppercase, lowercase, number, and symbol.",
        registerError: "Registration could not be completed now. Try again later.",
        resetError: "The request could not be processed now. Try again later.",
        passwordChangeError: "The password could not be changed now. Request a new link or try again.",
        emailInvalid: "Enter a valid email address.",
        sessionMissing: "Sign in to access the Playbook.",
        adminRequired: "Only approved administrators can access this page.",
        logout: "Sign out",
        admin: "Administration",
        loadingUsers: "Loading users...",
        emptyUsers: "No users found.",
        confirmStatus: "Confirm status change to {status}?",
        statusChanged: "Status updated successfully."
    };
})();

