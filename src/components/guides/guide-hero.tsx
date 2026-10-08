import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LucideIcon } from 'lucide-react';

interface GuideHeroProps {
  badgeText: string;
  badgeIcon?: LucideIcon;
  subBadgeText?: string;
  title: string;
  tagline: string;
  description: string;
}

export function GuideHero({
  badgeText,
  badgeIcon: BadgeIcon,
  subBadgeText,
  title,
  tagline,
  description,
}: GuideHeroProps) {
  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Wait Times
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
          {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" />}
          {badgeText}
        </Badge>
        {subBadgeText && (
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
            {subBadgeText}
          </Badge>
        )}
      </div>

      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>

      <p className="text-sm sm:text-base font-serif italic text-amber-600 dark:text-amber-400/90 max-w-2xl">
        &ldquo;{tagline}&rdquo;
      </p>

      <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-3xl leading-relaxed">
        {description}
      </p>
    </div>
  );
}
