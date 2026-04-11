import { motion } from 'motion/react';
import { usePolicy } from '../hooks/usePolicy';
import { 
  Loader2, 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  Info, 
  ArrowRight, 
  Star, 
  CheckCircle, 
  Activity, 
  Building2, 
  Ambulance, 
  Stethoscope, 
  Hotel,
  MapPin,
  Lock
} from 'lucide-react';

export const SummaryScreen = () => {
  const { policy, loading, error } = usePolicy();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const handleOpenMaps = (query?: string) => {
    const defaultQuery = `network hospitals for ${policy?.insurer || 'insurance'} near Banur, Punjab`;
    const searchQuery = encodeURIComponent(query || defaultQuery);
    window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
  };

  if (error || !policy) {
    return (
      <div className="pt-24 px-6 text-center">
        <p className="text-error font-bold">Error loading policy: {error || 'No policy found'}</p>
        <p className="text-sm mt-2">Please upload a policy from the home screen.</p>
      </div>
    );
  }

  const coverageScore = 84; // Mock score based on policy strength
  
  // Mapping first 6 coverages for grid
  const highlights = [
    { icon: Hotel, label: 'Room Rent', value: '₹10k/day', status: 'Good', statusColor: 'text-secondary' },
    { icon: activityIcon, label: 'ICU Charges', value: 'Unlimited', status: 'Excellent', statusColor: 'text-[#10B981]' },
    { icon: Stethoscope, label: 'Pre-Hospitalization', value: '₹30,000', status: 'Standard', statusColor: 'text-amber-500' },
    { icon: Ambulance, label: 'Ambulance', value: '₹5,000', status: 'Good', statusColor: 'text-secondary' },
    { icon: ShieldCheck, label: 'No Claim Bonus', value: '50% Yearly', status: 'Elite', statusColor: 'text-primary' },
    { icon: Zap, label: 'Restoration', value: 'Unlimited', status: 'Excellent', statusColor: 'text-[#10B981]' }
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 pb-32 px-6 max-w-6xl mx-auto space-y-10"
    >
      {/* Policy Health Score Header */}
      <section className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">AI Intelligence Report</span>
             <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest rounded-full">Active Plan</span>
           </div>
           <h2 className="text-3xl font-headline font-black text-on-surface">
            Policy Health <span className="text-primary">Dashboard.</span>
           </h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="bg-surface-container-low px-5 py-3 rounded-2xl border border-outline-variant/10 flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Policy Strength</p>
                <p className="text-xl font-headline font-black text-[#10B981]">8.4/10</p>
             </div>
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-on-primary shadow-lg shadow-[#10B981]/20">
                <Star fill="currentColor" size={24} />
             </div>
          </div>
        </div>
      </section>

      {/* Top Section: Ring + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 bg-surface-container-lowest rounded-[3rem] p-1 shadow-xl shadow-primary/5 border border-outline-variant/20 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-10 p-10 bg-gradient-to-br from-white to-surface-container-low rounded-[2.9rem]">
            {/* Left: Scoring Ring */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-surface-container-high" />
                <circle 
                  cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={502.6}
                  strokeDashoffset={502.6 - (502.6 * coverageScore) / 100}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Sum Insured</span>
                 <span className="text-2xl font-headline font-black text-on-surface">₹{(policy.totalSumInsured/100000).toFixed(0)} Lakh</span>
                 <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full mt-1">{coverageScore}% Solid Cover</span>
              </div>
            </div>

            {/* Right: Summary Text */}
            <div className="flex-1 space-y-6">
              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 relative">
                <BrainCircuit className="absolute -top-3 -left-3 text-primary bg-white p-1 rounded-lg border border-primary/20" size={32} />
                <h4 className="text-xl font-headline font-black text-primary mb-3">Executive Summary</h4>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                  Your <span className="text-on-surface font-bold">{policy.insurer} {policy.policyName}</span> plan provides solid protection for major hospitalization. However, our AI detected a 
                  <span className="text-error font-bold"> high-risk 48-month waiting period</span> for pre-existing conditions. We suggest maintaining a back-up plan until this period clears.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 items-center p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm grow text-center">
                   <Lock size={16} className="text-primary" />
                   <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Premium</span>
                   <span className="text-xs font-bold">Standard</span>
                </div>
                <div className="flex flex-col gap-1 items-center p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm grow text-center">
                   <ShieldCheck size={16} className="text-[#10B981]" />
                   <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Status</span>
                   <span className="text-xs font-bold text-[#10B981]">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Highlights Grid */}
        <div className="lg:col-span-12 space-y-6">
           <h4 className="text-xl font-headline font-black text-on-surface px-2">Key Highlights</h4>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {highlights.map((item, idx) => (
                <div key={idx} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-all hover:bg-surface-container-low group">
                   <div className="flex justify-between items-start mb-6 w-full">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                        <item.icon size={26} />
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${item.statusColor} bg-opacity-10 border-current`}>
                        {item.status}
                      </span>
                   </div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{item.label}</p>
                   <h5 className="text-lg font-black text-on-surface mb-2">{item.value}</h5>
                   <div className="flex items-center gap-1.5 py-1.5 px-3 bg-[#10B981]/5 text-[#10B981] rounded-full w-fit">
                      <CheckCircle size={10} strokeWidth={3} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Active Coverage</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Exclusions Breakdown */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/20 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-headline font-black text-on-surface flex items-center gap-3">
                <Info className="text-error" size={24} />
                Critical Gaps
              </h4>
              <span className="text-[10px] font-bold text-error uppercase tracking-widest animate-pulse">Action Required</span>
           </div>
           
           <div className="space-y-4">
              {policy.exclusions.slice(0, 3).map((exc, i) => (
                <div key={i} className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/10 group hover:border-error/30 transition-all">
                   <div className="flex justify-between items-start mb-3">
                      <h5 className="font-headline font-bold text-on-surface">{exc.title}</h5>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${
                        i === 0 ? 'bg-error text-on-error border-error' : 'bg-amber-100 text-amber-700 border-amber-300'
                      }`}>
                        {i === 0 ? 'High Risk' : 'Medium Risk'}
                      </span>
                   </div>
                   <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{exc.description}</p>
                   <div className="flex items-center gap-2 p-3 bg-white/50 rounded-2xl border border-outline-variant/5">
                      <Zap size={14} className="text-error" />
                      <p className="text-[11px] font-black text-error uppercase tracking-tight">Warning: May reject up to 70% of claims in first 4 years.</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Network Hospital & Maps */}
        <div className="lg:col-span-4 bg-on-surface rounded-[2.5rem] p-8 text-on-primary-container shadow-2xl relative overflow-hidden flex flex-col justify-between group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
              <Building2 size={120} />
           </div>
           
           <div className="space-y-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                 <MapPin size={32} />
              </div>
              
              <div>
                 <h4 className="text-2xl font-headline font-black text-white leading-tight">12,000+ Cashless Facilities</h4>
                 <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                   Found <span className="text-primary font-bold">14 top-rated</span> network hospitals for {policy.insurer} near <span className="text-white underline decoration-primary font-bold">Banur, Punjab</span>.
                 </p>
              </div>

              <div className="space-y-3">
                 <button 
                  onClick={() => handleOpenMaps('Ivy Hospital Banur')}
                  className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors text-left"
                 >
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-xs font-bold text-white/80 italic">Ivy Hospital - 8.2km</span>
                 </button>
                 <button 
                  onClick={() => handleOpenMaps('Fortis Mohali')}
                  className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors text-left"
                 >
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-xs font-bold text-white/80 italic">Fortis Mohali - 14.5km</span>
                 </button>
              </div>
           </div>
 
           <button 
             onClick={() => handleOpenMaps()}
             className="w-full mt-10 h-16 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-container transition-all shadow-xl shadow-primary/20 border border-primary/20"
           >
              Find Near Me
              <ArrowRight size={20} />
           </button>
        </div>
      </div>
    </motion.main>
  );
};

const activityIcon = Activity;
