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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Mail } from 'lucide-react';
import { CanadianProvince } from '@/lib/types/contracts';

interface NotificationSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModel: string;
  defaultProvince: CanadianProvince;
  defaultTrim?: string;
}

export function NotificationSubscriptionModal({
  isOpen,
  onClose,
  defaultModel,
  defaultProvince,
  defaultTrim,
}: NotificationSubscriptionModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          model: defaultModel,
          province: defaultProvince,
          trim: defaultTrim || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error?.message || 'Failed to subscribe. Please try again.');
        return;
      }

      setIsSuccess(true);
      setSuccessMessage(
        json.data?.message ||
          `Alert subscription confirmed! We will notify you when matching deliveries occur or regional wait times adjust.`
      );
    } catch {
      setError('A network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setError(null);
    setEmail('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleResetAndClose(); }}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-2">
            {isSuccess ? <CheckCircle2 className="h-6 w-6 text-emerald-400" /> : <Bell className="h-6 w-6" />}
          </div>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold text-white">
            {isSuccess ? 'Alert Active' : 'Delivery Window & Allocation Alerts'}
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-zinc-400 max-w-sm mx-auto">
            Get notified when matching deliveries occur or regional wait times adjust.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4 py-2 text-center">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
              <p className="text-xs font-semibold text-emerald-300">{successMessage}</p>
              <div className="text-[11px] text-zinc-400">
                Watching: <strong className="text-white">{defaultModel.toUpperCase()}</strong> in{' '}
                <strong className="text-white">{defaultProvince}</strong>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500">
              You can unsubscribe anytime with a single click using the link in the footer of any alert.
            </p>
            <DialogFooter className="sm:justify-center pt-2">
              <Button onClick={handleResetAndClose} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs h-9 px-6">
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3 space-y-1 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Vehicle Model:</span>
                <span className="font-semibold text-white capitalize">{defaultModel}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Province:</span>
                <span className="font-semibold text-white">{defaultProvince}</span>
              </div>
              {defaultTrim && (
                <div className="flex justify-between text-zinc-400">
                  <span>Trim Filter:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">{defaultTrim}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alert-email-input" className="text-xs font-semibold text-zinc-300">
                Your Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="alert-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.ca"
                  className="pl-9 bg-zinc-900 border-zinc-800 text-white text-xs sm:text-sm h-10 focus-visible:ring-amber-500"
                />
              </div>
              <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                Strict Zero-Spam Guarantee. Only delivery notifications.
              </p>
            </div>

            <DialogFooter className="pt-2 flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetAndClose}
                className="border-zinc-800 text-zinc-400 hover:text-white text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs h-9 px-5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe to Alerts'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
