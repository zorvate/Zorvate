-- USERS PROFILE TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'client',
  created_at timestamp with time zone default now()
);

-- ENABLE ROW LEVEL SECURITY
alter table public.profiles enable row level security;

-- POLICY: Users can read their own profile
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

-- POLICY: Users can update their own profile
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

-- POLICY: Insert profile on signup (handled by trigger or app)
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);