-- Close legacy anonymous access and enforce approved-user authorization.

drop policy if exists zoho_tickets_anon_read on public.zoho_tickets;
drop policy if exists zoho_agents_anon_read on public.zoho_agents;

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;

-- Browser users are read-only. RLS decides which authenticated rows are visible.
revoke insert, update, delete, truncate, references, trigger
on all tables in schema public from authenticated;

do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'zoho_tickets',
    'zoho_agents',
    'zoho_departments',
    'zoho_contacts',
    'zoho_ticket_metrics',
    'zoho_ticket_status_history',
    'sync_control',
    'sync_runs',
    'sync_errors'
  ]
  loop
    if to_regclass(format('public.%I', target_table)) is not null then
      execute format('alter table public.%I enable row level security', target_table);
      execute format('alter table public.%I force row level security', target_table);
      execute format('drop policy if exists playbook_approved_select on public.%I', target_table);
      execute format(
        'create policy playbook_approved_select on public.%I for select to authenticated using ((select playbook_private.current_user_is_playbook_approved()))',
        target_table
      );
      execute format('grant select on public.%I to authenticated', target_table);
      execute format('grant select, insert, update, delete on public.%I to service_role', target_table);
    end if;
  end loop;
end $$;

-- Views run with caller permissions so the base-table RLS remains effective.
do $$
declare
  target_view text;
begin
  for target_view in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'v'
  loop
    execute format('alter view public.%I set (security_invoker = true)', target_view);
    execute format('revoke all on public.%I from anon', target_view);
    execute format('revoke insert, update, delete, truncate, references, trigger on public.%I from authenticated', target_view);
    execute format('grant select on public.%I to authenticated', target_view);
    execute format('grant select on public.%I to service_role', target_view);
  end loop;
end $$;

-- Materialized views cannot use RLS. Keep them server-side only.
revoke all on public.mv_kanban_eligible_ticket_ids from anon, authenticated;
grant select on public.mv_kanban_eligible_ticket_ids to service_role;

create or replace function public.fn_kanban_status_metrics(
  p_regiao text default null,
  p_dept text default null,
  p_priority text default null
)
returns table(
  status_norm text,
  total_intervalos bigint,
  tickets_distintos bigint,
  avg_horas numeric,
  mediana_horas numeric,
  p90_horas numeric,
  max_horas numeric
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    case
      when si.status ilike '%Visita Tecnica%' or si.status ilike '%Visita Técnica%'
        then 'Aguardando Terceiro / Visita Técnica'
      else si.status
    end as status_norm,
    count(*)::bigint as total_intervalos,
    count(distinct si.ticket_id)::bigint as tickets_distintos,
    round(avg(si.status_duration_hours)::numeric, 1) as avg_horas,
    round(percentile_cont(0.5) within group (order by si.status_duration_hours)::numeric, 1) as mediana_horas,
    round(percentile_cont(0.9) within group (order by si.status_duration_hours)::numeric, 1) as p90_horas,
    round(max(si.status_duration_hours)::numeric, 0) as max_horas
  from public.vw_ticket_status_intervals si
  join public.mv_kanban_eligible_ticket_ids e on e.ticket_id = si.ticket_id
  where playbook_private.current_user_is_playbook_approved()
    and si.is_deleted = false
    and si.status_duration_hours is not null
    and si.status_duration_hours >= 0
    and si.status not in ('Fechado', 'Closed', 'Resolvido', 'Pendente')
    and (si.department_name is null or si.department_name != 'Oficina')
    and (p_regiao is null or si.regiao = p_regiao or si.region = p_regiao)
    and (p_dept is null or si.department_name = p_dept)
    and (p_priority is null or si.priority = p_priority)
  group by 1
  order by avg_horas desc nulls last
$$;

create or replace function public.fn_kanban_filter_options()
returns json
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select json_build_object(
    'regioes', (
      select coalesce(json_agg(v order by v), '[]'::json)
      from (
        select distinct coalesce(nullif(si.regiao, ''), si.region) as v
        from public.vw_ticket_status_intervals si
        join public.mv_kanban_eligible_ticket_ids e on e.ticket_id = si.ticket_id
        where playbook_private.current_user_is_playbook_approved()
          and si.is_deleted = false
          and (si.department_name is null or si.department_name != 'Oficina')
          and si.status not in ('Fechado', 'Closed', 'Resolvido', 'Pendente')
          and coalesce(nullif(si.regiao, ''), si.region) is not null
      ) sub
    ),
    'departamentos', (
      select coalesce(json_agg(v order by v), '[]'::json)
      from (
        select distinct si.department_name as v
        from public.vw_ticket_status_intervals si
        join public.mv_kanban_eligible_ticket_ids e on e.ticket_id = si.ticket_id
        where playbook_private.current_user_is_playbook_approved()
          and si.is_deleted = false
          and si.department_name is not null
          and si.department_name != 'Oficina'
          and si.status not in ('Fechado', 'Closed', 'Resolvido', 'Pendente')
      ) sub
    ),
    'prioridades', (
      select coalesce(json_agg(v order by v), '[]'::json)
      from (
        select distinct si.priority as v
        from public.vw_ticket_status_intervals si
        join public.mv_kanban_eligible_ticket_ids e on e.ticket_id = si.ticket_id
        where playbook_private.current_user_is_playbook_approved()
          and si.is_deleted = false
          and (si.department_name is null or si.department_name != 'Oficina')
          and si.status not in ('Fechado', 'Closed', 'Resolvido', 'Pendente')
          and si.priority is not null
      ) sub
    )
  )
$$;

revoke all on function public.fn_kanban_status_metrics(text, text, text) from public, anon;
revoke all on function public.fn_kanban_filter_options() from public, anon;
grant execute on function public.fn_kanban_status_metrics(text, text, text) to authenticated, service_role;
grant execute on function public.fn_kanban_filter_options() to authenticated, service_role;

-- Event-trigger helpers are internal implementation details, never public RPCs.
revoke all on function public.rls_auto_enable() from public, anon, authenticated, service_role;
revoke all on function playbook_private.handle_new_auth_user() from public, anon, authenticated;
revoke all on function playbook_private.set_updated_at() from public, anon, authenticated;
