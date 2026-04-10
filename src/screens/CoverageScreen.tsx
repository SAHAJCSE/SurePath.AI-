import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, XCircle, Activity, Car, Shield, ScanFace, ShieldAlert, Zap, ChevronDown, ChevronUp } from 'lucide-react';

const detailBlocks = [
  {
    id: 'accident',
    title: 'Accident Coverage Deep Dive',
    summary: 'Understand eligibility, claim path, exclusions, and required documents for accident claims.',
    eligibility: [
      'Policy must be active with premium paid.',
      'Incident should fall within policy term.',
      'Event should not be under exclusion clauses.',
    ],
    claimSteps: [
      'Inform insurer immediately with policy number.',
      'Share FIR/incident report and medical records.',
      'Submit signed claim form and supporting bills.',
      'Track status until settlement is credited.',
    ],
    exclusions: [
      'Alcohol or substance-related incidents.',
      'Intentional self-inflicted injuries.',
      'Fraudulent or undocumented incidents.',
    ],
    documents: ['Policy document', 'ID proof', 'FIR/report', 'Hospital discharge summary', 'Medical bills'],
  },
  {
    id: 'hospital',
    title: 'Hospitalization Coverage Deep Dive',
    summary: 'Explore hospital benefit details and claim eligibility for planned and emergency admissions.',
    eligibility: [
      'Network hospital preferred for cashless.',
      'Waiting period must be completed for non-accident illness.',
      'Treatment should be medically necessary.',
    ],
    claimSteps: [
      'Raise pre-authorization at hospital desk.',
      'Provide policy + ID proof to TPA/insurer.',
      'Upload discharge summary and final bill.',
      'Receive approval/settlement confirmation.',
    ],
    exclusions: [
      'Cosmetic or elective procedures.',
      'Unproven/non-medical treatments.',
      'Non-disclosed pre-existing condition during waiting period.',
    ],
    documents: ['Health card/policy number', 'Admission note', 'Discharge summary', 'Itemized bills', 'Prescriptions'],
  },
];

export const CoverageScreen = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  return (
  <motion.main
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="pt-24 px-6 max-w-2xl mx-auto pb-32"
  >
    <section className="mb-10 text-center">
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-widest mb-4">
        Policy Active
      </div>
      <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Coverage Visualizer</h2>
      <p className="text-on-surface-variant text-sm max-w-xs mx-auto">Get absolute clarity on what's protected in your current plan.</p>
    </section>

    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-tertiary" size={24} />
          What's Covered
        </h3>
        <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full uppercase tracking-tighter">Premium Protection</span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {[
          { icon: Car, title: 'Accident', desc: 'Full coverage for road and transit incidents.', type: 'Incident' },
          { icon: Activity, title: 'Hospitalization', desc: 'In-patient care and surgical procedures.', type: 'Medical' },
          { icon: ShieldAlert, title: 'Death', desc: 'Comprehensive benefit for nominated heirs.', type: 'Life' }
        ].map((item, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-xl flex items-center gap-5 transition-all hover:translate-x-1 duration-300 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <item.icon size={28} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">{item.type}</p>
              <h4 className="text-lg font-bold">{item.title}</h4>
              <p className="text-sm text-on-surface-variant">{item.desc}</p>
            </div>
            <div className="bg-tertiary/10 text-tertiary p-2 rounded-full">
              <CheckCircle2 size={20} strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <XCircle className="text-error" size={24} />
          What's NOT Covered
        </h3>
        <span className="text-xs font-bold text-error bg-error/10 px-3 py-1 rounded-full uppercase tracking-tighter">Standard Exclusions</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-error/20 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center text-on-error-container">
              <Zap size={24} />
            </div>
            <XCircle className="text-error" size={20} />
          </div>
          <div>
            <h4 className="text-md font-bold mb-1">Alcohol Accident</h4>
            <p className="text-xs text-on-surface-variant">Incidents involving DUI or substance influence.</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-error/20 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center text-on-error-container">
              <ScanFace size={24} />
            </div>
            <XCircle className="text-error" size={20} />
          </div>
          <div>
            <h4 className="text-md font-bold mb-1">Cosmetic Surgery</h4>
            <p className="text-xs text-on-surface-variant">Elective aesthetic enhancements or treatments.</p>
          </div>
        </div>
        <div className="md:col-span-2 bg-surface-container-low p-6 rounded-xl border-l-4 border-error/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-error-container shrink-0 flex items-center justify-center text-on-error-container">
            <ShieldAlert size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-md font-bold mb-1">Self Harm</h4>
            <p className="text-xs text-on-surface-variant">Intentionally self-inflicted injuries or critical events.</p>
          </div>
          <XCircle className="text-error" size={20} />
        </div>
      </div>
    </section>

    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Explore More Details</h3>
        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase">Detailed View</span>
      </div>
      <div className="space-y-4">
        {detailBlocks.map((block) => {
          const isOpen = expandedId === block.id;
          return (
            <div key={block.id} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5">
              <button
                onClick={() => setExpandedId(isOpen ? null : block.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <h4 className="font-bold text-on-surface">{block.title}</h4>
                  <p className="text-sm text-on-surface-variant mt-1">{block.summary}</p>
                </div>
                {isOpen ? <ChevronUp className="text-primary" size={20} /> : <ChevronDown className="text-primary" size={20} />}
              </button>
              {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <div className="bg-surface-container-low rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2 text-on-surface-variant">Eligibility</p>
                    <ul className="list-disc pl-4 text-sm space-y-1">
                      {block.eligibility.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2 text-on-surface-variant">Claim Steps</p>
                    <ol className="list-decimal pl-4 text-sm space-y-1">
                      {block.claimSteps.map((item) => <li key={item}>{item}</li>)}
                    </ol>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2 text-on-surface-variant">Exclusions</p>
                    <ul className="list-disc pl-4 text-sm space-y-1">
                      {block.exclusions.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2 text-on-surface-variant">Required Documents</p>
                    <ul className="list-disc pl-4 text-sm space-y-1">
                      {block.documents.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>

    <div className="bg-primary-container p-6 rounded-2xl relative overflow-hidden mb-12">
      <div className="relative z-10">
        <h4 className="text-on-primary-container font-headline font-bold text-lg mb-2">Want total peace of mind?</h4>
        <p className="text-on-primary-container/80 text-sm mb-4">Upgrade to our 'Elite Plus' plan to cover dental and outpatient care.</p>
        <button className="bg-surface text-primary px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
          View Upgrade Options
        </button>
      </div>
      <div className="absolute right-[-20px] top-[-20px] opacity-20">
        <Shield size={120} className="text-white" />
      </div>
    </div>
  </motion.main>
  );
};
