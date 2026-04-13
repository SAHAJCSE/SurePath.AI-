import type { ClaimCheckRequest, ClaimCheckResult, Locale, PolicyAnalysis, ScenarioId, ScenarioResult, SmartSummary } from './types.js';

function toLocale(input?: string): Locale {
  return input === 'hi' ? 'hi' : 'en';
}

function clamp01to100(n: unknown, fallback: number) {
  const x = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(0, Math.min(100, Math.round(x)));
}

type SummaryOpts = { rawText: string; locale?: Locale; provider?: string; policyName?: string };
type AnalysisOpts = { rawText: string; provider?: string; policyName?: string };
type ChatOpts = {
  messages: Array<{ role: 'user' | 'assistant'; text: string }>;
  provider?: string;
  rawText?: string;
};
type SimulateOpts = { scenarioId: ScenarioId; locale?: Locale };

function has(text: string, ...needles: string[]) {
  const lower = text.toLowerCase();
  return needles.some((n) => lower.includes(n.toLowerCase()));
}

export async function generateSmartSummary(opts: SummaryOpts): Promise<SmartSummary> {
  const locale = toLocale(opts.locale);
  const text = opts.rawText || '';
  const complex = Math.min(90, 40 + Math.floor(text.length / 2000));
  const riskScore = has(text, 'co-pay', 'copay', 'sub-limit', 'waiting period') ? 52 : 72;
  const verdict = riskScore >= 70 ? 'yes' : riskScore >= 45 ? 'maybe' : 'no';

  return {
    provider: opts.provider || 'Unknown',
    policyName: opts.policyName || 'Policy Summary',
    locale,
    headline: locale === 'hi' ? 'Policy ka seedha summary' : 'Straight policy summary',
    plainSummary:
      locale === 'hi'
        ? 'Policy me coverage aur exclusions dono check karein. Claim ke time waiting period aur sub-limits sabse important hote hain.'
        : 'Check both coverage and exclusions. Waiting periods and sub-limits are the most important factors during claims.',
    riskScore,
    complexityScore: complex,
    keyNumbers: {
      accidentCoverage: has(text, 'accident') ? 'Covered' : 'Check schedule',
      naturalDeathCoverage: has(text, 'death') ? 'As per policy terms' : 'Not explicit',
      hospitalizationCoverage: has(text, 'hospital') ? 'Covered with conditions' : 'Not explicit',
    },
    clauses: [
      { title: 'Waiting Period', whyItMatters: 'Claims in waiting period are commonly rejected.' },
      { title: 'Sub-limits', whyItMatters: 'Room rent and category caps can reduce payout.' },
      { title: 'Exclusions', whyItMatters: 'Excluded procedures are not payable even with active policy.' },
    ],
    coverage: [
      { id: 'accident', label: 'Accident hospitalization', status: 'covered', strength: 85, rationale: 'Usually covered from day one unless excluded.' },
      { id: 'ped', label: 'Pre-existing diseases', status: 'conditional', strength: 35, rationale: 'Depends on waiting period completion.' },
      { id: 'cosmetic', label: 'Cosmetic treatment', status: 'not_covered', strength: 10, rationale: 'Commonly excluded unless medically necessary.' },
    ],
    shouldIBuy: {
      verdict,
      reason: verdict === 'yes' ? 'Balanced coverage with manageable risk conditions.' : verdict === 'maybe' ? 'Useful but check caps and waiting periods carefully.' : 'Too many constraints for reliable claim outcomes.',
    },
  };
}

export async function analyzePolicyMasterPrompt(opts: AnalysisOpts): Promise<PolicyAnalysis> {
  const text = opts.rawText || '';
  const hasCopay = has(text, 'co-pay', 'copay');
  const hasWaiting = has(text, 'waiting period', 'pre-existing');

  return {
    policyName: opts.policyName || 'Health Policy',
    insurer: opts.provider || 'Unknown Insurer',
    totalSumInsured: 500000,
    coverage: {
      totalCoverage: 500000,
      accidentalCoverage: 500000,
      naturalDeath: 0,
      hospitalization: 500000,
      criticalIllness: has(text, 'critical illness') ? 200000 : 0,
    },
    coverages: [
      { name: 'Hospitalization', amount: 500000, unit: 'INR', isCovered: true },
      { name: 'Accident treatment', amount: 500000, unit: 'INR', isCovered: true },
      { name: 'Cosmetic procedures', amount: 0, unit: 'INR', isCovered: false },
    ],
    exclusions: [
      {
        title: 'Cosmetic and aesthetic treatment',
        description: 'Non-medically required cosmetic treatment is excluded.',
        severity: 'high',
        clause_text: 'Cosmetic treatment not payable unless medically necessary.',
        page_number: 'NA',
        confidence: 'high',
      },
      {
        title: 'Waiting period restrictions',
        description: 'Pre-existing diseases need waiting period completion.',
        severity: 'high',
        clause_text: 'Pre-existing claims are restricted until waiting period ends.',
        page_number: 'NA',
        confidence: hasWaiting ? 'high' : 'medium',
      },
    ],
    generalConditions: [
      hasCopay ? 'Co-pay applies as per policy schedule.' : 'No explicit co-pay found in parsed text.',
      'Network/non-network reimbursement rules may affect settlement speed.',
      'Original bills and discharge summary are required for claim processing.',
    ],
    decision: {
      verdict: hasCopay || hasWaiting ? 'CAUTION' : 'BUY',
      risk_score: hasCopay || hasWaiting ? 58 : 76,
      reasons: hasCopay || hasWaiting ? ['Contains payout constraints (co-pay/waiting period).', 'Verify exclusions before purchase.'] : ['Coverage looks balanced for hospitalization claims.'],
    },
  };
}

export async function parsePolicyDetailed(opts: AnalysisOpts): Promise<PolicyAnalysis> {
  return analyzePolicyMasterPrompt(opts);
}

export async function assistantChat(opts: ChatOpts): Promise<string> {
  const lastUser = [...opts.messages].reverse().find((m) => m.role === 'user')?.text || '';
  if (!lastUser.trim()) return 'Please share your question about your policy or claim.';
  const policyHint = opts.rawText ? 'I also have your uploaded policy context.' : 'Upload a policy for exact clause-based answers.';
  return `${policyHint} Based on your question, focus on waiting period, exclusions, and claim documents first.`;
}

export async function simulateScenario(opts: SimulateOpts): Promise<ScenarioResult> {
  const locale = toLocale(opts.locale);
  const map: Record<ScenarioId, ScenarioResult> = {
    bike_accident: {
      covered: true,
      amount: 'Likely covered up to admissible hospitalization limits',
      riskLevel: 'low',
      steps: ['Inform insurer within 24 hours', 'Submit admission + discharge papers', 'Provide itemized bills'],
      explanation: locale === 'hi' ? 'Durghatna claims aam taur par cover hote hain.' : 'Accident claims are generally covered.',
    },
    alcohol_accident: {
      covered: false,
      amount: 'Likely rejected',
      riskLevel: 'high',
      steps: ['Review intoxication exclusion', 'Collect all medico-legal documents'],
      explanation: locale === 'hi' ? 'Intoxication cases mein exclusion lag sakta hai.' : 'Intoxication-related exclusions often apply.',
    },
    hospital_admission: {
      covered: true,
      amount: 'Covered with sub-limits',
      riskLevel: 'medium',
      steps: ['Check room-rent cap', 'Check consumables exclusions'],
      explanation: locale === 'hi' ? 'Hospital claim mein sub-limits payout kam kar sakte hain.' : 'Sub-limits may reduce final payout.',
    },
    natural_death: {
      covered: false,
      amount: 'Not a standard health policy benefit',
      riskLevel: 'medium',
      steps: ['Verify if rider exists', 'Check policy schedule'],
      explanation: locale === 'hi' ? 'Natural death cover health plan mein usually nahi hota.' : 'Natural death is usually not covered in health-only plans.',
    },
    self_harm: {
      covered: false,
      amount: 'Likely excluded',
      riskLevel: 'high',
      steps: ['Review self-harm/suicide clause', 'Consult insurer support desk'],
      explanation: locale === 'hi' ? 'Self-harm exclusions aam hain.' : 'Self-harm exclusions are common.',
    },
    cosmetic_surgery: {
      covered: false,
      amount: 'Excluded unless medically necessary',
      riskLevel: 'high',
      steps: ['Get medical necessity certificate', 'Check reconstructive surgery wording'],
      explanation: locale === 'hi' ? 'Cosmetic treatment aam taur par excluded hota hai.' : 'Cosmetic treatment is generally excluded.',
    },
  };
  return map[opts.scenarioId];
}

function getDemoClaimResult(scenario: string): ClaimCheckResult {
  const lower = scenario.toLowerCase();
  if (has(lower, 'cosmetic', 'hair transplant', 'aesthetic')) {
    return {
      status: 'REJECTED',
      approvalChance: 5,
      riskLevel: 'High',
      reason: 'Cosmetic or non-medical treatment is typically excluded.',
      detailedAnalysis: 'Most health policies exclude cosmetic procedures unless they are medically necessary after trauma or disease.',
      keyFactors: ['Treatment type is cosmetic', 'Exclusion likely applies', 'Medical necessity proof missing'],
      userAdvice: 'Share doctor-certified medical necessity and policy wording before filing.',
    };
  }
  if (has(lower, 'pre-existing', 'diabetes', 'hypertension', 'ped', 'first year')) {
    return {
      status: 'REJECTED',
      approvalChance: 12,
      riskLevel: 'High',
      reason: 'Pre-existing condition appears within waiting period.',
      detailedAnalysis: 'Claims for pre-existing diseases are usually blocked until the waiting period ends, unless policy terms state otherwise.',
      keyFactors: ['Pre-existing disease mention', 'Waiting period risk', 'Policy start date needed'],
      userAdvice: 'Provide policy inception date, PED clause, and past medical records.',
    };
  }
  if (has(lower, 'accident', 'injury', 'fracture', 'trauma')) {
    return {
      status: 'APPROVED',
      approvalChance: 92,
      riskLevel: 'Low',
      reason: 'Accident-related treatment is usually covered.',
      detailedAnalysis: 'Accident hospitalization is typically payable from day one unless an explicit exclusion is triggered.',
      keyFactors: ['Accidental event', 'No normal waiting period', 'No explicit exclusion in scenario'],
      userAdvice: 'Submit FIR/incident note, admission records, and itemized hospital bills.',
    };
  }
  return {
    status: 'UNCERTAIN',
    approvalChance: 55,
    riskLevel: 'Medium',
    reason: 'Insufficient detail to confirm approval confidently.',
    detailedAnalysis: 'Final outcome depends on diagnosis timeline, exclusions, waiting period status, and admissible limits.',
    keyFactors: ['Diagnosis clarity', 'Waiting period check', 'Exclusion mapping'],
    userAdvice: 'Share diagnosis date, treatment plan, and complete policy document for a stronger assessment.',
  };
}

export async function checkClaimApproval(opts: ClaimCheckRequest): Promise<ClaimCheckResult> {
  return getDemoClaimResult(opts.scenario);
}


