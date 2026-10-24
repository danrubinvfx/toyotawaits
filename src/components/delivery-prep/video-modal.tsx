'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title?: string;
}

/**
 * Normalizes YouTube video IDs and URLs (watch, shorts, embed, youtu.be) into an 11-char ID.
 */
export function extractYouTubeVideoId(input?: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    if (url.pathname.startsWith('/shorts/')) {
      const id = url.pathname.replace('/shorts/', '').split('/')[0].split('?')[0];
      if (id) return id;
    }
    if (url.pathname.startsWith('/embed/')) {
      const id = url.pathname.replace('/embed/', '').split('/')[0].split('?')[0];
      if (id) return id;
    }
    const v = url.searchParams.get('v');
    if (v) return v;
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace(/^\//, '').split('/')[0].split('?')[0];
      if (id) return id;
    }
  } catch {
    const match = trimmed.match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  return trimmed;
}

/**
 * On-Site YouTube Video Modal
 * Keeps users engaged on toyotawaits.ca with zero bounce rate.
 * Accessible dialog with dark backdrop (bg-black/80), responsive 16:9 ratio, and Esc/close button support.
 */
export function VideoModal({ isOpen, onClose, videoId, title }: VideoModalProps) {
  const normalizedId = extractYouTubeVideoId(videoId);
  if (!normalizedId) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* Dark backdrop */}
        <DialogPrimitive.Overlay
          data-testid="video-modal-overlay"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />

        {/* Modal content dialog */}
        <DialogPrimitive.Content
          data-testid="video-modal-content"
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-[94vw] max-w-3xl translate-x-[-50%] translate-y-[-50%]',
            'rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 shadow-2xl duration-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'focus:outline-none'
          )}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3.5">
            <div className="flex items-center gap-2 min-w-0 pr-3">
              <Play className="h-4 w-4 text-red-500 fill-red-500 shrink-0" />
              <DialogPrimitive.Title className="text-xs sm:text-sm font-bold text-zinc-100 truncate">
                {title || 'Video Guide & Walkthrough'}
              </DialogPrimitive.Title>
            </div>

            <DialogPrimitive.Close
              onClick={onClose}
              aria-label="Close video player"
              data-testid="video-modal-close"
              className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors focus:outline-none cursor-pointer shrink-0"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <DialogPrimitive.Description className="sr-only">
            YouTube video walkthrough player for {title || 'item'}
          </DialogPrimitive.Description>

          {/* 16:9 Responsive Embed Wrapper */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-800/80 shadow-inner">
            {isOpen && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${normalizedId}?autoplay=1&rel=0`}
                title={title || 'YouTube video guide'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default VideoModal;
