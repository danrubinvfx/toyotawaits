export type TickerItemType = 'news' | 'inventory' | 'delivery' | 'gear';

export interface TickerItem {
  id: string;
  type: TickerItemType;
  badge: string;
  badgeColor: string; // Tailwind color classes for bg/border/text
  title?: string;
  text: string;
  linkUrl: string;
  isExternal?: boolean;
  accessoryId?: string;
  modelContext?: string | null;
}

export const TICKER_BADGE_COLORS: Record<TickerItemType, string> = {
  news: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  inventory: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  delivery: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  gear: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};
