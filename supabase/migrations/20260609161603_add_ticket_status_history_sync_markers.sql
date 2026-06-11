-- Track status-history sync attempts per ticket.
--
-- Some Zoho tickets can return zero status history events. Without a per-ticket
-- sync marker, those tickets would remain forever in the "missing history"
-- backlog because there is no row to insert into zoho_ticket_status_history.

alter table public.zoho_tickets
  add column if not exists last_status_history_sync_at timestamp with time zone,
  add column if not exists status_history_event_count integer;

create index if not exists idx_zoho_tickets_last_status_history_sync_at
  on public.zoho_tickets (last_status_history_sync_at);

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
), ticket_scope as (
  select
    t.*,
    h.history_events,
    h.last_history_event_time,
    h.last_history_synced_at,
    coalesce(t.last_status_history_sync_at, h.last_history_synced_at) as effective_status_history_sync_at
  from public.zoho_tickets t
  left join history h on h.ticket_id = t.id
  where coalesce(t.is_deleted, false) = false
    and coalesce(t.department_id, '') <> '1128522000008788112'
)
select
  trim(coalesce(nullif(regiao, ''), nullif(region, ''), 'Sem regiao')) as regiao,
  count(*) as tickets_total,
  count(*) filter (where history_events is not null) as tickets_com_historico,
  count(*) filter (where history_events is null) as tickets_sem_historico,
  round(
    100.0 * count(*) filter (where history_events is not null) / nullif(count(*), 0),
    1
  ) as pct_com_historico,
  max(modified_time) filter (where history_events is null) as ultimo_ticket_sem_historico_modificado,
  min(last_history_synced_at) as menor_history_synced_at,
  max(last_history_synced_at) as maior_history_synced_at,
  count(*) filter (where effective_status_history_sync_at is not null) as tickets_status_history_sync_done,
  count(*) filter (where effective_status_history_sync_at is null) as tickets_status_history_sync_pendente,
  count(*) filter (
    where effective_status_history_sync_at is not null
      and coalesce(history_events, 0) = 0
  ) as tickets_sem_eventos_status_apos_sync,
  count(*) filter (
    where effective_status_history_sync_at is not null
      and modified_time is not null
      and modified_time > effective_status_history_sync_at
  ) as tickets_modificados_apos_status_sync,
  round(
    100.0 * count(*) filter (where effective_status_history_sync_at is not null) / nullif(count(*), 0),
    1
  ) as pct_status_history_sync_done
from ticket_scope
group by trim(coalesce(nullif(regiao, ''), nullif(region, ''), 'Sem regiao'))
order by tickets_status_history_sync_pendente desc, tickets_sem_historico desc, tickets_total desc;

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
), scoped_tickets as (
  select
    t.id,
    t.ticket_number,
    t.status,
    t.created_time,
    t.closed_time,
    t.regiao,
    t.region,
    t.modified_time,
    t.last_status_history_sync_at,
    t.status_history_event_count,
    h.history_events,
    h.last_history_event_time,
    h.last_history_synced_at,
    coalesce(t.last_status_history_sync_at, h.last_history_synced_at) as effective_status_history_sync_at
  from public.zoho_tickets t
  left join history h on h.ticket_id = t.id
  where coalesce(t.is_deleted, false) = false
    and coalesce(t.department_id, '') <> '1128522000008788112'
)
select
  id,
  ticket_number,
  status,
  created_time,
  closed_time,
  regiao,
  region,
  modified_time,
  history_events,
  last_history_event_time,
  last_history_synced_at,
  case
    when effective_status_history_sync_at is null then 0
    when modified_time is not null and modified_time > effective_status_history_sync_at then 1
    else 9
  end as sync_priority,
  case
    when effective_status_history_sync_at is null then 'missing_status_history_sync'
    when modified_time is not null and modified_time > effective_status_history_sync_at then 'ticket_modified_after_status_history_sync'
    else 'fresh'
  end as sync_reason,
  effective_status_history_sync_at,
  last_status_history_sync_at,
  status_history_event_count
from scoped_tickets
where effective_status_history_sync_at is null
  or (modified_time is not null and modified_time > effective_status_history_sync_at)
order by
  sync_priority,
  coalesce(modified_time, created_time) desc nulls last;

grant select on
  public.vw_ticket_status_history_coverage,
  public.vw_ticket_history_sync_backlog
to anon, authenticated;
