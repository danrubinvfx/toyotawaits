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

export interface LocationPresetOption {
  value: string;
  label: string;
  province?: 'BC' | 'ON';
}

export interface LocationPresetGroup {
  label: string;
  province: 'BC' | 'ON';
  options: LocationPresetOption[];
}

export const GLOBAL_LOCATION_OPTION: LocationPresetOption = {
  value: '',
  label: 'All Canada (2,200+ units)',
};

export const GROUPED_LOCATION_PRESETS: LocationPresetGroup[] = [
  {
    label: 'British Columbia',
    province: 'BC',
    options: [
      { value: 'All British Columbia', label: 'All British Columbia', province: 'BC' },
      { value: 'Vancouver', label: 'Vancouver (Downtown)', province: 'BC' },
      { value: 'Burnaby', label: 'Burnaby', province: 'BC' },
      { value: 'Richmond', label: 'Richmond', province: 'BC' },
      { value: 'Surrey', label: 'Surrey (Guildford / White Rock)', province: 'BC' },
      {
        value: 'Coquitlam / Port Moody / Pitt Meadows',
        label: 'Coquitlam / Port Moody / Pitt Meadows',
        province: 'BC',
      },
      {
        value: 'Langley / Abbotsford / Chilliwack',
        label: 'Langley / Abbotsford / Chilliwack',
        province: 'BC',
      },
      {
        value: 'Vancouver Island',
        label: 'Vancouver Island (Victoria / Duncan / Nanaimo)',
        province: 'BC',
      },
      { value: 'Okanagan', label: 'Okanagan (Kelowna / Vernon)', province: 'BC' },
    ],
  },
  {
    label: 'Ontario (GTA)',
    province: 'ON',
    options: [
      { value: 'All Ontario / GTA', label: 'All Ontario / GTA', province: 'ON' },
      { value: 'Toronto', label: 'Toronto', province: 'ON' },
      { value: 'Mississauga', label: 'Mississauga', province: 'ON' },
      { value: 'Brampton', label: 'Brampton', province: 'ON' },
      { value: 'Georgetown', label: 'Georgetown', province: 'ON' },
      { value: 'Simcoe', label: 'Simcoe', province: 'ON' },
    ],
  },
];

export const LOWER_MAINLAND_PRESETS: Record<string, Coordinates> = {
  Vancouver: { lat: 49.2827, lng: -123.1207 },
  'Vancouver (Downtown)': { lat: 49.2827, lng: -123.1207 },
  Burnaby: { lat: 49.2488, lng: -122.9805 },
  Surrey: { lat: 49.1913, lng: -122.8490 },
  'Surrey (Guildford / White Rock)': { lat: 49.1913, lng: -122.8490 },
  'South Surrey / White Rock': { lat: 49.0601, lng: -122.8123 },
  'White Rock': { lat: 49.0601, lng: -122.8123 },
  Richmond: { lat: 49.1666, lng: -123.1336 },
  'Coquitlam / Tri-Cities': { lat: 49.2838, lng: -122.7932 },
  'Coquitlam / Port Moody / Pitt Meadows': { lat: 49.2838, lng: -122.7932 },
  'Port Moody': { lat: 49.2772, lng: -122.8366 },
  Langley: { lat: 49.1128, lng: -122.6517 },
  'Langley / Abbotsford / Chilliwack': { lat: 49.1128, lng: -122.6517 },
  Abbotsford: { lat: 49.0504, lng: -122.3045 },
  Chilliwack: { lat: 49.1628, lng: -121.9589 },
  Nanaimo: { lat: 49.1912, lng: -123.9782 },
  Victoria: { lat: 48.4284, lng: -123.3656 },
  Duncan: { lat: 48.8071, lng: -123.7160 },
  'Vancouver Island': { lat: 48.4284, lng: -123.3656 },
  'Vancouver Island (Victoria / Duncan / Nanaimo)': { lat: 48.4284, lng: -123.3656 },
  Kelowna: { lat: 49.8919, lng: -119.4194 },
  Vernon: { lat: 50.2801, lng: -119.2749 },
  'New Westminster': { lat: 49.1977, lng: -122.9366 },
  'Interior BC': { lat: 49.8919, lng: -119.4194 },
  Okanagan: { lat: 49.8919, lng: -119.4194 },
  'Okanagan (Kelowna / Vernon)': { lat: 49.8919, lng: -119.4194 },
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
 * Resolves the target province ('BC' | 'ON') for a given location preset or province-wide filter,
 * or null if the selection is global ('All Canada', '') or GPS ('Near Me (GPS)').
 */
export function getLocationProvince(name?: string | null): 'BC' | 'ON' | null {
  if (!name) return null;
  const lower = name.trim().toLowerCase();
  if (
    !lower ||
    lower === 'all' ||
    lower === 'all locations' ||
    lower.startsWith('all canada') ||
    lower === 'near me (gps)'
  ) {
    return null;
  }

  if (
    lower === 'on' ||
    lower === 'all ontario / gta' ||
    lower === 'gta / ontario' ||
    lower.includes('ontario') ||
    lower.includes('gta') ||
    lower.includes('toronto') ||
    lower.includes('mississauga') ||
    lower.includes('brampton') ||
    lower.includes('georgetown') ||
    lower.includes('simcoe') ||
    lower.includes('ken shaw') ||
    lower.includes('attrell') ||
    lower.includes('erin park')
  ) {
    return 'ON';
  }

  if (
    lower === 'bc' ||
    lower === 'all british columbia' ||
    lower.includes('british columbia') ||
    lower.includes('vancouver') ||
    lower.includes('burnaby') ||
    lower.includes('richmond') ||
    lower.includes('surrey') ||
    lower.includes('white rock') ||
    lower.includes('coquitlam') ||
    lower.includes('port moody') ||
    lower.includes('pitt meadows') ||
    lower.includes('langley') ||
    lower.includes('abbotsford') ||
    lower.includes('chilliwack') ||
    lower.includes('nanaimo') ||
    lower.includes('victoria') ||
    lower.includes('duncan') ||
    lower.includes('okanagan') ||
    lower.includes('kelowna') ||
    lower.includes('vernon') ||
    lower.includes('interior bc') ||
    lower.includes('westminster')
  ) {
    return 'BC';
  }

  return null;
}

/**
 * Resolves coordinate preset for a municipality name (case-insensitive and tolerant of common aliases).
 */
export function getPresetCoordinates(name?: string | null): Coordinates | null {
  if (!name || name === 'All' || name === 'All Locations') return null;

  const query = name.trim();
  const lower = query.toLowerCase();

  // Global and province-wide filters do not represent a single point coordinate
  if (
    lower.startsWith('all canada') ||
    lower === 'all british columbia' ||
    lower === 'all ontario / gta' ||
    lower === 'bc' ||
    lower === 'on'
  ) {
    return null;
  }

  if (LOWER_MAINLAND_PRESETS[query]) {
    return LOWER_MAINLAND_PRESETS[query];
  }

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
