-- Reduce false sync-health warnings without changing raw Zoho mirror rows.
--
-- 1) Validation snapshot should ignore tombstoned tickets.
-- 2) Region quality should focus on currently open, non-deleted tickets.
-- 3) BI consumers should see a normalized status for the known accent variant.
-- 4) The open-ticket sweep cron can safely cover more of the queue per run.

create or replace view public.vw_sync_validation_snapshot as
with report_window as (
  select
    (
      (
        date_trunc('week', (now() at time zone 'America/Sao_Paulo') + interval '1 day')
        - interval '8 days'
      )::date::timestamp without time zone at time zone 'America/Sao_Paulo'
    ) as report_start,
    (
      (
        date_trunc('week', (now() at time zone 'America/Sao_Paulo') + interval '1 day')
        - interval '1 day'
      )::date::timestamp without time zone at time zone 'America/Sao_Paulo'
    ) as report_end_exclusive
), ticket_quality as (
  select
    count(*) as total_tickets,
    count(*) filter (where z.raw_metrics is null) as raw_metrics_missing,
    count(*) filter (
      where z.raw_metrics is null
        and z.closed_time is not null
    ) as closed_raw_metrics_missing,
    count(*) filter (
      where z.raw_metrics is null
        and z.closed_time >= date_trunc('month', now())
        and z.closed_time < date_trunc('month', now()) + interval '1 month'
    ) as current_month_closed_raw_metrics_missing,
    count(*) filter (
      where z.updated_in_supabase_at < now() - interval '7 days'
        and z.closed_time is null
    ) as open_stale_tickets,
    count(*) filter (
      where z.assignee_id is not null
        and a.email is null
    ) as assigned_without_agent_email,
    count(*) filter (
      where z.closed_time is null
        and (
          z.status = any (array['Fechado', 'Resolvido', 'Closed', 'Resolved'])
          or z.status_type = 'Closed'
        )
    ) as closed_status_without_closed_time,
    count(*) filter (
      where z.closed_time is null
        and coalesce(
          nullif(nullif(trim(z.region), ''), '-Nenhum-'),
          nullif(nullif(trim(z.regiao), ''), '-Nenhum-'),
          nullif(nullif(trim(z.pais), ''), '-Nenhum-')
        ) is null
    ) as tickets_without_region
  from public.zoho_tickets z
  left join public.zoho_agents a on a.id = z.assignee_id
  where coalesce(z.is_deleted, false) = false
), duplicate_quality as (
  select count(*) as duplicate_ticket_ids
  from (
    select id
    from public.zoho_tickets
    group by id
    having count(*) > 1
  ) d
), bi_quality as (
  select
    count(*) filter (
      where b.is_weekly_report_filter_included = true
        and b.closed_time >= (select report_start from report_window)
        and b.closed_time < (select report_end_exclusive from report_window)
        and b.mtfc_horas_bi is null
    ) as report_period_closed_without_mtfc,
    count(*) filter (
      where b.is_weekly_report_filter_included = true
        and b.is_open = true
        and coalesce(b.grupo_operacional_agente, '') = ''
    ) as tickets_without_operational_group
  from public.vw_tickets_bi_base b
)
select
  now() as snapshot_at,
  rw.report_start,
  rw.report_end_exclusive,
  tq.total_tickets,
  tq.raw_metrics_missing,
  tq.closed_raw_metrics_missing,
  tq.current_month_closed_raw_metrics_missing,
  bq.report_period_closed_without_mtfc,
  tq.open_stale_tickets,
  tq.assigned_without_agent_email,
  tq.closed_status_without_closed_time,
  dq.duplicate_ticket_ids,
  tq.tickets_without_region,
  bq.tickets_without_operational_group
from report_window rw
cross join ticket_quality tq
cross join duplicate_quality dq
cross join bi_quality bq;

do $$
declare
  view_sql text;
  needle text := 'v.status,';
  replacement text := 'CASE
                WHEN v.status = ''Aguardando Terceiro / Visita Tecnica''::text THEN ''Aguardando Terceiro / Visita Técnica''::text
                ELSE v.status
            END AS status,';
begin
  select pg_get_viewdef('public.vw_tickets_bi_base'::regclass, true)
    into view_sql;

  if position(replacement in view_sql) > 0 then
    return;
  end if;

  if ((length(view_sql) - length(replace(view_sql, needle, ''))) / length(needle)) <> 1 then
    raise exception 'Unexpected vw_tickets_bi_base definition: status projection not found exactly once';
  end if;

  view_sql := replace(view_sql, needle, replacement);

  execute 'CREATE OR REPLACE VIEW public.vw_tickets_bi_base AS ' || view_sql;
end $$;

do $$
declare
  target_job_id bigint;
  current_command text;
  updated_command text;
begin
  select jobid, command
    into target_job_id, current_command
  from cron.job
  where jobname = 'zoho-desk-open-tickets-sweep-hourly';

  if target_job_id is null then
    raise exception 'Cron job zoho-desk-open-tickets-sweep-hourly not found';
  end if;

  updated_command := regexp_replace(current_command, '''batchSize'',\s*20', '''batchSize'', 50');
  updated_command := regexp_replace(updated_command, '''maxBatches'',\s*3', '''maxBatches'', 6');

  if updated_command = current_command then
    raise exception 'Cron job command did not match expected sweep payload';
  end if;

  perform cron.alter_job(
    job_id := target_job_id,
    command := updated_command
  );
end $$;
