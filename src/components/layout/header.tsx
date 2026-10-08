'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, PlusCircle, FileSpreadsheet, BarChart3, Menu, X, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 font-bold text-lg tracking-tight group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-sm group-hover:scale-105 transition-transform">
            <Car className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="flex items-center text-zinc-900 dark:text-zinc-50 font-black">
              ToyotaWaits<span className="text-amber-500">.ca</span>
              <span className="ml-1.5 rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-amber-500 dark:text-amber-400">
                🇨🇦 Canada
              </span>
            </span>
            <span className="text-[10px] font-medium text-zinc-500 italic truncate max-w-[260px] sm:max-w-none">
              &ldquo;The piano has been drinking, and your Toyota is still on a boat.&rdquo;
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-5 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link href="/#estimator" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-zinc-400" />
            Wait Estimator
          </Link>
          <Link href="/#analytics" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-zinc-400" />
            Provincial Analytics
          </Link>
          <Link href="/guides/ev-charging" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 rounded">Hub</span>
            Prep Guides
          </Link>
          <Link href="/api/export" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <FileSpreadsheet className="h-4 w-4 text-zinc-400" />
            Export CSV
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center space-x-3">
          <Button asChild size="sm" className="gap-1.5 font-bold bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-sm border border-amber-400/40">
            <Link href="/submit">
              <PlusCircle className="h-4 w-4 text-zinc-950" />
              Submit Wait Time
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 py-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/#estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-base font-medium text-zinc-800 dark:text-zinc-200"
            >
              <Clock className="h-5 w-5 text-red-600" />
              Wait-Time Estimator
            </Link>
            <Link
              href="/#analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-base font-medium text-zinc-800 dark:text-zinc-200"
            >
              <BarChart3 className="h-5 w-5 text-red-600" />
              Provincial Analytics
            </Link>
            <Link
              href="/api/export"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-base font-medium text-zinc-800 dark:text-zinc-200"
            >
              <FileSpreadsheet className="h-5 w-5 text-red-600" />
              Export Community Data (CSV)
            </Link>
            <div className="pt-2">
              <Button asChild className="w-full gap-2 font-semibold">
                <Link href="/submit" onClick={() => setMobileMenuOpen(false)}>
                  <PlusCircle className="h-4 w-4" />
                  Submit Wait Time (Anonymous)
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
