# SurePath.AI Master Prompt Implementation TODO

## Approved Plan Steps (Breakdown)

### Phase 1: Types & Structures (Foundation)

- **Step 1.1**: Edit `server/types.ts` - Add `PolicyAnalysis` interface matching master prompt JSON exactly (policy_overview, key_coverages[], exclusions[], important_clauses[], claim_process_summary, scenario_simulation, overall_clarity_score, recommendation).
- **Step 1.2**: Edit `src/types/policy.ts` - Extend `ParsedPolicy` or alias to new `PolicyAnalysis` for frontend compatibility.

### Phase 2: Backend Implementation

- **Step 2.1**: Edit `server/gemini.ts` - Add `analyzePolicyMasterPrompt` function:
| Import @google/generative-ai correctly (use existing GoogleGenAI).
| Paste exact master prompt.
| Input: {rawText: string}.
| Output: typed PolicyAnalysis JSON.
| Add generationConfig: { temperature: 0.1 } for consistency.
| Fallback to current parsePolicyDetailed if parse fails.
| Export function.
- **Step 2.2**: Edit `server/index.ts` - Add `POST /api/analyze-policy` route:
| Body: {policyId?: string, policyText?: string, provider?: string, policyName?: string}.
| Fetch rawText from storage if policyId.
| Call new analyzePolicyMasterPrompt.
| Return {analysis: PolicyAnalysis}.
| Error handling + demo fallback.

### Phase 3: Documentation & Polish

- **Step 3.1**: Edit `server/README.md` - Add "Technical Innovation" section with master prompt details.
- **Step 3.2**: Update root `README.md` if exists (Technical Innovation → "Structured JSON extraction using Gemini 2.0 Flash with IRDAI-optimized master prompt").

### Phase 4: Test & Deploy

- **Step 4.1**: Test locally: `npm run server`, upload sample PDF, POST /api/analyze-policy, verify JSON output.
- **Step 4.2**: Deploy: `git add . && git commit -m "feat: implement Gemini master prompt for policy analysis" && git push` → Vercel auto-deploys.
- **Step 4.3**: Test live endpoint + record 60s demo video (upload → analysis → CoverageVisualizer update).
- **Complete**: Remove this file or mark ALL done.

**Progress: Starting Phase 1 → Update after each completed step.**