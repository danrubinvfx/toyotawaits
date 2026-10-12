'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface BackButtonProps {
  label?: string;
  className?: string;
  fallbackHref?: string;
}

export function BackButton({
  label = '← Back to Wait Time Tracker',
  className,
  fallbackHref = '/',
}: BackButtonProps = {}) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-400 transition-colors py-2 cursor-pointer',
        className
      )}
    >
      {label}
    </button>
  );
}

export default BackButton;
