import { INITIAL_SAMPLE_LISTINGS } from '@/components/discovery/InventoryExplorer';
import { VehicleListingCardProps } from '@/components/discovery/VehicleListingCard';
import { CANADIAN_VEHICLE_CATALOG } from '@/lib/data/vehicles';

/**
 * Maps an estimator model slug and optional powertrain slug to the corresponding
 * human-readable model name utilized in public dealer feeds and inventory listings.
 */
export function getEstimatorInventoryModelName(
  modelSlug: string,
  powertrainSlug?: string
): string {
  const normModel = (modelSlug || '').toLowerCase().trim();
  const normPowertrain = (powertrainSlug || '').toLowerCase().trim();

  if (normModel === 'rav4') {
    if (normPowertrain === 'phev' || normPowertrain.includes('prime')) {
      return 'RAV4 Plug-in Hybrid';
    }
    if (normPowertrain === 'hev' || normPowertrain.includes('hybrid')) {
      return 'RAV4 Hybrid';
    }
    return 'RAV4';
  }

  if (normModel === 'prius') {
    if (normPowertrain === 'phev' || normPowertrain.includes('prime')) {
      return 'Prius Prime';
    }
    return 'Prius';
  }

  if (normModel === 'grand-highlander') {
    if (normPowertrain === 'hev' || normPowertrain.includes('hybrid')) {
      return 'Grand Highlander Hybrid';
    }
    return 'Grand Highlander';
  }

  if (normModel === 'corolla') {
    if (normPowertrain === 'hev' || normPowertrain.includes('hybrid')) {
      return 'Corolla Hybrid';
    }
    return 'Corolla';
  }

  if (normModel === 'corolla-cross') {
    if (normPowertrain === 'hev' || normPowertrain.includes('hybrid')) {
      return 'Corolla Cross Hybrid';
    }
    return 'Corolla Cross';
  }

  if (normModel === 'land-cruiser') {
    return 'Land Cruiser';
  }

  const catalogModel = CANADIAN_VEHICLE_CATALOG.find((m) => m.slug === normModel);
  if (catalogModel) {
    return catalogModel.name;
  }

  // Capitalize fallback
  return normModel ? normModel.charAt(0).toUpperCase() + normModel.slice(1) : 'Toyota';
}

/**
 * Returns active inventory counts for a target model name from a count map,
 * listings array, or default fallback listings.
 */
export function getActiveInventoryCountByModel(
  modelName: string,
  countsOrListings?: Record<string, number> | VehicleListingCardProps[]
): number {
  if (!modelName) return 0;
  const target = modelName.trim().toLowerCase();

  // If passed an array of listings
  if (Array.isArray(countsOrListings)) {
    return countsOrListings.filter((item) => {
      const itemModel = (item.model || '').toLowerCase().trim();
      const itemPowertrain = (item.powertrain || '').toLowerCase().trim();
      const itemTrim = (item.trim || '').toLowerCase().trim();

      if (itemModel === target) return true;

      // Handle PHEV / Prime specifically
      const isTargetPhev = target.includes('plug-in') || target.includes('prime') || target.includes('phev');
      const isItemPhev =
        itemModel.includes('prime') ||
        itemModel.includes('plug-in') ||
        itemPowertrain.includes('plug-in') ||
        itemTrim.includes('prime');
      if (isTargetPhev) {
        return (
          (target.includes('rav4') && itemModel.includes('rav4') && isItemPhev) ||
          (target.includes('prius') && itemModel.includes('prius') && isItemPhev) ||
          (isItemPhev && itemModel.includes(target))
        );
      }

      // Handle Hybrid specifically
      const isTargetHev = target.includes('hybrid') || target.includes('hev');
      const isItemHev =
        itemModel.includes('hybrid') ||
        itemPowertrain.includes('hybrid') ||
        itemTrim.includes('hybrid');
      if (isTargetHev && !isTargetPhev) {
        return (
          itemModel === target ||
          (target.split(' ')[0] === itemModel.split(' ')[0] && isItemHev && !isItemPhev)
        );
      }

      // Exact or standard substring
      return itemModel === target || itemModel.includes(target) || target.includes(itemModel);
    }).length;
  }

  // If passed a Record<string, number> or undefined
  const counts = countsOrListings || (() => {
    const fallback: Record<string, number> = {};
    INITIAL_SAMPLE_LISTINGS.forEach((l) => {
      if (l.model) {
        fallback[l.model] = (fallback[l.model] || 0) + 1;
      }
    });
    return fallback;
  })();

  // Exact key match first
  for (const [key, val] of Object.entries(counts)) {
    if (key.toLowerCase() === target) {
      return val;
    }
  }

  // Fuzzy / substring match
  let total = 0;
  const isTargetPhev = target.includes('plug-in') || target.includes('prime') || target.includes('phev');
  const isTargetHev = target.includes('hybrid') || target.includes('hev');

  for (const [key, val] of Object.entries(counts)) {
    const keyLower = key.toLowerCase();
    const isKeyPhev = keyLower.includes('prime') || keyLower.includes('plug-in');
    const isKeyHev = keyLower.includes('hybrid');

    if (isTargetPhev) {
      if (isKeyPhev && (target.includes('rav4') ? keyLower.includes('rav4') : true)) {
        total += val;
      }
    } else if (isTargetHev) {
      if (isKeyHev && !isKeyPhev && (target.includes('rav4') ? keyLower.includes('rav4') : keyLower.includes(target.split(' ')[0]))) {
        total += val;
      }
    } else {
      if (!isKeyPhev && !isKeyHev && (keyLower === target || keyLower.includes(target) || target.includes(keyLower))) {
        total += val;
      }
    }
  }

  return total;
}
