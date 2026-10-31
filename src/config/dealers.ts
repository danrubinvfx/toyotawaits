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
  adapter?: 'convertus' | string;
  baseUrl?: string;
  apiEndpoint?: string;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  enabled?: boolean;
}

export const DEALERS: Record<string, DealerGeocoding> = {
  'jptoyota-downtown': {
    id: 'jptoyota-downtown',
    name: 'Jim Pattison Toyota Downtown',
    city: 'Vancouver',
    province: 'BC',
    area: 'Downtown / Mount Pleasant',
    adapter: 'convertus',
    baseUrl: 'https://www.jptoyota-downtown.com',
    apiEndpoint:
      'https://www.jptoyota-downtown.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1250%26ln%3Den%26sc%3Dnew%26pc%3D100',
    latitude: 49.2638,
    longitude: -123.0888,
    lat: 49.2638,
    lng: -123.0888,
    enabled: true,
  },
  'jptoyota-surrey': {
    id: 'jptoyota-surrey',
    name: 'Jim Pattison Toyota Surrey',
    city: 'Surrey',
    province: 'BC',
    area: 'Guildford',
    adapter: 'convertus',
    baseUrl: 'https://www.jptoyota-surrey.com',
    apiEndpoint:
      'https://www.jptoyota-surrey.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1249%26ln%3Den%26sc%3Dnew%26pc%3D100',
    latitude: 49.1912,
    longitude: -122.8024,
    lat: 49.1912,
    lng: -122.8024,
    enabled: true,
  },
  'westcoast-toyota': {
    id: 'westcoast-toyota',
    name: 'West Coast Toyota',
    city: 'Pitt Meadows',
    province: 'BC',
    area: 'Lougheed Hwy',
    adapter: 'convertus',
    baseUrl: 'https://www.westcoasttoyota.com',
    apiEndpoint:
      'https://www.westcoasttoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1218%26ln%3Den%26sc%3Dnew%26pc%3D100',
    latitude: 49.2217,
    longitude: -122.6881,
    lat: 49.2217,
    lng: -122.6881,
    enabled: true,
  },
  // 1. Regency Toyota (Vancouver / Kingsway)
  'regency-toyota': {
    id: 'regency-toyota',
    name: 'Regency Toyota',
    city: 'Vancouver',
    area: 'Kingsway / Renfrew-Collingwood',
    province: 'BC',
    adapter: 'convertus',
    baseUrl: 'https://www.regencytoyota.com',
    apiEndpoint: 'https://www.regencytoyota.com/wp-json/convertus/v1/vehicles',
    latitude: 49.2394,
    longitude: -123.0450,
    lat: 49.2394,
    lng: -123.0450,
    enabled: true,
  },
  // 2. OpenRoad Toyota Richmond (Richmond Automall)
  'openroad-toyota-richmond': {
    id: 'openroad-toyota-richmond',
    name: 'OpenRoad Toyota Richmond',
    city: 'Richmond',
    area: 'Richmond Automall',
    province: 'BC',
    adapter: 'convertus',
    baseUrl: 'https://www.openroadtoyotarichmond.com',
    apiEndpoint: 'https://www.openroadtoyotarichmond.com/wp-json/convertus/v1/vehicles',
    latitude: 49.1711,
    longitude: -123.0722,
    lat: 49.1711,
    lng: -123.0722,
    enabled: true,
  },
  // 3. OpenRoad Toyota Port Moody (St Johns Street / Eagle Ridge)
  'openroad-toyota-port-moody': {
    id: 'openroad-toyota-port-moody',
    name: 'OpenRoad Toyota Port Moody',
    city: 'Port Moody',
    area: 'St Johns Street / Eagle Ridge',
    province: 'BC',
    adapter: 'convertus',
    baseUrl: 'https://www.openroadtoyotaportmoody.com',
    apiEndpoint:
      'https://www.openroadtoyotaportmoody.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data',
    latitude: 49.2772,
    longitude: -122.8366,
    lat: 49.2772,
    lng: -122.8366,
    enabled: true,
  },
  // 4. Granville Toyota (Vancouver / Marpole)
  'granville-toyota': {
    id: 'granville-toyota',
    name: 'Granville Toyota',
    city: 'Vancouver',
    province: 'BC',
    area: 'Marpole / Granville St',
    adapter: 'convertus',
    baseUrl: 'https://www.granvilletoyota.ca',
    apiEndpoint:
      'https://www.granvilletoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 49.2114,
    longitude: -123.1402,
    lat: 49.2114,
    lng: -123.1402,
    enabled: true,
  },
  // 5. Valley Toyota (Chilliwack / Young Rd)
  'valley-toyota': {
    id: 'valley-toyota',
    name: 'Valley Toyota',
    city: 'Chilliwack',
    province: 'BC',
    area: 'Chilliwack / Young Rd',
    adapter: 'convertus',
    baseUrl: 'https://www.valleytoyota.ca',
    apiEndpoint:
      'https://www.valleytoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 49.1824,
    longitude: -121.9547,
    lat: 49.1824,
    lng: -121.9547,
    enabled: true,
  },
  // 6. Abbotsford Toyota (Abbotsford / Mt. Lehman Rd)
  'abbotsford-toyota': {
    id: 'abbotsford-toyota',
    name: 'Abbotsford Toyota',
    city: 'Abbotsford',
    province: 'BC',
    area: 'Mt. Lehman Rd',
    adapter: 'convertus',
    baseUrl: 'https://www.abbotsfordtoyota.com',
    apiEndpoint:
      'https://www.abbotsfordtoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 49.0601,
    longitude: -122.3789,
    lat: 49.0601,
    lng: -122.3789,
    enabled: true,
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

  // Regency Toyota (Vancouver / Kingsway) — check before generic 'vancouver'
  if (
    query.includes('regency') ||
    query.includes('regency-toyota') ||
    query.includes('kingsway')
  ) {
    return { lat: DEALERS['regency-toyota'].lat, lng: DEALERS['regency-toyota'].lng };
  }

  // OpenRoad Toyota Port Moody — check before the generic 'openroad' (Richmond) match
  if (
    query.includes('port moody') ||
    query.includes('port-moody') ||
    query.includes('portmoody')
  ) {
    return {
      lat: DEALERS['openroad-toyota-port-moody'].lat,
      lng: DEALERS['openroad-toyota-port-moody'].lng,
    };
  }

  // OpenRoad Toyota Richmond (Richmond Automall)
  if (
    query.includes('openroad') ||
    query.includes('openroad-toyota-richmond') ||
    query.includes('richmond')
  ) {
    return {
      lat: DEALERS['openroad-toyota-richmond'].lat,
      lng: DEALERS['openroad-toyota-richmond'].lng,
    };
  }

  // Granville Toyota (Vancouver / Marpole) — check before generic 'vancouver'
  if (
    query.includes('granville') ||
    query.includes('granville-toyota') ||
    query.includes('marpole')
  ) {
    return { lat: DEALERS['granville-toyota'].lat, lng: DEALERS['granville-toyota'].lng };
  }

  // Valley Toyota (Chilliwack)
  if (
    query.includes('valley') ||
    query.includes('valley-toyota') ||
    query.includes('chilliwack')
  ) {
    return { lat: DEALERS['valley-toyota'].lat, lng: DEALERS['valley-toyota'].lng };
  }

  // Abbotsford Toyota
  if (
    query.includes('abbotsford') ||
    query.includes('abbotsford-toyota')
  ) {
    return { lat: DEALERS['abbotsford-toyota'].lat, lng: DEALERS['abbotsford-toyota'].lng };
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
