create or replace function public.get_inquiry_status_counts()
returns table (
  "ALL" bigint,
  "IN_PROGRESS" bigint,
  "ACTION_REQUIRED" bigint,
  "COMPLETED" bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    count(*) as "ALL",
    count(*) filter (where status = 'IN_PROGRESS') as "IN_PROGRESS",
    count(*) filter (where status = 'ACTION_REQUIRED') as "ACTION_REQUIRED",
    count(*) filter (where status = 'COMPLETED') as "COMPLETED"
  from public.inquiries;
$$;

revoke all on function public.get_inquiry_status_counts() from public;
grant execute on function public.get_inquiry_status_counts() to service_role;
