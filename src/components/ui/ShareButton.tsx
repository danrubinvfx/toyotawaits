'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackGuideOrGearShared } from '@/lib/analytics';

export interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  anchorId?: string;
  variant?: 'header' | 'card';
  className?: string;
}

export function ShareButton({
  title,
  text,
  url,
  anchorId,
  variant = 'header',
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const buildShareUrl = (): string => {
    const base =
      url ||
      (typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : '');
    if (!base) {
      return anchorId ? `#${anchorId}` : '';
    }
    if (!anchorId) {
      return base;
    }
    return `${base.split('#')[0]}#${anchorId}`;
  };

  const triggerCopiedState = () => {
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = buildShareUrl();

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url: shareUrl });
        trackGuideOrGearShared({ title, anchorId, method: 'native' });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        // Fall through to clipboard fallback if native share fails
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        triggerCopiedState();
        trackGuideOrGearShared({ title, anchorId, method: 'clipboard' });
      } catch {
        // Ignore clipboard permission errors
      }
    }
  };

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Share ${title}`}
        title={copied ? 'Copied!' : `Share ${title}`}
        className={cn(
          'relative inline-flex items-center justify-center w-7 h-7 p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer shrink-0',
          className
        )}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span
              role="status"
              className="absolute -top-7 right-0 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-medium text-emerald-400 whitespace-nowrap shadow-md pointer-events-none"
            >
              Copied!
            </span>
          </>
        ) : (
          <Share2 className="h-3.5 w-3.5 shrink-0" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${title}`}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 text-xs font-medium text-zinc-200 transition-colors cursor-pointer shrink-0',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 shrink-0" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}

export default ShareButton;
