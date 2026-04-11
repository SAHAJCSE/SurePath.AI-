// src/data/samplePolicies.ts

export interface ParsedPolicy {
  policyName: string;
  insurer: string;
  totalSumInsured: number;
  coverages: { name: string; amount: number | string; unit: string; isCovered: boolean; }[];
  exclusions: { title: string; description: string; severity: 'high' | 'medium' | 'low'; }[];
  generalConditions: string[];
}

export const samplePolicies: { [key: string]: ParsedPolicy } = {
  lic: {
    policyName: "Jeevan Arogya",
    insurer: "Life Insurance Corporation (LIC)",
    totalSumInsured: 500000,
    coverages: [
      { name: "Hospital Cash Benefit", amount: 2000, unit: "₹/day", isCovered: true },
      { name: "Major Surgical Benefit", amount: 500000, unit: "₹", isCovered: true },
      { name: "Day Care Procedure Benefit", amount: 10000, unit: "₹", isCovered: true },
      { name: "Ambulance Benefit", amount: 1000, unit: "₹", isCovered: true },
      { name: "Medical Management (Dengue/Malaria)", amount: 5000, unit: "₹", isCovered: true },
      { name: "Pre-existing Diseases", amount: 0, unit: "₹", isCovered: false }
    ],
    exclusions: [
      { title: "Pre-existing Diseases", description: "Conditions existing before policy purchase are not covered for the first 48 months.", severity: "high" },
      { title: "Epidemic Diseases", description: "Diseases declared as epidemic by government may be partially covered.", severity: "high" },
      { title: "Cosmetic/Plastic Surgery", description: "Surgery for cosmetic purposes is excluded.", severity: "medium" },
      { title: "Self-Inflicted Injuries", description: "Injuries from self-harm or suicide attempts are not covered.", severity: "high" },
      { title: "Substance Abuse", description: "Treatment related to alcohol or drug abuse is excluded.", severity: "medium" }
    ],
    generalConditions: [
      "30-day initial waiting period for illnesses.",
      "2-year waiting period for specific diseases.",
      "48-month waiting period for pre-existing conditions.",
      "Policy can be taken for self, spouse, children, and parents."
    ]
  },
  hdfc: {
    policyName: "Optima Secure",
    insurer: "HDFC ERGO",
    totalSumInsured: 1000000,
    coverages: [
      { name: "Room Rent (No Limit)", amount: "No cap", unit: "", isCovered: true },
      { name: "ICU Charges", amount: "No cap", unit: "", isCovered: true },
      { name: "Pre/Post Hospitalization", amount: 60, unit: "days/180 days", isCovered: true },
      { name: "Consumables Cover", amount: 100, unit: "%", isCovered: true },
      { name: "No Claim Bonus", amount: 50, unit: "% yearly", isCovered: true },
      { name: "Restore Benefit", amount: 100, unit: "% of SI", isCovered: true },
      { name: "Modern Treatments (Robotic)", amount: 100, unit: "%", isCovered: true }
    ],
    exclusions: [
      { title: "Investigations", description: "Costs of X-rays, MRIs, etc., may be capped or excluded if not part of treatment.", severity: "medium" },
      { title: "Non-Medical Expenses", description: "Personal care items like toothpaste, soaps, etc., are excluded.", severity: "low" },
      { title: "Cosmetic Surgery", description: "Purely cosmetic surgeries are not covered.", severity: "medium" },
      { title: "War/Nuclear Risks", description: "Injuries from war or nuclear activity are excluded.", severity: "low" }
    ],
    generalConditions: [
      "30-day initial waiting period.",
      "24-month waiting period for specific illnesses.",
      "36-month waiting period for pre-existing diseases.",
      "Cashless treatment available across a wide network of hospitals."
    ]
  },
  sbi: {
    policyName: "Arogya Shield",
    insurer: "SBI Life Insurance",
    totalSumInsured: 750000,
    coverages: [
      { name: "Hospitalization Expenses", amount: 750000, unit: "₹", isCovered: true },
      { name: "Pre/Post Hospitalization", amount: 60, unit: "days/90 days", isCovered: true },
      { name: "Day Care Procedures", amount: 141, unit: "procedures", isCovered: true },
      { name: "Emergency Ambulance", amount: 1500, unit: "₹", isCovered: true },
      { name: "Alternative Treatment (AYUSH)", amount: 25000, unit: "₹", isCovered: true },
      { name: "Pure Term Life Cover", amount: 500000, unit: "₹ (Add-on)", isCovered: true }
    ],
    exclusions: [
      { title: "30-Day Waiting Period", description: "No coverage for any illness in the first 30 days.", severity: "high" },
      { title: "Pre-existing Diseases", description: "Covered only after 48 months.", severity: "high" },
      { title: "Cosmetic/Plastic Surgery", description: "Excluded unless for accident or reconstruction.", severity: "medium" },
      { title: "Maternity Benefits", description: "Generally not covered or has a long waiting period.", severity: "medium" },
      { title: "Hazardous Sports", description: "Injuries from adventure sports are excluded.", severity: "low" }
    ],
    generalConditions: [
      "Policy provides dual benefit of health and life insurance.",
      "Cashless claim facility available.",
      "5% discount on combined health and life insurance premiums.",
      "Life cover available from ₹5 lakhs up to ₹2.5 crores."
    ]
  },
  icici: {
    policyName: "iShield (Combi Plan)",
    insurer: "ICICI Prudential",
    totalSumInsured: 1000000,
    coverages: [
      { name: "Hospitalization", amount: 1000000, unit: "₹", isCovered: true },
      { name: "Pre/Post Hospitalization", amount: 60, unit: "days", isCovered: true },
      { name: "Daycare Treatments", amount: 1000000, unit: "₹", isCovered: true },
      { name: "Restore Benefit", amount: 100, unit: "% of SI", isCovered: true },
      { name: "No Claim Bonus", amount: 20, unit: "% yearly", isCovered: true },
      { name: "Life Cover", amount: 5000000, unit: "₹", isCovered: true }
    ],
    exclusions: [
      { title: "2-Year Exclusion", description: "Specific illnesses are not covered for the first 2 years.", severity: "high" },
      { title: "Cosmetic Treatment", description: "Treatment to alter appearance is excluded.", severity: "medium" },
      { title: "Self-Inflicted Injury", description: "Any injury caused by yourself on purpose.", severity: "high" }
    ],
    generalConditions: [
      "Combines health and life insurance.",
      "Life cover up to age 85.",
      "Waiver of future premiums on permanent disability due to accident.",
      "4 combinations of health and life cover to choose from."
    ]
  }
};
