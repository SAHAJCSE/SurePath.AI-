export interface CoverageItem {
  name: string;        // e.g., "Room Rent", "ICU Charges"
  amount: number | string;      // sum insured or limit
  unit: string;        // "₹", "days", "%"
  isCovered: boolean;
}

export interface Exclusion {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low'; // for UI styling
}

export interface ParsedPolicy {
  policyName: string;
  insurer: string;
  totalSumInsured: number; // e.g., 500000
  coverages: CoverageItem[];
  exclusions: Exclusion[];
  generalConditions: string[];
  networkHospitals?: string[]; // for simulator
}
