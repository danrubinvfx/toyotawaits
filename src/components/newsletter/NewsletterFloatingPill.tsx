'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';

export const NEWSLETTER_PILL_DISMISSED_KEY = 'toyotawaits_newsletter_pill_dismissed';
export const NEWSLETTER_PILL_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

/**
 * Persistent Mobile Floating Newsletter Pill ("📧 Weekly Brief")
 * Positioned cleanly above the 5-tab mobile bottom navigation dock (bottom-20 right-4 z-40 md:hidden).
 * Tapping opens a lightweight modal with <NewsletterSignup />.
 * Dismissible with a 14-day localStorage cooldown.
 */
export function NewsletterFloatingPill() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(NEWSLETTER_PILL_DISMISSED_KEY);
      if (raw) {
        const dismissedAt = Number(raw);
        if (Number.isFinite(dismissedAt) && Date.now() - dismissedAt < NEWSLETTER_PILL_COOLDOWN_MS) {
          setIsVisible(false);
          return;
        }
      }
      setIsVisible(true);
    } catch {
      // Fallback if localStorage is unavailable
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsModalOpen(false);
    try {
      window.localStorage.setItem(NEWSLETTER_PILL_DISMISSED_KEY, String(Date.now()));
    } catch {
      // Ignore storage errors in restricted environments
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        data-testid="newsletter-floating-pill"
        className="fixed bottom-20 right-4 z-40 md:hidden inline-flex items-center rounded-full border border-amber-500/50 bg-zinc-950/95 text-amber-300 shadow-lg shadow-black/40 backdrop-blur-md pl-3.5 pr-1.5 py-1.5"
      >
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          data-testid="newsletter-floating-pill-trigger"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer whitespace-nowrap touch-manipulation"
        >
          <span>📧 Weekly Brief</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss Weekly Brief"
          data-testid="newsletter-floating-pill-dismiss"
          className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-sm leading-none touch-manipulation"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Weekly Pipeline Brief Newsletter Signup"
          data-testid="newsletter-floating-modal"
          className="fixed inset-0 z-50 md:hidden flex items-end justify-center bg-black/70 backdrop-blur-xs p-4 pb-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-1 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Weekly Pipeline Brief
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close newsletter signup"
                data-testid="newsletter-floating-modal-close"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer touch-manipulation"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <NewsletterSignup compact />
          </div>
        </div>
      )}
    </>
  );
}

export default NewsletterFloatingPill;
