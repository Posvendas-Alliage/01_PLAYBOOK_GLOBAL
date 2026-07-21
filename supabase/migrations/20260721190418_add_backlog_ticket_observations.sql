-- Store manual backlog observations without changing the Zoho-synced ticket row.
-- Browser writes are limited by RLS to approved Playbook users.

create table if not exists public.playbook_ticket_observations (
  ticket_id text primary key,
  observation text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint playbook_ticket_observations_ticket_id_not_blank check (length(btrim(ticket_id)) > 0),
  constraint playbook_ticket_observations_observation_len check (char_length(observation) <= 4000)
);

create index if not exists idx_playbook_ticket_observations_updated_at
  on public.playbook_ticket_observations(updated_at desc);

comment on table public.playbook_ticket_observations is
  'Manual observations explaining delayed/open backlog tickets in the Playbook Daily backlog view.';

comment on column public.playbook_ticket_observations.observation is
  'Free-text reason/context for delayed backlog handling. It is manually maintained in the Playbook.';

create or replace function playbook_private.set_ticket_observation_audit_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    new.created_at = coalesce(new.created_at, now());
    new.created_by = coalesce(new.created_by, (select auth.uid()));
  else
    new.created_at = old.created_at;
    new.created_by = old.created_by;
  end if;

  new.updated_at = now();
  new.updated_by = coalesce((select auth.uid()), new.updated_by, new.created_by);
  return new;
end;
$$;

drop trigger if exists trg_playbook_ticket_observations_audit_fields
  on public.playbook_ticket_observations;

create trigger trg_playbook_ticket_observations_audit_fields
before insert or update on public.playbook_ticket_observations
for each row
execute function playbook_private.set_ticket_observation_audit_fields();

alter table public.playbook_ticket_observations enable row level security;
alter table public.playbook_ticket_observations force row level security;

drop policy if exists playbook_ticket_observations_approved_select
  on public.playbook_ticket_observations;
create policy playbook_ticket_observations_approved_select
on public.playbook_ticket_observations
for select
to authenticated
using ((select playbook_private.current_user_is_playbook_approved()));

drop policy if exists playbook_ticket_observations_approved_insert
  on public.playbook_ticket_observations;
create policy playbook_ticket_observations_approved_insert
on public.playbook_ticket_observations
for insert
to authenticated
with check (
  (select playbook_private.current_user_is_playbook_approved())
  and created_by = (select auth.uid())
);

drop policy if exists playbook_ticket_observations_approved_update
  on public.playbook_ticket_observations;
create policy playbook_ticket_observations_approved_update
on public.playbook_ticket_observations
for update
to authenticated
using ((select playbook_private.current_user_is_playbook_approved()))
with check (
  (select playbook_private.current_user_is_playbook_approved())
  and updated_by = (select auth.uid())
);

drop policy if exists playbook_ticket_observations_approved_delete
  on public.playbook_ticket_observations;
create policy playbook_ticket_observations_approved_delete
on public.playbook_ticket_observations
for delete
to authenticated
using ((select playbook_private.current_user_is_playbook_approved()));

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.playbook_ticket_observations to authenticated;
grant select, insert, update, delete on public.playbook_ticket_observations to service_role;

revoke all on function playbook_private.set_ticket_observation_audit_fields() from public, anon, authenticated;
