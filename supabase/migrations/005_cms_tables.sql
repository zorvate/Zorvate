-- -------------------------------------------------------------
-- ZORVATE V2: CMS DYNAMIC DATA TABLES
-- -------------------------------------------------------------

-- 1. FAQS TABLE
create table if not exists public.faqs (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  answer text not null,
  display_order integer default 0 not null
);

alter table public.faqs enable row level security;

create policy "Allow public read access to faqs"
  on public.faqs for select to public using (true);

create policy "Allow admin full access to faqs"
  on public.faqs for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

-- 2. TESTIMONIALS TABLE
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  text text not null,
  rating integer default 5 not null,
  display_order integer default 0 not null
);

alter table public.testimonials enable row level security;

create policy "Allow public read access to testimonials"
  on public.testimonials for select to public using (true);

create policy "Allow admin full access to testimonials"
  on public.testimonials for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

-- 3. TEAM MEMBERS TABLE
create table if not exists public.team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  image_url text not null,
  display_order integer default 0 not null
);

alter table public.team_members enable row level security;

create policy "Allow public read access to team_members"
  on public.team_members for select to public using (true);

create policy "Allow admin full access to team_members"
  on public.team_members for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

-- 4. SERVICES TABLE
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  short_description text not null,
  description text not null,
  features text[] default '{}' not null,
  display_order integer default 0 not null
);

alter table public.services enable row level security;

create policy "Allow public read access to services"
  on public.services for select to public using (true);

create policy "Allow admin full access to services"
  on public.services for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

-- 5. SITE SETTINGS TABLE
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  label text not null,
  updated_at timestamp with time zone default now() not null
);

alter table public.site_settings enable row level security;

create policy "Allow public read access to site_settings"
  on public.site_settings for select to public using (true);

create policy "Allow admin full access to site_settings"
  on public.site_settings for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

-- Seed site settings initial stats and company details
insert into public.site_settings (key, value, label) values
('projects_completed', '—', 'Projects Completed'),
('happy_clients', '—', 'Happy Clients'),
('solutions_delivered', '—', 'Solutions Delivered'),
('years_building', '—', 'Years Building'),
('company_name', 'Zorvate', 'Company Name'),
('company_email', 'hello@zorvate.com', 'Company Email'),
('company_phone', '+92 (300) 123-4567', 'Company Phone'),
('company_address', 'Remote Worldwide', 'Company Address'),
('company_description', 'We engineer high-fidelity web systems, design systems, and digital dashboards for teams requiring elite engineering quality and performance optimization.', 'Company Description'),
('social_facebook', 'https://facebook.com/zorvate', 'Facebook Link'),
('social_twitter', 'https://twitter.com/zorvate', 'Twitter Link'),
('social_github', 'https://github.com/zorvate', 'GitHub Link'),
('social_linkedin', 'https://linkedin.com/company/zorvate', 'LinkedIn Link')
on conflict (key) do nothing;
