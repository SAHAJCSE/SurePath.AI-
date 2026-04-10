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

export type StoredPolicy = {
  policyId: string;
  uploadedAt: number;
  filename?: string;
  mimeType?: string;
  rawText: string;
  lastSummary?: SmartSummary;
};

