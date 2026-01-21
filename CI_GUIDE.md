# 🚀 CI/CD Setup Guide - Story Builder

## 👥 Snabbstart för utvecklare

### Vad behöver JU veta?

**Kortfattat:** Varje gång du pushar kod testar GitHub Actions automatiskt att allt fungerar. Om något är fel får du ett felmeddelande på GitHub.

### Din workflow:

```
1. Du skriver kod lokalt
2. git add . && git commit -m "..." && git push
3. GitHub Actions testar automatiskt (2-3 minuter)
4. Du ser resultat på github.com/StoryBuilder/actions
5. Om grön (✅): Allt OK, du kan merga
6. Om röd (❌): Se felmeddelandet, fixa lokalt, pusha igen
```

### Viktiga regler:

| ✅ GÖR                 | ❌ GÖR INTE                  |
| ---------------------- | ---------------------------- |
| Pusha ofta             | Force-push till main         |
| Läs GitHub Actions-fel | Committa .env eller lösenord |
| Fixa innan merge       | Committa node_modules/       |
| Starta PR före merge   | Ignorera röda checks         |

### Mina workflow-status:

- **CI - Backend & Frontend Tests** → Testar build + syntax
- **Deploy to Production** → Förberedelse för produktionsrelease
- **Security - CodeQL** → Söker säkerhetshål (veckovis + push)

👉 **Se status:** https://github.com/NanEkman/StoryBuilder/actions

---

## Vad är CI/CD?

**CI (Continuous Integration)** = Automatisk testning och bygge vid varje push
**CD (Continuous Deployment)** = Automatisk deployment av testade versioner

GitHub Actions är GitHubs inbyggda automation-system som kör workflows när något specifikt händer (push, pull request, etc).

---

## 📋 Dina Workflows

### 1. **CI - Backend & Frontend Tests** (`ci.yml`)

Körs på: `push` till main/develop + `pull requests`

#### Vad händer:

```
Du gör en push/PR
    ↓
GitHub startar workflow
    ↓
PARALLELL KÖRNING:
├─ Backend Job (Node 18 + 20)
│  ├─ Checka ut kod
│  ├─ Installera dependencies
│  ├─ Kontrollera JavaScript syntax
│  └─ Testa starta servern
│
└─ Frontend Job (Node 18 + 20)
   ├─ Checka ut kod
   ├─ Installera dependencies
   ├─ Kör ESLint (kod-kvalitet)
   └─ Bygger produktionskod (vite build)
    ↓
✅ GRÖN = Ok att merga
❌ RÖD = Problem - fixa innan merge
```

**Matrix testing**: Testar båda Node 18.x och 20.x versioner automatiskt = högre kompatibilitet

---

### 2. **Deploy to Production** (`deploy.yml`)

Körs på: `push` till main (eller manuell trigger)

#### Vad händer:

```
Push till main-branch
    ↓
Kör alla CI-tester
    ↓
Om allt är grön → Du får notifikation
    ↓
DU deployar manuellt (säkrare än auto-deploy)
```

**Varför manuell deploy?**

- Du bestämmer EXAKT när den går live
- Kan testa på staging först
- Säkrare för produktionskod

---

### 3. **Security - CodeQL Analysis** (`codeql.yml`)

Körs på: Push, PRs + veckovis automatiskt

#### Vad gör det:

- 🔍 Skannar koden för säkerhetshål
- 📊 Hittar potentiella buggar
- ⚠️ Varnar om känd vulnerable dependencies
- 🕐 Körs varje söndag 00:00 (automatisk säkerhetsuppdatering)

---

## 🛠️ Hur du kommer igång

### Steg 1: Pusha till GitHub

```bash
git init
git add .
git commit -m "Initial commit with CI/CD"
git remote add origin https://github.com/YOUR_USERNAME/StoryBuilder.git
git branch -M main
git push -u origin main
```

### Steg 2: Gå till GitHub Actions

1. Öppna din repo på GitHub.com
2. Klick på **"Actions"** tab (överst)
3. Du ser dina workflows lista

### Steg 3: Se resultaten

```
green checkmark ✅ = Success
red X            ❌ = Failed
yellow circle    🟡 = Running
```

---

## 🔐 Secrets & Miljövariabler

Om du behöver hemliga variabler (databaskodord, API-nycklar):

### Lägg till Secret i GitHub:

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Namn: `DATABASE_URL`, Värde: `your_password`

### Använd i workflow:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Vad du BÖR lägga till som secrets:

```
DATABASE_URL          # Din Supabase anslutning
SUPABASE_API_KEY      # Supabase API-nyckel
JWT_SECRET            # Din secret nyckel för tokens
```

---

## ⚠️ Viktiga Saker att Tänka På

### 1. **package-lock.json är KRITISK**

Committa `package-lock.json` till Git! Utan den är versionerna inkonsistenta.

```bash
# Kontrollera att du har den:
ls backend/package-lock.json
ls frontend/package-lock.json
```

### 2. **Environment Variables**

Lägg INTE hemliga variabler i `.env`-filer som du committar!

**Gör så här istället:**

```bash
# .gitignore
.env
.env.local
.env.production.local
```

```yaml
# workflow använder secrets:
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### 3. **Node Version**

Dina workflows testar både Node 18 och 20. Se till att din `package.json` anger:

```json
"engines": {
  "node": ">=18.0.0",
  "npm": ">=9.0.0"
}
```

### 4. **Database i Tests**

För tillfället har backend ingen echte databastester eftersom du använder Supabase. Workflows gör:

- ✅ Syntax check
- ✅ Server startup test
- ✅ Dependency check
- ❌ Inte echte databasqueries (kräver live DB)

**Om du vill lägga till databastest:**
Lägg till PostgreSQL service container + testdata i workflow.

---

## 📊 GitHub Actions Dashboard

Din CI-status visas på flera ställen:

### I PR-view:

```
✅ All checks have passed
├─ Backend - Node.js Tests ✅
├─ Frontend - Build & Lint ✅
└─ Security - CodeQL ✅
```

### Badge i README:

```markdown
[![CI Status](https://github.com/user/StoryBuilder/actions/workflows/ci.yml/badge.svg)](https://github.com/user/StoryBuilder/actions)
```

---

## 🔧 Felsökning

### Workflow körs inte?

- Kolla att filerna ligger i `.github/workflows/`
- Syntax error? Kopiera från officiella GitHub templates

### "npm ci" går långsamt?

- GitHub cachechar automatiskt med `cache: 'npm'`
- Första körningen är långsam, sedan är den snabb

### Jobben har timeout?

Öka timeout i workflow (standard 360 minuter):

```yaml
jobs:
  backend:
    timeout-minutes: 30
```

### Vill du debugga lokalt?

Installera [act](https://github.com/nektos/act):

```bash
# Ubuntu/WSL
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | bash

# Kör workflow lokalt
act -j backend
```

---

## 🚀 Nästa Steg

### För bättre CI:

1. **Lägg till tester**: Jest för backend, Vitest för frontend
2. **Code coverage**: `nyc` eller `c8`
3. **Lint**: Redan har eslint, lägg till prettier för formatering
4. **Type checking**: TypeScript eller JSDoc
5. **Dependency audit**: `npm audit` i workflow

### För bättre CD:

1. **Staging environment**: Testa på staging före production
2. **Auto-deploy**: Google Cloud, Vercel, Railway, etc
3. **Health checks**: Verifiera att servern startar
4. **Slack/Discord notifications**: Få alerts vid deploy

---

## 📚 Användbara Resurser

- GitHub Actions docs: https://docs.github.com/en/actions
- Workflow syntax: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- Security best practices: https://docs.github.com/en/actions/security-guides

---

**Lycka till med din automation!** 🎉
