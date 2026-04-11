import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { ParsedPolicy } from '../../types/policy';

export default function ExclusionsHighlighter({ policy }: { policy: ParsedPolicy }) {
  const severityStyles = {
    high: {
      card: 'bg-error-container/30 border-error/50 text-error-container',
      header: 'text-error font-bold',
      icon: <ShieldAlert className="text-error" size={20} />
    },
    medium: {
      card: 'bg-secondary-container/30 border-secondary/50 text-secondary-container',
      header: 'text-secondary font-bold',
      icon: <AlertTriangle className="text-secondary" size={20} />
    },
    low: {
      card: 'bg-surface-container-high border-outline-variant text-on-surface',
      header: 'text-on-surface font-semibold',
      icon: <Info className="text-outline" size={20} />
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-headline font-bold flex items-center gap-2 text-error">
          <span>🚫</span> What's NOT Covered
        </h3>
        <span className="text-[10px] font-bold bg-error/10 text-error px-2 py-0.5 rounded-full uppercase tracking-wider">Critical</span>
      </div>
      
      <div className="space-y-4">
        {policy.exclusions.map((exc, idx) => {
          const style = severityStyles[exc.severity] || severityStyles.low;
          return (
            <div
              key={idx}
              className={`border-l-4 p-4 rounded-r-xl transition-all hover:bg-surface-container-low ${style.card}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{style.icon}</div>
                <div>
                  <div className={`text-base ${style.header}`}>{exc.title}</div>
                  <div className="text-sm text-on-surface-variant mt-1 leading-relaxed">{exc.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {policy.exclusions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant">
          <div className="w-16 h-16 rounded-full bg-secondary-container/20 flex items-center justify-center mb-4">
            <Info className="text-secondary" size={32} />
          </div>
          <p className="italic text-center">No explicit exclusions found in the analyzed summary.</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
        <p className="text-xs text-on-surface-variant leading-relaxed">
          <span className="font-bold text-primary">Pro Tip:</span> Even if a condition is covered, check for "Waiting Periods" and "Sub-limits" which might reduce your claim amount unexpectedly.
        </p>
      </div>
    </div>
  );
}
