# Backend API (Express + Gemini)

## Setup
1. Copy env file:
   - `copy .env.example .env`
2. Put your key in `.env`:
   - `GEMINI_API_KEY=...`

## Run
- Frontend: `npm run dev` (Vite on `http://localhost:3000`)
- Backend: `npm run server` (API on `http://localhost:5050`)

## Endpoints
- `GET /api/health`
- `POST /api/policy/upload` (multipart: `file` OR body field `text`)
- `POST /api/policy/analyze` (JSON: `policyId`, optional `locale`, `provider`, `policyName`)
- `POST /api/simulate` (JSON: `policyId`, `scenarioId`, optional `locale`, `notes`)

## Demo mode
If `GEMINI_API_KEY` is missing, endpoints still return **realistic demo JSON** so your hackathon flow always works.

