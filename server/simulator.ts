export function simulate(policyData: any, scenario: any) {
  let estimatedPayout = 0;
  const totalBill = scenario.hospitalBill || 100000;

  if (totalBill) {
    estimatedPayout += Math.min(
      totalBill,
      (policyData.totalSumInsured || policyData.coverage?.hospitalization || policyData.coverage?.totalCoverage || 0)
    );
  }

  if (scenario.accident) {
    estimatedPayout += (policyData.coverage?.accidentalCoverage || 0);
  }
  
  if (scenario.hospitalType === 'Non-Network') estimatedPayout *= 0.8;
  if (scenario.cityTier === 'Tier-1') estimatedPayout *= 0.95;
  if (scenario.age > 60) estimatedPayout *= 0.85;

  const sumInsuredLimit = policyData.totalSumInsured || 500000;
  estimatedPayout = Math.min(estimatedPayout, sumInsuredLimit);

  const deductible = totalBill * 0.05 + (scenario.hospitalType === 'Non-Network' ? totalBill * 0.1 : 0);
  const outOfPocket = Math.max(0, totalBill - estimatedPayout - (totalBill * 0.02));

  const coverageRatio = estimatedPayout / totalBill;
  let probability = 'High';
  let probPercent = 95;

  if (coverageRatio < 0.6) {
    probability = 'Low';
    probPercent = 35;
  } else if (coverageRatio < 0.85) {
    probability = 'Medium';
    probPercent = 65;
  }

  return {
    estimatedPayout,
    probability,
    probPercent,
    totalBill,
    deductible,
    outOfPocket,
    risks: [
      scenario.hospitalType === 'Non-Network' ? 'Non-Network hospitals have 20% co-pay.' : 'Room rent cap might apply for luxury rooms.',
      scenario.age > 60 ? 'Senior citizen co-payment clause detected.' : 'Non-medical expenses (PPE, etc.) are usually excluded.'
    ],
    advice: [
      scenario.hospitalType === 'Non-Network' ? 'Switch to a Network Hospital to save money.' : 'Stay in a shared room to avoid room-rent capping.',
      'Consider a Top-up plan if you expect more high-value treatments.'
    ]
  };
}
