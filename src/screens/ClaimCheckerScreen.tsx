import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { usePolicy } from '../hooks/usePolicy';
import { API_BASE } from '../config';
import { ClaimInputCard } from '../components/features/claim-checker/ClaimInputCard';
import { ClaimResultCard } from '../components/features/claim-checker/ClaimResultCard';
import { Loader2, AlertCircle, BrainCircuit } from 'lucide-react';
import { ParsedPolicy } from '../types/policy';

interface ClaimResult {
    claim_status: 'approved' | 'partial' | 'rejected';
    approval_chance: number;
    risk_level: 'low' | 'medium' | 'high';
    reason: string;
}

export const ClaimCheckerScreen = () => {
    const { policy, loading: policyLoading } = usePolicy();
    const [scenario, setScenario] = useState('');
    const [result, setResult] = useState<ClaimResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!scenario.trim()) {
            setError('Please describe your medical situation.');
            return;
        }

        if (!policy) {
            setError('Please upload a policy first from Home screen.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const policyId = localStorage.getItem('surepath_policy_id') || 'demo-policy-id';
            const provider = localStorage.getItem('surepath_selected_provider') || 'LIC';

            const response = await fetch(`${API_BASE}/api/check-claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    policyId,
                    scenario,
                    policy: policy, // Send full policy data
                    provider
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            if (data.result) {
                setResult(data.result);
            } else {
                // Demo fallback
                setResult(demoResult(scenario, policy));
            }
        } catch (err: any) {
            console.error('Claim check failed:', err);
            setError('Analysis failed. Using demo mode. Check server connection.');
            setResult(demoResult(scenario, policy || null));
        } finally {
            setLoading(false);
        }
    }, [scenario, policy]);

    const clearResult = () => {
        setResult(null);
        setError(null);
        setScenario('');
    };

    if (policyLoading) {
        return (
            <div className="pt-24 px-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={48} />
                    <p className="text-on-surface font-semibold">Loading your policy...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-32 px-6 max-w-4xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center text-on-primary shadow-lg">
                    <BrainCircuit size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-headline font-black text-on-surface">
                        Claim Approval <span className="text-primary">Checker</span>
                    </h1>
                    <p className="text-on-surface-variant leading-relaxed">
                        Instantly know if your claim will be approved. AI analyzes your exact policy terms.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Card */}
                <ClaimInputCard
                    scenario={scenario}
                    onScenarioChange={setScenario}
                    onSubmit={handleSubmit}
                    loading={loading}
                />

                {/* Result Card */}
                <div className="lg:col-span-1">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-error/5 border border-error/20 rounded-[2.5rem] p-8 text-error"
                        >
                            <AlertCircle size={48} className="mx-auto mb-4 opacity-75" />
                            <h4 className="font-headline font-black text-xl mb-3 text-center">Oops!</h4>
                            <p className="text-sm leading-relaxed mb-6">{error}</p>
                            <button
                                onClick={clearResult}
                                className="w-full h-12 bg-error text-on-error font-black uppercase tracking-wider rounded-2xl hover:bg-error/90 transition-all shadow-lg"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}

                    {!loading && !error && (
                        <ClaimResultCard result={result} loading={false} />
                    )}
                </div>
            </div>

            {/* Policy Footer */}
            {!policyLoading && policy && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 text-center"
                >
                    <p className="text-sm text-on-surface-variant mb-2">
                        Analyzing policy: <span className="font-bold text-primary">{policy.insurer} {policy.policyName}</span>
                    </p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Sum Insured: ₹{(policy.totalSumInsured / 100000).toFixed(0)} Lakh
                    </p>
                </motion.div>
            )}

            <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
        </motion.main>
    );
};

// Demo fallback for no API key/server
function demoResult(scenario: string, policy: ParsedPolicy | null): ClaimResult {
    const lowerScenario = scenario.toLowerCase();

    if (lowerScenario.includes('diabetes') || lowerScenario.includes('first year') || lowerScenario.includes('pre-existing')) {
        return {
            claim_status: 'rejected',
            approval_chance: 10,
            risk_level: 'high',
            reason: 'Waiting period not completed for pre-existing conditions (typically 24-48 months).'
        };
    }

    if (lowerScenario.includes('accident')) {
        return {
            claim_status: 'approved',
            approval_chance: 95,
            risk_level: 'low',
            reason: 'Accidental injuries are fully covered with no waiting period.'
        };
    }

    if (lowerScenario.includes('surgery') || lowerScenario.includes('icu')) {
        return {
            claim_status: 'partial',
            approval_chance: 65,
            risk_level: 'medium',
            reason: 'Room rent limits and non-covered consumables may reduce payout.'
        };
    }

    return {
        claim_status: 'partial',
        approval_chance: 70,
        risk_level: 'medium',
        reason: 'Covered within limits. Check policy for room rent caps and exclusions.'
    };
}

