# StoryBuilder - Ombyggnation Klar! ✅

## Vad har gjorts

### 1. Databas (Supabase)
- ✅ Uppdaterad `users` tabell med kolumner: `id`, `username`, `email`, `password`, `created_at`
- ✅ Borttagen `stories` tabell
- ✅ Använder nu Supabase endast som databas (inte auth-systemet)

### 2. Backend (Node.js/Express)
- ✅ Installerat `bcrypt` och `jsonwebtoken` för egen autentisering
- ✅ Nya endpoints:
  - `POST /api/auth/register` - Registrera ny användare
  - `POST /api/auth/login` - Logga in användare
  - `GET /api/auth/me` - Hämta inloggad användare
- ✅ Borttagna alla story-relaterade endpoints
- ✅ JWT-baserad autentisering
- ✅ Lösenord hashas med bcrypt

### 3. Frontend (React/Vite)
- ✅ Installerat och konfigurerat **shadcn/ui**
- ✅ Implementerat **dark/light mode** med toggle
- ✅ Ny färgpalett från ColorHunt:
  - #222831 (Dark Primary)
  - #393E46 (Dark Secondary)  
  - #948979 (Accent)
  - #DFD0B8 (Light Primary)

#### Nya komponenter:
- ✅ `Navbar` - Med användarinfo och dark mode toggle
- ✅ `ThemeProvider` - Hanterar dark/light mode
- ✅ `ThemeToggle` - Knapp för att växla tema
- ✅ Shadcn komponenter: Button, Card, Input, Label, Tabs, Dropdown Menu

#### Nya pages:
- ✅ `Home` - Tom välkomstsida
- ✅ `Auth` - Kombinerad login/registrering med tabs

#### Borttagna pages:
- ❌ Login.jsx (ersatt med Auth.jsx)
- ❌ Register.jsx (ersatt med Auth.jsx)
- ❌ WriteStory.jsx
- ❌ ViewStory.jsx

## Körning

### Backend
```bash
cd backend
npm run dev
```
Backend körs på: http://localhost:5000

### Frontend  
```bash
cd frontend
npm run dev
```
Frontend körs på: http://localhost:5173


## Färgpalett användning

I Tailwind CSS kan du använda:
```jsx
// Custom colors
className="bg-dark-primary text-light-primary"
className="bg-dark-secondary border-accent"

// shadcn/ui semantic colors (anpassar sig till light/dark mode)
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="bg-primary text-primary-foreground"
```

## Dark/Light Mode

Temat sparas i localStorage och persistas mellan sessioner.
Användaren kan växla med knappen i navbar (sol/måne-ikon).
