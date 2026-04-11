import { useState, useEffect } from 'react';
import { ParsedPolicy } from '../types/policy';
import { API_BASE } from '../config';

export function usePolicy() {
  const [policy, setPolicy] = useState<ParsedPolicy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolicy() {
      const policyId = localStorage.getItem('surepath_policy_id');
      if (!policyId) return;

      const provider = localStorage.getItem('surepath_selected_provider') || '';

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/policy/parse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ policyId, provider }),
        });

        if (!res.ok) throw new Error('Failed to parse policy');
        const data = await res.json();
        setPolicy(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPolicy();
  }, []);

  return { policy, loading, error };
}
