# Story Builder Backend

Node.js + Express + PostgreSQL backend för Story Builder applikationen.

## Installation

```bash
cd backend
npm install
```

## Databaskonfiguration

1. Installera PostgreSQL
2. Skapa en ny databas:
```sql
CREATE DATABASE storybuilder;
CREATE USER storybuilder_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE storybuilder TO storybuilder_user;
```

3. Uppdatera `.env` med dina databaskonfigurationer

## Migrera databas

```bash
npm run migrate
```

### Alternativ: kör SQL manuellt i Supabase

Om `npm run migrate` inte kan köras från din miljö (t.ex. nätverks-/DNS-problem), kör SQL manuellt i Supabase:

1. Öppna Supabase → SQL Editor → New query
2. Klistra in filen `migrations/create_stories.sql` och kör

Eller kör lokalt med `psql`:

```bash
psql "$DATABASE_URL" -f migrations/create_stories.sql
```

## Starta server

```bash
npm run dev  # Utveckling med nodemon
npm start    # Produktion
```

Server körs på `http://localhost:5000`

## API Endpoints

- `GET /health` - Hälsokontroll
- `GET /api/stories` - Hämta alla berättelser
- `GET /api/stories/:id` - Hämta en specifik berättelse
- `POST /api/stories` - Skapa ny berättelse
- `POST /api/stories/:id/continue` - Fortsätt en berättelse
