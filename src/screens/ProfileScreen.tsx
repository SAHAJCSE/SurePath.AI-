import { useRef } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, User, ChevronRight, FileText, LogOut, Shield, History, HelpCircle, Headphones, ScanFace, Verified, Settings } from 'lucide-react';

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

export const ProfileScreen = ({ onEdit }: { onEdit: () => void }) => {
  const profileInfoRef = useRef<HTMLDivElement | null>(null);
  const documentsRef = useRef<HTMLDivElement | null>(null);
  const stored = getStoredProfile();
  
  const firstName = stored?.form?.firstName || 'Alexander';
  const lastName = stored?.form?.lastName || 'Sterling';
  const profileImage = stored?.profileImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp9VKaMkpzqXYcAs45N1Xi0mFAuI4yxOA7AtWXwpXSSSFvrJE1gYqf1Dftiq048fgOb2ZJPPudseEszT0YsF9DhOVA3epnsPasIEAqiYLdUgO11iAB0bQCq6OZupbgxM6D6HIzhfv9t2Xtd3DiA2MD_B9UYjB0RQsEEcOJ0ITwN1US9WEBp6ag3m7_IDcWpXQwOPdyn5msYpRkckPHHL0LCZHkhXaqU4jYXgCCAW8XjKNkqVtu6CtlRU_oRiBQXit1QxqntNJvbjgz';

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
      <button className="w-full flex items-center justify-between px-4 py-3 active:bg-surface-container-low transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center">
            <Shield size={20} />
          </div>
          <span className="font-medium">Active Policies</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">2 Active</span>
          <ChevronRight size={20} className="text-outline-variant" />
        </div>
      </button>
      <div className="ml-14 border-b border-outline-variant/10" />
      <button className="w-full flex items-center justify-between px-4 py-3 active:bg-surface-container-low transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center">
            <History size={20} />
          </div>
          <span className="font-medium">Claim History</span>
        </div>
        <ChevronRight size={20} className="text-outline-variant" />
      </button>
    </div>

    <h3 className="px-8 mb-2 text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Security</h3>
    <div className="mx-4 mb-6 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center">
            <ScanFace size={20} />
          </div>
          <span className="font-medium">Face ID</span>
        </div>
        <div className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </div>
      </div>
      <div className="ml-14 border-b border-outline-variant/10" />
      <button className="w-full flex items-center justify-between px-4 py-3 active:bg-surface-container-low transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <span className="font-medium">Data Shield Status</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-tertiary font-semibold text-sm">Active</span>
          <ChevronRight size={20} className="text-outline-variant" />
        </div>
      </button>
    </div>

    <div className="mx-4 mb-6 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      <button className="w-full flex items-center justify-between px-4 py-3 active:bg-surface-container-low transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center">
            <HelpCircle size={20} />
          </div>
          <span className="font-medium">Help Center</span>
        </div>
        <ChevronRight size={20} className="text-outline-variant" />
      </button>
      <div className="ml-14 border-b border-outline-variant/10" />
      <button className="w-full flex items-center justify-between px-4 py-3 active:bg-surface-container-low transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center">
            <Headphones size={20} />
          </div>
          <span className="font-medium">Contact Concierge</span>
        </div>
        <ChevronRight size={20} className="text-outline-variant" />
      </button>
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
