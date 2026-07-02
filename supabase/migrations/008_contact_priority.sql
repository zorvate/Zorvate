-- -------------------------------------------------------------
-- ZORVATE V2: CONTACT INQUIRIES PRIORITY & CRM STATUS EXTENSION
-- -------------------------------------------------------------

-- Alter status check constraint to support qualified status
alter table public.contact_requests drop constraint if exists contact_requests_status_check;
alter table public.contact_requests add constraint contact_requests_status_check check (status in ('new', 'contacted', 'qualified', 'archived'));

-- Add priority column with check constraint
alter table public.contact_requests add column if not exists priority text default 'medium' check (priority in ('low', 'medium', 'high', 'critical'));
