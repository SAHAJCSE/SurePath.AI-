# Backend API (Express + Gemini 2.0 Flash)

## 🚀 Technical Innovation: Master Prompt for Indian Insurance Analysis

**Production-ready structured JSON extraction using custom Gemini 2.0 Flash master prompt optimized for IRDAI-regulated Indian insurance policies (LIC, Star Health, HDFC Ergo).**

**Key Capabilities:**
- **No Hallucinations**: STRICT "Not explicitly mentioned" for missing data.
- **Hinglish Support**: Simple language mixing English/Hindi for accessibility.
- **Complete Structure**: policy_overview, key_coverages[], exclusions[] (with severity), claim_process, scenario_simulation, clarity_score, recommendation.
- **New Endpoint**: `POST /api/analyze-policy` - Upload PDF → Instant JSON analysis.

**Usage Example:**
```
curl -X POST http://localhost:5050/api/analyze-policy -H "Content-Type: application/json" -d '{"policyText": "Your extracted policy text..."}'
```

Returns full JSON for CoverageVisualizer, ExclusionsHighlighter, ScenarioSimulator.

## Setup
1. Copy env file:
   - `cp .env.example .env` (Windows: `copy .env.example .env`)
2. Add key:
   - `GEMINI_API_KEY=your_key_here`

## Run
```bash
npm run dev:full  # Frontend + Backend
# or
npm run server  # Backend only (localhost:5050)
```

## Endpoints
| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/health` | GET | - | `{ok: true}` |
| `/api/policy/upload` | POST | `file` or `text` | `{policyId, extractedChars}` |
| `/api/analyze-policy` | POST | `{policyId?, policyText?, provider?, policyName?}` | `{analysis: PolicyAnalysis JSON}` |
| `/api/policy/analyze` | POST | `{policyId, locale?, provider?}` | `{summary: SmartSummary}` |
| `/api/policy/parse` | POST | `{policyId, provider?}` | Legacy parse |
| `/api/simulate` | POST | `{policyId, scenarioId}` | `{result: ScenarioResult}` |
| `/api/assistant/chat` | POST | `{messages[], policyId?}` | `{reply: string}` |

## Demo Mode
No API key? Realistic demo JSON with Indian policy examples (LIC Jeevan Arogya, HDFC Optima Secure) ensures hackathon reliability.

**Test Master Prompt Locally:**
1. `npm run server`
2. Upload PDF via frontend or `curl /api/analyze-policy`
3. Verify structured JSON output.

