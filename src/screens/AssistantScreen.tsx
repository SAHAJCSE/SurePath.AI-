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
const QUICK = [
  'How to check LIC Fund Value?',
  'Download policy statement',
  'What is Free-look period?',
  'Check Surrender Value',
  'Ask about accident coverage'
];

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

function localAssistantReply(question: string, loggedIn: boolean, savedProfile: SavedProfile | null) {
  const q = question.toLowerCase();
  const userName = savedProfile?.form?.firstName || 'User';

  if (!loggedIn) {
    return `✅ Hello! I am SurePath AI, your intelligent insurance assistant.

📌 Quick Note:
Please save your profile first. Once you do, I can provide personalized answers based on your details.

👉 Next Steps:
- Go to the Profile tab to save your details.`;
  }

  // Profile Specific
  if (q.includes('saved profile') || q.includes('my profile') || q.includes('my details')) {
    const u = savedProfile?.form;
    if (!u) return '✅ I couldn\'t find your profile details. Please save them in the Profile tab first.';
    
    return `✅ Here are your profile details, ${userName}:

📌 Key Details:
- Name: ${u.firstName} ${u.lastName}
- Gender: ${u.gender}
- DOB: ${u.dob}
- Contact: ${u.countryCode} ${u.mobile}
- Email: ${u.email}

⚠️ ध्यान देने वाली बात / Important:
- Ensure your contact details are updated for seamless claim processing.

👉 Next Steps:
- Check your accident coverage?
- See your claim eligibility?`;
  }

  // Accident Coverage
  if (q.includes('accident')) {
    return `✅ Yes ${userName}, your policy generally includes comprehensive accident coverage.

📌 What is Covered:
- Accidental death benefit
- Permanent total/partial disability
- Emergency medical expenses related to the accident

⚠️ ध्यान देने वाली बात / Important:
- Accidents caused by intoxication (alcohol/drugs) are NOT covered.
- FIR is usually mandatory for accidental claims.

👉 Next Steps:
- Check your exact coverage amount?
- See required documents for accident claims?`;
  }

  // Eligibility
  if (q.includes('eligible') || q.includes('eligibility')) {
    return `✅ Based on standard policy terms, here is your eligibility check:

📌 Conditions:
- Policy must be active (premium paid)
- Waiting period (usually 30 days) must be completed
- No "pre-existing condition" exclusion triggered

⚠️ ध्यान देने वाली बात / Important:
- Eligibility is subject to the specific terms of the provider you selected.

👉 Next Steps:
- List required documents?
- See how to file a claim?`;
  }

  // Documents
  if (q.includes('document') || q.includes('docs')) {
    return `✅ To process any claim, you will typically need these documents:

📌 Checklist:
- Original Policy Document/Number
- ID Proof (Aadhar/PAN) of the policyholder
- Medical Reports & Hospital Bills
- Cancelled Cheque for payout

⚠️ ध्यान देने वाली बात / Important:
- Always keep digital scans of these documents ready for faster processing.

👉 Next Steps:
- Check eligibility for a claim?
- Ask about a specific scenario (e.g., bike accident)?`;
  }

  // Claims
  if (q.includes('claim') || q.includes('process')) {
    return `✅ Filing a claim is a structured 4-step process:

📌 Steps:
1. **Intimation**: Inform the insurer within 24-48 hours.
2. **Submission**: Upload/Submit required documents via app or portal.
3. **Verification**: The insurer reviews the documents and medical proofs.
4. **Settlement**: If approved, funds are transferred to your bank account.

⚠️ ध्यान देने वाली बात / Important:
- Common mistake: Delaying the intimation after an incident. Always inform within 24 hours.

👉 Next Steps:
- Need the list of required documents?
- Check your claim eligibility?`;
  }

  // LIC Procedure: Fund Value
  if (q.includes('fund value')) {
    return `✅ To check the fund value of your LIC policy online:
    
1. Go to the official LIC website.
2. Log in to the customer portal.
3. Navigate to **Policy Details**.
4. Click on **View Fund Value**.

You can also see fund allocation across different investment options if available.`;
  }

  // LIC Procedure: Statement
  if (q.includes('statement') || q.includes('download')) {
    return `✅ To download your LIC policy statement:

1. Visit the LIC official website and go to **Customer Services**.
2. Click on **Download Policy Statement**.
3. Log in with your policy number and Date of Birth.
4. Once logged in, you can view or download the statement in PDF format.`;
  }

  // LIC Procedure: Free-look
  if (q.includes('free-look') || q.includes('cancel') || q.includes('15 days')) {
    return `✅ LIC offers a **Free-look period** (usually 15 to 30 days) from the date of receiving the policy document.

During this time, if you are not satisfied with the terms, you can cancel the policy and receive a refund of the premiums paid.`;
  }

  // LIC Procedure: Surrender Value
  if (q.includes('surrender value')) {
    return `✅ To check the surrender value of your LIC policy:

1. **Online**: Log in to the LIC portal and check policy-related info.
2. **Contact**: Reach out to LIC customer service with your policy details.
3. **Documents**: Review your policy document's terms and conditions section. 

Surrender value is typically the amount you get if you terminate the policy before maturity.`;
  }

  // Hospitalization
  if (q.includes('hospital')) {
    return `✅ Hospitalization is covered for in-patient treatments.

📌 Key Benefits:
- Cashless facility at network hospitals
- Room rent and surgery charges included
- Pre and post-hospitalization coverage

⚠️ ध्यान देने वाली बात / Important:
- For cashless care, contact the hospital insurance desk before admission or within 24 hours of emergency.

👉 Next Steps:
- Check network hospitals?
- See required documents for admission?`;
  }

  // Default / Unclear
  return `✅ I can certainly help you with that, ${userName}. 

📌 I specialize in:
- Explaining coverage (Accidents, Death, Hospitalization)
- Checking Eligibility & Required Documents
- Guiding you through the Claim Process

👉 Next Steps:
- Could you please specify your query?
- Or try one of the quick buttons below!`;
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
        ? `✅ Hello ${savedProfile?.form?.firstName || ''}! I am **SurePath AI**, your personal insurance guide.

I can help you decipher your coverage, check eligibility, or walk you through a claim. What's on your mind today?`
        : `✅ Hello! I am **SurePath AI**. 

I help make insurance simple. Please save your profile so I can provide personalized guidance for your specific situation.`,
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
      const reply = localAssistantReply(text, loggedIn, savedProfile);
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
        <div className="h-[420px] overflow-auto space-y-4 pr-2 scrollbar-hide">
          {messages.map((m, idx) => (
            <div key={idx} className={`text-sm rounded-2xl px-4 py-3 whitespace-pre-wrap ${m.role === 'assistant' ? 'bg-surface-container-lowest text-on-surface mr-12 shadow-sm border border-outline-variant/10' : 'bg-primary text-on-primary ml-12 shadow-md'}`}>
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

