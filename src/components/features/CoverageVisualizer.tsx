import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ParsedPolicy } from '../../types/policy';

interface Props {
  policy: ParsedPolicy;
}

const COLORS = ['#003d9b', '#006a6a', '#004c48', '#ba1a1a', '#8b5cf6'];

export default function CoverageVisualizer({ policy }: Props) {
  // Transform coverages into chart data
  const chartData = policy.coverages
    .filter(c => c.isCovered && typeof c.amount === 'number')
    .map(c => ({ name: c.name, value: c.amount as number }));

  const totalSumInsured = policy.totalSumInsured || 500000;
  const totalCovered = chartData.reduce((sum, item) => sum + item.value, 0);
  const notCoveredValue = Math.max(0, totalSumInsured - totalCovered);

  if (notCoveredValue > 0) {
    chartData.push({ name: 'Uncovered / Deductible', value: notCoveredValue });
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6">
      <h3 className="text-xl font-headline font-bold mb-4 flex items-center gap-2 text-primary">
        <span>📊</span> Coverage Breakdown
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={index === chartData.length - 1 && notCoveredValue > 0 ? '#e1e2ec' : COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `₹${value.toLocaleString()}`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 space-y-2">
        {policy.coverages.map((cov, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-outline-variant/20 py-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${cov.isCovered ? 'bg-primary' : 'bg-error'}`} />
              <span className="text-sm font-medium">{cov.name}</span>
            </div>
            <span className={`text-sm font-bold ${cov.isCovered ? 'text-on-surface' : 'text-error'}`}>
              {cov.isCovered ? (typeof cov.amount === 'number' ? `₹${cov.amount.toLocaleString()}` : cov.amount) : '❌ Not covered'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
