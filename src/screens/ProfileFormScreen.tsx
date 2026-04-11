import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

type ProfileForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  countryCode: string;
  mobile: string;
  email: string;
  pinCode: string;
};

const initialForm: ProfileForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  gender: 'Male',
  countryCode: '+91',
  mobile: '',
  email: '',
  pinCode: '',
};

function getStoredProfile() {
  try {
    const raw = localStorage.getItem('surepath_user_profile');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed as { form: ProfileForm; profileImage?: string };
  } catch {
    return null;
  }
}

function Field({ label, children, error, required }: { label: string; children: ReactNode; error?: string; required?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold tracking-wide uppercase text-on-surface-variant">
        {label} {required ? <span className="text-error">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  );
}

export const ProfileFormScreen = ({ onSaved }: { onSaved: () => void }) => {
  const stored = getStoredProfile();
  const [isEditing, setIsEditing] = useState(true);
  const [form, setForm] = useState<ProfileForm>(stored?.form ?? initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedMessage, setSavedMessage] = useState('');
  const [profileImage, setProfileImage] = useState<string>(
    stored?.profileImage ??
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDV9yVn2Oa2ZjA1eglpBipuHrkUufp3AWRbCKeXDq8KTYARukLLzjTuC1kwzm2nzCqFm8ttH5ieV6RewqiAuFQRkZE2ebh4xiv5Lr6yVCJ8W7WkxBJ48uBn8PD0ROo9Ywoz4L6evxGNjalb3ulxew3y6vwoDub7U1kSjqGi03qthcE1UadlLiz2VnNrCQUz9tObkq6Pr-Xc3MTjwIB_wggnzb5-7VPISV87OhkOsl6pY9wKfjdQffctz0bd9Kl5uwtfotjlQA6rozEn'
  );

  const setField = (key: keyof ProfileForm, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  // Auto-save draft on every change
  useEffect(() => {
    localStorage.setItem('surepath_user_profile', JSON.stringify({ form, profileImage }));
  }, [form, profileImage]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!form.mobile.match(/^\d{10}$/)) nextErrors.mobile = 'Enter valid 10-digit mobile number.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) nextErrors.email = 'Enter a valid email address.';
    if (!form.pinCode.match(/^\d{6}$/)) nextErrors.pinCode = 'PIN code must be 6 digits.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveChanges = () => {
    setSavedMessage('');
    if (!validate()) return;
    localStorage.setItem('surepath_user_profile', JSON.stringify({ form, profileImage }));
    localStorage.setItem('surepath_user_logged_in', 'true');
    setSavedMessage('Profile updated successfully.');
    setTimeout(onSaved, 300);
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-24 pb-32 px-4 max-w-4xl mx-auto space-y-6">
      <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/15">
        <div className="flex items-center justify-between mb-5 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-on-surface">Profile Details</h2>
            <p className="text-sm text-on-surface-variant">Edit your basic user information.</p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-outline-variant/20">
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low text-sm font-semibold cursor-pointer">
            <Camera size={16} />
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setProfileImage(String(reader.result || profileImage));
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="First Name" required error={errors.firstName}><input value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} disabled={!isEditing} className="h-11 w-full rounded-xl bg-surface-container-low px-3 outline-none" /></Field>
          <Field label="Middle Name"><input value={form.middleName} onChange={(e) => setField('middleName', e.target.value)} disabled={!isEditing} className="h-11 w-full rounded-xl bg-surface-container-low px-3 outline-none" /></Field>
          <Field label="Last Name" required error={errors.lastName}><input value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} disabled={!isEditing} className="h-11 w-full rounded-xl bg-surface-container-low px-3 outline-none" /></Field>
          <Field label="Date of Birth"><input type="date" value={form.dob} onChange={(e) => setField('dob', e.target.value)} disabled={!isEditing} className="h-11 w-full rounded-xl bg-surface-container-low px-3 outline-none" /></Field>
          <Field label="Gender"><select value={form.gender} onChange={(e) => setField('gender', e.target.value)} disabled={!isEditing} className="h-11 w-full rounded-xl bg-surface-container-low px-3 outline-none"><option>Male</option><option>Female</option><option>Other</option></select></Field>
          <Field label="Country Code"><select value={form.countryCode} onChange={(e) => setField('countryCode', e.target.value)} disabled={!isEditing} className="h-11 w-full rounded-xl bg-surface-container-low px-3 outline-none"><option value="+91">IN +91</option><option value="+1">US +1</option><option value="+44">UK +44</option><option value="+971">UAE +971</option></select></Field>
          <Field label="Mobile Number" required error={errors.mobile}><input value={form.mobile} onChange={(e) => setField('mobile', e.target.value.replace(/\D/g, ''))} disabled={!isEditing} className="h-11 w-full rounded-xl bg-surface-container-low px-3 outline-none" /></Field>
          <Field label="Email" required error={errors.email}><input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} disabled={!isEditing} className="h-11 w-full rounded-xl bg-surface-container-low px-3 outline-none" /></Field>
          <Field label="PIN Code" error={errors.pinCode}><input value={form.pinCode} onChange={(e) => setField('pinCode', e.target.value.replace(/\D/g, ''))} disabled={!isEditing} className="h-11 w-full rounded-xl bg-surface-container-low px-3 outline-none" /></Field>
        </div>
      </section>
      <section className="flex items-center gap-3">
        <button onClick={saveChanges} disabled={!isEditing} className="px-5 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold disabled:opacity-40">Save Changes</button>
        {savedMessage ? <div className="inline-flex items-center gap-2 text-sm text-tertiary font-semibold"><ShieldCheck size={16} />{savedMessage}</div> : null}
      </section>
    </motion.main>
  );
};

