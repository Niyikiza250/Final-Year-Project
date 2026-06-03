import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import EmailSubscription from './EmailSubscription';

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl',
              'dark:border-slate-800 dark:bg-slate-900'
            )}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sda-blue/10 dark:bg-sda-blue/20">
                <Mail size={20} className="text-sda-blue dark:text-sda-gold" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Subscribe to Read More
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                Enter your email to access the full story and stay updated with our latest content.
              </p>
            </div>

            <div className="mt-6">
              <EmailSubscription />
            </div>

            <p className="mt-4 text-[11px] font-semibold text-slate-400 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;
