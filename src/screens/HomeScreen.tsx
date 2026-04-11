import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart2, 
  ShieldCheck, 
  ArrowRight, 
  Upload, 
  CheckCircle, 
  Info, 
  Zap, 
  Users, 
  Languages, 
  Plus,
  ArrowBigUpDash
} from 'lucide-react';

import { API_BASE } from '../config';

const COMPANIES = [
  { id: 'hdfc', name: 'HDFC ERGO', logo: '🏥' },
  { id: 'niva', name: 'Niva Bupa', logo: '🛡️' },
  { id: 'star', name: 'Star Health', logo: '⭐' },
  { id: 'icici', name: 'ICICI Pru', logo: '💎' },
  { id: 'acko', name: 'Acko', logo: '🚗' },
];

export const HomeScreen = ({ onStart }: { onStart: () => void }) => {
  const [fileName, setFileName] = useState<string>('');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  async function uploadPolicy(file: File) {
    setUploadState('uploading');
    setUploadMessage('AI is analyzing coverage points...');
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch(`${API_BASE}/api/policy/upload`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      const policyId = String(data?.policyId || '');
      
      localStorage.setItem('surepath_policy_id', policyId);
      localStorage.setItem('surepath_policy_name', file.name);
      setUploadState('done');
      setTimeout(onStart, 1000);
    } catch (err: any) {
      setUploadState('error');
      setUploadMessage(`Error: ${err.message}`);
    }
  }

  const handleDemo = () => {
    localStorage.setItem('surepath_selected_provider', 'hdfc');
    localStorage.setItem('surepath_policy_id', 'demo-policy-id');
    localStorage.setItem('surepath_policy_name', 'Optima Secure (Demo)');
    onStart();
  };

  const handleCompanyClick = (id: string) => {
    localStorage.setItem('surepath_selected_provider', id);
    localStorage.setItem('surepath_policy_id', 'demo-policy-id');
    onStart();
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto pt-24 px-6 pb-32 space-y-16"
    >
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/10"
        >
          <Zap size={12} fill="currentColor" />
          The future of policy reading
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-headline font-black text-on-surface leading-[1.05] tracking-tight">
          Stop Getting <span className="text-primary italic">Confused</span> by Insurance Policies.
        </h1>
        <p className="text-on-surface-variant text-lg font-medium leading-relaxed max-w-lg mx-auto">
          Upload any policy → Get Visual Coverage Map, Red-Flag Exclusions & Claim Simulator in seconds.
        </p>
      </section>

      {/* Main Action Area */}
      <section className="space-y-8">
        {/* Upload Terminal */}
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5 border border-outline-variant/20 relative overflow-hidden group">
          <label className="relative z-10 w-full cursor-pointer flex flex-col items-center justify-center gap-4 py-10 border-2 border-dashed border-primary/30 rounded-[2rem] bg-primary/5 hover:bg-primary/10 transition-all hover:border-primary/60 group">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary shadow-xl shadow-primary/10 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <div className="text-center">
              <p className="font-headline font-extrabold text-lg text-on-surface">Drop PDF here or click to upload</p>
              <p className="text-xs font-bold text-on-surface-variant opacity-60">Supports PDF, Images, Text • 10MB Max</p>
            </div>
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileName(file.name);
                  uploadPolicy(file);
                }
              }}
            />
          </label>

          <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-center">
            <button
               onClick={() => {
                 const id = localStorage.getItem('surepath_policy_id');
                 if (id) {
                   onStart();
                 } else {
                   setUploadState('error');
                   setUploadMessage('Please upload a policy or try the Demo first!');
                 }
               }}
               className="w-full md:w-auto px-8 h-14 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all"
            >
              Get Started <ArrowRight size={18} />
            </button>
            <div className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">or</div>
            <button
               onClick={handleDemo}
               className="w-full md:w-auto px-8 h-14 bg-surface-container-low text-primary rounded-2xl font-black text-sm uppercase tracking-widest border border-primary/20 flex items-center justify-center gap-3 hover:bg-primary/5 active:scale-95 transition-all"
            >
              Try Demo Policy <Zap size={18} />
            </button>
          </div>
          
          {uploadState !== 'idle' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-primary animate-pulse">
              <ArrowBigUpDash size={16} />
              {uploadMessage}
            </div>
          )}
        </div>

        {/* Quick Select Company */}
        <div className="space-y-4">
           <p className="text-center text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Or Analyze Top Insurers Instantly</p>
           <div className="flex flex-wrap justify-center gap-4">
              {COMPANIES.map(company => (
                <button
                  key={company.id}
                  onClick={() => handleCompanyClick(company.id)}
                  className="flex items-center gap-3 px-6 py-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-95"
                >
                  <span className="text-xl">{company.logo}</span>
                  <span className="text-xs font-bold text-on-surface">{company.name}</span>
                </button>
              ))}
              <div className="w-10 h-10 rounded-full bg-surface-container-low border border-dashed border-outline-variant flex items-center justify-center text-outline-variant">
                <Plus size={20} />
              </div>
           </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Users className="text-primary" />} 
          stat="68%" 
          label="of users don't understand exclusions" 
        />
        <StatCard 
          icon={<CheckCircle className="text-[#10B981]" />} 
          stat="3X" 
          label="increase in policy confidence" 
        />
        <StatCard 
          icon={<Languages className="text-[#6366f1]" />} 
          stat="AI ENGINE" 
          label="NATIVE HINGLISH SUPPORT" 
        />
      </section>

      {/* Data Security Banner */}
      <div className="bg-[#10B981]/5 p-6 rounded-[2rem] border border-[#10B981]/15 flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] shrink-0 border border-[#10B981]/20">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h4 className="font-headline font-black text-on-surface">Data Shield Activated</h4>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Your documents are processed with end-to-end encryption. We never share or sell your coverage data.
          </p>
        </div>
      </div>
    </motion.main>
  );
};

function StatCard({ icon, stat, label }: { icon: any; stat: string; label: string }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-2xl font-black text-on-surface mb-1">{stat}</p>
      <p className="text-[10px] font-bold text-on-surface-variant uppercase leading-relaxed">{label}</p>
    </div>
  );
}
