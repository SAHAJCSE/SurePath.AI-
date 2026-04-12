import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronDown, Zap } from 'lucide-react';

interface Props {
    scenario: string;
    onScenarioChange: (scenario: string) => void;
    onSubmit: () => void;
    loading: boolean;
    placeholder?: string;
}

export const ClaimInputCard = ({
    scenario,
    onScenarioChange,
    onSubmit,
    loading,
    placeholder = 'e.g. Diabetes treatment, Accident ICU, Surgery'
}: Props) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const presets = [
        { id: 'accident', label: 'Accident (Road/Trip)' },
        { id: 'icu', label: 'ICU Hospitalization' },
        { id: 'diabetes', label: 'Diabetes Treatment' },
        { id: 'surgery', label: 'Major Surgery' },
        { id: 'heart', label: 'Heart Attack/Cardiac' },
        { id: 'cancer', label: 'Cancer Diagnosis' },
    ];

    const handlePresetClick = (preset: string) => {
        onScenarioChange(preset);
        setShowDropdown(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/20 shadow-xl shadow-primary/5 overflow-hidden"
        >
            <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                <Search size={24} />
            </div>

            <div className="relative pl-20 space-y-6">
                <div>
                    <h3 className="text-xl font-headline font-black text-on-surface mb-2">
                        Check Claim Approval
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed">
                        Describe your medical situation. AI will analyze based on your policy.
                    </p>
                </div>

                {/* Scenario Input */}
                <div className="relative">
                    <textarea
                        value={scenario}
                        onChange={(e) => onScenarioChange(e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                        className="w-full p-5 pr-12 rounded-2xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-on-surface placeholder:text-on-surface-variant resize-none font-body"
                        disabled={loading}
                    />

                    {/* Preset Dropdown Trigger */}
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        disabled={loading}
                        className="absolute top-5 right-5 p-2 text-on-surface-variant hover:text-primary transition-colors opacity-75 hover:opacity-100 disabled:opacity-50"
                    >
                        <ChevronDown size={18} />
                    </button>
                </div>

                {/* Preset Dropdown */}
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface-container-low rounded-2xl p-3 border border-outline-variant/30 max-h-48 overflow-y-auto"
                    >
                        {presets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => handlePresetClick(preset.label)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all text-left text-sm"
                            >
                                <Zap size={16} className="text-primary/60 flex-shrink-0" />
                                {preset.label}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSubmit}
                    disabled={!scenario.trim() || loading}
                    className={`w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all ${loading || !scenario.trim()
                            ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-primary to-primary-container text-on-primary hover:shadow-primary/25 active:shadow-primary/40'
                        }`}
                >
                    {loading ? (
                        <>
                            <Zap className="animate-spin" size={20} />
                            AI Analyzing...
                        </>
                    ) : (
                        <>
                            <Zap size={20} />
                            Check Claim Status
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};

