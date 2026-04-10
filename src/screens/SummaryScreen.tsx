import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Car, Building2, BrainCircuit, Gavel, ChevronDown, ChevronUp } from 'lucide-react';

const coverageDetails = [
  {
    key: 'accident',
    icon: Car,
    title: 'Accident Coverage',
    value: '₹5 Lakh',
    desc: 'Comprehensive payout for accidental disability or loss of life.',
    accent: 'text-primary',
    bg: 'bg-primary-fixed',
    iconColor: 'text-on-primary-fixed',
    bullets: [
      'Covers accidental death.',
      'Permanent total disability is covered.',
      'Partial disability like loss of limb/eyesight included.',
      'Compensation for accident-related injuries.',
      '24/7 protection, including travel scenarios if policy allows.',
    ],
  },
  {
    key: 'natural',
    icon: Heart,
    title: 'Natural Death',
    value: '₹3 Lakh',
    desc: 'Base protection amount for non-accidental mortality events.',
    accent: 'text-secondary',
    bg: 'bg-secondary-container',
    iconColor: 'text-on-secondary-container',
    bullets: [
      'Covers illness and natural causes.',
      'Critical illness benefit may apply as per clause.',
      'No accident trigger required.',
      'Coverage activates after waiting period.',
      'Nominee receives payout based on policy terms.',
    ],
  },
  {
    key: 'hospital',
    icon: Building2,
    title: 'Hospitalization',
    value: 'Covered',
    desc: 'Network hospitals support direct cashless facility (1200+ centers).',
    accent: 'text-tertiary',
    bg: 'bg-tertiary-fixed',
    iconColor: 'text-on-tertiary-fixed-variant',
    bullets: [
      'Cashless treatment at network hospitals.',
      'Includes room rent, ICU, surgery charges.',
      'Pre/post-hospitalization expenses are considered.',
      'Emergency ambulance benefit included.',
      'Paperless claim flow in supported hospitals.',
    ],
  },
];

export const SummaryScreen = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  return (
  <motion.main
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="pt-24 pb-32 px-6 max-w-5xl mx-auto space-y-8"
  >
    <section className="space-y-2">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs font-bold uppercase tracking-widest">
        AI Intelligence Active
      </div>
      <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface leading-tight">
        Your Policy, <span className="bg-gradient-to-br from-[#003d9b] to-[#0052cc] bg-clip-text text-transparent">Deciphered.</span>
      </h2>
      <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-md">
        We've analyzed 48 pages of legal text to give you the most critical insights into your coverage.
      </p>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-7 bg-surface-container-lowest rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-[0_12px_24px_-4px_rgba(25,27,35,0.06)]">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle className="text-surface-container-low" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
            <circle className="text-primary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset="138" strokeLinecap="round" strokeWidth="12"></circle>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-headline text-5xl font-extrabold text-on-surface">82</span>
            <span className="font-label text-xs uppercase tracking-tighter text-on-surface-variant font-bold">Safety Score</span>
          </div>
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h3 className="font-headline text-xl font-bold">Resilient Protection</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">Your policy provides exceptional protection against high-impact events, though outpatient care has limited scope.</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-4 py-2 rounded-xl bg-surface-container-low text-primary font-bold text-xs">High Resilience</span>
            <span className="px-4 py-2 rounded-xl bg-surface-container-low text-primary font-bold text-xs">92% Coverage Match</span>
          </div>
        </div>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="md:col-span-5 bg-surface-container-low rounded-2xl p-8 flex flex-col justify-between shadow-sm">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-on-surface">Complexity</h3>
            <BrainCircuit className="text-primary" size={24} />
          </div>
          <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[35%] rounded-full"></div>
          </div>
          <p className="text-xs text-on-surface-variant font-medium">Standard legal density. Most clauses follow industry norms with minimal hidden jargon.</p>
        </div>
        <div className="pt-6">
          <span className="font-label text-[10px] uppercase font-black text-on-surface-variant/40 tracking-[0.2em]">Complexity Tier: Low-Medium</span>
        </div>
      </div>

      <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {coverageDetails.map((item) => (
          <div key={item.key} className="bg-surface-container-lowest rounded-2xl p-6 space-y-4 border border-outline-variant/10">
            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
              <item.icon className={item.iconColor} size={24} />
            </div>
            <div>
              <h4 className="font-headline font-bold text-on-surface">{item.title}</h4>
              <p className={`font-headline text-2xl font-black mt-1 ${item.accent}`}>{item.value}</p>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
            <button
              onClick={() => setExpandedCard(expandedCard === item.key ? null : item.key)}
              className="text-xs font-bold text-primary flex items-center gap-1"
            >
              {expandedCard === item.key ? 'Read Less' : 'Read More'}
              {expandedCard === item.key ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {expandedCard === item.key && (
              <ul className="text-xs text-on-surface-variant space-y-2 list-disc pl-4">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="md:col-span-8 bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <Gavel className="text-error" size={24} fill="currentColor" />
          <h3 className="font-headline font-bold text-xl">Important Clauses</h3>
        </div>
        <ul className="space-y-6">
          {[
            { title: 'Waiting Period (30 Days)', desc: 'No claims for illness within the first 30 days of policy issuance, except for accidents.' },
            { title: 'Pre-existing Condition (3 Years)', desc: 'Conditions declared at purchase are covered after a continuous 36-month period.' },
            { title: 'Claim Notification', desc: 'All hospitalizations must be reported within 24 hours of admission for cashless.' }
          ].map((item, i) => (
            <li key={i} className="flex gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0"></div>
              <div>
                <p className="font-bold text-sm text-on-surface">{item.title}</p>
                <p className="text-sm text-on-surface-variant mt-1">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-4 bg-primary rounded-2xl p-8 text-on-primary flex flex-col justify-between shadow-xl">
        <div className="space-y-2">
          <h4 className="font-label text-[10px] uppercase font-black tracking-widest text-on-primary/60">Next Payment</h4>
          <p className="font-headline text-3xl font-black tracking-tight">₹1,450</p>
          <p className="text-xs text-on-primary/80 font-medium">Due on Oct 12, 2023</p>
        </div>
        <div className="mt-8 pt-8 border-t border-on-primary/10">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary/40">Premium History</p>
              <div className="flex items-end gap-1 mt-3">
                <div className="w-3 h-8 bg-on-primary/20 rounded-sm"></div>
                <div className="w-3 h-10 bg-on-primary/40 rounded-sm"></div>
                <div className="w-3 h-6 bg-on-primary/20 rounded-sm"></div>
                <div className="w-3 h-12 bg-on-primary rounded-sm"></div>
              </div>
            </div>
            <button className="w-12 h-12 rounded-xl bg-on-primary text-primary flex items-center justify-center active:scale-95 duration-200">
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.main>
  );
};
