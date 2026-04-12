import { motion } from 'motion/react';
import { Target } from 'lucide-react';

interface ResultParams {
  estimatedPayout: number;
  totalBill: number;
  deductible: number;
  outOfPocket: number;
  probability: string;
}

interface Props {
  result: ResultParams;
}

export default function FinancialImpactCard({ result }: Props) {
  const coverPct = Math.min(100, (result.estimatedPayout / result.totalBill) * 100) || 0;
  const oopPct = Math.min(100, (result.outOfPocket / result.totalBill) * 100) || 0;
  
  const isHighRisk = oopPct > 30;

  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">
            Total Estimated Bill
          </p>
          <h4 className="text-3xl font-headline font-black text-on-surface">
            ₹{result.totalBill.toLocaleString()}
          </h4>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#10B981] mb-1 flex items-center gap-1">
            <Target size={12} /> Insurance Covers
          </p>
          <h4 className="text-4xl font-headline font-black text-[#10B981]">
            ₹{result.estimatedPayout.toLocaleString()}
          </h4>
        </div>
        <div className="flex-1">
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${isHighRisk ? 'text-[#EF4444]' : 'text-on-surface-variant'}`}>
            Out of Pocket
          </p>
          <h4 className={`text-3xl font-headline font-black ${isHighRisk ? 'text-[#EF4444]' : 'text-on-surface'}`}>
            ₹{result.outOfPocket.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Stacked Progress Bar */}
      <div className="space-y-2 relative">
        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
          <span>{coverPct.toFixed(0)}% Covered</span>
          {isHighRisk && <span className="text-[#EF4444] animate-pulse">High OOP Cost 😬</span>}
        </div>
        <div className="w-full h-4 bg-outline-variant/20 rounded-full overflow-hidden flex shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${coverPct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-[#10B981]"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((result.deductible / result.totalBill) * 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="h-full bg-[#F59E0B]"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(Math.max(0, result.outOfPocket - result.deductible) / result.totalBill) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            className="h-full bg-[#EF4444]"
          />
        </div>
        <div className="flex gap-4 pt-3 justify-center md:justify-start">
          <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Covered
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Deductibles
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Self Pay
          </div>
        </div>
      </div>
    </div>
  );
}
