import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface Props {
  basePayout: number;
  improvedPayout: number;
  totalBill: number;
}

export default function ComparisonView({ basePayout, improvedPayout, totalBill }: Props) {
  const data = [
    {
      name: 'Current Policy',
      'Out of Pocket': Math.max(0, totalBill - basePayout),
      'Covered by Insurance': basePayout,
    },
    {
      name: 'Improved (What-If)',
      'Out of Pocket': Math.max(0, totalBill - improvedPayout),
      'Covered by Insurance': improvedPayout,
    }
  ];

  const savings = Math.max(0, improvedPayout - basePayout);

  return (
    <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/20">
       <div className="flex justify-between items-start mb-6">
         <div>
           <h4 className="font-headline font-bold text-on-surface">Financial Comparison</h4>
           <p className="text-xs text-on-surface-variant mt-1">See how upgrades protect your wallet.</p>
         </div>
         {savings > 0 && (
           <div className="bg-[#10B981]/10 border border-[#10B981]/20 px-4 py-2 rounded-xl text-right">
             <p className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">Net Savings</p>
             <p className="text-lg font-black text-[#10B981]">₹{savings.toLocaleString()}</p>
           </div>
         )}
       </div>

       <div className="h-64 w-full">
         <ResponsiveContainer width="100%" height="100%">
           <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#888" opacity={0.15} />
             <XAxis type="number" hide />
             <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }} width={120} />
             <Tooltip 
               cursor={{ fill: 'transparent' }}
               contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
             />
             <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
             <Bar dataKey="Covered by Insurance" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
             <Bar dataKey="Out of Pocket" stackId="a" fill="#EF4444" radius={[0, 8, 8, 0]} />
           </BarChart>
         </ResponsiveContainer>
       </div>
    </div>
  );
}
