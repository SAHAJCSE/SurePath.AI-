import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Locale, ScenarioId, ScenarioResult, SmartSummary, PolicyAnalysis, ClaimCheckRequest, ClaimCheckResult } from './types.js';
import fs from 'node:fs/promises';
import path from 'node:path';

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

// ... [all existing functions remain unchanged - generateSmartSummary, analyzePolicyMasterPrompt, simulateScenario, assistantChat, demo functions] ...

// NEW: Claim Approval Checker
export async function checkClaimApproval(opts: ClaimCheckRequest): Promise<ClaimCheckResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const locale = toLocale(opts.provider); // reuse locale logic

  // Demo fallback first (reliable)
  const demoResult = getDemoClaimResult(opts.scenario, locale);
  if (!apiKey) {
    return demoResult;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const SYSTEM_PROMPT = `You are an intelligent insurance claim evaluation assistant.

Your job is to analyze whether a user's insurance claim is likely to be approved based on their situation and policy details.

---

INPUT:
* User scenario (illness/event description)
* Policy JSON (coverage, exclusions, waiting periods, limits)

---

OUTPUT FORMAT (STRICT JSON):
{
"claim_status": "approved | partial | rejected",
"approval_chance": number (0-100),
"risk_level": "low | medium | high",
"reason": "simple explanation in plain English"
}

---

RULES:
* If waiting period applies → claim_status = rejected
* If limits or caps apply → claim_status = partial
* If fully covered → claim_status = approved

* Approval chance logic:
  approved → 80–100
  partial → 40–79
  rejected → 0–39

* Risk level:
  high → rejection likely
  medium → partial risk
  low → safe

* DO NOT use technical jargon
* DO NOT mention internal policy codes
* Keep explanation under 2 lines
* Focus on financial impact

---

EXAMPLE OUTPUT:
{
"claim_status": "partial",
"approval_chance": 65,
"risk_level": "medium",
"reason": "Room rent limit and non-covered items may reduce your claim payout."
}`;

  const policyText = opts.policy
    ? JSON.stringify(opts.policy, null, 2).slice(0, 20000)
    : 'No policy data available';

  const userPrompt = [
    `Locale: ${locale}`,
    `User scenario: ${opts.scenario}`,
    `Policy provider: ${opts.provider || 'unknown'}`,
    `Policy JSON: ${policyText}`,
    '',
    'Analyze and respond with JSON only:'
  ].join('\n\n');

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent({
      contents: [
        { role: 'model', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      }
    });

    const response = await result.response;
    const parsed = safeJsonParse(response.text());

    if (parsed && parsed.claim_status && typeof parsed.approval_chance === 'number') {
      return {
        claim_status: parsed.claim_status as 'approved' | 'partial' | 'rejected',
        approval_chance: clamp01to100(parsed.approval_chance, 50),
        risk_level: (parsed.risk_level as 'low' | 'medium' | 'high') || 'medium',
        reason: String(parsed.reason || 'Analysis complete.')
      };
    }
  } catch (error) {
    console.error('Gemini claim analysis failed:', error);
  }

  // Fallback to demo
  return demoResult;
}

function getDemoClaimResult(scenario: string, locale: Locale): ClaimCheckResult {
  const hi = locale === 'hi';
  const lower = scenario.toLowerCase();

  if (lower.includes('diabetes') || lower.includes('first year') || lower.includes('pre-existing') || lower.includes('PED')) {
    return {
      claim_status: 'rejected',
      approval_chance: 10,
      risk_level: 'high',
      reason: hi
        ? 'Prati raksha avadhi poori nahi hui hai (24-48 mahine).'
        : 'Waiting period not completed (typically 24-48 months).'
    };
  }

  if (lower.includes('accident') || lower.includes('injury')) {
    return {
      claim_status: 'approved',
      approval_chance: 95,
      risk_level: 'low',
      reason: hi
        ? 'Durghatna puri tarah se cover hai, koi waiting period nahi.'
        : 'Accidental injuries fully covered, no waiting period.'
    };
  }

  if (lower.includes('surgery') || lower.includes('icu') || lower.includes('hospital')) {
    return {
      claim_status: 'partial',
      approval_chance: 65,
      risk_level: 'medium',
      reason: hi
        ? 'Kamre ka kiraya limit aur upbhokta vastu na cover hone se payout kam ho sakta hai.'
        : 'Room rent limits and non-covered consumables may reduce payout.'
    };
  }

  return {
    claim_status: 'partial',
    approval_chance: 70,
    risk_level: 'medium',
    reason: hi
      ? 'Limiton ke andar cover hai. Room rent aur exclusions check karein.'
      : 'Covered within limits. Check room rent caps and exclusions.'
  };
}

// NEW CLAIM CHECKER FUNCTION
export async function checkClaimApproval(opts: ClaimCheckRequest): Promise<ClaimCheckResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const locale = toLocale(opts.provider || 'en');

  // Demo fallback
  if (!apiKey) {
    return getDemoClaimResult(opts.scenario, locale);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const SYSTEM_PROMPT = \`You are an intelligent insurance claim evaluation assistant.

Your job is to analyze whether a user's insurance claim is likely to be approved based on their situation and policy details.

---

INPUT:
* User scenario (illness/event description)
* Policy JSON (coverage, exclusions, waiting periods, limits)

---

OUTPUT FORMAT (STRICT JSON):
{
"claim_status": "approved | partial | rejected",
"approval_chance": number (0-100),
"risk_level": "low | medium | high",
"reason": "simple explanation in plain English"
}

---

RULES:
* If waiting period applies → claim_status = rejected
* If limits or caps apply → claim_status = partial
* If fully covered → claim_status = approved
* Approval chance logic: approved → 80–100, partial → 40–79, rejected → 0–39
* Risk level: high → rejection likely, medium → partial risk, low → safe
* DO NOT use technical jargon
* DO NOT mention internal policy codes
* Keep explanation under 2 lines
* Focus on financial impact

EXAMPLE:
{"claim_status": "partial","approval_chance": 65,"risk_level": "medium","reason": "Room rent limit and non-covered consumables may reduce your claim."}\`;

  const policyText = opts.policy ? JSON.stringify(opts.policy, null, 2).slice(0, 20000) : 'No policy';

  const prompt = [\`Scenario: \${opts.scenario}\`, \`Provider: \${opts.provider || 'unknown'}\`, \`Policy: \${policyText}\`].join('\\n\\n');

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(SYSTEM_PROMPT + '\\n\\n' + prompt, {
      generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
    });

    const parsed = safeJsonParse(result.response.text());
    if (parsed?.claim_status) {
      return {
        claim_status: parsed.claim_status,
        approval_chance: clamp01to100(parsed.approval_chance, 50),
        risk_level: parsed.risk_level || 'medium',
        reason: String(parsed.reason || '')
      };
    }
  } catch (e) {
    console.error('Gemini claim check failed:', e);
  }

  return getDemoClaimResult(opts.scenario, locale);
}

function getDemoClaimResult(scenario: string, locale: Locale): ClaimCheckResult {
  const lower = scenario.toLowerCase();
  if (lower.includes('diabetes') || lower.includes('first year') || lower.includes('pre-existing')) {
    return { claim_status: 'rejected', approval_chance: 10, risk_level: 'high', reason: 'Waiting period not completed for pre-existing conditions.' };
  }
  if (lower.includes('accident')) {
    return { claim_status: 'approved', approval_chance: 95, risk_level: 'low', reason: 'Accidental injuries fully covered - no waiting period.' };
  }
  return { claim_status: 'partial', approval_chance: 65, risk_level: 'medium', reason: 'Covered within room rent limits. Check policy caps.' };
}

// Existing exports
export { generateSmartSummary, analyzePolicyMasterPrompt, simulateScenario, assistantChat, parsePolicyDetailed };


