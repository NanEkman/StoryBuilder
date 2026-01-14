# StoryBuilder — AI-agentens kontextprompt

Syfte
- Ge en AI-agent tillräcklig kontext för att säkert och effektivt implementera nya funktioner i StoryBuilder.

Projektöversikt
- Namn: StoryBuilder — webbapp för att skriva, spara och visa berättelser.
- Teknikstack: Node.js backend, Next.js (React) frontend, Tailwind CSS, SQL-migrationer. `supabaseClient` används för datalager.
- Viktiga filer och mappar:
  - `backend/server.js`
  - `backend/src/lib/supabaseClient.js`
  - `backend/migrations/`
  - `backend/tools/insert_story.js`
  - Frontend-sidor: `frontend/pages/`
  - React-komponenter: `frontend/src/pages/`
  - Globala stilar: `frontend/src/styles/` och `frontend/styles/globals.css`

Regler och begränsningar
- Gör inga ändringar i produktionshemligheter; referera till env-vars i README.
- Skapa migrationsfiler i `backend/migrations/` vid schemaändringar.
- Ändra inte autentiseringslogik utan explicit instruktion.
- Följ befintlig kodstil och använd `supabaseClient` för DB-anrop.

Promptmall (kopiera och fyll i)
"Du är en assistent som hjälper till att implementera en ny funktion i StoryBuilder (Node.js backend + Next.js frontend).

Sammanfattning: [kort mål, t.ex. "Lägg till endpoint för att skapa en story"].

Omfång: [exakt vad som ska ingå, t.ex. backend endpoint, DB-schema, frontend-form, validering, tester].

Begränsningar: [t.ex. "gör inga ändringar i autentisering", "lägg till migrationsfil om DB ändras"].

Viktiga filer att uppdatera: [lista filer eller mappar].

Testkrav: [enhetstest/ integrationstest/ inga tester].

Kör och verifiera: [kommandon för att köra backend och frontend].

Acceptanskriterier:
1) Endpoint returnerar korrekt status och JSON.
2) Frontend-form skickar data och visar fel vid validering.
3) Migrationsfil finns i `backend/migrations/` (om relevant).
4) Nya tester passerar (om tillämpligt)."

Checklista för implementering
- Kontrollera vilka filer som påverkas och börja med backend eller frontend enligt omfånget.
- Återanvänd `supabaseClient` för databasanrop.
- Skapa SQL-migration i `backend/migrations/` om en ny tabell/kolumn behövs.
- Lägg till/uppdatera tester där det finns teststöd.
- Uppdatera `backend/README.md` eller `frontend/README.md` med nya env-vars eller körinstruktioner.

Vanligt använd exempel (redo att klistra in)
"Mål: Implementera POST `/api/stories` i backend som tar `{ title, body, author }`, validerar fält (title >= 3 tecken, body >= 10 tecken), sparar i databasen via `supabaseClient`, och returnerar den sparade posten med 201. Omfång: skapa endpoint i `backend/server.js`, lägg till DB-insert via `backend/src/lib/supabaseClient.js`. Lägg till migrationsfil `backend/migrations/2026_add_stories_table.sql` om tabellen saknas, samt enhetstest som verifierar validering och insert. Acceptanskriterier: endpoint 201 + JSON, fel 400 vid validering, migrationsfil i mappen, test som körs lokalt."

Tips för bäst resultat från AI
- Ange exakta filvägar och citera kodstycken om du vill att agenten modifierar en specifik funktion.
- Be om patch/diff om du vill reviewa ändringar manuellt.
- Begär en kort lista över ändrade filer och hur man kör dem lokalt efter ändringen.

---