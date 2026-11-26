# EDUGENIUS AI — 100% Offline NCERT Learning Platform

EDUGENIUS AI is an NCERT-focused bilingual learning platform for Classes 1–12 with structured curriculum subjects, official NCERT/ePathshala library, interactive quizzes, study notes, planner, and an offline academic tutor.

> **100% Offline & Free:** All external AI Studio API keys and paid Gemini API dependencies have been removed. The application runs locally without any internet connection or cloud API costs.

---

## Quick Start in Terminal

### 1. Install Dependencies
```bash
cd remix-edugenius-ai
npm install
```

### 2. Start the App
```bash
# Start full-stack dev server (Frontend + Backend on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Detailed Startup Options

- **Single Terminal (Full-stack):** `npm run dev` (Access at `http://localhost:3000`)
- **Backend Only:** `npm run dev:backend` (API at `http://localhost:3000`)
- **Frontend Only:** `npm run dev:frontend` (Vite UI at `http://localhost:5173`, proxies `/api` to 3000)
- **Production Build:** `npm run build && npm start`

For complete instructions, see [STARTUP_GUIDE.md](STARTUP_GUIDE.md) and [STARTUP_GUIDE.txt](STARTUP_GUIDE.txt).
