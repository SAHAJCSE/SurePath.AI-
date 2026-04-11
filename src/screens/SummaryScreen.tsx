import { motion } from 'motion/react';
import { usePolicy } from '../hooks/usePolicy';
import { Loader2, BrainCircuit, ShieldCheck, Zap, Info, ArrowRight } from 'lucide-react';

export const SummaryScreen = () => {
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-6 max-w-5xl mx-auto space-y-8"
    >
      <section className="space-y-2">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs font-bold uppercase tracking-widest">
          AI Analysis Complete
        </div>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface leading-tight">
          {policy.policyName} <span className="bg-gradient-to-br from-[#003d9b] to-[#0052cc] bg-clip-text text-transparent">Overview.</span>
        </h2>
        <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-md">
          Insights extracted from your {policy.insurer} policy document.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sum Insured Card */}
        <div className="md:col-span-7 bg-primary p-8 rounded-3xl text-on-primary flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-on-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-on-primary rounded-full border-t-transparent animate-spin-slow"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Sum Insured</span>
              <span className="font-headline text-2xl font-extrabold text-on-primary text-center">₹{policy.totalSumInsured.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="font-headline text-xl font-bold">Comprehensive Coverage</h3>
            <p className="text-sm text-on-primary/80 leading-relaxed">Your policy provides a solid foundation with ₹{policy.totalSumInsured.toLocaleString()} total sum insured. Excellent for mid-tier hospitalizations.</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1.5 rounded-xl bg-on-primary text-primary font-bold text-[10px] uppercase">Active Plan</span>
              <span className="px-3 py-1.5 rounded-xl bg-on-primary/10 text-on-primary border border-on-primary/20 font-bold text-[10px] uppercase">{policy.insurer}</span>
            </div>
          </div>
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* AI Score Card */}
        <div className="md:col-span-5 bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between border border-outline-variant/30">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-on-surface">Analysis Depth</h3>
              <BrainCircuit className="text-primary" size={24} />
            </div>
            <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[85%] rounded-full"></div>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">We've identified {policy.coverages.length} coverage points and {policy.exclusions.length} exclusions.</p>
          </div>
          <div className="pt-6 flex items-center gap-2">
            <Zap className="text-secondary" size={16} fill="currentColor" />
            <span className="font-label text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em]">SurePath Verified</span>
          </div>
        </div>

        {/* Coverage Highlights */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {policy.coverages.slice(0, 3).map((item, idx) => (
            <div key={idx} className="bg-surface-container-lowest rounded-3xl p-6 space-y-4 border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-2xl bg-secondary-container/20 text-secondary flex items-center justify-center`}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wide">{item.name}</h4>
                <p className="font-headline text-2xl font-black mt-1 text-primary">
                  {typeof item.amount === 'number' ? `₹${item.amount.toLocaleString()}` : item.amount}
                </p>
                <p className="text-[10px] font-bold text-on-surface-variant opacity-60">UNIT: {item.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.isCovered ? 'bg-secondary' : 'bg-error'}`} />
                <span className="text-xs font-bold text-on-surface-variant">{item.isCovered ? 'Active Coverage' : 'Not Covered'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Exclusions Summary */}
        <div className="md:col-span-8 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error">
               <Info size={24} />
            </div>
            <h3 className="font-headline font-bold text-xl">Critical Exclusions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {policy.exclusions.slice(0, 4).map((item, i) => (
              <div key={i} className="p-4 bg-surface-container-low rounded-2xl border-l-4 border-error/30">
                <p className="font-bold text-sm text-on-surface">{item.title}</p>
                <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Network Hospital CTA */}
        <div className="md:col-span-4 bg-on-surface rounded-3xl p-8 text-on-primary-container flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary">
                <ShieldCheck size={28} />
             </div>
             <div>
                <h4 className="font-headline font-bold text-lg leading-tight">Find Network Hospitals</h4>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">Access 12,000+ cashless facilities across {policy.insurer}'s network.</p>
             </div>
          </div>
          <button className="w-full mt-6 py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all">
            Open Maps
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </motion.main>
  );
};
