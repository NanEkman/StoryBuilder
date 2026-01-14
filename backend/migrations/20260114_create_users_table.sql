-- Migration: Create `users` table for StoryBuilder

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
