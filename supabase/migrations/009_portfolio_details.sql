-- -------------------------------------------------------------
-- ZORVATE V2: EXTEND PORTFOLIO SCHEMA WITH DETAIL CASE STUDIES
-- -------------------------------------------------------------

-- Alter table public.portfolio_projects to add detailed metrics, step phases, and quotes
alter table public.portfolio_projects add column if not exists challenge text;
alter table public.portfolio_projects add column if not exists solution text;
alter table public.portfolio_projects add column if not exists testimonial_quote text;
alter table public.portfolio_projects add column if not exists testimonial_author text;
alter table public.portfolio_projects add column if not exists testimonial_role text;
alter table public.portfolio_projects add column if not exists metrics jsonb default '[]'::jsonb not null;
alter table public.portfolio_projects add column if not exists process_steps jsonb default '[]'::jsonb not null;

-- Seed default case studies
insert into public.portfolio_projects (
  slug,
  title,
  description,
  category,
  image_url,
  featured,
  status,
  technologies,
  challenge,
  solution,
  testimonial_quote,
  testimonial_author,
  testimonial_role,
  metrics,
  process_steps,
  client_name,
  project_date
) values
-- Case study 1: SaaS Dashboard
(
  'saas-dashboard',
  'SaaS Dashboard',
  'A scalable SaaS dashboard built with Next.js, TypeScript, and Supabase.',
  'Web Application',
  '/images/portfolio/saas-dashboard.jpg',
  true,
  'published',
  array['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
  'The client''s legacy dashboard suffered from heavy bundle sizes, slow SQL querying times, and a dated visual style that led to user churn. They needed a state-of-the-art interface that felt immediate and secure.',
  'We engineered a server-side-rendered Next.js core backed by a secure PostgreSQL database, optimized query caching, and automated billing callbacks via Stripe. We integrated fluid motion layers to keep users engaged.',
  'Zorvate completely transformed our visual product. The load speed dropped dramatically and our users love the dashboard.',
  'Ammar Jaffri',
  'CEO, FinTech SaaS Corp',
  '[{"label": "Platform Uptime", "value": 99.99, "suffix": "%"}, {"label": "Page Load Speed", "value": 0.38, "suffix": "s"}, {"label": "User Engagement", "value": 145, "suffix": "%"}]'::jsonb,
  '[{"phase": "Phase 01", "title": "Strategy & Interface Mapping", "desc": "Mapped client profiles and set up security boundaries."}, {"phase": "Phase 02", "title": "Visual Prototyping", "desc": "Designed premium glassmorphic UI cards in Figma."}, {"phase": "Phase 03", "title": "Dashboard Coding", "desc": "Built the dashboard panels and real-time event updates."}, {"phase": "Phase 04", "title": "Performance Tuning", "desc": "Achieved sub-second page loads and compiled final bundles."}]'::jsonb,
  'FinTech SaaS Corp',
  '2025-06-15'
),
-- Case study 2: Agency Website
(
  'agency-website',
  'Agency Website',
  'A high-converting agency website focused on SEO and lead generation.',
  'Marketing Website',
  '/images/portfolio/agency-website.jpg',
  true,
  'published',
  array['Next.js', 'React', 'Tailwind CSS v4', 'Framer Motion', 'Netlify'],
  'A highly static online brochure that loaded slowly on mobile and failed to capture leads or drive user engagement. It lacked emotional appeal and failed to express the brand''s premium identity.',
  'We built a fully static Next.js export with Tailwind CSS v4 layout tokens, highly responsive fluid animations, and a structured Netlify deployment. We added interactive overlays and magnetic button hooks.',
  'Working with Zorvate was a game-changer. The conversion rate of our landing pages increased immediately.',
  'Sarah Ahmed',
  'Marketing VP, Creative Ltd',
  '[{"label": "Lighthouse Score", "value": 100, "suffix": ""}, {"label": "Lead Conversions", "value": 320, "suffix": "%"}, {"label": "Time-to-Interactive", "value": 1.1, "suffix": "s"}]'::jsonb,
  '[{"phase": "Phase 01", "title": "Brand Alignment", "desc": "Defined color palettes, typography guidelines, and transition metrics."}, {"phase": "Phase 02", "title": "Layout Protyping", "desc": "Composed complex grid layouts with scroll indicators."}, {"phase": "Phase 03", "title": "Animation Sprints", "desc": "Implemented magnetic effects and particle canvas layers."}, {"phase": "Phase 04", "title": "Deployment Audit", "desc": "Validated responsive grid elements and metadata schemas."}]'::jsonb,
  'Creative Branding Ltd',
  '2025-08-20'
),
-- Case study 3: Client Portal
(
  'client-portal',
  'Client Portal',
  'A secure client portal with project tracking, files, and messaging.',
  'Business System',
  '/images/portfolio/client-portal.jpg',
  true,
  'published',
  array['Next.js', 'Supabase', 'Tailwind CSS', 'TypeScript', 'WebSockets'],
  'Legacy file delivery processes relied on insecure email threads and manual sheets, creating operational bottleneck delays and exposing sensitive client documents.',
  'Next.js App Router workspace coupled to a secure cloud storage container, real-time message tables, and multi-tenant admin levels. Documents are isolated using cryptographically secure user workspaces.',
  'We needed an enterprise-grade file vault portal that was fast and secure. Zorvate delivered beyond expectations.',
  'Zainab Malik',
  'COO, Apex Group',
  '[{"label": "Assets Encrypted", "value": 10000, "suffix": "+"}, {"label": "Platform Reliability", "value": 99.9, "suffix": "%"}, {"label": "Average Load Speed", "value": 0.28, "suffix": "s"}]'::jsonb,
  '[{"phase": "Phase 01", "title": "Security Blueprint", "desc": "Designed strict profile relations and workspace partitions."}, {"phase": "Phase 02", "title": "Vault Architecture", "desc": "Created secure storage bucket parameters."}, {"phase": "Phase 03", "title": "Collaborative Coding", "desc": "Built files uploading nodes and real-time message boards."}, {"phase": "Phase 04", "title": "Compliance Review", "desc": "Verified file vault integrity under concurrent loads."}]'::jsonb,
  'Apex Management Group',
  '2025-11-10'
)
on conflict (slug) do update set
  challenge = excluded.challenge,
  solution = excluded.solution,
  testimonial_quote = excluded.testimonial_quote,
  testimonial_author = excluded.testimonial_author,
  testimonial_role = excluded.testimonial_role,
  metrics = excluded.metrics,
  process_steps = excluded.process_steps,
  client_name = excluded.client_name,
  project_date = excluded.project_date;
