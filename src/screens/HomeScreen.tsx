import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart2, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';

const API_BASE = `http://${window.location.hostname || 'localhost'}:5050`;

export const HomeScreen = ({ onStart }: { onStart: () => void }) => {
  const [fileName, setFileName] = useState<string>('');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  async function uploadPolicy(file: File) {
    setUploadState('uploading');
    setUploadMessage('Uploading and analyzing file...');
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch(`${API_BASE}/api/policy/upload`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('upload_failed');

      const data = await res.json();
      const policyId = String(data?.policyId || '');
      if (!policyId) throw new Error('missing_policy_id');

      localStorage.setItem('surepath_policy_id', policyId);
      localStorage.setItem('surepath_policy_name', file.name);
      setUploadState('done');
      setUploadMessage(`Policy uploaded successfully (${file.name})`);
    } catch {
      setUploadState('error');
      setUploadMessage('Upload failed. Please try again.');
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md flex-1 flex flex-col pt-24 px-6 pb-32 mx-auto"
    >
    <section className="mt-8 mb-12">
      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-10 shadow-xl">
        <img 
          className="w-full h-full object-cover" 
          alt="AI Data Visualization" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlZjct-1UhE5YTU4qIwMRCZDaFwBimx3MW-jhdOBYKBpzy_mJimviATdIyM-V6ddDQtJw7YvTCnVKwCX0PpQCZzx4aGyZByRQv34eREFYYKOCU0t2xaYG1YIdXiWtFPBcQSoSVjJ0kG_PJ42lUAuuhM_i3HI3xJsILkwHY8W2f8n481J6EW5_MetOZKKeB5VQbvJWjf9W9Xvzza3hsJF1V5qoX74iAmAjzfAp-C3l4qxfaJQVuiZV1L0ulEmokdLf3d8eSxtaI2DDL" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-surface-container-lowest/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <p className="text-white font-headline font-bold text-xl leading-tight">Smart Insurance Policy Simplifier</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface leading-[1.1]">
          Understand Insurance <span className="text-primary-container">in Seconds</span>
        </h2>
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-[90%]">
          We break down complex legalese into clear, actionable insights powered by AI tailored to your coverage.
        </p>
      </div>
    </section>

      <section className="space-y-4">
        <button
          onClick={onStart}
          className="w-full py-5 px-8 rounded-3xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg shadow-[0_12px_24px_-4px_rgba(0,61,155,0.25)] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          Get Started
          <ArrowRight size={20} />
        </button>
        <label className="w-full cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 border-primary/20 bg-surface-container-lowest hover:bg-surface-container-low transition-colors active:scale-95">
          <BarChart2 className="text-primary" size={32} />
          <span className="font-label font-bold text-base text-on-surface text-center leading-tight">Upload Policy (PDF/Text)</span>
          <span className="text-xs text-on-surface-variant">{fileName || 'Tap to choose file'}</span>
          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setFileName(file.name);
              uploadPolicy(file);
            }}
          />
        </label>
        {uploadState !== 'idle' && (
          <p className={`text-xs font-semibold ${uploadState === 'error' ? 'text-error' : 'text-on-surface-variant'}`}>
            {uploadMessage}
          </p>
        )}
        <div className="grid grid-cols-1 gap-4">
        <button onClick={onStart} className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-surface-container-low hover:bg-surface-container-high transition-colors active:scale-95">
          <Building2 className="text-primary" size={32} />
          <span className="font-label font-semibold text-sm text-on-surface text-center leading-tight">Select Company</span>
        </button>
        </div>
      </section>

      <section className="mt-12">
      <div className="p-6 rounded-3xl bg-secondary-container/20 border border-secondary-fixed-dim/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center">
            <ShieldCheck className="text-on-secondary-container" size={24} fill="currentColor" />
          </div>
          <div className="flex-1">
            <h4 className="font-headline font-bold text-on-surface">Data Shield Activated</h4>
            <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">Your documents are encrypted and processed locally. We never sell your personal data.</p>
          </div>
        </div>
      </div>
      </section>
    </motion.main>
  );
};
