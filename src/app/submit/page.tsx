import React from 'react';
import { Metadata } from 'next';
import { SubmissionForm } from '@/components/forms/submission-form';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Submit Wait Time (Anonymous) | ToyotaWaits.ca',
  description:
    'Contribute your Toyota reservation deposit or vehicle delivery date anonymously to help Canadian buyers track genuine allocation wait times.',
};

export default function SubmitPage() {
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 container mx-auto max-w-4xl space-y-8">
      {/* Page Title & Privacy Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-950/60 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
          <Sparkles className="h-3.5 w-3.5" /> 60-Second Anonymous Community Entry
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Record Your Toyota Delivery Wait Time
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Whether you just placed a deposit or recently took delivery, your data empowers Canadian car buyers to negotiate with dealerships transparently.
        </p>

        {/* Zero-PII Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 text-emerald-600" /> No VIN or Name Stored
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> No Email Required
          </span>
          <span className="flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 text-emerald-600" /> Zero IP Persistence
          </span>
        </div>
      </div>

      {/* Submission Form Wizard */}
      <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-100 animate-pulse" />}>
        <SubmissionForm />
      </React.Suspense>
    </div>
  );
}
