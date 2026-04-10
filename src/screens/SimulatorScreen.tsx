import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { User, PlayCircle, Activity, Car } from 'lucide-react';

type ScenarioId = 'bike_accident' | 'hospital_admission' | 'natural_death';

const scenarios = {
  bike_accident: {
    label: 'Bike Accident',
    subtitle: 'Includes medical & collision',
    covered: 'Yes',
    amount: '₹5 lakh',
    risk: 'Medium',
    explanation: 'Covered under accidental injury benefit. Claim amount depends on injury severity and sum assured cap.',
    payoutLogic: 'Up to 100% for permanent disability/death; partial payout for partial disability.',
    eligibility: ['Policy active on incident date', 'Accident is documented', 'No intoxication exclusion trigger'],
    docs: ['Policy number', 'FIR/accident report', 'Hospital discharge summary', 'Bills and prescriptions'],
    steps: [
      { step: 1, title: 'Inform Insurance', desc: 'Report incident within 24 hours through helpline/app.' },
      { step: 2, title: 'Submit Evidence', desc: 'Upload FIR, medical reports, and treatment bills.' },
      { step: 3, title: 'Medical + Policy Review', desc: 'Insurer validates eligibility and exclusion checks.' },
      { step: 4, title: 'Settlement', desc: 'Approved payout is credited to registered account.' },
    ],
  },
  hospital_admission: {
    label: 'Hospital Admission',
    subtitle: 'Planned or emergency care',
    covered: 'Yes',
    amount: 'As per room/plan limits',
    risk: 'Low',
    explanation: 'In-patient hospitalization is generally covered with sub-limits and waiting period conditions.',
    payoutLogic: 'Cashless in network hospitals; reimbursement in non-network hospitals after bill validation.',
    eligibility: ['Waiting period completed', 'Treatment is medically necessary', 'Hospital is eligible under plan rules'],
    docs: ['Health card/policy ID', 'Admission note', 'Final bill', 'Doctor prescription'],
    steps: [
      { step: 1, title: 'Pre-Authorization', desc: 'Raise cashless request at hospital insurance desk.' },
      { step: 2, title: 'Document Submission', desc: 'Submit policy ID, diagnosis note, and treatment estimate.' },
      { step: 3, title: 'Approval', desc: 'TPA/insurer confirms admissible amount and limits.' },
      { step: 4, title: 'Discharge Settlement', desc: 'Insurer pays eligible amount; non-payables by customer.' },
    ],
  },
  natural_death: {
    label: 'Natural Death',
    subtitle: 'Life coverage and benefits',
    covered: 'Yes',
    amount: '₹3 lakh',
    risk: 'Medium',
    explanation: 'Natural death benefit is payable to nominee after policy conditions and waiting clauses are satisfied.',
    payoutLogic: 'Sum assured payable to nominee after verification and outstanding dues adjustment (if any).',
    eligibility: ['Policy in-force', 'Nominee details registered', 'No material non-disclosure issues'],
    docs: ['Death certificate', 'Policy bond', 'Nominee ID + bank details', 'Claim form'],
    steps: [
      { step: 1, title: 'Claim Intimation', desc: 'Nominee informs insurer and receives claim reference.' },
      { step: 2, title: 'Nominee Verification', desc: 'Submit KYC and relationship proof documents.' },
      { step: 3, title: 'Policy Review', desc: 'Insurer validates terms, waiting periods, and disclosures.' },
      { step: 4, title: 'Payout to Nominee', desc: 'Eligible amount is transferred to nominee bank account.' },
    ],
  },
} as const;

export const SimulatorScreen = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('bike_accident');
  const selected = useMemo(() => scenarios[selectedScenario], [selectedScenario]);

  return (
  <motion.main
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="mt-20 px-6 max-w-2xl mx-auto pb-32"
  >
    <section className="py-8">
      <p className="text-on-surface-variant font-medium tracking-wide uppercase text-xs mb-2">Scenario Simulator</p>
      <h2 className="text-3xl font-bold text-on-surface tracking-tight">Test Your Coverage</h2>
      <p className="text-on-surface-variant mt-2">See how your policy performs in real-world situations.</p>
    </section>

    <section className="space-y-4 mb-10">
      <label className="text-xs font-semibold uppercase text-on-surface-variant tracking-widest ml-1">Select an Event</label>
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => setSelectedScenario('bike_accident')}
          className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all active:scale-95 text-left shadow-sm ${selectedScenario === 'bike_accident' ? 'bg-surface-container-lowest border-primary/40' : 'bg-surface-container-low border-transparent'}`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedScenario === 'bike_accident' ? 'bg-primary/10' : 'bg-on-surface-variant/10'}`}>
            <Car className={selectedScenario === 'bike_accident' ? 'text-primary' : 'text-on-surface-variant'} size={24} />
          </div>
          <div className="flex-1">
            <span className="block font-bold text-on-surface">Bike Accident</span>
            <span className="text-sm text-on-surface-variant">Includes medical & collision</span>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedScenario === 'bike_accident' ? 'border-primary' : 'border-outline'}`}>
            {selectedScenario === 'bike_accident' && <div className="w-3 h-3 bg-primary rounded-full" />}
          </div>
        </button>
        <button
          onClick={() => setSelectedScenario('hospital_admission')}
          className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all active:scale-95 text-left shadow-sm ${selectedScenario === 'hospital_admission' ? 'bg-surface-container-lowest border-primary/40' : 'bg-surface-container-low border-transparent'}`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedScenario === 'hospital_admission' ? 'bg-primary/10' : 'bg-on-surface-variant/10'}`}>
            <Activity className={selectedScenario === 'hospital_admission' ? 'text-primary' : 'text-on-surface-variant'} size={24} />
          </div>
          <div className="flex-1">
            <span className="block font-bold text-on-surface">Hospital Admission</span>
            <span className="text-sm text-on-surface-variant">Planned or emergency care</span>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedScenario === 'hospital_admission' ? 'border-primary' : 'border-outline'}`}>
            {selectedScenario === 'hospital_admission' && <div className="w-3 h-3 bg-primary rounded-full" />}
          </div>
        </button>
        <button
          onClick={() => setSelectedScenario('natural_death')}
          className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all active:scale-95 text-left shadow-sm ${selectedScenario === 'natural_death' ? 'bg-surface-container-lowest border-primary/40' : 'bg-surface-container-low border-transparent'}`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedScenario === 'natural_death' ? 'bg-primary/10' : 'bg-on-surface-variant/10'}`}>
            <User className={selectedScenario === 'natural_death' ? 'text-primary' : 'text-on-surface-variant'} size={24} />
          </div>
          <div className="flex-1">
            <span className="block font-bold text-on-surface">Natural Death</span>
            <span className="text-sm text-on-surface-variant">Life coverage and benefits</span>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedScenario === 'natural_death' ? 'border-primary' : 'border-outline'}`}>
            {selectedScenario === 'natural_death' && <div className="w-3 h-3 bg-primary rounded-full" />}
          </div>
        </button>
      </div>
    </section>

    <section className="bg-primary p-1 rounded-[2rem] mb-10 overflow-hidden shadow-xl shadow-primary/10">
      <div className="bg-primary p-6 rounded-[1.75rem] text-on-primary">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold opacity-90">Simulation Result</h3>
            <p className="text-primary-fixed-dim text-sm">{selected.label} - {selected.subtitle}</p>
          </div>
          <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-widest rounded-full">Active Policy</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-[10px] uppercase font-semibold opacity-70 mb-1">Covered</p>
            <p className="text-lg font-bold">{selected.covered}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-[10px] uppercase font-semibold opacity-70 mb-1">Amount</p>
            <p className="text-lg font-bold">{selected.amount}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-[10px] uppercase font-semibold opacity-70 mb-1">Risk</p>
            <p className="text-lg font-bold">{selected.risk}</p>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <p className="text-xs uppercase tracking-widest text-on-primary/60 font-bold">Why this result</p>
          <p className="text-sm text-on-primary/90">{selected.explanation}</p>
          <p className="text-sm text-on-primary/80"><span className="font-bold">Payout Logic:</span> {selected.payoutLogic}</p>
        </div>
      </div>
    </section>

    <section className="mb-10">
      <h3 className="text-sm font-semibold uppercase text-on-surface-variant tracking-widest mb-6 ml-1">Next Steps / Action Plan</h3>
      <div className="space-y-6 relative ml-4 before:absolute before:left-[1.125rem] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-high">
        {selected.steps.map((item) => (
          <div key={item.step} className="flex gap-6 relative">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg shadow-primary/20">{item.step}</div>
            <div>
              <h4 className="font-bold text-on-surface">{item.title}</h4>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-surface-container-low rounded-2xl p-5">
        <h4 className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-3">Eligibility Checklist</h4>
        <ul className="list-disc pl-4 text-sm space-y-1 text-on-surface-variant">
          {selected.eligibility.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
      <div className="bg-surface-container-low rounded-2xl p-5">
        <h4 className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-3">Required Documents</h4>
        <ul className="list-disc pl-4 text-sm space-y-1 text-on-surface-variant">
          {selected.docs.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      </div>
    </section>

    <button className="w-full py-5 rounded-3xl bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-on-primary font-bold text-lg shadow-xl shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-10">
      <PlayCircle size={24} fill="currentColor" />
      Start Claim Simulation
    </button>
  </motion.main>
  );
};
