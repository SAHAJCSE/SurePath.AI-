import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Send } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

type AssistantScreenProps = {
  provider?: string;
};

import { API_BASE } from '../config';
const QUICK = ['Ask about accident coverage', 'Check claim eligibility', 'What documents are required?', 'Show my saved profile summary'];

type SavedProfile = {
  form: {
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
};

function getSavedProfile(): SavedProfile | null {
  try {
    const raw = localStorage.getItem('surepath_user_profile');
    if (!raw) return null;
    return JSON.parse(raw) as SavedProfile;
  } catch {
    return null;
  }
}

function localAssistantReply(question: string, hasPolicy: boolean, loggedIn: boolean, savedProfile: SavedProfile | null) {
  const q = question.toLowerCase();
  if (!loggedIn) {
    return 'Please complete your profile first. Once logged in profile is available, I can answer using your saved details and policy.';
  }
  if (q.includes('saved profile') || q.includes('my profile') || q.includes('my details')) {
    if (!savedProfile?.form) return 'No saved profile data found yet. Please save your profile once.';
    const u = savedProfile.form;
    return `Saved profile: ${u.firstName} ${u.lastName}, ${u.gender}, DOB ${u.dob}, Mobile ${u.countryCode} ${u.mobile}, Email ${u.email}, PIN ${u.pinCode}.`;
  }

  if (q.includes('accident')) {
    return 'Accident coverage is typically active, but exclusions like alcohol/drug influence can reject claims. Keep FIR + hospital records ready.';
  }
  if (q.includes('eligible') || q.includes('eligibility')) {
    return 'Eligibility usually needs: active policy, paid premium, waiting period completion, and no exclusion trigger.';
  }
  if (q.includes('document') || q.includes('docs')) {
    return 'Common documents: policy number, ID proof, claim form, medical reports, bills, and FIR for accident cases.';
  }
  if (q.includes('claim') || q.includes('amount')) {
    return 'Claim amount depends on your sum assured and clause limits. Demo estimate: accident up to ₹5 lakh, natural death around ₹3 lakh.';
  }
  if (q.includes('hospital')) {
    return 'Hospitalization is usually covered for in-patient treatment. Cashless works in network hospitals; reimbursement works with bills.';
  }
  return 'I can help with coverage, claim process, eligibility, exclusions, and required documents. Try asking a specific scenario.';
}

export const AssistantScreen = ({ provider }: AssistantScreenProps) => {
  const policyId = localStorage.getItem('surepath_policy_id') || '';
  const policyName = localStorage.getItem('surepath_policy_name') || '';
  const loggedIn = localStorage.getItem('surepath_user_logged_in') === 'true';
  const savedProfile = getSavedProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: loggedIn
        ? `Hello ${savedProfile?.form?.firstName || ''}! I can help you with questions about coverage, eligibility, and the claims process.`
        : 'Hello! I can help you with insurance questions. Please save your profile for personalized answers.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  const sendMessage = async (rawText?: string) => {
    const text = (rawText ?? input).trim();
    if (!text || isLoading) return;

    const nextMessages = [...messages, { role: 'user' as const, text }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // WhatsApp-like typing pause before response.
      await new Promise((r) => setTimeout(r, 700));
      const reply = localAssistantReply(text, Boolean(policyId), loggedIn, savedProfile);
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setError('Something went wrong, try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-6 max-w-2xl mx-auto"
    >
      <section className="mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">
          <Bot size={14} />
          AI Assistant
        </div>
        <h2 className="text-3xl font-extrabold mt-3">Policy Help Chat</h2>
        <p className="text-sm text-on-surface-variant mt-1">Continuous conversation with context awareness across follow-up questions.</p>

      </section>

      <section className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-4">
        <div className="h-[360px] overflow-auto space-y-3 pr-1">
          {messages.map((m, idx) => (
            <div key={idx} className={`text-sm rounded-2xl px-3 py-2 ${m.role === 'assistant' ? 'bg-surface-container-lowest text-on-surface mr-8' : 'bg-primary text-on-primary ml-8'}`}>
              {m.text}
            </div>
          ))}
          {isLoading && (
            <div className="bg-surface-container-lowest text-on-surface rounded-2xl px-3 py-2 mr-8 inline-flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-on-surface-variant/70 animate-bounce [animation-delay:-0.25s]" />
                <span className="w-2 h-2 rounded-full bg-on-surface-variant/70 animate-bounce [animation-delay:-0.12s]" />
                <span className="w-2 h-2 rounded-full bg-on-surface-variant/70 animate-bounce" />
              </div>
              typing...
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button key={q} onClick={() => sendMessage(q)} disabled={isLoading} className="px-3 py-1.5 rounded-full text-xs bg-surface-container-high text-on-surface-variant disabled:opacity-50">
              {q}
            </button>
          ))}
        </div>

        {error && <p className="text-error text-sm mt-3">{error}</p>}

        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            placeholder="Ask about coverage or claim eligibility..."
            className="flex-1 h-11 rounded-2xl bg-surface-container-lowest px-4 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          <button onClick={() => sendMessage()} disabled={!canSend} className="h-11 w-11 rounded-2xl bg-primary text-on-primary flex items-center justify-center disabled:opacity-50">
            <Send size={16} />
          </button>
        </div>
      </section>
    </motion.main>
  );
};

