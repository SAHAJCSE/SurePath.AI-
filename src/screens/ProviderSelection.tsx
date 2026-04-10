import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronRight, SearchIcon, Home } from 'lucide-react';

type ProviderSelectionProps = {
  onSelect: (provider: string) => void;
};

const providers = [
  { name: 'LIC', tag: 'State Owned' },
  { name: 'HDFC Life', tag: 'Top Rated' },
  { name: 'SBI Life', tag: 'Banking Trust' },
  { name: 'ICICI Prudential', tag: 'Fast Track' },
  { name: 'Others', tag: 'Custom' },
];

export const ProviderSelection = ({ onSelect }: ProviderSelectionProps) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string>('');
  const [showValidation, setShowValidation] = useState(false);

  const filteredProviders = useMemo(
    () => providers.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
  <motion.main
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="pt-24 px-6 max-w-2xl mx-auto pb-32"
  >
    <div className="mb-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Select Provider</h2>
      <p className="text-on-surface-variant text-sm font-medium">Choose your preferred insurance company to start the simulation.</p>
    </div>

    <div className="relative mb-10 group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <SearchIcon className="text-outline" size={20} />
      </div>
      <input
        className="w-full h-14 pl-12 pr-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all" 
        placeholder="Search insurance companies..." 
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>

    <div className="grid grid-cols-1 gap-4">
      {filteredProviders.map((provider) => {
        const isSelected = selected === provider.name;
        return (
          <button
            key={provider.name}
            onClick={() => {
              setSelected(provider.name);
              setShowValidation(false);
            }}
            className={`relative group overflow-hidden p-5 rounded-3xl flex items-center justify-between transition-all active:scale-95 shadow-[0_12px_24px_-4px_rgba(25,27,35,0.06)] ${isSelected ? 'bg-primary text-on-primary ring-2 ring-primary' : 'bg-surface-container-lowest hover:scale-[1.01]'}`}
          >
            <div className="flex items-center gap-4 text-left">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-on-primary/20' : 'bg-surface-container-low'}`}>
                {provider.name === 'Others' ? <Home size={22} /> : <ShieldCheck size={22} />}
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>{provider.tag}</p>
                <h3 className="font-bold">{provider.name}</h3>
              </div>
            </div>
            <ChevronRight className={`${isSelected ? 'text-on-primary' : 'text-primary-container'} group-hover:translate-x-1 transition-transform`} />
          </button>
        );
      })}
    </div>

    {showValidation && (
      <p className="mt-4 text-sm text-error font-semibold">Please select a company before continuing.</p>
    )}

    <button
      onClick={() => {
        if (!selected) {
          setShowValidation(true);
          return;
        }
        onSelect(selected);
      }}
      className="mt-5 w-full h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold"
    >
      Continue with {selected || 'Selected Provider'}
    </button>

    <div className="mt-12 p-6 bg-gradient-to-br from-primary to-primary-container rounded-[2rem] text-on-primary shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <ShieldCheck className="text-4xl mb-4" size={40} fill="currentColor" />
        <h4 className="text-xl font-bold mb-2">Need Help Choosing?</h4>
        <p className="text-on-primary-container text-sm leading-relaxed mb-4">Compare up to 3 providers side-by-side to see coverage benefits and premium differences instantly.</p>
        <button className="bg-surface-container-lowest text-primary px-6 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform">
          Start Comparison
        </button>
      </div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  </motion.main>
  );
};
