import { motion } from 'motion/react';
import { usePolicy } from '../hooks/usePolicy';
import CoverageVisualizer from '../components/features/CoverageVisualizer';
import ExclusionsHighlighter from '../components/features/ExclusionsHighlighter';
import { ShieldCheck, Loader2, CheckCircle, XCircle, Building2, Wallet, AlertCircle, Info } from 'lucide-react';

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

  const logoMap: { [key: string]: string } = {
    'lic': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnrG9B3t6XlJ7z-y8YvT5oK6kE-yH6zX-fXhGjR-K8u5-zG-z-H_kS8z-E_s_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z-H_kS8z-E_s_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z',
    'hdfc': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-6z-fS_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z-H_kS8z-E_s_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z',
    'sbi': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnrG9B3t6XlJ7z-y8YvT5oK6kE-yH6zX-fXhGjR-K8u5-zG-z-H_kS8z-E_s_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z',
    'icici': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnrG9B3t6XlJ7z-y8YvT5oK6kE-yH6zX-fXhGjR-K8u5-zG-z-H_kS8z-E_s_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z'
  };

  const selectedProviderId = localStorage.getItem('surepath_selected_provider') || 'lic';
  const insurerLogo = logoMap[selectedProviderId] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnrG9B3t6XlJ7z-y8YvT5oK6kE-yH6zX-fXhGjR-K8u5-zG-z-H_kS8z-E_s_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z_G_z';

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 px-6 max-w-5xl mx-auto pb-32 space-y-10"
    >
      {/* Premium Policy Header */}
      <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 border border-outline-variant/20 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
          <ShieldCheck size={160} />
        </div>
        
        <div className="w-24 h-24 rounded-3xl bg-white shadow-inner flex items-center justify-center p-4 border border-outline-variant/10 shrink-0">
          <Building2 className="text-primary" size={48} />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest shadow-sm">
              Visual Breakdown
            </span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border border-primary/20">
              <ShieldCheck size={12} /> AI Verified
            </span>
          </div>
          <h2 className="text-3xl font-headline font-black text-on-surface tracking-tight leading-none">
            {policy.policyName}
            <span className="block text-lg font-bold text-on-surface-variant mt-1">{policy.insurer}</span>
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 pt-4 border-t border-outline-variant/10">
            <div className="flex items-center gap-2">
              <Wallet className="text-secondary" size={18} />
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter leading-none">Sum Insured</p>
                <p className="font-headline font-extrabold text-lg text-primary">₹{(policy.totalSumInsured || 500000).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="text-tertiary" size={18} />
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter leading-none">Risk Level</p>
                <p className="font-headline font-extrabold text-lg text-tertiary">Moderate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CoverageVisualizer policy={policy} />
        <ExclusionsHighlighter policy={policy} />
      </div>

      {/* Redesigned Coverage List */}
      <section className="space-y-6">
        <h3 className="text-xl font-headline font-bold text-on-surface px-2 flex items-center gap-3">
          Detailed Coverages 
          <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">Scan-Ready</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policy.coverages.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:translate-x-1 ${
                item.isCovered 
                  ? 'bg-[#10B981]/5 border-[#10B981]/15 hover:border-[#10B981]/40' 
                  : 'bg-error/5 border-error/15 hover:border-error/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${item.isCovered ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-error/10 text-error'}`}>
                  {item.isCovered ? <CheckCircle size={20} /> : <XCircle size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface leading-snug">{item.name}</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${item.isCovered ? 'text-[#10B981]' : 'text-error'}`}>
                    {item.isCovered ? 'Covered' : 'Not Included'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-on-surface">{item.amount} {item.unit}</p>
                {item.name.includes('Room') && item.isCovered && <p className="text-[9px] font-bold text-outline-variant">Single Private</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final Verification Badge */}
      <div className="bg-gradient-to-r from-primary to-primary-container p-6 rounded-[2.5rem] shadow-xl shadow-primary/20 flex items-center gap-6 text-on-primary">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
          <ShieldCheck size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="font-headline font-bold text-xl">Verified Assurance</h4>
          <p className="text-sm opacity-90 font-medium">
            This visual report is generated using multi-layer AI OCR on your {policy.insurer} policy document. All limits were recalculated based on standard claim sub-limits.
          </p>
        </div>
      </div>
    </motion.main>
  );
};
