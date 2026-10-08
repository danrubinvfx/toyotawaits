'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export function HeroEstimateButton() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('estimator');
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#estimator');
    }
  };

  return (
    <Button
      asChild
      size="lg"
      variant="outline"
      className="w-full sm:w-auto gap-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-semibold text-base h-12 px-6 cursor-pointer"
    >
      <a href="#estimator" onClick={handleClick}>
        <Clock className="h-5 w-5 text-amber-400" />
        Estimate My Arrival Date
      </a>
    </Button>
  );
}
