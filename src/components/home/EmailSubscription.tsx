import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subscribeEmail } from '@/services/subscriptionService';

type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailSubscriptionProps {
  className?: string;
}

const EmailSubscription: React.FC<EmailSubscriptionProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>('idle');
  const [message, setMessage] = useState('');

  const validate = (value: string): string | null => {
    if (!value.trim()) return 'Email address is required.';
    if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const error = validate(trimmed);
    if (error) {
      setStatus('error');
      setMessage(error);
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await subscribeEmail(trimmed);
      if (res.success) {
        setStatus('success');
        setMessage(res.message || 'You have been subscribed successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(res.message || 'Subscription failed. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === 'error' || status === 'success') {
      setStatus('idle');
      setMessage('');
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto">
        <div className="relative flex-1">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email address"
            aria-label="Email address"
            disabled={status === 'loading'}
            className={cn(
              'w-full rounded-xl border border-white/30 bg-white/15 pl-10 pr-4 py-3 text-sm font-semibold text-white placeholder:text-white/50 outline-none transition-all backdrop-blur-sm',
              'focus:ring-2 focus:ring-white/50 focus:border-white/50',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all whitespace-nowrap',
            'bg-sda-blue hover:bg-sda-blue-dark active:scale-[0.97]',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
            'shadow-lg shadow-sda-blue/20 hover:shadow-xl hover:shadow-sda-blue/30'
          )}
        >
          {status === 'loading' ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Mail size={16} />
          )}
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'flex items-center gap-2 mt-3 text-sm font-semibold max-w-lg mx-auto',
              status === 'success' && 'text-emerald-400',
              status === 'error' && 'text-rose-400'
            )}
            role="alert"
          >
            {status === 'success' ? (
              <CheckCircle size={16} className="shrink-0" />
            ) : (
              <AlertCircle size={16} className="shrink-0" />
            )}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailSubscription;
