window.PLAYBOOK_I18N_LOCALES = window.PLAYBOOK_I18N_LOCALES || {};

(function () {
    const base = window.PLAYBOOK_I18N_LOCALES["pt-BR"] || {};
    const es = JSON.parse(JSON.stringify(base));

    es.common.buttons.backToPlaybook = "Volver al Playbook";
    es.common.buttons.viewGlobalServiceEpic = "Ver epico Global Service";
    es.common.buttons.viewZohoDeskEpic = "Ver epico Zoho Desk";
    es.common.buttons.openPage = "Abrir pagina";
    es.common.buttons.open = "Abrir";
    es.common.buttons.view = "Ver";
    es.common.buttons.start = "Iniciar";
    es.common.buttons.nextPage = "Pagina siguiente";
    es.common.buttons.previousPage = "Pagina anterior";
    es.common.buttons.backToModuleHome = "Volver al inicio del modulo";
    es.common.labels.playbookGlobal = "Playbook Global";
    es.common.labels.epicGlobalService = "Epico Global Service";
    es.common.labels.epicZohoDesk = "Epico Zoho Desk";
    es.common.contexts.globalServiceModule = "Este modulo pertenece al epico Global Service.";
    es.common.contexts.zohoDeskModule = "Este modulo pertenece al epico Zoho Desk.";
    es.common.ux = es.common.ux || {};
    es.common.ux.pageNavigation = "Navegación de esta página";
    es.common.ux.nextAction = es.common.ux.nextAction || {};
    es.common.ux.nextAction.title = "Próxima acción";
    es.common.ux.nextAction.description = "Continúa con el siguiente paso recomendado.";
    es.common.ux.related = es.common.ux.related || {};
    es.common.ux.related.title = "Páginas relacionadas";
    es.common.language.selectorLabel = "Idioma";
    es.common.language.selectorAriaLabel = "Seleccionar idioma de la interfaz";
    es.common.language.selectorTitle = "Cambiar idioma";

    es.navigation.main.home = "Inicio";
    es.navigation.main.globalService = "Global Service";
    es.navigation.main.zohoDesk = "Zoho Desk";
    es.navigation.main.executiveBi = "BI Ejecutivo";

    es.home.title = "Playbook Global - Inicio";
    es.home.header.subtitle = "Portal Operativo de Global Service Governance";
    es.home.header.menuAria = "Abrir menu principal";
    es.home.header.ctaBi = "Acceder al BI";
    es.home.navigation.executiveBi = "BI Ejecutivo";
    es.home.hero.kicker = "Hub Operativo Global";
    es.home.hero.mainTitle = "Estandarice la atención global y haga de nuestro cliente el héroe";
    es.home.hero.mainSubtitle = "Elija su eje de trabajo y siga rutas claras para operar con consistencia global.";
    es.home.hero.ctaBi = "Acceder al BI";
    es.home.hero.ctaModules = "Ver ejes y modulos";
    es.home.hero.subtitle = "Arquitectura con dos pilares complementarios para estandarizacion global";
    es.home.hero.description = "El Playbook Global pasa a organizarse en dos modulos epicos: Global Service, que consolida el modelo operativo y gerencial de atencion, y Zoho Desk, que consolida la estandarizacion de configuracion y operacion del sistema.";
    es.home.hero.globalServiceCta = "Explorar Global Service";
    es.home.hero.zohoDeskCta = "Explorar Zoho Desk";
    es.home.sections.epicsTitle = "Dos epicos, una gobernanza integrada";
    es.home.sections.epicsDescription = "Global Service define el estandar global de atencion al cliente. Zoho Desk define el estandar de configuracion funcional y operacion del sistema. La evolucion futura ocurre sobre esta arquitectura.";
    es.home.epics.globalService.kicker = "EPICO 1";
    es.home.epics.globalService.title = "GLOBAL SERVICE";
    es.home.epics.globalService.description = "Estandarizacion global de la atencion al cliente con foco en modelo operativo, consistencia de ejecucion y lectura gerencial.";
    es.home.epics.zohoDesk.kicker = "EPICO 2";
    es.home.epics.zohoDesk.title = "ZOHO DESK";
    es.home.epics.zohoDesk.description = "Estandarizacion de configuracion y operacion del sistema, con ruta activa de entrenamiento y espacio estructurado para nuevos modulos de evolucion.";
    es.home.quickAccess.title = "Empieza aqui";
    es.home.quickAccess.subtitle = "Nuevo en la plataforma? Inicia por el Tutorial Zoho. Para gestion, ve directo al BI Ejecutivo.";
    es.home.quickAccess.items.bi.pill = "Prioridad";
    es.home.quickAccess.items.bi.title = "BI Ejecutivo";
    es.home.quickAccess.items.bi.desc = "Monitorea indicadores, desempeno y riesgos operativos.";
    es.home.quickAccess.items.tutorial.pill = "Onboarding";
    es.home.quickAccess.items.tutorial.title = "Nuevo aqui? Tutorial Zoho";
    es.home.quickAccess.items.tutorial.desc = "Aprende el uso del sistema y la rutina operativa paso a paso.";
    es.home.quickAccess.items.globalService.pill = "Gobernanza";
    es.home.quickAccess.items.globalService.title = "Global Service";
    es.home.quickAccess.items.globalService.desc = "Consulta estandares globales, reglas operativas y gobernanza.";
    es.home.quickAccess.items.zohoDesk.pill = "Plataforma";
    es.home.quickAccess.items.zohoDesk.title = "Zoho Desk";
    es.home.quickAccess.items.zohoDesk.desc = "Accede a orientaciones de uso, configuracion y operacion practica.";
    es.home.axes.title = "Global Service y Zoho Desk: elige el eje correcto para tu necesidad";
    es.home.axes.subtitle = "Global Service define estandares de gobernanza de atencion. Zoho Desk orienta el uso y la operacion practica de la plataforma.";
    es.home.axes.modulesTitle = "Modulos del eje";
    es.home.axes.globalService.badge = "Global Service";
    es.home.axes.globalService.title = "Global Service | Gobernanza de Atencion";
    es.home.axes.globalService.desc = "Directrices globales para estandarizar operacion, controles y lectura gerencial.";
    es.home.axes.globalService.cta = "Entrar en Global Service";
    es.home.axes.globalService.items.priority = "Prioridad, criticidad y colas";
    es.home.axes.globalService.items.requiredFields = "Campos obligatorios y calidad del registro";
    es.home.axes.globalService.items.channels = "Canales de entrada y reglas de gobernanza";
    es.home.axes.globalService.items.kpis = "KPIs, desempeno y lectura operativa";
    es.home.axes.zohoDesk.badge = "Zoho Desk";
    es.home.axes.zohoDesk.title = "Zoho Desk | Operacion de Plataforma";
    es.home.axes.zohoDesk.desc = "Orientaciones practicas para usar, configurar y operar Zoho Desk con consistencia.";
    es.home.axes.zohoDesk.cta = "Entrar en Zoho Desk";
    es.home.axes.zohoDesk.items.tutorial = "Onboarding y tutorial guiado";
    es.home.axes.zohoDesk.items.config = "Configuracion funcional y layouts";
    es.home.axes.zohoDesk.items.rules = "Reglas operativas y automatizaciones";
    es.home.axes.zohoDesk.items.operation = "Ejecucion diaria en la herramienta";
    es.home.value.title = "Lo que entrega este portal";
    es.home.value.items.standards.title = "Estandar global oficial";
    es.home.value.items.standards.desc = "Una referencia unica para politicas, reglas y gobernanza de atencion.";
    es.home.value.items.zoho.title = "Operacion en Zoho Desk";
    es.home.value.items.zoho.desc = "Guia objetiva para ejecutar el proceso dentro de la plataforma.";
    es.home.value.items.bi.title = "BI e indicadores";
    es.home.value.items.bi.desc = "Visibilidad rapida para seguimiento de desempeno y decisiones.";
    es.home.value.items.onboarding.title = "Onboarding e implantacion regional";
    es.home.value.items.onboarding.desc = "Base de apoyo para nuevos colaboradores, key users y nuevas regiones.";
    es.home.footer.support = "Base oficial para gobernanza global, operacion en Zoho Desk e implantacion regional.";
    es.home.labels.available = "Disponible";
    es.home.labels.comingSoon = "Proximamente";
    es.home.labels.plannedModule = "Modulo planificado";

    es.home.moduleCtas.fluxo = "Abrir flujo global";
    es.home.moduleCtas.matriz = "Abrir matriz de prioridad";
    es.home.moduleCtas.campos = "Abrir campos obligatorios";
    es.home.moduleCtas.kanban = "Abrir kanban global";
    es.home.moduleCtas.operacao_zoho = "Iniciar tutorial Zoho";
    es.home.moduleCtas.governanca = "Abrir gobernanza global";
    es.home.moduleCtas.kpi = "Abrir KPIs globales";
    es.home.moduleCtas.canais_entrada = "Abrir canales de entrada";
    es.home.moduleCtas.fallback = "Acceder al modulo";
    es.home.moduleCtas.fallbackDashboard = "Abrir dashboard";
    es.home.moduleCtas.fallbackMap = "Abrir mapa";
    es.home.moduleCtas.fallbackGeneric = "Abrir modulo";

    es.home.modules.kpi.title = "KPIs Globales";
    es.home.modules.kpi.description = "Lectura ejecutiva de desempeno, SLA, backlog, aging y calidad operativa.";
    es.home.modules.kanban.title = "Kanban Global";
    es.home.modules.kanban.description = "Capa operativa del flujo con estados, ownership y disciplina de movimiento.";
    es.home.modules.campos.title = "Campos Obligatorios";
    es.home.modules.campos.description = "Modelo global de campos obligatorios, deseables y automaticos del ticket.";
    es.home.modules.fluxo.title = "Flujo Global";
    es.home.modules.fluxo.description = "Define el flujo global de atencion, responsabilidades, campos, SLAs y reglas operativas. Este modulo es la base de la gobernanza global de atencion.";
    es.home.modules.matriz.title = "Matriz de Prioridad";
    es.home.modules.matriz.description = "Regla global de criticidad para ordenar cola, riesgo y urgencia de atencion.";
    es.home.modules.governanca.title = "Gobernanza Global";
    es.home.modules.governanca.description = "Rituales, responsabilidades, auditoria y control de la consistencia operativa.";
    es.home.modules.operacao_zoho.title = "Operacion diaria en Zoho Desk";
    es.home.modules.operacao_zoho.description = "Tutorial operativo complementario para uso diario de Zoho Desk con disciplina de registro.";
    es.home.modules.canais_entrada.title = "Canales de Entrada";
    es.home.modules.canais_entrada.description = "Estandar minimo de apertura por telefono, WhatsApp, formulario y correo electronico.";
    es.home.modules.automacoes.title = "Automatizaciones";
    es.home.modules.automacoes.description = "Ruta de automatizaciones para estandarizar la ejecucion operativa con menor variacion manual.";
    es.home.modules.round_robin.title = "Round Robin y Distribucion";
    es.home.modules.round_robin.description = "Estandar futuro de distribucion de tickets para balanceo de carga y ownership.";
    es.home.modules.regras_layout.title = "Reglas de Layout";
    es.home.modules.regras_layout.description = "Estandar de layout y campos del sistema para garantizar consistencia entre equipos y regiones.";
    es.home.modules.evolucao_zoho.title = "Evolucion Funcional Zoho Desk";
    es.home.modules.evolucao_zoho.description = "Espacio reservado para proximos modulos de configuracion funcional del sistema.";

    es.kpi.title = "Playbook Global - KPIs Globales";
    es.kpi.index.header.title = "KPIs Globales";
    es.kpi.index.header.subtitle = "Lectura gerencial de desempeno, SLA, backlog y calidad operativa";
    es.kpi.index.header.openArchitecture = "Abrir arquitectura de KPIs";
    es.kpi.v1.header.brand = "GLOBAL SERVICE GOVERNANCE";
    es.kpi.v1.header.architecture = "Arquitectura";
    es.kpi.v1.header.dashboard = "Dashboard";
    es.kpi.v1.header.expandedMap = "Mapa ampliado";

    es.prioridade.title = "Playbook Global - Matriz de Prioridad";
    es.prioridade.index.header.title = "Matriz de Prioridad";
    es.prioridade.index.header.subtitle = "Clasificacion global de criticidad para orden operativa y toma de decisiones";
    es.prioridade.index.footer = "Playbook Global - Matriz de Prioridad";
    es.prioridade.data.messages.fillAllFieldsPrefix = "Complete todos los campos para calcular la prioridad. Faltan: ";
    es.prioridade.data.messages.simulationSuccess = "Simulacion calculada con exito.";
    es.prioridade.data.matrixConfig.campos.solicitante.label = "Solicitante";
    es.prioridade.data.matrixConfig.campos.solicitante.opcoes.assistencia_distribuidor.label = "Asistencia / Distribuidor";
    es.prioridade.data.matrixConfig.campos.solicitante.opcoes.cliente.label = "Cliente";
    es.prioridade.data.matrixConfig.campos.solicitante.opcoes.cliente_locacao.label = "Cliente de alquiler";
    es.prioridade.data.matrixConfig.campos.tipo_atendimento.label = "Tipo de atencion";
    es.prioridade.data.matrixConfig.campos.tipo_atendimento.opcoes.dentista_especialista_produto.label = "Quiero hablar con un odontologo especialista de producto";
    es.prioridade.data.matrixConfig.campos.tipo_atendimento.opcoes.falar_com_sac.label = "Hablar con SAC";
    es.prioridade.data.matrixConfig.campos.tipo_atendimento.opcoes.tecnico_especializado.label = "Quiero ser atendido por un tecnico especializado";
    es.prioridade.data.matrixConfig.campos.tipo_atendimento.opcoes.locacao_suporte_tecnico.label = "Soy cliente de alquiler y necesito soporte tecnico";
    es.prioridade.data.matrixConfig.campos.categoria.label = "Categoria";
    es.prioridade.data.matrixConfig.campos.categoria.opcoes.duvidas_gerais_sac.label = "Consultas generales (SAC)";
    es.prioridade.data.matrixConfig.campos.categoria.opcoes.instalacao_linha_imagem.label = "Instalacion de productos de la linea de imagen";
    es.prioridade.data.matrixConfig.campos.categoria.opcoes.duvidas_gerais_equipamento.label = "Consultas generales sobre el equipo";
    es.prioridade.data.matrixConfig.campos.categoria.opcoes.assuntos_financeiros.label = "Asuntos financieros";
    es.prioridade.data.matrixConfig.campos.categoria.opcoes.problemas_tecnicos_equipamento.label = "Problemas tecnicos con el equipo";
    es.prioridade.data.matrixConfig.campos.produto.label = "Producto";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.fotopolimerizador.label = "Fotopolimerizador";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.peca_de_mao.label = "Pieza de mano";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.bomba_vacuo.label = "Bomba de vacio";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.compressor.label = "Compresor";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.micro_motor_eletrico.label = "Micromotor electrico";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.raio_x_periapical.label = "Rayos X periapical";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.autoclave.label = "Autoclave";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.profilaxia.label = "Profilaxis";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.digitalizador_eagle_ps.label = "Digitalizador Eagle PS";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.raio_x_portatil.label = "Rayos X portatil";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.sensor_intraoral.label = "Sensor intraoral";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.consultorios.label = "Consultorios";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.eagle_scan.label = "Eagle Scan";
    es.prioridade.data.matrixConfig.campos.produto.opcoes.tomografo_panoramico.label = "Tomografo / Panoramico";
    es.prioridade.data.matrixConfig.metadadosPrioridade.P1.descricao = "Urgente";
    es.prioridade.data.matrixConfig.metadadosPrioridade.P2.descricao = "Alta";
    es.prioridade.data.matrixConfig.metadadosPrioridade.P3.descricao = "Media";
    es.prioridade.data.matrixConfig.metadadosPrioridade.P4.descricao = "Baja";
    es.prioridade.data.matrixConfig.metadadosPrioridade.P5.descricao = "Muy baja";
    es.prioridade.data.matrixConfig.metadadosPrioridade.NC.descricao = "Sin clasificar";
    es.prioridade.main.opening.breadcrumb = "Inicio > Global Service > Matriz de Prioridad";
    es.prioridade.main.opening.moduleLabel = "Modulo: Matriz de Prioridad";
    es.prioridade.main.opening.operationalContext = "Contexto operativo: regla oficial para ordenar atencion, cola y lectura de SLA por criticidad.";
    es.prioridade.main.opening.title = "Matriz de Prioridad";
    es.prioridade.main.opening.description = "Regla que transforma el contexto del ticket en prioridad operativa, reduciendo decisiones subjetivas y guiando el orden ideal de atencion.";
    es.prioridade.main.nav.label = "Navegación interna del módulo";
    es.prioridade.main.nav.matrix = "Matriz de Prioridad";
    es.prioridade.main.nav.simulation = "Simulación de Prioridad";
    es.prioridade.main.rule.kicker = "Mapa Oficial de la Prioridad";
    es.prioridade.main.rule.title = "Entrada del ticket -> criterios y pesos -> Score -> P1-P5 -> MTFC -> uso en la cola";
    es.prioridade.main.rule.summary = "La prioridad resume la criticidad operativa. Guia el orden de atencion y debe aplicarse como regla, no como una eleccion subjetiva del agente.";
    es.prioridade.main.rule.flow.ticketInput = "Entrada del ticket";
    es.prioridade.main.rule.flow.criteriaWeights = "Criterios y pesos";
    es.prioridade.main.rule.flow.score = "Score final";
    es.prioridade.main.rule.flow.priorityClass = "Clasificación P1-P5";
    es.prioridade.main.rule.flow.mtfc = "MTFC / Primera respuesta";
    es.prioridade.main.rule.flow.queueUsage = "Uso en la cola";
    es.prioridade.main.rule.whatIs.title = "Qué es la Matriz de Prioridad";
    es.prioridade.main.rule.whatIs.text = "Es la regla que transforma el contexto del ticket en prioridad operativa. La prioridad resume la criticidad y guia el orden ideal de atencion.";
    es.prioridade.main.rule.forWho.title = "Para quién sirve";
    es.prioridade.main.rule.forWho.agent = "Agentes: entender que ticket atender primero.";
    es.prioridade.main.rule.forWho.coordinator = "Coordinadores: organizar cola, backlog y aging.";
    es.prioridade.main.rule.forWho.manager = "Gestores: acompañar operación por prioridad, SLA y volumen.";
    es.prioridade.main.rule.whereAppears.title = "Dónde aparece";
    es.prioridade.main.rule.whereAppears.ticket = "En el ticket de Zoho Desk.";
    es.prioridade.main.rule.whereAppears.queue = "En la cola/lista de tickets.";
    es.prioridade.main.rule.whereAppears.boards = "En visualizaciones por prioridad/board.";
    es.prioridade.main.rule.whereAppears.dashboards = "En dashboards y análisis operativos.";
    es.prioridade.main.criteria.title = "Cómo se calcula: criterios y pesos oficiales";
    es.prioridade.main.criteria.description = "La prioridad se calcula por Solicitante, Tipo de atención, Categoría y Producto. Cada opción tiene un Peso para componer el Score final.";
    es.prioridade.main.criteria.formula = "Score = Solicitante x Tipo de atención x Categoría x Producto";
    es.prioridade.main.criteria.columns.code = "Codigo";
    es.prioridade.main.criteria.columns.option = "Opción";
    es.prioridade.main.criteria.columns.weight = "Peso";
    es.prioridade.main.criteria.solicitante.title = "Solicitante";
    es.prioridade.main.criteria.tipoAtendimento.title = "Tipo de atención";
    es.prioridade.main.criteria.categoria.title = "Categoría";
    es.prioridade.main.criteria.produto.title = "Producto";
    es.prioridade.main.classification.title = "Clasificacion oficial por Score, Prioridad y MTFC/SLA";
    es.prioridade.main.classification.description = "La clasificacion oficial se define a partir del score calculado, con prioridad P1-P5 y MTFC/SLA correspondiente.";
    es.prioridade.main.classification.scoreCalculationNote = "La prioridad se calcula directamente desde el score: Score = Solicitante x Tipo de atencion x Categoria x Producto.";
    es.prioridade.main.classification.scaleLegend = "Escala operativa: de lo más urgente a lo menos urgente.";
    es.prioridade.main.classification.highestUrgency = "Mayor urgencia";
    es.prioridade.main.classification.lowestUrgency = "Menor urgencia";
    es.prioridade.main.classification.columns.priority = "Prioridad";
    es.prioridade.main.classification.columns.scoreRange = "Rango de score";
    es.prioridade.main.classification.columns.mtfcSla = "MTFC/SLA";
    es.prioridade.main.classification.levels.p1.name = "Urgente";
    es.prioridade.main.classification.levels.p1.scoreRange = "50 a 90";
    es.prioridade.main.classification.levels.p1.mtfc = "1h";
    es.prioridade.main.classification.levels.p1.interpretation = "Atención inmediata y prioridad máxima en la cola.";
    es.prioridade.main.classification.levels.p2.name = "Alta";
    es.prioridade.main.classification.levels.p2.scoreRange = "31 a 49";
    es.prioridade.main.classification.levels.p2.mtfc = "2h";
    es.prioridade.main.classification.levels.p2.interpretation = "Alta criticidad con ventana corta para primera respuesta.";
    es.prioridade.main.classification.levels.p3.name = "Media";
    es.prioridade.main.classification.levels.p3.scoreRange = "21 a 30";
    es.prioridade.main.classification.levels.p3.mtfc = "3h";
    es.prioridade.main.classification.levels.p3.interpretation = "Flujo estándar con seguimiento continuo de SLA.";
    es.prioridade.main.classification.levels.p4.name = "Baja";
    es.prioridade.main.classification.levels.p4.scoreRange = "11 a 20";
    es.prioridade.main.classification.levels.p4.mtfc = "5h";
    es.prioridade.main.classification.levels.p4.interpretation = "Priorización de rutina con foco en estabilidad de la cola.";
    es.prioridade.main.classification.levels.p5.name = "Muy baja";
    es.prioridade.main.classification.levels.p5.scoreRange = "1 a 10";
    es.prioridade.main.classification.levels.p5.mtfc = "6h";
    es.prioridade.main.classification.levels.p5.interpretation = "Baja criticidad, manteniendo control de volumen y aging.";
    es.prioridade.main.classification.firstResponseNote = "En esta lectura, el SLA se orienta al MTFC/SLA de primera respuesta.";
    es.prioridade.main.classification.resolutionNote = "La regla de Resolución puede tratarse por separado de la diferenciación de primera respuesta.";
    es.prioridade.main.classification.exceptionTitle = "Excepción oficial";
    es.prioridade.main.classification.exceptionText = "Out of the box / Cero hora debe volverse prioridad Urgente.";
    es.prioridade.main.operation.title = "Cómo usar en la operación";
    es.prioridade.main.operation.agent = "Agente usa prioridad para ordenar la atencion en la cola.";
    es.prioridade.main.operation.coordinator = "Coordinador usa prioridad para acompañar cola, backlog y aging.";
    es.prioridade.main.operation.manager = "Gestor usa prioridad para lectura de SLA y volumen.";
    es.prioridade.main.operation.antiSubjective = "La prioridad ayuda a evitar decisiones subjetivas en la rutina.";
    es.prioridade.main.exception.title = "Excepciones y cuidados";
    es.prioridade.main.exception.zeroHour = "Out of the box / Cero hora = Urgente.";
    es.prioridade.main.exception.reviewInvalidData = "La prioridad debe revisarse si los datos obligatorios son incorrectos.";
    es.prioridade.main.exception.wrongFields = "Campos incorrectos pueden generar prioridad incorrecta.";
    es.prioridade.main.exception.humanFollowUp = "La prioridad no reemplaza el seguimiento humano.";
    es.prioridade.simulation.opening.pageTitle = "Playbook Global - Simulación de Prioridad";
    es.prioridade.simulation.opening.headerSubtitle = "Entrenamiento rápido para clasificación operativa de tickets";
    es.prioridade.simulation.opening.breadcrumb = "Inicio > Global Service > Matriz de Prioridad > Simulación de Prioridad";
    es.prioridade.simulation.opening.moduleLabel = "Módulo: Matriz de Prioridad";
    es.prioridade.simulation.opening.operationalContext = "Contexto operativo: entrenamiento para convertir datos del ticket en prioridad P1-P5 y orientar la cola con menos subjetividad.";
    es.prioridade.simulation.opening.title = "Simulación de Prioridad";
    es.prioridade.simulation.opening.description = "Submódulo corto para practicar el cálculo oficial de prioridad con score real, MTFC esperado y lectura operativa del resultado.";
    es.prioridade.simulation.form.kicker = "Panel de Simulación";
    es.prioridade.simulation.form.title = "Completa los criterios oficiales";
    es.prioridade.simulation.form.description = "El score se calcula multiplicando los pesos de Solicitante, Tipo de atención, Categoría y Producto.";
    es.prioridade.simulation.form.formula = "Score = Solicitante x Tipo de atención x Categoría x Producto";
    es.prioridade.simulation.form.fields.solicitante = "Solicitante";
    es.prioridade.simulation.form.fields.tipoAtendimento = "Tipo de atención";
    es.prioridade.simulation.form.fields.categoria = "Categoría";
    es.prioridade.simulation.form.fields.produto = "Producto";
    es.prioridade.simulation.form.fields.outOfBoxZeroHour = "Out of the box / Cero hora";
    es.prioridade.simulation.form.selectPlaceholder = "Seleccione...";
    es.prioridade.simulation.form.submitButton = "Calcular prioridad";
    es.prioridade.simulation.result.title = "Resultado";
    es.prioridade.simulation.result.pendingState = "Completa los campos y calcula para ver la prioridad final.";
    es.prioridade.simulation.result.readyState = "Resultado calculado con la regla oficial de prioridad.";
    es.prioridade.simulation.result.finalPriority = "Prioridad final";
    es.prioridade.simulation.result.scoreCalculated = "Score calculado";
    es.prioridade.simulation.result.mtfc = "MTFC/SLA";
    es.prioridade.simulation.result.scoreFormula = "Composición del score";
    es.prioridade.simulation.result.operationalInterpretation = "Interpretación operativa";
    es.prioridade.simulation.result.pendingInterpretation = "Al calcular, verás la lectura operativa del nivel de prioridad.";
    es.prioridade.simulation.result.exceptionForced = "Excepción aplicada: Out of the box / Cero hora siempre fuerza P1 (Urgente) con MTFC 1h.";
    es.prioridade.simulation.result.levels.p1.name = "Urgente";
    es.prioridade.simulation.result.levels.p1.mtfc = "1h";
    es.prioridade.simulation.result.levels.p1.interpretation = "Atención inmediata con prioridad máxima en la cola.";
    es.prioridade.simulation.result.levels.p2.name = "Alta";
    es.prioridade.simulation.result.levels.p2.mtfc = "2h";
    es.prioridade.simulation.result.levels.p2.interpretation = "Caso crítico con ventana corta para primera respuesta.";
    es.prioridade.simulation.result.levels.p3.name = "Media";
    es.prioridade.simulation.result.levels.p3.mtfc = "3h";
    es.prioridade.simulation.result.levels.p3.interpretation = "Atención en flujo estándar con seguimiento continuo.";
    es.prioridade.simulation.result.levels.p4.name = "Baja";
    es.prioridade.simulation.result.levels.p4.mtfc = "5h";
    es.prioridade.simulation.result.levels.p4.interpretation = "Rutina operativa con menor presión inmediata en la cola.";
    es.prioridade.simulation.result.levels.p5.name = "Muy baja";
    es.prioridade.simulation.result.levels.p5.mtfc = "6h";
    es.prioridade.simulation.result.levels.p5.interpretation = "Baja urgencia, manteniendo control de volumen y aging.";
    es.prioridade.simulation.result.levels.nc.name = "Sin clasificar";
    es.prioridade.simulation.result.levels.nc.mtfc = "-";
    es.prioridade.simulation.result.levels.nc.interpretation = "Resultado sin clasificación de prioridad.";
    es.prioridade.simulation.interpretation.title = "Cómo interpretar la simulación";
    es.prioridade.simulation.interpretation.point1 = "La simulación es un apoyo de entrenamiento para estandarizar la lectura de prioridad.";
    es.prioridade.simulation.interpretation.point2 = "El resultado depende de la calidad de los campos completados en el ticket.";
    es.prioridade.simulation.interpretation.point3 = "La prioridad orienta la cola, pero no reemplaza el seguimiento del coordinador.";
    es.prioridade.simulation.interpretation.point4 = "Cero hora / Out of the box siempre fuerza urgencia (P1 y MTFC 1h).";
    es.prioridade.simulation.options.yes = "Sí";
    es.prioridade.simulation.options.no = "No";

    es.camposObrigatorios.title = "Playbook Global - Campos Obligatorios";
    es.camposObrigatorios.index.header.title = "Campos Obligatorios";
    es.camposObrigatorios.index.header.subtitle = "Arquitectura ejecutiva de campos del modelo global";
    es.camposObrigatorios.index.footer = "Playbook Global - Campos Obligatorios";
    es.camposObrigatorios.data.labels.requiredGlobal = "Obligatorio global";
    es.camposObrigatorios.data.labels.alternativeRule = "Regla operativa";
    es.camposObrigatorios.data.labels.contactChannelRule = "E-mail y Telefono/Celular";
    es.camposObrigatorios.home = es.camposObrigatorios.home || {};
    es.camposObrigatorios.home.opening = es.camposObrigatorios.home.opening || {};
    es.camposObrigatorios.home.opening.pageTitle = "Playbook Global - Campos Obligatorios";
    es.camposObrigatorios.home.opening.breadcrumb = "Inicio > Global Service > Campos Obligatorios";
    es.camposObrigatorios.home.opening.moduleLabel = "Modulo: Campos Obligatorios";
    es.camposObrigatorios.home.opening.title = "Campos Obligatorios";
    es.camposObrigatorios.home.opening.description = "Los campos obligatorios definen la informacion minima necesaria para abrir, acompanar y analizar tickets con calidad. Reducen retrabajo, evitan perdida de informacion y sostienen flujo, prioridad, SLA y KPIs.";
    es.camposObrigatorios.home.opening.operationalContext = "Contexto operativo: estandar minimo para apertura, seguimiento y calidad del ticket.";
    es.camposObrigatorios.home.nav = es.camposObrigatorios.home.nav || {};
    es.camposObrigatorios.home.nav.label = "Navegacion interna del modulo";
    es.camposObrigatorios.home.nav.fields = "Campos Obligatorios";
    es.camposObrigatorios.home.nav.matrix = "Matriz Consolidada";
    es.camposObrigatorios.home.dominant = es.camposObrigatorios.home.dominant || {};
    es.camposObrigatorios.home.dominant.eyebrow = "Mapa de Campos del Ticket";
    es.camposObrigatorios.home.dominant.title = "Mapa de Campos del Ticket";
    es.camposObrigatorios.home.dominant.description = "Resumen visual de los grupos oficiales y de como cada grupo impacta la operacion.";
    es.camposObrigatorios.home.dominant.whoLabel = "Quien completa";
    es.camposObrigatorios.home.dominant.whenLabel = "Cuando entra en el flujo";
    es.camposObrigatorios.home.dominant.whyLabel = "Por que importa";
    es.camposObrigatorios.home.dominant.ctaMatrix = "Abrir Matriz Consolidada";
    es.camposObrigatorios.home.classifications = es.camposObrigatorios.home.classifications || {};
    es.camposObrigatorios.home.classifications.mandatory = es.camposObrigatorios.home.classifications.mandatory || {};
    es.camposObrigatorios.home.classifications.mandatory.label = "Obligatorio";
    es.camposObrigatorios.home.classifications.mandatory.description = "Debe completarse segun la regla.";
    es.camposObrigatorios.home.classifications.recommended = es.camposObrigatorios.home.classifications.recommended || {};
    es.camposObrigatorios.home.classifications.recommended.label = "Deseable";
    es.camposObrigatorios.home.classifications.recommended.description = "Mejora trazabilidad y analisis, sin bloquear la operacion.";
    es.camposObrigatorios.home.classifications.automatic = es.camposObrigatorios.home.classifications.automatic || {};
    es.camposObrigatorios.home.classifications.automatic.label = "Automático";
    es.camposObrigatorios.home.classifications.automatic.description = "Completado por el sistema.";
    es.camposObrigatorios.home.classifications.conditional = es.camposObrigatorios.home.classifications.conditional || {};
    es.camposObrigatorios.home.classifications.conditional.label = "Condicional";
    es.camposObrigatorios.home.classifications.conditional.description = "Obligatorio solo cuando la condicion aplica.";
    es.camposObrigatorios.home.required = es.camposObrigatorios.home.required || {};
    es.camposObrigatorios.home.required.title = "Obligatorios principales";
    es.camposObrigatorios.home.required.ticketLabel = "Ticket - apertura";
    es.camposObrigatorios.home.required.ticket = es.camposObrigatorios.home.required.ticket || {};
    es.camposObrigatorios.home.required.ticket.requesterName = "Nombre del solicitante/cliente";
    es.camposObrigatorios.home.required.ticket.email = "E-mail";
    es.camposObrigatorios.home.required.ticket.phone = "Telefono";
    es.camposObrigatorios.home.required.ticket.requester = "Solicitante";
    es.camposObrigatorios.home.required.ticket.serviceType = "Tipo de atencion";
    es.camposObrigatorios.home.required.ticket.category = "Categoria";
    es.camposObrigatorios.home.required.ticket.product = "Producto";
    es.camposObrigatorios.home.required.ticket.productBrand = "Marca del producto";
    es.camposObrigatorios.home.required.ticket.serialNumber = "Numero de serie del equipo, con excepcion contextual";
    es.camposObrigatorios.home.required.ticket.subject = "Asunto";
    es.camposObrigatorios.home.required.ticket.description = "Descripcion";
    es.camposObrigatorios.home.required.contactLabel = "Contacto/Cliente";
    es.camposObrigatorios.home.required.contact = es.camposObrigatorios.home.required.contact || {};
    es.camposObrigatorios.home.required.contact.firstName = "Nombre";
    es.camposObrigatorios.home.required.contact.lastName = "Apellido";
    es.camposObrigatorios.home.required.contact.accountName = "Nombre de la cuenta";
    es.camposObrigatorios.home.required.contact.email = "E-mail";
    es.camposObrigatorios.home.required.contact.phoneMobile = "Telefono/Celular";
    es.camposObrigatorios.home.required.meta = es.camposObrigatorios.home.required.meta || {};
    es.camposObrigatorios.home.required.meta.who = "Cliente y agente, segun la etapa.";
    es.camposObrigatorios.home.required.meta.when = "Principalmente en apertura y calificacion inicial.";
    es.camposObrigatorios.home.required.meta.why = "Sin estos datos, la triage pierde calidad y aumenta el retrabajo.";
    es.camposObrigatorios.home.required.conditionalLabel = "Condicional";
    es.camposObrigatorios.home.required.conditional = es.camposObrigatorios.home.required.conditional || {};
    es.camposObrigatorios.home.required.conditional.stateBrazil = "Estado: obligatorio solo Brasil";
    es.camposObrigatorios.home.required.conditional.provinceArgentina = "Provincia: obligatoria solo Argentina";
    es.camposObrigatorios.home.required.conditional.assistanceDistributor = "Nombre de asistencia/distribuidor: obligatorio para Asistencia / Distribuidor";
    es.camposObrigatorios.home.required.conditionalMeta = es.camposObrigatorios.home.required.conditionalMeta || {};
    es.camposObrigatorios.home.required.conditionalMeta.who = "Agente durante validacion de datos.";
    es.camposObrigatorios.home.required.conditionalMeta.when = "En apertura y revisiones de registro.";
    es.camposObrigatorios.home.required.conditionalMeta.why = "Evita errores regionales e inconsistencias de responsabilidad.";
    es.camposObrigatorios.home.required.automaticLabel = "Automáticos/sistémicos";
    es.camposObrigatorios.home.required.automatic = es.camposObrigatorios.home.required.automatic || {};
    es.camposObrigatorios.home.required.automatic.ticketId = "ID del ticket";
    es.camposObrigatorios.home.required.automatic.openingDate = "Fecha de apertura";
    es.camposObrigatorios.home.required.automatic.channel = "Canal";
    es.camposObrigatorios.home.required.automatic.owner = "Responsable del ticket";
    es.camposObrigatorios.home.required.automatic.status = "Status";
    es.camposObrigatorios.home.required.automatic.priority = "Prioridad, calculada por la matriz";
    es.camposObrigatorios.home.required.automatic.slaFirstResponse = "SLA de primera respuesta";
    es.camposObrigatorios.home.required.automatic.slaResolution = "SLA de resolucion";
    es.camposObrigatorios.home.required.automatic.slaIndicators = "Tiempos e indicadores de SLA";
    es.camposObrigatorios.home.required.automaticMeta = es.camposObrigatorios.home.required.automaticMeta || {};
    es.camposObrigatorios.home.required.automaticMeta.who = "Sistema.";
    es.camposObrigatorios.home.required.automaticMeta.when = "Durante toda la jornada del ticket.";
    es.camposObrigatorios.home.required.automaticMeta.why = "Sostiene lectura de SLA, desempeno y auditoria.";
    es.camposObrigatorios.home.recommended = es.camposObrigatorios.home.recommended || {};
    es.camposObrigatorios.home.recommended.title = "Deseables oficiales";
    es.camposObrigatorios.home.recommended.country = "Pais";
    es.camposObrigatorios.home.recommended.zeroHour = "Cero hora / Out of the box";
    es.camposObrigatorios.home.recommended.needsPart = "Necesita pieza";
    es.camposObrigatorios.home.recommended.partnerDistributor = "Partner/distribuidor, cuando no obligatorio";
    es.camposObrigatorios.home.recommended.racSent = "RAC Enviada? - Si/No";
    es.camposObrigatorios.home.recommended.assistanceType = "Tipo de asistencia tecnica";
    es.camposObrigatorios.home.recommended.closingReason = "Motivo del cierre";
    es.camposObrigatorios.home.recommended.solutionMode = "Solucion en campo/remoto";
    es.camposObrigatorios.home.recommended.usedPart = "Pieza utilizada";
    es.camposObrigatorios.home.recommended.finalPartsQty = "Cantidad final de piezas";
    es.camposObrigatorios.home.recommended.meta = es.camposObrigatorios.home.recommended.meta || {};
    es.camposObrigatorios.home.recommended.meta.who = "Agente y coordinacion para elevar la calidad analitica.";
    es.camposObrigatorios.home.recommended.meta.when = "Principalmente durante atencion y cierre.";
    es.camposObrigatorios.home.recommended.meta.why = "Mejora trazabilidad, lectura de prioridad y consistencia de KPI.";
    es.camposObrigatorios.home.excluded = es.camposObrigatorios.home.excluded || {};
    es.camposObrigatorios.home.excluded.note = "No forman parte de la lista oficial de deseables en esta fase:";
    es.camposObrigatorios.home.excluded.actionsExecuted = "Acciones ejecutadas";
    es.camposObrigatorios.home.excluded.partsQuantity = "Cantidad de piezas";
    es.camposObrigatorios.home.excluded.requestedPart = "Pieza solicitada";
    es.camposObrigatorios.home.excluded.partCode = "Codigo de la pieza";
    es.camposObrigatorios.home.excluded.partDatesStatus = "Fechas/status de la pieza";
    es.camposObrigatorios.home.excluded.orderNumber = "Numero del pedido";
    es.camposObrigatorios.home.excluded.probableCause = "Causa probable";
    es.camposObrigatorios.home.excluded.returnDate = "Fecha prevista de retorno al cliente";
    es.camposObrigatorios.home.impact = es.camposObrigatorios.home.impact || {};
    es.camposObrigatorios.home.impact.title = "Impacto operativo";
    es.camposObrigatorios.home.impact.dataQuality = "Calidad de datos";
    es.camposObrigatorios.home.impact.flow = "Flujo";
    es.camposObrigatorios.home.impact.priority = "Prioridad";
    es.camposObrigatorios.home.impact.sla = "SLA";
    es.camposObrigatorios.home.impact.kpi = "KPI";
    es.camposObrigatorios.home.impact.audit = "Auditoría";
    es.camposObrigatorios.home.impact.backlogAging = "Backlog y aging";
    es.camposObrigatorios.home.rules = es.camposObrigatorios.home.rules || {};
    es.camposObrigatorios.home.rules.title = "Reglas críticas";
    es.camposObrigatorios.home.rules.serialException = "Numero de serie es obligatorio, con excepcion contextual.";
    es.camposObrigatorios.home.rules.stateBrazil = "Estado solo Brasil.";
    es.camposObrigatorios.home.rules.provinceArgentina = "Provincia solo Argentina.";
    es.camposObrigatorios.home.rules.assistanceDistributor = "Nombre de asistencia/distribuidor solo cuando aplica.";
    es.camposObrigatorios.home.rules.priorityCalculated = "La prioridad es obligatoria y calculada por la matriz.";
    es.camposObrigatorios.home.rules.zeroHourImpact = "Cero hora / Out of the box es deseable, pero impacta prioridad.";
    es.camposObrigatorios.home.usage = es.camposObrigatorios.home.usage || {};
    es.camposObrigatorios.home.usage.title = "Cómo usar este módulo";
    es.camposObrigatorios.home.usage.homeRule = "Usa la home para entender la regla.";
    es.camposObrigatorios.home.usage.matrixDetails = "Usa la Matriz Consolidada para consultar el detalle completo.";
    es.camposObrigatorios.home.usage.coordinators = "Coordinadores deben usar la matriz para cobrar completitud.";
    es.camposObrigatorios.home.usage.agents = "Agentes deben usarla como referencia para completar correctamente.";
    es.camposObrigatorios.matrix = es.camposObrigatorios.matrix || {};
    es.camposObrigatorios.matrix.opening = es.camposObrigatorios.matrix.opening || {};
    es.camposObrigatorios.matrix.opening.pageTitle = "Playbook Global - Campos Obligatorios: Matriz Consolidada de Campos";
    es.camposObrigatorios.matrix.opening.headerTitle = "Campos Obligatorios";
    es.camposObrigatorios.matrix.opening.headerSubtitle = "Referencia oficial de estructura, regla y lectura operativa de campos.";
    es.camposObrigatorios.matrix.opening.breadcrumb = "Inicio > Global Service > Campos Obligatorios > Matriz Consolidada";
    es.camposObrigatorios.matrix.opening.moduleLabel = "Modulo: Campos Obligatorios";
    es.camposObrigatorios.matrix.opening.title = "Matriz Consolidada de Campos";
    es.camposObrigatorios.matrix.opening.description = "Esta pagina consolida la fuente oficial de campos de Ticket y Contacto/Cliente con reglas actualizadas para operacion, prioridad, SLA y gobernanza.";
    es.camposObrigatorios.matrix.opening.operationalContext = "Contexto operativo: referencia unica para completar campos, auditoria y lectura de calidad de datos del servicio.";

    es.camposObrigatorios.matrix.nav = es.camposObrigatorios.matrix.nav || {};
    es.camposObrigatorios.matrix.nav.label = "Navegacion interna del modulo";
    es.camposObrigatorios.matrix.nav.home = "Campos Obligatorios";
    es.camposObrigatorios.matrix.nav.matrix = "Matriz Consolidada";
    es.camposObrigatorios.matrix.nav.operation = "Operacion por Etapa";
    es.camposObrigatorios.matrix.nav.governance = "Gobernanza de Campos";

    es.camposObrigatorios.matrix.dominant = es.camposObrigatorios.matrix.dominant || {};
    es.camposObrigatorios.matrix.dominant.title = "Matriz Consolidada Oficial";
    es.camposObrigatorios.matrix.dominant.description = "Filtra por entidad, clasificacion, etapa o responsable para consultar rapidamente la regla de cada campo.";

    es.camposObrigatorios.matrix.columns = es.camposObrigatorios.matrix.columns || {};
    es.camposObrigatorios.matrix.columns.entity = "Entidad";
    es.camposObrigatorios.matrix.columns.field = "Campo";
    es.camposObrigatorios.matrix.columns.classification = "Clasificacion";
    es.camposObrigatorios.matrix.columns.condition = "Condicion";
    es.camposObrigatorios.matrix.columns.stage = "Etapa";
    es.camposObrigatorios.matrix.columns.owner = "Responsable";
    es.camposObrigatorios.matrix.columns.impact = "Impacto";
    es.camposObrigatorios.matrix.columns.rule = "Regla";

    es.camposObrigatorios.matrix.filters = es.camposObrigatorios.matrix.filters || {};
    es.camposObrigatorios.matrix.filters.entity = "Entidad";
    es.camposObrigatorios.matrix.filters.classification = "Clasificacion";
    es.camposObrigatorios.matrix.filters.stage = "Etapa";
    es.camposObrigatorios.matrix.filters.owner = "Responsable";
    es.camposObrigatorios.matrix.filters.all = "Todos";
    es.camposObrigatorios.matrix.filters.resultSingular = "campo encontrado";
    es.camposObrigatorios.matrix.filters.resultPlural = "campos encontrados";
    es.camposObrigatorios.matrix.filters.noResults = "No se encontraron campos para los filtros seleccionados.";

    es.camposObrigatorios.matrix.entities = es.camposObrigatorios.matrix.entities || {};
    es.camposObrigatorios.matrix.entities.ticket = "Ticket";
    es.camposObrigatorios.matrix.entities.contact_customer = "Contacto/Cliente";

    es.camposObrigatorios.matrix.classifications = es.camposObrigatorios.matrix.classifications || {};
    es.camposObrigatorios.matrix.classifications.mandatory = "Obligatorio";
    es.camposObrigatorios.matrix.classifications.recommended = "Deseable";
    es.camposObrigatorios.matrix.classifications.automatic = "Automático";
    es.camposObrigatorios.matrix.classifications.conditional = "Condicional";

    es.camposObrigatorios.matrix.stages = es.camposObrigatorios.matrix.stages || {};
    es.camposObrigatorios.matrix.stages.opening = "Apertura";
    es.camposObrigatorios.matrix.stages.in_progress = "Atencion";
    es.camposObrigatorios.matrix.stages.waiting_customer = "Esperando Cliente";
    es.camposObrigatorios.matrix.stages.waiting_parts = "Esperando Pieza";
    es.camposObrigatorios.matrix.stages.waiting_third_party = "Esperando Tercero / Visita Tecnica";
    es.camposObrigatorios.matrix.stages.resolution_closing = "Resolucion / Cierre";
    es.camposObrigatorios.matrix.stages.system = "Sistema";

    es.camposObrigatorios.matrix.owners = es.camposObrigatorios.matrix.owners || {};
    es.camposObrigatorios.matrix.owners.customer = "Cliente";
    es.camposObrigatorios.matrix.owners.agent = "Agente";
    es.camposObrigatorios.matrix.owners.system = "Sistema";
    es.camposObrigatorios.matrix.owners.coordinator = "Coordinador";

    es.camposObrigatorios.matrix.impacts = es.camposObrigatorios.matrix.impacts || {};
    es.camposObrigatorios.matrix.impacts.data_quality = "Calidad de datos";
    es.camposObrigatorios.matrix.impacts.flow = "Flujo";
    es.camposObrigatorios.matrix.impacts.priority = "Prioridad";
    es.camposObrigatorios.matrix.impacts.sla = "SLA";
    es.camposObrigatorios.matrix.impacts.kpi = "KPI";
    es.camposObrigatorios.matrix.impacts.audit = "Auditoría";

    es.camposObrigatorios.matrix.inputTypes = es.camposObrigatorios.matrix.inputTypes || {};
    es.camposObrigatorios.matrix.inputTypes.text = "Texto";
    es.camposObrigatorios.matrix.inputTypes.list = "Lista";
    es.camposObrigatorios.matrix.inputTypes.yes_no = "Si/No";
    es.camposObrigatorios.matrix.inputTypes.date = "Fecha";
    es.camposObrigatorios.matrix.inputTypes.automatic = "Automático";

    es.camposObrigatorios.matrix.conditions = es.camposObrigatorios.matrix.conditions || {};
    es.camposObrigatorios.matrix.conditions.serial_exception = "Excepcion contextual: cuando no este disponible en la apertura, registrar justificacion y completar luego.";
    es.camposObrigatorios.matrix.conditions.requester_assistance_distributor = "Obligatorio cuando Solicitante = Asistencia / Distribuidor.";
    es.camposObrigatorios.matrix.conditions.country_brazil = "Obligatorio solo para Brasil.";
    es.camposObrigatorios.matrix.conditions.country_argentina = "Obligatorio solo para Argentina.";
    es.camposObrigatorios.matrix.conditions.partner_not_captured = "Completar cuando no se capturo en el campo condicional obligatorio.";
    es.camposObrigatorios.matrix.conditions.priority_calculated_matrix = "Calculada por la matriz oficial, sin eleccion subjetiva del agente.";

    es.camposObrigatorios.matrix.rules = es.camposObrigatorios.matrix.rules || {};
    es.camposObrigatorios.matrix.rules.mandatory_opening = "Obligatorio en la apertura segun regla oficial.";
    es.camposObrigatorios.matrix.rules.mandatory_serial_exception = "Obligatorio con excepcion contextual justificada.";
    es.camposObrigatorios.matrix.rules.conditional_brazil_state = "Completar cuando Pais = Brasil.";
    es.camposObrigatorios.matrix.rules.conditional_argentina_province = "Completar cuando Pais = Argentina.";
    es.camposObrigatorios.matrix.rules.conditional_assistance_distributor = "Obligatorio en contexto de Asistencia / Distribuidor.";
    es.camposObrigatorios.matrix.rules.country_not_mandatory = "No obligatorio en esta fase.";
    es.camposObrigatorios.matrix.rules.automatic_system = "Completado automaticamente por el sistema.";
    es.camposObrigatorios.matrix.rules.mandatory_priority_matrix = "Obligatoria y calculada por la matriz de prioridad.";
    es.camposObrigatorios.matrix.rules.recommended_zero_hour = "Deseable; cuando se informa, impacta la lectura de prioridad.";
    es.camposObrigatorios.matrix.rules.recommended_general = "Campo deseable para aumentar calidad y trazabilidad.";
    es.camposObrigatorios.matrix.rules.recommended_partner_if_missing = "Deseable cuando no se capturo en el campo condicional obligatorio.";
    es.camposObrigatorios.matrix.rules.recommended_rac_yes_no = "Campo deseable de tipo Si/No.";
    es.camposObrigatorios.matrix.rules.mandatory_closing_summary = "Obligatorio antes del cierre final.";

    es.camposObrigatorios.matrix.regionalRules = es.camposObrigatorios.matrix.regionalRules || {};
    es.camposObrigatorios.matrix.regionalRules.br_only_state = "Regla regional de Brasil.";
    es.camposObrigatorios.matrix.regionalRules.ar_only_province = "Regla regional de Argentina.";

    es.camposObrigatorios.matrix.fields = es.camposObrigatorios.matrix.fields || {};
    es.camposObrigatorios.matrix.fields.ticket_requester_name = "Nombre del solicitante / cliente";
    es.camposObrigatorios.matrix.fields.ticket_email = "Correo electronico";
    es.camposObrigatorios.matrix.fields.ticket_phone = "Telefono";
    es.camposObrigatorios.matrix.fields.ticket_requester_profile = "Perfil del solicitante";
    es.camposObrigatorios.matrix.fields.ticket_service_type = "Tipo de atencion";
    es.camposObrigatorios.matrix.fields.ticket_category = "Categoria";
    es.camposObrigatorios.matrix.fields.ticket_product = "Producto";
    es.camposObrigatorios.matrix.fields.ticket_product_brand = "Marca del producto";
    es.camposObrigatorios.matrix.fields.ticket_equipment_serial_number = "Numero de serie del equipo";
    es.camposObrigatorios.matrix.fields.ticket_subject = "Asunto";
    es.camposObrigatorios.matrix.fields.ticket_description = "Descripcion";
    es.camposObrigatorios.matrix.fields.ticket_state = "Estado";
    es.camposObrigatorios.matrix.fields.ticket_province = "Provincia";
    es.camposObrigatorios.matrix.fields.ticket_assistance_distributor_name = "Nombre de asistencia/distribuidor";
    es.camposObrigatorios.matrix.fields.ticket_country = "Pais";
    es.camposObrigatorios.matrix.fields.ticket_id = "ID del ticket";
    es.camposObrigatorios.matrix.fields.ticket_opening_date = "Fecha de apertura";
    es.camposObrigatorios.matrix.fields.ticket_channel = "Canal";
    es.camposObrigatorios.matrix.fields.ticket_owner = "Responsable del ticket";
    es.camposObrigatorios.matrix.fields.ticket_status = "Estado";
    es.camposObrigatorios.matrix.fields.ticket_priority = "Prioridad";
    es.camposObrigatorios.matrix.fields.ticket_sla_first_response = "SLA de primera respuesta";
    es.camposObrigatorios.matrix.fields.ticket_sla_resolution = "SLA de resolucion";
    es.camposObrigatorios.matrix.fields.ticket_first_response_date = "Fecha de primera respuesta";
    es.camposObrigatorios.matrix.fields.ticket_closing_date = "Fecha de cierre";
    es.camposObrigatorios.matrix.fields.ticket_time_to_first_response = "Tiempo hasta primera respuesta";
    es.camposObrigatorios.matrix.fields.ticket_total_time_to_close = "Tiempo total hasta cierre";
    es.camposObrigatorios.matrix.fields.ticket_sla_compliance_indicator = "Indicador de SLA cumplido";
    es.camposObrigatorios.matrix.fields.ticket_zero_hour_out_of_box = "Cero hora / Out of the box";
    es.camposObrigatorios.matrix.fields.ticket_needs_part = "Necesita pieza";
    es.camposObrigatorios.matrix.fields.ticket_partner_distributor = "Partner/distribuidor";
    es.camposObrigatorios.matrix.fields.ticket_rac_sent = "RAC enviada?";
    es.camposObrigatorios.matrix.fields.ticket_technical_assistance_type = "Tipo de asistencia tecnica";
    es.camposObrigatorios.matrix.fields.ticket_resolution_summary = "Resolucion / resumen de resolucion";
    es.camposObrigatorios.matrix.fields.ticket_closing_reason = "Motivo del cierre";
    es.camposObrigatorios.matrix.fields.ticket_on_site_or_remote_solution = "Solucion en campo/remota";
    es.camposObrigatorios.matrix.fields.ticket_used_part = "Pieza utilizada";
    es.camposObrigatorios.matrix.fields.ticket_final_parts_quantity = "Cantidad final de piezas";
    es.camposObrigatorios.matrix.fields.contact_first_name = "Nombre";
    es.camposObrigatorios.matrix.fields.contact_last_name = "Apellido";
    es.camposObrigatorios.matrix.fields.contact_account_name = "Nombre de la cuenta";
    es.camposObrigatorios.matrix.fields.contact_email = "Correo electronico";
    es.camposObrigatorios.matrix.fields.contact_phone_mobile = "Telefono/Celular";
    es.camposObrigatorios.matrix.fields.contact_legal_name = "Razon Social";
    es.camposObrigatorios.matrix.fields.contact_trade_name = "Nombre Fantasia";
    es.camposObrigatorios.matrix.fields.contact_language = "Idioma";
    es.camposObrigatorios.matrix.fields.contact_address = "Direccion";
    es.camposObrigatorios.matrix.fields.contact_scanner_model = "Modelo de Scanner";
    es.camposObrigatorios.matrix.fields.contact_installation_date = "Fecha de instalacion";
    es.camposObrigatorios.matrix.fields.contact_dealer = "Dealer";
    es.camposObrigatorios.matrix.fields.contact_scanner_serial_number = "Numero de serie del scanner";
    es.camposObrigatorios.matrix.fields.contact_pc_model = "Modelo de PC";
    es.camposObrigatorios.matrix.fields.contact_pc_serial_number = "Numero de serie del PC";
    es.camposObrigatorios.matrix.fields.contact_parts_warranty = "Garantia de piezas";
    es.camposObrigatorios.matrix.fields.contact_labor_warranty = "Garantia de mano de obra";
    es.camposObrigatorios.matrix.fields.contact_fda_2579_form_number = "Numero de Formulario FDA 2579";
    es.camposObrigatorios.matrix.fields.contact_fda_2579_form_date = "Fecha de Formulario FDA 2579";

    es.camposObrigatorios.matrix.support = es.camposObrigatorios.matrix.support || {};
    es.camposObrigatorios.matrix.support.interpretation = es.camposObrigatorios.matrix.support.interpretation || {};
    es.camposObrigatorios.matrix.support.interpretation.title = "Como interpretar la matriz";
    es.camposObrigatorios.matrix.support.interpretation.mandatory = "Obligatorio = debe completarse segun la regla.";
    es.camposObrigatorios.matrix.support.interpretation.recommended = "Deseable = mejora la calidad operativa, pero no bloquea la apertura.";
    es.camposObrigatorios.matrix.support.interpretation.automatic = "Automático = completado por el sistema.";
    es.camposObrigatorios.matrix.support.interpretation.conditional = "Condicional = obligatorio solo cuando la condicion aplica.";

    es.camposObrigatorios.matrix.support.criticalRules = es.camposObrigatorios.matrix.support.criticalRules || {};
    es.camposObrigatorios.matrix.support.criticalRules.title = "Reglas condicionales criticas";
    es.camposObrigatorios.matrix.support.criticalRules.stateBrazil = "Estado obligatorio solo para Brasil.";
    es.camposObrigatorios.matrix.support.criticalRules.provinceArgentina = "Provincia obligatoria solo para Argentina.";
    es.camposObrigatorios.matrix.support.criticalRules.assistanceDistributor = "Nombre de asistencia/distribuidor obligatorio solo para Asistencia / Distribuidor.";
    es.camposObrigatorios.matrix.support.criticalRules.serialException = "Numero de serie obligatorio con excepcion contextual justificada.";
    es.camposObrigatorios.matrix.support.criticalRules.priorityCalculated = "Prioridad obligatoria y calculada por la matriz, sin eleccion subjetiva.";
    es.camposObrigatorios.matrix.support.criticalRules.zeroHourImpact = "Cero hora / Out of the box es deseable, pero impacta la lectura de prioridad.";

    es.camposObrigatorios.matrix.common = es.camposObrigatorios.matrix.common || {};
    es.camposObrigatorios.matrix.common.notApplicable = "-";

    es.governanca.title = "Playbook Global - Gobernanza Global";
    es.governanca.index.header.title = "Gobernanza Global";
    es.governanca.index.header.subtitle = "Gobernanza operativa para lectura diaria, quincenal y mensual de la operacion";
    es.governanca.index.footer = "Playbook Global - Gobernanza Global";
    es.governanca.main.opening.pageTitle = "Playbook Global - Gobernanza Global";
    es.governanca.main.opening.breadcrumb = "Inicio > Global Service > Gobernanza Global";
    es.governanca.main.opening.moduleLabel = "Modulo: Gobernanza Global";
    es.governanca.main.opening.operationalContext = "Contexto operativo: seguimiento corto para mantener visibilidad de cola, ritmo de atencion y decisiones de correccion.";
    es.governanca.main.opening.title = "Gobernanza Global";
    es.governanca.main.opening.description = "Pagina unica para acompanar que monitorear por frecuencia, como leer Power BI y como actuar cuando haya desvio.";
    es.governanca.main.opening.context = "Alcance de esta pagina: que acompanar, con que frecuencia, por que importa y cual es la accion esperada por capa.";
    es.governanca.main.nav.label = "Navegacion interna del modulo";
    es.governanca.main.nav.layers = "Gobernanza por Capa";
    es.governanca.main.nav.bi = "Cómo acompañar en Power BI";
    es.governanca.main.nav.deviations = "Qué hacer cuando haya desvío";
    es.governanca.main.layers.kicker = "Panel principal";
    es.governanca.main.layers.title = "Gobernanza por Capa";
    es.governanca.main.layers.description = "Las tres capas abajo muestran frecuencia, foco, lectura y accion esperada para mantener la operacion bajo control.";
    es.governanca.main.layers.operationalReading = "Lectura operativa";
    es.governanca.main.layers.executiveReading = "Lectura ejecutiva";
    es.governanca.main.layers.frequencyLabel = "Frecuencia";
    es.governanca.main.layers.focusLabel = "Foco principal";
    es.governanca.main.layers.toolLabel = "Herramienta";
    es.governanca.main.layers.trackLabel = "Que acompanar";
    es.governanca.main.layers.whyLabel = "Por que acompanar";
    es.governanca.main.layers.expectedActionLabel = "Accion esperada";
    es.governanca.main.layers.daily.step = "Capa 1";
    es.governanca.main.layers.daily.name = "Diario";
    es.governanca.main.layers.daily.frequency = "Diario";
    es.governanca.main.layers.daily.focus = "Backlog";
    es.governanca.main.layers.daily.tool = "Power BI";
    es.governanca.main.layers.daily.track.backlog = "Backlog abierto por cola";
    es.governanca.main.layers.daily.track.paused = "Tickets detenidos sin evolucion";
    es.governanca.main.layers.daily.track.aging = "Aging inicial y lectura de cola";
    es.governanca.main.layers.daily.why = "Evita tickets olvidados, cola invisible y envejecimiento descontrolado del backlog.";
    es.governanca.main.layers.daily.expectedAction = "Identificar acumulacion rapidamente y priorizar accion inmediata en la cola critica.";
    es.governanca.main.layers.biweekly.step = "Capa 2";
    es.governanca.main.layers.biweekly.name = "Quincenal";
    es.governanca.main.layers.biweekly.frequency = "Quincenal";
    es.governanca.main.layers.biweekly.focus = "MTTS, MTFC, CSAT, backlog y aging";
    es.governanca.main.layers.biweekly.tool = "Power BI";
    es.governanca.main.layers.biweekly.track.kpis = "MTTS, MTFC, CSAT, backlog y aging";
    es.governanca.main.layers.biweekly.track.status = "Uso correcto de estados y concentracion indebida";
    es.governanca.main.layers.biweekly.track.fields = "Completitud de campos como apoyo de lectura";
    es.governanca.main.layers.biweekly.why = "Saca al equipo de la urgencia diaria y confirma si la operacion corre dentro del estandar esperado.";
    es.governanca.main.layers.biweekly.expectedAction = "Corregir desvíos de proceso, alinear comportamiento operativo y definir responsables de accion.";
    es.governanca.main.layers.monthly.step = "Capa 3";
    es.governanca.main.layers.monthly.name = "Mensual";
    es.governanca.main.layers.monthly.frequency = "Mensual";
    es.governanca.main.layers.monthly.focus = "Cumplimiento de SLA";
    es.governanca.main.layers.monthly.tool = "Power BI";
    es.governanca.main.layers.monthly.track.sla = "Cumplimiento de SLA consolidado";
    es.governanca.main.layers.monthly.track.mtts = "MTTS como indicador de apoyo";
    es.governanca.main.layers.monthly.track.priority = "Prioridades de correccion para el siguiente ciclo";
    es.governanca.main.layers.monthly.why = "Muestra si el estandar de atencion se sostiene y si la operacion entrega consistencia ejecutiva.";
    es.governanca.main.layers.monthly.expectedAction = "Consolidar lectura ejecutiva de la salud operativa y priorizar correcciones estructurales.";
    es.governanca.main.bi.title = "Cómo acompañar en Power BI";
    es.governanca.main.bi.description = "Use BI como herramienta unica de lectura diaria, quincenal y mensual para convertir senal en accion objetiva.";
    es.governanca.main.bi.daily.title = "Diario";
    es.governanca.main.bi.daily.item1 = "Acompañar backlog abierto por cola y equipo.";
    es.governanca.main.bi.daily.item2 = "Identificar tickets detenidos sin movimiento.";
    es.governanca.main.bi.daily.item3 = "Observar aging inicial para accion preventiva.";
    es.governanca.main.bi.biweekly.title = "Quincenal";
    es.governanca.main.bi.biweekly.item1 = "Revisar MTTS, MTFC, CSAT, backlog y aging.";
    es.governanca.main.bi.biweekly.item2 = "Identificar desvíos de proceso y estado.";
    es.governanca.main.bi.biweekly.item3 = "Comparar evolucion entre periodos y equipos.";
    es.governanca.main.bi.monthly.title = "Mensual";
    es.governanca.main.bi.monthly.item1 = "Acompañar cumplimiento de SLA consolidado.";
    es.governanca.main.bi.monthly.item2 = "Usar MTTS como lectura de apoyo.";
    es.governanca.main.bi.monthly.item3 = "Consolidar lectura ejecutiva para priorizacion.";
    es.governanca.main.bi.placeholder.title = "Espacio para captura del panel";
    es.governanca.main.bi.placeholder.description = "Cuando la captura oficial este disponible, insertela aqui con la vista consolidada para lectura rapida.";
    es.governanca.main.deviations.title = "Qué hacer cuando haya desvío";
    es.governanca.main.deviations.description = "Cuando las senales salgan de lo esperado, ejecute accion corta, con responsable definido y en la cadencia adecuada.";
    es.governanca.main.deviations.deviationLabel = "Desvío";
    es.governanca.main.deviations.expectedActionLabel = "Acción esperada";
    es.governanca.main.deviations.items.backlog.name = "Backlog en aumento";
    es.governanca.main.deviations.items.backlog.action = "Revisar cola, redistribuir prioridad y atacar tickets olvidados en la rutina diaria.";
    es.governanca.main.deviations.items.aging.name = "Aging en aumento";
    es.governanca.main.deviations.items.aging.action = "Mapear donde los tickets se detienen y corregir el punto de bloqueo operativo.";
    es.governanca.main.deviations.items.sla.name = "Cumplimiento de SLA en caida";
    es.governanca.main.deviations.items.sla.action = "Repriorizar cola critica y alinear plan de recuperacion en la gobernanza mensual.";
    es.governanca.main.deviations.items.mtts.name = "MTTS empeorando";
    es.governanca.main.deviations.items.mtts.action = "Revisar tiempo de triage y remover bloqueos en el paso a atencion.";
    es.governanca.main.deviations.items.mtfc.name = "MTFC empeorando";
    es.governanca.main.deviations.items.mtfc.action = "Ajustar priorizacion de primera respuesta y monitorear cumplimiento por equipo.";
    es.governanca.main.deviations.items.csat.name = "CSAT en caida";
    es.governanca.main.deviations.items.csat.action = "Revisar calidad de atencion y alinear comunicacion con cliente en colas criticas.";
    es.governanca.main.deviations.items.status.name = "Uso incorrecto de estado";
    es.governanca.main.deviations.items.status.action = "Corregir disciplina de estado en la rutina diaria y reforzar la regla en cadencia quincenal.";
    es.governanca.main.deviations.items.fields.name = "Campos incompletos";
    es.governanca.main.deviations.items.fields.action = "Exigir llenado correcto y bloquear recurrencia con orientacion objetiva para el equipo.";

    es.canaisEntrada.title = "Playbook Global - Canales de Entrada";
    es.canaisEntrada.index.header.title = "Canales de Entrada";
    es.canaisEntrada.index.header.subtitle = "Formas de acceso del cliente a la atencion y garantia de consistencia minima en la apertura del ticket";
    es.canaisEntrada.index.footer = "Playbook Global - Canales de Entrada";

    es.simulador.title = "Playbook Global - Simulador de Ticket";
    es.simulador.index.header.title = "Simulador de Ticket";
    es.simulador.index.header.subtitle = "Simulacion guiada de la jornada operativa de un ticket en el modelo global de atencion";
    es.simulador.index.footer = "Playbook Global - Simulador de Ticket";
    es.simulador.data.scenarios.ticketIdeal.title = "Ticket ideal";
    es.simulador.data.scenarios.ticketIdeal.description = "Ticket abierto con informacion completa y clasificacion correcta.";
    es.simulador.data.scenarios.ticketIncompleto.title = "Ticket incompleto";
    es.simulador.data.scenarios.ticketIncompleto.description = "Ticket abierto con informacion insuficiente.";
    es.simulador.data.scenarios.prioridadeIncorreta.title = "Prioridad incorrecta";
    es.simulador.data.scenarios.prioridadeIncorreta.description = "Ticket con clasificacion de prioridad incorrecta.";
    es.simulador.data.scenarios.dependenciaPeca.title = "Dependencia de repuesto";
    es.simulador.data.scenarios.dependenciaPeca.description = "Ticket que entra en espera de repuesto.";
    es.simulador.data.scenarios.dependenciaAT.title = "Dependencia de asistencia tecnica";
    es.simulador.data.scenarios.dependenciaAT.description = "Ticket con dependencia externa.";
    es.simulador.data.scenarios.canalNaoEstruturado.title = "Canal no estructurado";
    es.simulador.data.scenarios.canalNaoEstruturado.description = "Ticket proveniente de un canal con baja estandarizacion.";
    es.simulador.data.scenarios.cenarioCritico.title = "Escenario critico";
    es.simulador.data.scenarios.cenarioCritico.description = "Ticket con alto impacto operativo.";
    es.simulador.data.scenarioToneMeta.positivo.label = "Positivo";
    es.simulador.data.scenarioToneMeta.negativo.label = "Negativo";
    es.simulador.data.scenarioToneMeta.neutro.label = "Neutro";

    es.tutorialZoho.title = "Playbook Global - Operacion diaria en Zoho Desk";
    es.tutorialZoho.index.header.title = "Operacion diaria en Zoho Desk";
    es.tutorialZoho.index.header.subtitle = "Manual guiado para uso operativo con disciplina de registro y gobernanza";
    es.tutorialZoho.index.footer = "Playbook Global - Operacion diaria en Zoho Desk";
    es.tutorialZoho.data.labels.stepPrefix = "Etapa";
    es.tutorialZoho.data.labels.stepCurrentSuffix = "(etapa actual)";
    es.tutorialZoho.data.labels.startStep = "Iniciar etapa";
    es.tutorialZoho.data.labels.openStep = "Abrir etapa";
    es.tutorialZoho.data.labels.backToHome = "Volver al inicio del modulo";
    es.tutorialZoho.data.labels.viewJourney = "Ver recorrido completo";
    es.tutorialZoho.data.labels.backPrefix = "Volver:";
    es.tutorialZoho.data.labels.nextPrefix = "Avanzar:";
    es.tutorialZoho.data.labels.finishToGovernance = "Avanzar a Gobernanza Global";
    es.tutorialZoho.data.journey = [
        { file: "visao-geral-interface.html", title: "Vision general de la interfaz", summary: "Comprender menus, accesos directos y lectura inicial de la pantalla operativa." },
        { file: "tickets-rotina-operacional.html", title: "Tickets y rutina operativa", summary: "Organizar la lectura diaria del ticket con ownership, estado y evolucion." },
        { file: "views-filtros-work-modes.html", title: "Vistas, filtros y modos de trabajo", summary: "Trabajar la cola con foco en prioridad, backlog y ritmo operativo." },
        { file: "departamentos-na-pratica.html", title: "Departamentos en la practica", summary: "Aplicar el alcance correcto por equipo y evitar mezclar colas." },
        { file: "atualizacao-campos-ticket.html", title: "Actualizacion de campos del ticket", summary: "Garantizar registros consistentes para gobernanza y comparabilidad." },
        { file: "resposta-interacao-ticket.html", title: "Respuesta al cliente e interaccion", summary: "Separar comunicacion externa y notas internas con trazabilidad." },
        { file: "criacao-de-tickets.html", title: "Creacion de tickets", summary: "Abrir tickets con calidad desde la entrada y vinculo correcto de datos." },
        { file: "boas-praticas-operacionais.html", title: "Buenas practicas operativas", summary: "Consolidar disciplina operativa para SLA, aging y backlog confiables." }
    ];

    es.kanban.title = "Playbook Global - Kanban Operativo";
    es.kanban.index.header.title = "02 - Kanban Global";
    es.kanban.index.header.subtitle = "Lectura operativa del flujo de tickets por estado oficial";
    es.kanban.index.footer = "Playbook Global - Modulo 02 Kanban";
    es.kanban.data.nav = [
        { label: "Vision General", href: "index.html" },
        { label: "Estados y Objetivos", href: "estrutura.html" },
        { label: "Reglas y Gestion", href: "regras.html" }
    ];
    es.kanban.data.statuses = [
        { key: "aberto", title: "Abierto", lane: "ativo", objective: "Registrar el ticket y dejarlo listo para triage.", when: "En la apertura, con informacion minima para iniciar la atencion.", correctStay: "Permanencia corta hasta el primer tratamiento.", risk: "Quedar detenido aqui se convierte en backlog oculto de entrada." },
        { key: "em_atendimento", title: "En Atencion", lane: "ativo", objective: "Ejecutar trabajo tecnico real en el ticket.", when: "Solo mientras exista una accion efectiva en curso.", correctStay: "Actualizaciones frecuentes y avances concretos.", risk: "Usarlo como estado generico oculta colas de espera." },
        { key: "aguardando_cliente", title: "Esperando al Cliente", lane: "espera", objective: "Esperar respuesta o accion del cliente.", when: "Cuando el siguiente paso depende objetivamente del cliente.", correctStay: "Con motivo claro de espera y contexto registrado.", risk: "La espera sin contexto reduce el control de aging y SLA." },
        { key: "aguardando_peca", title: "Esperando Repuesto", lane: "espera", objective: "Esperar repuesto, material o logistica para continuidad.", when: "Cuando la ejecucion depende de disponibilidad fisica de insumos.", correctStay: "Con pedido rastreable y previsión de llegada monitoreada.", risk: "Sin control, aumenta el aging sin visibilidad de causa." },
        { key: "aguardando_terceiro", title: "Esperando Tercero / Visita Tecnica", lane: "espera", objective: "Esperar actuacion de tercero o visita tecnica responsable.", when: "Cuando el ticket depende de asistencia tecnica/tercero, interno o externo.", correctStay: "Con dependencia registrada y previsión de retorno monitoreada.", risk: "Sin control de dependencia, el cuello de botella queda invisible." },
        { key: "resolvido", title: "Resuelto", lane: "final", objective: "Registrar la solucion aplicada antes del cierre definitivo.", when: "Cuando la gestion termino, pero aun esta en validacion de cierre.", correctStay: "Con resumen claro de la solucion y evidencias de cierre.", risk: "Saltar esta etapa distorsiona la lectura de retrabajo y calidad." },
        { key: "fechado", title: "Cerrado", lane: "final", objective: "Formalizar cierre con registro minimo de resolucion.", when: "Despues de pasar por Resuelto y validar condiciones de cierre.", correctStay: "Ticket concluido, con trazabilidad de cierre consistente.", risk: "Cerrar antes de tiempo distorsiona el SLA y genera retrabajo por reapertura." }
    ];
    es.kanban.data.languageRows = [
        { pt: "Aberto", en: "Open", es: "Abierto" },
        { pt: "Em Atendimento", en: "In Progress", es: "En Atencion" },
        { pt: "Aguardando Cliente", en: "Waiting for Customer", es: "Esperando al Cliente" },
        { pt: "Aguardando Peca", en: "Waiting for Parts", es: "Esperando Repuesto" },
        { pt: "Aguardando Terceiro / Visita Tecnica", en: "Waiting for Third Party / Technical Visit", es: "Esperando Tercero / Visita Tecnica" },
        { pt: "Resolvido", en: "Resolved", es: "Resuelto" },
        { pt: "Fechado", en: "Closed", es: "Cerrado" }
    ];
    es.kanban.data.validTransitions = [
        "Entrada -> Abierto -> En Atencion",
        "En Atencion -> Esperando al Cliente",
        "En Atencion -> Esperando Repuesto",
        "En Atencion -> Esperando Tercero / Visita Tecnica",
        "En Atencion -> Resuelto",
        "Esperando al Cliente -> En Atencion",
        "Esperando Repuesto -> En Atencion",
        "Esperando Tercero / Visita Tecnica -> En Atencion",
        "Resuelto -> Cerrado"
    ];
    es.kanban.data.avoidMoves = [
        "Abierto -> Cerrado sin tratamiento real",
        "Usar En Atencion sin accion efectiva",
        "Mover a espera sin contexto minimo",
        "Cerrar ticket sin pasar por Resuelto",
        "Movimiento por perfiles fuera del soporte tecnico interno"
    ];
    es.kanban.data.managementSignals = [
        { topic: "Backlog activo", reading: "Volumen alto en Abierto/En Atencion sin giro diario.", action: "Priorizar triage y rebalancear capacidad de la cola activa." },
        { topic: "Cuello de botella en espera", reading: "Concentracion en Esperando Cliente, Tercero/Visita Tecnica o Repuesto.", action: "Actuar sobre el bloqueo dominante y monitorear tiempo de espera." },
        { topic: "Aging", reading: "Tickets envejeciendo en una misma columna.", action: "Abrir plan de accion por causa raiz de la etapa." },
        { topic: "SLA", reading: "Tiempo de respuesta/resolucion presionado por colas incorrectas.", action: "Corregir estados para recuperar la lectura real del cumplimiento." }
    ];
    es.kanban.data.labels.objective = "Objetivo:";
    es.kanban.data.labels.when = "Cuando el ticket debe estar aqui:";
    es.kanban.data.labels.correctStay = "Permanencia correcta:";
    es.kanban.data.labels.risk = "Riesgo de uso incorrecto:";
    es.kanban.data.labels.reading = "Como leer:";
    es.kanban.data.labels.action = "Accion de gestion:";
    es.kanban.data.labels.tablePt = "Portugues";
    es.kanban.data.labels.tableEn = "Ingles";
    es.kanban.data.labels.tableEs = "Espanol";

    es.fluxoGlobal.title = "Playbook Global - Flujo Global";
    es.fluxoGlobal.index.header.title = "Flujo Global";
    es.fluxoGlobal.index.header.subtitle = "Estructura consolidada de la jornada operativa del ticket en el modelo global de atencion";
    es.fluxoGlobal.index.footer = "Playbook Global - Flujo Global";
    es.fluxoGlobal.rulesPage = es.fluxoGlobal.rulesPage || {};
    es.fluxoGlobal.rulesPage.title = "Flujo Global - Reglas y Automatizaciones";
    es.fluxoGlobal.rulesPage.header = es.fluxoGlobal.rulesPage.header || {};
    es.fluxoGlobal.rulesPage.header.title = "Reglas y Automatizaciones";
    es.fluxoGlobal.rulesPage.header.subtitle = "Logica sistemica que sostiene la consistencia operativa";
    es.fluxoGlobal.rulesPage.header.backToFlow = "Volver al Flujo Global";
    es.fluxoGlobal.rulesPage.hero = es.fluxoGlobal.rulesPage.hero || {};
    es.fluxoGlobal.rulesPage.hero.badge = "Motor sistemico del proceso";
    es.fluxoGlobal.rulesPage.hero.title = "Reglas y Automatizaciones";
    es.fluxoGlobal.rulesPage.hero.description = "Esta pagina presenta las reglas operativas y automatizaciones sistemicas que gobiernan el comportamiento del ticket en el flujo global.";
    es.fluxoGlobal.rulesPage.map = {
        title: "Mapa visual de reglas",
        description: "Vista rápida de la lógica que controla el ciclo completo del ticket.",
        steps: [
            { title: "Entrada del ticket", detail: "La demanda se registra por formulario o atención asistida." },
            { title: "Distribución automática", detail: "El sistema lee los campos clave y organiza la cola inicial." },
            { title: "Atención y automatizaciones", detail: "Eventos, registros y control de estado se actualizan automáticamente." },
            { title: "Métricas del flujo", detail: "MTFC, SLA y MTTS acompañan ritmo y cumplimiento operativo." },
            { title: "Resuelto", detail: "Cierre operativo con ventana de reapertura de 24 horas." },
            { title: "Cerrado", detail: "Cierre final sin gestión activa restante." }
        ]
    };
    es.fluxoGlobal.rulesPage.entry = {
        title: "Entrada y creación del ticket",
        description: "La entrada puede variar por canal o país, pero el estándar global exige registro formal como ticket.",
        channels: [
            {
                title: "Formulario",
                detail: "El cliente completa el formulario y el ticket se crea automáticamente en el flujo.",
                actor: "Cliente + Sistema"
            },
            {
                title: "Atención asistida",
                detail: "El agente localiza el registro del cliente y crea o vincula un nuevo ticket.",
                actor: "Agente"
            }
        ],
        globalRule: "Las formas de entrada pueden variar por país/canal, pero toda demanda debe registrarse como ticket."
    };
    es.fluxoGlobal.rulesPage.routing = {
        title: "Distribución automática inicial",
        description: "Regla crítica: justo después de la creación, el sistema usa cuatro campos para dirigir y organizar la cola inicial.",
        fieldsTitle: "Campos que direccionan el ticket",
        flowTitle: "Lógica de distribución",
        fields: ["Región", "Tipo de atención", "Producto", "Categoría"],
        flow: ["Ticket creado", "Sistema lee los campos", "Cola inicial direccionada automáticamente"]
    };
    es.fluxoGlobal.rulesPage.automations = {
        title: "Automatizaciones y campos sistémicos",
        description: "El sistema registra, calcula y controla eventos esenciales para mantener trazabilidad y estándar global.",
        groups: [
            {
                id: "register",
                title: "Registro automático",
                items: ["ID del ticket", "Fecha de apertura", "Canal", "Propietario del ticket (cuando aplique)", "Estado", "Fecha/hora de actualizaciones"]
            },
            {
                id: "calculation",
                title: "Cálculo automático",
                items: ["Prioridad", "SLA de primera respuesta", "SLA de resolución", "Tiempos operativos", "Indicadores de SLA"]
            },
            {
                id: "control",
                title: "Control del flujo",
                items: ["Cambio de estado", "Registro temporal por etapa", "Historial de movimientos", "Fecha de resolución", "Fecha de cierre"]
            }
        ],
        priorityNote: "La prioridad se calcula a partir de los campos definidos y orienta SLA, urgencia y lectura operativa."
    };
    es.fluxoGlobal.rulesPage.metrics = {
        title: "Métricas y cierre",
        description: "Lectura operativa de las métricas principales y reglas de cierre del ciclo.",
        bars: [
            { tag: "MTFC", range: "Apertura -> Primer contacto / primera respuesta", note: "Mide el tiempo inicial de retorno al cliente." },
            { tag: "SLA", range: "Solo en En atención", note: "Monitoreado solo durante el período de trabajo activo." },
            { tag: "MTTS", range: "Apertura -> Resuelto", note: "Mide el tiempo hasta el cierre operativo." }
        ],
        closure: [
            {
                title: "Resuelto",
                points: ["Ticket cerrado operativamente", "Información final registrada", "El cliente puede reabrir dentro de 24 horas"]
            },
            {
                title: "Cerrado",
                points: ["Cierre final", "Ticket sin gestión activa restante"]
            }
        ]
    };
    es.fluxoGlobal.rulesPage.regional = {
        title: "Preparación para adaptación regional futura",
        description: "El flujo actual representa el estándar global. Aún no hay adaptaciones regionales aplicadas. A medida que avance el rollout, pequeñas diferencias operativas podrán registrarse por región sin alterar el mínimo global.",
        selectorLabel: "Base de visualización",
        option: "Estándar Global"
    };
    es.fluxoGlobal.rulesPage.related = {
        title: "Relacionados",
        links: [
            { label: "Etapas del Flujo", href: "etapas-do-fluxo.html" },
            { label: "Campos Obligatorios", href: "../05_Campos_Obrigatorios/index.html" },
            { label: "Prioridad", href: "../04_Prioridade/index.html" },
            { label: "KPIs", href: "../01_KPI/KPI_V2/index.html" },
            { label: "Gobernanza", href: "../06_Governanca/index.html" }
        ]
    };
    es.fluxoGlobal.data.moduleName = "Flujo Global";
    es.fluxoGlobal.data.pages = [
        { href: "index.html", label: "Inicio", title: "Panel consolidado del flujo global en formato operativo." },
        { href: "etapas-do-fluxo.html", label: "Etapas del Flujo", title: "Significado, uso, owner y campos por etapa." },
        { href: "regras-e-automacoes.html", label: "Reglas y Automatizaciones", title: "Prioridad, estado, ownership y logica sistemica." },
        { href: "slas-e-tempos.html", label: "SLAs y Tiempos", title: "Tiempo activo, espera, primera respuesta y resolucion." },
        { href: "excecoes-e-cenarios.html", label: "Excepciones y Escenarios", title: "Caminos no lineales, esperas y reaperturas." },
        { href: "governanca-do-fluxo.html", label: "Gobernanza del Flujo", title: "Backlog, aging y lectura gerencial del flujo." }
    ];
    es.fluxoGlobal.data.stages = [
        { name: "Abierto" },
        { name: "En Atención" },
        { name: "Esperando Cliente" },
        { name: "Esperando Pieza" },
        { name: "Esperando Tercero / Visita Técnica" },
        { name: "Resuelto" },
        { name: "Cerrado" }
    ];
    es.fluxoGlobal.data.labels.breadcrumbHome = "Inicio";
    es.fluxoGlobal.data.labels.pagerPrevious = "Pagina anterior:";
    es.fluxoGlobal.data.labels.pagerNext = "Pagina siguiente:";
    es.fluxoGlobal.data.labels.pagerBackHome = "Volver al inicio del modulo";
    es.fluxoGlobal.data.labels.currentTrackPrefix = "Lectura actual:";
    es.fluxoGlobal.nav = es.fluxoGlobal.nav || {};
    es.fluxoGlobal.nav.home = "Flujo Global";
    es.fluxoGlobal.nav.homeTitle = "Guía visual oficial del flujo.";
    es.fluxoGlobal.nav.flowRead = "Lectura por etapa";
    es.fluxoGlobal.nav.flowReadTitle = "Detalle operativo de los estados oficiales.";
    es.fluxoGlobal.nav.rulesRead = "Reglas y Automatizaciones";
    es.fluxoGlobal.nav.rulesReadTitle = "Reglas sistémicas y automatizaciones del proceso.";
    es.fluxoGlobal.nav.label = "Navegación esencial del módulo";
    es.fluxoGlobal.nav.legacyStages = "Etapas del Flujo";
    es.fluxoGlobal.nav.legacyTimes = "SLAs y Tiempos";
    es.fluxoGlobal.nav.legacyExceptions = "Excepciones y Escenarios";
    es.fluxoGlobal.nav.legacyGovernance = "Gobernanza del Flujo";
    es.fluxoGlobal.globalPattern = es.fluxoGlobal.globalPattern || {};
    es.fluxoGlobal.globalPattern.moduleLabel = "Módulo: Flujo Global";
    es.fluxoGlobal.globalPattern.indexObjective = "Contexto: vista operativa oficial del flujo y de la lógica de atención.";
    es.fluxoGlobal.globalPattern.rulesObjective = "Contexto: reglas sistémicas y operativas para una ejecución consistente del flujo.";
    es.fluxoGlobal.globalPattern.indexSupport = es.fluxoGlobal.globalPattern.indexSupport || {};
    es.fluxoGlobal.globalPattern.indexSupport.readingTitle = "Puntos de atención operativa";
    es.fluxoGlobal.globalPattern.indexSupport.responsibilitiesTitle = "Responsabilidades por estado";
    es.fluxoGlobal.globalPattern.rulesPanel = es.fluxoGlobal.globalPattern.rulesPanel || {};
    es.fluxoGlobal.globalPattern.rulesPanel.statusTitle = "Estados y transiciones";
    es.fluxoGlobal.globalPattern.rulesPanel.transitionsNote = "La transición correcta entre estados mantiene confiable la lectura de cola, aging y productividad.";
    es.fluxoGlobal.globalPattern.rulesPanel.priorityTitle = "Prioridad y SLA";
    es.fluxoGlobal.globalPattern.rulesPanel.exceptionsTitle = "Excepciones esenciales";
    es.fluxoGlobal.globalPattern.rulesPanel.closureTitle = "Cierre operativo";
    es.fluxoGlobal.globalPattern.rulesPanel.exceptionWaiting = "Los estados de espera deben usarse solo con contexto claro de dependencia externa.";
    es.fluxoGlobal.globalPattern.rulesSupport = es.fluxoGlobal.globalPattern.rulesSupport || {};
    es.fluxoGlobal.globalPattern.rulesSupport.quickReadTitle = "Lectura operativa rápida";
    es.fluxoGlobal.globalPattern.rulesSupport.ownershipTitle = "Responsabilidades críticas";
    es.fluxoGlobal.globalPattern.rulesSupport.ownershipRule = "El sistema cierra el ciclo y el agente garantiza trazabilidad durante toda la gestión.";

    es.fluxoGlobal.landing = es.fluxoGlobal.landing || {};
    es.fluxoGlobal.landing.guideHero = es.fluxoGlobal.landing.guideHero || {};
    es.fluxoGlobal.landing.guideHero.badge = "Guía oficial del proceso";
    es.fluxoGlobal.landing.guideHero.title = "Flujo Global de atención de punta a punta";
    es.fluxoGlobal.landing.guideHero.description = "Lectura visual y operativa del ticket: entrada, distribución automática, estados oficiales, puntos de automatización, métricas y reglas de cierre.";

    es.fluxoGlobal.kanban = es.fluxoGlobal.kanban || {};
    es.fluxoGlobal.kanban.fieldLabels = es.fluxoGlobal.kanban.fieldLabels || {};
    es.fluxoGlobal.kanban.fieldLabels.automatic = "Automático";
    es.fluxoGlobal.kanban.fieldLabels.required = "Campos obligatorios";
    es.fluxoGlobal.kanban.fieldLabels.conditional = "Condicional";
    es.fluxoGlobal.kanban.fieldLabels.desirable = "Campos deseables";
    es.fluxoGlobal.kanban.labels = es.fluxoGlobal.kanban.labels || {};
    es.fluxoGlobal.kanban.labels.actors = "Actúa:";
    es.fluxoGlobal.kanban.labels.happens = "Qué sucede:";
    es.fluxoGlobal.kanban.labels.rule = "Regla/Automatización:";
    es.fluxoGlobal.kanban.labels.stageFields = "Información de la etapa";
    es.fluxoGlobal.kanban.labels.legendTitle = "Leyenda";
    es.fluxoGlobal.kanban.metrics = es.fluxoGlobal.kanban.metrics || {};
    es.fluxoGlobal.kanban.metrics.mtfcRange = "Abierto -> Primer contacto / primera respuesta";
    es.fluxoGlobal.kanban.metrics.slaRange = "Medido solo en En atención";
    es.fluxoGlobal.kanban.metrics.mttsRange = "Abierto -> Resuelto";

    es.fluxoGlobal.homeGuideKanban = {
        summary: {
            title: "Kanban Global del Proceso",
            description: "Panel oficial único para leer el flujo global: entrada, distribución, estados, reglas y métricas en un solo contexto."
        },
        topStrip: {
            entryTitle: "Entrada del Ticket",
            entries: [
                { title: "Formulario", detail: "El cliente completa el formulario y el ticket se crea automáticamente con datos iniciales.", actor: "Cliente + Sistema" },
                { title: "Atención asistida", detail: "El agente localiza el registro del cliente y crea o vincula un ticket para iniciar la gestión.", actor: "Agente" }
            ],
            routingTitle: "Distribución automática",
            routingFields: ["Región", "Tipo de atención", "Producto", "Categoría"],
            routingNote: "El sistema usa estos cuatro campos para enviar el ticket a la cola inicial correcta."
        },
        columns: [
            {
                name: "Abierto",
                objective: "Ticket registrado formalmente y listo para la gestión.",
                actors: "Sistema / Agente",
                happens: "Apertura formal del ticket con validación mínima para clasificar y distribuir.",
                autoRule: "El sistema registra la apertura, datos iniciales e indicadores base.",
                metricTag: "Inicia MTTS",
                fields: {
                    automatic: ["ID del ticket", "Fecha/hora de apertura", "Canal", "Propietario del ticket", "Prioridad", "SLA de primera respuesta", "SLA de resolución"],
                    required: ["Región", "Solicitante", "Tipo de atención", "Categoría", "Producto(s)", "Marca del producto", "Asunto", "Descripción", "Teléfono"],
                    conditional: ["Número de serie del equipo", "Estado (Brasil)", "Provincia (Argentina)", "Asistencia/distribuidor cuando aplique"],
                    desirable: []
                },
                note: "MTTS empieza a contar desde la apertura formal.",
                tone: "open"
            },
            {
                name: "En atención",
                objective: "Gestión activa y diagnóstico del caso.",
                actors: "Agente",
                happens: "Ejecución de triage, interacción con cliente, análisis y acciones de solución.",
                autoRule: "El sistema registra movimientos, tiempos operativos e historial de actualizaciones.",
                metricTag: "SLA corre aquí",
                fields: {
                    automatic: ["Estado", "Fecha/hora de actualización", "Tiempos operativos", "Registros sistémicos de movimiento"],
                    required: [],
                    conditional: [],
                    desirable: ["Zero hour o Out of the box", "¿Requiere pieza? Sí/No", "¿RAC enviada? Sí/No", "Tipo de asistencia técnica", "Partner/distribuidor cuando no esté en obligatorios"]
                },
                note: "Es la etapa central del trabajo activo.",
                tone: "active"
            },
            {
                name: "Esperando Cliente",
                objective: "Esperar respuesta o confirmación del cliente.",
                actors: "Cliente / Agente",
                happens: "El flujo depende de información o confirmación del cliente para continuar.",
                autoRule: "El sistema registra el cambio de estado y el tiempo en espera.",
                metricTag: "Espera",
                fields: {
                    automatic: ["Cambio de estado", "Registro temporal de la etapa"],
                    required: [],
                    conditional: [],
                    desirable: ["Pendencia registrada para seguimiento"]
                },
                note: "Separa dependencia externa del trabajo activo.",
                tone: "waiting"
            },
            {
                name: "Esperando Pieza",
                objective: "Esperar pieza o insumo para continuar.",
                actors: "Agente / Suministros",
                happens: "La ejecución depende de disponibilidad de material para concluir la solución.",
                autoRule: "El sistema registra la espera logística y la evolución de la etapa.",
                metricTag: "Espera",
                fields: {
                    automatic: ["Cambio de estado", "Registro de etapa", "Tiempo de espera"],
                    required: [],
                    conditional: [],
                    desirable: ["¿Requiere pieza? Sí/No", "Complemento operativo cuando aplique"]
                },
                note: "Separa dependencia de material de la ejecución activa.",
                tone: "waiting"
            },
            {
                name: "Esperando Tercero / Visita Técnica",
                objective: "Esperar ejecución técnica externa.",
                actors: "Agente / Tercero",
                happens: "El flujo depende de un tercero o de una visita técnica para avanzar.",
                autoRule: "El sistema registra el traspaso y el retorno previsto.",
                metricTag: "Espera",
                fields: {
                    automatic: ["Cambio de estado", "Registro de etapa"],
                    required: [],
                    conditional: [],
                    desirable: ["Tipo de asistencia técnica", "¿RAC enviada? Sí/No cuando aplique"]
                },
                note: "Separa cola externa de ejecución interna.",
                tone: "waiting"
            },
            {
                name: "Resuelto",
                objective: "Cierre operativo con información final registrada.",
                actors: "Agente / Sistema",
                happens: "Solución aplicada y comunicación final registrada.",
                autoRule: "El cliente puede reabrir dentro de 24 horas antes del cierre final.",
                metricTag: "Termina MTTS",
                fields: {
                    automatic: ["Fecha/hora de resolución", "Fin de MTTS"],
                    required: ["Resumen de resolución"],
                    conditional: [],
                    desirable: ["Motivo de cierre", "Solución en campo/remota", "Pieza utilizada", "Cantidad final de piezas"]
                },
                note: "Cierre operativo con ventana de reapertura de 24 horas.",
                tone: "resolved"
            },
            {
                name: "Cerrado",
                objective: "Cierre final del ticket.",
                actors: "Sistema",
                happens: "Ticket concluido sin gestión activa pendiente.",
                autoRule: "Cierre definitivo después de la ventana de reapertura.",
                metricTag: "Cerrado",
                fields: {
                    automatic: ["Fecha/hora de cierre", "Cierre final del ticket"],
                    required: [],
                    conditional: [],
                    desirable: []
                },
                note: "Representa el fin definitivo de la jornada del ticket.",
                tone: "closed"
            }
        ],
        compactRules: [
            "El ticket entra automáticamente o por acción del agente",
            "La distribución inicial usa Región, Tipo de atención, Producto y Categoría",
            "El sistema registra y calcula eventos del flujo",
            "Resuelto permite reapertura en 24 horas",
            "Cerrado es el cierre final"
        ],
        metricsLegend: {
            title: "Lectura de métricas en el panel",
            mtfc: "MTFC: desde la apertura hasta el primer contacto / primera respuesta",
            sla: "SLA: medido solo en En atención",
            mtts: "MTTS: de Abierto a Resuelto"
        },
        regional: {
            title: "Adaptación regional futura",
            description: "El flujo actual representa el estándar global. En futuros despliegues se podrán incorporar pequeñas diferencias regionales sin alterar el mínimo global.",
            selectorLabel: "Base de visualización",
            option: "Estándar Global"
        },
        related: {
            text: "Relacionados:",
            links: [
                { label: "Campos Obligatorios", href: "../05_Campos_Obrigatorios/index.html" },
                { label: "Prioridad", href: "../04_Prioridade/index.html" },
                { label: "Gobernanza", href: "../06_Governanca/index.html" },
                { label: "KPIs", href: "../01_KPI/KPI_V2/index.html" },
                { label: "Kanban", href: "../02_Kanban/index.html" }
            ]
        }
    };

    es.fluxoGlobal.stagesPage = {
        title: "Flujo Global - Etapas del Flujo",
        header: {
            title: "Etapas del Flujo",
            subtitle: "Significado operativo de cada estado del ticket",
            backToFlow: "Volver a Flujo Global"
        },
        hero: {
            title: "Etapas del Flujo",
            description: "Entiende el rol de cada estado, quién actúa y qué información entra en cada etapa."
        },
        overview: {
            title: "Visión general de las etapas",
            description: "Lectura rápida de la secuencia oficial antes del detalle de cada etapa."
        },
        details: {
            title: "Etapas detalladas",
            empty: "No aplica en esta etapa.",
            stages: [
                {
                    id: "opened",
                    title: "Abierto",
                    objective: "Ticket formalmente registrado y listo para la gestión.",
                    actors: ["Sistema", "Agente"],
                    happens: [
                        "Registro del ticket",
                        "Entrada formal al flujo",
                        "Preparación para triage y atención"
                    ],
                    info: {
                        automatic: ["ID del ticket", "Fecha de apertura", "Canal", "Propietario del ticket", "Prioridad", "SLA de primera respuesta", "SLA de resolución"],
                        required: ["Región", "Solicitante", "Tipo de atención", "Categoría", "Producto(s)", "Marca del producto", "Asunto", "Descripción", "Teléfono"],
                        conditional: ["Número de serie del equipo", "Estado (Brasil)", "Provincia (Argentina)", "Nombre de asistencia/distribuidor cuando aplique"],
                        desirable: []
                    },
                    notes: [
                        "El ticket puede crearse automáticamente por formulario o por acción del agente.",
                        "MTTS empieza a contar desde la apertura.",
                        "MTFC mide desde la apertura hasta el primer contacto / primera respuesta."
                    ]
                },
                {
                    id: "inProgress",
                    title: "En atención",
                    objective: "Conducir la gestión activa del caso.",
                    actors: ["Agente"],
                    happens: [
                        "Análisis y triage",
                        "Respuesta al cliente",
                        "Definición del siguiente paso",
                        "Gestión operativa y resolución cuando aplique"
                    ],
                    info: {
                        automatic: ["Estado", "Fecha/hora de actualización", "Tiempos operativos", "Registros sistémicos de movimiento"],
                        required: [],
                        conditional: [],
                        desirable: ["Zero hour o Out of the box", "¿Requiere pieza? Sí/No", "¿RAC enviada? Sí/No", "Tipo de asistencia técnica", "Partner/distribuidor cuando no esté en obligatorios"]
                    },
                    notes: [
                        "SLA se mide solo en esta etapa.",
                        "MTFC se relaciona con el primer contacto dentro de la jornada activa.",
                        "Esta es la etapa central del trabajo operativo."
                    ]
                },
                {
                    id: "waitingCustomer",
                    title: "Esperando Cliente",
                    objective: "Separar la dependencia de respuesta del cliente del trabajo activo del agente.",
                    actors: ["Cliente", "Agente"],
                    happens: [
                        "Espera por confirmación",
                        "Espera por información adicional",
                        "Espera por retorno necesario para continuar"
                    ],
                    info: {
                        automatic: ["Cambio de estado", "Registro temporal de la etapa"],
                        required: [],
                        conditional: [],
                        desirable: ["Complementación de información necesaria para el caso"]
                    },
                    notes: [
                        "Esta etapa diferencia espera del cliente de trabajo activo.",
                        "No debe leerse como atención activa."
                    ]
                },
                {
                    id: "waitingPart",
                    title: "Esperando Pieza",
                    objective: "Separar la dependencia de material/pieza de la gestión activa.",
                    actors: ["Agente", "Suministros"],
                    happens: [
                        "Espera por pieza",
                        "Espera por material",
                        "Espera por suministro/logística"
                    ],
                    info: {
                        automatic: ["Cambio de estado", "Registro de etapa", "Tiempo de espera"],
                        required: [],
                        conditional: [],
                        desirable: ["¿Requiere pieza? Sí/No", "Información operativa complementaria cuando aplique"]
                    },
                    notes: [
                        "Esta etapa diferencia la dependencia logística de la actuación activa del agente."
                    ]
                },
                {
                    id: "waitingThirdParty",
                    title: "Esperando Tercero / Visita Técnica",
                    objective: "Separar dependencia de tercero, soporte externo o visita técnica de la ejecución interna.",
                    actors: ["Agente", "Tercero"],
                    happens: [
                        "Espera por atención externa",
                        "Espera por visita técnica",
                        "Seguimiento de ejecución en campo"
                    ],
                    info: {
                        automatic: ["Cambio de estado", "Registro de etapa"],
                        required: [],
                        conditional: [],
                        desirable: ["Tipo de asistencia técnica", "¿RAC enviada? Sí/No cuando aplique"]
                    },
                    notes: [
                        "Esta etapa diferencia dependencia externa de ejecución interna."
                    ]
                },
                {
                    id: "resolved",
                    title: "Resuelto",
                    objective: "Cerrar operativamente el ticket con información final registrada.",
                    actors: ["Agente", "Sistema"],
                    happens: [
                        "Resolución aplicada",
                        "Conclusión operativa",
                        "Registro final de la solución",
                        "Cierre de la jornada operativa"
                    ],
                    info: {
                        automatic: ["Fecha de resolución", "Cierre de MTTS"],
                        required: ["Resolución / resumen final de la resolución"],
                        conditional: [],
                        desirable: ["Motivo del cierre", "Solución en campo/remota", "Pieza utilizada", "Cantidad final de piezas"]
                    },
                    notes: [
                        "El cliente puede reabrir el ticket dentro de 24 horas.",
                        "Este estado sostiene la ventana de reapertura."
                    ]
                },
                {
                    id: "closed",
                    title: "Cerrado",
                    objective: "Cierre final y definitivo del ticket.",
                    actors: ["Sistema"],
                    happens: [
                        "Cierre definitivo",
                        "Sin gestión activa restante"
                    ],
                    info: {
                        automatic: ["Fecha de cierre", "Cierre final del ticket"],
                        required: [],
                        conditional: [],
                        desirable: []
                    },
                    notes: [
                        "Cerrado representa el fin definitivo de la jornada."
                    ]
                }
            ]
        },
        infoLabels: {
            automatic: "Automático",
            required: "Obligatorio",
            conditional: "Condicional",
            desirable: "Deseable"
        },
        labels: {
            objective: "Objetivo:",
            actors: "Quién actúa",
            happens: "Qué sucede en esta etapa",
            stageInfo: "Información de la etapa",
            notes: "Reglas rápidas y observaciones"
        },
        finalNotes: {
            title: "Reglas y observaciones importantes",
            items: [
                "El ticket puede crearse automáticamente o por acción del agente.",
                "La distribución inicial es automática con base en Región, Tipo de atención, Producto y Categoría.",
                "SLA se mide solo en En atención.",
                "MTFC mide desde la apertura al primer contacto / primera respuesta.",
                "MTTS mide desde la apertura hasta Resuelto.",
                "Resuelto permite reapertura por hasta 24 horas.",
                "Cerrado representa el cierre final."
            ]
        }
    };

    window.PLAYBOOK_I18N_LOCALES["es"] = es;
})();

(function () {
    const es = window.PLAYBOOK_I18N_LOCALES["es"];
    if (!es || !es.security) return;

    es.security.login.title = "Entrar - Playbook Global";
    es.security.login.kicker = "Nueva capa de seguridad";
    es.security.login.heroTitle = "Acceso aprobado para proteger el Playbook Global";
    es.security.login.notice = "Esta es una nueva funcionalidad de seguridad del Playbook Global. Para proteger la información del proyecto, ahora es necesario entrar con una cuenta aprobada. Contamos con la comprensión de todos durante esta actualización.";
    es.security.login.cardTitle = "Entrar al Playbook";
    es.security.login.cardLead = "Usa tu correo corporativo y contraseña. Los nuevos registros quedan pendientes hasta la aprobación administrativa.";
    es.security.auth.loginTab = "Entrar";
    es.security.auth.signupTab = "Registrarse";
    es.security.auth.loginAction = "Entrar";
    es.security.auth.signupAction = "Solicitar registro";
    es.security.auth.resetAction = "Enviar recuperación";
    es.security.auth.forgotPassword = "Olvidé mi contraseña";
    es.security.auth.backToLogin = "Volver al login";
    es.security.auth.loading = "Procesando...";
    es.security.auth.logout = "Salir";
    es.security.auth.signupSuccess = "Registro recibido. Después de confirmar el correo, espera la aprobación administrativa.";
    es.security.auth.resetSent = "Si el correo está registrado, recibirás un enlace para redefinir la contraseña.";
    es.security.fields.email = "Correo";
    es.security.fields.password = "Contraseña";
    es.security.fields.newPassword = "Nueva contraseña";
    es.security.fields.confirmPassword = "Confirmar contraseña";
    es.security.validation.email = "Informa un correo válido.";
    es.security.validation.passwordRequired = "Informa la contraseña.";
    es.security.validation.passwordStrength = "Usa al menos 12 caracteres con mayúscula, minúscula, número y símbolo.";
    es.security.validation.passwordHint = "Usa al menos 12 caracteres con mayúscula, minúscula, número y símbolo.";
    es.security.validation.passwordMatch = "La confirmación de contraseña no coincide.";
    es.security.status.Pendente = "Registro recibido. Espera la aprobación administrativa para acceder al Playbook.";
    es.security.status.Aprovado = "Cuenta aprobada.";
    es.security.status.Recusado = "Registro rechazado. Contacta al administrador del Playbook.";
    es.security.status.Suspenso = "Cuenta suspendida. Contacta al administrador del Playbook.";
    es.security.statusLabel.Pendente = "Pendiente";
    es.security.statusLabel.Aprovado = "Aprobado";
    es.security.statusLabel.Recusado = "Rechazado";
    es.security.statusLabel.Suspenso = "Suspendido";
    es.security.errors.invalidCredentials = "Correo o contraseña inválidos. Verifica los datos e intenta nuevamente.";
    es.security.errors.signupExists = "Este correo ya tiene registro o está aguardando confirmación.";
    es.security.errors.signupFailed = "No fue posible concluir el registro ahora.";
    es.security.errors.resetFailed = "No fue posible enviar la recuperación de contraseña ahora.";
    es.security.errors.authUnavailableTitle = "No fue posible validar el acceso.";
    es.security.errors.authUnavailable = "Actualiza la página o intenta nuevamente en unos instantes.";
    es.security.user.account = "Cuenta";
    es.security.user.admin = "Admin";
    es.security.user.user = "Usuario";
    es.security.user.approved = "Aprobado";
    es.security.password.title = "Cambiar contraseña - Playbook Global";
    es.security.password.kicker = "Actualización obligatoria";
    es.security.password.heroTitle = "Define una nueva contraseña segura";
    es.security.password.heroText = "Para concluir tu acceso al Playbook Global, actualiza la contraseña antes de continuar.";
    es.security.password.cardTitle = "Cambiar contraseña";
    es.security.password.cardLead = "Elige una contraseña fuerte y exclusiva para esta cuenta.";
    es.security.password.submit = "Guardar nueva contraseña";
    es.security.password.success = "Contraseña cambiada con éxito.";
    es.security.password.error = "No fue posible cambiar la contraseña ahora.";
    es.security.password.profileWarning = "La contraseña fue cambiada, pero no fue posible actualizar el perfil. Intenta entrar nuevamente.";
    es.security.admin.title = "Administración del Playbook";
    es.security.admin.nav = "Administración";
    es.security.admin.headerTitle = "Administración del Playbook";
    es.security.admin.headerSubtitle = "Aprobación y gobernanza de usuarios";
    es.security.admin.breadcrumb = "Seguridad > Usuarios";
    es.security.admin.pageTitle = "Administración del Playbook";
    es.security.admin.pageLead = "Aprueba, rechaza, suspende o reactiva usuarios con trazabilidad administrativa.";
    es.security.admin.usersTitle = "Usuarios registrados";
    es.security.admin.searchLabel = "Buscar correo";
    es.security.admin.searchPlaceholder = "nombre@empresa.com";
    es.security.admin.statusFilter = "Filtrar por estado";
    es.security.admin.allStatuses = "Todos";
    es.security.admin.refresh = "Actualizar";
    es.security.admin.loading = "Cargando usuarios...";
    es.security.admin.empty = "Ningún usuario encontrado para los filtros actuales.";
    es.security.admin.loaded = "Usuarios cargados con éxito.";
    es.security.admin.loadError = "Error al cargar usuarios.";
    es.security.admin.actionSuccess = "Acción realizada con éxito.";
    es.security.admin.actionError = "Error al ejecutar acción.";
    es.security.admin.selfProtected = "Cuenta actual protegida";
    es.security.admin.actions = es.security.admin.actions && typeof es.security.admin.actions === "object"
        ? es.security.admin.actions : {};
    es.security.admin.confirm = es.security.admin.confirm && typeof es.security.admin.confirm === "object"
        ? es.security.admin.confirm : {};
    es.security.admin.table = es.security.admin.table && typeof es.security.admin.table === "object"
        ? es.security.admin.table : {};
    es.security.admin.actions.approve = "Aprobar";
    es.security.admin.actions.reject = "Rechazar";
    es.security.admin.actions.suspend = "Suspender";
    es.security.admin.actions.reactivate = "Reactivar";
    es.security.admin.confirm.approve = "¿Confirmas la aprobación de este usuario?";
    es.security.admin.confirm.reject = "¿Confirmas el rechazo de este usuario?";
    es.security.admin.confirm.suspend = "¿Confirmas la suspensión de este usuario?";
    es.security.admin.confirm.reactivate = "¿Confirmas la reactivación de este usuario?";
    es.security.admin.table.email = "Correo";
    es.security.admin.table.status = "Estado";
    es.security.admin.table.role = "Perfil";
    es.security.admin.table.created = "Registro";
    es.security.admin.table.updated = "Última alteración";
    es.security.admin.table.actions = "Acciones";
})();

(function () {
    const es = window.PLAYBOOK_I18N_LOCALES["es"];
    if (!es) return;

    es.home = es.home || {};
    es.home.header = es.home.header || {};
    es.home.hero = es.home.hero || {};
    es.home.quickAccess = es.home.quickAccess || {};
    es.home.quickAccess.items = es.home.quickAccess.items || {};

    es.home.title = "Playbook Global - Inicio";
    es.home.logo = "PLAYBOOK GLOBAL";

    es.home.header.subtitle = "Portal Operativo de Global Service Governance";
    es.home.header.menuAria = "Abrir menú principal";
    es.home.header.primaryNavAria = "Navegación principal del portal";
    es.home.header.ctaBi = "Acceder al BI";

    es.home.hero.kicker = "Hub Operativo Global";
    es.home.hero.mainTitle = "Estandarice la atención global y haga de nuestro cliente el héroe";
    es.home.hero.mainSubtitle = "Elija su eje de trabajo y siga rutas claras para operar con consistencia global.";
    es.home.hero.ctaModules = "Onboarding (Aprender)";
    es.home.hero.ctaBi = "Acceder al BI (Analizar)";

    es.home.quickAccess.title = "Acceso rápido";
    es.home.quickAccess.subtitle = "Empieza por los estándares globales, avanza con la guía práctica de Zoho Desk y usa BI para seguir la operación.";

    es.home.quickAccess.items.globalService = es.home.quickAccess.items.globalService || {};
    es.home.quickAccess.items.globalService.pill = "Primer paso";
    es.home.quickAccess.items.globalService.title = "Global Service";
    es.home.quickAccess.items.globalService.desc = "Comprende el estándar global de atención, las reglas operativas, la gobernanza y la estructura base del service.";

    es.home.quickAccess.items.zohoHelp = es.home.quickAccess.items.zohoHelp || {};
    es.home.quickAccess.items.zohoHelp.pill = "Guía práctica";
    es.home.quickAccess.items.zohoHelp.title = "¿Dudas sobre Zoho?";
    es.home.quickAccess.items.zohoHelp.desc = "Ve directo al eje Zoho Desk y encuentra las orientaciones operativas disponibles ahora.";

    es.home.quickAccess.items.bi = es.home.quickAccess.items.bi || {};
    es.home.quickAccess.items.bi.pill = "Seguimiento";
    es.home.quickAccess.items.bi.title = "BI Ejecutivo";
    es.home.quickAccess.items.bi.desc = "Monitorea indicadores, desempeño y riesgos operativos después de alinear estándar y operación.";

    es.home.quickAccess.items.tutorial = es.home.quickAccess.items.tutorial || {};
    es.home.quickAccess.items.tutorial.pill = "Tutorial";
    es.home.quickAccess.items.tutorial.title = "Tutorial Zoho Desk";
    es.home.quickAccess.items.tutorial.desc = "Aprende el uso operativo de Zoho Desk con una guía práctica para la rutina.";
    es.home.quickAccess.items.tutorial.status = "";

    es.home.quickAccess.items.zohoDesk = es.home.quickAccess.items.zohoDesk || {};
    es.home.quickAccess.items.zohoDesk.pill = es.home.quickAccess.items.zohoHelp.pill;
    es.home.quickAccess.items.zohoDesk.title = es.home.quickAccess.items.zohoHelp.title;
    es.home.quickAccess.items.zohoDesk.desc = es.home.quickAccess.items.zohoHelp.desc;

    es.home.training = es.home.training || {};
    es.home.training.badge_initial = "Ruta inicial";
    es.home.training.badge_basic = "Ruta básica disponible";
    es.home.training.title = "Primeros pasos en Zoho Desk";
    es.home.training.description = "Capacitación básica para quienes están empezando: tickets, vistas y acciones esenciales del día a día.";
    es.home.training.description_full = "Aprende a acceder al sistema, entender tickets, navegar por vistas y ejecutar actualizaciones esenciales en la atención.";

    es.home.axes = es.home.axes || {};
    es.home.axes.zohoDesk = es.home.axes.zohoDesk || {};
    es.home.axes.zohoDesk.badge = "ZOHO DESK";
    es.home.axes.zohoDesk.title = "Zoho Desk | Operación y Administración";
    es.home.axes.zohoDesk.desc = "Guías prácticas para usar, registrar, responder a clientes y administrar Zoho Desk con consistencia dentro del modelo global.";
    es.home.axes.zohoDesk.cta = "Entrar a Zoho Desk";

    es.home.axes.zohoDesk.mainCards = es.home.axes.zohoDesk.mainCards || {};
    es.home.axes.zohoDesk.mainCards.tutorial = es.home.axes.zohoDesk.mainCards.tutorial || {};
    es.home.axes.zohoDesk.mainCards.tutorial.title = "Tutorial Zoho Desk";
    es.home.axes.zohoDesk.mainCards.tutorial.desc = "Aprende a usar Zoho Desk en la operación diaria: tratar tickets, responder a clientes, registrar información, adjuntar evidencias y aplicar correctamente estados, prioridad y cierre.";
    es.home.axes.zohoDesk.mainCards.tutorial.cta = "Abrir tutorial";
    es.home.axes.zohoDesk.mainCards.admin = es.home.axes.zohoDesk.mainCards.admin || {};
    es.home.axes.zohoDesk.mainCards.admin.title = "Edición y Administración";
    es.home.axes.zohoDesk.mainCards.admin.desc = "Aprende a editar y mantener la estructura del sistema: layouts, campos, reglas, automatizaciones, distribución y ajustes operativos en Zoho Desk.";
    es.home.axes.zohoDesk.mainCards.admin.cta = "Abrir administración";

    es.home.axes.zohoDesk.summary = es.home.axes.zohoDesk.summary || {};
    es.home.axes.zohoDesk.summary.tutorial = es.home.axes.zohoDesk.summary.tutorial || {};
    es.home.axes.zohoDesk.summary.tutorial.title = "En el Tutorial Zoho Desk";
    es.home.axes.zohoDesk.summary.tutorial.items = es.home.axes.zohoDesk.summary.tutorial.items || {};
    es.home.axes.zohoDesk.summary.tutorial.items.gettingStarted = "Primeros pasos";
    es.home.axes.zohoDesk.summary.tutorial.items.handleTicket = "Cómo tratar un ticket";
    es.home.axes.zohoDesk.summary.tutorial.items.replyCustomer = "Cómo responder al cliente";
    es.home.axes.zohoDesk.summary.tutorial.items.documentEvidence = "Cómo registrar información y evidencias";
    es.home.axes.zohoDesk.summary.tutorial.items.statusPriorityClosure = "Estado, prioridad y cierre";
    es.home.axes.zohoDesk.summary.admin = es.home.axes.zohoDesk.summary.admin || {};
    es.home.axes.zohoDesk.summary.admin.title = "En Edición y Administración";
    es.home.axes.zohoDesk.summary.admin.items = es.home.axes.zohoDesk.summary.admin.items || {};
    es.home.axes.zohoDesk.summary.admin.items.layoutsFields = "Layouts y campos";
    es.home.axes.zohoDesk.summary.admin.items.rulesAutomations = "Reglas y automatizaciones";
    es.home.axes.zohoDesk.summary.admin.items.roundRobinDistribution = "Round robin y distribución";
    es.home.axes.zohoDesk.summary.admin.items.structuralAdjustments = "Ajustes estructurales";
    es.home.axes.zohoDesk.summary.admin.items.functionalEvolution = "Evolucion funcional";

    es.home.axes.zohoDesk.tutorialInfo = es.home.axes.zohoDesk.tutorialInfo || {};
    es.home.axes.zohoDesk.tutorialInfo.title = "C\u00F3mo funciona el tutorial";
    es.home.axes.zohoDesk.tutorialInfo.text = "El tutorial de Zoho Desk fue organizado para apoyar el uso pr\u00E1ctico de la herramienta en la operaci\u00F3n diaria. El contenido comienza con los primeros pasos en la plataforma y avanza hacia el tratamiento de tickets, respuesta al cliente, registro de informaci\u00F3n, evidencias, estado, prioridad y cierre. La idea es permitir una navegaci\u00F3n simple por tema, \u00FAtil tanto para el aprendizaje inicial como para la consulta r\u00E1pida durante la operaci\u00F3n.";

    es.home.axes.zohoDesk.tutorialHome = es.home.axes.zohoDesk.tutorialHome || {};
    es.home.axes.zohoDesk.tutorialHome.hero = es.home.axes.zohoDesk.tutorialHome.hero || {};
    es.home.axes.zohoDesk.tutorialHome.hero.tag = "TUTORIAL ZOHO DESK";
    es.home.axes.zohoDesk.tutorialHome.hero.title = "Tutorial Zoho Desk";
    es.home.axes.zohoDesk.tutorialHome.hero.description = "Aprende a usar Zoho Desk seg\u00FAn el est\u00E1ndar operativo de Alliage, con orientaci\u00F3n pr\u00E1ctica para tratar tickets, responder a clientes, registrar informaci\u00F3n, adjuntar evidencias y aplicar correctamente estado, prioridad y cierre.";
    es.home.axes.zohoDesk.tutorialHome.hero.primaryCta = "Comenzar el tutorial";
    es.home.axes.zohoDesk.tutorialHome.hero.secondaryCta = "Ver Zoho Desk";

    es.home.axes.zohoDesk.tutorialHome.howToUse = es.home.axes.zohoDesk.tutorialHome.howToUse || {};
    es.home.axes.zohoDesk.tutorialHome.howToUse.title = "C\u00F3mo usar este tutorial";
    es.home.axes.zohoDesk.tutorialHome.howToUse.kicker = "Guia de navegacion";
    es.home.axes.zohoDesk.tutorialHome.howToUse.text = "Usa esta pagina como guia de navegacion: comienza por la ruta recomendada oficial de 5 pasos y luego consulta la biblioteca de 9 modulos segun la necesidad operativa.";
    es.home.axes.zohoDesk.tutorialHome.howToUse.points = es.home.axes.zohoDesk.tutorialHome.howToUse.points || {};
    es.home.axes.zohoDesk.tutorialHome.howToUse.points.organizedByTheme = "Organizado por tema para acelerar la navegacion.";
    es.home.axes.zohoDesk.tutorialHome.howToUse.points.initialTraining = "Puede usarse como entrenamiento inicial de la operacion.";
    es.home.axes.zohoDesk.tutorialHome.howToUse.points.quickConsultation = "Tambien funciona como consulta rapida durante la rutina.";
    es.home.axes.zohoDesk.tutorialHome.howToUse.points.followPathThenLibrary = "Sigue primero la ruta oficial de 5 pasos y luego usa los 9 modulos segun necesidad.";

    es.home.axes.zohoDesk.tutorialHome.recommendedPath = es.home.axes.zohoDesk.tutorialHome.recommendedPath || {};
    es.home.axes.zohoDesk.tutorialHome.recommendedPath.kicker = "Jornada oficial de 5 pasos";
    es.home.axes.zohoDesk.tutorialHome.recommendedPath.title = "Ruta recomendada";
    es.home.axes.zohoDesk.tutorialHome.recommendedPath.description = "Este tutorial mantiene siempre la misma jornada oficial de 5 pasos. Completa la ruta antes de pasar a la biblioteca completa.";
    es.home.axes.zohoDesk.tutorialHome.recommendedPath.steps = es.home.axes.zohoDesk.tutorialHome.recommendedPath.steps || {};
    es.home.axes.zohoDesk.tutorialHome.recommendedPath.steps.gettingStarted = "Primeros pasos";
    es.home.axes.zohoDesk.tutorialHome.recommendedPath.steps.handleTicket = "Tratar ticket";
    es.home.axes.zohoDesk.tutorialHome.recommendedPath.steps.replyCustomer = "Responder al cliente";
    es.home.axes.zohoDesk.tutorialHome.recommendedPath.steps.logEvidence = "Registrar evidencias";
    es.home.axes.zohoDesk.tutorialHome.recommendedPath.steps.closeProperly = "Cerrar correctamente";

    es.home.axes.zohoDesk.tutorialHome.modules = es.home.axes.zohoDesk.tutorialHome.modules || {};
    es.home.axes.zohoDesk.tutorialHome.modules.kicker = "Biblioteca completa con 9 modulos";
    es.home.axes.zohoDesk.tutorialHome.modules.title = "Modulos del tutorial";
    es.home.axes.zohoDesk.tutorialHome.modules.description = "Biblioteca completa con 9 modulos para consulta por tema. Mantiene la ruta recomendada como camino principal de aprendizaje.";
    es.home.axes.zohoDesk.tutorialHome.modules.badgeComingSoon = "Pr\u00F3ximamente";
    es.home.axes.zohoDesk.tutorialHome.modules.ctaComingSoon = "Contenido en preparacion";
    es.home.axes.zohoDesk.tutorialHome.modules.cards = es.home.axes.zohoDesk.tutorialHome.modules.cards || {};
    es.home.axes.zohoDesk.tutorialHome.modules.cards.gettingStarted = es.home.axes.zohoDesk.tutorialHome.modules.cards.gettingStarted || {};
    es.home.axes.zohoDesk.tutorialHome.modules.cards.gettingStarted.title = "Primeros pasos";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.gettingStarted.description = "Conoce la estructura b\u00E1sica de la plataforma, la lectura de la pantalla y los elementos principales de la atenci\u00F3n.";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.handleTicket = es.home.axes.zohoDesk.tutorialHome.modules.cards.handleTicket || {};
    es.home.axes.zohoDesk.tutorialHome.modules.cards.handleTicket.title = "C\u00F3mo tratar un ticket";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.handleTicket.description = "Entiende la l\u00F3gica de atenci\u00F3n de principio a fin, con foco en actualizaci\u00F3n, seguimiento y tratamiento correcto del ticket.";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.replyCustomer = es.home.axes.zohoDesk.tutorialHome.modules.cards.replyCustomer || {};
    es.home.axes.zohoDesk.tutorialHome.modules.cards.replyCustomer.title = "C\u00F3mo responder al cliente";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.replyCustomer.description = "Aprende a responder con claridad, alineaci\u00F3n y registro adecuado de la comunicaci\u00F3n en el ticket.";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.logInformation = es.home.axes.zohoDesk.tutorialHome.modules.cards.logInformation || {};
    es.home.axes.zohoDesk.tutorialHome.modules.cards.logInformation.title = "C\u00F3mo registrar informaci\u00F3n y evidencias";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.logInformation.description = "Aprende a documentar correctamente la atenci\u00F3n, adjuntar evidencias y preservar el historial del caso.";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.serviceStatus = es.home.axes.zohoDesk.tutorialHome.modules.cards.serviceStatus || {};
    es.home.axes.zohoDesk.tutorialHome.modules.cards.serviceStatus.title = "Estado de la atenci\u00F3n";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.serviceStatus.description = "Entiende cu\u00E1ndo usar cada estado y c\u00F3mo mantener el flujo del ticket alineado con la operaci\u00F3n.";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.prioritySla = es.home.axes.zohoDesk.tutorialHome.modules.cards.prioritySla || {};
    es.home.axes.zohoDesk.tutorialHome.modules.cards.prioritySla.title = "Prioridad y SLA";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.prioritySla.description = "Entiende c\u00F3mo la prioridad orienta la atenci\u00F3n y c\u00F3mo deben interpretarse los tiempos esperados en la rutina.";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.properClosure = es.home.axes.zohoDesk.tutorialHome.modules.cards.properClosure || {};
    es.home.axes.zohoDesk.tutorialHome.modules.cards.properClosure.title = "Cierre correcto";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.properClosure.description = "Aprende a cerrar tickets con consistencia, registro completo y cierre adecuado.";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.practicalScenarios = es.home.axes.zohoDesk.tutorialHome.modules.cards.practicalScenarios || {};
    es.home.axes.zohoDesk.tutorialHome.modules.cards.practicalScenarios.title = "Escenarios pr\u00E1cticos";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.practicalScenarios.description = "Consulta situaciones comunes de la operaci\u00F3n y ve c\u00F3mo tratar cada caso en el sistema.";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.faq = es.home.axes.zohoDesk.tutorialHome.modules.cards.faq || {};
    es.home.axes.zohoDesk.tutorialHome.modules.cards.faq.title = "FAQ";
    es.home.axes.zohoDesk.tutorialHome.modules.cards.faq.description = "Respuestas r\u00E1pidas para dudas frecuentes sobre el uso de Zoho Desk en la operaci\u00F3n.";

    es.home.axes.zohoDesk.tutorialHome.bestPractices = es.home.axes.zohoDesk.tutorialHome.bestPractices || {};
    es.home.axes.zohoDesk.tutorialHome.bestPractices.title = "Buenas pr\u00E1cticas de atenci\u00F3n";
    es.home.axes.zohoDesk.tutorialHome.bestPractices.items = es.home.axes.zohoDesk.tutorialHome.bestPractices.items || {};
    es.home.axes.zohoDesk.tutorialHome.bestPractices.items.item1 = "Responde con claridad y objetividad";
    es.home.axes.zohoDesk.tutorialHome.bestPractices.items.item2 = "Registra informaci\u00F3n importante en el ticket";
    es.home.axes.zohoDesk.tutorialHome.bestPractices.items.item3 = "Adjunta evidencias cuando sea necesario";
    es.home.axes.zohoDesk.tutorialHome.bestPractices.items.item4 = "Usa el estado correcto en cada etapa";
    es.home.axes.zohoDesk.tutorialHome.bestPractices.items.item5 = "Cierra tickets con historial consistente";
})();

(function () {
    const es = window.PLAYBOOK_I18N_LOCALES["es"];
    if (!es) return;

    es.kpi = es.kpi || {};
    es.kpi.main = es.kpi.main || {};
    es.kpi.main.meta = es.kpi.main.meta || {};
    es.kpi.main.header = es.kpi.main.header || {};
    es.kpi.main.opening = es.kpi.main.opening || {};
    es.kpi.main.nav = es.kpi.main.nav || {};
    es.kpi.main.dashboard = es.kpi.main.dashboard || {};
    es.kpi.main.pages = es.kpi.main.pages || {};
    es.kpi.main.usage = es.kpi.main.usage || {};
    es.kpi.main.readingAccess = es.kpi.main.readingAccess || {};
    es.kpi.main.footer = es.kpi.main.footer || {};
    es.kpi.reading = es.kpi.reading || {};
    es.kpi.reading.opening = es.kpi.reading.opening || {};
    es.kpi.reading.nav = es.kpi.reading.nav || {};
    es.kpi.reading.labels = es.kpi.reading.labels || {};
    es.kpi.reading.pages = es.kpi.reading.pages || {};
    es.kpi.reading.pages.executive = es.kpi.reading.pages.executive || {};
    es.kpi.reading.pages.executive.watch = es.kpi.reading.pages.executive.watch || {};
    es.kpi.reading.pages.executive.when = es.kpi.reading.pages.executive.when || {};
    es.kpi.reading.pages.dataGovernance = es.kpi.reading.pages.dataGovernance || {};
    es.kpi.reading.pages.dataGovernance.watch = es.kpi.reading.pages.dataGovernance.watch || {};
    es.kpi.reading.pages.dataGovernance.when = es.kpi.reading.pages.dataGovernance.when || {};
    es.kpi.reading.pages.agentManagement = es.kpi.reading.pages.agentManagement || {};
    es.kpi.reading.pages.agentManagement.watch = es.kpi.reading.pages.agentManagement.watch || {};
    es.kpi.reading.pages.agentManagement.when = es.kpi.reading.pages.agentManagement.when || {};
    es.kpi.reading.usage = es.kpi.reading.usage || {};
    es.kpi.reading.roles = es.kpi.reading.roles || {};
    es.kpi.reading.roles.manager = es.kpi.reading.roles.manager || {};
    es.kpi.reading.roles.coordinator = es.kpi.reading.roles.coordinator || {};
    es.kpi.reading.roles.operations = es.kpi.reading.roles.operations || {};
    es.kpi.reading.stage = es.kpi.reading.stage || {};
    es.kpi.reading.next = es.kpi.reading.next || {};
    es.kpi.reading.cta = es.kpi.reading.cta || {};
    es.kpi.legacy = es.kpi.legacy || {};
    es.kpi.legacy.meta = es.kpi.legacy.meta || {};
    es.kpi.legacy.notice = es.kpi.legacy.notice || {};

    es.kpi.main.meta.pageTitleDashboard = "Playbook Global - KPI Dashboard";
    es.kpi.main.meta.pageTitleReading = "Playbook Global - Lectura de KPI’s";
    es.kpi.main.header.brand = "KPI Dashboard";
    es.kpi.main.header.meta = "Global Service | Módulo KPI";
    es.kpi.main.header.contextLabel = "Contexto:";
    es.kpi.main.header.contextValue = "Global Service";
    es.kpi.main.header.mainNavAria = "Navegación principal del módulo KPI";
    es.kpi.main.opening.breadcrumb = "Inicio > Global Service > KPI Dashboard";
    es.kpi.main.opening.eyebrow = "Global Service Governance";
    es.kpi.main.opening.moduleLabel = "Módulo: KPI Dashboard";
    es.kpi.main.opening.title = "KPI Dashboard";
    es.kpi.main.opening.description = "Sigue el dashboard oficial del módulo KPI y usa la lectura guiada para interpretar las tres páginas ejecutivas.";
    es.kpi.main.opening.operationalContext = "Contexto operacional: puerta oficial para lectura ejecutiva y operacional de indicadores globales.";
    es.kpi.main.nav.label = "Navegación interna del módulo";
    es.kpi.main.nav.dashboard = "KPI Dashboard";
    es.kpi.main.nav.reading = "Lectura de KPI’s";
    es.kpi.main.dashboard.sectionTitle = "Dashboard oficial en 3 páginas";
    es.kpi.main.dashboard.sectionDescription = "Usa esta secuencia para lectura global rápida y profundización operacional.";
    es.kpi.main.dashboard.embedAria = "Power BI incrustado del KPI Dashboard";
    es.kpi.main.dashboard.embedTitle = "Power BI - KPI Dashboard";
    es.kpi.main.pages.executive = es.kpi.main.pages.executive || {};
    es.kpi.main.pages.executive.title = "Visión Ejecutiva Global";
    es.kpi.main.pages.executive.description = "Lectura macro de la salud operativa con Volumen, Cumplimiento de SLA, MTTS, MTFC, CSAT y comparación regional.";
    es.kpi.main.pages.governance = es.kpi.main.pages.governance || {};
    es.kpi.main.pages.governance.title = "Gobernanza de Datos";
    es.kpi.main.pages.governance.description = "Monitorea la calidad y completitud de la base, completitud de campos obligatorios, tickets con fallas y riesgo operacional.";
    es.kpi.main.pages.agents = es.kpi.main.pages.agents || {};
    es.kpi.main.pages.agents.title = "Gestión de Agentes";
    es.kpi.main.pages.agents.description = "Lectura de la operación del equipo con tickets abiertos/cerrados, pendientes, productividad, SLA/rendimiento y antigüedad.";
    es.kpi.main.usage.title = "Cómo usar el dashboard";
    es.kpi.main.usage.executive = "Usa la página ejecutiva para lectura global de la operación.";
    es.kpi.main.usage.governance = "Usa gobernanza de datos para monitorear completitud y fallas.";
    es.kpi.main.usage.agents = "Usa gestión de agentes para lectura operacional del equipo.";
    es.kpi.main.readingAccess.title = "Acceso a la lectura detallada";
    es.kpi.main.readingAccess.description = "Abre Lectura de KPI’s para seguir la guía de interpretación de las páginas del dashboard.";
    es.kpi.main.readingAccess.cta = "Abrir Lectura de KPI’s";
    es.kpi.main.footer.dashboard = "Playbook Global - KPI Dashboard";
    es.kpi.main.footer.reading = "Playbook Global - Lectura de KPI’s";

    es.kpi.reading.opening.breadcrumb = "Inicio > Global Service > Lectura de KPI’s";
    es.kpi.reading.opening.eyebrow = "Global Service Governance";
    es.kpi.reading.opening.moduleLabel = "Módulo: Lectura de KPI’s";
    es.kpi.reading.opening.title = "Lectura de KPI’s";
    es.kpi.reading.opening.description = "Guía corta para entender qué muestra cada página del BI, qué observar y cuándo usarla.";
    es.kpi.reading.opening.operationalContext = "Contexto operacional: interpretación rápida de las 3 páginas oficiales del dashboard.";

    es.kpi.reading.nav.label = "Navegación interna del módulo";
    es.kpi.reading.nav.dashboard = "KPI Dashboard";
    es.kpi.reading.nav.reading = "Lectura de KPI’s";

    es.kpi.reading.labels.forWhat = "Para qué sirve";
    es.kpi.reading.labels.watch = "Qué observar";
    es.kpi.reading.labels.whenToUse = "Cuándo usar";

    es.kpi.reading.pages.title = "Lectura de las 3 páginas oficiales del BI";
    es.kpi.reading.pages.description = "Sigue este orden para lectura rápida: visión global, calidad de datos y gestión del equipo.";

    es.kpi.reading.pages.executive.order = "Página 1";
    es.kpi.reading.pages.executive.title = "Visión Ejecutiva Global";
    es.kpi.reading.pages.executive.forWhat = "Lectura macro de la salud de la operación.";
    es.kpi.reading.pages.executive.watch.totalTickets = "Tickets Totales";
    es.kpi.reading.pages.executive.watch.slaCompliance = "Cumplimiento de SLA";
    es.kpi.reading.pages.executive.watch.mtts = "MTTS";
    es.kpi.reading.pages.executive.watch.mtfc = "MTFC";
    es.kpi.reading.pages.executive.watch.csat = "CSAT";
    es.kpi.reading.pages.executive.watch.regionalComparison = "Comparación regional";
    es.kpi.reading.pages.executive.when.executiveReading = "Lectura ejecutiva";
    es.kpi.reading.pages.executive.when.regionalComparison = "Comparación entre regiones";
    es.kpi.reading.pages.executive.when.globalTracking = "Seguimiento global de la operación";

    es.kpi.reading.pages.dataGovernance.order = "Página 2";
    es.kpi.reading.pages.dataGovernance.title = "Gobernanza de Datos";
    es.kpi.reading.pages.dataGovernance.forWhat = "Acompañar la calidad y completitud de la base.";
    es.kpi.reading.pages.dataGovernance.watch.requiredCompletion = "Completitud de campos obligatorios";
    es.kpi.reading.pages.dataGovernance.watch.failedTickets = "Tickets con fallas";
    es.kpi.reading.pages.dataGovernance.watch.operationalRisk = "Tickets con riesgo operacional";
    es.kpi.reading.pages.dataGovernance.watch.fieldQuality = "Calidad por campo";
    es.kpi.reading.pages.dataGovernance.watch.regionQuality = "Calidad por región";
    es.kpi.reading.pages.dataGovernance.when.qualityReview = "Revisión de calidad de datos";
    es.kpi.reading.pages.dataGovernance.when.audit = "Auditoría de llenado";
    es.kpi.reading.pages.dataGovernance.when.processCorrection = "Corrección de proceso";

    es.kpi.reading.pages.agentManagement.order = "Página 3";
    es.kpi.reading.pages.agentManagement.title = "Gestión de Agentes";
    es.kpi.reading.pages.agentManagement.forWhat = "Acompañar productividad y operación del equipo.";
    es.kpi.reading.pages.agentManagement.watch.openClosed = "Tickets abiertos/cerrados";
    es.kpi.reading.pages.agentManagement.watch.currentBacklog = "Pendientes actuales";
    es.kpi.reading.pages.agentManagement.watch.statusBacklog = "Pendientes por estado";
    es.kpi.reading.pages.agentManagement.watch.productivity = "Productividad";
    es.kpi.reading.pages.agentManagement.watch.slaPerformance = "SLA/rendimiento";
    es.kpi.reading.pages.agentManagement.watch.agingRisk = "Antigüedad/riesgo";
    es.kpi.reading.pages.agentManagement.watch.detailTable = "Tabla detallada";
    es.kpi.reading.pages.agentManagement.when.operationRoutine = "Rutina operacional";
    es.kpi.reading.pages.agentManagement.when.teamFollowUp = "Seguimiento del equipo";
    es.kpi.reading.pages.agentManagement.when.queueManagement = "Gestión de la cola";

    es.kpi.reading.usage.title = "Cómo usar el BI";
    es.kpi.reading.usage.page1 = "Página 1 = visión global de la operación.";
    es.kpi.reading.usage.page2 = "Página 2 = calidad de datos y completitud de la base.";
    es.kpi.reading.usage.page3 = "Página 3 = gestión operacional del equipo.";

    es.kpi.reading.roles.title = "Lectura rápida por perfil";
    es.kpi.reading.roles.manager.label = "Gestor";
    es.kpi.reading.roles.manager.description = "Visión ejecutiva global.";
    es.kpi.reading.roles.coordinator.label = "Coordinador";
    es.kpi.reading.roles.coordinator.description = "Gobernanza de datos + gestión de agentes.";
    es.kpi.reading.roles.operations.label = "Operación/liderazgo local";
    es.kpi.reading.roles.operations.description = "Gestión de agentes + pendientes/estado.";

    es.kpi.reading.stage.title = "Lectura de KPI’s";
    es.kpi.reading.stage.description = "La página oficial de lectura está activa con guía práctica de las 3 páginas del BI.";
    es.kpi.reading.next.title = "Secuencia oficial del dashboard";
    es.kpi.reading.next.executive = "Visión Ejecutiva Global: lectura macro con Tickets Totales, Cumplimiento de SLA, MTTS, MTFC y CSAT.";
    es.kpi.reading.next.governance = "Gobernanza de Datos: completitud obligatoria, fallas y riesgo operacional.";
    es.kpi.reading.next.agents = "Gestión de Agentes: productividad, pendientes, SLA/rendimiento y antigüedad.";
    es.kpi.reading.cta.dashboard = "Ir a KPI Dashboard";

    es.kpi.legacy.meta.pageTitle = "Playbook Global - KPI Dashboard (URL Legada)";
    es.kpi.legacy.notice.tag = "URL de compatibilidad";
    es.kpi.legacy.notice.title = "Esta página fue consolidada en el KPI Dashboard oficial";
    es.kpi.legacy.notice.description = "Usa la home oficial para acceder al Power BI incrustado y usa Lectura de KPI’s para guía de interpretación.";
    es.kpi.legacy.notice.ctaDashboard = "Ir a KPI Dashboard";
    es.kpi.legacy.notice.ctaReading = "Ir a Lectura de KPI’s";
    es.kpi.legacy.footer = "Playbook Global - KPI Dashboard (URL Legada)";
})();
(function () {
    const es = window.PLAYBOOK_I18N_LOCALES["es"];
    if (!es) return;

    es.camposObrigatorios = es.camposObrigatorios || {};
    es.camposObrigatorios.home = es.camposObrigatorios.home || {};

    es.camposObrigatorios.home.opening = es.camposObrigatorios.home.opening || {};
    es.camposObrigatorios.home.opening.pageTitle = "Playbook Global - Campos Obligatorios";
    es.camposObrigatorios.home.opening.breadcrumb = "Inicio > Global Service > Campos Obligatorios";
    es.camposObrigatorios.home.opening.moduleLabel = "Modulo: Campos Obligatorios";
    es.camposObrigatorios.home.opening.title = "Campos Obligatorios";
    es.camposObrigatorios.home.opening.description = "Lectura ejecutiva de los campos que sostienen apertura correcta, flujo, prioridad, SLA, KPI y calidad de datos.";
    es.camposObrigatorios.home.opening.operationalContext = "Contexto operativo: estandar minimo para apertura, seguimiento y calidad del ticket.";

    es.camposObrigatorios.home.nav = es.camposObrigatorios.home.nav || {};
    es.camposObrigatorios.home.nav.label = "Navegacion interna del modulo";
    es.camposObrigatorios.home.nav.fields = "Campos Obligatorios";
    es.camposObrigatorios.home.nav.matrix = "Matriz Consolidada";

    es.camposObrigatorios.home.visual = es.camposObrigatorios.home.visual || {};
    es.camposObrigatorios.home.visual.eyebrow = "Mapa de Campos Obligatorios";
    es.camposObrigatorios.home.visual.title = "Mapa de Campos del Ticket";
    es.camposObrigatorios.home.visual.description = "Vista unica de los 4 grupos oficiales para lectura operativa rapida.";
    es.camposObrigatorios.home.visual.impactLabel = "Impacto directo en";
    es.camposObrigatorios.home.visual.matrixCta = "Abrir Matriz Consolidada";
    es.camposObrigatorios.home.visual.impact = es.camposObrigatorios.home.visual.impact || {};
    es.camposObrigatorios.home.visual.impact.dataQuality = "Calidad de datos";
    es.camposObrigatorios.home.visual.impact.flow = "Flujo";
    es.camposObrigatorios.home.visual.impact.priority = "Prioridad";
    es.camposObrigatorios.home.visual.impact.sla = "SLA";
    es.camposObrigatorios.home.visual.impact.kpi = "KPI";
    es.camposObrigatorios.home.visual.impact.audit = "Auditoría";

    es.camposObrigatorios.home.groups = es.camposObrigatorios.home.groups || {};

    es.camposObrigatorios.home.groups.mandatory = es.camposObrigatorios.home.groups.mandatory || {};
    es.camposObrigatorios.home.groups.mandatory.tag = "Obligatorio";
    es.camposObrigatorios.home.groups.mandatory.title = "Obligatorios principales";
    es.camposObrigatorios.home.groups.mandatory.definition = "Base minima para abrir y calificar el ticket sin retrabajo.";
    es.camposObrigatorios.home.groups.mandatory.ticketLabel = "Ticket - apertura";
    es.camposObrigatorios.home.groups.mandatory.ticket = es.camposObrigatorios.home.groups.mandatory.ticket || {};
    es.camposObrigatorios.home.groups.mandatory.ticket.requesterName = "Nombre del solicitante/cliente";
    es.camposObrigatorios.home.groups.mandatory.ticket.email = "E-mail";
    es.camposObrigatorios.home.groups.mandatory.ticket.phone = "Telefono";
    es.camposObrigatorios.home.groups.mandatory.ticket.requester = "Solicitante";
    es.camposObrigatorios.home.groups.mandatory.ticket.serviceType = "Tipo de atencion";
    es.camposObrigatorios.home.groups.mandatory.ticket.category = "Categoria";
    es.camposObrigatorios.home.groups.mandatory.ticket.product = "Producto";
    es.camposObrigatorios.home.groups.mandatory.ticket.productBrand = "Marca del producto";
    es.camposObrigatorios.home.groups.mandatory.ticket.serialNumber = "Numero de serie del equipo, con excepcion contextual";
    es.camposObrigatorios.home.groups.mandatory.ticket.subject = "Asunto";
    es.camposObrigatorios.home.groups.mandatory.ticket.description = "Descripcion";
    es.camposObrigatorios.home.groups.mandatory.contactLabel = "Contacto/Cliente";
    es.camposObrigatorios.home.groups.mandatory.contact = es.camposObrigatorios.home.groups.mandatory.contact || {};
    es.camposObrigatorios.home.groups.mandatory.contact.firstName = "Nombre";
    es.camposObrigatorios.home.groups.mandatory.contact.lastName = "Apellido";
    es.camposObrigatorios.home.groups.mandatory.contact.accountName = "Nombre de la cuenta";
    es.camposObrigatorios.home.groups.mandatory.contact.email = "E-mail";
    es.camposObrigatorios.home.groups.mandatory.contact.phoneMobile = "Telefono/Celular";

    es.camposObrigatorios.home.groups.conditional = es.camposObrigatorios.home.groups.conditional || {};
    es.camposObrigatorios.home.groups.conditional.tag = "Condicional";
    es.camposObrigatorios.home.groups.conditional.title = "Condicionales";
    es.camposObrigatorios.home.groups.conditional.definition = "Obligatorio solo cuando el contexto regional o del solicitante lo requiere.";
    es.camposObrigatorios.home.groups.conditional.stateBrazil = "Estado: obligatorio solo Brasil";
    es.camposObrigatorios.home.groups.conditional.provinceArgentina = "Provincia: obligatoria solo Argentina";
    es.camposObrigatorios.home.groups.conditional.assistanceDistributor = "Nombre de asistencia/distribuidor: obligatorio para Asistencia / Distribuidor";

    es.camposObrigatorios.home.groups.automatic = es.camposObrigatorios.home.groups.automatic || {};
    es.camposObrigatorios.home.groups.automatic.tag = "Automático";
    es.camposObrigatorios.home.groups.automatic.title = "Automáticos/sistémicos";
    es.camposObrigatorios.home.groups.automatic.definition = "Datos completados y actualizados por el sistema durante toda la jornada.";
    es.camposObrigatorios.home.groups.automatic.ticketId = "ID del ticket";
    es.camposObrigatorios.home.groups.automatic.openingDate = "Fecha de apertura";
    es.camposObrigatorios.home.groups.automatic.channel = "Canal";
    es.camposObrigatorios.home.groups.automatic.owner = "Responsable del ticket";
    es.camposObrigatorios.home.groups.automatic.status = "Status";
    es.camposObrigatorios.home.groups.automatic.priority = "Prioridad, calculada por la matriz";
    es.camposObrigatorios.home.groups.automatic.slaFirstResponse = "SLA de primera respuesta";
    es.camposObrigatorios.home.groups.automatic.slaResolution = "SLA de resolucion";
    es.camposObrigatorios.home.groups.automatic.slaIndicators = "Tiempos e indicadores de SLA";

    es.camposObrigatorios.home.groups.recommended = es.camposObrigatorios.home.groups.recommended || {};
    es.camposObrigatorios.home.groups.recommended.tag = "Deseable";
    es.camposObrigatorios.home.groups.recommended.title = "Deseables oficiales";
    es.camposObrigatorios.home.groups.recommended.definition = "No bloquean la apertura, pero elevan la calidad de lectura operativa.";
    es.camposObrigatorios.home.groups.recommended.country = "Pais";
    es.camposObrigatorios.home.groups.recommended.zeroHour = "Cero hora / Out of the box";
    es.camposObrigatorios.home.groups.recommended.needsPart = "Necesita pieza";
    es.camposObrigatorios.home.groups.recommended.partnerDistributor = "Partner/distribuidor, cuando no obligatorio";
    es.camposObrigatorios.home.groups.recommended.racSent = "RAC Enviada? - Si/No";
    es.camposObrigatorios.home.groups.recommended.assistanceType = "Tipo de asistencia tecnica";
    es.camposObrigatorios.home.groups.recommended.closingReason = "Motivo del cierre";
    es.camposObrigatorios.home.groups.recommended.solutionMode = "Solucion en campo/remoto";
    es.camposObrigatorios.home.groups.recommended.usedPart = "Pieza utilizada";
    es.camposObrigatorios.home.groups.recommended.finalPartsQty = "Cantidad final de piezas";

    es.camposObrigatorios.home.note = es.camposObrigatorios.home.note || {};
    es.camposObrigatorios.home.note.excludedOfficial = "No forman parte de la lista oficial de deseables en esta fase: acciones ejecutadas, cantidad de piezas, pieza solicitada, codigo de la pieza, fechas/status de la pieza, numero del pedido, causa probable y fecha prevista de retorno al cliente.";

    es.camposObrigatorios.home.rules = es.camposObrigatorios.home.rules || {};
    es.camposObrigatorios.home.rules.title = "Reglas criticas";
    es.camposObrigatorios.home.rules.serialException = "Numero de serie es obligatorio, con excepcion contextual.";
    es.camposObrigatorios.home.rules.stateBrazil = "Estado solo Brasil.";
    es.camposObrigatorios.home.rules.provinceArgentina = "Provincia solo Argentina.";
    es.camposObrigatorios.home.rules.assistanceDistributor = "Nombre de asistencia/distribuidor solo cuando aplica.";
    es.camposObrigatorios.home.rules.priorityCalculated = "La prioridad es obligatoria y calculada por la matriz.";
    es.camposObrigatorios.home.rules.zeroHourImpact = "Cero hora / Out of the box es deseable, pero impacta prioridad.";

    es.camposObrigatorios.home.usage = es.camposObrigatorios.home.usage || {};
    es.camposObrigatorios.home.usage.title = "Como usar este modulo";
    es.camposObrigatorios.home.usage.homeRule = "Usa la home para entender la regla.";
    es.camposObrigatorios.home.usage.matrixDetails = "Usa la Matriz Consolidada para consultar el detalle completo.";
    es.camposObrigatorios.home.usage.coordinators = "Coordinadores deben usar la matriz para cobrar completitud.";
    es.camposObrigatorios.home.usage.agents = "Agentes deben usarla como referencia para completar correctamente.";

    es.kanban = es.kanban || {};
    es.kanban.main = es.kanban.main || {};

    es.kanban.main.header = es.kanban.main.header || {};
    es.kanban.main.header.title = "02 - Kanban Global";
    es.kanban.main.header.subtitle = "Lectura visual rápida de tickets por estado oficial";
    es.kanban.main.footer = "Playbook Global - Modulo 02 Kanban";

    es.kanban.main.opening = es.kanban.main.opening || {};
    es.kanban.main.opening.pageTitle = "Playbook Global - Kanban Global";
    es.kanban.main.opening.breadcrumb = "Inicio > Global Service > Kanban Global";
    es.kanban.main.opening.moduleLabel = "Modulo: Kanban Global";
    es.kanban.main.opening.title = "Kanban Global";
    es.kanban.main.opening.description = "Pagina unica para lectura visual del flujo: estados oficiales, transiciones esenciales, cuellos de botella operativos y errores que distorsionan backlog y aging.";
    es.kanban.main.opening.operationalContext = "Contexto operativo: lectura rapida para ubicar tickets en el estado correcto y mostrar la cola real.";

    es.kanban.main.nav = es.kanban.main.nav || {};
    es.kanban.main.nav.label = "Navegacion interna del modulo";
    es.kanban.main.nav.board = "Tablero Kanban";
    es.kanban.main.nav.transitions = "Transiciones";
    es.kanban.main.nav.operations = "Lectura Operativa";
    es.kanban.main.nav.mistakes = "Errores Comunes";

    es.kanban.main.board = es.kanban.main.board || {};
    es.kanban.main.board.kicker = "Tablero operativo oficial";
    es.kanban.main.board.title = "Tablero Kanban con los 7 estados oficiales";
    es.kanban.main.board.description = "Cada columna muestra solo lo necesario para decidir rapido donde debe estar el ticket.";
    es.kanban.main.board.goalLabel = "Objetivo";
    es.kanban.main.board.whenLabel = "Cuándo usar";

    es.kanban.main.statuses = es.kanban.main.statuses || {};
    es.kanban.main.statuses.open = {
        name: "Abierto",
        purpose: "Registrar y calificar el ticket para iniciar la gestion.",
        when: "Cuando el ticket acaba de ingresar y todavia no inicio la accion tecnica."
    };
    es.kanban.main.statuses.inProgress = {
        name: "En Atención",
        purpose: "Ejecutar analisis y trabajo tecnico activo.",
        when: "Cuando el equipo esta actuando directamente sobre el ticket."
    };
    es.kanban.main.statuses.waitingCustomer = {
        name: "Esperando Cliente",
        purpose: "Esperar respuesta o accion del cliente para avanzar.",
        when: "Cuando el siguiente paso depende objetivamente del cliente."
    };
    es.kanban.main.statuses.waitingParts = {
        name: "Esperando Pieza",
        purpose: "Esperar pieza, material o logistica para continuar.",
        when: "Cuando la ejecucion depende de un item fisico para seguir."
    };
    es.kanban.main.statuses.waitingThirdParty = {
        name: "Esperando Tercero / Visita Técnica",
        purpose: "Esperar actuacion de tercero o visita tecnica responsable.",
        when: "Cuando el ticket depende de asistencia tecnica o tercero, interno o externo."
    };
    es.kanban.main.statuses.resolved = {
        name: "Resuelto",
        purpose: "Registrar que la solucion fue aplicada antes del cierre final.",
        when: "Cuando la gestion termino, pero aun falta validar el cierre definitivo."
    };
    es.kanban.main.statuses.closed = {
        name: "Cerrado",
        purpose: "Formalizar el cierre final del ticket.",
        when: "Cuando el ticket ya paso por Resuelto y no tiene accion pendiente."
    };

    es.kanban.main.transitions = es.kanban.main.transitions || {};
    es.kanban.main.transitions.title = "Transiciones";
    es.kanban.main.transitions.description = "Logica base de movimiento del ticket en el Kanban.";
    es.kanban.main.transitions.entryFlow = "Entrada -> Abierto -> En Atención";
    es.kanban.main.transitions.branchLabel = "Desde En Atención, el ticket puede ir a:";
    es.kanban.main.transitions.branchCustomer = "Esperando Cliente";
    es.kanban.main.transitions.branchParts = "Esperando Pieza";
    es.kanban.main.transitions.branchThirdParty = "Esperando Tercero / Visita Técnica";
    es.kanban.main.transitions.branchResolved = "Resuelto";
    es.kanban.main.transitions.finalFlow = "Resuelto -> Cerrado";
    es.kanban.main.transitions.notes = es.kanban.main.transitions.notes || {};
    es.kanban.main.transitions.notes.resolveNotClose = "Resolver no es cerrar.";
    es.kanban.main.transitions.notes.waitingMustBeReal = "Ticket detenido debe ir al estado de espera correcto.";
    es.kanban.main.transitions.notes.waitingReflectsDependency = "Los estados de espera deben reflejar dependencia real.";

    es.kanban.main.operations = es.kanban.main.operations || {};
    es.kanban.main.operations.title = "Lectura Operativa";
    es.kanban.main.operations.backlog = "Backlog no es solo volumen: tambien incluye tickets detenidos o mal clasificados.";
    es.kanban.main.operations.aging = "El Aging empeora cuando el ticket queda en un estado incorrecto.";
    es.kanban.main.operations.bottlenecks = "El tablero Kanban muestra Cuellos de botella y dependencias de atencion.";
    es.kanban.main.operations.flowAndSla = "El estado correcto mejora flujo, SLA y lectura operativa.";

    es.kanban.main.mistakes = es.kanban.main.mistakes || {};
    es.kanban.main.mistakes.title = "Errores Comunes";
    es.kanban.main.mistakes.waitingCustomer = "No dejar tickets en En Atención cuando estan Esperando Cliente.";
    es.kanban.main.mistakes.waitingParts = "No dejar tickets en En Atención cuando estan Esperando Pieza.";
    es.kanban.main.mistakes.maskQueue = "No usar estado incorrecto para ocultar la cola.";
    es.kanban.main.mistakes.skipResolved = "No cerrar tickets directamente sin pasar por Resuelto.";
    es.kanban.main.mistakes.realStatus = "El estado debe reflejar la situacion real del ticket.";

    es.security = es.security || {};
    es.security.auth = {
        metaTitle: "Playbook Global - Acceso seguro",
        kicker: "Nueva capa de seguridad",
        heroTitle: "Playbook Global protegido",
        heroText: "Ingresa con una cuenta aprobada para acceder a contenidos, indicadores y materiales del proyecto.",
        securityNotice: "Esta funcionalidad protege la informacion interna del Playbook. Los nuevos registros requieren confirmacion de e-mail y aprobacion administrativa.",
        benefits: {
            approved: "Acceso solo para cuentas aprobadas",
            protected: "Contenidos e indicadores protegidos",
            governed: "Gobernanza centralizada de usuarios"
        },
        accountLabel: "Cuenta corporativa",
        adminAccountLabel: "Cuenta administrativa predeterminada",
        secureFooter: "Autenticacion protegida y sesion cifrada",
        title: "Accede a tu cuenta",
        subtitle: "Usa e-mail y contrasena. Los nuevos registros requieren confirmacion de e-mail y aprobacion administrativa.",
        tabs: {
            login: "Ingresar",
            register: "Registrar",
            reset: "Recuperar"
        },
        email: "E-mail",
        password: "Contrasena",
        newPassword: "Nueva contrasena",
        confirmPassword: "Confirmar contrasena",
        emailHint: "Usa tu e-mail corporativo aprobado.",
        registerEmailHint: "Despues del registro, confirma el e-mail recibido y espera la aprobacion administrativa.",
        loginPasswordHint: "La contrasena distingue mayusculas y minusculas.",
        passwordHint: "Usa 12 o mas caracteres, con mayuscula, minuscula, numero y simbolo.",
        passwordRules: {
            length: "12 o mas caracteres",
            upper: "Una letra mayuscula",
            lower: "Una letra minuscula",
            number: "Un numero",
            symbol: "Un simbolo"
        },
        resetHint: "Por seguridad, la respuesta no confirma si el e-mail esta registrado.",
        actions: {
            login: "Ingresar",
            forgot: "Olvide mi contrasena",
            register: "Solicitar registro",
            reset: "Enviar recuperacion",
            changePassword: "Cambiar contrasena",
            showPassword: "Mostrar",
            hidePassword: "Ocultar",
            backToLogin: "Volver al ingreso"
        }
    };
    es.security.admin = {
        metaTitle: "Administracion del Playbook",
        headerTitle: "Administracion del Playbook",
        headerSubtitle: "Aprobacion y gobernanza de acceso",
        backToPlaybook: "Volver al Playbook",
        kicker: "Control de acceso",
        title: "Administracion del Playbook",
        description: "Lista usuarios, busca registros y cambia estados de aprobacion con auditoria en Supabase.",
        searchLabel: "Buscar por e-mail",
        searchPlaceholder: "nombre@empresa.com",
        statusLabel: "Estado",
        loading: "Cargando usuarios...",
        empty: "No se encontraron usuarios.",
        status: {
            all: "Todos",
            pending: "Pendiente",
            approved: "Aprobado",
            rejected: "Rechazado",
            suspended: "Suspendido"
        },
        actions: {
            filter: "Aplicar filtros",
            makeAdmin: "Hacer admin",
            resetPassword: "Resetear contrasena",
            removeAdmin: "Quitar admin"
        },
        roles: {
            admin: "Admin",
            user: "Usuario"
        },
        confirmMakeAdmin: "Confirmar la promocion de este usuario a administrador?",
        confirmRemoveAdmin: "Confirmar la remocion del perfil administrador de este usuario?",
        confirmResetPassword: "Generar una contrasena temporal para este usuario? La contrasena actual dejara de funcionar.",
        passwordResetSuccess: "Contrasena temporal generada. Enviala por un canal seguro e indica el cambio en el primer inicio.",
        temporaryPassword: "Contrasena temporal",
        roleChanged: "Perfil actualizado con exito.",
        table: {
            email: "E-mail",
            createdAt: "Registro",
            status: "Estado",
            role: "Perfil",
            updatedAt: "Ultima alteracion",
            actions: "Acciones"
        }
    };
    es.security.messages = {
        invalidCredentials: "E-mail o contrasena invalidos.",
        pending: "Tu registro esta pendiente de aprobacion administrativa.",
        rejected: "Tu registro fue rechazado. Contacta a la administracion del Playbook.",
        suspended: "Tu acceso esta suspendido. Contacta a la administracion del Playbook.",
        profileMissing: "Perfil del Playbook no encontrado. Contacta a la administracion.",
        signingIn: "Validando acceso...",
        loginTakingLong: "La validacion esta tardando mas de lo normal. Aun estamos intentando conectar con Supabase...",
        authClientTimeout: "No fue posible cargar la autenticacion a tiempo.",
        loginTimeout: "La validacion tardo demasiado. Recarga la pagina e intenta nuevamente.",
        profileValidationTimeout: "Inicio de sesion realizado, pero la validacion del perfil tardo demasiado. Recarga la pagina.",
        authUnavailable: "No fue posible cargar la autenticacion. Verifica la conexion y recarga la pagina.",
        loginSuccess: "Inicio de sesion realizado. Redirigiendo...",
        emailNotConfirmed: "Confirma el e-mail enviado por Supabase y espera la aprobacion administrativa antes de entrar.",
        registerSuccess: "Registro enviado. Confirma el e-mail recibido y espera la aprobacion administrativa antes de acceder al Playbook.",
        resetSuccess: "Si el e-mail esta registrado, enviaremos instrucciones de recuperacion.",
        passwordChanged: "Contrasena cambiada con exito. Ingresa nuevamente con la nueva contrasena.",
        forcePasswordChange: "Cambia la contrasena inicial antes de acceder al Playbook.",
        passwordMismatch: "La confirmacion de contrasena no coincide.",
        passwordWeak: "Usa 12 o mas caracteres, incluyendo mayuscula, minuscula, numero y simbolo.",
        registerError: "No fue posible completar el registro ahora. Intenta mas tarde.",
        resetError: "No fue posible procesar la solicitud ahora. Intenta mas tarde.",
        passwordChangeError: "No fue posible cambiar la contrasena ahora. Solicita un nuevo enlace o intenta otra vez.",
        emailInvalid: "Ingresa un e-mail valido.",
        sessionMissing: "Inicia sesion para acceder al Playbook.",
        adminRequired: "Solo administradores aprobados pueden acceder a esta pagina.",
        logout: "Salir",
        admin: "Administracion",
        loadingUsers: "Cargando usuarios...",
        emptyUsers: "No se encontraron usuarios.",
        confirmStatus: "Confirmar cambio de estado a {status}?",
        statusChanged: "Estado actualizado con exito."
    };
})();

