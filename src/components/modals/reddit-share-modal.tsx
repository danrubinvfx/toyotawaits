'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, MessageSquare, Share2 } from 'lucide-react';
import { formatRedditMarkdown, RedditShareParams } from '@/lib/utils/reddit-share';

interface RedditShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareParams: RedditShareParams;
}

export function RedditShareModal({ isOpen, onClose, shareParams }: RedditShareModalProps) {
  const [copied, setCopied] = useState(false);

  const markdownText = formatRedditMarkdown(shareParams);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = markdownText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="h-4 w-4" />
            <span>Community Crowdsource Share</span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Share Your Timeline to Reddit &amp; Forums
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Copy pre-formatted Reddit Markdown to post in megathreads on{' '}
            <code className="text-amber-400 bg-zinc-900 px-1 py-0.5 rounded">r/rav4club</code>,{' '}
            <code className="text-amber-400 bg-zinc-900 px-1 py-0.5 rounded">r/Toyota</code>, or RedFlagDeals.
          </DialogDescription>
        </DialogHeader>

        {/* Markdown Preview Box */}
        <div className="space-y-2 my-2">
          <span className="text-xs font-semibold text-zinc-400">Markdown Preview:</span>
          <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-200 break-words leading-relaxed select-all">
            {markdownText}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
          <span className="text-[11px] text-zinc-500 text-center sm:text-left">
            Zero PII included • Links back to open Canadian database
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="w-full sm:w-auto border-zinc-800 text-zinc-300 hover:bg-zinc-900"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={handleCopy}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-950" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Reddit Markdown
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
