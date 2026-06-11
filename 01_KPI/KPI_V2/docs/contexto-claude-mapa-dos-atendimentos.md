# Contexto para Claude Code - Aba "Mapa dos Atendimentos"

Data da validacao: 2026-06-09.

Objetivo: criar uma nova aba no KPI V2 chamada **Mapa dos Atendimentos**, mostrando todos os status como um quadro Kanban operacional. A aba deve permitir enxergar volume atual de tickets por status, tempo medio em cada status, p90/mediana, gargalos por pais/regiao e quais tickets explicam esses gargalos.

## Estado validado no Supabase

Projeto Supabase:

- Project ref: `hqaxpbnduupjdhuuwpmg`
- URL publica: `https://hqaxpbnduupjdhuuwpmg.supabase.co`
- Config frontend: `config/supabase.js`

Edge Functions ativas:

- `dashboard-read`, versao 11, ativa, `verify_jwt=true`.
- `sync-tickets-v0`, versao 52, ativa, `verify_jwt=true`.
- `sync-ticket-status-history`, versao 1, ativa, `verify_jwt=true`.

Migrations novas aplicadas:

- `20260609144110_enhance_status_history_bottleneck_analytics`
- `20260609161603_add_ticket_status_history_sync_markers`

Validacao final dos 2 departamentos usados:

| Departamento | Tickets ativos | Tickets sincronizados status | Tickets com eventos status | Pendentes sync status | Modificados apos sync | % sync |
|---|---:|---:|---:|---:|---:|---:|
| Suporte tecnico | 8.864 | 8.864 | 8.845 | 0 | 0 | 100.0 |
| SAC | 472 | 472 | 472 | 0 | 0 | 100.0 |

Observacao importante: existem 19 tickets de Suporte tecnico sem eventos de status retornados pelo Zoho. Eles nao estao pendentes; a Edge Function tentou buscar, o Zoho retornou zero eventos de status e eles foram marcados com `last_status_history_sync_at`.

Indicadores finais:

- `vw_ticket_history_sync_backlog` para os 2 departamentos: `0`
- Erros recentes da funcao `sync-ticket-status-history` em 24h: `0`
- Linhas em `zoho_ticket_status_history`: `35.402`
- Intervalos utilizaveis em `vw_ticket_status_intervals`: `25.530`
- Linhas em `vw_ticket_status_time_by_ticket`: `23.915`
- Linhas em `vw_status_time_by_region`: `85`
- Linhas em `vw_bottleneck_by_status`: `85`
- Ultimo run de validacao: `sync_runs.id = 2422`, sucesso, 1 ticket, 2 eventos, 0 erros, finalizado em `2026-06-09 17:22:20 UTC` / `2026-06-09 14:22:20 BRT`.

## Dados disponiveis para a aba

### Tabela bruta

`public.zoho_ticket_status_history`

Uma linha por evento de mudanca de status no Zoho.

Campos principais:

- `ticket_id`
- `event_id`
- `event_time`
- `previous_status`
- `new_status`
- `next_event_time`
- `time_in_previous_status_hours`
- `time_in_previous_status_minutes`
- `actor_name`
- `raw_event`

Use views para frontend; evite consumir esta tabela diretamente na aba.

### View principal para o Kanban atual

`public.vw_ticket_status_intervals`

Use para cards/tickets atuais e tempos por intervalo.

Campos principais:

- `ticket_id`
- `ticket_number`
- `subject`
- `department_name`
- `agent_email`
- `regiao`
- `pais`
- `region`
- `priority`
- `category`
- `categoria_custom`
- `tipo_atendimento`
- `produtos`
- `created_time`
- `closed_time`
- `modified_time`
- `current_ticket_status`
- `status`
- `status_entered_at`
- `status_exited_at`
- `duration_source`
- `is_current_status_interval`
- `status_duration_minutes`
- `status_duration_hours`
- `status_duration_days`

Para o quadro Kanban de tickets abertos no status atual, use:

```sql
select *
from public.vw_ticket_status_intervals
where duration_source = 'open_until_now'
  and status_duration_minutes is not null
  and status_duration_minutes > 0;
```

### View por ticket/status

`public.vw_ticket_status_time_by_ticket`

Use para detalhe analitico e gargalos por pais, porque esta view inclui `pais`.

Campos principais:

- `ticket_id`
- `ticket_number`
- `subject`
- `department_name`
- `agent_email`
- `regiao`
- `pais`
- `region`
- `priority`
- `current_ticket_status`
- `status`
- `status_occurrences`
- `total_status_hours`
- `avg_interval_hours`
- `median_interval_hours`
- `p90_interval_hours`
- `max_interval_hours`
- `is_currently_in_status`

Para gargalos por pais/status, agrupe no frontend ou crie endpoint SQL/API:

```sql
select
  coalesce(nullif(pais, ''), nullif(regiao, ''), 'Sem pais') as pais,
  status,
  count(distinct ticket_id) as tickets_afetados,
  round(avg(total_status_hours), 2) as avg_total_status_hours,
  round((percentile_cont(0.5) within group (order by total_status_hours))::numeric, 2) as mediana_total_status_hours,
  round((percentile_cont(0.9) within group (order by total_status_hours))::numeric, 2) as p90_total_status_hours,
  round(sum(total_status_hours), 2) as total_horas
from public.vw_ticket_status_time_by_ticket
group by coalesce(nullif(pais, ''), nullif(regiao, ''), 'Sem pais'), status;
```

### Views agregadas prontas

`public.vw_status_time_by_region`

Resumo por `regiao` + `status`.

Campos:

- `regiao`
- `status`
- `total_transicoes`
- `avg_horas`
- `mediana_horas`
- `max_horas`
- `p90_horas`
- `tickets_afetados`
- `total_intervalos`
- `intervalos_abertos_agora`
- `total_horas`

`public.vw_bottleneck_by_status`

Ranking geral de gargalos por `status` + `regiao`.

Campos:

- `status`
- `regiao`
- `tickets_afetados`
- `avg_horas`
- `p90_horas`
- `mediana_horas`
- `total_intervalos`
- `intervalos_abertos_agora`
- `max_horas`
- `total_horas`

`public.vw_ticket_status_history_coverage`

Use para health/check da aba.

Campos:

- `regiao`
- `tickets_total`
- `tickets_com_historico`
- `tickets_sem_historico`
- `pct_com_historico`
- `tickets_status_history_sync_done`
- `tickets_status_history_sync_pendente`
- `tickets_sem_eventos_status_apos_sync`
- `tickets_modificados_apos_status_sync`
- `pct_status_history_sync_done`

`public.vw_ticket_history_sync_backlog`

Fila incremental de historico de status. A aba pode exibir health simples: se count > 0, avisar que ha sync pendente.

## Edge Function dedicada

Funcao criada:

`supabase/functions/sync-ticket-status-history/index.ts`

Endpoint:

```text
POST https://hqaxpbnduupjdhuuwpmg.supabase.co/functions/v1/sync-ticket-status-history
```

Payload incremental padrao:

```json
{
  "syncMode": "backlog",
  "maxTickets": 150,
  "maxRuntimeSeconds": 125,
  "dryRun": false
}
```

Esta funcao:

- Busca tickets em `vw_ticket_history_sync_backlog`.
- Chama `GET /api/v1/tickets/{id}/History` no Zoho.
- Extrai apenas mudancas de `status`.
- Faz upsert em `zoho_ticket_status_history` por `(ticket_id,event_id)`.
- Atualiza `zoho_tickets.last_status_history_sync_at`.
- Atualiza `zoho_tickets.status_history_event_count`.

Nao usar `service_role` no frontend. A funcao usa service role internamente via secrets do Supabase.

## Contexto do frontend KPI V2

Pasta principal:

`01_KPI/KPI_V2`

Arquivos relevantes:

- `01_KPI/KPI_V2/index.html`: hub com cards Daily, Weekly e Monthly. Adicionar card para `Mapa dos Atendimentos`.
- `01_KPI/KPI_V2/page2-backlog.html`: exemplo da aba Daily com filtros, nav, cards, tabelas e padrao visual.
- `01_KPI/KPI_V2/page4-weekly.html`: exemplo de graficos/cross-filter e nav.
- `01_KPI/KPI_V2/page5-monthly.html`: exemplo de tabela/resumo mensal.
- `01_KPI/KPI_V2/js/supabase-client.js`: cliente de dados atual.
- `01_KPI/KPI_V2/js/i18n.js`: traducoes PT/EN/ES.
- `01_KPI/KPI_V2/css/design-system.css` e `css/layout.css`: tokens e layout.

O frontend hoje usa:

- `config/supabase.js` para `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
- `dashboard-read` para types `bi-kpis`, `bi-region-summary`, `bi-summary`, `bi-backlog`, `bi-tickets`, `sync-health`.
- Algumas leituras REST diretas para `zoho_agents` e `zoho_tickets`.

Observacao: a Edge Function `dashboard-read` existe deployada, mas nao ha pasta local `supabase/functions/dashboard-read/` neste workspace. Se quiser ampliar `dashboard-read`, primeiro trazer o codigo remoto para o repo ou recriar a pasta local. Alternativa mais rapida para a nova aba: ler as novas views via REST direto usando `supabaseHeaders()` e paginacao.

## Recomendacao de implementacao

Criar nova pagina:

`01_KPI/KPI_V2/page6-service-map.html`

Titulo visivel:

`Mapa dos Atendimentos`

Adicionar no hub:

- Em `index.html`, incluir quarto card no grid.
- Atualizar `hub-grid-three` se necessario para quatro cards.

Adicionar no nav de todas as paginas KPI V2:

```html
<a href="page6-service-map.html" data-i18n="nav_service_map">Mapa dos Atendimentos</a>
```

Atualizar `js/i18n.js`:

- PT: `Mapa dos Atendimentos`
- EN: `Service Map`
- ES: `Mapa de Atenciones` ou `Mapa de Atendimientos`, conforme padrao preferido.

## Data access sugerido

Adicionar em `js/supabase-client.js` funcoes novas com paginacao REST:

```js
async function fetchPagedRestView(viewName, select, params = {}, pageSize = 1000, maxRows = 50000) {
  const rows = [];
  for (let offset = 0; offset < maxRows; offset += pageSize) {
    const search = new URLSearchParams({ select, limit: String(pageSize), offset: String(offset) });
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') search.set(key, String(value));
    });
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${viewName}?${search.toString()}`, {
      headers: supabaseHeaders()
    });
    if (!res.ok) throw new Error(`Supabase REST error (${viewName}): ${res.status}`);
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < pageSize) break;
  }
  return rows;
}
```

Funcoes recomendadas:

```js
async function fetchServiceMapCurrentIntervals() {
  return fetchPagedRestView(
    'vw_ticket_status_intervals',
    'ticket_id,ticket_number,subject,department_name,agent_email,regiao,pais,region,priority,current_ticket_status,status,status_entered_at,status_duration_hours,status_duration_days,duration_source',
    {
      duration_source: 'eq.open_until_now',
      status_duration_minutes: 'gt.0',
      order: 'status_duration_hours.desc'
    },
    1000,
    20000
  );
}

async function fetchServiceMapStatusRegion() {
  return fetchPagedRestView(
    'vw_status_time_by_region',
    '*',
    { order: 'avg_horas.desc' },
    1000,
    10000
  );
}

async function fetchServiceMapTicketStatus() {
  return fetchPagedRestView(
    'vw_ticket_status_time_by_ticket',
    'ticket_id,ticket_number,department_name,agent_email,regiao,pais,region,priority,current_ticket_status,status,status_occurrences,total_status_hours,avg_interval_hours,median_interval_hours,p90_interval_hours,max_interval_hours,is_currently_in_status',
    { order: 'total_status_hours.desc' },
    1000,
    50000
  );
}

async function fetchServiceMapCoverage() {
  return fetchPagedRestView(
    'vw_ticket_status_history_coverage',
    '*',
    { order: 'tickets_status_history_sync_pendente.desc' },
    1000,
    5000
  );
}
```

Checar a sintaxe do PostgREST se usar `order` dentro de `URLSearchParams`. O padrao atual do projeto usa URL manual em algumas funcoes, entao pode adaptar.

## Layout esperado da aba

Nao criar landing page. A primeira tela deve ser a experiencia operacional.

Estrutura sugerida:

1. Header padrao do KPI V2.
2. Nav padrao com Daily, Weekly, Monthly e Mapa dos Atendimentos.
3. Barra de filtros:
   - Pais / Regiao
   - Departamento
   - Prioridade
   - Status
   - Agente
   - Modo: `Atual` / `Historico`
   - Ordenacao: `Maior media`, `Maior p90`, `Maior volume`, `Mais tickets atuais`
4. KPI strip:
   - Tickets atuais no mapa
   - Status com maior media
   - Pais com maior gargalo
   - P90 global em status
   - Tickets em status de espera
5. Kanban horizontal por status:
   - Uma coluna por status.
   - Header da coluna:
     - nome do status
     - tickets atuais nesse status
     - media atual no status
     - p90 historico
     - pais mais afetado
   - Cards de ticket:
     - ticket number
     - pais/regiao
     - prioridade
     - departamento
     - tempo atual no status
     - agente/email quando disponivel
6. Secao "Gargalos por pais":
   - Tabela ou matriz pais x status.
   - Colunas: pais, status, tickets afetados, media horas, mediana, p90, total horas.
   - Ordenar por p90 ou total horas.
7. Secao "Tickets que explicam o gargalo":
   - Tabela filtrada pelo status/pais selecionado.
   - Colunas: ticket, pais, status, total horas no status, ocorrencias, prioridade, agente, departamento.
8. Health discreto:
   - `vw_ticket_history_sync_backlog` count.
   - `vw_ticket_status_history_coverage.pct_status_history_sync_done`.
   - Se backlog > 0, mostrar alerta pequeno.

## Regras de calculo

Kanban atual:

- Base: `vw_ticket_status_intervals`.
- Filtro: `duration_source = 'open_until_now'`.
- `tickets_current = count(distinct ticket_id)` por `status`.
- `avg_current_hours = avg(status_duration_hours)` por `status`.
- `max_current_hours = max(status_duration_hours)` por `status`.

Historico por status:

- Base: `vw_ticket_status_time_by_ticket`.
- `tickets_afetados = count(distinct ticket_id)`.
- `avg_total_status_hours = avg(total_status_hours)`.
- `p90_total_status_hours = p90(total_status_hours)`.
- `total_horas = sum(total_status_hours)`.

Gargalo por pais:

- Base: `vw_ticket_status_time_by_ticket`.
- Pais canonico: `pais || regiao || region || 'Sem pais'`.
- Agrupar por pais + status.
- Ordenacao recomendada:
  1. `p90_total_status_hours` desc
  2. `tickets_afetados` desc
  3. `total_horas` desc

Nao misturar metricas:

- `avg_current_hours` representa tempo dos tickets abertos atualmente no status.
- `avg_total_status_hours` representa historico total gasto por ticket naquele status.
- `avg_interval_hours` representa media de cada passagem pelo status.

## Cuidados de design

- Seguir visual atual do KPI V2: `design-system.css`, `layout.css`, cards compactos, tabela densa.
- Nao usar hero/landing.
- Evitar cards dentro de cards.
- Kanban deve ter largura estavel por coluna e rolagem horizontal.
- Texto deve caber em mobile e desktop.
- Usar componentes compactos; esta e uma tela operacional, nao uma pagina de marketing.
- Se usar icones, preferir icones existentes/padroes simples; nao criar SVG decorativo grande.

## Criterios de aceite

- A aba `Mapa dos Atendimentos` aparece no hub e na nav.
- A pagina carrega sem erro com dados reais do Supabase.
- O quadro Kanban mostra uma coluna por status atual.
- Cada coluna mostra quantidade de tickets, media atual, p90 historico e pais mais afetado.
- Filtros por pais/regiao, departamento, prioridade e status funcionam.
- Ao clicar em uma coluna/status, a tabela de tickets e a tabela de gargalos filtram junto.
- A aba mostra health de sync de status e indica backlog zero quando estiver zerado.
- Nenhum segredo `service_role` aparece no frontend.
- Nao quebrar Daily, Weekly, Monthly nem `fetchDashboard`.

## Consultas finais de validacao

Backlog dos dois departamentos deve ser zero:

```sql
select count(*) as backlog_tickets_two_departments
from public.vw_ticket_history_sync_backlog
where id in (
  select id
  from public.zoho_tickets
  where department_id in ('1128522000000453544','1128522000000006907')
    and coalesce(is_deleted, false) = false
);
```

Cobertura por departamento:

```sql
with history as (
  select ticket_id, count(*) as history_events, max(synced_at) as last_history_synced_at
  from public.zoho_ticket_status_history
  group by ticket_id
)
select
  coalesce(d.name, t.department_id) as department_name,
  count(*) as tickets_total,
  count(*) filter (where coalesce(t.last_status_history_sync_at, h.last_history_synced_at) is not null) as tickets_synced,
  count(*) filter (where coalesce(t.last_status_history_sync_at, h.last_history_synced_at) is null) as tickets_pending,
  count(*) filter (
    where t.modified_time is not null
      and coalesce(t.last_status_history_sync_at, h.last_history_synced_at) is not null
      and t.modified_time > coalesce(t.last_status_history_sync_at, h.last_history_synced_at)
  ) as tickets_modified_after_sync
from public.zoho_tickets t
left join public.zoho_departments d on d.id = t.department_id
left join history h on h.ticket_id = t.id
where t.department_id in ('1128522000000453544','1128522000000006907')
  and coalesce(t.is_deleted, false) = false
group by coalesce(d.name, t.department_id)
order by tickets_total desc;
```

Erros recentes da funcao dedicada:

```sql
select count(*) as recent_status_history_function_errors
from public.sync_errors
where sync_type = 'v1h_status_history_only'
  and created_at >= now() - interval '24 hours';
```
