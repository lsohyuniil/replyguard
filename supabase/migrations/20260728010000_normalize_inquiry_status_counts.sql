drop function if exists public.get_inquiry_status_counts();

create function public.get_inquiry_status_counts()
returns table (
  all_count bigint,
  in_progress_count bigint,
  action_required_count bigint,
  completed_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    count(*) as all_count,
    count(*) filter (where status = 'IN_PROGRESS') as in_progress_count,
    count(*) filter (where status = 'ACTION_REQUIRED') as action_required_count,
    count(*) filter (where status = 'COMPLETED') as completed_count
  from public.inquiries;
$$;

revoke all on function public.get_inquiry_status_counts() from public;
grant execute on function public.get_inquiry_status_counts() to service_role;
