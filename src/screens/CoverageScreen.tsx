import { motion } from 'motion/react';
import { usePolicy } from '../hooks/usePolicy';
import CoverageVisualizer from '../components/features/CoverageVisualizer';
import ExclusionsHighlighter from '../components/features/ExclusionsHighlighter';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const CoverageScreen = () => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 px-6 max-w-4xl mx-auto pb-32 space-y-8"
    >
      <section className="text-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-widest mb-4">
          Visual Breakdown
        </div>
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Policy Insights</h2>
        <p className="text-on-surface-variant text-sm max-w-xs mx-auto">Get absolute clarity on what's protected in your current plan.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CoverageVisualizer policy={policy} />
        <ExclusionsHighlighter policy={policy} />
      </div>

      <div className="bg-primary-container p-6 rounded-2xl relative overflow-hidden">
        <div className="relative z-10 text-on-primary-container">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={20} />
            <h4 className="font-headline font-bold text-lg">Verified Protection</h4>
          </div>
          <p className="text-sm opacity-90 mb-4 font-medium">Your {policy.insurer} policy has been analyzed by SurePath AI. All limits shown are based on the latest available documents.</p>
        </div>
      </div>
    </motion.main>
  );
};
