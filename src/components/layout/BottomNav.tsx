import { motion, AnimatePresence } from 'motion/react';
import { BarChart2, ShieldCheck, Calculator, User, Home, CheckCircle } from 'lucide-react';
import { Screen } from '../../types/index';

export const BottomNav = ({ activeScreen, setScreen }: { activeScreen: Screen, setScreen: (s: Screen) => void }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'summary', icon: BarChart2, label: 'Summary' },
    { id: 'coverage', icon: ShieldCheck, label: 'Coverage' },
    { id: 'simulator', icon: Calculator, label: 'Simulator' },
    { id: 'claim-checker', icon: CheckCircle, label: 'Check Claim' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 bg-surface/80 backdrop-blur-xl rounded-t-3xl border-t border-white/10 shadow-[0_-12px_24px_-4px_rgba(25,27,35,0.06)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id as Screen)}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-300 ${activeScreen === item.id ? 'text-primary' : 'text-outline'
            }`}
        >
          <item.icon size={24} fill={activeScreen === item.id ? 'currentColor' : 'none'} />
          <span className="font-body text-[10px] font-semibold uppercase tracking-wider mt-1">{item.label}</span>
          {activeScreen === item.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
            />
          )}
        </button>
      ))}
    </nav>
  );
};
