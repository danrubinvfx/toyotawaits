/**
 * src/lib/geo/distance.ts
 *
 * Lower Mainland Geocoding and Haversine Distance Calculations
 * ToyotaWaits.ca Discovery Platform
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export const LOWER_MAINLAND_PRESETS: Record<string, Coordinates> = {
  Vancouver: { lat: 49.2827, lng: -123.1207 },
  Burnaby: { lat: 49.2488, lng: -122.9805 },
  Surrey: { lat: 49.1913, lng: -122.8490 },
  Richmond: { lat: 49.1666, lng: -123.1336 },
  'Coquitlam / Tri-Cities': { lat: 49.2838, lng: -122.7932 },
  'Port Moody': { lat: 49.2772, lng: -122.8366 },
  Langley: { lat: 49.1042, lng: -122.6604 },
  Abbotsford: { lat: 49.0504, lng: -122.3045 },
  Chilliwack: { lat: 49.1628, lng: -121.9589 },
  Victoria: { lat: 48.4284, lng: -123.3656 },
  Duncan: { lat: 48.8071, lng: -123.7160 },
  'Vancouver Island': { lat: 48.4284, lng: -123.3656 },
  Kelowna: { lat: 49.8919, lng: -119.4194 },
  Vernon: { lat: 50.2801, lng: -119.2749 },
  'New Westminster': { lat: 49.1977, lng: -122.9366 },
  'Interior BC': { lat: 49.8919, lng: -119.4194 },
  Okanagan: { lat: 49.8919, lng: -119.4194 },
};

/**
 * Calculates great-circle distance between two coordinates in kilometers using the Haversine formula.
 * Returns distance rounded to 1 decimal place.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  const R = 6371; // Earth mean radius in kilometers
  const toRad = (degree: number) => (degree * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Resolves coordinate preset for a municipality name (case-insensitive and tolerant of common aliases).
 */
export function getPresetCoordinates(name?: string | null): Coordinates | null {
  if (!name || name === 'All' || name === 'All Locations') return null;

  const query = name.trim();
  if (LOWER_MAINLAND_PRESETS[query]) {
    return LOWER_MAINLAND_PRESETS[query];
  }

  const lower = query.toLowerCase();
  for (const [key, coords] of Object.entries(LOWER_MAINLAND_PRESETS)) {
    if (
      key.toLowerCase() === lower ||
      lower.includes(key.toLowerCase()) ||
      (key.toLowerCase().includes('coquitlam') && lower.includes('coquitlam'))
    ) {
      return coords;
    }
  }

  // Handle Port Moody and Tri-Cities aliases
  if (lower.includes('port moody') || lower.includes('port-moody') || lower.includes('portmoody')) {
    return LOWER_MAINLAND_PRESETS['Port Moody'];
  }

  // Handle Pitt Meadows as proximity to Tri-Cities / Maple Ridge area if requested
  if (lower.includes('pitt')) {
    return { lat: 49.2217, lng: -122.6881 };
  }

  // Handle New Westminster aliases
  if (lower.includes('westminster') || lower.includes('new west')) {
    return LOWER_MAINLAND_PRESETS['New Westminster'];
  }

  // Handle Vernon / North Okanagan
  if (lower.includes('vernon')) {
    return LOWER_MAINLAND_PRESETS['Vernon'];
  }

  // Handle Kelowna / Okanagan / Interior BC aliases
  if (lower.includes('kelowna') || lower.includes('okanagan') || lower.includes('interior')) {
    return LOWER_MAINLAND_PRESETS['Kelowna'];
  }

  // Handle Vancouver Island / Victoria / Duncan aliases
  if (lower.includes('duncan')) {
    return LOWER_MAINLAND_PRESETS['Duncan'];
  }
  if (lower.includes('victoria') || lower.includes('island')) {
    return { lat: 48.4284, lng: -123.3656 };
  }

  return null;
}
