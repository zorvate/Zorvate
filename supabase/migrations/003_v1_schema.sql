-- -------------------------------------------------------------
-- 1. PORTFOLIO CMS
-- -------------------------------------------------------------
create table if not exists public.portfolio_projects (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  content text,
  category text not null,
  image_url text,
  gallery_urls text[] default '{}',
  video_url text,
  technologies text[] default '{}',
  featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  client_name text,
  project_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for portfolio
alter table public.portfolio_projects enable row level security;

create policy "Allow public read access to published portfolio projects"
  on public.portfolio_projects for select
  using (status = 'published');

create policy "Allow admin full access to portfolio projects"
  on public.portfolio_projects for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

-- -------------------------------------------------------------
-- 2. PROJECTS & WORKSPACES
-- -------------------------------------------------------------
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  status text default 'planning' check (status in ('planning', 'active', 'completed', 'on_hold')),
  progress integer default 0 check (progress >= 0 and progress <= 100),
  start_date date,
  end_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.projects enable row level security;

create policy "Clients can view their own projects"
  on public.projects for select
  using (auth.uid() = client_id);

create policy "Admins/Managers have full access to projects"
  on public.projects for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin', 'manager')
    )
  );

-- -------------------------------------------------------------
-- 3. MILESTONES
-- -------------------------------------------------------------
create table if not exists public.milestones (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  due_date date,
  status text default 'pending' check (status in ('pending', 'completed')),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.milestones enable row level security;

create policy "Clients can view milestones of their projects"
  on public.milestones for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = milestones.project_id
      and projects.client_id = auth.uid()
    )
  );

create policy "Admins/Managers have full access to milestones"
  on public.milestones for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin', 'manager')
    )
  );

-- -------------------------------------------------------------
-- 4. TASKS
-- -------------------------------------------------------------
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  milestone_id uuid references public.milestones(id) on delete set null,
  title text not null,
  description text,
  assigned_to uuid references public.profiles(id) on delete set null,
  status text default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.tasks enable row level security;

create policy "Clients can view tasks of their projects"
  on public.tasks for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = tasks.project_id
      and projects.client_id = auth.uid()
    )
  );

create policy "Admins/Managers/Developers/Designers have access to tasks"
  on public.tasks for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin', 'manager', 'developer', 'designer')
    )
  );

-- -------------------------------------------------------------
-- 5. COMMENTS
-- -------------------------------------------------------------
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  task_id uuid references public.tasks(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.comments enable row level security;

create policy "Users can view comments on projects they belong to"
  on public.comments for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = comments.project_id
      and (projects.client_id = auth.uid() or exists (
        select 1 from public.profiles where profiles.id = auth.uid() and profiles.role != 'client'
      ))
    )
  );

create policy "Users can insert comments on projects they belong to"
  on public.comments for insert
  with check (
    auth.uid() = user_id and (
      exists (
        select 1 from public.projects
        where projects.id = comments.project_id
        and (projects.client_id = auth.uid() or exists (
          select 1 from public.profiles where profiles.id = auth.uid() and profiles.role != 'client'
        ))
      )
    )
  );

create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- -------------------------------------------------------------
-- 6. ATTACHMENTS
-- -------------------------------------------------------------
create table if not exists public.attachments (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  task_id uuid references public.tasks(id) on delete cascade,
  name text not null,
  file_path text not null,
  file_size integer not null,
  file_type text not null,
  uploaded_by uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.attachments enable row level security;

create policy "Users can view attachments of their projects"
  on public.attachments for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = attachments.project_id
      and (projects.client_id = auth.uid() or exists (
        select 1 from public.profiles where profiles.id = auth.uid() and profiles.role != 'client'
      ))
    )
  );

create policy "Users can upload attachments to their projects"
  on public.attachments for insert
  with check (
    auth.uid() = uploaded_by and (
      exists (
        select 1 from public.projects
        where projects.id = attachments.project_id
        and (projects.client_id = auth.uid() or exists (
          select 1 from public.profiles where profiles.id = auth.uid() and profiles.role != 'client'
        ))
      )
    )
  );

-- -------------------------------------------------------------
-- 7. INVOICES
-- -------------------------------------------------------------
create table if not exists public.invoices (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete set null,
  client_id uuid references public.profiles(id) on delete cascade not null,
  invoice_number text unique not null,
  amount numeric(10,2) not null,
  status text default 'unpaid' check (status in ('unpaid', 'paid', 'overdue', 'cancelled')),
  issue_date date not null,
  due_date date not null,
  pdf_path text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.invoices enable row level security;

create policy "Clients can view their own invoices"
  on public.invoices for select
  using (auth.uid() = client_id);

create policy "Admins/Managers have full access to invoices"
  on public.invoices for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin', 'manager')
    )
  );

-- -------------------------------------------------------------
-- 8. MESSAGES
-- -------------------------------------------------------------
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.messages enable row level security;

create policy "Users can read project messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = messages.project_id
      and (projects.client_id = auth.uid() or exists (
        select 1 from public.profiles where profiles.id = auth.uid() and profiles.role != 'client'
      ))
    )
  );

create policy "Users can send project messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and (
      exists (
        select 1 from public.projects
        where projects.id = messages.project_id
        and (projects.client_id = auth.uid() or exists (
          select 1 from public.profiles where profiles.id = auth.uid() and profiles.role != 'client'
        ))
      )
    )
  );

-- -------------------------------------------------------------
-- 9. NOTIFICATIONS
-- -------------------------------------------------------------
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  link text,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

create policy "Users can read their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- -------------------------------------------------------------
-- 10. CONTACT REQUESTS
-- -------------------------------------------------------------
create table if not exists public.contact_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text,
  project_type text,
  budget text,
  message text not null,
  file_path text,
  status text default 'new' check (status in ('new', 'contacted', 'archived')),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.contact_requests enable row level security;

create policy "Anyone can submit contact requests"
  on public.contact_requests for insert
  with check (true);

create policy "Admins/Managers can read and manage contact requests"
  on public.contact_requests for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin', 'manager')
    )
  );

-- -------------------------------------------------------------
-- 11. CAREERS CMS
-- -------------------------------------------------------------
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  department text not null,
  location text not null,
  type text not null,
  description text not null,
  requirements text[] default '{}',
  benefits text[] default '{}',
  status text default 'open' check (status in ('open', 'closed')),
  created_at timestamp with time zone default now()
);

-- Enable RLS for jobs
alter table public.jobs enable row level security;

create policy "Anyone can view open jobs"
  on public.jobs for select
  using (status = 'open');

create policy "Admins can manage jobs"
  on public.jobs for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );

create table if not exists public.job_applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  name text not null,
  email text not null,
  resume_path text not null,
  cover_letter text,
  status text default 'applied' check (status in ('applied', 'reviewing', 'interviewing', 'offered', 'rejected')),
  created_at timestamp with time zone default now()
);

-- Enable RLS for job applications
alter table public.job_applications enable row level security;

create policy "Anyone can apply for jobs"
  on public.job_applications for insert
  with check (true);

create policy "Admins can view and manage job applications"
  on public.job_applications for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super-admin')
    )
  );
