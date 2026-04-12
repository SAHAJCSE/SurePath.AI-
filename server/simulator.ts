export function simulate(policyData: any, scenario: any) {
  // Handle both strict prompt input format and existing frontend format
  const total_bill = scenario.hospitalBill || scenario.bill?.total || 100000;
  const roomRent = scenario.bill?.roomRent || (total_bill * 0.2); // mock room rent if not explicitly given

  let eligible_claim = total_bill;
  let finalDeductions: { reason: string, amount: number }[] = [];

  const sumInsured = policyData.totalSumInsured || 500000;
  const eligibleRoomRent = sumInsured * 0.01; // Typically 1% of SI
  
  // Rule 1: Apply room rent proportional deduction (20-40%) if exceeded
  if (roomRent > eligibleRoomRent) {
     const deductionAmount = total_bill * 0.25; // 25% proportionate
     finalDeductions.push({ reason: "Room Rent Limit Breach (Proportionate deduction)", amount: deductionAmount });
     eligible_claim -= deductionAmount;
  }

  // Rule 2: Deduct non-medical costs (10-25%)
  const nonMedicalAmount = total_bill * 0.15; 
  finalDeductions.push({ reason: "Consumables & Non-medical Expenses", amount: nonMedicalAmount });
  eligible_claim -= nonMedicalAmount;

  // Rule 3: Apply co-pay if present
  if (scenario.hospitalType === 'Non-Network' || scenario.hasCopay) {
     const copay = eligible_claim * 0.1;
     finalDeductions.push({ reason: "Non-Network Co-pay (10%)", amount: copay });
     eligible_claim -= copay;
  }

  // Cap at max limit
  if (eligible_claim > sumInsured) {
     const overLimit = eligible_claim - sumInsured;
     finalDeductions.push({ reason: "Exceeds Total Sum Insured Limit", amount: overLimit });
     eligible_claim = sumInsured;
  }

  const estimatedPayout = Math.max(0, Math.round(eligible_claim));
  const deductibleTotal = finalDeductions.reduce((s, d) => s + d.amount, 0);
  const outOfPocket = Math.max(0, Math.round(total_bill - estimatedPayout));

  const probPercent = total_bill > 0
    ? Math.min(99, Math.max(5, Math.round((estimatedPayout / total_bill) * 100)))
    : 50;
  const probability = probPercent >= 72 ? 'High' : probPercent >= 48 ? 'Medium' : 'Low';

  // Return the strict prompt shape along with frontend payload for compatibility
  return {
    total_bill,
    eligible_claim: estimatedPayout,
    deductions: finalDeductions,

    // Frontend fields
    estimatedPayout,
    probability,
    probPercent,
    totalBill: total_bill,
    deductible: Math.round(deductibleTotal) || 5000,
    outOfPocket,
    risks: finalDeductions.slice(0, 4).map((d) => d.reason),
    advice: [
      'Keep all original bills and discharge summary for claim.',
      scenario.hospitalType === 'Network'
        ? 'Cashless is easier at listed network hospitals.'
        : 'Non-network claims may need reimbursement with extra documents.',
    ],
  };
}
