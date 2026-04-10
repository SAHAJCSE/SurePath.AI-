import type { StoredPolicy } from './types.js';

const policies = new Map<string, StoredPolicy>();

export function putPolicy(policy: StoredPolicy) {
  policies.set(policy.policyId, policy);
}

export function getPolicy(policyId: string) {
  return policies.get(policyId);
}

export function updatePolicy(policyId: string, patch: Partial<StoredPolicy>) {
  const existing = policies.get(policyId);
  if (!existing) return;
  policies.set(policyId, { ...existing, ...patch });
}

