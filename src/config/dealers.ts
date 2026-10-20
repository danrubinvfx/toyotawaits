/**
 * src/config/dealers.ts
 *
 * Registered Toyota Dealerships & Geocoding Metadata
 * ToyotaWaits.ca Discovery Platform
 */

export interface DealerGeocoding {
  id: string;
  name: string;
  city: string;
  province: string;
  area: string;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
}

export const DEALERS: Record<string, DealerGeocoding> = {
  'jptoyota-downtown': {
    id: 'jptoyota-downtown',
    name: 'Jim Pattison Toyota Downtown',
    city: 'Vancouver',
    province: 'BC',
    area: 'Downtown / Mount Pleasant',
    latitude: 49.2638,
    longitude: -123.0888,
    lat: 49.2638,
    lng: -123.0888,
  },
  'jptoyota-surrey': {
    id: 'jptoyota-surrey',
    name: 'Jim Pattison Toyota Surrey',
    city: 'Surrey',
    province: 'BC',
    area: 'Guildford',
    latitude: 49.1912,
    longitude: -122.8024,
    lat: 49.1912,
    lng: -122.8024,
  },
  'westcoast-toyota': {
    id: 'westcoast-toyota',
    name: 'West Coast Toyota',
    city: 'Pitt Meadows',
    province: 'BC',
    area: 'Lougheed Hwy',
    latitude: 49.2217,
    longitude: -122.6881,
    lat: 49.2217,
    lng: -122.6881,
  },
};

/**
 * Resolves latitude and longitude coordinates for a dealer based on dealer name, city, or ID.
 */
export function getDealerCoordinates(
  dealerName?: string | null,
  dealerCity?: string | null
): { lat: number; lng: number } | null {
  const query = `${dealerName || ''} ${dealerCity || ''}`.toLowerCase().trim();
  if (!query) return null;

  // Exact ID match
  if (dealerName && DEALERS[dealerName.toLowerCase()]) {
    const d = DEALERS[dealerName.toLowerCase()];
    return { lat: d.lat, lng: d.lng };
  }

  // Downtown / Vancouver
  if (
    query.includes('downtown') ||
    query.includes('jptoyota-downtown') ||
    (query.includes('vancouver') && !query.includes('island'))
  ) {
    return { lat: DEALERS['jptoyota-downtown'].lat, lng: DEALERS['jptoyota-downtown'].lng };
  }

  // Surrey / Guildford
  if (
    query.includes('surrey') ||
    query.includes('jptoyota-surrey') ||
    query.includes('guildford')
  ) {
    return { lat: DEALERS['jptoyota-surrey'].lat, lng: DEALERS['jptoyota-surrey'].lng };
  }

  // West Coast / Pitt Meadows
  if (
    query.includes('west coast') ||
    query.includes('westcoast') ||
    query.includes('pitt meadows') ||
    query.includes('pitt')
  ) {
    return { lat: DEALERS['westcoast-toyota'].lat, lng: DEALERS['westcoast-toyota'].lng };
  }

  // Fallback search across configured dealers
  for (const dealer of Object.values(DEALERS)) {
    if (
      query.includes(dealer.city.toLowerCase()) ||
      query.includes(dealer.name.toLowerCase())
    ) {
      return { lat: dealer.lat, lng: dealer.lng };
    }
  }

  return null;
}
