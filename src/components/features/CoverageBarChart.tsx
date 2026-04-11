import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface Props {
  data: { name: string; value: number }[];
}

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

export default function CoverageBarChart({ data }: Props) {
  // Handle empty
  const totalCoverage = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/20 flex flex-col items-center">
      <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant font-headline self-start mb-6">Coverage Comparison</h2>

      {totalCoverage === 0 ? (
        <div className="w-full h-[260px] flex items-center justify-center">
           <span className="text-on-surface-variant font-bold text-xs">No sub-limits explicitly mapped.</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `₹${value >= 100000 ? (value/100000).toFixed(1) + 'L' : value}`}
              tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
               formatter={(value: number) => `₹${value.toLocaleString()}`}
               cursor={{ fill: '#F1F5F9', radius: 8 }}
               contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
               itemStyle={{ fontWeight: 'bold' }}
            />
            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
               {data.map((entry, index) => (
                  <Cell 
                     key={index} 
                     fill={entry.value === 0 ? '#EF4444' : COLORS[index % COLORS.length]} 
                  />
               ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
