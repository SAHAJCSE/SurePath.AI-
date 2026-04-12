import { Exclusion } from '../../types/policy';

export interface FinancialScenario {
  id: string;
  scenario: string;
  status: 'rejected' | 'partial' | 'covered';
  total_bill: number;
  insurance_pays: number;
  you_pay: number;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

export function generateFinancialScenarios(exclusions: Exclusion[], sumInsured: number): FinancialScenario[] {
  // If no exclusions, provide demo realistic risk data
  const fallbackExclusions: Exclusion[] = exclusions.length > 0 ? exclusions : [
    { title: 'Pre-existing Diabetes Treatment', description: 'Waiting period of 36 months not completed', severity: 'high' as const },
    { title: 'Robotic Surgery Procedures', description: 'Capped at 50% of the total treatment cost', severity: 'medium' as const },
    { title: 'Consumables & PPE Kits', description: 'Non-medical expenses are strictly excluded', severity: 'low' as const }
  ];

  return fallbackExclusions.map((exc, index) => {
    let bill = 300000;
    if (exc.severity === 'high') bill = sumInsured > 0 ? Math.min(sumInsured, 500000) : 500000;
    if (exc.severity === 'medium') bill = 250000;
    if (exc.severity === 'low') bill = 80000;

    let payout = 0;
    let status: 'rejected' | 'partial' | 'covered' = 'rejected';

    if (exc.severity === 'high') {
      payout = 0;
      status = 'rejected';
    } else if (exc.severity === 'medium') {
      payout = bill * 0.5;
      status = 'partial';
    } else {
      payout = bill * 0.8;
      status = 'partial';
    }

    return {
      id: `scen-${index}`,
      scenario: exc.title,
      status,
      total_bill: bill,
      insurance_pays: payout,
      you_pay: bill - payout,
      reason: exc.description || exc.clause_text || "Policy exclusion applies",
      severity: exc.severity
    };
  });
}
