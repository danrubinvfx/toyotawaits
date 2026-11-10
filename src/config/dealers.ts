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
      'https://www.openroadtoyotaportmoody.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
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
  // 7. Jim Pattison Toyota Victoria (Victoria / Douglas St)
  'jptoyota-victoria': {
    id: 'jptoyota-victoria',
    name: 'Jim Pattison Toyota Victoria',
    city: 'Victoria',
    province: 'BC',
    area: 'Victoria / Douglas St',
    adapter: 'convertus',
    baseUrl: 'https://www.jptoyotavictoria.com',
    apiEndpoint:
      'https://www.jptoyotavictoria.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1230%26ln%3Den%26sc%3Dnew%26pc%3D100',
    latitude: 48.4419,
    longitude: -123.3683,
    lat: 48.4419,
    lng: -123.3683,
    enabled: true,
  },
  // 8. Jim Pattison Toyota Duncan (Duncan / Trans-Canada Hwy)
  'jptoyota-duncan': {
    id: 'jptoyota-duncan',
    name: 'Jim Pattison Toyota Duncan',
    city: 'Duncan',
    province: 'BC',
    area: 'Duncan / Trans-Canada Hwy',
    adapter: 'convertus',
    baseUrl: 'https://www.jptoyota-duncan.com',
    apiEndpoint:
      'https://www.jptoyota-duncan.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1254%26sc%3Dnew%26pc%3D100',
    latitude: 48.8071,
    longitude: -123.7160,
    lat: 48.8071,
    lng: -123.7160,
    enabled: true,
  },
  // 9. Kelowna Toyota (Kelowna / Cary Rd)
  'kelowna-toyota': {
    id: 'kelowna-toyota',
    name: 'Kelowna Toyota',
    city: 'Kelowna',
    province: 'BC',
    area: 'Kelowna / Cary Rd',
    adapter: 'convertus',
    baseUrl: 'https://www.kelownatoyota.com',
    apiEndpoint:
      'https://www.kelownatoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1935%26sc%3Dnew%26pc%3D100',
    latitude: 49.8919,
    longitude: -119.4194,
    lat: 49.8919,
    lng: -119.4194,
    enabled: true,
  },
  // 10. Vernon Toyota (North Okanagan / Interior BC)
  'vernon-toyota': {
    id: 'vernon-toyota',
    name: 'Vernon Toyota',
    city: 'Vernon',
    province: 'BC',
    area: 'Vernon / 48 Ave',
    adapter: 'convertus',
    baseUrl: 'https://www.vernontoyota.com',
    apiEndpoint:
      'https://www.vernontoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 50.2801,
    longitude: -119.2749,
    lat: 50.2801,
    lng: -119.2749,
    enabled: true,
  },
  // 11. Westminster Toyota (New Westminster / Metro Vancouver)
  'westminster-toyota': {
    id: 'westminster-toyota',
    name: 'Westminster Toyota',
    city: 'New Westminster',
    province: 'BC',
    area: 'Queensborough / Boyd St',
    adapter: 'convertus',
    baseUrl: 'https://www.westminstertoyota.com',
    apiEndpoint:
      'https://www.westminstertoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 49.1977,
    longitude: -122.9366,
    lat: 49.1977,
    lng: -122.9366,
    enabled: true,
  },
  // 12. OpenRoad Toyota Peace Arch (South Surrey / White Rock)
  'openroad-toyota-peace-arch': {
    id: 'openroad-toyota-peace-arch',
    name: 'OpenRoad Toyota Peace Arch',
    city: 'Surrey',
    province: 'BC',
    area: 'South Surrey / White Rock',
    adapter: 'convertus',
    baseUrl: 'https://openroadtoyotapeacearch.com',
    apiEndpoint:
      'https://openroadtoyotapeacearch.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 49.0601,
    longitude: -122.8123,
    lat: 49.0601,
    lng: -122.8123,
    enabled: true,
  },
  // 13. Langley Toyota (Fraser Valley / Langley Bypass)
  'langley-toyota': {
    id: 'langley-toyota',
    name: 'Langley Toyota',
    city: 'Langley',
    province: 'BC',
    area: 'Langley Bypass / Fraser Valley',
    adapter: 'goauto',
    baseUrl: 'https://www.langleytoyota.com',
    apiEndpoint:
      'https://www.langleytoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 49.1128,
    longitude: -122.6517,
    lat: 49.1128,
    lng: -122.6517,
    enabled: true,
  },
  // 14. Nanaimo Toyota (Central Vancouver Island)
  'nanaimo-toyota': {
    id: 'nanaimo-toyota',
    name: 'Nanaimo Toyota',
    city: 'Nanaimo',
    province: 'BC',
    area: 'Central Vancouver Island',
    adapter: 'convertus',
    baseUrl: 'https://www.nanaimotoyota.com',
    apiEndpoint:
      'https://www.nanaimotoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 49.1912,
    longitude: -123.9782,
    lat: 49.1912,
    lng: -123.9782,
    enabled: true,
  },
  // 15. Ken Shaw Toyota (Toronto / St. Clair W)
  'ken-shaw-toyota': {
    id: 'ken-shaw-toyota',
    name: 'Ken Shaw Toyota',
    city: 'Toronto',
    province: 'ON',
    area: 'Toronto / St. Clair Ave W',
    adapter: 'convertus',
    baseUrl: 'https://www.kenshawtoyota.ca',
    apiEndpoint:
      'https://www.kenshawtoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.6822,
    longitude: -79.4875,
    lat: 43.6822,
    lng: -79.4875,
    enabled: true,
  },
  // 16. Attrell Toyota (Brampton / Canam Crescent)
  'attrell-toyota': {
    id: 'attrell-toyota',
    name: 'Attrell Toyota',
    city: 'Brampton',
    province: 'ON',
    area: 'Brampton / GTA West',
    adapter: 'convertus',
    baseUrl: 'https://www.attrelltoyota.com',
    apiEndpoint:
      'https://www.attrelltoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.7119,
    longitude: -79.8266,
    lat: 43.7119,
    lng: -79.8266,
    enabled: true,
  },
  // 17. Georgetown Toyota (Georgetown / Halton Hills)
  'georgetown-toyota': {
    id: 'georgetown-toyota',
    name: 'Georgetown Toyota',
    city: 'Georgetown',
    province: 'ON',
    area: 'Georgetown / Halton Hills',
    adapter: 'convertus',
    baseUrl: 'https://www.georgetowntoyota.com',
    apiEndpoint:
      'https://www.georgetowntoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.6497,
    longitude: -79.8935,
    lat: 43.6497,
    lng: -79.8935,
    enabled: true,
  },
  // 18. Erin Park Toyota (Mississauga / Erin Mills Auto Centre)
  'erin-park-toyota': {
    id: 'erin-park-toyota',
    name: 'Erin Park Toyota',
    city: 'Mississauga',
    province: 'ON',
    area: 'Mississauga / Erin Mills Auto Centre',
    adapter: 'convertus',
    baseUrl: 'https://www.erinparktoyota.com',
    apiEndpoint:
      'https://www.erinparktoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.5296,
    longitude: -79.6763,
    lat: 43.5296,
    lng: -79.6763,
    enabled: true,
  },
  // 19. Mississauga Toyota (Mississauga / Dundas St E)
  'mississauga-toyota': {
    id: 'mississauga-toyota',
    name: 'Mississauga Toyota',
    city: 'Mississauga',
    province: 'ON',
    area: 'Mississauga / Dundas St E',
    adapter: 'convertus',
    baseUrl: 'https://www.mississaugatoyota.com',
    apiEndpoint:
      'https://www.mississaugatoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D4092%26ln%3Den%26sc%3Dnew%26pc%3D100',
    latitude: 43.6156,
    longitude: -79.5697,
    lat: 43.6156,
    lng: -79.5697,
    enabled: true,
  },
  // 20. Simcoe Toyota (Simcoe / Norfolk County)
  'simcoe-toyota': {
    id: 'simcoe-toyota',
    name: 'Simcoe Toyota',
    city: 'Simcoe',
    province: 'ON',
    area: 'Simcoe / Southwestern Ontario',
    adapter: 'convertus',
    baseUrl: 'https://www.simcoetoyota.ca',
    apiEndpoint:
      'https://www.simcoetoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1559%26ln%3Den%26sc%3Dnew%26pc%3D100',
    latitude: 42.8428,
    longitude: -80.2942,
    lat: 42.8428,
    lng: -80.2942,
    enabled: true,
  },
  // 21. Downtown Toyota (Toronto / Queen St E)
  'downtown-toyota': {
    id: 'downtown-toyota',
    name: 'Downtown Toyota',
    city: 'Toronto',
    province: 'ON',
    area: 'Toronto / Queen St E',
    adapter: 'convertus',
    baseUrl: 'https://www.downtowntoyota.ca',
    apiEndpoint:
      'https://www.downtowntoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.6589,
    longitude: -79.3507,
    lat: 43.6589,
    lng: -79.3507,
    enabled: true,
  },
  // 22. Don Valley North Toyota (Markham / Steeles Ave E)
  'don-valley-north-toyota': {
    id: 'don-valley-north-toyota',
    name: 'Don Valley North Toyota',
    city: 'Markham',
    province: 'ON',
    area: 'Markham / Steeles Ave E',
    adapter: 'convertus',
    baseUrl: 'https://www.donvalleynorthtoyota.com',
    apiEndpoint:
      'https://www.donvalleynorthtoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.8161,
    longitude: -79.3422,
    lat: 43.8161,
    lng: -79.3422,
    enabled: true,
  },
  // 23. Thornhill Toyota (Vaughan / Yonge & Steeles)
  'thornhill-toyota': {
    id: 'thornhill-toyota',
    name: 'Thornhill Toyota',
    city: 'Vaughan',
    province: 'ON',
    area: 'Vaughan / Thornhill',
    adapter: 'convertus',
    baseUrl: 'https://www.thornhilltoyota.com',
    apiEndpoint:
      'https://www.thornhilltoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.8172,
    longitude: -79.4241,
    lat: 43.8172,
    lng: -79.4241,
    enabled: true,
  },
  // 24. Richmond Hill Toyota (Richmond Hill / Mayfield Ave)
  'richmond-hill-toyota': {
    id: 'richmond-hill-toyota',
    name: 'Richmond Hill Toyota',
    city: 'Richmond Hill',
    province: 'ON',
    area: 'Richmond Hill / York Region',
    adapter: 'convertus',
    baseUrl: 'https://www.richmondhilltoyota.com',
    apiEndpoint:
      'https://www.richmondhilltoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.9038,
    longitude: -79.4426,
    lat: 43.9038,
    lng: -79.4426,
    enabled: true,
  },
  // 25. Oakville Toyota (Oakville / Wyecroft Rd)
  'oakville-toyota': {
    id: 'oakville-toyota',
    name: 'Oakville Toyota',
    city: 'Oakville',
    province: 'ON',
    area: 'Oakville / Halton Region',
    adapter: 'convertus',
    baseUrl: 'https://www.oakvilletoyota.ca',
    apiEndpoint:
      'https://www.oakvilletoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.4139,
    longitude: -79.7267,
    lat: 43.4139,
    lng: -79.7267,
    enabled: true,
  },
  // 26. Upper James Toyota (Hamilton / Upper James St)
  'upper-james-toyota': {
    id: 'upper-james-toyota',
    name: 'Upper James Toyota',
    city: 'Hamilton',
    province: 'ON',
    area: 'Hamilton / Golden Horseshoe',
    adapter: 'convertus',
    baseUrl: 'https://www.upperjamestoyota.ca',
    apiEndpoint:
      'https://www.upperjamestoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.2208,
    longitude: -79.8842,
    lat: 43.2208,
    lng: -79.8842,
    enabled: true,
  },
  // 27. Pickering Toyota (Pickering / Kingston Rd)
  'pickering-toyota': {
    id: 'pickering-toyota',
    name: 'Pickering Toyota',
    city: 'Pickering',
    province: 'ON',
    area: 'Pickering / Durham Region',
    adapter: 'convertus',
    baseUrl: 'https://www.pickeringtoyota.com',
    apiEndpoint:
      'https://www.pickeringtoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.8144,
    longitude: -79.1206,
    lat: 43.8144,
    lng: -79.1206,
    enabled: true,
  },
  // 28. Whitby Toyota (Whitby / Dundas St W)
  'whitby-toyota': {
    id: 'whitby-toyota',
    name: 'Whitby Toyota',
    city: 'Whitby',
    province: 'ON',
    area: 'Whitby / Durham Region',
    adapter: 'convertus',
    baseUrl: 'https://www.whitbytoyota.com',
    apiEndpoint:
      'https://www.whitbytoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 43.8732,
    longitude: -78.9675,
    lat: 43.8732,
    lng: -78.9675,
    enabled: true,
  },
  // 29. OpenRoad Lexus Richmond
  'openroad-lexus-richmond': {
    id: 'openroad-lexus-richmond',
    name: 'OpenRoad Lexus Richmond',
    city: 'Richmond',
    province: 'BC',
    area: 'Richmond Automall',
    adapter: 'convertus',
    baseUrl: 'https://openroadlexusrichmond.com',
    apiEndpoint:
      'https://www.openroadlexusrichmond.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26ln%3Den%26pg%3D1%26pc%3D100%26im%3Dtrue%26in_transit%3Dtrue%26in_stock%3Dtrue%26on_order%3Dtrue%26mk%3Dlexus',
    latitude: 49.1711,
    longitude: -123.0722,
    lat: 49.1711,
    lng: -123.0722,
    enabled: true,
  },
  // 30. Jim Pattison Lexus Northshore
  'pattison-lexus-northshore': {
    id: 'pattison-lexus-northshore',
    name: 'Jim Pattison Lexus Northshore',
    city: 'North Vancouver',
    province: 'BC',
    area: 'North Shore Automall',
    adapter: 'convertus',
    baseUrl: 'https://www.jimpattisonlexus.com',
    apiEndpoint:
      'https://www.jimpattisonlexus.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26ln%3Den%26pg%3D1%26pc%3D100%26im%3Dtrue%26in_transit%3Dtrue%26in_stock%3Dtrue%26on_order%3Dtrue%26mk%3Dlexus',
    latitude: 49.3142,
    longitude: -123.0967,
    lat: 49.3142,
    lng: -123.0967,
    enabled: true,
  },
  // 31. Lexus Downtown
  'lexus-downtown-toronto': {
    id: 'lexus-downtown-toronto',
    name: 'Lexus Downtown',
    city: 'Toronto',
    province: 'ON',
    area: 'Downtown Toronto / East York',
    adapter: 'edealer',
    baseUrl: 'https://www.lexusdowntown.ca',
    apiEndpoint: 'https://www.lexusdowntown.ca/inventory-listing-sitemap.xml',
    latitude: 43.6532,
    longitude: -79.3832,
    lat: 43.6532,
    lng: -79.3832,
    enabled: true,
  },
  // 32. Don Valley North Lexus
  'dvnt-lexus': {
    id: 'dvnt-lexus',
    name: 'Don Valley North Lexus',
    city: 'Markham',
    province: 'ON',
    area: 'Markham / GTA North',
    adapter: 'convertus',
    baseUrl: 'https://www.donvalleynorthlexus.com',
    apiEndpoint:
      'https://www.donvalleynorthlexus.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26ln%3Den%26pg%3D1%26pc%3D100%26im%3Dtrue%26in_transit%3Dtrue%26in_stock%3Dtrue%26on_order%3Dtrue%26mk%3Dlexus',
    latitude: 43.8166,
    longitude: -79.3364,
    lat: 43.8166,
    lng: -79.3364,
    enabled: true,
  },
  // 33. Lexus of Richmond Hill
  'lexus-richmond-hill': {
    id: 'lexus-richmond-hill',
    name: 'Lexus of Richmond Hill',
    city: 'Richmond Hill',
    province: 'ON',
    area: 'Richmond Hill / GTA North',
    adapter: 'convertus',
    baseUrl: 'https://www.lexusofrichmondhill.com',
    apiEndpoint:
      'https://www.lexusofrichmondhill.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26ln%3Den%26pg%3D1%26pc%3D100%26im%3Dtrue%26in_transit%3Dtrue%26in_stock%3Dtrue%26on_order%3Dtrue%26mk%3Dlexus',
    latitude: 43.9015,
    longitude: -79.4442,
    lat: 43.9015,
    lng: -79.4442,
    enabled: true,
  },
  // 32. Stampede Toyota (Calgary / Heritage Dr SE)
  'stampede-toyota': {
    id: 'stampede-toyota',
    name: 'Stampede Toyota',
    city: 'Calgary',
    province: 'AB',
    area: 'Heritage Dr SE',
    adapter: 'convertus',
    baseUrl: 'https://www.stampedetoyotacalgary.com',
    apiEndpoint:
      'https://www.stampedetoyotacalgary.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 50.9852,
    longitude: -114.0722,
    lat: 50.9852,
    lng: -114.0722,
    enabled: true,
  },
  // 33. Country Hills Toyota (Calgary / Freeport Landing NE)
  'country-hills-toyota': {
    id: 'country-hills-toyota',
    name: 'Country Hills Toyota',
    city: 'Calgary',
    province: 'AB',
    area: 'Freeport Landing NE',
    adapter: 'convertus',
    baseUrl: 'https://www.chtoyota.com',
    apiEndpoint:
      'https://www.chtoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 51.1557,
    longitude: -114.0135,
    lat: 51.1557,
    lng: -114.0135,
    enabled: true,
  },
  // 34. Gateway Toyota (Edmonton / 103A St SW)
  'gateway-toyota': {
    id: 'gateway-toyota',
    name: 'Gateway Toyota',
    city: 'Edmonton',
    province: 'AB',
    area: 'South Edmonton / 103A St SW',
    adapter: 'convertus',
    baseUrl: 'https://www.gatewaytoyota.ca',
    apiEndpoint:
      'https://www.gatewaytoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 53.4347,
    longitude: -113.4975,
    lat: 53.4347,
    lng: -113.4975,
    enabled: true,
  },
  // 35. Mayfield Toyota (Edmonton / 170 St NW)
  'mayfield-toyota': {
    id: 'mayfield-toyota',
    name: 'Mayfield Toyota',
    city: 'Edmonton',
    province: 'AB',
    area: 'West Edmonton / 170 St NW',
    adapter: 'convertus',
    baseUrl: 'https://www.wemtoyota.com',
    apiEndpoint:
      'https://www.wemtoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    latitude: 53.5428,
    longitude: -113.6163,
    lat: 53.5428,
    lng: -113.6163,
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

  // Alberta Dealers (Calgary & Edmonton)
  if (
    query.includes('stampede') ||
    query.includes('stampede-toyota') ||
    query.includes('stampedetoyota')
  ) {
    return {
      lat: DEALERS['stampede-toyota'].lat,
      lng: DEALERS['stampede-toyota'].lng,
    };
  }

  if (
    query.includes('country hills') ||
    query.includes('country-hills') ||
    query.includes('countryhillstoyota') ||
    query.includes('chtoyota')
  ) {
    return {
      lat: DEALERS['country-hills-toyota'].lat,
      lng: DEALERS['country-hills-toyota'].lng,
    };
  }

  if (
    query.includes('gateway') ||
    query.includes('gateway-toyota') ||
    query.includes('gatewaytoyota')
  ) {
    return {
      lat: DEALERS['gateway-toyota'].lat,
      lng: DEALERS['gateway-toyota'].lng,
    };
  }

  if (
    query.includes('mayfield') ||
    query.includes('mayfield-toyota') ||
    query.includes('mayfieldtoyota') ||
    query.includes('wem toyota') ||
    query.includes('wemtoyota') ||
    query.includes('west edmonton mall')
  ) {
    return {
      lat: DEALERS['mayfield-toyota'].lat,
      lng: DEALERS['mayfield-toyota'].lng,
    };
  }

  // Ontario / GTA Dealers — check specific dealers before generic city names
  if (
    query.includes('downtown toyota') ||
    query.includes('downtown-toyota') ||
    query.includes('downtowntoyota') ||
    (query.includes('downtown') && query.includes('toronto'))
  ) {
    return {
      lat: DEALERS['downtown-toyota'].lat,
      lng: DEALERS['downtown-toyota'].lng,
    };
  }

  if (
    query.includes('don valley') ||
    query.includes('don-valley') ||
    query.includes('dvntoyota') ||
    query.includes('donvalleynorth') ||
    query.includes('markham')
  ) {
    return {
      lat: DEALERS['don-valley-north-toyota'].lat,
      lng: DEALERS['don-valley-north-toyota'].lng,
    };
  }

  if (
    query.includes('thornhill') ||
    query.includes('thornhill-toyota') ||
    query.includes('vaughan')
  ) {
    return {
      lat: DEALERS['thornhill-toyota'].lat,
      lng: DEALERS['thornhill-toyota'].lng,
    };
  }

  // Check Richmond Hill BEFORE generic Richmond (BC)!
  if (
    query.includes('richmond hill') ||
    query.includes('richmond-hill') ||
    query.includes('richmondhill')
  ) {
    return {
      lat: DEALERS['richmond-hill-toyota'].lat,
      lng: DEALERS['richmond-hill-toyota'].lng,
    };
  }

  if (
    query.includes('oakville') ||
    query.includes('oakville-toyota')
  ) {
    return {
      lat: DEALERS['oakville-toyota'].lat,
      lng: DEALERS['oakville-toyota'].lng,
    };
  }

  if (
    query.includes('upper james') ||
    query.includes('upper-james') ||
    query.includes('upperjames') ||
    query.includes('hamilton')
  ) {
    return {
      lat: DEALERS['upper-james-toyota'].lat,
      lng: DEALERS['upper-james-toyota'].lng,
    };
  }

  if (
    query.includes('pickering') ||
    query.includes('pickering-toyota')
  ) {
    return {
      lat: DEALERS['pickering-toyota'].lat,
      lng: DEALERS['pickering-toyota'].lng,
    };
  }

  if (
    query.includes('whitby') ||
    query.includes('whitby-toyota')
  ) {
    return {
      lat: DEALERS['whitby-toyota'].lat,
      lng: DEALERS['whitby-toyota'].lng,
    };
  }

  if (
    query.includes('erin park') ||
    query.includes('erin-park') ||
    query.includes('erinpark')
  ) {
    return {
      lat: DEALERS['erin-park-toyota'].lat,
      lng: DEALERS['erin-park-toyota'].lng,
    };
  }

  if (
    query.includes('mississauga') ||
    query.includes('mississauga-toyota')
  ) {
    return {
      lat: DEALERS['mississauga-toyota'].lat,
      lng: DEALERS['mississauga-toyota'].lng,
    };
  }

  if (
    query.includes('ken shaw') ||
    query.includes('ken-shaw') ||
    query.includes('kenshaw') ||
    query.includes('toronto')
  ) {
    return {
      lat: DEALERS['ken-shaw-toyota'].lat,
      lng: DEALERS['ken-shaw-toyota'].lng,
    };
  }

  if (
    query.includes('attrell') ||
    query.includes('attrell-toyota') ||
    query.includes('brampton')
  ) {
    return {
      lat: DEALERS['attrell-toyota'].lat,
      lng: DEALERS['attrell-toyota'].lng,
    };
  }

  if (
    query.includes('georgetown') ||
    query.includes('georgetown-toyota')
  ) {
    return {
      lat: DEALERS['georgetown-toyota'].lat,
      lng: DEALERS['georgetown-toyota'].lng,
    };
  }

  if (
    query.includes('simcoe') ||
    query.includes('simcoe-toyota')
  ) {
    return {
      lat: DEALERS['simcoe-toyota'].lat,
      lng: DEALERS['simcoe-toyota'].lng,
    };
  }

  // OpenRoad Toyota Peace Arch (South Surrey / White Rock) — check before generic 'openroad' and 'surrey'
  if (
    query.includes('peace arch') ||
    query.includes('peacearch') ||
    query.includes('openroad-toyota-peace-arch') ||
    query.includes('white rock') ||
    query.includes('south surrey')
  ) {
    return {
      lat: DEALERS['openroad-toyota-peace-arch'].lat,
      lng: DEALERS['openroad-toyota-peace-arch'].lng,
    };
  }

  // Langley Toyota (Fraser Valley / Langley Bypass)
  if (
    query.includes('langley') ||
    query.includes('langley-toyota')
  ) {
    return {
      lat: DEALERS['langley-toyota'].lat,
      lng: DEALERS['langley-toyota'].lng,
    };
  }

  // Nanaimo Toyota (Vancouver Island)
  if (
    query.includes('nanaimo') ||
    query.includes('nanaimo-toyota')
  ) {
    return {
      lat: DEALERS['nanaimo-toyota'].lat,
      lng: DEALERS['nanaimo-toyota'].lng,
    };
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

  // Westminster Toyota (New Westminster / Queensborough)
  if (
    query.includes('westminster') ||
    query.includes('westminster-toyota') ||
    query.includes('new west')
  ) {
    return { lat: DEALERS['westminster-toyota'].lat, lng: DEALERS['westminster-toyota'].lng };
  }

  // Vernon Toyota (North Okanagan / Interior BC)
  if (
    query.includes('vernon') ||
    query.includes('vernon-toyota')
  ) {
    return { lat: DEALERS['vernon-toyota'].lat, lng: DEALERS['vernon-toyota'].lng };
  }

  // Kelowna Toyota (Interior BC / Okanagan)
  if (
    query.includes('kelowna') ||
    query.includes('kelowna-toyota') ||
    query.includes('okanagan')
  ) {
    return { lat: DEALERS['kelowna-toyota'].lat, lng: DEALERS['kelowna-toyota'].lng };
  }

  // Jim Pattison Toyota Duncan (Vancouver Island)
  if (
    query.includes('duncan') ||
    query.includes('jptoyota-duncan')
  ) {
    return { lat: DEALERS['jptoyota-duncan'].lat, lng: DEALERS['jptoyota-duncan'].lng };
  }

  // Jim Pattison Toyota Victoria (Vancouver Island)
  if (
    query.includes('victoria') ||
    query.includes('jptoyota-victoria') ||
    (query.includes('island') && !query.includes('richmond'))
  ) {
    return { lat: DEALERS['jptoyota-victoria'].lat, lng: DEALERS['jptoyota-victoria'].lng };
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
