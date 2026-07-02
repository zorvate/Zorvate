-- -------------------------------------------------------------
-- ZORVATE V2: SECURE AUDIT LOGGING
-- -------------------------------------------------------------

create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  details jsonb default '{}'::jsonb not null,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.audit_logs enable row level security;

-- Only admins/super-admins can read audit logs
create policy "Allow admins to read audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

-- No public insert/update/delete operations permitted.
-- All logging runs through the secure server environment utilizing the service role.
