-- Make ticket status timing consumable for bottleneck analysis.
--
-- The raw history table stores one status-change event per row.  These views
-- expose the same data as status intervals, per-ticket totals, regional
-- bottleneck summaries and an incremental backlog queue for the Edge Function.

create or replace view public.vw_ticket_status_intervals
with (security_invoker = true)
as
with intervals as (
  select
    h.id as status_history_id,
    h.ticket_id,
    t.ticket_number,
    t.subject,
    t.department_id,
    d.name as department_name,
    t.assignee_id,
    a.email as agent_email,
    trim(coalesce(nullif(t.regiao, ''), nullif(t.region, ''), 'Sem regiao')) as regiao,
    t.pais,
    t.region,
    t.priority,
    t.category,
    t.categoria_custom,
    t.tipo_atendimento,
    t.produtos,
    t.created_time,
    t.closed_time,
    t.modified_time,
    t.status as current_ticket_status,
    coalesce(t.is_deleted, false) as is_deleted,
    h.event_id,
    h.event_time as status_entered_at,
    h.next_event_time as next_status_event_at,
    h.previous_status,
    h.new_status as status,
    h.actor_id,
    h.actor_name,
    h.source_event_type,
    h.raw_event,
    h.synced_at as history_synced_at,
    coalesce(
      h.next_event_time,
      case
        when t.closed_time is not null and t.closed_time > h.event_time then t.closed_time
        when t.closed_time is null
          and lower(trim(coalesce(t.status, ''))) = lower(trim(coalesce(h.new_status, '')))
          then now()
        else null
      end
    ) as status_exited_at,
    case
      when h.next_event_time is not null then 'next_status_event'
      when t.closed_time is not null and t.closed_time > h.event_time then 'ticket_closed_time'
      when t.closed_time is null
        and lower(trim(coalesce(t.status, ''))) = lower(trim(coalesce(h.new_status, '')))
        then 'open_until_now'
      else 'unknown'
    end as duration_source
  from public.zoho_ticket_status_history h
  join public.zoho_tickets t on t.id = h.ticket_id
  left join public.zoho_departments d on d.id = t.department_id
  left join public.zoho_agents a on a.id = t.assignee_id
)
select
  status_history_id,
  ticket_id,
  ticket_number,
  subject,
  department_id,
  department_name,
  assignee_id,
  agent_email,
  regiao,
  pais,
  region,
  priority,
  category,
  categoria_custom,
  tipo_atendimento,
  produtos,
  created_time,
  closed_time,
  modified_time,
  current_ticket_status,
  is_deleted,
  event_id,
  status_entered_at,
  status_exited_at,
  next_status_event_at,
  previous_status,
  status,
  actor_id,
  actor_name,
  source_event_type,
  raw_event,
  history_synced_at,
  duration_source,
  next_status_event_at is null as is_current_status_interval,
  case
    when status_exited_at is not null and status_exited_at > status_entered_at
      then round((extract(epoch from status_exited_at - status_entered_at) / 60.0)::numeric, 0)
    else null
  end as status_duration_minutes,
  case
    when status_exited_at is not null and status_exited_at > status_entered_at
      then round((extract(epoch from status_exited_at - status_entered_at) / 3600.0)::numeric, 2)
    else null
  end as status_duration_hours,
  case
    when status_exited_at is not null and status_exited_at > status_entered_at
      then round((extract(epoch from status_exited_at - status_entered_at) / 86400.0)::numeric, 2)
    else null
  end as status_duration_days
from intervals;

create or replace view public.vw_ticket_status_time_by_ticket
with (security_invoker = true)
as
select
  ticket_id,
  ticket_number,
  subject,
  department_id,
  department_name,
  assignee_id,
  agent_email,
  regiao,
  pais,
  region,
  priority,
  category,
  categoria_custom,
  tipo_atendimento,
  produtos,
  current_ticket_status,
  created_time,
  closed_time,
  modified_time,
  status,
  count(*) as status_occurrences,
  min(status_entered_at) as first_status_entered_at,
  max(status_exited_at) as last_status_exited_at,
  bool_or(duration_source = 'open_until_now') as is_currently_in_status,
  round(sum(status_duration_minutes) / 60.0, 2) as total_status_hours,
  round(avg(status_duration_hours), 2) as avg_interval_hours,
  round(max(status_duration_hours), 2) as max_interval_hours,
  round(
    (percentile_cont(0.5) within group (order by status_duration_hours))::numeric,
    2
  ) as median_interval_hours,
  round(
    (percentile_cont(0.9) within group (order by status_duration_hours))::numeric,
    2
  ) as p90_interval_hours
from public.vw_ticket_status_intervals
where is_deleted = false
  and status_duration_minutes is not null
  and status_duration_minutes > 0
group by
  ticket_id,
  ticket_number,
  subject,
  department_id,
  department_name,
  assignee_id,
  agent_email,
  regiao,
  pais,
  region,
  priority,
  category,
  categoria_custom,
  tipo_atendimento,
  produtos,
  current_ticket_status,
  created_time,
  closed_time,
  modified_time,
  status;

create or replace view public.vw_status_time_by_region
with (security_invoker = true)
as
select
  regiao,
  status,
  count(*) as total_transicoes,
  round(avg(status_duration_hours), 2) as avg_horas,
  round(
    (percentile_cont(0.5) within group (order by status_duration_hours))::numeric,
    2
  ) as mediana_horas,
  round(max(status_duration_hours), 2) as max_horas,
  round(
    (percentile_cont(0.9) within group (order by status_duration_hours))::numeric,
    2
  ) as p90_horas,
  count(distinct ticket_id) as tickets_afetados,
  count(*) as total_intervalos,
  count(*) filter (where duration_source = 'open_until_now') as intervalos_abertos_agora,
  round(sum(status_duration_hours), 2) as total_horas
from public.vw_ticket_status_intervals
where is_deleted = false
  and status_duration_minutes is not null
  and status_duration_minutes > 0
group by regiao, status
order by regiao, avg_horas desc;

create or replace view public.vw_bottleneck_by_status
with (security_invoker = true)
as
select
  status,
  regiao,
  count(distinct ticket_id) as tickets_afetados,
  round(avg(status_duration_hours), 2) as avg_horas,
  round(
    (percentile_cont(0.9) within group (order by status_duration_hours))::numeric,
    2
  ) as p90_horas,
  round(
    (percentile_cont(0.5) within group (order by status_duration_hours))::numeric,
    2
  ) as mediana_horas,
  count(*) as total_intervalos,
  count(*) filter (where duration_source = 'open_until_now') as intervalos_abertos_agora,
  round(max(status_duration_hours), 2) as max_horas,
  round(sum(status_duration_hours), 2) as total_horas
from public.vw_ticket_status_intervals
where is_deleted = false
  and status_duration_minutes is not null
  and status_duration_minutes > 0
group by status, regiao
order by avg_horas desc;

create or replace view public.vw_ticket_status_history_coverage
with (security_invoker = true)
as
with history as (
  select
    ticket_id,
    count(*) as history_events,
    max(event_time) as last_history_event_time,
    max(synced_at) as last_history_synced_at
  from public.zoho_ticket_status_history
  group by ticket_id
)
select
  trim(coalesce(nullif(t.regiao, ''), nullif(t.region, ''), 'Sem regiao')) as regiao,
  count(*) as tickets_total,
  count(*) filter (where h.ticket_id is not null) as tickets_com_historico,
  count(*) filter (where h.ticket_id is null) as tickets_sem_historico,
  round(
    100.0 * count(*) filter (where h.ticket_id is not null) / nullif(count(*), 0),
    1
  ) as pct_com_historico,
  max(t.modified_time) filter (where h.ticket_id is null) as ultimo_ticket_sem_historico_modificado,
  min(h.last_history_synced_at) as menor_history_synced_at,
  max(h.last_history_synced_at) as maior_history_synced_at
from public.zoho_tickets t
left join history h on h.ticket_id = t.id
where coalesce(t.is_deleted, false) = false
  and coalesce(t.department_id, '') <> '1128522000008788112'
group by trim(coalesce(nullif(t.regiao, ''), nullif(t.region, ''), 'Sem regiao'))
order by tickets_sem_historico desc, tickets_total desc;

create or replace view public.vw_ticket_history_sync_backlog
with (security_invoker = true)
as
with history as (
  select
    ticket_id,
    count(*) as history_events,
    max(event_time) as last_history_event_time,
    max(synced_at) as last_history_synced_at
  from public.zoho_ticket_status_history
  group by ticket_id
)
select
  t.id,
  t.ticket_number,
  t.status,
  t.created_time,
  t.closed_time,
  t.regiao,
  t.region,
  t.modified_time,
  h.history_events,
  h.last_history_event_time,
  h.last_history_synced_at,
  case
    when h.ticket_id is null then 0
    when t.modified_time is not null and t.modified_time > h.last_history_synced_at then 1
    when h.last_history_synced_at < now() - interval '7 days' then 2
    else 9
  end as sync_priority,
  case
    when h.ticket_id is null then 'missing_history'
    when t.modified_time is not null and t.modified_time > h.last_history_synced_at then 'ticket_modified_after_history_sync'
    when h.last_history_synced_at < now() - interval '7 days' then 'stale_history'
    else 'fresh'
  end as sync_reason
from public.zoho_tickets t
left join history h on h.ticket_id = t.id
where coalesce(t.is_deleted, false) = false
  and coalesce(t.department_id, '') <> '1128522000008788112'
  and (
    h.ticket_id is null
    or (t.modified_time is not null and t.modified_time > h.last_history_synced_at)
    or h.last_history_synced_at < now() - interval '7 days'
  )
order by
  sync_priority,
  coalesce(t.modified_time, t.created_time) desc nulls last;

grant select on
  public.vw_ticket_status_intervals,
  public.vw_ticket_status_time_by_ticket,
  public.vw_status_time_by_region,
  public.vw_bottleneck_by_status,
  public.vw_ticket_status_history_coverage,
  public.vw_ticket_history_sync_backlog
to anon, authenticated;
