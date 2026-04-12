import { AlertCircle, Lightbulb } from 'lucide-react';

interface Props {
  risks: string[];
  advice: string[];
  probability: string;
}

export default function InsightBox({ risks, advice, probability }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {risks.length > 0 && (
        <div className="bg-[#EF4444]/5 p-5 rounded-[2rem] border border-[#EF4444]/15">
          <h5 className="flex items-center gap-2 text-[#EF4444] font-bold text-sm mb-3">
            <AlertCircle size={18} /> Hidden Risks Exposing You
          </h5>
          <ul className="space-y-3">
            {risks.map((risk, i) => (
              <li key={i} className="text-xs text-on-surface-variant flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full mt-1.5 shrink-0" />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {advice.length > 0 && (
        <div className="bg-[#10B981]/5 p-5 rounded-[2rem] border border-[#10B981]/15">
          <h5 className="flex items-center gap-2 text-[#10B981] font-bold text-sm mb-3">
            <Lightbulb size={18} /> AI Recommendations
          </h5>
          <ul className="space-y-3">
            {advice.map((adv, i) => (
              <li key={i} className="text-xs text-on-surface-variant flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full mt-1.5 shrink-0" />
                {adv}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
