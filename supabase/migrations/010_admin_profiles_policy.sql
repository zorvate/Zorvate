-- -------------------------------------------------------------
-- ZORVATE V2: ADMIN PROFILES RLS MANAGEMENT POLICIES
-- -------------------------------------------------------------

-- Create a security-definer helper function to bypass RLS and verify admin roles
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin', 'super-admin')
  );
end;
$$ language plpgsql security definer;

-- Drop existing admin/restrictive policies on profiles if any, to start clean
drop policy if exists "Admins can select all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
drop policy if exists "Admins can delete profiles" on public.profiles;

-- Add RLS policy: Admins/Super-admins can read all profiles
create policy "Admins can select all profiles"
  on public.profiles
  for select
  using (public.is_admin());

-- Add RLS policy: Admins/Super-admins can update all profiles
create policy "Admins can update all profiles"
  on public.profiles
  for update
  using (public.is_admin());

-- Add RLS policy: Admins/Super-admins can delete profiles
create policy "Admins can delete profiles"
  on public.profiles
  for delete
  using (public.is_admin());
