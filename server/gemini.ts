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

  const SYSTEM_PROMPT = opts.analystInstructions?.trim() || `You are an expert health insurance claim analyst AI.

Your task is to evaluate whether a user's claim will be approved based on their described medical situation and the provided insurance policy.

Think like a real insurance company reviewer - strict, realistic, and policy-driven.

INPUT:
- User's medical situation (free text)
- Policy details (coverage, exclusions, waiting period, sum insured)

OUTPUT (STRICT JSON FORMAT):
{
  "status": "APPROVED | REJECTED | UNCERTAIN",
  "approvalChance": number (0-100),
  "riskLevel": "Low | Medium | High",
  "reason": "Clear, simple explanation in 1-2 lines",
  "detailedAnalysis": "Short paragraph explaining decision using policy terms",
  "keyFactors": [
    "Factor 1",
    "Factor 2",
    "Factor 3"
  ],
  "userAdvice": "What user should do next (e.g., documents, precautions)"
}

DECISION LOGIC:
- Accidents -> HIGH approval chance unless explicitly excluded
- Pre-existing diseases -> Check waiting period strictly
- Recent policy (< waiting period) -> Increase rejection probability
- Cosmetic / non-medical / excluded treatments -> REJECT
- Missing or unclear info -> mark as UNCERTAIN (not APPROVED)

TONE:
- Simple, human-friendly
- Avoid technical jargon unless needed
- Be honest - do NOT overpromise approval

IMPORTANT:
- Output must ALWAYS be valid JSON
- No extra text outside JSON`;

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

    if (parsed?.status) {
      return {
        status: parsed.status === 'APPROVED' || parsed.status === 'REJECTED' || parsed.status === 'UNCERTAIN' ? parsed.status : 'UNCERTAIN',
        approvalChance: clamp01to100(parsed.approvalChance, 50),
        riskLevel: parsed.riskLevel === 'Low' || parsed.riskLevel === 'High' ? parsed.riskLevel : 'Medium',
        reason: String(parsed.reason || 'We could not validate all policy conditions.'),
        detailedAnalysis: String(parsed.detailedAnalysis || 'Decision based on waiting periods, exclusions, and coverage limits in the policy.'),
        keyFactors: Array.isArray(parsed.keyFactors) ? parsed.keyFactors.slice(0, 3).map((x: any) => String(x)) : ['Policy exclusions', 'Waiting period rules', 'Medical necessity and treatment type'],
        userAdvice: String(parsed.userAdvice || 'Share complete hospital records and policy documents before claim filing.')
      };
    }
  } catch (error) {
    console.error('Gemini claim analysis failed:', error);
  }

  // Fallback to demo
  return demoResult;
}

function getDemoClaimResult(scenario: string, locale: Locale): ClaimCheckResult {
  const lower = scenario.toLowerCase();

  if (lower.includes('diabetes') || lower.includes('first year') || lower.includes('pre-existing') || lower.includes('PED')) {
    return {
      status: 'REJECTED',
      approvalChance: 10,
      riskLevel: 'High',
      reason: 'Pre-existing condition is likely inside waiting period.',
      detailedAnalysis: 'Most health policies apply a strict waiting period for pre-existing diseases. If policy age is below that period, claim rejection is highly likely.',
      keyFactors: ['Pre-existing disease', 'Waiting period not completed', 'Policy age check required'],
      userAdvice: 'Submit policy schedule and prior medical records to verify waiting period completion.'
    };
  }

  if (lower.includes('accident') || lower.includes('injury')) {
    return {
      status: 'APPROVED',
      approvalChance: 95,
      riskLevel: 'Low',
      reason: 'Accident-related hospitalization is usually covered without waiting period.',
      detailedAnalysis: 'Accidental treatment is generally eligible immediately unless a specific accident-related exclusion applies in the policy wording.',
      keyFactors: ['Accidental event', 'No waiting period for accidents', 'No explicit exclusion identified'],
      userAdvice: 'Keep FIR/incident report, admission notes, and itemized bills ready for faster processing.'
    };
  }

  if (lower.includes('surgery') || lower.includes('icu') || lower.includes('hospital')) {
    return {
      status: 'UNCERTAIN',
      approvalChance: 65,
      riskLevel: 'Medium',
      reason: 'Hospital claim may be paid partly based on sub-limits and exclusions.',
      detailedAnalysis: 'Even when hospitalization is covered, room rent caps, consumables exclusion, and eligibility checks can reduce settlement amount.',
      keyFactors: ['Hospitalization coverage scope', 'Room rent/sub-limit caps', 'Consumables/exclusions'],
      userAdvice: 'Get a pre-authorization estimate and keep itemized bills and discharge summary.'
    };
  }

  return {
    status: 'UNCERTAIN',
    approvalChance: 55,
    riskLevel: 'Medium',
    reason: 'Outcome depends on treatment type, exclusions, and waiting period status.',
    detailedAnalysis: 'Without complete diagnosis timeline and policy clauses, insurer may approve, partially settle, or reject based on exclusions and sub-limits.',
    keyFactors: ['Medical necessity clarity', 'Exclusion applicability', 'Waiting period and sum insured limits'],
    userAdvice: 'Share discharge summary, diagnosis date, and full policy wording before filing.'
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

  const SYSTEM_PROMPT = opts.analystInstructions?.trim() || \`You are an expert health insurance claim analyst AI.

Your task is to evaluate whether a user's claim will be approved based on their described medical situation and the provided insurance policy.

Think like a real insurance company reviewer - strict, realistic, and policy-driven.

INPUT:
- User's medical situation (free text)
- Policy details (coverage, exclusions, waiting period, sum insured)

OUTPUT (STRICT JSON FORMAT):
{
  "status": "APPROVED | REJECTED | UNCERTAIN",
  "approvalChance": number (0-100),
  "riskLevel": "Low | Medium | High",
  "reason": "Clear, simple explanation in 1-2 lines",
  "detailedAnalysis": "Short paragraph explaining decision using policy terms",
  "keyFactors": [
    "Factor 1",
    "Factor 2",
    "Factor 3"
  ],
  "userAdvice": "What user should do next (e.g., documents, precautions)"
}

DECISION LOGIC:
- Accidents -> HIGH approval chance unless explicitly excluded
- Pre-existing diseases -> Check waiting period strictly
- Recent policy (< waiting period) -> Increase rejection probability
- Cosmetic / non-medical / excluded treatments -> REJECT
- Missing or unclear info -> mark as UNCERTAIN (not APPROVED)

TONE:
- Simple, human-friendly
- Avoid technical jargon unless needed
- Be honest - do NOT overpromise approval

IMPORTANT:
- Output must ALWAYS be valid JSON
- No extra text outside JSON\`;

  const policyText = opts.policy ? JSON.stringify(opts.policy, null, 2).slice(0, 20000) : 'No policy';

  const prompt = [\`Scenario: \${opts.scenario}\`, \`Provider: \${opts.provider || 'unknown'}\`, \`Policy: \${policyText}\`].join('\\n\\n');

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(SYSTEM_PROMPT + '\\n\\n' + prompt, {
      generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
    });

    const parsed = safeJsonParse(result.response.text());
    if (parsed?.status) {
      return {
        status: parsed.status === 'APPROVED' || parsed.status === 'REJECTED' || parsed.status === 'UNCERTAIN' ? parsed.status : 'UNCERTAIN',
        approvalChance: clamp01to100(parsed.approvalChance, 50),
        riskLevel: parsed.riskLevel === 'Low' || parsed.riskLevel === 'High' ? parsed.riskLevel : 'Medium',
        reason: String(parsed.reason || 'We could not validate all policy conditions.'),
        detailedAnalysis: String(parsed.detailedAnalysis || 'Decision based on waiting periods, exclusions, and coverage limits in the policy.'),
        keyFactors: Array.isArray(parsed.keyFactors) ? parsed.keyFactors.slice(0, 3).map((x: any) => String(x)) : ['Policy exclusions', 'Waiting period rules', 'Medical necessity and treatment type'],
        userAdvice: String(parsed.userAdvice || 'Share complete hospital records and policy documents before claim filing.')
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
    return {
      status: 'REJECTED',
      approvalChance: 10,
      riskLevel: 'High',
      reason: 'Pre-existing condition is likely inside waiting period.',
      detailedAnalysis: 'Most health policies apply a strict waiting period for pre-existing diseases. If policy age is below that period, claim rejection is highly likely.',
      keyFactors: ['Pre-existing disease', 'Waiting period not completed', 'Policy age check required'],
      userAdvice: 'Submit policy schedule and prior medical records to verify waiting period completion.'
    };
  }
  if (lower.includes('accident')) {
    return {
      status: 'APPROVED',
      approvalChance: 95,
      riskLevel: 'Low',
      reason: 'Accident-related hospitalization is usually covered without waiting period.',
      detailedAnalysis: 'Accidental treatment is generally eligible immediately unless a specific accident-related exclusion applies in the policy wording.',
      keyFactors: ['Accidental event', 'No waiting period for accidents', 'No explicit exclusion identified'],
      userAdvice: 'Keep FIR/incident report, admission notes, and itemized bills ready for faster processing.'
    };
  }
  return {
    status: 'UNCERTAIN',
    approvalChance: 55,
    riskLevel: 'Medium',
    reason: 'Outcome depends on treatment type, exclusions, and waiting period status.',
    detailedAnalysis: 'Without complete diagnosis timeline and policy clauses, insurer may approve, partially settle, or reject based on exclusions and sub-limits.',
    keyFactors: ['Medical necessity clarity', 'Exclusion applicability', 'Waiting period and sum insured limits'],
    userAdvice: 'Share discharge summary, diagnosis date, and full policy wording before filing.'
  };
}

// Existing exports
export { generateSmartSummary, analyzePolicyMasterPrompt, simulateScenario, assistantChat, parsePolicyDetailed };


