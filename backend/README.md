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
