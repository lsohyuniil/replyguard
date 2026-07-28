create or replace function public.get_dashboard_summary(
  from_date date,
  to_date date,
  timezone_name text default 'Asia/Seoul'
)
returns jsonb
language plpgsql
stable
set search_path = public
as $$
declare
  result jsonb;
begin
  if from_date > to_date then
    raise exception 'from_date must be on or before to_date';
  end if;

  with
  filtered_inquiries as (
    select
      status,
      stage,
      intent,
      completion_type,
      (received_at at time zone timezone_name)::date as received_date
    from public.inquiries
    where received_at >= (from_date::timestamp at time zone timezone_name)
      and received_at < ((to_date + 1)::timestamp at time zone timezone_name)
  ),
  status_values(status, ordinal) as (
    values
      ('IN_PROGRESS'::text, 1),
      ('ACTION_REQUIRED'::text, 2),
      ('COMPLETED'::text, 3)
  ),
  intent_values(intent, ordinal) as (
    values
      ('DELIVERY_STATUS'::text, 1),
      ('POLICY_FAQ'::text, 2),
      ('EXCHANGE'::text, 3),
      ('REFUND'::text, 4),
      ('DAMAGE'::text, 5),
      ('COMPENSATION'::text, 6),
      ('OTHER'::text, 7)
  ),
  completion_values(completion_type, ordinal) as (
    values
      ('AUTO_SENT'::text, 1),
      ('APPROVED_SENT'::text, 2),
      ('MANUAL_SENT'::text, 3)
  ),
  trend_dates as (
    select generated_at::date as trend_date
    from generate_series(from_date, to_date, interval '1 day') as generated_at
  )
  select jsonb_build_object(
    'period',
    jsonb_build_object(
      'from', from_date,
      'to', to_date,
      'timezone', timezone_name
    ),
    'summary',
    (
      select jsonb_build_object(
        'total_inquiries', count(*),
        'auto_sent', count(*) filter (where completion_type = 'AUTO_SENT'),
        'action_required', count(*) filter (where status = 'ACTION_REQUIRED'),
        'failed', count(*) filter (where stage = 'FAILED')
      )
      from filtered_inquiries
    ),
    'status_distribution',
    (
      select jsonb_agg(
        jsonb_build_object(
          'status', status_values.status,
          'count', (
            select count(*)
            from filtered_inquiries
            where filtered_inquiries.status = status_values.status
          )
        )
        order by status_values.ordinal
      )
      from status_values
    ),
    'intent_distribution',
    (
      select jsonb_agg(
        jsonb_build_object(
          'intent', intent_values.intent,
          'count', (
            select count(*)
            from filtered_inquiries
            where filtered_inquiries.intent = intent_values.intent
          )
        )
        order by intent_values.ordinal
      )
      from intent_values
    ),
    'completion_distribution',
    (
      select jsonb_agg(
        jsonb_build_object(
          'completion_type', completion_values.completion_type,
          'count', (
            select count(*)
            from filtered_inquiries
            where filtered_inquiries.completion_type =
              completion_values.completion_type
          )
        )
        order by completion_values.ordinal
      )
      from completion_values
    ),
    'daily_trend',
    (
      select jsonb_agg(
        jsonb_build_object(
          'date', trend_dates.trend_date,
          'total', (
            select count(*)
            from filtered_inquiries
            where filtered_inquiries.received_date = trend_dates.trend_date
          ),
          'in_progress', (
            select count(*)
            from filtered_inquiries
            where filtered_inquiries.received_date = trend_dates.trend_date
              and filtered_inquiries.status = 'IN_PROGRESS'
          ),
          'action_required', (
            select count(*)
            from filtered_inquiries
            where filtered_inquiries.received_date = trend_dates.trend_date
              and filtered_inquiries.status = 'ACTION_REQUIRED'
          ),
          'completed', (
            select count(*)
            from filtered_inquiries
            where filtered_inquiries.received_date = trend_dates.trend_date
              and filtered_inquiries.status = 'COMPLETED'
          ),
          'auto_sent', (
            select count(*)
            from filtered_inquiries
            where filtered_inquiries.received_date = trend_dates.trend_date
              and filtered_inquiries.completion_type = 'AUTO_SENT'
          )
        )
        order by trend_dates.trend_date
      )
      from trend_dates
    )
  )
  into result;

  return result;
end;
$$;

revoke all on function public.get_dashboard_summary(date, date, text) from public;
grant execute on function public.get_dashboard_summary(date, date, text)
  to service_role;
