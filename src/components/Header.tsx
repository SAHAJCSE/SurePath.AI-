import { useState, useEffect } from 'react';
import { User, Languages } from 'lucide-react';

export const Header = ({ locale, toggleLanguage }: { locale: 'en' | 'hi', toggleLanguage: () => void }) => {
  const [profileImage, setProfileImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuDV9yVn2Oa2ZjA1eglpBipuHrkUufp3AWRbCKeXDq8KTYARukLLzjTuC1kwzm2nzCqFm8ttH5ieV6RewqiAuFQRkZE2ebh4xiv5Lr6yVCJ8W7WkxBJ48uBn8PD0ROo9Ywoz4L6evxGNjalb3ulxew3y6vwoDub7U1kSjqGi03qthcE1UadlLiz2VnNrCQUz9tObkq6Pr-Xc3MTjwIB_wggnzb5-7VPISV87OhkOsl6pY9wKfjdQffctz0bd9Kl5uwtfotjlQA6rozEn');

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

    updateHeader();
    window.addEventListener('storage', updateHeader);
    const interval = setInterval(updateHeader, 2000); // Periodic check for real-time feel
    return () => {
      window.removeEventListener('storage', updateHeader);
      clearInterval(interval);
    };
  }, []);

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
      <h1 className="font-headline font-extrabold text-xl text-primary">SurePath AI</h1>
    </div>
    
    <div className="flex items-center gap-4">
      <button 
        onClick={toggleLanguage}
        className="notranslate flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95 shadow-sm"
      >
        <Languages size={16} className="text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider">{locale === 'en' ? 'English' : 'हिंदी'}</span>
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
