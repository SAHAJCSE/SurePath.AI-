import { useState, useEffect } from 'react';
import { ParsedPolicy } from '../types/policy';
import { API_BASE } from '../config';
import { samplePolicies } from '../data/samplePolicies';

export function usePolicy() {
  const [policyData, setPolicyData] = useState<ParsedPolicy | null>(null);
  const [demoPolicyData, setDemoPolicyData] = useState<ParsedPolicy | null>(null);
  const [mode, setMode] = useState<'demo' | 'real'>(
     (localStorage.getItem('surepath_demo_mode') as 'demo' | 'real') || 'real'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolicy() {
      const rawProvider = localStorage.getItem('surepath_selected_provider') || 'lic';
      const provider = rawProvider.toLowerCase().split(' ')[0]; // 'HDFC Life' -> 'hdfc'

      // Pre-load demo data so it's always ready
      setDemoPolicyData((samplePolicies['hdfc'] as any) || samplePolicies['lic']);

      const policyId = localStorage.getItem('surepath_policy_id');

      // Fallback to sample data if no policyId or if it's a demo
      if (!policyId || policyId === 'demo-policy-id') {
        setPolicyData((samplePolicies[provider] as any) || samplePolicies['lic']);
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

        const temp = data.analysis;
        if (!temp) throw new Error('No analysis');

        const insurer =
          temp.policyHolder?.insurer || temp.insurer || provider;
        const policyName =
          temp.policyHolder?.policyType || temp.policyName || 'Insurance Policy';
        const totalSumInsured =
          Number(temp.totalSumInsured) ||
          Number(temp.coverage?.totalCoverage) ||
          0;

        const exclusionsRaw = Array.isArray(temp.exclusions) ? temp.exclusions : [];
        const exclusions = exclusionsRaw.map((exc: any) =>
          typeof exc === 'string'
            ? { title: 'Exclusion', description: exc, severity: 'medium' as const }
            : {
                title: String(exc?.title || 'Exclusion'),
                description: String(exc?.description || ''),
                severity: (exc?.severity as 'high' | 'medium' | 'low') || 'medium',
              },
        );

        let coverages: ParsedPolicy['coverages'] = [];
        if (Array.isArray(temp.coverages) && temp.coverages.length) {
          coverages = temp.coverages.map((c: any) => ({
            name: String(c.name || c.title || 'Coverage'),
            amount: c.amount ?? c.value ?? 0,
            unit: String(c.unit || '₹'),
            isCovered: c.isCovered !== false,
          }));
        } else if (Array.isArray(temp.benefits)) {
          coverages = temp.benefits.map((b: any) => ({
            name: b.title,
            amount: b.amount,
            unit: '₹',
            isCovered: true,
          }));
        }

        const mappedPolicy: ParsedPolicy = {
          ...temp,
          totalSumInsured,
          insurer,
          policyName,
          coverage: temp.coverage || {
            totalCoverage: totalSumInsured,
            accidentalCoverage: 0,
            naturalDeath: 0,
            hospitalization: 0,
            criticalIllness: 0,
          },
          generalConditions: Array.isArray(temp.insights)
            ? temp.insights
            : Array.isArray(temp.generalConditions)
              ? temp.generalConditions
              : [],
          exclusions,
          coverages,
        };

        setPolicyData(mappedPolicy);
      } catch (err: any) {
        console.error('Fetch error, falling back to LIC data:', err);
        setPolicyData((samplePolicies[provider] as any) || samplePolicies['lic']);
      } finally {
        setLoading(false);
      }
    }
    fetchPolicy();

    const onPolicyUpdate = () => fetchPolicy();
    window.addEventListener('surepath_policy_updated', onPolicyUpdate);
    return () => window.removeEventListener('surepath_policy_updated', onPolicyUpdate);
  }, [mode]);

  useEffect(() => {
    const handleModeChange = () => {
       const newMode = (localStorage.getItem('surepath_demo_mode') as 'demo' | 'real') || 'real';
       setMode(newMode);
    };
    window.addEventListener('surepath_mode_toggle', handleModeChange);
    return () => window.removeEventListener('surepath_mode_toggle', handleModeChange);
  }, []);

  const toggleDemoMode = (enableDemo: boolean) => {
    const newMode = enableDemo ? 'demo' : 'real';
    setMode(newMode);
    localStorage.setItem('surepath_demo_mode', newMode);
    window.dispatchEvent(new Event('surepath_mode_toggle'));
  };

  const activePolicy = mode === 'demo' ? demoPolicyData : policyData;

  return { policy: activePolicy, loading: mode === 'demo' ? false : loading, error: mode === 'demo' ? null : error, mode, toggleDemoMode };
}

