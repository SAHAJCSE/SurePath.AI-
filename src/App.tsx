
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { Screen } from './types/index';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { CoverageScreen } from './screens/CoverageScreen';
import { SimulatorScreen } from './screens/SimulatorScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ProviderSelection } from './screens/ProviderSelection';
import { PolicyVerification } from './screens/PolicyVerification';
import { AssistantScreen } from './screens/AssistantScreen';
import { ProfileFormScreen } from './screens/ProfileFormScreen';
import { ClaimCheckerScreen } from './screens/ClaimCheckerScreen';
import { TranslationConsent } from './components/layout/TranslationConsent';

// --- Components ---





// --- Screen Components ---















// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    return (localStorage.getItem('surepath_active_screen') as Screen) || 'home';
  });

  const handleSetScreen = (newScreen: Screen) => {
    setScreen(newScreen);
    localStorage.setItem('surepath_active_screen', newScreen);
  };

  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showConsent, setShowConsent] = useState(false);
  const [locale, setLocale] = useState<'en' | 'hi'>(() => {
    return (localStorage.getItem('surepath_locale') as 'en' | 'hi') || 'en';
  });

  const triggerTranslation = (targetLocale: 'en' | 'hi') => {
    setLocale(targetLocale);
    localStorage.setItem('surepath_locale', targetLocale);
    document.documentElement.lang = targetLocale;

    // Trigger actual Google Translate dropdown
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = targetLocale;
      select.dispatchEvent(new Event('change'));
    }
  };

  const toggleLanguage = () => {
    const next = locale === 'en' ? 'hi' : 'en';

    // Check for explicit consent if switching to Hindi
    const hasConsent = localStorage.getItem('surepath_translation_consent') === 'true';

    if (next === 'hi' && !hasConsent) {
      setShowConsent(true);
    } else {
      triggerTranslation(next);
    }
  };

  const handleGrantConsent = () => {
    localStorage.setItem('surepath_translation_consent', 'true');
    setShowConsent(false);
    triggerTranslation('hi');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header locale={locale} toggleLanguage={toggleLanguage} />

      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomeScreen onStart={() => handleSetScreen('provider')} />
          </motion.div>
        )}
        {screen === 'provider' && (
          <motion.div key="provider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProviderSelection
              onSelect={(provider) => {
                setSelectedProvider(provider);
                handleSetScreen('verification');
              }}
            />
          </motion.div>
        )}
        {screen === 'verification' && (
          <motion.div key="verification" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PolicyVerification onVerify={() => handleSetScreen('summary')} />
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
              onEdit={() => handleSetScreen('profile_form')}
              onHelp={() => handleSetScreen('assistant')}
            />
          </motion.div>
        )}
        {screen === 'profile_form' && (
          <motion.div key="profile_form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfileFormScreen onSaved={() => handleSetScreen('profile')} />
          </motion.div>
        )}
        {screen === 'assistant' && (
          <motion.div key="assistant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AssistantScreen provider={selectedProvider} locale={locale} />
          </motion.div>
        )}
        {screen === 'claim-checker' && (
          <motion.div key="claim-checker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ClaimCheckerScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeScreen={screen} setScreen={handleSetScreen} />
      {screen !== 'assistant' && (
        <button
          onClick={() => handleSetScreen('assistant')}
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

      <AnimatePresence>
        {showConsent && (
          <TranslationConsent
            onAccept={handleGrantConsent}
            onCancel={() => setShowConsent(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
