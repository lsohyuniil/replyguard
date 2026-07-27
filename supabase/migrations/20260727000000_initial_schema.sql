create extension if not exists pgcrypto;
create extension if not exists vector with schema extensions;

create table public.operators (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.gmail_connections (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references public.operators(id) on delete cascade,
  gmail_address text not null check (gmail_address = lower(gmail_address)),
  refresh_token_encrypted text,
  status text not null check (status in ('CONNECTED', 'REAUTH_REQUIRED', 'DISCONNECTED')),
  history_id text,
  last_polled_at timestamptz,
  created_at timestamptz not null default now(),
  unique (operator_id, gmail_address)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_email text not null check (customer_email = lower(customer_email)),
  status text not null check (status in ('PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
  ordered_at timestamptz not null,
  currency char(3) not null default 'KRW',
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  sku text not null,
  name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  carrier text not null,
  tracking_number text not null unique,
  status text not null check (status in ('READY', 'IN_TRANSIT', 'DELIVERED', 'DELAYED', 'LOOKUP_FAILED')),
  shipped_at timestamptz,
  estimated_delivery_at timestamptz,
  delivered_at timestamptz,
  latest_event text,
  created_at timestamptz not null default now()
);

create table public.policies (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title varchar(150) not null,
  created_at timestamptz not null default now()
);

create table public.policy_versions (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.policies(id) on delete cascade,
  version integer not null check (version > 0),
  status text not null check (status in ('DRAFT', 'PROCESSING', 'ACTIVE', 'FAILED', 'ARCHIVED')),
  content text not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (policy_id, version)
);

create table public.policy_chunks (
  id uuid primary key default gen_random_uuid(),
  policy_version_id uuid not null references public.policy_versions(id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  embedding extensions.vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (policy_version_id, chunk_index)
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  gmail_connection_id uuid not null references public.gmail_connections(id) on delete cascade,
  gmail_thread_id text not null,
  customer_name text,
  customer_email text not null check (customer_email = lower(customer_email)),
  subject varchar(200) not null,
  preview text not null default '',
  intent text not null check (
    intent in ('DELIVERY_STATUS', 'POLICY_FAQ', 'EXCHANGE', 'REFUND', 'DAMAGE', 'COMPENSATION', 'OTHER')
  ),
  status text not null check (status in ('IN_PROGRESS', 'ACTION_REQUIRED', 'COMPLETED')),
  stage text not null check (
    stage in ('ANALYZING', 'WAITING_CUSTOMER', 'SENDING', 'WAITING_APPROVAL', 'MANUAL_REQUIRED', 'FAILED', 'DONE')
  ),
  completion_type text check (completion_type in ('AUTO_SENT', 'APPROVED_SENT', 'MANUAL_SENT')),
  order_id uuid references public.orders(id) on delete set null,
  active_agent_run_id uuid,
  collected_information jsonb not null default '{}'::jsonb,
  required_action jsonb,
  received_at timestamptz not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (gmail_connection_id, gmail_thread_id),
  constraint inquiries_status_stage_check check (
    (status = 'IN_PROGRESS' and stage in ('ANALYZING', 'WAITING_CUSTOMER', 'SENDING'))
    or (status = 'ACTION_REQUIRED' and stage in ('WAITING_APPROVAL', 'MANUAL_REQUIRED', 'FAILED'))
    or (status = 'COMPLETED' and stage = 'DONE')
  ),
  constraint inquiries_completion_check check (
    (status = 'COMPLETED' and completion_type is not null)
    or (status <> 'COMPLETED' and completion_type is null)
  )
);

create table public.inquiry_order_candidates (
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (inquiry_id, order_id)
);

create table public.inquiry_policy_versions (
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  policy_version_id uuid not null references public.policy_versions(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (inquiry_id, policy_version_id)
);

create table public.inquiry_messages (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  gmail_connection_id uuid not null references public.gmail_connections(id) on delete cascade,
  gmail_message_id text not null,
  direction text not null check (direction in ('INBOUND', 'OUTBOUND')),
  sender_name text,
  sender_email text not null check (sender_email = lower(sender_email)),
  body_text text not null,
  occurred_at timestamptz not null,
  attachments jsonb not null default '[]'::jsonb check (jsonb_typeof(attachments) = 'array'),
  created_at timestamptz not null default now(),
  unique (gmail_connection_id, gmail_message_id)
);

create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  graph_thread_id text not null,
  checkpoint_id text,
  resumed_from_checkpoint_id text,
  status text not null check (status in ('RUNNING', 'INTERRUPTED', 'COMPLETED', 'FAILED')),
  step_count integer not null default 0 check (step_count between 0 and 12),
  resume_count integer not null default 0 check (resume_count >= 0),
  error_code text,
  started_at timestamptz not null,
  resumed_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.inquiries
  add constraint inquiries_active_agent_run_fk
  foreign key (active_agent_run_id) references public.agent_runs(id) on delete set null;

create table public.tool_calls (
  id uuid primary key default gen_random_uuid(),
  agent_run_id uuid not null references public.agent_runs(id) on delete cascade,
  tool_name text not null,
  arguments jsonb not null default '{}'::jsonb,
  signature text not null,
  status text not null check (status in ('PENDING', 'SUCCEEDED', 'FAILED')),
  attempt integer not null check (attempt > 0),
  error_message text,
  created_at timestamptz not null default now(),
  unique (agent_run_id, signature, attempt)
);

create table public.answer_drafts (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  agent_run_id uuid not null references public.agent_runs(id) on delete cascade,
  version integer not null default 1 check (version > 0),
  ai_content text not null,
  final_content text,
  evidence jsonb not null default '[]'::jsonb check (jsonb_typeof(evidence) = 'array'),
  status text not null check (status in ('DRAFT', 'WAITING_APPROVAL', 'APPROVED', 'REJECTED', 'SENT', 'INVALIDATED')),
  created_at timestamptz not null default now(),
  unique (inquiry_id, version)
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  answer_draft_id uuid not null references public.answer_drafts(id) on delete cascade,
  operator_id uuid not null references public.operators(id) on delete restrict,
  decision text not null check (decision in ('APPROVED', 'REJECTED')),
  reason text,
  decided_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  answer_draft_id uuid references public.answer_drafts(id) on delete set null,
  idempotency_key text not null unique,
  gmail_message_id text,
  status text not null check (status in ('PENDING', 'SENDING', 'SENT', 'FAILED')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create table public.information_requests (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  requested_fields jsonb not null check (jsonb_typeof(requested_fields) = 'array'),
  attempt integer not null check (attempt between 1 and 2),
  gmail_message_id text,
  status text not null check (status in ('SENT', 'ANSWERED', 'EXPIRED', 'CANCELLED')),
  created_at timestamptz not null default now()
);

create index inquiries_status_updated_at_idx on public.inquiries(status, updated_at desc);
create index inquiries_intent_idx on public.inquiries(intent);
create index inquiries_customer_email_idx on public.inquiries(customer_email);
create index inquiry_messages_inquiry_occurred_at_idx on public.inquiry_messages(inquiry_id, occurred_at);
create index orders_customer_email_idx on public.orders(customer_email);
create index agent_runs_inquiry_started_at_idx on public.agent_runs(inquiry_id, started_at desc);
create index tool_calls_agent_run_idx on public.tool_calls(agent_run_id);
create index answer_drafts_inquiry_created_at_idx on public.answer_drafts(inquiry_id, created_at desc);
create index policy_chunks_policy_version_idx on public.policy_chunks(policy_version_id);

alter table public.operators enable row level security;
alter table public.gmail_connections enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipments enable row level security;
alter table public.policies enable row level security;
alter table public.policy_versions enable row level security;
alter table public.policy_chunks enable row level security;
alter table public.inquiries enable row level security;
alter table public.inquiry_order_candidates enable row level security;
alter table public.inquiry_policy_versions enable row level security;
alter table public.inquiry_messages enable row level security;
alter table public.agent_runs enable row level security;
alter table public.tool_calls enable row level security;
alter table public.answer_drafts enable row level security;
alter table public.approvals enable row level security;
alter table public.email_deliveries enable row level security;
alter table public.information_requests enable row level security;
