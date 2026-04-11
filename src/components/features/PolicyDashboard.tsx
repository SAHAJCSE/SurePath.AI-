import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, ShieldOff, Sparkles, LayoutDashboard } from 'lucide-react';
import { ParsedPolicy } from '../../types/policy';
import CoverageVisualizer from './CoverageVisualizer';
import ExclusionsHighlighter from './ExclusionsHighlighter';
import ScenarioSimulator from './ScenarioSimulator';

interface Props {
  policy: ParsedPolicy;
}

export default function PolicyDashboard({ policy }: Props) {
  const [activeTab, setActiveTab] = useState<'coverage' | 'exclusions' | 'simulator'>('coverage');

  const tabs = [
    { id: 'coverage', label: 'Coverage', icon: PieChart },
    { id: 'exclusions', label: 'Exclusions', icon: ShieldOff },
    { id: 'simulator', label: 'Simulator', icon: Sparkles },
  ] as const;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
      {/* Policy Summary Header */}
      <div className="bg-primary p-6 rounded-3xl text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Active Policy Breakdown</p>
          <h2 className="text-2xl font-headline font-extrabold mb-1">{policy.policyName}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="bg-on-primary/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-on-primary/20">
              {policy.insurer}
            </span>
            <span className="text-sm font-medium opacity-90">
              Sum Insured: <span className="font-bold">₹{policy.totalSumInsured.toLocaleString()}</span>
            </span>
          </div>
        </div>
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
          <LayoutDashboard size={160} />
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="flex p-1 bg-surface-container-low rounded-2xl border border-outline-variant/30 sticky top-4 z-40 backdrop-blur-xl bg-opacity-80">
        {tabs.map((tab) => {
          const IsActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all relative ${
                IsActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {IsActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon size={18} className="relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'coverage' && <CoverageVisualizer policy={policy} />}
          {activeTab === 'exclusions' && <ExclusionsHighlighter policy={policy} />}
          {activeTab === 'simulator' && <ScenarioSimulator policy={policy} />}
        </motion.div>
      </AnimatePresence>

      <div className="p-6 bg-secondary-container/10 border border-secondary-container/20 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
          <Sparkles size={20} />
        </div>
        <div>
          <h4 className="text-secondary font-bold text-sm">AI Insight</h4>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Based on our analysis, this policy is particularly strong for <span className="font-bold text-primary">accident-related hospitality</span>, but you should be aware of the 48-month waiting period for pre-existing diseases.
          </p>
        </div>
      </div>
    </div>
  );
}
