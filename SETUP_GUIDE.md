# StoryBuilder - Setup Guide

## Översikt
StoryBuilder har nu uppdaterats till ett enklare system med egen användarhantering (utan Supabase Auth).

## Databas Schema

Vi använder nu endast en `users` tabell:

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar(255) UNIQUE NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## Kör migrationer

1. Gå till Supabase SQL Editor
2. Kör SQL från: `backend/migrations/20260114_create_users_table.sql`
3. Detta kommer skapa users-tabellen

## Backend Setup

1. Gå till backend mappen:
```bash
cd backend
```

2. Installera dependencies:
```bash
npm install
```

3. Skapa en `.env` fil (kopiera från `.env.example`):
```bash
cp .env.example .env
```

4. Fyll i .env med dina Supabase credentials:
```
JWT_SECRET=din-hemliga-jwt-nyckel-här
SUPABASE_URL=din-supabase-url
SUPABASE_SERVICE_ROLE_KEY=din-service-role-key
PORT=5000
```

5. Starta backend:
```bash
npm run dev
```

## Frontend Setup

1. Gå till frontend mappen:
```bash
cd frontend
```

2. Installera dependencies:
```bash
npm install
```

3. Skapa en `.env` fil:
```bash
cp .env.example .env
```

4. Starta frontend:
```bash
npm run dev
```

## Färgpalett

Projektet använder följande färgpalett från ColorHunt:
- Dark Primary: #222831
- Dark Secondary: #393E46
- Accent: #948979
- Light Primary: #DFD0B8

## Features

- ✅ Egen användarhantering (username, email, password)
- ✅ JWT-baserad autentisering
- ✅ Dark/Light mode toggle
- ✅ Responsiv navbar
- ✅ Register/Login pages med tabs
- ✅ shadcn/ui komponenter

## Removed

- ❌ Story-relaterade endpoints och pages
- ❌ Supabase Auth (vi använder egen auth)
- ❌ WriteStory, ViewStory pages
