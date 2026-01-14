-- SQL migration to create the `stories` table for Story Builder
-- Run this in Supabase SQL Editor (or locally with psql using your DATABASE_URL)

CREATE TABLE IF NOT EXISTS public.stories (
  id uuid PRIMARY KEY,
  title varchar(255) NOT NULL,
  content text NOT NULL,
  turns integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stories_updated_at ON public.stories (updated_at DESC);
