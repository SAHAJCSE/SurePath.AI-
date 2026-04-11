import { useState, useEffect } from 'react';
import { User, Languages, Zap, ArchiveRestore } from 'lucide-react';

export const Header = ({ locale, toggleLanguage }: { locale: 'en' | 'hi', toggleLanguage: () => void }) => {
  const [profileImage, setProfileImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuDV9yVn2Oa2ZjA1eglpBipuHrkUufp3AWRbCKeXDq8KTYARukLLzjTuC1kwzm2nzCqFm8ttH5ieV6RewqiAuFQRkZE2ebh4xiv5Lr6yVCJ8W7WkxBJ48uBn8PD0ROo9Ywoz4L6evxGNjalb3ulxew3y6vwoDub7U1kSjqGi03qthcE1UadlLiz2VnNrCQUz9tObkq6Pr-Xc3MTjwIB_wggnzb5-7VPISV87OhkOsl6pY9wKfjdQffctz0bd9Kl5uwtfotjlQA6rozEn');
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      try {
        const raw = localStorage.getItem('surepath_user_profile');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.profileImage) setProfileImage(parsed.profileImage);
        }
      } catch (e) { /* ignore */ }
    };

    const updateMode = () => {
      setDemoMode(localStorage.getItem('surepath_demo_mode') === 'demo');
    };

    updateHeader();
    updateMode();
    window.addEventListener('storage', updateHeader);
    window.addEventListener('surepath_mode_toggle', updateMode);
    
    const interval = setInterval(updateHeader, 2000); // Periodic check for real-time feel
    return () => {
      window.removeEventListener('storage', updateHeader);
      window.removeEventListener('surepath_mode_toggle', updateMode);
      clearInterval(interval);
    };
  }, []);

  const handleToggleDemo = () => {
    const nextMode = demoMode ? 'real' : 'demo';
    setDemoMode(!demoMode);
    localStorage.setItem('surepath_demo_mode', nextMode);
    window.dispatchEvent(new Event('surepath_mode_toggle'));
  };

  return (
  <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-surface/80 backdrop-blur-xl z-50 border-b border-outline-variant/30">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-outline-variant/20">
        <img 
          alt="SurePath AI Logo" 
          className="w-full h-full object-contain" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV9yVn2Oa2ZjA1eglpBipuHrkUufp3AWRbCKeXDq8KTYARukLLzjTuC1kwzm2nzCqFm8ttH5ieV6RewqiAuFQRkZE2ebh4xiv5Lr6yVCJ8W7WkxBJ48uBn8PD0ROo9Ywoz4L6evxGNjalb3ulxew3y6vwoDub7U1kSjqGi03qthcE1UadlLiz2VnNrCQUz9tObkq6Pr-Xc3MTjwIB_wggnzb5-7VPISV87OhkOsl6pY9wKfjdQffctz0bd9Kl5uwtfotjlQA6rozEn" 
          referrerPolicy="no-referrer"
        />
      </div>
      <h1 className="font-headline font-extrabold text-xl text-primary hidden sm:block">SurePath AI</h1>
    </div>
    
    <div className="flex items-center gap-4">
      <button 
        onClick={toggleLanguage}
        className="notranslate flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95 shadow-lg shadow-primary/5 group"
      >
        <Languages size={18} className="transition-transform group-hover:rotate-12" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest leading-none">
          {locale === 'en' ? 'Hindi' : 'English'}
        </span>
      </button>

      <button 
        onClick={handleToggleDemo}
        className={`hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl border transition-all active:scale-95 shadow-lg group ${
          demoMode 
            ? 'bg-amber-100 text-amber-600 border-amber-300 hover:bg-amber-200' 
            : 'bg-surface-container-low text-primary border-outline-variant/30 hover:bg-primary/5 hover:border-primary/20'
        }`}
      >
        {demoMode ? (
          <>
            <ArchiveRestore size={18} className="transition-transform group-hover:-rotate-12" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest leading-none">
              Exit Demo
            </span>
          </>
        ) : (
          <>
            <Zap size={18} className="transition-transform group-hover:scale-110" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest leading-none">
              Try Demo Policy
            </span>
          </>
        )}
      </button>

      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
        <img 
          className="w-full h-full object-cover" 
          alt="User Profile" 
          src={profileImage}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  </header>
  );
};
