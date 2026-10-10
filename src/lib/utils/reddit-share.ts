import { CanadianProvince, SubmissionStage, SubmissionStatus } from '@/lib/types/contracts';

export interface RedditShareParams {
  modelName: string;
  powertrainName: string;
  trimName?: string;
  province: CanadianProvince | string;
  orderDate: string; // YYYY-MM-DD
  currentStage?: SubmissionStage;
  status?: SubmissionStatus;
  estDelivery?: string;
}

export const STAGE_DISPLAY_NAMES: Record<SubmissionStage, string> = {
  deposit_placed: 'Deposit Placed',
  allocation_confirmed: 'Allocation Confirmed',
  in_transit: 'In Transit / Freight',
  freight_transit: 'Freight Transit',
  arrived_at_dealer: 'Arrived at Dealer',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function formatMonthYear(dateString: string): string {
  try {
    const parts = dateString.split('-');
    if (parts.length >= 2) {
      const year = parts[0];
      const monthNum = parseInt(parts[1], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (monthNum >= 1 && monthNum <= 12) {
        return `${months[monthNum - 1]} ${year}`;
      }
    }
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-CA', { month: 'short', year: 'numeric' });
    }
  } catch {}
  return dateString;
}

export function formatRedditMarkdown(params: RedditShareParams): string {
  const trimPart = params.trimName ? ` ${params.trimName}` : '';
  const vehicle = `${params.modelName} ${params.powertrainName}${trimPart}`.replace(/\s+/g, ' ').trim();
  const orderedFormatted = formatMonthYear(params.orderDate);
  const stageFormatted = params.currentStage
    ? STAGE_DISPLAY_NAMES[params.currentStage]
    : params.status === 'delivered'
    ? 'Delivered'
    : 'Deposit Placed';

  let estPart = '';
  if (params.estDelivery) {
    estPart = ` | Est. Delivery: ${params.estDelivery}`;
  } else if (params.status === 'delivered') {
    estPart = ' | Status: Delivered';
  }

  return `> **${vehicle}** | ${params.province.toUpperCase()} | Ordered: ${orderedFormatted} | Current Status: ${stageFormatted}${estPart} — via [ToyotaWaits.ca](https://toyotawaits.ca)`;
}
