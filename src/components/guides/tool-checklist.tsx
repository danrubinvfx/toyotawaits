import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ToolChecklistProps {
  timeEst: string;
  difficulty: 'Easy (Plug & Play)' | 'Moderate (Hand Tools)' | 'Advanced (Shop / Lift)';
  warrantyFriendly?: boolean;
  tools: string[];
}

export function ToolChecklist({
  timeEst,
  difficulty,
  warrantyFriendly = true,
  tools,
}: ToolChecklistProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Wrench className="h-4 w-4 text-amber-500" />
            Installation Pre-Flight Checklist
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] gap-1 border-zinc-300 dark:border-zinc-700">
              <Clock className="h-3 w-3 text-zinc-400" />
              {timeEst}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[11px] bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20"
            >
              {difficulty}
            </Badge>
            {warrantyFriendly && (
              <Badge
                variant="outline"
                className="text-[11px] text-emerald-500 border-emerald-500/30 hidden sm:inline-flex gap-1"
              >
                <ShieldCheck className="h-3 w-3" />
                100% Reversible
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          {tools.map((tool, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>{tool}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
