# 📖 Story Builder

En interaktiv berättelseapplikation där användare tillsammans skapar historier, en del i taget.

## Projektstruktur

```
StoryBuilder/
├── frontend/          # Next.js + React + Tailwind CSS
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

## Installation

### 1. Databaskonfiguration

```sql
-- Öppna psql och kör:
CREATE DATABASE storybuilder;
CREATE USER storybuilder_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE storybuilder TO storybuilder_user;
```

**Eller använd pgAdmin för GUI-installation**

### 2. Backend Setup

```bash
cd backend
npm install
npm run migrate    # Skapar tabeller i databasen
npm run dev        # Startar servern på port 5000
```

Server körs på: `http://localhost:5000`

### 3. Frontend Setup

I en **ny terminal**:

```bash
cd frontend
npm install
npm run dev        # Startar på port 3000
```

Frontend körs på: `http://localhost:3000`

## Användning

1. Öppna [http://localhost:3000](http://localhost:3000) i webbläsaren
2. **Starta en ny berättelse**: Skriv max 500 tecken och klicka "Starta Berättelse"
3. **Fortsätt en berättelse**: Välj en berättelse från listan och skapa nästa del
4. Dela URL:en med vänner så kan de fortsätta din historia!

## API Dokumentation

### Endpoints

| Metod | Endpoint | Beskrivning |
|-------|----------|-------------|
| GET | `/health` | Hälsokontroll |
| GET | `/api/stories` | Hämta alla berättelser |
| GET | `/api/stories/:id` | Hämta en specifik berättelse |
| POST | `/api/stories` | Skapa ny berättelse |
| POST | `/api/stories/:id/continue` | Fortsätt en berättelse |

### Exempel: Skapa berättelse

```bash
curl -X POST http://localhost:5000/api/stories \
  -H "Content-Type: application/json" \
  -d '{"content": "En gång var det en liten prins..."}'
```

### Exempel: Fortsätt berättelse

```bash
curl -X POST http://localhost:5000/api/stories/STORY_ID/continue \
  -H "Content-Type: application/json" \
  -d '{"content": "Han levde i ett slott på ett berg..."}'
```

## Teknologi

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS 3** - Styling
- **Axios** - HTTP client

### Backend
- **Express 4** - Web framework
- **PostgreSQL** - Database
- **Node.js** - Runtime

## Environment Variabler

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (`.env`)
```
DATABASE_URL=postgresql://storybuilder_user:password123@localhost:5432/storybuilder
PORT=5000
NODE_ENV=development
```

## Production Deploy

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend
npm start
```

## Troubleshooting

### "Cannot connect to database"
- Kontrollera att PostgreSQL körs
- Verifiera DATABASE_URL i `.env`
- Kör `npm run migrate` för att skapa tabeller

### "Port 3000/5000 är redan i bruk"
- Frontend: Ändra port i `package.json` dev script
- Backend: Ändra `PORT` i `.env`

### Dependencies fel
```bash
rm -r node_modules package-lock.json
npm install
```

## Utveckling

Båda servrarna har hot-reload aktiverat:
- **Frontend**: Uppdateras automatiskt vid ändringar
- **Backend**: Använder nodemon för auto-restart

## Licens

MIT

---

**Lycka till med din Story Builder! 🎉**
