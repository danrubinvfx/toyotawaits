'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { cn } from '@/lib/utils';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export interface NewsletterSignupProps {
  className?: string;
  compact?: boolean;
}

export function NewsletterSignup({ className, compact = false }: NewsletterSignupProps) {
  const { market } = useMarket();
  const country = market === 'US' ? 'US' : 'CA';

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
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
        setFeedback(data?.error || 'Could not subscribe. Please try again.');
        return;
      }

      setStatus('success');
      setFeedback(
        data?.message || 'Check your inbox to confirm your Weekly Pipeline Brief subscription.'
      );
      setEmail('');
    } catch {
      setStatus('error');
      setFeedback('Network error. Please try again.');
    }
  };

  return (
    <div
      data-testid="newsletter-signup"
      className={cn(
        'rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-100 shadow-sm',
        compact ? 'p-4' : 'p-4 sm:p-5',
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">
              The ToyotaWaits Weekly Pipeline Brief
            </h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            1 email every Monday. Wait-time shifts, fresh lot sightings &amp; gear deals. 1-click unsubscribe anytime.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 lg:min-w-[380px]"
          noValidate
        >
          <label htmlFor="newsletter-signup-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-signup-email"
            data-testid="newsletter-email-input"
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
            className="h-9 flex-1 rounded-lg border border-zinc-700/80 bg-zinc-950/90 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-60"
          />
          <button
            type="submit"
            data-testid="newsletter-submit-btn"
            disabled={status === 'submitting'}
            className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-60 px-4 text-xs font-bold text-zinc-950 transition-colors cursor-pointer whitespace-nowrap"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Joining...</span>
              </>
            ) : (
              <span>Join Weekly Brief</span>
            )}
          </button>
        </form>
      </div>

      {feedback && (
        <div
          role={status === 'error' ? 'alert' : 'status'}
          data-testid="newsletter-feedback"
          className={cn(
            'mt-2.5 flex items-center gap-2 rounded-lg px-3 py-2 text-xs',
            status === 'success'
              ? 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
              : 'border border-red-500/30 bg-red-950/40 text-red-300'
          )}
        >
          {status === 'success' && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
}

export default NewsletterSignup;
