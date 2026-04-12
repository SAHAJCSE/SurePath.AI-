import { PolicyAnalysis } from './types';

export function validatePolicy(data: PolicyAnalysis) {
  if (!data?.insurer && !data?.policyName) {
    throw new Error('Invalid AI response: Missing essential policy details (insurer, policyName)');
  }

  if (!data?.coverage) {
    throw new Error('Coverage missing');
  }
}
