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
  news: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  inventory: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
  delivery: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  gear: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
};
