import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface EstimatesRedirectProps {
  searchParams: Promise<{
    model?: string;
    province?: string;
    utm_source?: string;
    utm_medium?: string;
  }>;
}

export default async function EstimatesRedirectPage({ searchParams }: EstimatesRedirectProps) {
  const params = await searchParams;
  const q = new URLSearchParams();
  if (params.model) q.set('model', params.model);
  if (params.province) q.set('province', params.province);
  if (params.utm_source) q.set('utm_source', params.utm_source);
  if (params.utm_medium) q.set('utm_medium', params.utm_medium);

  const qs = q.toString();
  redirect(`/#estimator${qs ? `?${qs}` : ''}`);
}
