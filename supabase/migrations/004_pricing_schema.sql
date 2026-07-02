-- -------------------------------------------------------------
-- ZORVATE V2: PRICING SYSTEM DATABASE SCHEMA
-- -------------------------------------------------------------

-- 1. PRICING PLANS TABLE
create table if not exists public.pricing_plans (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  currency text default 'USD' not null,
  billing_label text default '/month' not null,
  gradient text default 'indigo' not null,
  badge text,
  button_text text default 'Get Started' not null,
  button_url text default '/contact' not null,
  is_popular boolean default false not null,
  display_order integer default 0 not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS for plans
alter table public.pricing_plans enable row level security;

-- Policies for pricing_plans
create policy "Allow public read access to active pricing plans"
  on public.pricing_plans for select
  using (is_active = true);

create policy "Allow admin full access to pricing plans"
  on public.pricing_plans for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

-- 2. PRICING FEATURES TABLE
create table if not exists public.pricing_features (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references public.pricing_plans(id) on delete cascade not null,
  feature text not null,
  icon text default 'Check' not null,
  enabled boolean default true not null,
  display_order integer default 0 not null
);

-- Enable RLS for features
alter table public.pricing_features enable row level security;

-- Policies for pricing_features
create policy "Allow public read access to active pricing features"
  on public.pricing_features for select
  using (
    exists (
      select 1 from public.pricing_plans
      where pricing_plans.id = pricing_features.plan_id
      and pricing_plans.is_active = true
    )
  );

create policy "Allow admin full access to pricing features"
  on public.pricing_features for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

-- 3. PRICING COMPARISON TABLE
create table if not exists public.pricing_comparison (
  id uuid default gen_random_uuid() primary key,
  feature_name text not null,
  starter text default 'cross' not null,
  business text default 'cross' not null,
  web_app text default 'cross' not null,
  ai text default 'cross' not null,
  display_order integer default 0 not null
);

-- Enable RLS for comparisons
alter table public.pricing_comparison enable row level security;

-- Policies for pricing_comparison
create policy "Allow public read access to pricing comparison"
  on public.pricing_comparison for select
  to public
  using (true);

create policy "Allow admin full access to pricing comparison"
  on public.pricing_comparison for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

-- -------------------------------------------------------------
-- SEED INITIAL DATA
-- -------------------------------------------------------------

-- Seed plans
insert into public.pricing_plans (id, slug, name, description, price, currency, billing_label, gradient, badge, button_text, button_url, is_popular, display_order, is_active) values
('a1111111-1111-1111-1111-111111111111', 'starter', 'Starter Website', 'Premium landing page or high-converting site built with strict standards.', 49.00, 'USD', 'Starting From', 'indigo', null, 'Get Started', '/contact', false, 0, true),
('b2222222-2222-2222-2222-222222222222', 'business', 'Business Automation', 'Complete SaaS front-end design, API synchronizations, and CRM custom tools.', 149.00, 'USD', 'Starting From', 'accent', 'Most Popular', 'Schedule Call', '/contact', true, 1, true),
('c3333333-3333-3333-3333-333333333333', 'web-app', 'Full-Stack Platform', 'Robust full-stack Next.js applications, serverless database, and RLS structures.', 299.00, 'USD', 'Starting From', 'violet', null, 'Request Quote', '/contact', false, 2, true),
('d4444444-4444-4444-4444-444444444444', 'ai', 'AI & Neural Systems', 'Advanced vector memory, custom AI prompt layers, agents, and pipeline integrations.', 499.00, 'USD', 'Starting From', 'emerald', null, 'Discovery Session', '/contact', false, 3, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  gradient = excluded.gradient,
  badge = excluded.badge,
  is_popular = excluded.is_popular;

-- Seed features
insert into public.pricing_features (plan_id, feature, icon, enabled, display_order) values
-- Starter features
('a1111111-1111-1111-1111-111111111111', 'Custom UI Design Layout', 'Check', true, 0),
('a1111111-1111-1111-1111-111111111111', 'Framer Motion Animations', 'Check', true, 1),
('a1111111-1111-1111-1111-111111111111', 'Tailwind CSS v4 Styling', 'Check', true, 2),
('a1111111-1111-1111-1111-111111111111', 'Strict Search Engine Optimization', 'Check', true, 3),

-- Business features
('b2222222-2222-2222-2222-222222222222', 'Everything in Starter included', 'Check', true, 0),
('b2222222-2222-2222-2222-222222222222', 'Dynamic CRM integrations', 'Check', true, 1),
('b2222222-2222-2222-2222-222222222222', 'Performance Load optimization (<0.3s)', 'Check', true, 2),
('b2222222-2222-2222-2222-222222222222', 'API Integrations & Sync Nodes', 'Check', true, 3),

-- Web App features
('c3333333-3333-3333-3333-333333333333', 'Everything in Business included', 'Check', true, 0),
('c3333333-3333-3333-3333-333333333333', 'Serverless DB & Storage', 'Check', true, 1),
('c3333333-3333-3333-3333-333333333333', 'Secure Postgres RLS structures', 'Check', true, 2),
('c3333333-3333-3333-3333-333333333333', 'Full-Stack Portal Workspace', 'Check', true, 3),

-- AI features
('d4444444-4444-4444-4444-444444444444', 'Everything in Web App included', 'Check', true, 0),
('d4444444-4444-4444-4444-444444444444', 'Vector Memory Storage nodes', 'Check', true, 1),
('d4444444-4444-4444-4444-444444444444', 'Custom AI Agent Automations', 'Check', true, 2),
('d4444444-4444-4444-4444-444444444444', 'Prioritized Priority Support', 'Check', true, 3);

-- Seed comparisons
insert into public.pricing_comparison (feature_name, starter, business, web_app, ai, display_order) values
('Responsive Layouts', 'check', 'check', 'check', 'check', 0),
('Framer Motion Primitives', 'check', 'check', 'check', 'check', 1),
('Custom Domain Setup', 'check', 'check', 'check', 'check', 2),
('Search Engine Optimization', 'Basic SEO', 'Advanced SEO', 'Complete Audited SEO', 'Complete Audited SEO', 3),
('Supabase Auth Integration', 'cross', 'check', 'check', 'check', 4),
('API Sync Integrations', 'cross', '2 Integrations', 'Unlimited', 'Unlimited', 5),
('Full-Stack Client Portal', 'cross', 'cross', 'check', 'check', 6),
('Database & Storage Vault', 'cross', 'cross', 'check', 'check', 7),
('AI Custom Agent workflows', 'cross', 'cross', 'cross', 'check', 8),
('Dedicated Engineering Support', 'Email Support', 'Priority Support', '24/7 Slack Connect', 'Dedicated Team', 9);
