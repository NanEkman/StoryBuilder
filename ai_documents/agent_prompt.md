# StoryBuilder — Komplett AI-agentkontext

## 🎯 Syfte
Detta dokument ger AI-agenter fullständig förståelse av StoryBuilder-projektets arkitektur, design och kodkonventioner för att säkert och konsekvent implementera nya funktioner samtidigt som befintlig struktur och designsystem bevaras.

---

## 📋 Projektöversikt

### Grundläggande Information
- **Namn**: StoryBuilder
- **Beskrivning**: En interaktiv berättelseapplikation där användare kan skapa konton, logga in och bygga historier tillsammans
- **Arkitektur**: Full-stack webbapplikation med REST API
- **Databas**: PostgreSQL via Supabase
- **Utvecklingsmiljö**: Två separata servrar (backend på port 5000, frontend på port 5173)

### Teknikstack

#### Backend
- **Runtime**: Node.js (16+)
- **Framework**: Express.js 4.18.2
- **Databas**: PostgreSQL via Supabase (@supabase/supabase-js ^2.29.3)
- **Autentisering**: JWT (jsonwebtoken ^9.0.3) med bcrypt (^6.0.0)
- **Middleware**: CORS, express.json()
- **Utveckling**: Nodemon för hot-reload
- **Pakethanterare**: npm

#### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Routing**: React Router DOM 6.14.0
- **Styling**: Tailwind CSS 3.3.0 med shadcn/ui-komponenter
- **UI-bibliotek**: Radix UI (dropdown-menu, tabs, label, slot)
- **Ikoner**: Lucide React
- **HTTP-klient**: Axios 1.6.0
- **Utility**: clsx, tailwind-merge, class-variance-authority

---

## 🏗️ Projektstruktur

```
StoryBuilder/
├── backend/
│   ├── package.json                    # Backend-beroenden
│   ├── migrations/                     # SQL-migrationsfiler
│   │   ├── migrate.js                  # Migrationskörare
│   │   └── 20260114_create_users_table.sql
│   ├── src/
│   │   ├── server.js                   # Huvudserverfil (startar Express)
│   │   ├── app.js                      # (Tom fil - används ej för tillfället)
│   │   ├── config/
│   │   │   └── express.js              # Express-konfiguration (CORS, JSON-parsing, logging)
│   │   ├── controllers/
│   │   │   └── authController.js       # Auth-logik (register, login, getMe)
│   │   ├── middleware/
│   │   │   └── verifyToken.js          # JWT-verifieringsmiddleware
│   │   ├── routes/
│   │   │   ├── authRoutes.js           # Routes: /api/auth/*
│   │   │   └── healthRoutes.js         # Health check route
│   │   └── lib/
│   │       └── supabaseClient.js       # Supabase-klientinitiering
│   └── tools/                          # Verktygsscripts
│
├── frontend/
│   ├── package.json                    # Frontend-beroenden
│   ├── vite.config.mjs                 # Vite-konfiguration
│   ├── tailwind.config.js              # Tailwind + shadcn/ui-tema
│   ├── components.json                 # shadcn/ui-konfiguration
│   ├── postcss.config.js               # PostCSS-konfiguration
│   ├── index.html                      # HTML-entrypoint
│   ├── src/
│   │   ├── main.jsx                    # React-entrypoint
│   │   ├── App.jsx                     # Huvudkomponent (Router + Layout)
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Hemsida
│   │   │   ├── Auth.jsx                # Login/Register-sida
│   │   │   └── Account.jsx             # Användarprofil
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation med user dropdown
│   │   │   ├── ThemeProvider.jsx       # Dark/Light mode-provider
│   │   │   ├── ThemeToggle.jsx         # Theme toggle-knapp
│   │   │   └── ui/                     # shadcn/ui-komponenter
│   │   │       ├── Button.jsx          # Button-komponent med varianter
│   │   │       ├── Card.jsx            # Card-komponent
│   │   │       ├── Input.jsx           # Input-komponent
│   │   │       ├── label.jsx           # Label-komponent
│   │   │       ├── tabs.jsx            # Tabs-komponent
│   │   │       └── dropdown-menu.jsx   # Dropdown menu
│   │   └── lib/
│   │       ├── supabaseClient.js       # Supabase-klient för frontend
│   │       └── utils.js                # Utility-funktioner (cn helper)
│   └── styles/
│       └── globals.css                 # Global CSS + CSS-variabler för tema
│
├── ai_documents/                        # AI-agentdokumentation
│   ├── agent_prompt.md                 # Detta dokument
│   ├── setup.md
│   └── Refactor.md
│
└── README.md                           # Projektdokumentation
```

---

## 🎨 Design & UI-system

### Färgtema
StoryBuilder använder ett **anpassat tema** med ljust och mörkt läge:

#### Ljust läge (Light Mode)
- **Background**: `hsl(45, 11%, 89%)` - Ljus beige
- **Foreground**: `hsl(210, 11%, 15%)` - Mörkgrå text
- **Primary**: `hsl(35, 15%, 55%)` - Accent-brun
- **Secondary**: `hsl(210, 9%, 31%)` - Mörkgrå
- **Border/Input**: `hsl(210, 9%, 31%)`

#### Mörkt läge (Dark Mode)
- **Background**: `hsl(210, 11%, 15%)` - Mörkgrå
- **Foreground**: `hsl(45, 11%, 89%)` - Ljus beige
- **Card**: `hsl(210, 9%, 22%)` - Mörk card-bakgrund
- **Primary/Accent**: Samma som ljust läge

### Komponentbibliotek
Projektet använder **shadcn/ui** - ett komponentbibliotek baserat på Radix UI och Tailwind CSS:

- **Varianter**: Komponenter använder `class-variance-authority` (cva) för varianter
- **Utility**: `cn()`-helper från `lib/utils.js` för att slå ihop klassnamn
- **Styling**: Tailwind CSS-klasser med CSS-variabler för dynamiska teman
- **Ikoner**: Lucide React för ikoner (User, LogOut, UserCircle, Sun, Moon, etc.)

### Exempel på komponentanvändning

```jsx
// Button med varianter
<Button variant="default">Klicka här</Button>
<Button variant="outline" size="sm">Sekundär</Button>
<Button variant="destructive">Ta bort</Button>

// Card
<Card>
  <CardHeader>
    <CardTitle>Titel</CardTitle>
  </CardHeader>
  <CardContent>Innehåll</CardContent>
</Card>
```

---

## 🔐 Autentiseringssystem

### Backend (JWT-baserad)
1. **Registrering** (`POST /api/auth/register`):
   - Validerar input (username, email, password)
   - Kontrollerar om användare redan finns
   - Hashar lösenord med bcrypt (10 salt rounds)
   - Sparar i Supabase `users`-tabell
   - Returnerar JWT-token (7 dagars giltighetstid) + användardata

2. **Login** (`POST /api/auth/login`):
   - Validerar credentials mot databasen
   - Jämför hashat lösenord
   - Returnerar JWT-token + användardata

3. **Skyddade routes**:
   - Använder `verifyToken`-middleware
   - Verifierar JWT från `Authorization: Bearer <token>`
   - Lägger till `req.user` med decoded token-data

### Frontend (LocalStorage-baserad)
- Sparar JWT-token i `localStorage.getItem('token')`
- Sparar användardata i `localStorage.getItem('user')` (JSON)
- Navbar lyssnar på localStorage-ändringar för att uppdatera UI
- Axios-requests inkluderar token i headers

---

## 🗄️ Databasarkitektur

### Supabase-konfiguration
- **Klient**: `@supabase/supabase-js`
- **Anslutning**: Via `SUPABASE_URL` och `SUPABASE_KEY` (env-vars)
- **Queries**: Använd alltid Supabase-klienten, inte rå SQL

### Befintliga tabeller

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- Bcrypt-hashat
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Migrationsstrategi
- **Plats**: `backend/migrations/`
- **Namnkonvention**: `YYYYMMDD_description.sql`
- **Körning**: `npm run migrate` i backend-mappen
- **Migrate.js**: Läser och kör SQL-filer i ordning

---

## 🛣️ API-struktur

### Befintliga endpoints

#### Auth-endpoints (`/api/auth`)
| Method | Endpoint | Auth | Beskrivning |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Nej | Registrera ny användare |
| POST | `/api/auth/login` | Nej | Logga in användare |
| GET | `/api/auth/me` | Ja | Hämta inloggad användares info |

#### Health-endpoint
| Method | Endpoint | Auth | Beskrivning |
|--------|----------|------|-------------|
| GET | `/` | Nej | Health check |

### Request/Response-exempel

```javascript
// POST /api/auth/register
// Request:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123"
}

// Response (201):
{
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2026-01-23T..."
  },
  "token": "jwt-token-here"
}

// Error (400):
{
  "error": "Användarnamn eller email redan använt"
}
```

---

## 📝 Kodkonventioner

### Backend
- **Språk**: JavaScript (CommonJS modules)
- **Import**: `require()` / `module.exports`
- **Async/await**: Använd alltid för async-operationer
- **Error handling**: Try-catch i alla async-funktioner
- **Logging**: `console.log()` / `console.error()`
- **Variabelnamn**: camelCase
- **Filnamn**: camelCase för filer, kebab-case för SQL-migrations

#### Exempel på controller-struktur
```javascript
exports.functionName = async (req, res) => {
  try {
    const { param } = req.body;
    
    // Validering
    if (!param) {
      return res.status(400).json({ error: "Meddelande på svenska" });
    }
    
    // Databas-operation
    const { data, error } = await supabase
      .from("table")
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(200).json({ data });
  } catch (error) {
    console.error("Funktionsnamn error:", error);
    res.status(500).json({ error: error.message });
  }
};
```

### Frontend
- **Språk**: JavaScript/JSX (ES6+)
- **Import**: ES6 modules (`import`/`export`)
- **Komponenter**: Functional components med hooks
- **State**: `useState`, `useEffect`
- **Routing**: React Router (`useNavigate`, `<Link>`)
- **Styling**: Tailwind CSS-klasser
- **Variabelnamn**: camelCase
- **Komponentnamn**: PascalCase

#### Exempel på komponentstruktur
```jsx
import React from 'react'
import { Button } from '../components/ui/Button'

export default function ComponentName() {
  const [state, setState] = React.useState(null)

  React.useEffect(() => {
    // Side effects här
  }, [])

  const handleAction = async () => {
    try {
      // Logic här
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Button onClick={handleAction}>Klicka</Button>
    </div>
  )
}
```

---

## 🔧 Utvecklingsflöde

### Starta projektet
```bash
# Backend (port 5000)
cd backend
npm install
npm run dev

# Frontend (port 5173)
cd frontend
npm install
npm run dev
```

### Miljövariabler

#### Backend (`.env`)
```env
PORT=5000
DATABASE_URL=your_postgres_url
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_secret_key
```

#### Frontend (`.env`)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

---

## 📐 Implementeringsriktlinjer

### När du lägger till en ny funktion

#### 1. Planering
- [ ] Identifiera vilka delar som påverkas (backend/frontend/databas)
- [ ] Kontrollera om nya databastabeller/kolumner behövs
- [ ] Planera API-endpoints och data flow
- [ ] Identifiera vilka komponenter som behöver uppdateras

#### 2. Backend-implementation
- [ ] Skapa SQL-migration i `backend/migrations/` om DB-ändringar behövs
- [ ] Lägg till controller-funktion i `backend/src/controllers/`
- [ ] Skapa routes i `backend/src/routes/`
- [ ] Registrera routes i `backend/src/server.js`
- [ ] Testa endpoint med `test.http` eller Postman

#### 3. Frontend-implementation
- [ ] Skapa/uppdatera komponenter i `frontend/src/components/` eller `frontend/src/pages/`
- [ ] Använd befintliga UI-komponenter från `components/ui/`
- [ ] Följ designsystemets färger och spacing
- [ ] Implementera error handling och loading states
- [ ] Testa i både ljust och mörkt läge

#### 4. Verifiering
- [ ] Kör backend: `cd backend && npm run dev`
- [ ] Kör frontend: `cd frontend && npm run dev`
- [ ] Testa funktionalitet i webbläsaren
- [ ] Kontrollera console för errors
- [ ] Verifiera responsivitet (mobile/desktop)
- [ ] Testa både ljust och mörkt tema

### Viktiga principer
1. **Återanvänd befintliga komponenter**: Använd shadcn/ui-komponenter istället för att skapa nya
2. **Konsistens**: Följ samma mönster som befintlig kod
3. **Validering**: Validera alltid input både på frontend och backend
4. **Felhantering**: Visa användarvänliga felmeddelanden på svenska
5. **Säkerhet**: Använd alltid JWT-verifiering för skyddade endpoints
6. **Databas**: Använd Supabase-klienten, inte rå SQL-queries (utom i migrations)

---

## 📋 Promptmall för AI-agenter

Använd denna mall när du ber en AI-agent implementera en ny feature:

```
Du arbetar med StoryBuilder - en full-stack React + Node.js-applikation med Supabase PostgreSQL.

KONTEXTFIL: Läs ai_documents/agent_prompt.md för fullständig projektförståelse.

UPPGIFT:
[Beskriv tydligt vad som ska implementeras]

OMFÅNG:
Backend:
- [ ] Endpoints: [lista vilka]
- [ ] Controllers: [vilka funktioner]
- [ ] Migrations: [behövs nya tabeller/kolumner?]

Frontend:
- [ ] Komponenter: [vilka komponenter påverkas]
- [ ] Pages: [vilka sidor]
- [ ] Routing: [nya routes?]

TEKNISKA KRAV:
- Följ befintlig kodstruktur i backend/src/controllers/authController.js
- Använd shadcn/ui-komponenter från frontend/src/components/ui/
- Implementera både ljust och mörkt tema-stöd
- Validera input både frontend och backend
- Returnera felmeddelanden på svenska
- Använd Supabase-klienten för alla DB-operationer

BEGRÄNSNINGAR:
- Ändra INTE autentiseringslogik utan explicit instruktion
- Ändra INTE env-variabler utan att dokumentera i README
- Skapa migrationsfil om DB-schema ändras

ACCEPTANSKRITERIER:
1. [Kriterium 1]
2. [Kriterium 2]
3. Kod följer befintliga konventioner
4. Fungerar i både ljust och mörkt tema
5. Responsiv design (mobile + desktop)

VERIFIERING:
- Backend startar utan errors: cd backend && npm run dev
- Frontend startar utan errors: cd frontend && npm run dev
- Feature fungerar som förväntat i webbläsaren
```

### Exempel: Lägg till stories-funktion

```
Du arbetar med StoryBuilder - en full-stack React + Node.js-applikation med Supabase PostgreSQL.

KONTEXTFIL: Läs ai_documents/agent_prompt.md för fullständig projektförståelse.

UPPGIFT:
Implementera funktionalitet för att skapa, visa och lista berättelser (stories). 
Användare ska kunna skriva en titel och innehåll, spara storyn kopplad till sitt user-id, 
och se alla sina stories på en dedikerad sida.

OMFÅNG:
Backend:
- [ ] Endpoints: POST /api/stories, GET /api/stories, GET /api/stories/:id
- [ ] Controllers: Skapa storyController.js med create, list, getById
- [ ] Migrations: 20260123_create_stories_table.sql

Frontend:
- [ ] Komponenter: StoryCard.jsx, StoryForm.jsx
- [ ] Pages: Stories.jsx (lista), CreateStory.jsx (formulär)
- [ ] Routing: /stories, /stories/create

TEKNISKA KRAV:
- Följ befintlig kodstruktur i backend/src/controllers/authController.js
- Använd shadcn/ui Card och Input från frontend/src/components/ui/
- Stories-tabell: id, user_id (FK), title, content, created_at
- Validering: title minst 3 tecken, content minst 10 tecken
- JWT-skyddade endpoints (använd verifyToken middleware)
- Visa author-namn vid listning (JOIN users)

BEGRÄNSNINGAR:
- Använd Supabase-klienten, INTE rå SQL (förutom i migration)
- Ändra INTE authController eller användarautentisering

ACCEPTANSKRITERIER:
1. POST /api/stories skapar story och returnerar 201 + JSON
2. GET /api/stories returnerar användarens stories med author-info
3. Frontend visar lista av stories med Card-komponenter
4. CreateStory-formulär validerar och visar errors
5. Fungerar i både ljust och mörkt tema
6. Migration finns i backend/migrations/

VERIFIERING:
- Backend startar utan errors: cd backend && npm run dev
- Frontend startar utan errors: cd frontend && npm run dev
- Kan skapa story via formulär
- Stories visas på /stories-sidan
- Endast inloggade användare kan använda funktionen
```

---

## 🚨 Vanliga fallgropar att undvika

1. **ANVÄND INTE rå SQL** i controllers - använd Supabase-klienten:
   ```javascript
   // ❌ FEL
   const result = await db.query('SELECT * FROM users')
   
   // ✅ RÄTT
   const { data, error } = await supabase.from('users').select()
   ```

2. **GLÖM INTE error handling**:
   ```javascript
   // ❌ FEL
   const { data } = await supabase.from('users').select()
   
   // ✅ RÄTT
   const { data, error } = await supabase.from('users').select()
   if (error) throw error
   ```

3. **ANVÄND befintliga UI-komponenter**:
   ```jsx
   // ❌ FEL
   <button className="bg-blue-500...">Klicka</button>
   
   // ✅ RÄTT
   <Button variant="default">Klicka</Button>
   ```

4. **TESTA i både ljust och mörkt läge** - använd CSS-variabler:
   ```jsx
   // ❌ FEL
   <div className="bg-white text-black">
   
   // ✅ RÄTT
   <div className="bg-background text-foreground">
   ```

5. **FELMEDDELANDEN på svenska**:
   ```javascript
   // ❌ FEL
   return res.status(400).json({ error: "Username required" })
   
   // ✅ RÄTT
   return res.status(400).json({ error: "Användarnamn krävs" })
   ```

---

## 📚 Referensfiler

För att förstå hur kod ska struktureras, studera dessa filer:

### Backend-referenser
- **Controller-exempel**: `backend/src/controllers/authController.js`
- **Route-exempel**: `backend/src/routes/authRoutes.js`
- **Middleware-exempel**: `backend/src/middleware/verifyToken.js`
- **Server setup**: `backend/src/server.js`
- **Express config**: `backend/src/config/express.js`

### Frontend-referenser
- **Page-exempel**: `frontend/src/pages/Auth.jsx`, `frontend/src/pages/Account.jsx`
- **Component-exempel**: `frontend/src/components/Navbar.jsx`
- **UI-komponenter**: `frontend/src/components/ui/Button.jsx`, `frontend/src/components/ui/Card.jsx`
- **Theme-implementation**: `frontend/src/components/ThemeProvider.jsx`
- **Routing**: `frontend/src/App.jsx`

### Styling-referenser
- **CSS-variabler**: `frontend/styles/globals.css`
- **Tailwind config**: `frontend/tailwind.config.js`
- **shadcn/ui config**: `frontend/components.json`

---

## ✅ Slutchecklista innan kod levereras

- [ ] Koden följer projektets konventioner (se Kodkonventioner)
- [ ] Felmeddelanden är på svenska
- [ ] Error handling finns i alla async-funktioner
- [ ] Validering finns både på frontend och backend
- [ ] JWT-verifiering används för skyddade endpoints
- [ ] UI använder befintliga shadcn/ui-komponenter
- [ ] Design fungerar i både ljust och mörkt tema
- [ ] Design är responsiv (mobile + desktop)
- [ ] Migration skapades om databas ändrades
- [ ] README uppdaterades om nya env-vars tillkom
- [ ] Backend startar utan errors (`npm run dev`)
- [ ] Frontend startar utan errors (`npm run dev`)
- [ ] Funktionalitet testades manuellt i webbläsaren
- [ ] Console är fri från errors

---

**Skapad**: 2026-01-23  
**Version**: 2.0  
**Ägare**: StoryBuilder-teamet