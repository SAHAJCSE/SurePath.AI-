import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  MapPin, 
  Activity, 
  Building2, 
  Wallet, 
  Stethoscope, 
  TrendingUp, 
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ParsedPolicy } from '../../types/policy';
import { API_BASE } from '../../config';

interface Props {
  policy: ParsedPolicy;
}

const CONDITIONS = [
  { id: 'dengue', name: 'Dengue / Malaria', baseCost: 75000, icon: '🦟' },
  { id: 'heart', name: 'Heart Attack', baseCost: 450000, icon: '❤️' },
  { id: 'cancer', name: 'Cancer Treatment', baseCost: 850000, icon: '🎗️' },
  { id: 'knee', name: 'Knee Replacement', baseCost: 350000, icon: '🦿' },
  { id: 'mat', name: 'Maternity', baseCost: 120000, icon: '👶' },
  { id: 'covid', name: 'COVID-19', baseCost: 200000, icon: '🧪' },
  { id: 'accident', name: 'Major Accident', baseCost: 300000, icon: '🚑' },
];

export default function ScenarioSimulator({ policy }: Props) {
  const [age, setAge] = useState(35);
  const [cityTier, setCityTier] = useState<'Tier-1' | 'Tier-2' | 'Tier-3'>('Tier-1');
  const [conditionId, setConditionId] = useState('dengue');
  const [hospitalType, setHospitalType] = useState('Network');
  const [expectedBill, setExpectedBill] = useState(75000);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    estimatedPayout: number;
    probability: 'High' | 'Medium' | 'Low';
    probPercent: number;
    totalBill: number;
    deductible: number;
    outOfPocket: number;
    risks: string[];
    advice: string[];
  }>(null);

  const handleSimulate = async () => {
    setLoading(true);
    setResult(null);

    const condition = CONDITIONS.find(c => c.id === conditionId) || CONDITIONS[0];
    const totalBill = expectedBill;

    try {
      const res = await fetch(`${API_BASE}/api/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          policyData: policy,
          scenario: {
            hospitalBill: totalBill,
            accident: condition.id === 'accident',
            hospitalType,
            cityTier,
            age
          }
        })
      });

      if (!res.ok) throw new Error('Simulation API failed');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Simulation failed. Please try again or fallback to standard estimation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-xl shadow-primary/5 border border-outline-variant/20 overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 p-6 border-b border-primary/10">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-2xl font-headline font-extrabold text-primary flex items-center gap-3">
            <span className="bg-primary/10 p-2 rounded-xl text-xl">🔮</span>
            Claim Simulator
          </h3>
          <span className="text-[10px] font-bold bg-primary text-on-primary px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">Pro Feature</span>
        </div>
        <p className="text-xs text-on-surface-variant font-medium opacity-80">
          Based on <span className="text-primary font-bold">{policy.policyName || 'Your Policy'}</span> data
        </p>
      </div>

      <div className="p-6 space-y-8">
        {!result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Condition Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                  <Stethoscope size={14} className="text-primary" /> Select Condition
                </label>
                <div className="relative">
                  <select 
                    value={conditionId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setConditionId(id);
                      setExpectedBill(CONDITIONS.find(c => c.id === id)?.baseCost || 75000);
                    }}
                    className="w-full h-14 bg-surface-container-low border border-outline-variant/20 rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                  >
                    {CONDITIONS.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-outline pointer-events-none" size={18} />
                </div>
              </div>

              {/* Bill Estimator */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                  <Wallet size={14} className="text-primary" /> Hospital Bill (₹)
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-outline">₹</span>
                  <input 
                    type="number"
                    value={expectedBill}
                    onChange={(e) => setExpectedBill(Number(e.target.value))}
                    className="w-full h-14 pl-8 bg-surface-container-low border border-outline-variant/20 rounded-2xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              {/* Age Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                     Age
                  </label>
                  <span className="bg-primary/10 text-primary rounded-lg px-2 py-0.5 text-sm font-bold">{age} yrs</span>
                </div>
                <input 
                  type="range" min={18} max={85} value={age} 
                  onChange={e => setAge(Number(e.target.value))} 
                  className="w-full accent-primary h-1.5 bg-surface-container-low rounded-lg appearance-none cursor-pointer" 
                />
              </div>

              {/* Hospital Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                  <Building2 size={14} className="text-primary" /> Hospital Network
                </label>
                <div className="flex bg-surface-container-low p-1 rounded-2xl border border-outline-variant/10">
                  {['Network', 'Non-Network'].map(type => (
                    <button
                      key={type}
                      onClick={() => setHospitalType(type)}
                      className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                        hospitalType === type ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleSimulate} 
              disabled={loading} 
              className="w-full bg-primary text-on-primary h-16 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-primary/20 disabled:opacity-70 group"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <Sparkles size={20} className="group-hover:animate-pulse" />
                  <span>Execute AI Simulation</span>
                </>
              )}
            </button>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Main Result Card */}
              <div className="flex flex-col md:flex-row gap-6 items-center bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-outline-variant/20" />
                    <circle 
                      cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="9" fill="transparent" 
                      strokeDasharray={364.4}
                      strokeDashoffset={364.4 - (364.4 * result.probPercent) / 100}
                      strokeLinecap="round"
                      className={`transition-all duration-1000 ease-out ${
                        result.probability === 'High' ? 'text-[#10B981]' : 
                        result.probability === 'Medium' ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                      }`}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-extrabold">{result.probPercent}%</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-outline-variant">Success</span>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Estimated Net Payout</p>
                  <h4 className="text-5xl font-headline font-black text-[#10B981]">₹{result.estimatedPayout.toLocaleString()}</h4>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                    <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-[10px] font-bold flex items-center gap-1 border border-[#10B981]/20">
                      <Target size={12} /> {result.probability} Probability
                    </span>
                    {hospitalType === 'Network' && (
                       <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold border border-secondary/20">
                        Cashless Eligible
                       </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <BreakdownItem label="Total Estimated Bill" value={result.totalBill} color="text-on-surface" />
                <BreakdownItem label="Policy Covers" value={result.estimatedPayout} color="text-[#10B981]" />
                <BreakdownItem label="Deductible / Co-pay" value={result.deductible} color="text-[#F59E0B]" />
                <BreakdownItem label="Out-of-Pocket" value={result.outOfPocket} color="text-[#EF4444]" />
              </div>

              {/* Insight Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-[#EF4444]/5 p-5 rounded-3xl border border-[#EF4444]/10">
                   <h5 className="flex items-center gap-2 text-[#EF4444] font-bold text-sm mb-3">
                     <AlertCircle size={18} /> Potential Risks & Exclusions
                   </h5>
                   <ul className="space-y-2">
                     {result.risks.map((risk, i) => (
                       <li key={i} className="text-[11px] text-on-surface-variant flex items-start gap-2">
                         <span className="w-1 h-1 bg-[#EF4444] rounded-full mt-1.5 shrink-0" />
                         {risk}
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div className="bg-[#10B981]/5 p-5 rounded-3xl border border-[#10B981]/10">
                   <h5 className="flex items-center gap-2 text-[#10B981] font-bold text-sm mb-3">
                     <TrendingUp size={18} /> Ways to Improve Payout
                   </h5>
                   <ul className="space-y-2">
                     {result.advice.map((adv, i) => (
                       <li key={i} className="text-[11px] text-on-surface-variant flex items-start gap-2">
                         <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full mt-1.5 shrink-0" />
                         {adv}
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>

              <button 
                onClick={() => setResult(null)} 
                className="w-full py-4 text-xs font-bold text-primary hover:underline flex items-center justify-center gap-2"
              >
                Reset Simulator <ArrowRight size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
      <span>Calculating Risk Matrix...</span>
    </div>
  );
}

function BreakdownItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 text-center">
      <p className="text-[8px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">{label}</p>
      <p className={`text-base font-black ${color}`}>₹{value.toLocaleString()}</p>
    </div>
  );
}
