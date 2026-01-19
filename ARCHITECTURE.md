# 🏗️ Story Builder - Arkitektur & Kopplingar

## **Överblick**

```
┌─────────────────────────────────────────────────────────────────┐
│                         WEB BROWSER                             │
│              (http://localhost:3000)                            │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                          HTTP/JSON
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │     FRONTEND (Next.js + React)          │
        │     Port: 3000                          │
        │  ┌──────────────────────────────────┐   │
        │  │  pages/index.jsx                 │   │
        │  │  - UI för berättelser            │   │
        │  │  - State management              │   │
        │  │  - Axios för API-anrop           │   │
        │  └──────────────────────────────────┘   │
        │  ┌──────────────────────────────────┐   │
        │  │  Tailwind CSS                    │   │
        │  │  - Styling                       │   │
        │  │  - Responsiv design              │   │
        │  └──────────────────────────────────┘   │
        └─────────────────────────────────────────┘
                              ▲
                              │
                    REST API (Axios)
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │      BACKEND (Express + Node.js)        │
        │      Port: 5000                         │
        │  ┌──────────────────────────────────┐   │
        │  │  server.js                       │   │
        │  │  - Express server                │   │
        │  │  - CORS enabled                  │   │
        │  │  - JSON parsing                  │   │
        │  │  - API Routes                    │   │
        │  └──────────────────────────────────┘   │
        │  ┌──────────────────────────────────┐   │
        │  │  API Endpoints                   │   │
        │  │  GET /api/stories                │   │
        │  │  GET /api/stories/:id            │   │
        │  │  POST /api/stories               │   │
        │  │  POST /api/stories/:id/continue  │   │
        │  └──────────────────────────────────┘   │
        │  ┌──────────────────────────────────┐   │
        │  │  PostgreSQL Client (pg)          │   │
        │  │  - Connection Pool               │   │
        │  │  - Query execution               │   │
        │  └──────────────────────────────────┘   │
        └─────────────────────────────────────────┘
                              ▲
                              │
                           SQL
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │          POSTGRESQL DATABASE            │
        │                                         │
        │  ┌────────────────────────────────┐    │
        │  │  stories table                 │    │
        │  ├────────────────────────────────┤    │
        │  │ id (UUID) - Primary Key        │    │
        │  │ title (VARCHAR)                │    │
        │  │ content (TEXT)                 │    │
        │  │ turns (INTEGER)                │    │
        │  │ created_at (TIMESTAMP)         │    │
        │  │ updated_at (TIMESTAMP)         │    │
        │  └────────────────────────────────┘    │
        └─────────────────────────────────────────┘
```

---

## **📱 Frontend Flow (React)**

### **1. Initialisering**

```
App startar
    ↓
useEffect körs (komponenten mountas)
    ↓
fetchStories() anropas
    ↓
Axios GET /api/stories
    ↓
Data sparas i state: setStories()
    ↓
Komponenten renderas med berättelserlista
```

### **2. Skapa ny berättelse**

```
Användare skriver text i textarea
    ↓
Klickar "Starta Berättelse" knappen
    ↓
startNewStory() funktionen anropas
    ↓
Axios POST /api/stories { content: userInput }
    ↓
Backend validerar + skapar i DB
    ↓
Backend returnerar ny berättelse
    ↓
setSelectedStory() + setStoryContent()
    ↓
fetchStories() för att uppdatera listan
    ↓
UI uppdateras med ny berättelse
```

### **3. Fortsätta berättelse**

```
Användare klickar på en berättelse i listan
    ↓
selectStory(storyId) anropas
    ↓
Axios GET /api/stories/:id
    ↓
Backend hämtar från DB
    ↓
setSelectedStory() + setStoryContent()
    ↓
UI visar berättelsen
    ↓
Användare skriver ny text
    ↓
Klickar "Fortsätt Berättelsen"
    ↓
continueStory() anropas
    ↓
Axios POST /api/stories/:id/continue { content }
    ↓
Backend lägger till text + uppdaterar turns
    ↓
Backend returnerar uppdaterad berättelse
    ↓
UI uppdateras
```

---

## **🔌 API Endpoints & Server Logic**

### **GET /api/stories**

```javascript
// Hämtar alla berättelser
SELECT id, title, content, turns, created_at, updated_at
FROM stories
ORDER BY updated_at DESC

Response: [
  { id: "uuid", title: "...", content: "...", turns: 2, ... },
  { id: "uuid", title: "...", content: "...", turns: 1, ... }
]
```

### **GET /api/stories/:id**

```javascript
// Hämtar en specifik berättelse
SELECT * FROM stories WHERE id = $1

Response: { id: "uuid", title: "...", content: "...", turns: 3 }
```

### **POST /api/stories**

```javascript
// Skapar ny berättelse
Input: { content: "Min berättelse börjar..." }

Validering:
  ✓ Content inte tomt
  ✓ Max 500 tecken

INSERT INTO stories (id, title, content, turns, created_at, updated_at)
VALUES ($1, $2, $3, 1, NOW(), NOW())

Response: { id: "uuid", title: "Story 2026-01-14 - abc123", content: "...", turns: 1 }
```

### **POST /api/stories/:id/continue**

```javascript
// Fortsätter befintlig berättelse
Input: { content: "Och sedan..." }

Validering:
  ✓ Content inte tomt
  ✓ Max 500 tecken

GET gamla berättelsen
Konkatenera: oldContent + "\n\n" + newContent
Öka turns med 1

UPDATE stories
SET content = $1, turns = $2, updated_at = NOW()
WHERE id = $3

Response: { id: "uuid", title: "...", content: "oldContent\n\nAnd sedan...", turns: 2 }
```

---

## **📊 Data Flow Diagram**

### **Scenario: Användare skapar och fortsätter berättelse**

```
FRONTEND                          BACKEND                      DATABASE
────────                          ───────                      ────────

Användare klickar
"Starta Berättelse"
          │
          ├─ POST /api/stories ──────────┐
          │  { content: "Var det en..." } │
          │                              │
          │                    Validering │
          │                    UUID gen.  │
          │                    INSERT ──────────> INSERT berättelse
          │                               │      (id, title, content,
          │                               │       turns=1, created_at)
          │                               │
          │<─ 201 Created ────────────────┤
          │  { id, title, content, ... }  │
          │
[Lista uppdateras]
[Berättelsen visas]

Användare klickar
på berättelsen
          │
          ├─ GET /api/stories/:id ───────────────> SELECT WHERE id=?
          │                              │
          │<─ 200 OK ──────────────────┤         Returns: full story
          │  { ...story data... }      │
          │
[Berättelsen laddas i editor]

Användare skriver
och klickar "Fortsätt"
          │
          ├─ POST /api/stories/:id/continue ┐
          │  { content: "Han levde..." }    │
          │                                  │
          │                    GET story ───────> SELECT WHERE id=?
          │                    Validering    │
          │                    Konkatenera   │
          │                    UPDATE ──────────> UPDATE berättelse
          │                               │      SET content, turns=2
          │                               │      WHERE id=?
          │                               │
          │<─ 200 OK ──────────────────┤
          │  { ...updated story... }    │
          │
[UI uppdateras]
[Lista uppdateras]
```

---

## **🔄 State Management (React)**

```javascript
const [stories, setStories] = useState([]);
// Alla berättelser från servern

const [selectedStory, setSelectedStory] = useState(null);
// Vilken berättelse användare tittar på

const [storyContent, setStoryContent] = useState("");
// Full innehål av vald berättelse

const [userInput, setUserInput] = useState("");
// Vad användare skriver i textarea

const [charLimit] = useState(500);
// Max tecken per tur

const [loading, setLoading] = useState(false);
// Loading spinner medan API-anrop körs
```

---

## **🛠️ Teknologi Stack**

| Lager        | Teknologi          | Roll                          |
| ------------ | ------------------ | ----------------------------- |
| **Frontend** | Next.js 14         | React framework för SSR + SPA |
|              | React 18           | UI library                    |
|              | Tailwind CSS       | Styling                       |
|              | Axios              | HTTP client för API-anrop     |
| **Backend**  | Express 4          | Web framework                 |
|              | Node.js            | JavaScript runtime            |
|              | pg (node-postgres) | PostgreSQL client             |
|              | CORS               | Cross-Origin Resource Sharing |
|              | UUID               | Unika ID:n för berättelser    |
| **Database** | PostgreSQL 12+     | Relational database           |

---

## **📡 Environment Variables**

### **Frontend (.env.local)**

```
NEXT_PUBLIC_API_URL=http://localhost:5000
# Used by Axios to know where backend is
```

### **Backend (.env)**

```
DATABASE_URL=postgresql://storybuilder_user:password123@localhost:5432/storybuilder
PORT=5000
NODE_ENV=development
```

---

## **🚀 Startup Order**

1. **PostgreSQL** måste köra

   ```bash
   # Windows: Services eller pgAdmin
   ```

2. **Backend startas** (Terminal 1)

   ```bash
   cd backend
   npm run dev
   # Lyssnar på http://localhost:5000
   ```

3. **Frontend startas** (Terminal 2)

   ```bash
   cd frontend
   npm run dev
   # Lyssnar på http://localhost:3000
   ```

4. **Öppna webbläsare**
   ```
   http://localhost:3000
   ```

---

## **🔐 Error Handling**

### **Frontend**

```javascript
try {
  // API-anrop
} catch (error) {
  console.error("Fel vid...", error);
  // Visar error för användare
}
```

### **Backend**

```javascript
// Validering
if (!content || content.trim().length === 0) {
  return res.status(400).json({ error: 'Innehål kan inte vara tomt' });
}

// Database errors
catch (error) {
  res.status(500).json({ error: error.message });
}
```

---

## **📈 Nästa Steg (Om du vill utöka)**

1. **Autentisering** - Lägg till users table + JWT tokens
2. **Contributions** - Spara varje turn separat med user info
3. **Comments** - Lägg till diskussioner per berättelse
4. **Likes** - Gillar system
5. **Real-time** - WebSockets för live updates
6. **Deployment** - Heroku/Vercel/Digital Ocean

---

**Förhoppningsvis är arkitekturen nu klar! 🎯**
