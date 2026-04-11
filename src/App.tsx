
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { Screen } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { CoverageScreen } from './screens/CoverageScreen';
import { SimulatorScreen } from './screens/SimulatorScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ProviderSelection } from './screens/ProviderSelection';
import { PolicyVerification } from './screens/PolicyVerification';
import { AssistantScreen } from './screens/AssistantScreen';
import { ProfileFormScreen } from './screens/ProfileFormScreen';

// --- Components ---





// --- Screen Components ---















// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [locale, setLocale] = useState<'en' | 'hi'>(() => {
    return (localStorage.getItem('surepath_locale') as 'en' | 'hi') || 'en';
  });

  const toggleLanguage = () => {
    const next = locale === 'en' ? 'hi' : 'en';
    setLocale(next);
    localStorage.setItem('surepath_locale', next);
    
    // Trigger browser translation via Google Translate
    try {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = next;
        select.dispatchEvent(new Event('change'));
      }
    } catch (e) {
      console.error('Google Translate trigger failed', e);
    }
    
    document.documentElement.lang = next;
  };

  useEffect(() => {
    // Hidden Google Translate init check or auto-apply on load
    const timer = setTimeout(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select && select.value !== locale) {
        select.value = locale;
        select.dispatchEvent(new Event('change'));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [locale]);

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header locale={locale} toggleLanguage={toggleLanguage} />
      
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomeScreen onStart={() => setScreen('provider')} />
          </motion.div>
        )}
        {screen === 'provider' && (
          <motion.div key="provider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProviderSelection
              onSelect={(provider) => {
                setSelectedProvider(provider);
                setScreen('verification');
              }}
            />
          </motion.div>
        )}
        {screen === 'verification' && (
          <motion.div key="verification" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PolicyVerification onVerify={() => setScreen('summary')} />
          </motion.div>
        )}
        {screen === 'summary' && (
          <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SummaryScreen />
          </motion.div>
        )}
        {screen === 'coverage' && (
          <motion.div key="coverage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CoverageScreen />
          </motion.div>
        )}
        {screen === 'simulator' && (
          <motion.div key="simulator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SimulatorScreen />
          </motion.div>
        )}
        {screen === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfileScreen 
              onEdit={() => setScreen('profile_form')} 
              onHelp={() => setScreen('assistant')}
            />
          </motion.div>
        )}
        {screen === 'profile_form' && (
          <motion.div key="profile_form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfileFormScreen onSaved={() => setScreen('profile')} />
          </motion.div>
        )}
        {screen === 'assistant' && (
          <motion.div key="assistant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AssistantScreen provider={selectedProvider} />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeScreen={screen} setScreen={setScreen} />
      {screen !== 'assistant' && (
        <button
          onClick={() => setScreen('assistant')}
          className="fixed bottom-28 left-4 z-50 w-14 h-14 rounded-full bg-primary text-on-primary shadow-xl flex items-center justify-center active:scale-95"
          aria-label="Open AI assistant"
        >
          <MessageCircle size={24} />
        </button>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
