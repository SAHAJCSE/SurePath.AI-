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

export type ParsedPolicy = PolicyAnalysis & {
  totalSumInsured?: number; // Legacy compat
  generalConditions?: string[]; // Legacy compat
  networkHospitals?: string[]; // for simulator
};

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
