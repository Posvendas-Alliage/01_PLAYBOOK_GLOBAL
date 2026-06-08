-- Fix ROW SLA eligibility.
--
-- vw_tickets_bi_base already exposes meta_mtts_dias = 10 for ROW through
-- meta_mtts_dias_from_grupo, but the eligibility/status logic still checked
-- meta_mtts_dias_calc. For raw ROW values such as Africa, Asia, Europe,
-- India and Oceania, meta_mtts_dias_calc is NULL, so every closed ROW ticket
-- was marked as "Nao elegivel" even when ROW had a valid 10-day target.

do $$
declare
  view_sql text;
  needle_eligibility text := 'WHEN meta_mtts_dias_calc IS NULL THEN false';
  needle_status text := 'WHEN meta_mtts_dias_calc IS NULL THEN ''Não elegível''::text';
  needle_deadline text := 'closed_time > (created_time + meta_mtts_dias_calc::double precision * ''1 day''::interval)';
begin
  select pg_get_viewdef('public.vw_tickets_bi_base'::regclass, true)
    into view_sql;

  if ((length(view_sql) - length(replace(view_sql, needle_eligibility, ''))) / length(needle_eligibility)) <> 1 then
    raise exception 'Unexpected vw_tickets_bi_base definition: eligibility MTTS check not found exactly once';
  end if;

  if ((length(view_sql) - length(replace(view_sql, needle_status, ''))) / length(needle_status)) <> 1 then
    raise exception 'Unexpected vw_tickets_bi_base definition: status MTTS check not found exactly once';
  end if;

  if ((length(view_sql) - length(replace(view_sql, needle_deadline, ''))) / length(needle_deadline)) <> 1 then
    raise exception 'Unexpected vw_tickets_bi_base definition: deadline MTTS check not found exactly once';
  end if;

  view_sql := replace(
    view_sql,
    needle_eligibility,
    'WHEN meta_mtts_dias_from_grupo IS NULL THEN false'
  );

  view_sql := replace(
    view_sql,
    needle_status,
    'WHEN meta_mtts_dias_from_grupo IS NULL THEN ''Não elegível''::text'
  );

  view_sql := replace(
    view_sql,
    needle_deadline,
    'closed_time > (created_time + meta_mtts_dias_from_grupo::double precision * ''1 day''::interval)'
  );

  execute 'CREATE OR REPLACE VIEW public.vw_tickets_bi_base AS ' || view_sql;
end $$;
