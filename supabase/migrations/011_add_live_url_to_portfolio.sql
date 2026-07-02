-- -------------------------------------------------------------
-- ZORVATE V2.1: ADD LIVE_URL TO PORTFOLIO PROJECTS
-- -------------------------------------------------------------

-- Alter table public.portfolio_projects to add live_url text column
alter table public.portfolio_projects add column if not exists live_url text;
