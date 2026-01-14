## Setup och databas — Projektfragment

Detta projekt är en enkel Story Builder med en Node.js/Express-backend och en React (Vite) frontend. Syftet med detta fragment är att sammanfatta hur projektet och databasen är uppsatta, och förklara varför vissa val gjordes. En AI-agent användes för att påskynda och förenkla startup- och setup-processen.

- **Översikt:** Backend använder Node.js + Express och lagrar data i en PostgreSQL-databas via Supabase; frontend byggs med Vite + React och Tailwind CSS.

- **Varför dessa val:**
  - Node.js/Express: snabb att komma igång, stort ekosystem och enkel API-exponering.
  - Supabase/Postgres: hanterad Postgres med enkel SQL-editor och säkerhetsnycklar; bra för prototyper och skala.
  - Vite + React: snabb utvecklingsserver och moderna build-verktyg; Tailwind för snabb styling.

- **Viktiga filer:**
  - [backend/README.md](backend/README.md) — instruktioner för backend och migration.
  - [backend/migrations/create_stories.sql](backend/migrations/create_stories.sql) — SQL för att skapa tabellen `stories`.
  - [backend/src/lib/supabaseClient.js](backend/src/lib/supabaseClient.js) — Supabase-klient, läser `SUPABASE_URL` och `SUPABASE_SERVICE_ROLE_KEY` från miljön.
  - [README.md](README.md) — projektöversikt och snabbstart.

- **Migration och setup-flöde:**
  1. Lokalt: kör `npm run migrate` i `backend` (migreringen körs via `migrations/migrate.js`). Alternativt kör SQL-filen direkt i Supabase SQL Editor.
  2. Sätt miljövariabler: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (backend), och eventuellt `DATABASE_URL` om du kör direkt mot en Postgres-instans.
  3. Starta backend: `npm install` → `npm run dev` (eller `npm start` i produktion).
  4. Starta frontend: `cd frontend` → `npm install` → `npm run dev`.

- **Hur AI-agenten hjälpte:**
  - Skapade hela projektet (frontend + backend), inklusive grundläggande filstruktur och initial konfiguration.
  - Automatiserade dokumentationsuppgifter (README-uppdateringar och fragment).
  - Hjälpte till att standardisera migrationsflödet och gav rekommendationer för miljövariabler och drift.
  - Sammanfattade projektstrukturen för snabb onboarding.

Fortsatta rekommendationer: lägg till ett `.env.example` i `backend` med nödvändiga variabler, och överväg att lägga till CI-checkar som kör migrationer i staging-miljö.
