import { motion } from 'motion/react';
import { Stethoscope, CheckCircle2 } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  baseCost: number;
  icon: string;
  desc: string;
}

interface Props {
  scenarios: Scenario[];
  selectedId: string;
  onSelect: (id: string, baseCost: number) => void;
}

export default function ScenarioSelector({ scenarios, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
          <Stethoscope size={14} className="text-primary" /> Select Scenario
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((s) => {
          const isActive = selectedId === s.id;
          return (
            <motion.button
              key={s.id}
              whileHover={{ y: -2 }}
              onClick={() => onSelect(s.id, s.baseCost)}
              className={`relative p-4 rounded-2xl border text-left transition-all overflow-hidden ${
                isActive 
                  ? 'bg-primary/5 border-primary shadow-sm shadow-primary/10' 
                  : 'bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/40'
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 text-primary">
                  <CheckCircle2 size={16} />
                </div>
              )}
              <div className="text-3xl mb-2">{s.icon}</div>
              <h4 className={`font-bold text-sm ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                {s.name}
              </h4>
              <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">
                {s.desc}
              </p>
              <p className="text-xs font-black text-on-surface mt-2">
                Avg. ₹{s.baseCost.toLocaleString()}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
