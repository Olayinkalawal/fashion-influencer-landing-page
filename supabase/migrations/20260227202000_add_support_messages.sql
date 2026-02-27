create table if not exists support_messages (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete set null,
  member_email text not null,
  subject text not null,
  message text not null,
  priority text not null default 'Normal',
  status text not null default 'Open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_support_messages_status on support_messages(status);
create index if not exists idx_support_messages_created_at on support_messages(created_at desc);
