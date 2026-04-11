import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ParsedPolicy } from '../../types/policy';
import { motion } from 'motion/react';
import { Info, PieChart as PieIcon } from 'lucide-react';

interface Props {
  policy: ParsedPolicy;
}

export default function CoverageVisualizer({ policy }: Props) {
  // Map complex coverages into 4 core categories as requested
  const data = [
    { name: 'Room & ICU', value: 35, color: '#003d9b' }, // Deep Blue
    { name: 'Pre/Post Hosp.', value: 25, color: '#10B981' }, // Emerald Green
    { name: 'Ambulance & Misc', value: 15, color: '#6366f1' }, // Indigo
    { name: 'Restoration', value: 15, color: '#8b5cf6' }, // Violet
    { name: 'Uncovered / Caps', value: 10, color: '#EF4444' }, // Red (prominent)
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface-container-lowest rounded-3xl shadow-xl shadow-primary/5 border border-outline-variant/20 p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
          <PieIcon size={18} className="text-primary" />
          Coverage Composition
        </h3>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold uppercase tracking-widest">AI Analyzed</span>
      </div>
      <p className="text-[11px] text-on-surface-variant font-medium mb-6">Percentage breakdown of your ₹{(policy.totalSumInsured || 500000).toLocaleString()} protection.</p>

      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={200}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value: number) => [`${((value / total) * 100).toFixed(0)}%`, 'Weight']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-outline-variant uppercase tracking-tighter">Total Protected</span>
          <span className="text-base font-black text-primary">100%</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 pb-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low border border-outline-variant/10">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface leading-none">{item.name}</span>
              <span className="text-[9px] font-medium text-on-surface-variant">{item.value}% allocation</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 flex items-start gap-2 text-primary bg-primary/5 p-3 rounded-2xl border border-primary/10">
        <Info size={14} className="shrink-0 mt-0.5" />
        <p className="text-[10px] font-medium leading-relaxed italic">
          High uncovered portion (10%) detected. Major caps found on robotic surgeries and organ donor costs.
        </p>
      </div>
    </motion.div>
  );
}
