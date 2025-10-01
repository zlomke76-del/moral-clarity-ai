# MoralClarityAI — Minimal Bridge App

A tiny Next.js (App Router) project exposing `/api/chat` that calls OpenAI's Responses API with MoralClarity neutral guardrails and mode toggles.

## Quick start
1) `npm install`
2) Create `.env.local` with:
```
OPENAI_API_KEY=sk-...your key ...
```
3) `npm run dev` → http://localhost:3000

Deploy to Vercel and set `OPENAI_API_KEY` in the project Environment Variables.
