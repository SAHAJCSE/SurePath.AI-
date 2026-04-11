import { motion, AnimatePresence } from 'motion/react';
import { Languages, ShieldCheck, CheckCircle, X } from 'lucide-react';

export const TranslationConsent = ({ onAccept, onCancel }: { onAccept: () => void; onCancel: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-white/10"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
          <Languages size={32} />
        </div>
        
        <h3 className="text-2xl font-headline font-black text-on-surface mb-3 leading-tight">
          Translation Permission Needed
        </h3>
        
        <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-8">
          To provide a seamless <span className="text-primary font-bold">Hindi</span> experience, SurePath AI uses a proprietary <span className="text-primary font-bold">AI-Powered Plain Language Engine</span>. This engine simplifies complex policy legal-speak into clear, understandable Hindi for you.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[#10B981]/5 rounded-xl border border-[#10B981]/10 text-[#10B981]">
            <ShieldCheck size={18} />
            <span className="text-xs font-bold">Privacy: Document data stays encrypted.</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#10B981]/5 rounded-xl border border-[#10B981]/10 text-[#10B981]">
            <CheckCircle size={18} />
            <span className="text-xs font-bold">Safe: No permanent data is shared.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
           <button 
             onClick={onAccept}
             className="w-full h-14 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-95"
           >
             Yes, Grant Permission
           </button>
           <button 
             onClick={onCancel}
             className="w-full h-14 bg-surface-container-low text-on-surface-variant rounded-2xl font-bold text-sm"
           >
             Cancel
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
