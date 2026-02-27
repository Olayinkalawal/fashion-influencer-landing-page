create table if not exists payment_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  quote_ref text not null,
  event_type text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_payment_events_quote_ref on payment_events(quote_ref);
create unique index if not exists idx_payments_provider_ref_unique on payments(provider_ref) where provider_ref is not null;
