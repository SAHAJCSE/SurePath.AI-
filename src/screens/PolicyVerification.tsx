import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, User, ArrowRight, Headphones, BadgeCheck, Calendar, Zap, Loader2, AlertCircle } from 'lucide-react';

export const PolicyVerification = ({ onVerify }: { onVerify: () => void }) => {
  const [policyNumber, setPolicyNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = () => {
    // Basic Validation
    if (!policyNumber.trim()) {
      setError('Please enter your policy number.');
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name as it appears on the policy.');
      return;
    }

    // Clear previous errors
    setError(null);
    setIsVerifying(true);

    // Simulate AI verification process
    setTimeout(() => {
      setIsVerifying(false);
      onVerify();
    }, 2000);
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow pt-24 pb-32 px-6 flex flex-col items-center max-w-2xl mx-auto w-full"
    >
      <div className="w-full mb-10 relative overflow-hidden rounded-3xl bg-surface-container-low p-8 border border-outline-variant/15">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
            {isVerifying ? (
              <Loader2 className="text-primary animate-spin" size={32} />
            ) : (
              <Zap className="text-primary animate-pulse" size={32} />
            )}
          </div>
          <h2 className="text-xl font-headline font-bold text-on-surface mb-2">
            {isVerifying ? 'Verifying Credentials...' : 'Analyzing Policy Intent'}
          </h2>
          <p className="text-sm font-body text-on-surface-variant max-w-xs leading-relaxed">
            {isVerifying 
              ? 'Our AI is cross-referencing your data with the insurer\'s database.' 
              : 'Our AI concierge is ready to cross-reference your credentials with our distributed ledger for instant verification.'}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" style={{ backgroundSize: '200% 100%' }}></div>
      </div>

      <div className="w-full space-y-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Policy Number */}
          <div className="flex flex-col gap-2">
            <label className="font-label font-medium text-[12px] uppercase tracking-widest text-on-surface-variant ml-1">Policy Number</label>
            <div className="relative group">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${policyNumber ? 'text-primary' : 'text-outline'}`} size={20} />
              <input 
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value.toUpperCase())}
                className="w-full h-14 pl-12 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 shadow-sm transition-all outline-none" 
                placeholder="LA-XXXX-XXXXX" 
                type="text"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="font-label font-medium text-[12px] uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
            <div className="relative group">
              <BadgeCheck className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${fullName ? 'text-primary' : 'text-outline'}`} size={20} />
              <input 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-14 pl-12 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant/60 shadow-sm transition-all outline-none" 
                placeholder="Enter full name" 
                type="text"
              />
            </div>
          </div>

          {/* DOB */}
          <div className="flex flex-col gap-2">
            <label className="font-label font-medium text-[12px] uppercase tracking-widest text-on-surface-variant ml-1 flex justify-between">
              Date of Birth
              <span className="lowercase italic font-normal opacity-60 text-[10px]">Optional (for auto-fill)</span>
            </label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
              <input 
                className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface shadow-sm transition-all outline-none" 
                type="date"
              />
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-error-container/20 text-error border border-error/20 text-xs font-bold"
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}

        <div className="flex items-center gap-3 p-4 bg-secondary-container/10 rounded-2xl border border-secondary-container/20">
          <ShieldCheck className="text-secondary shrink-0" size={24} />
          <p className="text-[10px] font-body text-on-surface-variant leading-relaxed">
            Verification is performed over an encrypted channel. Your personal data is cleared immediately after the screening session.
          </p>
        </div>

        <button 
          onClick={handleVerify}
          disabled={isVerifying}
          className={`w-full h-16 bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-on-primary rounded-[1.25rem] font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70`}
        >
          {isVerifying ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Checking Records...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 w-full">
        <div className="col-span-1 p-5 rounded-3xl bg-surface-container-low flex flex-col justify-between border border-outline-variant/10">
          <ShieldCheck className="text-primary mb-6" size={24} />
          <div>
            <h3 className="font-headline font-bold text-on-surface text-sm">Instant Results</h3>
            <p className="text-[10px] text-on-surface-variant mt-1">Verification usually takes less than 3 seconds.</p>
          </div>
        </div>
        <div className="col-span-1 p-5 rounded-3xl bg-surface-container-low flex flex-col justify-between border border-outline-variant/10">
          <Headphones className="text-primary mb-6" size={24} />
          <div>
            <h3 className="font-headline font-bold text-on-surface text-sm">Need Help?</h3>
            <p className="text-[10px] text-on-surface-variant mt-1">Chat with our digital concierge for assistance.</p>
          </div>
        </div>
      </div>
    </motion.main>
  );
};
