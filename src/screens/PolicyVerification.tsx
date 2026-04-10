import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, User, ArrowRight, Headphones, BadgeCheck, Calendar, Zap } from 'lucide-react';

export const PolicyVerification = ({ onVerify }: { onVerify: () => void }) => (
  <motion.main 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex-grow pt-24 pb-32 px-6 flex flex-col items-center max-w-2xl mx-auto w-full"
  >
    <div className="w-full mb-10 relative overflow-hidden rounded-xl bg-surface-container-low p-8 border border-outline-variant/15">
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
          <Zap className="text-primary animate-pulse" size={32} />
        </div>
        <h2 className="text-xl font-headline font-bold text-on-surface mb-2">Analyzing Policy Intent</h2>
        <p className="text-sm font-body text-on-surface-variant max-w-xs leading-relaxed">
          Our AI concierge is ready to cross-reference your credentials with our distributed ledger for instant verification.
        </p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" style={{ backgroundSize: '200% 100%' }}></div>
    </div>

    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-label font-medium text-[12px] uppercase tracking-widest text-on-surface-variant ml-1">Policy Number</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input 
              className="w-full h-14 pl-12 bg-surface-container-lowest border-none rounded-xl focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline-variant/60 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.03)] transition-all" 
              placeholder="LA-XXXX-XXXXX" 
              type="text"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label font-medium text-[12px] uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
          <div className="relative group">
            <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input 
              className="w-full h-14 pl-12 bg-surface-container-lowest border-none rounded-xl focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline-variant/60 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.03)] transition-all" 
              placeholder="As it appears on document" 
              type="text"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label font-medium text-[12px] uppercase tracking-widest text-on-surface-variant ml-1 flex justify-between">
            Date of Birth
            <span className="lowercase italic font-normal opacity-60">Optional</span>
          </label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input 
              className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border-none rounded-xl focus:ring-1 focus:ring-primary text-on-surface shadow-[0_4px_12px_-2px_rgba(0,0,0,0.03)] transition-all" 
              type="date"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-secondary-container/10 rounded-xl">
        <ShieldCheck className="text-secondary" size={24} />
        <p className="text-xs font-body text-on-secondary-fixed-variant leading-tight">
          Verification is performed over an encrypted channel. Your personal data is never stored during the screening process.
        </p>
      </div>

      <button 
        onClick={onVerify}
        className="w-full h-16 bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-on-primary rounded-xl font-headline font-bold text-lg shadow-[0_12px_24px_-4px_rgba(0,61,155,0.25)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
      >
        <span>Verify Policy</span>
        <ArrowRight size={20} />
      </button>
    </div>

    <div className="mt-12 grid grid-cols-2 gap-4 w-full">
      <div className="col-span-1 p-5 rounded-2xl bg-surface-container-low flex flex-col justify-between">
        <ShieldCheck className="text-primary mb-6" size={24} />
        <div>
          <h3 className="font-headline font-bold text-on-surface text-sm">Instant Results</h3>
          <p className="text-[10px] text-on-surface-variant mt-1">Verification usually takes less than 3 seconds.</p>
        </div>
      </div>
      <div className="col-span-1 p-5 rounded-2xl bg-surface-container-low flex flex-col justify-between">
        <Headphones className="text-primary mb-6" size={24} />
        <div>
          <h3 className="font-headline font-bold text-on-surface text-sm">Need Help?</h3>
          <p className="text-[10px] text-on-surface-variant mt-1">Chat with our digital concierge for assistance.</p>
        </div>
      </div>
    </div>
  </motion.main>
);
