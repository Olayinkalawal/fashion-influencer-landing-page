create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum ('member', 'admin', 'broker');
  end if;
end $$;

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  name text,
  org_name text,
  setting_type text,
  nexus_client_ref text,
  nexus_case_ref text,
  role app_role not null default 'member',
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quote_drafts (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  email text,
  step text not null default 'quote',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists schemes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  version integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists rate_tables (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid not null references schemes(id) on delete cascade,
  setting_main_activity text not null,
  legal_status text not null,
  is_domestic_premises boolean not null,
  base_rate_gbp numeric(12,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists extension_rates (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid not null references schemes(id) on delete cascade,
  extension_code text not null,
  label text not null,
  price_gbp numeric(12,2) not null,
  taxable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scheme_id, extension_code)
);

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  case_ref text not null unique,
  scheme_id uuid not null references schemes(id),
  member_id uuid references members(id),
  status text not null default 'Quotation',
  referral_required boolean not null default false,
  referral_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  quote_ref text not null unique,
  version integer not null default 1,
  customer_payload jsonb not null,
  premium_breakdown jsonb not null,
  total_premium_gbp numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists quote_sites (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  site_index integer not null,
  payload jsonb not null
);

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  referral_type text not null,
  status text not null default 'Pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists policies (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  policy_number text not null unique,
  status text not null default 'On Cover',
  term_start_date date not null,
  term_end_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists endorsements (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references policies(id) on delete cascade,
  endorsement_ref text not null unique,
  payload jsonb not null,
  effective_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists renewals (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references policies(id) on delete cascade,
  renewal_ref text not null unique,
  status text not null default 'Pending',
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  policy_id uuid references policies(id) on delete cascade,
  document_type text not null,
  document_url text not null,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  quote_id uuid references quotes(id) on delete set null,
  payment_method text not null,
  status text not null default 'Pending',
  amount_gbp numeric(12,2) not null,
  provider_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade,
  actor_id text,
  actor_role text,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category text,
  cpd_hours numeric(6,2) not null default 0,
  thumbnail_url text,
  is_member_only boolean not null default true,
  published_at timestamptz
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  mux_asset_id text,
  duration_seconds integer,
  position integer not null default 1,
  resource_url text
);

create table if not exists enrolments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  progress_pct numeric(5,2) not null default 0,
  unique (member_id, course_id)
);

create table if not exists lesson_completions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  watched_seconds integer not null default 0,
  completed_at timestamptz,
  unique (member_id, lesson_id)
);

create table if not exists live_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 60,
  host text,
  cal_event_id text,
  zoom_link text,
  recording_mux_id text,
  is_member_only boolean not null default true
);

create table if not exists cpd_records (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  source text not null,
  activity text not null,
  cpd_hours numeric(6,2) not null default 0,
  evidence_url text,
  date date not null
);

create index if not exists idx_cases_status on cases(status);
create index if not exists idx_quotes_case_id on quotes(case_id);
create index if not exists idx_policies_case_id on policies(case_id);
create index if not exists idx_documents_case_id on documents(case_id);
create index if not exists idx_enrolments_member_id on enrolments(member_id);
create index if not exists idx_cpd_records_member_id on cpd_records(member_id);

alter table members enable row level security;
alter table quote_drafts enable row level security;

drop policy if exists members_select_own on members;
create policy members_select_own
  on members
  for select
  using (auth.uid() = auth_user_id);

drop policy if exists members_update_own on members;
create policy members_update_own
  on members
  for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists quote_drafts_manage_own on quote_drafts;
create policy quote_drafts_manage_own
  on quote_drafts
  using (
    exists (
      select 1
      from members
      where members.id = quote_drafts.member_id
        and members.auth_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from members
      where members.id = quote_drafts.member_id
        and members.auth_user_id = auth.uid()
    )
  );

insert into schemes (code, name, version, is_active)
values ('EYA-DEFAULT', 'EYA Default Scheme', 1, true)
on conflict (code) do nothing;
