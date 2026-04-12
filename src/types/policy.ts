export interface CoverageItem {
  name: string;
  amount: number | string;
  unit: string;
  isCovered: boolean;
}

export interface Exclusion {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  clause_text?: string;
  page_number?: string;
  confidence?: string;
}

export interface ParsedPolicy {
  policyName: string;
  insurer: string;
  totalSumInsured: number;
  coverage: {
    totalCoverage: number;
    accidentalCoverage: number;
    naturalDeath: number;
    hospitalization: number;
    criticalIllness: number;
  };
  coverages: CoverageItem[];
  exclusions: Exclusion[];
  generalConditions: string[];
  decision?: {
    verdict: 'BUY' | 'CAUTION' | 'AVOID';
    risk_score: number;
    reasons: string[];
  };
}
