import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {
  generateOfflineAssistantReply,
  generateOfflineQuiz,
  tryLocalLlm,
} from './src/server/offlineEngine';
import type { AssistantRequest } from './src/server/offlineEngine';

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

// Lightweight in-memory rate limiter to prevent accidental flooding
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX_REQUESTS = 120;
const rateBuckets = new Map<string, number[]>();

function localRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const clientIp =
    (typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for'].split(',')[0]?.trim()
      : undefined) ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const now = Date.now();
  const timestamps = (rateBuckets.get(clientIp) || []).filter((ts) => now - ts < RATE_WINDOW_MS);

  if (timestamps.length >= RATE_MAX_REQUESTS) {
    res.status(429).json({
      error: 'Too many requests. Please pause for a moment before retrying.',
    });
    return;
  }

  timestamps.push(now);
  rateBuckets.set(clientIp, timestamps);
  next();
}

interface AssistantRequestBody {
  prompt?: unknown;
  classLevel?: unknown;
  subject?: unknown;
  chapter?: unknown;
  language?: unknown;
  mode?: unknown;
  useSearch?: unknown;
  history?: unknown;
}

interface QuizGenerateBody {
  classLevel?: unknown;
  subject?: unknown;
  chapter?: unknown;
  language?: unknown;
  count?: unknown;
}

function sanitizeShortString(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

async function startServer(): Promise<void> {
  const app = express();
  app.set('trust proxy', true);
  app.use(express.json({ limit: '512kb' }));

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      service: 'edugenius-ai',
      mode: 'offline',
      hasPaidApis: false,
      timestamp: new Date().toISOString(),
    });
  });

  // Assistant endpoint - 100% Offline AI Tutor
  app.post('/api/assistant', localRateLimiter, async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as AssistantRequestBody;
      const prompt = sanitizeShortString(body.prompt, 2000);
      if (!prompt) {
        res.status(400).json({ error: 'Please enter a question or topic for the NCERT AI tutor.' });
        return;
      }

      const rawClass = Number(body.classLevel);
      const classLevel = Number.isInteger(rawClass) && rawClass >= 1 && rawClass <= 12 ? rawClass : 10;
      const subject = sanitizeShortString(body.subject, 80) || 'General Studies';
      const chapter = sanitizeShortString(body.chapter, 120);
      const languageRaw = sanitizeShortString(body.language, 16);
      const language: 'en' | 'hi' | 'hinglish' =
        languageRaw === 'hi' ? 'hi' : languageRaw === 'hinglish' ? 'hinglish' : 'en';
      const modeRaw = sanitizeShortString(body.mode, 40);
      const mode: 'concept' | 'solver' | 'revision' | 'search' =
        modeRaw === 'solver' || modeRaw === 'revision' || modeRaw === 'search' ? modeRaw : 'concept';
      const useSearch = Boolean(body.useSearch);

      const historyArray = Array.isArray(body.history) ? body.history.slice(-6) : [];

      const assistantReq: AssistantRequest = {
        prompt,
        classLevel,
        subject,
        chapter,
        language,
        mode,
        history: historyArray,
        useSearch,
      };

      // 1. Try local LLM (e.g. Ollama if running on machine)
      const localLlmReply = await tryLocalLlm(assistantReq);
      if (localLlmReply) {
        res.json({
          reply: localLlmReply,
          sources: [
            {
              title: `NCERT Official Curriculum Portal (Class ${classLevel})`,
              uri: 'https://ncert.nic.in/textbook.php',
            },
            {
              title: 'DIKSHA National Portal',
              uri: 'https://diksha.gov.in/',
            },
          ],
        });
        return;
      }

      // 2. Built-in Offline NCERT Tutor Engine
      const offlineResult = generateOfflineAssistantReply(assistantReq);
      res.json(offlineResult);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to generate tutor response.';
      console.error('Assistant endpoint error:', message);
      res.status(500).json({ error: message });
    }
  });

  // Quiz Generation endpoint - 100% Offline Assessment Author
  app.post('/api/quiz/generate', localRateLimiter, async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as QuizGenerateBody;
      const rawClass = Number(body.classLevel);
      const classLevel = Number.isInteger(rawClass) && rawClass >= 1 && rawClass <= 12 ? rawClass : 10;
      const subject = sanitizeShortString(body.subject, 80) || 'Science';
      const chapter = sanitizeShortString(body.chapter, 120) || 'Core Concepts';
      const language = sanitizeShortString(body.language, 16) === 'hi' ? 'hi' : 'en';
      const rawCount = Number(body.count);
      const count = Number.isInteger(rawCount) && rawCount >= 3 && rawCount <= 8 ? rawCount : 5;

      const questions = generateOfflineQuiz({
        classLevel,
        subject,
        chapter,
        language,
        count,
      });

      if (!questions || questions.length === 0) {
        res.status(500).json({ error: 'Could not generate quiz questions.' });
        return;
      }

      res.json({ questions });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Quiz generation failed.';
      console.error('Quiz generate error:', message);
      res.status(500).json({ error: message });
    }
  });

  // Serve Frontend
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`  EDUGENIUS AI (100% Offline Mode)`);
    console.log(`  Ready at http://localhost:${PORT}`);
    console.log(`  No API keys or internet connection required.`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
