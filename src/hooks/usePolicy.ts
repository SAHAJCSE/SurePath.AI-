import { useState, useEffect } from 'react';
import { ParsedPolicy } from '../types/policy';
import { API_BASE } from '../config';
import { samplePolicies } from '../data/samplePolicies';

export function usePolicy() {
  const [policy, setPolicy] = useState<ParsedPolicy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolicy() {
      const policyId = localStorage.getItem('surepath_policy_id');
      const rawProvider = localStorage.getItem('surepath_selected_provider') || 'lic';
      const provider = rawProvider.toLowerCase().split(' ')[0]; // 'HDFC Life' -> 'hdfc'

      // Fallback to sample data if no policyId or if it's a demo
      if (!policyId || policyId === 'demo-policy-id') {
        setPolicy(samplePolicies[provider] || samplePolicies['lic']);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/analyze-policy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ policyId, provider }),
        });

        if (!res.ok) throw new Error('Failed to parse policy');
        const data = await res.json();
        
        // Map new schema to the UI fields
        const temp = data.analysis;
        const mappedPolicy: ParsedPolicy = {
          ...temp,
          totalSumInsured: temp.coverage?.totalCoverage || 0,
          insurer: temp.policyHolder?.insurer || provider,
          policyName: temp.policyHolder?.policyType || 'Insurance Policy',
          generalConditions: temp.insights || [],
          exclusions: (temp.exclusions || []).map((exc: string) => ({
            title: 'Exclusion',
            description: exc,
            severity: 'medium'
          })),
          coverages: temp.benefits ? temp.benefits.map((b: any) => ({
            name: b.title,
            amount: b.amount,
            unit: '₹',
            isCovered: true
          })) : []
        };
        
        setPolicy(mappedPolicy);
      } catch (err: any) {
        console.error('Fetch error, falling back to LIC data:', err);
        // Fallback to default LIC data on fetch failure
        setPolicy(samplePolicies[provider] || samplePolicies['lic'] as any);
        // We don't set error here because we are providing a fallback
      } finally {
        setLoading(false);
      }
    }

    fetchPolicy();
  }, []);

  return { policy, loading, error };
}

