import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calculator } from 'lucide-react';
import { ParsedPolicy } from '../../types/policy';
import { API_BASE } from '../../config';

import ScenarioSelector from './simulator/ScenarioSelector';
import FinancialImpactCard from './simulator/FinancialImpactCard';
import WhatIfControls, { WhatIfState } from './simulator/WhatIfControls';
import InsightBox from './simulator/InsightBox';
import ComparisonView from './simulator/ComparisonView';

interface Props {
  policy: ParsedPolicy;
}

const SCENARIOS = [
  { id: 'hospital', name: 'Planned Hospitalization', baseCost: 450000, icon: '🏥', desc: 'Standard treatments, surgeries, or viral infections.' },
  { id: 'accident', name: 'Urgent Accident + ICU', baseCost: 850000, icon: '🚑', desc: 'Emergency response, ICU charges, and trauma.' },
  { id: 'pre-existing', name: 'Pre-existing Disease', baseCost: 350000, icon: '❤️', desc: 'Chronic heart/kidney conditions declared earlier.' },
];

export default function ScenarioSimulator({ policy }: Props) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(SCENARIOS[0].id);
  const [expectedBill, setExpectedBill] = useState(SCENARIOS[0].baseCost);
  
  const [whatIfState, setWhatIfState] = useState<WhatIfState>({
    plus5LakhSumInsured: false,
    networkHospital: false,
  });

  const [loading, setLoading] = useState(false);
  const [baseResult, setBaseResult] = useState<any>(null);
  const [improvedResult, setImprovedResult] = useState<any>(null);

  const handleSimulate = async () => {
    setLoading(true);
    setBaseResult(null);
    setImprovedResult(null);

    const isAccident = selectedScenarioId === 'accident';
    
    // 1. Fetch Request 1: Base Policy (Worst Case / Standard)
    const reqBase = fetch(`${API_BASE}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policyData: policy,
          scenario: {
            hospitalBill: expectedBill,
            accident: isAccident,
            hospitalType: 'Non-Network', // Default harsh condition
            age: 35
          }
        })
    }).then(r => r.json()).catch(() => generateMockResult(expectedBill, 'Non-Network', policy.totalSumInsured));

    // 2. Fetch Request 2: Improved Policy (With WhatIfs applied)
    const improvedPolicy = {
      ...policy,
      totalSumInsured: policy.totalSumInsured + (whatIfState.plus5LakhSumInsured ? 500000 : 0)
    };

    const reqImproved = fetch(`${API_BASE}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policyData: improvedPolicy,
          scenario: {
            hospitalBill: expectedBill,
            accident: isAccident,
            hospitalType: whatIfState.networkHospital ? 'Network' : 'Non-Network',
            age: 35
          }
        })
    }).then(r => r.json()).catch(() => generateMockResult(expectedBill, whatIfState.networkHospital ? 'Network' : 'Non-Network', improvedPolicy.totalSumInsured));

    const [base, improved] = await Promise.all([reqBase, reqImproved]);
    
    setBaseResult(base);
    setImprovedResult(improved);
    setLoading(false);
  };

  // Re-run simulation seamlessly if a what-if toggle flips and we already have results
  useEffect(() => {
    if (baseResult && !loading) {
      handleSimulate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatIfState]);

  return (
    <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-xl shadow-primary/5 border border-outline-variant/20 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 border-b border-outline-variant/10">
         <h3 className="text-2xl font-headline font-black text-on-surface flex items-center gap-3">
            <Calculator className="text-primary" />
            Decision Engine
         </h3>
         <p className="text-xs text-on-surface-variant font-medium mt-1">
            Running simulations on <span className="text-primary font-bold">{policy.policyName}</span>
         </p>
      </div>

      <div className="p-6 md:p-8 space-y-10">
         {/* Build Phase */}
         <div className="space-y-6">
           <ScenarioSelector 
             scenarios={SCENARIOS} 
             selectedId={selectedScenarioId}
             onSelect={(id, cost) => {
               setSelectedScenarioId(id);
               setExpectedBill(cost);
             }}
           />

           <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">
                Expected Hospital Bill
              </label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-on-surface/50 text-xl">₹</span>
                <input 
                  type="number"
                  value={expectedBill}
                  onChange={(e) => setExpectedBill(Number(e.target.value))}
                  className="w-full h-16 pl-12 bg-white border border-outline-variant/20 rounded-[1.5rem] px-6 text-xl font-black text-on-surface focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                />
              </div>
           </div>

           {!baseResult && (
             <button 
                onClick={handleSimulate} 
                disabled={loading} 
                className="w-full bg-primary text-on-primary h-16 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-transform active:scale-[0.98] shadow-xl shadow-primary/20 disabled:opacity-70 group mt-4"
             >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={20} className="group-hover:animate-pulse" />
                    <span className="text-lg">Run AI Simulation</span>
                  </>
                )}
             </button>
           )}
         </div>

         {/* Results Phase */}
         <AnimatePresence mode="wait">
           {baseResult && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-outline-variant/10 space-y-8"
              >
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Toggles & Insights */}
                    <div className="lg:col-span-5 space-y-6">
                      <WhatIfControls state={whatIfState} onChange={setWhatIfState} />
                      <InsightBox 
                        risks={improvedResult?.risks || baseResult.risks} 
                        advice={improvedResult?.advice || baseResult.advice} 
                        probability={improvedResult?.probability || baseResult.probability} 
                      />
                    </div>

                    {/* Right Column: Financial Data */}
                    <div className="lg:col-span-7 space-y-6">
                      <FinancialImpactCard result={improvedResult || baseResult} />
                      
                      {(whatIfState.networkHospital || whatIfState.plus5LakhSumInsured) && (
                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                           <ComparisonView 
                             basePayout={baseResult.estimatedPayout} 
                             improvedPayout={improvedResult.estimatedPayout} 
                             totalBill={expectedBill} 
                           />
                         </motion.div>
                      )}
                    </div>
                 </div>
              </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}

// Fallback logic internally for pure-frontend testing
function generateMockResult(bill: number, type: string, si: number) {
  const oop = bill > si ? bill - si + (bill * 0.1) : (type === 'Network' ? bill * 0.05 : bill * 0.15);
  return {
    estimatedPayout: Math.max(0, bill - oop),
    probability: oop > (bill * 0.3) ? 'Low' : 'High',
    probPercent: 85,
    totalBill: bill,
    deductible: type === 'Network' ? 0 : 5000,
    outOfPocket: Math.max(0, Math.round(oop)),
    risks: ['Base sum insured could be exhausted.'],
    advice: ['Check room rent capping limits.']
  };
}
