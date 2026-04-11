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

import { PolicyAnalysis } from '../../server/types';

export type ParsedPolicy = Omit<PolicyAnalysis, 'exclusions' | 'coverages'> & {
  // We keep legacy fields so UI doesn't crash but we populate them from new structure
  totalSumInsured: number;
  insurer: string;
  policyName: string;
  generalConditions: string[];
  networkHospitals?: string[];
  
  // Overriding exclusions to match the object shape the UI needs
  exclusions: { title: string; description: string; severity: 'high' | 'medium' | 'low' }[];
  coverages: { name: string; amount: number | string; unit: string; isCovered: boolean }[];
};
