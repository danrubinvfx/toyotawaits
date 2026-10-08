import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  KeyRound,
  FileSpreadsheet,
  CheckCircle2,
  ArrowLeft,
  ServerOff,
  Scale,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Zero-PII Privacy Charter & PIPEDA Compliance | ToyotaWaits.ca',
  description:
    'Our strict zero-PII privacy guarantee: no VINs, names, emails, IPs, or tracking cookies stored. Anonymous order tracking powered by client-side SHA-256 keys.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="space-y-4 text-center sm:text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Wait Times
        </Link>

        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-2.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Zero-PII Guaranteed
          </Badge>
          <Badge variant="outline" className="border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            PIPEDA Compliant
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          Privacy Charter &amp; Anonymity Model
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          At ToyotaWaits.ca, privacy is not a policy addendum—it is our core software architecture.
          We designed our database and APIs so it is technically impossible for us to collect, store, or sell your personal information.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-1 pb-2">
            <EyeOff className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-bold">Zero PII Collected</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 leading-relaxed">
            No names, emails, phone numbers, dealer names, or 17-digit Vehicle Identification Numbers (VINs).
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-1 pb-2">
            <ServerOff className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-bold">Zero IP Persistence</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 leading-relaxed">
            Client IP addresses are evaluated ephemerally in RAM sliding windows for spam defense and never saved to Postgres.
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="space-y-1 pb-2">
            <KeyRound className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base font-bold">Cryptographic Edit Keys</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-zinc-500 leading-relaxed">
            Order updates use client-side UUID keys hashed via SHA-256. No user accounts or passwords needed.
          </CardContent>
        </Card>
      </div>

      {/* Detailed Privacy Sections */}
      <div className="space-y-8 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600" />
            1. Zero Personally Identifiable Information (Zero-PII)
          </h2>
          <p>
            When you submit a vehicle timeline on ToyotaWaits.ca, we collect only high-level aggregate metadata:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
            <li><strong>Vehicle configuration:</strong> Model (e.g. RAV4), Powertrain (e.g. PHEV), and Trim.</li>
            <li><strong>Dates:</strong> Order deposit date and (optionally) delivery arrival date.</li>
            <li><strong>Geography:</strong> Province (e.g. BC, ON, QC) and optional metropolitan area.</li>
            <li><strong>Pricing transparency:</strong> Whether the vehicle was purchased at MSRP or with dealer add-ons.</li>
          </ul>
          <p>
            All free-text notes submitted to our API pass through regex sanitization filters that reject email addresses, phone numbers, postal codes, and 17-character VIN patterns before touching database persistence.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-red-600" />
            2. Client-Side Cryptographic Self-Service Updates
          </h2>
          <p>
            Most platforms force you to create an account with an email address and password to update your pending orders.
            ToyotaWaits.ca eliminates this requirement:
          </p>
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900/60 p-4 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              How the Anonymous Secret Key Works:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-zinc-600 dark:text-zinc-400">
              <li>When you submit an order, your browser creates a random UUIDv4 secret key.</li>
              <li>Our server receives the submission, computes a one-way cryptographic SHA-256 hash of your key, and stores only the hash in our PostgreSQL database.</li>
              <li>The plaintext secret key is saved exclusively in your device&apos;s browser <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">localStorage</code>.</li>
              <li>When your car arrives months later, your browser sends the secret key via the <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">x-edit-key-hash</code> header to mark your order as delivered.</li>
            </ol>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <Scale className="h-5 w-5 text-red-600" />
            3. PIPEDA &amp; Canadian Legal Compliance
          </h2>
          <p>
            ToyotaWaits.ca complies fully with the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA)
            and provincial privacy statutes (PIPA Alberta, PIPA British Columbia, and Quebec Law 25).
          </p>
          <p>
            Under PIPEDA Principle 4.4 (Limiting Collection), an organization may only collect personal information necessary for specified purposes.
            Because ToyotaWaits.ca does not collect personal identifiers, no personal data can be intercepted, breached, or subpoenaed from our systems.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-red-600" />
            4. Open Community Data (RFC 4180 CSV)
          </h2>
          <p>
            All submitted wait-time logs are compiled into public, sanitized datasets accessible via our one-click
            <Link href="/api/export" className="text-red-600 hover:underline mx-1 font-medium">CSV export</Link>
            feature. Anyone can audit our median wait calculations, analyze allocation disparities between provinces, or verify statistical accuracy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-red-600" />
            5. Cookieless Web Analytics &amp; Affiliate Disclosure
          </h2>
          <p>
            We do not use advertising trackers, Google Analytics cookies, or persistent third-party pixels.
            Our traffic measurement uses first-party, privacy-friendly aggregated page counts that do not track users across websites.
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            <strong>Monetization Disclosure:</strong> Curated accessory links under <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">/out/[slug]</code> use first-party redirects that do not set cookies. If you purchase products through these links, we may receive an affiliate referral fee that supports site hosting and open data infrastructure.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-center sm:justify-start">
        <Button asChild size="lg" className="font-semibold gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Tracker Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
