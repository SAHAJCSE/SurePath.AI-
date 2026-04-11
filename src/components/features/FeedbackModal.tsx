import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, message: string) => void;
}

export const FeedbackModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Reset state when closed
  const handleClose = () => {
    setTimeout(() => {
      setRating(0);
      setHoverRating(0);
      setMessage('');
      setSubmitted(false);
    }, 300);
    onClose();
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    
    // Process feedback
    onSubmit(rating, message);
    
    // Show success state
    setSubmitted(true);
    
    // Close after delay
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-surface-container-lowest rounded-[1.5rem] shadow-2xl z-[101] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/10">
              <h3 className="font-headline font-bold text-lg text-on-surface">We value your opinion</h3>
              <button 
                onClick={handleClose}
                className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 text-center space-y-2"
                >
                  <p className="text-4xl mb-4">✨</p>
                  <p className="font-headline font-bold text-on-surface text-lg">Thank you for your feedback!</p>
                  <p className="text-sm font-medium text-on-surface-variant">We really appreciate your input.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Star Rating */}
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Rate your experience</p>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                          aria-label={`Rate ${star} out of 5`}
                        >
                          <Star 
                            size={36} 
                            strokeWidth={1.5}
                            className={`transition-colors ${(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-outline-variant/40'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div className="space-y-2">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what we can improve..."
                      className="w-full h-28 p-4 bg-surface-container-low border border-outline-variant/20 rounded-2xl text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="w-full h-12 bg-primary text-on-primary rounded-xl font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-primary/10"
                  >
                    Submit Feedback
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
