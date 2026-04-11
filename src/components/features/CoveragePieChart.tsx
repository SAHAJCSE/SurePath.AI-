import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

interface Props {
  data: { name: string; value: number }[];
}

export default function CoveragePieChart({ data }: Props) {
  // Handle empty data perfectly and avoid crash if all values are 0
  const totalCoverage = data.reduce((sum, item) => sum + item.value, 0);
  const displayData = totalCoverage === 0 ? [{ name: 'No Data', value: 1 }] : data.filter(d => d.value > 0);
  const renderColors = totalCoverage === 0 ? ['#e5e7eb'] : COLORS;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/20 flex flex-col items-center relative overflow-hidden">
      <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant font-headline self-start mb-4">Coverage Breakdown</h2>

      {totalCoverage > 0 && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-3 flex flex-col items-center justify-center pointer-events-none">
           <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total</span>
           <span className="text-2xl font-black text-primary">₹{totalCoverage.toLocaleString()}</span>
         </div>
      )}

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={displayData}
            dataKey="value"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={4}
            stroke="none"
            labelLine={false}
          >
            {displayData.map((entry, index) => (
              <Cell key={index} fill={renderColors[index % renderColors.length]} />
            ))}
          </Pie>

          <Tooltip 
             formatter={(value: number) => `₹${totalCoverage === 0 ? 0 : value.toLocaleString()}`}
             contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
             itemStyle={{ fontWeight: 'bold' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
