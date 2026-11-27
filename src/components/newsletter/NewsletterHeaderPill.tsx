'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface NewsletterHeaderPillProps {
  className?: string;
  label?: string;
  onClick?: () => void;
}

/**
 * Header Navigation Pill: "📧 Weekly Brief"
 * Smoothly scrolls to #newsletter-signup on the current page, or navigates to /#newsletter-signup.
 */
export function NewsletterHeaderPill({
  className,
  label = '📧 Weekly Brief',
  onClick,
}: NewsletterHeaderPillProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick();
    if (typeof document !== 'undefined') {
      const target = document.getElementById('newsletter-signup');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', '#newsletter-signup');
        }
      }
    }
  };

  return (
    <Link
      href="/#newsletter-signup"
      onClick={handleClick}
      data-testid="newsletter-header-pill"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 text-xs font-semibold text-amber-500 dark:text-amber-400 hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-300 transition-all duration-150 shadow-xs cursor-pointer whitespace-nowrap',
        className
      )}
    >
      <span>{label}</span>
    </Link>
  );
}

export default NewsletterHeaderPill;
