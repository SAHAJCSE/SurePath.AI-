import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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

interface StrictClaimResult {
    status: 'APPROVED' | 'REJECTED' | 'UNCERTAIN';
    approvalChance: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    reason: string;
    detailedAnalysis?: string;
    keyFactors?: string[];
    userAdvice?: string;
}

const CLAIM_ANALYST_INSTRUCTIONS = `You are an expert health insurance claim analyst AI.

Your task is to evaluate whether a user's claim will be approved based on their described medical situation and the provided insurance policy.

Think like a real insurance company reviewer — strict, realistic, and policy-driven.

INPUT:
- User's medical situation (free text)
- Policy details (coverage, exclusions, waiting period, sum insured)

OUTPUT (STRICT JSON FORMAT):
{
  "status": "APPROVED | REJECTED | UNCERTAIN",
  "approvalChance": number (0-100),
  "riskLevel": "Low | Medium | High",
  "reason": "Clear, simple explanation in 1–2 lines",
  "detailedAnalysis": "Short paragraph explaining decision using policy terms",
  "keyFactors": [
    "Factor 1",
    "Factor 2",
    "Factor 3"
  ],
  "userAdvice": "What user should do next (e.g., documents, precautions)"
}

DECISION LOGIC:
- Accidents -> HIGH approval chance unless explicitly excluded
- Pre-existing diseases -> Check waiting period strictly
- Recent policy (< waiting period) -> Increase rejection probability
- Cosmetic / non-medical / excluded treatments -> REJECT
- Missing or unclear info -> mark as UNCERTAIN (not APPROVED)

TONE:
- Simple, human-friendly (like explaining to a normal user)
- Avoid technical jargon unless needed
- Be honest — do NOT overpromise approval

IMPORTANT:
- Output must ALWAYS be valid JSON
- No extra text outside JSON`;

function isLegacyResult(data: any): data is ClaimResult {
    return Boolean(data?.claim_status && typeof data?.approval_chance !== 'undefined');
}

function isStrictResult(data: any): data is StrictClaimResult {
    return Boolean(data?.status && typeof data?.approvalChance !== 'undefined');
}

function normalizeClaimResult(data: any): ClaimResult | null {
    if (isLegacyResult(data)) {
        return {
            claim_status: data.claim_status,
            approval_chance: Number(data.approval_chance) || 0,
            risk_level: data.risk_level,
            reason: String(data.reason || 'Analysis complete.')
        };
    }

    if (isStrictResult(data)) {
        const mappedStatus: ClaimResult['claim_status'] =
            data.status === 'APPROVED' ? 'approved' : data.status === 'REJECTED' ? 'rejected' : 'partial';

        const mappedRisk: ClaimResult['risk_level'] =
            data.riskLevel === 'Low' ? 'low' : data.riskLevel === 'High' ? 'high' : 'medium';

        return {
            claim_status: mappedStatus,
            approval_chance: Math.max(0, Math.min(100, Math.round(Number(data.approvalChance) || 0))),
            risk_level: mappedRisk,
            reason: String(data.reason || 'Analysis complete.')
        };
    }

    return null;
}

export const ClaimCheckerScreen = () => {
    const { policy, loading: policyLoading } = usePolicy();
    const [scenario, setScenario] = useState('Major Surgery');
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
                    policy: policy,
                    provider,
                    analystInstructions: CLAIM_ANALYST_INSTRUCTIONS
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            if (data.result) {
                const normalizedResult = normalizeClaimResult(data.result);
                if (normalizedResult) {
                    setResult(normalizedResult);
                } else {
                    setResult(demoResult(scenario, policy));
                }
            } else {
                setResult(demoResult(scenario, policy));
            }
        } catch (err: any) {
            console.error('Claim check failed:', err);
            setError('Using demo mode (server offline)');
            setResult(demoResult(scenario, policy!));
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
            className="pt-20 pb-28 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 sm:space-y-8"
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-error/10 border border-error/30 rounded-2xl p-4 mb-6 backdrop-blur-sm flex items-center gap-3 text-error text-sm font-medium"
                        >
                            <AlertCircle size={20} />
                            <span>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="ml-auto px-4 py-1 bg-error/80 text-on-error text-xs font-black uppercase tracking-wider rounded-xl hover:bg-error transition-all"
                            >
                                × Dismiss
                            </button>
                        </motion.div>
                    )}

                    {result && (
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

            <style>{`
                @keyframes pulse-glow {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.7; }
                }
            `}</style>
        </motion.main>
    );
};

function demoResult(scenario: string, policy: ParsedPolicy): ClaimResult {
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
            reason: 'Accidental injuries fully covered with no waiting period.'
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
