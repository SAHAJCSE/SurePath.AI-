import { Shield, Home } from 'lucide-react';

export interface WhatIfState {
  plus5LakhSumInsured: boolean;
  networkHospital: boolean;
}

interface Props {
  state: WhatIfState;
  onChange: (newState: WhatIfState) => void;
}

export default function WhatIfControls({ state, onChange }: Props) {
  return (
    <div className="space-y-4 bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10">
      <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
        What-If Overrides
      </h4>

      <div className="space-y-4">
        {/* Toggle 1: Increase Sum Insured */}
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-colors ${state.plus5LakhSumInsured ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface-variant border border-outline-variant/20'}`}>
              <Shield size={18} />
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Add +₹5 Lakh Super Top-up
              </p>
              <p className="text-[10px] text-on-surface-variant">Cost: ~₹800/yr • Massive risk reduction</p>
            </div>
          </div>
          <div className={`relative w-10 h-6 rounded-full transition-colors ${state.plus5LakhSumInsured ? 'bg-primary' : 'bg-outline-variant/30'}`}>
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${state.plus5LakhSumInsured ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={state.plus5LakhSumInsured}
            onChange={(e) => onChange({ ...state, plus5LakhSumInsured: e.target.checked })}
          />
        </label>

        {/* Toggle 2: Hospital Network */}
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-colors ${state.networkHospital ? 'bg-[#10B981] text-white' : 'bg-surface text-on-surface-variant border border-outline-variant/20'}`}>
              <Home size={18} />
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface group-hover:text-[#10B981] transition-colors">
                Admit to Network Hospital
              </p>
              <p className="text-[10px] text-on-surface-variant">Avoids 10-20% mandatory co-payment</p>
            </div>
          </div>
          <div className={`relative w-10 h-6 rounded-full transition-colors ${state.networkHospital ? 'bg-[#10B981]' : 'bg-outline-variant/30'}`}>
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${state.networkHospital ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={state.networkHospital}
            onChange={(e) => onChange({ ...state, networkHospital: e.target.checked })}
          />
        </label>

      </div>
    </div>
  );
}
