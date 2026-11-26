# EDUGENIUS AI - Terminal Startup Guide

This guide explains how to start the frontend and backend of the **EDUGENIUS AI** project from your terminal.

> [!NOTE]
> **100% Offline & Free:** All external AI Studio API keys and paid Gemini API calls have been completely removed. The application runs entirely offline using a built-in NCERT academic engine. No internet connection or API keys are required.

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Terminal**: PowerShell, Command Prompt, or Bash

---

## 🚀 Quick Setup (First Time Only)

Navigate to the project directory and install dependencies:

```bash
cd remix-edugenius-ai
npm install
```

---

## 🖥️ How to Start in Terminal

You can start the project using either a **single terminal (integrated mode)** or **two separate terminals (independent mode)**.

---

### Method 1: Single Terminal (Recommended)

Starts the Express backend server and mounts the Vite frontend SPA together in one unified dev server.

1. Open your terminal in the project directory:
   ```bash
   npm run dev
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

*Everything (UI + AI Assistant + Quizzes + Notes + Planner) is active on port 3000.*

---

### Method 2: Separate Terminals (Backend & Frontend Split)

If you prefer to run and view logs for the backend and frontend in separate terminal windows:

#### Terminal 1 — Start the Backend API Server
```bash
cd remix-edugenius-ai
npm run dev:backend
```
- **Backend API URL**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/api/health`
- Handles `/api/assistant` and `/api/quiz/generate` offline.

#### Terminal 2 — Start the Frontend Dev Server
```bash
cd remix-edugenius-ai
npm run dev:frontend
```
- **Frontend URL**: `http://localhost:5173`
- The Vite dev server will automatically proxy all `/api/*` calls to the backend running on port 3000.
- Open `http://localhost:5173` in your browser.

---

### Method 3: Production Build & Run

To build optimized production assets and serve them:

```bash
# Step 1: Build the client assets
npm run build

# Step 2: Start the production server
npm start
```
Access the application at `http://localhost:3000`.

---

## 🔍 Verification & Health Check

To verify that the offline backend service is running properly, test the health endpoint:

- **Browser**: Visit [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Terminal (cURL)**:
  ```bash
  curl http://localhost:3000/api/health
  ```
- **Expected Response**:
  ```json
  {
    "ok": true,
    "service": "edugenius-ai",
    "mode": "offline",
    "hasPaidApis": false
  }
  ```

---

## ⚙️ Summary of Available npm Scripts

| Command | Description | Port |
| :--- | :--- | :--- |
| `npm run dev` | Starts full-stack app (Backend + Frontend together) | `3000` |
| `npm run dev:backend` | Starts Express backend API server alone | `3000` |
| `npm run dev:frontend` | Starts Vite frontend development server alone | `5173` |
| `npm run build` | Compiles TypeScript and builds production frontend to `/dist` | — |
| `npm start` | Runs the production server serving built assets | `3000` |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) | — |

---

## 💡 Optional: Local LLM Support (Ollama)

If you want to use a local LLM (such as Llama 3, Mistral, Gemma 2, or Qwen 2.5) completely free and offline:

1. Install and run [Ollama](https://ollama.ai/):
   ```bash
   ollama run llama3
   ```
2. The EDUGENIUS backend will automatically detect the local endpoint (`http://localhost:11434`) and query it for tutor responses. If Ollama is not installed or closed, the built-in NCERT offline engine seamlessly handles all requests with zero downtime.
