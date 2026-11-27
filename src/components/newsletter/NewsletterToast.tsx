'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const NEWSLETTER_TOAST_DISMISSED_KEY = 'toyotawaits_newsletter_toast_dismissed';

export interface NewsletterToastProps {
  isOpen?: boolean;
  onDismiss: () => void;
}

export function NewsletterToast({ isOpen = true, onDismiss }: NewsletterToastProps) {
  const { market } = useMarket();
  const country = market === 'US' ? 'US' : 'CA';

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setStatus('error');
      setFeedback('Enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setFeedback(null);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, country }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || (data && data.success === false)) {
        setStatus('error');
        setFeedback(data?.error || 'Could not subscribe.');
        return;
      }

      setStatus('success');
      setFeedback(data?.message || 'Check your inbox to confirm!');
      setEmail('');
    } catch {
      setStatus('error');
      setFeedback('Network error. Please try again.');
    }
  };

  return (
    <aside
      data-testid="newsletter-toast"
      role="region"
      aria-label="Weekly Pipeline Brief Newsletter"
      className="fixed bottom-20 md:bottom-4 right-4 left-4 sm:left-auto z-50 max-w-sm rounded-xl border border-amber-500/30 bg-zinc-950/95 p-4 shadow-xl backdrop-blur-md transition-all duration-200"
    >
      <div className="text-sm font-semibold text-white flex items-center gap-2">
        <Mail className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
        <span>Get the Weekly Pipeline Brief</span>
      </div>
      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
        1 email every Monday: wait-time shifts, fresh lot sightings &amp; Top 10 gear deals. 1-click unsubscribe anytime.
      </p>

      {status === 'success' ? (
        <div
          role="status"
          data-testid="newsletter-toast-feedback"
          className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-300"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            {feedback}
          </span>
          <button
            type="button"
            data-testid="newsletter-toast-dismiss"
            onClick={onDismiss}
            className="text-emerald-200 hover:text-white font-semibold shrink-0 cursor-pointer"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2" noValidate>
          <div className="flex items-center gap-2">
            <label htmlFor="newsletter-toast-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-toast-email"
              data-testid="newsletter-toast-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setFeedback(null);
                }
              }}
              disabled={status === 'submitting'}
              className="h-8 flex-1 min-w-0 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              data-testid="newsletter-toast-submit"
              disabled={status === 'submitting'}
              className="h-8 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-zinc-950 text-xs font-bold inline-flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
            >
              {status === 'submitting' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                'Join'
              )}
            </button>
          </div>
          {status === 'error' && feedback && (
            <p role="alert" data-testid="newsletter-toast-error" className="text-[11px] text-red-400">
              {feedback}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              data-testid="newsletter-toast-dismiss"
              onClick={onDismiss}
              className="text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Maybe later
            </button>
          </div>
        </form>
      )}
    </aside>
  );
}

export default NewsletterToast;
