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

export interface PremiumData {
  amount: number;
  frequency: string;
  nextDueDate: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  amount: number;
}

export interface ClaimsData {
  process: string;
  documentsRequired: string[];
  contact: string;
}

export interface ValidityData {
  startDate: string;
  endDate: string;
  status: string;
}

export interface RiskScoreData {
  score: number;
  level: 'Low' | 'Medium' | 'High';
  reason: string;
}

export interface MetaData {
  confidence: number;
  missingFields: string[];
}

export interface PolicyAnalysis {
  policyHolder: PolicyHolder;
  coverage: CoverageData;
  premium: PremiumData;
  benefits: BenefitItem[];
  exclusions: string[];
  claims: ClaimsData;
  validity: ValidityData;
  riskScore: RiskScoreData;
  insights: string[];
  meta: MetaData;
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


