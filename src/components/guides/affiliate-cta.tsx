import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AffiliateCTAProps {
  slug: string;
  label: string;
  sublabel?: string;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}

export function AffiliateCTA({
  slug,
  label,
  sublabel,
  variant = 'outline',
  className,
  size = 'default',
}: AffiliateCTAProps) {
  const isOutline = variant === 'outline';

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn(
        'cursor-pointer transition-all duration-200',
        isOutline &&
          'border-zinc-300 dark:border-zinc-700 hover:border-amber-500/50 hover:bg-amber-500/10 text-zinc-900 dark:text-zinc-100',
        sublabel ? 'h-auto py-2.5 flex flex-col items-start text-left' : 'gap-1.5',
        className
      )}
    >
      <a
        href={`/out/${slug}`}
        target="_blank"
        rel="noopener noreferrer sponsored"
      >
        <span className="font-bold flex items-center gap-1.5">
          {label}
          <ExternalLink className="h-3 w-3 text-amber-500 shrink-0" />
        </span>
        {sublabel && (
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal">
            {sublabel}
          </span>
        )}
      </a>
    </Button>
  );
}
