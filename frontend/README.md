# Story Builder Frontend

React + Next.js + Tailwind CSS frontend för Story Builder applikationen.

## Installation

```bash
cd frontend
npm install
```

## Miljövariabler

Skapa en `.env.local` fil:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Starta development server

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Build för produktion

```bash
npm run build
npm start
```

## Funktioner

- Skapa nya berättelser
- Fortsätta befintliga berättelser
- Max 500 tecken per tur
- Visa lista över aktiva berättelser
- Tailwind CSS styling
