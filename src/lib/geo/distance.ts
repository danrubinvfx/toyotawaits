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
  'South Surrey / White Rock': { lat: 49.0601, lng: -122.8123 },
  'White Rock': { lat: 49.0601, lng: -122.8123 },
  Richmond: { lat: 49.1666, lng: -123.1336 },
  'Coquitlam / Tri-Cities': { lat: 49.2838, lng: -122.7932 },
  'Port Moody': { lat: 49.2772, lng: -122.8366 },
  Langley: { lat: 49.1128, lng: -122.6517 },
  Abbotsford: { lat: 49.0504, lng: -122.3045 },
  Chilliwack: { lat: 49.1628, lng: -121.9589 },
  Nanaimo: { lat: 49.1912, lng: -123.9782 },
  Victoria: { lat: 48.4284, lng: -123.3656 },
  Duncan: { lat: 48.8071, lng: -123.7160 },
  'Vancouver Island': { lat: 48.4284, lng: -123.3656 },
  Kelowna: { lat: 49.8919, lng: -119.4194 },
  Vernon: { lat: 50.2801, lng: -119.2749 },
  'New Westminster': { lat: 49.1977, lng: -122.9366 },
  'Interior BC': { lat: 49.8919, lng: -119.4194 },
  Okanagan: { lat: 49.8919, lng: -119.4194 },
  Toronto: { lat: 43.6822, lng: -79.4875 },
  Mississauga: { lat: 43.5296, lng: -79.6763 },
  Brampton: { lat: 43.7119, lng: -79.8266 },
  Georgetown: { lat: 43.6497, lng: -79.8935 },
  Simcoe: { lat: 42.8428, lng: -80.2942 },
  'GTA / Ontario': { lat: 43.6822, lng: -79.4875 },
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

  // Handle South Surrey / White Rock aliases
  if (lower.includes('white rock') || lower.includes('peace arch') || lower.includes('south surrey')) {
    return LOWER_MAINLAND_PRESETS['South Surrey / White Rock'];
  }

  // Handle Langley
  if (lower.includes('langley')) {
    return LOWER_MAINLAND_PRESETS['Langley'];
  }

  // Handle Nanaimo
  if (lower.includes('nanaimo')) {
    return LOWER_MAINLAND_PRESETS['Nanaimo'];
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

  // Handle Ontario / GTA dealer and municipality aliases
  if (lower.includes('erin park') || lower.includes('erin-park') || lower.includes('mississauga')) {
    return LOWER_MAINLAND_PRESETS['Mississauga'];
  }
  if (lower.includes('attrell') || lower.includes('brampton')) {
    return LOWER_MAINLAND_PRESETS['Brampton'];
  }
  if (lower.includes('georgetown')) {
    return LOWER_MAINLAND_PRESETS['Georgetown'];
  }
  if (lower.includes('simcoe')) {
    return LOWER_MAINLAND_PRESETS['Simcoe'];
  }
  if (lower.includes('ken shaw') || lower.includes('ken-shaw') || lower.includes('toronto') || lower.includes('gta') || lower.includes('ontario')) {
    return LOWER_MAINLAND_PRESETS['Toronto'];
  }

  return null;
}
