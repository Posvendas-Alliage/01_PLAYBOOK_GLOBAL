-- Playbook Global security layer: user profiles, approval workflow and RLS.
-- This migration intentionally does not create the initial administrator password.
-- Bootstrap is handled by a server-side Edge Function using environment variables.

create schema if not exists playbook_private;

create table if not exists public.playbook_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user',
  status text not null default 'pending',
  force_password_change boolean not null default false,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  status_changed_by uuid references auth.users(id) on delete set null,
  status_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint playbook_profiles_role_check check (role in ('user', 'admin')),
  constraint playbook_profiles_status_check check (status in ('pending', 'approved', 'rejected', 'suspended')),
  constraint playbook_profiles_email_not_blank check (length(btrim(email)) > 3)
);

create index if not exists idx_playbook_profiles_status on public.playbook_profiles(status);
create index if not exists idx_playbook_profiles_role_status on public.playbook_profiles(role, status);
create index if not exists idx_playbook_profiles_email_lower on public.playbook_profiles(lower(email));

comment on table public.playbook_profiles is
  'Approved-access profile table for the Global Playbook. Authorization must use this table/app-controlled metadata, never user_metadata.';
comment on column public.playbook_profiles.role is
  'Controlled values: user, admin.';
comment on column public.playbook_profiles.status is
  'Controlled values: pending, approved, rejected, suspended.';
comment on column public.playbook_profiles.force_password_change is
  'When true, the site and data endpoints must require password change before granting access.';

create table if not exists public.playbook_profile_audit (
  id bigserial primary key,
  target_user_id uuid not null references auth.users(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  old_status text,
  new_status text,
  old_role text,
  new_role text,
  notes text,
  created_at timestamptz not null default now(),
  constraint playbook_profile_audit_action_check check (
    action in ('created', 'approved', 'rejected', 'suspended', 'reactivated', 'role_changed', 'password_change_required', 'password_changed')
  ),
  constraint playbook_profile_audit_old_status_check check (
    old_status is null or old_status in ('pending', 'approved', 'rejected', 'suspended')
  ),
  constraint playbook_profile_audit_new_status_check check (
    new_status is null or new_status in ('pending', 'approved', 'rejected', 'suspended')
  ),
  constraint playbook_profile_audit_old_role_check check (
    old_role is null or old_role in ('user', 'admin')
  ),
  constraint playbook_profile_audit_new_role_check check (
    new_role is null or new_role in ('user', 'admin')
  )
);

create index if not exists idx_playbook_profile_audit_target_created
  on public.playbook_profile_audit(target_user_id, created_at desc);
create index if not exists idx_playbook_profile_audit_actor_created
  on public.playbook_profile_audit(actor_user_id, created_at desc);

comment on table public.playbook_profile_audit is
  'Audit trail for Playbook user approval/status changes.';

create or replace function playbook_private.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_playbook_profiles_updated_at on public.playbook_profiles;
create trigger trg_playbook_profiles_updated_at
before update on public.playbook_profiles
for each row
execute function playbook_private.set_updated_at();

create or replace function playbook_private.current_user_is_playbook_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.playbook_profiles p
    where p.user_id = (select auth.uid())
      and p.role = 'admin'
      and p.status = 'approved'
      and p.force_password_change is false
  );
$$;

revoke all on function playbook_private.current_user_is_playbook_admin() from public;
grant execute on function playbook_private.current_user_is_playbook_admin() to authenticated;

create or replace function playbook_private.current_user_is_playbook_approved()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.playbook_profiles p
    where p.user_id = (select auth.uid())
      and p.status = 'approved'
      and p.force_password_change is false
  );
$$;

revoke all on function playbook_private.current_user_is_playbook_approved() from public;
grant execute on function playbook_private.current_user_is_playbook_approved() to authenticated;

create or replace function playbook_private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.playbook_profiles (user_id, email, role, status)
  values (
    new.id,
    coalesce(new.email, ''),
    'user',
    'pending'
  )
  on conflict (user_id) do update
    set email = excluded.email;

  insert into public.playbook_profile_audit (
    target_user_id,
    actor_user_id,
    action,
    old_status,
    new_status,
    old_role,
    new_role,
    notes
  )
  values (
    new.id,
    null,
    'created',
    null,
    'pending',
    null,
    'user',
    'Profile created automatically after Supabase Auth signup.'
  )
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_playbook_profile on auth.users;
create trigger on_auth_user_created_playbook_profile
after insert on auth.users
for each row
execute function playbook_private.handle_new_auth_user();

alter table public.playbook_profiles enable row level security;
alter table public.playbook_profiles force row level security;
alter table public.playbook_profile_audit enable row level security;
alter table public.playbook_profile_audit force row level security;

drop policy if exists "Users can read own playbook profile" on public.playbook_profiles;
create policy "Users can read own playbook profile"
on public.playbook_profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Approved admins can read all playbook profiles" on public.playbook_profiles;
create policy "Approved admins can read all playbook profiles"
on public.playbook_profiles
for select
to authenticated
using ((select playbook_private.current_user_is_playbook_admin()));

drop policy if exists "Approved admins can read profile audit" on public.playbook_profile_audit;
create policy "Approved admins can read profile audit"
on public.playbook_profile_audit
for select
to authenticated
using ((select playbook_private.current_user_is_playbook_admin()));

grant usage on schema public to authenticated;
grant select on public.playbook_profiles to authenticated;
grant select on public.playbook_profile_audit to authenticated;
grant usage, select on sequence public.playbook_profile_audit_id_seq to authenticated;

-- No INSERT/UPDATE/DELETE policies are granted to browser clients.
-- Sensitive mutations are performed only by server-side Edge Functions after
-- verifying the caller is an approved administrator.

-- Protect private operational data consumed by the Playbook when these objects
-- exist in a given environment. Browser clients only get SELECT under RLS after
-- the user is approved and has no forced password change pending.
do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'zoho_tickets',
    'zoho_agents',
    'zoho_departments',
    'zoho_contacts',
    'zoho_ticket_status_history',
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

do $$
declare
  target_view text;
begin
  foreach target_view in array array[
    'vw_tickets_operational',
    'vw_tickets_bi_base',
    'vw_dashboard_kpis',
    'vw_dashboard_summary',
    'vw_backlog_operational',
    'vw_status_priority_summary',
    'vw_data_quality_operational',
    'vw_dashboard_bi_backlog',
    'vw_dashboard_bi_kpis',
    'vw_dashboard_bi_region_summary',
    'vw_dashboard_bi_summary',
    'vw_dashboard_bi_backlog_kpis',
    'vw_ticket_status_intervals',
    'vw_ticket_status_time_by_ticket',
    'vw_ticket_status_history_coverage',
    'vw_ticket_history_sync_backlog',
    'vw_sync_validation_snapshot'
  ]
  loop
    if to_regclass(format('public.%I', target_view)) is not null then
      begin
        execute format('alter view public.%I set (security_invoker = true)', target_view);
      exception when others then
        raise notice 'Could not set security_invoker on view %.%', 'public', target_view;
      end;

      execute format('grant select on public.%I to authenticated', target_view);
    end if;
  end loop;
end $$;
