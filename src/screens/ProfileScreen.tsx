import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, User, ChevronRight, FileText, LogOut, Shield, History, HelpCircle, Headphones, Verified, Settings, Mail, Phone, MessageSquare, ExternalLink } from 'lucide-react';

type ProfileForm = {
  firstName: string;
  lastName: string;
  gender: string;
};

function getStoredProfile() {
  try {
    const raw = localStorage.getItem('surepath_user_profile');
    if (!raw) return null;
    return JSON.parse(raw) as { form: ProfileForm; profileImage?: string };
  } catch {
    return null;
  }
}

export const ProfileScreen = ({ onEdit, onHelp }: { onEdit: () => void, onHelp: () => void }) => {
  const profileInfoRef = useRef<HTMLDivElement | null>(null);
  const documentsRef = useRef<HTMLDivElement | null>(null);
  const [profileData, setProfileData] = useState(getStoredProfile());
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const syncProfile = () => setProfileData(getStoredProfile());
    window.addEventListener('storage', syncProfile);
    const interval = setInterval(syncProfile, 1000);
    return () => {
      window.removeEventListener('storage', syncProfile);
      clearInterval(interval);
    };
  }, []);
  
  const firstName = profileData?.form?.firstName || 'User';
  const lastName = profileData?.form?.lastName || '';
  const profileImage = profileData?.profileImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV9yVn2Oa2ZjA1eglpBipuHrkUufp3AWRbCKeXDq8KTYARukLLzjTuC1kwzm2nzCqFm8ttH5ieV6RewqiAuFQRkZE2ebh4xiv5Lr6yVCJ8W7WkxBJ48uBn8PD0ROo9Ywoz4L6evxGNjalb3ulxew3y6vwoDub7U1kSjqGi03qthcE1UadlLiz2VnNrCQUz9tObkq6Pr-Xc3MTjwIB_wggnzb5-7VPISV87OhkOsl6pY9wKfjdQffctz0bd9Kl5uwtfotjlQA6rozEn';

  return (
  <motion.main 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="pt-20 pb-32"
  >
    <section className="flex flex-col items-center px-6 py-8">
      <div className="relative mb-4 group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-lg">
          <img 
            alt={firstName} 
            className="w-full h-full object-cover" 
            src={profileImage} 
            referrerPolicy="no-referrer"
          />
        </div>
        <button 
          onClick={onEdit}
          className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-on-primary shadow-md active:scale-90 transition-transform"
        >
          <Settings size={14} />
        </button>
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight mb-1 text-on-surface">{firstName} {lastName}</h2>
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold tracking-wide uppercase">
        <Verified size={14} className="mr-1" fill="currentColor" />
        Premium Member
      </div>
    </section>

    <div className="mx-4 mb-6 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      {[
        { icon: User, label: 'Profile Info', color: 'text-blue-600', bg: 'bg-blue-500/10' },
        { icon: FileText, label: 'Documents', color: 'text-blue-600', bg: 'bg-blue-500/10' },
        { icon: User, label: 'Add Account', color: 'text-blue-600', bg: 'bg-blue-500/10' }
      ].map((item, i) => (
        <div key={i}>
          <button
            onClick={() => {
              if (item.label === 'Profile Info') onEdit();
              if (item.label === 'Documents') documentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="w-full flex items-center justify-between px-4 py-3 active:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                <item.icon size={20} />
              </div>
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-outline-variant" />
          </button>
          {i < 2 && <div className="ml-14 border-b border-outline-variant/10" />}
        </div>
      ))}
    </div>

    <div ref={profileInfoRef}>
      <h3 className="px-8 mb-2 text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Insurance</h3>
    </div>
    <div className="mx-4 mb-6 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      <button 
        onClick={() => setExpanded(expanded === 'policies' ? null : 'policies')}
        className="w-full flex items-center justify-between px-4 py-4 active:bg-surface-container-low transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center">
            <Shield size={20} />
          </div>
          <span className="font-medium">Active Policies</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">2 Active</span>
          <ChevronRight size={20} className={`text-outline-variant transition-transform ${expanded === 'policies' ? 'rotate-90' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded === 'policies' && (
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 'auto' }} 
            exit={{ height: 0 }} 
            className="overflow-hidden bg-surface-container-low"
          >
            <div className="p-4 space-y-3 border-t border-outline-variant/10">
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <p className="text-xs font-bold text-primary">HDFC ERGO Optima Secure</p>
                <p className="text-[10px] text-on-surface-variant">Sum Insured: ₹10,00,000</p>
              </div>
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <p className="text-xs font-bold text-primary">LIC Jeevan Arogya</p>
                <p className="text-[10px] text-on-surface-variant">Sum Insured: ₹5,00,000</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="ml-14 border-b border-outline-variant/10" />

      <button 
        onClick={() => setExpanded(expanded === 'claims' ? null : 'claims')}
        className="w-full flex items-center justify-between px-4 py-4 active:bg-surface-container-low transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center">
            <History size={20} />
          </div>
          <span className="font-medium">Claim History</span>
        </div>
        <ChevronRight size={20} className={`text-outline-variant transition-transform ${expanded === 'claims' ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded === 'claims' && (
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 'auto' }} 
            exit={{ height: 0 }} 
            className="overflow-hidden bg-surface-container-low"
          >
            <div className="p-8 text-center border-t border-outline-variant/10">
              <History className="mx-auto text-outline-variant mb-2" size={32} />
              <p className="text-sm font-medium text-on-surface-variant italic">No claims filed yet.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <h3 className="px-8 mb-2 text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Security</h3>
    <div className="mx-4 mb-6 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      <div className="w-full flex items-center justify-between px-4 py-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <span className="font-medium">Data Shield Status</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-tertiary font-bold text-sm tracking-wide">ACTIVE</span>
          <Verified size={16} className="text-tertiary" fill="currentColor" />
        </div>
      </div>
    </div>

    <div className="mx-4 mb-6 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      <button 
        onClick={onHelp}
        className="w-full flex items-center justify-between px-4 py-4 active:bg-surface-container-low transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center">
            <HelpCircle size={20} />
          </div>
          <span className="font-medium">Help Center</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">AI BOT</span>
          <ChevronRight size={20} className="text-outline-variant" />
        </div>
      </button>

      <div className="ml-14 border-b border-outline-variant/10" />

      <button 
        onClick={() => setExpanded(expanded === 'concierge' ? null : 'concierge')}
        className="w-full flex items-center justify-between px-4 py-4 active:bg-surface-container-low transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center">
            <Headphones size={20} />
          </div>
          <span className="font-medium">Contact Concierge</span>
        </div>
        <ChevronRight size={20} className={`text-outline-variant transition-transform ${expanded === 'concierge' ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded === 'concierge' && (
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 'auto' }} 
            exit={{ height: 0 }} 
            className="overflow-hidden bg-surface-container-low"
          >
            <div className="p-4 space-y-3 border-t border-outline-variant/10">
              <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl">
                <Phone size={16} className="text-primary" />
                <span className="text-xs font-bold">+91 1800-410-SHIELD</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-on-primary rounded-xl text-xs font-bold">
                <MessageSquare size={16} />
                <span>Start Live Chat</span>
              </button>
              <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl">
                <Mail size={16} className="text-primary" />
                <span className="text-xs font-bold">support@surepath.ai</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <div ref={documentsRef} className="mx-4 mb-6 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      <div className="px-4 py-3 border-b border-outline-variant/10">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Documents</p>
      </div>
      {['PAN_Card.pdf', 'Policy_Document.pdf'].map((doc) => (
        <div key={doc} className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-error-container/20 text-error flex items-center justify-center">
              <FileText size={16} />
            </div>
            <span className="text-sm font-medium">{doc}</span>
          </div>
          <span className="text-xs font-bold text-tertiary">Verified</span>
        </div>
      ))}
    </div>

    <div className="mx-4 mb-6 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      <button className="w-full flex items-center justify-between px-4 py-3 active:bg-surface-container-low transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-error-container/20 text-error flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <span className="font-bold text-error">Sign Out</span>
        </div>
      </button>
    </div>

    <div className="text-center px-6 py-4">
      <p className="text-[10px] text-outline tracking-widest uppercase font-bold">SurePath AI | v2.4.0</p>
    </div>
  </motion.main>
  );
};
