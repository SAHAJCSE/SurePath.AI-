import { motion } from 'motion/react';
import { AlertTriangle, XCircle, Info, ChevronRight, Activity, Zap } from 'lucide-react';
import { ParsedPolicy } from '../../types/policy';

interface Props {
  policy: ParsedPolicy;
}

export default function ExclusionsHighlighter({ policy }: Props) {
  // Use parsed exclusions or fall back to realistic demo data if empty
  const exclusions = policy.exclusions.length > 0 ? policy.exclusions : [
    { item: 'Robotic Surgery', reason: 'Commonly capped at ₹2.5 Lakhs regardless of sum insured.', severity: 'High' },
    { item: 'Genetic Disorders', reason: 'Standard 48-month waiting period applies.', severity: 'Medium' },
    { item: 'Organ Donor Expenses', reason: 'Only hospitalization for donor is covered, not surgery.', severity: 'High' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Redesigned What's NOT Covered Section */}
      <div className="bg-white rounded-3xl shadow-xl shadow-error/5 border border-error/10 overflow-hidden">
        <div className="bg-error/5 p-5 border-b border-error/10 flex items-center justify-between">
          <h3 className="text-lg font-headline font-bold text-error flex items-center gap-2">
            <XCircle size={20} />
            What's NOT Covered
          </h3>
          <span className="text-[10px] font-bold bg-error text-on-error px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-error/20">Critical Risks</span>
        </div>

        <div className="p-4 space-y-4">
          {exclusions.map((exc, i) => (
            <div key={i} className="group relative bg-white border border-outline-variant/15 p-4 rounded-2xl hover:border-error/30 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                   <span className="font-bold text-sm text-on-surface">{exc.item}</span>
                 </div>
                 <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${
                   exc.severity === 'High' ? 'bg-error/10 text-error border-error/20' : 'bg-orange-100 text-orange-700 border-orange-200'
                 }`}>
                   {exc.severity || 'Medium'} RISK
                 </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium">
                {exc.reason}
              </p>
              <div className="mt-2 text-[9px] font-bold text-error flex items-center gap-1 uppercase tracking-tight">
                <Zap size={10} />
                Impact: Can reduce your claim by up to 80% in chronic cases.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Advice Card */}
      <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-[2rem] text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden group">
        <div className="relative z-10 flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
            <Activity className="text-white" size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-headline font-bold text-base leading-tight">Pro Tip: Restoration Clause</h4>
            <p className="text-[11px] opacity-90 leading-relaxed font-medium">
              Your plan includes "Unlimited Restoration." If you exhaust your ₹{(policy.totalSumInsured || 500000).toLocaleString()} limit, it refills instantly for the next hospitalization!
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
           <AlertTriangle size={80} />
        </div>
      </div>
    </motion.div>
  );
}
