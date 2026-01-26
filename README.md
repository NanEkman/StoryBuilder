# 📖 Story Builder

En interaktiv berättelseapplikation där användare tillsammans skapar historier, en del i taget.

## Projektstruktur

```
StoryBuilder/
├── frontend/          # Vite + React + Tailwind CSS
│   ├── pages/        # Sidor
│   ├── styles/       # CSS
│   ├── package.json
│   └── ...
│
└── backend/          # Express + Node.js + PostgreSQL
    ├── migrations/   # Databaskonfiguration
    ├── server.js     # API server
    ├── package.json
    └── ...
```

## Förutsättningar

- **Node.js** 16+ ([https://nodejs.org/](https://nodejs.org/))
- **PostgreSQL** 12+ ([https://www.postgresql.org/](https://www.postgresql.org/))
- **npm** (kommer med Node.js)

# StoryBuilder

En enkel Story Builder — backend med Supabase och frontend med Vite (React).

# Kort översikt

- Backend: Node.js + Express, använder Supabase (Postgres) för datalagring.
- Frontend: Vite + React med Tailwind CSS.

# Snabbstart

Backend

```bash
cd backend
npm install
npm run dev
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

Environment

- Kopiera `backend/.env.example` till `backend/.env` och fyll i `SUPABASE_URL` och `SUPABASE_SERVICE_ROLE_KEY` från ditt Supabase-projekt.
- Frontend: skapa en `.env` eller `.env.local` i `frontend/` med följande variabler:

Shadcn UI

- Jag har lagt in shadcn-liknande komponenter (`Button`, `Input`, `Card`) i `frontend/src/components/ui`.
- För att använda officiella shadcn-komponenter lokalt kör:

```bash
cd frontend
npx shadcn-ui init
npx shadcn-ui add button input card
```

API (huvudendpoints)

- `GET /health` — health check
- `GET /api/stories` — hämta alla berättelser
- `GET /api/stories/:id` — hämta en berättelse
- `POST /api/stories` — skapa ny berättelse
- `POST /api/stories/:id/continue` — fortsätt berättelse

## Databas-migrering med Supabase CLI

För att alla i teamet ska ha samma databasstruktur:

1. **Installera Supabase CLI**
   - Ladda ner från https://github.com/supabase/cli/releases/latest
   - Placera `supabase.exe` i projektmappen eller i din PATH

2. **Kör migrationer**
   - Öppna terminalen i projektroten
   - Kör:

     ```
     ./supabase.exe db push
     ```

   - Detta kör alla migrationsfiler i `backend/migrations/` mot databasen i `.env`

3. **Lägg till nya migrationer**
   - Skapa ny SQL-fil i `backend/migrations/`
   - Lägg till, committa och pusha till Git
   - Alla i teamet kör sedan `./supabase.exe db push` för att uppdatera sin databas

> **Tips:**
> Om du får fel, kontrollera att din `.env` har rätt SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY.
