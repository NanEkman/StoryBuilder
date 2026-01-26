-- 2026_create_user_history.sql

create table if not exists user_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  action varchar(255) not null,
  details jsonb,
  created_at timestamptz default now()
);

-- Index för snabbare sökning på user_id
create index if not exists idx_user_history_user_id on user_history(user_id);
