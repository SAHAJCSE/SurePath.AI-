import { PolicyAnalysis } from './types';

export function validatePolicy(data: PolicyAnalysis) {
  if (!data?.policyHolder?.name && !data?.policyHolder?.policyType && !data?.policyHolder?.insurer) {
    throw new Error('Invalid AI response: Missing essential policyHolder details');
  }

  if (!data?.coverage) {
    throw new Error('Coverage missing');
  }
}
