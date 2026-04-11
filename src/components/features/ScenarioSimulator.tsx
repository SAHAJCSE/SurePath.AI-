import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Calculator, AlertCircle, CheckCircle2, Info, ChevronRight, MapPin, Activity, Building2 } from 'lucide-react';
import { ParsedPolicy } from '../../types/policy';

interface Props {
  policy: ParsedPolicy;
}

export default function ScenarioSimulator({ policy }: Props) {
  const [age, setAge] = useState(35);
  const [cityTier, setCityTier] = useState<'Tier-1' | 'Tier-2' | 'Tier-3'>('Tier-1');
  const [disease, setDisease] = useState('Critical Illness');
  const [hospitalType, setHospitalType] = useState('Network');
  const [result, setResult] = useState<null | { estimatedClaim: number; probability: string; advice: string }>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    // Mimicking the API logic on the client for immediate demo if backend is not updated
    // or we could call a real endpoint if we add it to the server.
    // For now, let's use a robust local simulation logic.
    setTimeout(() => {
      let baseClaim = (policy.totalSumInsured || 500000) * 0.2;
      const d = disease.toLowerCase();
      if (d.includes('dengue') || d.includes('fever')) baseClaim = 65000;
      if (d.includes('cancer') || d.includes('heart') || d.includes('critical')) baseClaim = 350000;
      if (d.includes('accident') || d.includes('fracture')) baseClaim = 120000;
      
      if (cityTier === 'Tier-1') baseClaim *= 1.35;
      if (hospitalType === 'Non-Network') baseClaim *= 0.75;
      if (age > 60) baseClaim *= 1.25;

      const estimatedClaim = Math.min(baseClaim, policy.totalSumInsured || 500000);
      const probValue = estimatedClaim / (policy.totalSumInsured || 1);
      const probability = probValue > 0.8 ? 'Low' : probValue > 0.4 ? 'Medium' : 'High';
      const advice = probability === 'High' 
        ? 'Most costs appear covered. Stick to network hospitals for a seamless cashless experience.' 
        : 'Potential out-of-pocket expenses. Review sub-limits and co-payment clauses in your documents.';

      setResult({ estimatedClaim, probability, advice });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-headline font-bold flex items-center gap-2 text-primary">
          <span>🔮</span> Claim Simulator
        </h3>
        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">AI Powered</span>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                Age: <span className="text-primary font-headline text-sm">{age} years</span>
              </label>
            </div>
            <input 
              type="range" 
              min={18} 
              max={80} 
              value={age} 
              onChange={e => setAge(Number(e.target.value))} 
              className="w-full accent-primary h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
              <MapPin size={12} /> City Tier
            </label>
            <div className="flex gap-2">
              {['Tier-1', 'Tier-2', 'Tier-3'].map(tier => (
                <button
                  key={tier}
                  onClick={() => setCityTier(tier as any)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    cityTier === tier 
                    ? 'bg-primary text-on-primary border-primary shadow-md' 
                    : 'bg-surface text-on-surface border-outline-variant hover:border-primary/50'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
              <Activity size={12} /> Condition
            </label>
            <input 
              type="text" 
              value={disease} 
              onChange={e => setDisease(e.target.value)} 
              placeholder="e.g., Dengue, Accident, Surgery"
              className="w-full border border-outline-variant rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
              <Building2 size={12} /> Hospital
            </label>
            <select 
              value={hospitalType} 
              onChange={e => setHospitalType(e.target.value)} 
              className="w-full border border-outline-variant rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface appearance-none"
            >
              <option value="Network">🔥 Network (Cashless)</option>
              <option value="Non-Network">Non-Network (Reimbursement)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleSimulate} 
          disabled={loading} 
          className="w-full bg-primary text-on-primary font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-primary-container active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-70"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              <span>Analyzing Scenario...</span>
            </div>
          ) : (
            <>
              <Calculator size={20} />
              Estimate Claim Success
            </>
          )}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-6 bg-primary/5 border border-primary/10 rounded-2xl relative">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Estimated Payout</p>
                      <h4 className="text-3xl font-headline font-extrabold text-primary">₹{result.estimatedClaim.toLocaleString()}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Success Probability</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mt-1 shadow-sm ${
                        result.probability === 'High' ? 'bg-secondary text-on-secondary' : 
                        result.probability === 'Medium' ? 'bg-tertiary-fixed text-on-tertiary-container' : 
                        'bg-error text-on-error'
                      }`}>
                        {result.probability === 'High' ? <CheckCircle2 size={12} /> : 
                         result.probability === 'Medium' ? <Info size={12} /> : 
                         <AlertCircle size={12} />}
                        {result.probability} Probability
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm">
                    <div className="mt-1"><ChevronRight size={18} className="text-primary" /></div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {result.advice}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
