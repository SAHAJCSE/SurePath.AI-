import { GoogleGenAI } from '@google/genai';
import type { Locale, ScenarioId, ScenarioResult, SmartSummary } from './types.js';

function safeJsonParse(text: string): any | undefined {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return;
  const candidate = text.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    return;
  }
}

function clamp01to100(n: any, fallback: number) {
  const x = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(0, Math.min(100, Math.round(x)));
}

function toLocale(locale?: string): Locale {
  return locale === 'hi' ? 'hi' : 'en';
}

export async function generateSmartSummary(opts: {
  rawText: string;
  locale?: Locale;
  provider?: string;
  policyName?: string;
}): Promise<SmartSummary> {
  const locale = opts.locale ?? 'en';
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // Fallback: deterministic “demo” summary for hackathon reliability.
  if (!apiKey) {
    return demoSummary(locale, opts.provider, opts.policyName);
  }

  const ai = new GoogleGenAI({ apiKey });

  const system = `You are an insurance policy simplifier for India.
Return STRICT JSON only. No markdown. No backticks.
If information is missing, use "unknown" / "N/A" / status "unknown" and explain in rationale.
All money amounts should be short human readable strings like "₹5 lakh" or "₹3,00,000".`;

  const schemaHint = {
    locale: locale,
    headline: 'string',
    plainSummary: 'string',
    riskScore: 'number 0..100 (higher=better fit/value)',
    complexityScore: 'number 0..100 (higher=harder)',
    keyNumbers: {
      accidentCoverage: 'string',
      naturalDeathCoverage: 'string',
      hospitalizationCoverage: 'string',
    },
    clauses: [{ title: 'string', whyItMatters: 'string' }],
    coverage: [
      {
        id: 'string',
        label: 'string',
        status: 'covered | not_covered | conditional | unknown',
        strength: 'number 0..100',
        rationale: 'string',
      },
    ],
    shouldIBuy: { verdict: 'yes | no | maybe', reason: 'string' },
  };

  const prompt = [
    `Provider: ${opts.provider ?? 'unknown'}`,
    `Policy name: ${opts.policyName ?? 'unknown'}`,
    `Locale: ${locale} (use Hinglish-friendly Hindi when locale=hi)`,
    '',
    `TASK: Summarize the policy into the JSON shape below.`,
    `JSON_SHAPE_EXAMPLE: ${JSON.stringify(schemaHint)}`,
    '',
    'POLICY_TEXT:',
    opts.rawText.slice(0, 60_000), // keep request bounded
  ].join('\n');

  try {
    const resp = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        { role: 'user', parts: [{ text: system + '\n\n' + prompt }] },
      ],
    });

    const text = resp.text ?? '';
    const parsed = safeJsonParse(text);

    if (!parsed) {
      return demoSummary(locale, opts.provider, opts.policyName);
    }

    const summary: SmartSummary = {
      provider: opts.provider,
      policyName: opts.policyName,
      locale,
      headline: String(parsed.headline ?? 'Policy summary'),
      plainSummary: String(parsed.plainSummary ?? ''),
      riskScore: clamp01to100(parsed.riskScore, 70),
      complexityScore: clamp01to100(parsed.complexityScore, 45),
      keyNumbers: {
        accidentCoverage: parsed.keyNumbers?.accidentCoverage ?? 'N/A',
        naturalDeathCoverage: parsed.keyNumbers?.naturalDeathCoverage ?? 'N/A',
        hospitalizationCoverage: parsed.keyNumbers?.hospitalizationCoverage ?? 'N/A',
      },
      clauses: Array.isArray(parsed.clauses) ? parsed.clauses.slice(0, 6).map((c: any) => ({
        title: String(c?.title ?? 'Clause'),
        whyItMatters: String(c?.whyItMatters ?? ''),
      })) : [],
      coverage: Array.isArray(parsed.coverage) ? parsed.coverage.slice(0, 12).map((c: any) => ({
        id: String(c?.id ?? String(c?.label ?? 'item')).toLowerCase().replace(/\s+/g, '_'),
        label: String(c?.label ?? 'Coverage item'),
        status: (c?.status === 'covered' || c?.status === 'not_covered' || c?.status === 'conditional') ? c.status : 'unknown',
        strength: clamp01to100(c?.strength, 50),
        rationale: String(c?.rationale ?? ''),
      })) : [],
      shouldIBuy: {
        verdict: (parsed.shouldIBuy?.verdict === 'yes' || parsed.shouldIBuy?.verdict === 'no') ? parsed.shouldIBuy.verdict : 'maybe',
        reason: String(parsed.shouldIBuy?.reason ?? ''),
      },
    };

    return summary;
  } catch {
    return demoSummary(locale, opts.provider, opts.policyName);
  }
}

export async function simulateScenario(opts: {
  rawText: string;
  scenarioId: ScenarioId;
  locale?: string;
  notes?: string;
}): Promise<ScenarioResult> {
  const locale = toLocale(opts.locale);
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return demoScenario(opts.scenarioId, locale);
  }

  const ai = new GoogleGenAI({ apiKey });
  const system = `You are a claim scenario simulator.
Return STRICT JSON only: { covered:boolean, amount:string, riskLevel:"low"|"medium"|"high", steps:string[], explanation:string }
If uncertain, set covered=false and explain why.`;

  const prompt = [
    `Locale: ${locale}`,
    `Scenario: ${opts.scenarioId}`,
    `Extra notes: ${opts.notes ?? ''}`,
    '',
    'POLICY_TEXT:',
    opts.rawText.slice(0, 60_000),
  ].join('\n');

  try {
    const resp = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: system + '\n\n' + prompt }] }],
    });

    const parsed = safeJsonParse(resp.text ?? '');
    if (!parsed) return demoScenario(opts.scenarioId, locale);

    return {
      covered: Boolean(parsed.covered),
      amount: String(parsed.amount ?? 'N/A'),
      riskLevel: parsed.riskLevel === 'low' || parsed.riskLevel === 'high' ? parsed.riskLevel : 'medium',
      steps: Array.isArray(parsed.steps) ? parsed.steps.slice(0, 6).map((s: any) => String(s)) : [],
      explanation: String(parsed.explanation ?? ''),
    };
  } catch {
    return demoScenario(opts.scenarioId, locale);
  }
}

export async function assistantChat(opts: {
  messages: Array<{ role: 'user' | 'assistant'; text: string }>;
  provider?: string;
  rawText?: string;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const recent = opts.messages.slice(-10);
  const context = recent.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join('\n');

  if (!apiKey) return demoAssistantReply(recent, opts.provider);

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are an AI-powered Insurance Assistant designed to help users understand their insurance policy documents.

Context:
The user has uploaded an insurance policy document (PDF). Your job is to carefully analyze the document and answer user questions strictly based on the content of that document.

Provider: ${opts.provider ?? 'unknown'}
POLICY_TEXT (may be partial):
${(opts.rawText ?? 'No uploaded policy text provided.').slice(0, 30000)}

Instructions:

1. Accuracy First
- Only provide answers based on the uploaded document.
- Do NOT assume or hallucinate information.
- If the answer is not present, clearly say:
  "This information is not available in your policy document."

2. Simple & Human-Friendly Language
- Convert complex legal and insurance terms into simple, easy-to-understand language.
- Avoid jargon unless necessary, and explain it if used.

3. Structured Responses
- Always format answers in a clean and readable way:
  - Short summary (1–2 lines)
  - Key details (bullet points)
  - Important conditions (if any)

4. Smart Extraction
- Identify and explain:
  - Coverage details
  - Claim conditions
  - Exclusions
  - Premium details
  - Policy duration
  - Benefits and limitations

5. Context Awareness
- Maintain conversation memory.
- Understand follow-up questions based on previous queries.

6. Transparency
- If uncertain, say:
  "Based on the document, this is my best interpretation..."

7. Highlight Important Insights
- Warn users about:
  - Hidden clauses
  - Waiting periods
  - Exclusions that impact claims

8. Tone
- Be helpful, professional, and clear (like a trusted advisor, not a robot).

9. Examples

User: "What is my accident coverage?"
Response:
Summary: Your policy covers accidental damage up to ₹5 lakh.

Details:
- Maximum coverage: ₹5,00,000
- Includes disability and death
- Valid during policy period

Conditions:
- Claim must be filed within 30 days
- Requires medical proof

10. Fallback Handling
- If the document is unclear:
  "This section of your policy is unclear. Please consult your insurer for confirmation."

11. General LIC Procedures (Reference)
- Fund Value: Check online via LIC portal > Policy Details.
- Downloads: Use 'Customer Services' > 'Download Policy Statement' on LIC site.
- Free-look: 15-30 days period for full refund cancellation.
- Surrender Value: Contact support or check 'Policy Surrender' in portal.

Goal:
Help users fully understand their insurance policy in the simplest and most trustworthy way possible.

Conversation:
${context}

Your response:`;

  try {
    const resp = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return (resp.text || '').trim() || demoAssistantReply(recent, opts.provider);
  } catch {
    return demoAssistantReply(recent, opts.provider);
  }
}

function demoSummary(locale: Locale, provider?: string, policyName?: string): SmartSummary {
  const hi = locale === 'hi';
  return {
    provider,
    policyName,
    locale,
    headline: hi ? 'Aapki policy ka smart summary' : 'A smart summary of your policy',
    plainSummary: hi
      ? 'Yeh prototype aapki policy ko simple language me samjhaata hai. (Demo mode: API key missing)'
      : 'This prototype simplifies your policy into plain language. (Demo mode: API key missing)',
    riskScore: 82,
    complexityScore: 35,
    keyNumbers: {
      accidentCoverage: '₹5 lakh',
      naturalDeathCoverage: '₹3 lakh',
      hospitalizationCoverage: hi ? 'Covered' : 'Covered',
    },
    clauses: [
      { title: hi ? 'Waiting period' : 'Waiting period', whyItMatters: hi ? 'Kuch din tak claims limited ho sakte hain.' : 'Claims can be limited for the first N days.' },
      { title: hi ? 'Pre-existing conditions' : 'Pre-existing conditions', whyItMatters: hi ? 'Purani bimaari cover hone me time lag sakta hai.' : 'Coverage may start after a defined period.' },
      { title: hi ? 'Claim intimation window' : 'Claim intimation window', whyItMatters: hi ? 'Late report se rejection ka risk.' : 'Late reporting can increase rejection risk.' },
    ],
    coverage: [
      { id: 'accident', label: hi ? 'Accident' : 'Accident', status: 'covered', strength: 88, rationale: hi ? 'Policy me accidental benefit mention.' : 'Accidental benefit is explicitly mentioned.' },
      { id: 'hospitalization', label: hi ? 'Hospitalization' : 'Hospitalization', status: 'covered', strength: 76, rationale: hi ? 'In-patient care covered (demo).' : 'In-patient care appears covered (demo).' },
      { id: 'natural_death', label: hi ? 'Natural death' : 'Natural death', status: 'covered', strength: 65, rationale: hi ? 'Base sum assured (demo).' : 'Base sum assured applies (demo).' },
      { id: 'alcohol_accident', label: hi ? 'Alcohol accident' : 'Alcohol accident', status: 'not_covered', strength: 10, rationale: hi ? 'Standard exclusion (demo).' : 'Standard exclusion (demo).' },
      { id: 'cosmetic_surgery', label: hi ? 'Cosmetic surgery' : 'Cosmetic surgery', status: 'not_covered', strength: 8, rationale: hi ? 'Elective procedures excluded (demo).' : 'Elective procedures excluded (demo).' },
      { id: 'self_harm', label: hi ? 'Self harm' : 'Self harm', status: 'not_covered', strength: 5, rationale: hi ? 'Intentional harm excluded (demo).' : 'Intentional harm excluded (demo).' },
    ],
    shouldIBuy: {
      verdict: 'maybe',
      reason: hi ? 'Accident coverage strong hai, lekin exclusions clear karna zaroori hai.' : 'Strong accident coverage, but confirm exclusions and waiting periods.',
    },
  };
}

function demoScenario(scenarioId: ScenarioId, locale: Locale): ScenarioResult {
  const hi = locale === 'hi';
  if (scenarioId === 'bike_accident') {
    return {
      covered: true,
      amount: '₹5 lakh',
      riskLevel: 'medium',
      steps: hi
        ? ['Insurance ko inform karo', 'Documents submit karo', 'Payment receive karo']
        : ['Inform insurer', 'Submit documents', 'Receive payment'],
      explanation: hi ? 'Accidental coverage present (demo).' : 'Accidental coverage present (demo).',
    };
  }
  if (scenarioId === 'alcohol_accident') {
    return {
      covered: false,
      amount: '₹0',
      riskLevel: 'high',
      steps: hi ? ['Policy exclusions check karo'] : ['Check policy exclusions'],
      explanation: hi ? 'Alcohol-related incidents usually excluded (demo).' : 'Alcohol-related incidents are commonly excluded (demo).',
    };
  }
  return {
    covered: scenarioId === 'hospital_admission' || scenarioId === 'natural_death',
    amount: scenarioId === 'natural_death' ? '₹3 lakh' : (scenarioId === 'hospital_admission' ? 'As per limits' : '₹0'),
    riskLevel: 'medium',
    steps: hi
      ? ['Insurance ko inform karo', 'Documents submit karo', 'Assessment & settlement']
      : ['Inform insurer', 'Submit documents', 'Assessment & settlement'],
    explanation: hi ? 'Demo result (API key missing).' : 'Demo result (API key missing).',
  };
}

function demoAssistantReply(messages: Array<{ role: 'user' | 'assistant'; text: string }>, provider?: string) {
  const last = (messages[messages.length - 1]?.text || '').toLowerCase();
  if (last.includes('accident')) {
    return `For ${provider ?? 'your policy'}, accident claims are generally covered unless exclusions (like alcohol use) apply. Keep FIR, hospital records, and bills ready.`;
  }
  if (last.includes('eligible')) {
    return 'Eligibility usually depends on active policy status, paid premiums, waiting period completion, and exclusion checks.';
  }
  if (last.includes('document')) {
    return 'Typical documents: policy number, ID proof, claim form, hospital discharge summary, bills, and FIR for accidents.';
  }
  if (last.includes('claim')) {
    return 'Claim flow: inform insurer quickly, submit required documents, complete verification, then settlement is processed.';
  }
  return 'I can help with coverage details, claim amount estimates, eligibility checks, and required documents. Ask me a specific scenario.';
}

export async function parsePolicyDetailed(opts: {
  rawText: string;
  provider?: string;
  policyName?: string;
}): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return demoDetailedPolicy(opts.provider, opts.policyName);

  const ai = new GoogleGenAI({ apiKey });
  const system = `You are an insurance policy analyzer. Extract structured data from policy text.
Return STRICT JSON only. Follow the requested schema exactly.
If a sum insured is mentioned, use it. Default to 500000 if not found.`;

  const prompt = `
Extract the following from the policy text:
1. Policy name and insurer
2. Total sum insured (as a number in ₹)
3. List of coverages: name, amount covered (as a number or "Unlimited"), unit (₹, %, days), isCovered (boolean)
4. List of exclusions: title, description, severity (high|medium|low)
5. General conditions (string array)

JSON format:
{
  "policyName": "...",
  "insurer": "...",
  "totalSumInsured": 500000,
  "coverages": [
    { "name": "Room Rent", "amount": 7000, "unit": "₹/day", "isCovered": true }
  ],
  "exclusions": [
    { "title": "...", "description": "...", "severity": "high" }
  ],
  "generalConditions": ["..."]
}

Policy text:
${opts.rawText.slice(0, 30000)}
`;

  try {
    const resp = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: system + '\n\n' + prompt }] }],
    });
    const parsed = safeJsonParse(resp.text ?? '');
    return parsed || demoDetailedPolicy(opts.provider, opts.policyName);
  } catch {
    return demoDetailedPolicy(opts.provider, opts.policyName);
  }
}

function demoDetailedPolicy(provider?: string, policyName?: string) {
  const p = (provider || '').toLowerCase();
  
  if (p.includes('hdfc')) return {
    policyName: "Optima Secure",
    insurer: "HDFC ERGO",
    totalSumInsured: 1000000,
    coverages: [
      { name: "Room Rent (No Limit)", amount: "No cap", unit: "", isCovered: true },
      { name: "ICU Charges", amount: "No cap", unit: "", isCovered: true },
      { name: "Pre/Post Hospitalization", amount: 60, unit: "days/180 days", isCovered: true },
      { name: "Consumables Cover", amount: 100, unit: "%", isCovered: true }
    ],
    exclusions: [
      { title: "Investigations", description: "Costs of X-rays, MRIs, etc., may be capped or excluded.", severity: "medium" },
      { title: "Cosmetic Surgery", description: "Purely cosmetic surgeries are not covered.", severity: "medium" }
    ],
    generalConditions: ["30-day initial waiting period.", "36-month waiting period for pre-existing diseases."]
  };

  if (p.includes('sbi')) return {
    policyName: "Arogya Shield",
    insurer: "SBI Life Insurance",
    totalSumInsured: 750000,
    coverages: [
      { name: "Hospitalization Expenses", amount: 750000, unit: "₹", isCovered: true },
      { name: "Alternative Treatment (AYUSH)", amount: 25000, unit: "₹", isCovered: true }
    ],
    exclusions: [
      { title: "30-Day Waiting Period", description: "No coverage for any illness in the first 30 days.", severity: "high" },
      { title: "Hazardous Sports", description: "Injuries from adventure sports are excluded.", severity: "low" }
    ],
    generalConditions: ["Cashless claim facility available.", "5% discount on combined premiums."]
  };

  if (p.includes('icici')) return {
    policyName: "iShield (Combi Plan)",
    insurer: "ICICI Prudential",
    totalSumInsured: 1000000,
    coverages: [
      { name: "Hospitalization", amount: 1000000, unit: "₹", isCovered: true },
      { name: "Restore Benefit", amount: 100, unit: "% of SI", isCovered: true }
    ],
    exclusions: [
      { title: "2-Year Exclusion", description: "Specific illnesses are not covered for 2 years.", severity: "high" },
      { title: "Self-Inflicted Injury", description: "Any injury caused by yourself.", severity: "high" }
    ],
    generalConditions: ["Combines health and life insurance.", "Life cover up to age 85."]
  };

  // Default: LIC
  return {
    policyName: policyName || "Jeevan Arogya",
    insurer: provider || "Life Insurance Corporation (LIC)",
    totalSumInsured: 500000,
    coverages: [
      { name: "Hospital Cash Benefit", amount: 2000, unit: "₹/day", isCovered: true },
      { name: "Major Surgical Benefit", amount: 500000, unit: "₹", isCovered: true },
      { name: "Day Care Procedure Benefit", amount: 10000, unit: "₹", isCovered: true },
      { name: "Pre-existing Diseases", amount: 0, unit: "₹", isCovered: false }
    ],
    exclusions: [
      { title: "Pre-existing Diseases", description: "Conditions before purchase are not covered for 48 months.", severity: "high" },
      { title: "Substance Abuse", description: "Treatment related to alcohol or drug abuse is excluded.", severity: "medium" }
    ],
    generalConditions: [
      "30-day initial waiting period for illnesses.",
      "48-month waiting period for pre-existing conditions."
    ]
  };
}
