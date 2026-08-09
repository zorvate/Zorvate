-- -------------------------------------------------------------
-- Add display_order to portfolio_projects
-- -------------------------------------------------------------

alter table public.portfolio_projects add column if not exists display_order integer default 0 not null;

-- Optionally set display_order for existing rows based on created_at (if desired):
-- update public.portfolio_projects set display_order = coalesce((select row_number() over (order by created_at asc) from public.portfolio_projects p2 where p2.id = public.portfolio_projects.id), 0);
