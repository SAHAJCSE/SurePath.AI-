export type Locale = 'en' | 'hi';

export type CoverageItem = {
  id: string;
  label: string;
  status: 'covered' | 'not_covered' | 'conditional' | 'unknown';
  strength: number; // 0..100
  rationale: string;
};

export type ImportantClause = {
  title: string;
  whyItMatters: string;
};

export type SmartSummary = {
  provider?: string;
  policyName?: string;
  locale: Locale;
  headline: string;
  plainSummary: string;
  riskScore: number; // 0..100 (higher=better value/fit)
  complexityScore: number; // 0..100 (higher=harder legalese)
  keyNumbers: {
    accidentCoverage?: string; // e.g. "₹5 lakh"
    naturalDeathCoverage?: string; // e.g. "₹3 lakh"
    hospitalizationCoverage?: string; // e.g. "Covered"
  };
  clauses: ImportantClause[];
  coverage: CoverageItem[];
  shouldIBuy: {
    verdict: 'yes' | 'no' | 'maybe';
    reason: string;
  };
};

export type ScenarioId =
  | 'bike_accident'
  | 'alcohol_accident'
  | 'hospital_admission'
  | 'natural_death'
  | 'self_harm'
  | 'cosmetic_surgery';

export type ScenarioRequest = {
  policyId: string;
  scenarioId: ScenarioId;
  locale?: Locale;
  notes?: string;
};

export type ScenarioResult = {
  covered: boolean;
  amount: string;
  riskLevel: 'low' | 'medium' | 'high';
  steps: string[];
  explanation: string;
};

export interface PolicyHolder {
  name: string;
  dob: string;
  gender: string;
  policyNumber: string;
  insurer: string;
  policyType: string;
}

export interface CoverageData {
  totalCoverage: number;
  accidentalCoverage: number;
  naturalDeath: number;
  hospitalization: number;
  criticalIllness: number;
}

export interface PolicyCoverageItem {
  name: string;
  amount: number | string;
  unit: string;
  isCovered: boolean;
}

export interface ExclusionItem {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  clause_text: string;
  page_number: string;
  confidence: string;
}

export interface DecisionData {
  verdict: 'BUY' | 'CAUTION' | 'AVOID';
  risk_score: number;
  reasons: string[];
}

export interface PolicyAnalysis {
  policyName: string;
  insurer: string;
  totalSumInsured: number;
  coverage: CoverageData;
  coverages: PolicyCoverageItem[];
  exclusions: ExclusionItem[];
  generalConditions: string[];
  decision: DecisionData;
}

export type StoredPolicy = {
  policyId: string;
  uploadedAt: number;
  filename?: string;
  mimeType?: string;
  rawText: string;
  lastSummary?: SmartSummary;
  lastAnalysis?: PolicyAnalysis;
};

export interface ClaimCheckRequest {
  policyId?: string;
  scenario: string;
  policy?: any; // ParsedPolicy 
  provider?: string;
}

export interface ClaimCheckResult {
  claim_status: 'approved' | 'partial' | 'rejected';
  approval_chance: number;
  risk_level: 'low' | 'medium' | 'high';
  reason: string;
};



