import { createServerClient } from '@/lib/supabase/server';

export interface AffiliateRecord {
  id: string;
  slug: string;
  destinationUrl: string;
  title: string;
  category: string;
  clickCount: number;
  isActive: boolean;
}

// Fallback registry matching 004_seed_canadian_data.sql and 006_se_mods_affiliates.sql
const FALLBACK_AFFILIATES: Record<string, AffiliateRecord> = {
  'tuxmat-rav4': {
    id: 'f1111111-1111-4111-8111-111111111111',
    slug: 'tuxmat-rav4',
    destinationUrl: 'https://www.amazon.ca/s?k=TuxMat+Toyota+RAV4&tag=toyotawaits-20',
    title: 'TuxMat Custom Floor Liners (RAV4)',
    category: 'accessories',
    clickCount: 0,
    isActive: true,
  },
  'tuxmat-sienna': {
    id: 'f2222222-2222-4222-8222-222222222222',
    slug: 'tuxmat-sienna',
    destinationUrl: 'https://www.amazon.ca/s?k=TuxMat+Toyota+Sienna&tag=toyotawaits-20',
    title: 'TuxMat Custom Floor Liners (Sienna 7/8 Passenger)',
    category: 'accessories',
    clickCount: 0,
    isActive: true,
  },
  'viofo-a229-pro': {
    id: 'f3333333-3333-4333-8333-333333333333',
    slug: 'viofo-a229-pro',
    destinationUrl: 'https://www.amazon.ca/s?k=VIOFO+A229+Pro+4K&tag=toyotawaits-20',
    title: 'VIOFO A229 Pro 4K HDR Dual Dash Cam',
    category: 'electronics',
    clickCount: 0,
    isActive: true,
  },
  'screen-protector-12-3': {
    id: 'f4444444-4444-4444-8444-444444444444',
    slug: 'screen-protector-12-3',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+12.3+screen+protector&tag=toyotawaits-20',
    title: '12.3-inch Infotainment Tempered Glass Screen Protector',
    category: 'accessories',
    clickCount: 0,
    isActive: true,
  },
  'no-drill-mud-flaps-rav4': {
    id: 'f5555555-5555-4555-8555-555555555555',
    slug: 'no-drill-mud-flaps-rav4',
    destinationUrl: 'https://www.amazon.ca/s?k=A-Premium+mud+flaps+Toyota+RAV4&tag=toyotawaits-20',
    title: 'A-Premium No-Drill Mud Flaps Set for Toyota RAV4',
    category: 'exterior',
    clickCount: 0,
    isActive: true,
  },
  'grizzl-e-charger': {
    id: 'f6666666-6666-4666-8666-666666666666',
    slug: 'grizzl-e-charger',
    destinationUrl: 'https://www.amazon.ca/s?k=Grizzl-E+Level+2+EV+Charger&tag=toyotawaits-20',
    title: 'Grizzl-E Classic Level 2 EV Charger (40A, Canadian Winter Rated)',
    category: 'ev-charging',
    clickCount: 0,
    isActive: true,
  },
  'flo-g5': {
    id: 'f7777777-7777-4777-8777-777777777777',
    slug: 'flo-g5',
    destinationUrl: 'https://www.amazon.ca/s?k=FLO+Home+EV+Charger&tag=toyotawaits-20',
    title: 'FLO Home G5 Level 2 30A EVSE Charging Station',
    category: 'ev-charging',
    clickCount: 0,
    isActive: true,
  },
  'michelin-xice': {
    id: 'f8888888-8888-4888-8888-888888888888',
    slug: 'michelin-xice',
    destinationUrl: 'https://www.quattrotires.com/tires/michelin-x-ice-snow?ref=toyotawaits',
    title: 'Michelin X-Ice Snow Winter Tires (SUV & Passenger fitments)',
    category: 'winter-tires',
    clickCount: 0,
    isActive: true,
  },
  'bridgestone-blizzak': {
    id: 'f9999999-9999-4999-8999-999999999999',
    slug: 'bridgestone-blizzak',
    destinationUrl: 'https://www.quattrotires.com/tires/bridgestone-blizzak-ws90?ref=toyotawaits',
    title: 'Bridgestone Blizzak WS90 / DM-V2 Winter Tires',
    category: 'winter-tires',
    clickCount: 0,
    isActive: true,
  },
  'rates-ca-insurance': {
    id: 'faaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    slug: 'rates-ca-insurance',
    destinationUrl: 'https://rates.ca/auto-insurance?ref=toyotawaits',
    title: 'Rates.ca Canadian Auto Insurance Quote Comparison',
    category: 'insurance',
    clickCount: 0,
    isActive: true,
  },
  'jbl-club-dash-speakers': {
    id: 'fbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    slug: 'jbl-club-dash-speakers',
    destinationUrl: 'https://www.amazon.ca/s?k=JBL+Club+3.5+speakers&tag=toyotawaits-20',
    title: 'JBL Club 3.5" Dash Tweeters / Midrange Speakers',
    category: 'audio',
    clickCount: 0,
    isActive: true,
  },
  'toyota-speaker-harness': {
    id: 'fccccccc-cccc-4ccc-8ccc-cccccccccccc',
    slug: 'toyota-speaker-harness',
    destinationUrl: 'https://www.amazon.ca/s?k=RED+WOLF+Toyota+dash+speaker+wiring+harness&tag=toyotawaits-20',
    title: 'Red Wolf / Metra Toyota Dash Speaker Plug-and-Play Wiring Harness (Pair)',
    category: 'audio',
    clickCount: 0,
    isActive: true,
  },
  'trim-removal-tools': {
    id: 'fddddddd-dddd-4ddd-8ddd-dddddddddddd',
    slug: 'trim-removal-tools',
    destinationUrl: 'https://www.amazon.ca/s?k=auto+trim+removal+tool+kit&tag=toyotawaits-20',
    title: 'Non-Marring Automotive Dash Pry & Trim Removal Tool Kit',
    category: 'tools',
    clickCount: 0,
    isActive: true,
  },
  'clazzio-leather-covers': {
    id: 'feeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    slug: 'clazzio-leather-covers',
    destinationUrl: 'https://www.clazzio.com/',
    title: 'Clazzio Custom-Fit Leather / PVC Seat Covers (RAV4 Prime)',
    category: 'interior',
    clickCount: 0,
    isActive: true,
  },
  'ekr-seat-covers': {
    id: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
    slug: 'ekr-seat-covers',
    destinationUrl: 'https://www.amazon.ca/s?k=EKR+custom+fit+car+seat+covers+Toyota+RAV4&tag=toyotawaits-20',
    title: 'EKR Custom Tailored Full Leatherette Seat Covers (RAV4 Prime)',
    category: 'interior',
    clickCount: 0,
    isActive: true,
  },
  // Sienna Mods
  'sienna-console-bridge-tray': {
    id: 'f0000001-0001-4001-8001-000000000001',
    slug: 'sienna-console-bridge-tray',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Sienna+center+console+bridge+tray+organizer&tag=toyotawaits-20',
    title: 'Toyota Sienna Center Console Bridge Under-Tray Organizer',
    category: 'interior',
    clickCount: 0,
    isActive: true,
  },
  'sienna-air-lift-1000': {
    id: 'f0000002-0002-4002-8002-000000000002',
    slug: 'sienna-air-lift-1000',
    destinationUrl: 'https://www.amazon.ca/s?k=Air+Lift+1000+Toyota+Sienna&tag=toyotawaits-20',
    title: 'Air Lift 1000 In-Coil Rear Air Helper Spring Kit',
    category: 'suspension',
    clickCount: 0,
    isActive: true,
  },
  'sienna-fitcamx-dashcam': {
    id: 'f0000003-0003-4003-8003-000000000003',
    slug: 'sienna-fitcamx-dashcam',
    destinationUrl: 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Sienna+dash+cam&tag=toyotawaits-20',
    title: 'FitcamX OEM Integrated 4K Mirror Dash Cam (Toyota Sienna)',
    category: 'electronics',
    clickCount: 0,
    isActive: true,
  },
  'sienna-hatch-led-lights': {
    id: 'f0000004-0004-4004-8004-000000000004',
    slug: 'sienna-hatch-led-lights',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Sienna+rear+hatch+cargo+LED+lights&tag=toyotawaits-20',
    title: 'Powerty Dual Rear Cargo Liftgate LED Flood Lights',
    category: 'lighting',
    clickCount: 0,
    isActive: true,
  },
  // Grand Highlander Mods
  'gh-console-organizer-tray': {
    id: 'f0000005-0005-4005-8005-000000000005',
    slug: 'gh-console-organizer-tray',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+center+console+tray+organizer&tag=toyotawaits-20',
    title: 'Toyota Grand Highlander Center Console Armrest Divider & Tray',
    category: 'interior',
    clickCount: 0,
    isActive: true,
  },
  'gh-rear-cargo-lamps': {
    id: 'f0000006-0006-4006-8006-000000000006',
    slug: 'gh-rear-cargo-lamps',
    destinationUrl: 'https://www.amazon.ca/s?k=Grand+Highlander+rear+cargo+hatch+lights&tag=toyotawaits-20',
    title: 'Grand Highlander Dual Rear Cargo Hatch LED Lamps (PT944 Style)',
    category: 'lighting',
    clickCount: 0,
    isActive: true,
  },
  'gh-wireless-charger-mat': {
    id: 'f0000007-0007-4007-8007-000000000007',
    slug: 'gh-wireless-charger-mat',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+wireless+charger+mat&tag=toyotawaits-20',
    title: 'Grand Highlander Anti-Slip Silicone Wireless Charging Pad Mat',
    category: 'interior',
    clickCount: 0,
    isActive: true,
  },
  // Land Cruiser 250 Mods
  'lc250-speaker-upgrade': {
    id: 'f0000008-0008-4008-8008-000000000008',
    slug: 'lc250-speaker-upgrade',
    destinationUrl: 'https://www.amazon.ca/s?k=Land+Cruiser+250+speaker+upgrade+dash+door&tag=toyotawaits-20',
    title: 'Land Cruiser 250 (1958 Trim) 3.5" Dash & Front Speaker Drop-In Upgrade',
    category: 'audio',
    clickCount: 0,
    isActive: true,
  },
  'lc250-rock-sliders': {
    id: 'f0000009-0009-4009-8009-000000000009',
    slug: 'lc250-rock-sliders',
    destinationUrl: 'https://www.amazon.ca/s?k=Land+Cruiser+250+rock+sliders+armor&tag=toyotawaits-20',
    title: 'Land Cruiser 250 Heavy-Duty Frame-Mounted Rock Sliders & Sills',
    category: 'exterior',
    clickCount: 0,
    isActive: true,
  },
  // Delivery Day Checklist Accessories
  'fitcamx-rav4': {
    id: 'f1000001-0001-4001-8001-000000000001',
    slug: 'fitcamx-rav4',
    destinationUrl: 'https://www.amazon.ca/s?k=Fitcamx+Toyota+RAV4+dash+cam&tag=toyotawaits-20',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (RAV4)',
    category: 'visibility_protection',
    clickCount: 0,
    isActive: true,
  },
  'fitcamx-sienna': {
    id: 'f1000002-0002-4002-8002-000000000002',
    slug: 'fitcamx-sienna',
    destinationUrl: 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Sienna+dash+cam&tag=toyotawaits-20',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Sienna)',
    category: 'visibility_protection',
    clickCount: 0,
    isActive: true,
  },
  'fitcamx-grand-highlander': {
    id: 'f1000003-0003-4003-8003-000000000003',
    slug: 'fitcamx-grand-highlander',
    destinationUrl: 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Grand+Highlander+dash+cam&tag=toyotawaits-20',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Grand Highlander)',
    category: 'visibility_protection',
    clickCount: 0,
    isActive: true,
  },
  'fitcamx-land-cruiser': {
    id: 'f1000004-0004-4004-8004-000000000004',
    slug: 'fitcamx-land-cruiser',
    destinationUrl: 'https://www.amazon.ca/s?k=Fitcamx+Toyota+Land+Cruiser+250+dash+cam&tag=toyotawaits-20',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (Land Cruiser 250)',
    category: 'visibility_protection',
    clickCount: 0,
    isActive: true,
  },
  'screen-protector-rav4': {
    id: 'f1000005-0005-4005-8005-000000000005',
    slug: 'screen-protector-rav4',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+tempered+glass+screen+protector&tag=toyotawaits-20',
    title: 'Anti-Glare 9H Tempered Glass Screen Protector (RAV4)',
    category: 'visibility_protection',
    clickCount: 0,
    isActive: true,
  },
  'screen-protector-sienna': {
    id: 'f1000006-0006-4006-8006-000000000006',
    slug: 'screen-protector-sienna',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Sienna+screen+protector+tempered+glass&tag=toyotawaits-20',
    title: 'Matte Anti-Glare Screen Protector (Toyota Sienna)',
    category: 'visibility_protection',
    clickCount: 0,
    isActive: true,
  },
  'screen-protector-grand-highlander': {
    id: 'f1000007-0007-4007-8007-000000000007',
    slug: 'screen-protector-grand-highlander',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+12.3+screen+protector&tag=toyotawaits-20',
    title: '12.3-inch Anti-Glare Tempered Glass (Grand Highlander)',
    category: 'visibility_protection',
    clickCount: 0,
    isActive: true,
  },
  'screen-protector-land-cruiser': {
    id: 'f1000008-0008-4008-8008-000000000008',
    slug: 'screen-protector-land-cruiser',
    destinationUrl: 'https://www.amazon.ca/s?k=Land+Cruiser+250+screen+protector+tempered+glass&tag=toyotawaits-20',
    title: 'Armor-Grade Multimedia Screen Shield (Land Cruiser 250)',
    category: 'visibility_protection',
    clickCount: 0,
    isActive: true,
  },
  'console-tray-rav4': {
    id: 'f1000009-0009-4009-8009-000000000009',
    slug: 'console-tray-rav4',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+center+console+tray+organizer&tag=toyotawaits-20',
    title: 'Drop-In Center Console Divider & Coin Tray (RAV4)',
    category: 'cabin_organization',
    clickCount: 0,
    isActive: true,
  },
  'console-tray-sienna': {
    id: 'f1000010-0010-4010-8010-000000000010',
    slug: 'console-tray-sienna',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Sienna+center+console+bridge+tray+organizer&tag=toyotawaits-20',
    title: 'Dual-Tier Center Console & Bridge Organizer (Sienna)',
    category: 'cabin_organization',
    clickCount: 0,
    isActive: true,
  },
  'console-tray-grand-highlander': {
    id: 'f1000011-0011-4011-8011-000000000011',
    slug: 'console-tray-grand-highlander',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+center+console+tray+organizer&tag=toyotawaits-20',
    title: 'Precision Armrest Divider & Upper Storage Tray (Grand Highlander)',
    category: 'cabin_organization',
    clickCount: 0,
    isActive: true,
  },
  'console-tray-land-cruiser': {
    id: 'f1000012-0012-4012-8012-000000000012',
    slug: 'console-tray-land-cruiser',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Land+Cruiser+250+center+console+organizer+tray&tag=toyotawaits-20',
    title: 'Heavy-Duty Armrest Storage Organizer (Land Cruiser 250)',
    category: 'cabin_organization',
    clickCount: 0,
    isActive: true,
  },
  'noco-gb40-jump-pack': {
    id: 'f1000013-0013-4013-8013-000000000013',
    slug: 'noco-gb40-jump-pack',
    destinationUrl: 'https://www.amazon.ca/s?k=NOCO+Boost+Plus+GB40+1000A&tag=toyotawaits-20',
    title: 'NOCO Boost Plus GB40 1000A 12V UltraSafe Lithium Jump Starter',
    category: 'roadside_winter',
    clickCount: 0,
    isActive: true,
  },
  'j1772-charger-lock': {
    id: 'f1000014-0014-4014-8014-000000000014',
    slug: 'j1772-charger-lock',
    destinationUrl: 'https://www.amazon.ca/s?k=J1772+charger+lock+ring+Toyota+RAV4+Prime&tag=toyotawaits-20',
    title: 'J1772 Public EV Charging Port Combination Lock Ring',
    category: 'roadside_winter',
    clickCount: 0,
    isActive: true,
  },
  'all-weather-mats-rav4': {
    id: 'f1000015-0015-4015-8015-000000000015',
    slug: 'all-weather-mats-rav4',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+all+weather+floor+mats+custom+fit&tag=toyotawaits-20',
    title: 'Laser-Measured All-Weather Floor Mats & Cargo Liner (RAV4)',
    category: 'cabin_organization',
    clickCount: 0,
    isActive: true,
  },
  'high-wall-floor-liners-rav4': {
    id: 'f1000016-0016-4016-8016-000000000016',
    slug: 'high-wall-floor-liners-rav4',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+hybrid+all+weather+floor+mats+cargo+liner+tuxmat&tag=toyotawaits-20',
    title: 'High-Wall All-Weather Floor Liners & Cargo Mat (RAV4 Hybrid & Prime)',
    category: 'cabin_organization',
    clickCount: 0,
    isActive: true,
  },
  '3-row-all-weather-liners': {
    id: 'f1000017-0017-4017-8017-000000000017',
    slug: '3-row-all-weather-liners',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+Sienna+all+weather+floor+mats+3+row&tag=toyotawaits-20',
    title: '3-Row Heavy Duty All-Weather Floor Liners (Grand Highlander & Sienna)',
    category: 'cabin_organization',
    clickCount: 0,
    isActive: true,
  },
  'roof-rack-crossbars-rav4': {
    id: 'f1000018-0018-4018-8018-000000000018',
    slug: 'roof-rack-crossbars-rav4',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+roof+rack+cross+bars+OEM+style&tag=toyotawaits-20',
    title: 'OEM-Style Lockable Aluminum Roof Rack Cross Bars (RAV4)',
    category: 'cargo_utility',
    clickCount: 0,
    isActive: true,
  },
  'roof-rack-crossbars-grand-highlander': {
    id: 'f1000019-0019-4019-8019-000000000019',
    slug: 'roof-rack-crossbars-grand-highlander',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+roof+rack+crossbars&tag=toyotawaits-20',
    title: 'Heavy-Duty Roof Crossbar System (Highlander & Grand Highlander)',
    category: 'cargo_utility',
    clickCount: 0,
    isActive: true,
  },
  'roof-rack-crossbars-corolla-cross': {
    id: 'f1000020-0020-4020-8020-000000000020',
    slug: 'roof-rack-crossbars-corolla-cross',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+Corolla+Cross+roof+rack+crossbars&tag=toyotawaits-20',
    title: 'Low-Profile Cargo Roof Rack Bars (Corolla Cross)',
    category: 'cargo_utility',
    clickCount: 0,
    isActive: true,
  },
  // Gen 5 Prius & Prius Prime Mods
  'fitcamx-prius': {
    id: 'f2000001-0001-4001-8001-000000000001',
    slug: 'fitcamx-prius',
    destinationUrl: 'https://www.amazon.ca/s?k=FitcamX+Gen+5+Prius+Dashcam&tag=danrubin03-20',
    title: 'FitcamX OEM-Integrated 4K Dashcam (Gen 5 Prius)',
    category: 'tech_safety',
    clickCount: 0,
    isActive: true,
  },
  'prius-mud-flaps': {
    id: 'f2000002-0002-4002-8002-000000000002',
    slug: 'prius-mud-flaps',
    destinationUrl: 'https://www.amazon.ca/s?k=2023+2024+2025+2026+Prius+Mud+Flaps+Splash+Guards&tag=danrubin03-20',
    title: 'Molded Splash Guards & Mud Flap Kit (Front & Rear)',
    category: 'exterior_armor',
    clickCount: 0,
    isActive: true,
  },
  'prius-bumper-protector': {
    id: 'f2000003-0003-4003-8003-000000000003',
    slug: 'prius-bumper-protector',
    destinationUrl: 'https://www.amazon.ca/s?k=Gen+5+Prius+Rear+Bumper+Protector+Sill&tag=danrubin03-20',
    title: 'Textured Rear Bumper Sill Protector Guard',
    category: 'exterior_protection',
    clickCount: 0,
    isActive: true,
  },
  'prius-all-weather-liners': {
    id: 'f2000004-0004-4004-8004-000000000004',
    slug: 'prius-all-weather-liners',
    destinationUrl: 'https://www.amazon.ca/s?k=2023-2026+Toyota+Prius+Floor+Mats+Cargo+Liner&tag=danrubin03-20',
    title: 'Custom-Fit All-Weather 3D TPE Floor Liners & Trunk Mat',
    category: 'interior_protection',
    clickCount: 0,
    isActive: true,
  },
  'prius-console-organizer': {
    id: 'f2000005-0005-4005-8005-000000000005',
    slug: 'prius-console-organizer',
    destinationUrl: 'https://www.amazon.ca/s?k=Gen+5+Prius+Center+Console+Organizer+Tray&tag=danrubin03-20',
    title: 'Center Console 2-Tier Organizer Tray & Lower Cubby Insert',
    category: 'cabin_storage',
    clickCount: 0,
    isActive: true,
  },
  'prius-screen-protector': {
    id: 'f2000006-0006-4006-8006-000000000006',
    slug: 'prius-screen-protector',
    destinationUrl: 'https://www.amazon.ca/s?k=2023+2026+Prius+Screen+Protector+12.3&tag=danrubin03-20',
    title: 'Matte Anti-Glare Tempered Glass Screen Protector (8" / 12.3")',
    category: 'cabin_tech',
    clickCount: 0,
    isActive: true,
  },
  'prius-prime-portable-charger': {
    id: 'f2000007-0007-4007-8007-000000000007',
    slug: 'prius-prime-portable-charger',
    destinationUrl: 'https://www.amazon.ca/s?k=Portable+Level+2+EV+Charger+16A+14-50+5-15&tag=danrubin03-20',
    title: 'Dual-Voltage Portable Level 1 / Level 2 EV Charger (Prius Prime)',
    category: 'phev_charging',
    clickCount: 0,
    isActive: true,
  },
};

function isLegacyPlaceholderUrl(url: string): boolean {
  return (
    url.includes('B08XYZ1234') ||
    url.includes('B08XJBL34T') ||
    url.includes('B07TOYSPKR') ||
    url.includes('B08TRIMKIT') ||
    url.includes('B09EKRLEAT') ||
    url.includes('B09ABC5678') ||
    url.includes('B0CK123456') ||
    url.includes('B0BYZ98765') ||
    url.includes('B07XYZ9999') ||
    url.includes('B09XYZG5G5') ||
    url.includes('404-page-not-found') ||
    url.includes('clazzio.com/toyota-rav4-prime')
  );
}

export async function getAffiliateRedirect(slug: string): Promise<string | null> {
  // If Supabase is connected in production
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('affiliate_links')
        .select('destination_url, click_count')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        // Increment count asynchronously without blocking
        supabase
          .from('affiliate_links')
          .update({ click_count: (data.click_count || 0) + 1 })
          .eq('slug', slug)
          .then();

        // If the database URL is an old placeholder/broken URL, transparently return active URL
        if (isLegacyPlaceholderUrl(data.destination_url)) {
          const fallback = FALLBACK_AFFILIATES[slug];
          return fallback ? fallback.destinationUrl : data.destination_url;
        }

        return data.destination_url;
      }
    } catch (err) {
      console.warn('Falling back to local affiliate registry:', err);
    }
  }

  // Fallback to static registry
  const record = FALLBACK_AFFILIATES[slug];
  if (record && record.isActive) {
    record.clickCount += 1;
    return record.destinationUrl;
  }

  return null;
}
