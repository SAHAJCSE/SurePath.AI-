import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, Zap, Target } from 'lucide-react';

interface ClaimResult {
    claim_status: 'approved' | 'partial' | 'rejected';
    approval_chance: number;
    risk_level: 'low' | 'medium' | 'high';
    reason: string;
}

interface Props {
    result: ClaimResult | null;
    loading?: boolean;
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'approved':
            return {
                emoji: '🟢', color: 'text-[#10B981]', bg: 'bg-[#10B981]/5 border-[#10B981]/20', icon: ShieldCheck
            };
        case 'partial':
            return {
                emoji: '🟡', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/5 border-[#F59E0B]/20', icon: Target
            };
        case 'rejected':
            return {
                emoji: '🔴', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/5 border-[#EF4444]/20', icon: AlertTriangle
            };
        default:
            return { emoji: '❓', color: 'text-on-surface-variant', bg: 'bg-outline-variant/20 border-outline-variant/30', icon: Zap };
    }
};

const getRiskConfig = (risk: string) => {
    switch (risk) {
        case 'low': return { color: 'text-[#10B981]', label: 'Low Risk' };
        case 'medium': return { color: 'text-[#F59E0B]', label: 'Medium Risk' };
        case 'high': return { color: 'text-[#EF4444]', label: 'High Risk' };
        default: return { color: 'text-on-surface-variant', label: 'Unknown' };
    }
};

export const ClaimResultCard = ({ result, loading = false }: Props) => {
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface-container-lowest rounded-2xl lg:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 border border-outline-variant/20 shadow-xl shadow-primary/5 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] text-center"
            >
                <Zap className="animate-spin text-primary mb-4" size={48} />
                <div className="space-y-2">
                    <h3 className="text-xl font-headline font-black text-on-surface">AI Analysis</h3>
                    <p className="text-on-surface-variant">Analyzing your scenario against policy terms...</p>
                </div>
            </motion.div>
        );
    }

    if (!result) {
        return null;
    }

    const statusConfig = getStatusConfig(result.claim_status);
    const riskConfig = getRiskConfig(result.risk_level);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl lg:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 border shadow-lg sm:shadow-xl shadow-primary/5 overflow-hidden ${statusConfig.bg}`}
        >
            {/* Status Header */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white to-surface-container-low rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                <statusConfig.icon size={24} sm:size={28} className={`${statusConfig.color} drop-shadow-lg`} />
            </div>

            {/* Main Content */}
            <div className="relative pl-20 sm:pl-24 space-y-4 sm:space-y-6 pt-3 sm:pt-4">
                {/* Status Badge */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg tracking-wider border-2 sm:border-3 lg:border-4 shadow-lg sm:shadow-2xl ${statusConfig.color} ${statusConfig.bg}`}
                >
                    <span className="text-xl sm:text-2xl">{statusConfig.emoji}</span>
                    {result.claim_status.toUpperCase()}
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/30 backdrop-blur-sm border border-white/20">
                        <p className="text-xs sm:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Approval Chance</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-2xl sm:text-3xl font-headline font-black text-on-surface">{result.approval_chance}%</span>
                            <span className="text-xs sm:text-sm font-bold text-on-surface-variant">Chance</span>
                        </div>
                    </div>

                    <div className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/30 backdrop-blur-sm border border-white/20">
                        <p className="text-xs sm:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Risk Level</p>
                        <motion.span
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className={`text-sm sm:text-base lg:text-xl font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border-2 sm:border-4 ${riskConfig.color} bg-white/20`}
                        >
                            {riskConfig.label}
                        </motion.span>
                    </div>
                </div>

                {/* AI Explanation */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/30">
                    <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-container rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 text-on-primary shadow-lg">
                            <Zap className="size-4 sm:size-5" />
                        </div>
                        <div>
                            <h4 className="font-headline font-black text-on-surface text-base sm:text-lg mb-1">Why This Result?</h4>
                            <p className="text-xs sm:text-[10px] font-bold uppercase tracking-widest text-primary">AI Policy Analysis</p>
                        </div>
                    </div>
                    <p className="text-on-surface leading-relaxed text-sm sm:text-base font-medium">
                        {result.reason}
                    </p>
                </div>

                {/* Action CTA */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-14 bg-white/80 hover:bg-white text-primary font-black text-sm uppercase tracking-widest rounded-2xl border-2 border-primary/30 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm flex items-center justify-center gap-2"
                >
                    <ShieldCheck size={20} />
                    Save This Analysis
                </motion.button>
            </div>
        </motion.div>
    );
};

