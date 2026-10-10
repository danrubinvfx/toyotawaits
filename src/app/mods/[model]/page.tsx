import { redirect } from 'next/navigation';
import { CANADIAN_VEHICLE_CATALOG } from '@/lib/data/vehicles';

export async function generateStaticParams() {
  return CANADIAN_VEHICLE_CATALOG.map((m) => ({ model: m.slug }));
}

export default async function ModelModsRedirectPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model } = await params;

  switch (model) {
    case 'rav4':
      redirect('/guides/rav4-se-mods');
    case 'sienna':
      redirect('/guides/sienna-mods');
    case 'grand-highlander':
      redirect('/guides/grand-highlander-mods');
    case 'land-cruiser':
      redirect('/guides/land-cruiser-mods');
    case 'prius':
    case 'prius-prime':
      redirect('/guides/prius-mods');
    default:
      redirect('/guides');
  }
}
