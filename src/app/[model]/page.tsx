import { notFound, permanentRedirect } from 'next/navigation';
import { getModelConfig } from '@/lib/data/model-registry';

interface RouteProps {
  params: Promise<{
    model: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export default async function ModelPage({ params }: RouteProps) {
  const { model: modelSlug } = await params;
  const config = getModelConfig(modelSlug);

  if (!config) {
    return notFound();
  }

  return permanentRedirect(`/wait-times/${config.slug}`);
}
