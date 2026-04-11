import { motion } from 'motion/react';
import { usePolicy } from '../hooks/usePolicy';
import ScenarioSimulator from '../components/features/ScenarioSimulator';
import { Loader2, Sparkles } from 'lucide-react';

export const SimulatorScreen = () => {
  const { policy, loading, error } = usePolicy();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="pt-24 px-6 text-center">
        <p className="text-error font-bold">Error loading policy: {error || 'No policy found'}</p>
        <p className="text-sm mt-2">Please upload a policy from the home screen.</p>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="pt-24 px-6 max-w-2xl mx-auto pb-32"
    >
      <section className="mb-10 text-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
          Experimental
        </div>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Scenario Simulator</h2>
        <p className="text-on-surface-variant text-sm max-w-xs mx-auto">Test your policy against real-world health scenarios before filing a claim.</p>
      </section>

      <ScenarioSimulator policy={policy} />

      <div className="mt-8 p-6 bg-surface-container-low rounded-3xl border border-outline-variant/30 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
          <Sparkles className="text-primary" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-on-surface">How it works?</h4>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Our simulator uses AI to map your policy's sub-limits, co-payments, and exclusions against typical hospital charges in your city. Results are estimates only.
          </p>
        </div>
      </div>
    </motion.main>
  );
};
