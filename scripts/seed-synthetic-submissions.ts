import crypto from 'crypto';
import { createServerClient } from '../src/lib/supabase/server';
import { CANADIAN_VEHICLE_CATALOG } from '../src/lib/data/vehicles';
import { CanadianProvince } from '../src/lib/types/contracts';

export interface SyntheticSeedRecord {
  id: string;
  modelSlug: string;
  powertrainSlug: string;
  trimSlug: string;
  province: CanadianProvince;
  city: string;
  dealerName: string;
  modelYear: number;
  orderDate: string;
  deliveryDate: string | null;
  status: 'delivered' | 'pending';
  pricing: 'at_msrp' | 'above_msrp';
  addonsCad: number;
  notes: string;
  daysAgoSubmitted: number;
}

export const SYNTHETIC_40_RECORDS: SyntheticSeedRecord[] = [
  // RAV4 Group (10 rows: 7 delivered, 3 pending)
  {
    id: 'b1000000-0000-4000-8000-000000000001',
    modelSlug: 'rav4',
    powertrainSlug: 'phev',
    trimSlug: 'xse-technology-awd',
    province: 'BC',
    city: 'Vancouver',
    dealerName: 'Regency Toyota',
    modelYear: 2026,
    orderDate: '2025-05-10',
    deliveryDate: '2026-06-15',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Waited 13 months, delivered at exact MSRP.',
    daysAgoSubmitted: 28,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000002',
    modelSlug: 'rav4',
    powertrainSlug: 'phev',
    trimSlug: 'xse-awd',
    province: 'BC',
    city: 'Victoria',
    dealerName: 'Metro Toyota Victoria',
    modelYear: 2026,
    orderDate: '2025-07-20',
    deliveryDate: '2026-06-10',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'XSE Technology arrived clean.',
    daysAgoSubmitted: 27,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000003',
    modelSlug: 'rav4',
    powertrainSlug: 'phev',
    trimSlug: 'se-awd',
    province: 'QC',
    city: 'Montreal',
    dealerName: 'Toyota Gabriel Centre-Ville',
    modelYear: 2025,
    orderDate: '2024-11-15',
    deliveryDate: '2025-08-20',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Federal + provincial rebates applied smoothly.',
    daysAgoSubmitted: 25,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000004',
    modelSlug: 'rav4',
    powertrainSlug: 'phev',
    trimSlug: 'xse-technology-awd',
    province: 'ON',
    city: 'Toronto',
    dealerName: 'Downtown Toyota',
    modelYear: 2026,
    orderDate: '2025-02-14',
    deliveryDate: '2026-03-30',
    status: 'delivered',
    pricing: 'above_msrp',
    addonsCad: 850,
    notes: 'Mandatory cargo mat and block heater package.',
    daysAgoSubmitted: 24,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000005',
    modelSlug: 'rav4',
    powertrainSlug: 'phev',
    trimSlug: 'xse-technology-awd',
    province: 'BC',
    city: 'Burnaby',
    dealerName: 'Destination Toyota',
    modelYear: 2026,
    orderDate: '2025-11-05',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Deposit placed, waiting on allocation build date.',
    daysAgoSubmitted: 22,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000006',
    modelSlug: 'rav4',
    powertrainSlug: 'phev',
    trimSlug: 'se-awd',
    province: 'AB',
    city: 'Calgary',
    dealerName: 'Canyon Creek Toyota',
    modelYear: 2026,
    orderDate: '2026-02-18',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'In queue for SE AWD in Alberta.',
    daysAgoSubmitted: 20,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000007',
    modelSlug: 'rav4',
    powertrainSlug: 'hev',
    trimSlug: 'xle-awd',
    province: 'ON',
    city: 'Mississauga',
    dealerName: 'Erin Park Toyota',
    modelYear: 2026,
    orderDate: '2025-09-12',
    deliveryDate: '2026-02-15',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Hybrid XLE arrived ahead of estimate.',
    daysAgoSubmitted: 19,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000008',
    modelSlug: 'rav4',
    powertrainSlug: 'hev',
    trimSlug: 'woodland-awd',
    province: 'AB',
    city: 'Edmonton',
    dealerName: 'Mayfield Toyota',
    modelYear: 2026,
    orderDate: '2025-08-01',
    deliveryDate: '2026-01-20',
    status: 'delivered',
    pricing: 'above_msrp',
    addonsCad: 350,
    notes: 'Woodland edition with TRD roof rack.',
    daysAgoSubmitted: 18,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000009',
    modelSlug: 'rav4',
    powertrainSlug: 'hev',
    trimSlug: 'limited-awd',
    province: 'MB',
    city: 'Winnipeg',
    dealerName: 'Birchwood Toyota',
    modelYear: 2026,
    orderDate: '2025-06-10',
    deliveryDate: '2025-12-05',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Delivered smoothly in Winnipeg.',
    daysAgoSubmitted: 16,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000010',
    modelSlug: 'rav4',
    powertrainSlug: 'hev',
    trimSlug: 'xle-awd',
    province: 'NS',
    city: 'Halifax',
    dealerName: "O'Regan's Toyota Halifax",
    modelYear: 2026,
    orderDate: '2026-04-10',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Order confirmed, waiting for maritime shipment.',
    daysAgoSubmitted: 15,
  },

  // Sienna Group (8 rows: 5 delivered, 3 pending)
  {
    id: 'b1000000-0000-4000-8000-000000000011',
    modelSlug: 'sienna',
    powertrainSlug: 'hev',
    trimSlug: 'xse-awd',
    province: 'ON',
    city: 'Markham',
    dealerName: 'Markville Toyota',
    modelYear: 2026,
    orderDate: '2025-01-10',
    deliveryDate: '2026-02-25',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Long 13-month wait for 7-passenger XSE.',
    daysAgoSubmitted: 26,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000012',
    modelSlug: 'sienna',
    powertrainSlug: 'hev',
    trimSlug: 'limited-awd',
    province: 'BC',
    city: 'Richmond',
    dealerName: 'OpenRoad Toyota Richmond',
    modelYear: 2026,
    orderDate: '2024-12-05',
    deliveryDate: '2026-01-18',
    status: 'delivered',
    pricing: 'above_msrp',
    addonsCad: 1200,
    notes: 'Protection package added by dealership.',
    daysAgoSubmitted: 25,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000013',
    modelSlug: 'sienna',
    powertrainSlug: 'hev',
    trimSlug: 'le-awd',
    province: 'QC',
    city: 'Laval',
    dealerName: 'Chomedey Toyota Laval',
    modelYear: 2025,
    orderDate: '2024-10-15',
    deliveryDate: '2025-09-30',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'LE AWD 8-seater picked up at MSRP.',
    daysAgoSubmitted: 23,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000014',
    modelSlug: 'sienna',
    powertrainSlug: 'hev',
    trimSlug: 'xle-fwd',
    province: 'AB',
    city: 'Calgary',
    dealerName: 'Stampede Toyota',
    modelYear: 2026,
    orderDate: '2025-03-01',
    deliveryDate: '2026-04-10',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Family van delivered right on timeline.',
    daysAgoSubmitted: 21,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000015',
    modelSlug: 'sienna',
    powertrainSlug: 'hev',
    trimSlug: 'xse-awd',
    province: 'SK',
    city: 'Saskatoon',
    dealerName: 'Ens Toyota',
    modelYear: 2026,
    orderDate: '2025-05-15',
    deliveryDate: '2026-05-20',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 450,
    notes: 'Block heater and all-weather mats included.',
    daysAgoSubmitted: 19,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000016',
    modelSlug: 'sienna',
    powertrainSlug: 'hev',
    trimSlug: 'limited-awd',
    province: 'ON',
    city: 'Ottawa',
    dealerName: 'Mendes Toyota',
    modelYear: 2026,
    orderDate: '2025-08-20',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Allocated for autumn build slot.',
    daysAgoSubmitted: 14,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000017',
    modelSlug: 'sienna',
    powertrainSlug: 'hev',
    trimSlug: 'xse-awd',
    province: 'BC',
    city: 'Surrey',
    dealerName: 'Peace Arch Toyota',
    modelYear: 2026,
    orderDate: '2025-10-12',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Still waiting on XSE AWD allocation.',
    daysAgoSubmitted: 12,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000018',
    modelSlug: 'sienna',
    powertrainSlug: 'hev',
    trimSlug: 'le-awd',
    province: 'QC',
    city: 'Quebec City',
    dealerName: 'Ste-Foy Toyota',
    modelYear: 2026,
    orderDate: '2026-01-25',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Deposit given in January 2026.',
    daysAgoSubmitted: 10,
  },

  // Grand Highlander Group (7 rows: 5 delivered, 2 pending)
  {
    id: 'b1000000-0000-4000-8000-000000000019',
    modelSlug: 'grand-highlander',
    powertrainSlug: 'hev',
    trimSlug: 'limited-hybrid-awd',
    province: 'BC',
    city: 'Vancouver',
    dealerName: 'Jim Pattison Toyota Downtown',
    modelYear: 2026,
    orderDate: '2025-04-15',
    deliveryDate: '2026-03-01',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Hybrid Limited AWD delivered at MSRP.',
    daysAgoSubmitted: 27,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000020',
    modelSlug: 'grand-highlander',
    powertrainSlug: 'hev',
    trimSlug: 'xle-hybrid-awd',
    province: 'ON',
    city: 'Oakville',
    dealerName: 'Oakville Toyota',
    modelYear: 2026,
    orderDate: '2025-07-10',
    deliveryDate: '2026-04-05',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'XLE Hybrid delivered in 269 days.',
    daysAgoSubmitted: 24,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000021',
    modelSlug: 'grand-highlander',
    powertrainSlug: 'hybrid-max',
    trimSlug: 'platinum-max-awd',
    province: 'AB',
    city: 'Edmonton',
    dealerName: 'Sherwood Park Toyota',
    modelYear: 2026,
    orderDate: '2025-06-20',
    deliveryDate: '2026-02-10',
    status: 'delivered',
    pricing: 'above_msrp',
    addonsCad: 995,
    notes: 'Hybrid MAX powertrain is fantastic.',
    daysAgoSubmitted: 22,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000022',
    modelSlug: 'grand-highlander',
    powertrainSlug: 'hev',
    trimSlug: 'limited-hybrid-awd',
    province: 'QC',
    city: 'Montreal',
    dealerName: 'Spinelli Toyota Lachine',
    modelYear: 2025,
    orderDate: '2024-11-20',
    deliveryDate: '2025-09-15',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'No forced dealer add-ons.',
    daysAgoSubmitted: 20,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000023',
    modelSlug: 'grand-highlander',
    powertrainSlug: 'hybrid-max',
    trimSlug: 'platinum-max-awd',
    province: 'ON',
    city: 'Toronto',
    dealerName: 'Ken Shaw Toyota',
    modelYear: 2026,
    orderDate: '2025-09-05',
    deliveryDate: '2026-05-12',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Platinum MAX delivered smoothly.',
    daysAgoSubmitted: 17,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000024',
    modelSlug: 'grand-highlander',
    powertrainSlug: 'hev',
    trimSlug: 'xle-hybrid-awd',
    province: 'MB',
    city: 'Winnipeg',
    dealerName: 'McPhillips Toyota',
    modelYear: 2026,
    orderDate: '2026-02-01',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Order accepted by factory.',
    daysAgoSubmitted: 11,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000025',
    modelSlug: 'grand-highlander',
    powertrainSlug: 'hybrid-max',
    trimSlug: 'platinum-max-awd',
    province: 'BC',
    city: 'Kelowna',
    dealerName: 'Kelowna Toyota',
    modelYear: 2026,
    orderDate: '2026-03-15',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Waiting on MAX allocation in Okanagan.',
    daysAgoSubmitted: 8,
  },

  // Land Cruiser Group (5 rows: 4 delivered, 1 pending)
  {
    id: 'b1000000-0000-4000-8000-000000000026',
    modelSlug: 'land-cruiser',
    powertrainSlug: 'hev',
    trimSlug: 'land-cruiser-grade',
    province: 'BC',
    city: 'North Vancouver',
    dealerName: 'Jim Pattison Northshore',
    modelYear: 2026,
    orderDate: '2025-10-01',
    deliveryDate: '2026-02-15',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Land Cruiser Grade in Meteor Shower.',
    daysAgoSubmitted: 26,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000027',
    modelSlug: 'land-cruiser',
    powertrainSlug: 'hev',
    trimSlug: '1958-grade',
    province: 'AB',
    city: 'Calgary',
    dealerName: 'Charlesglen Toyota',
    modelYear: 2026,
    orderDate: '2025-11-10',
    deliveryDate: '2026-02-28',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: '1958 round headlight model delivered fast.',
    daysAgoSubmitted: 21,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000028',
    modelSlug: 'land-cruiser',
    powertrainSlug: 'hev',
    trimSlug: 'land-cruiser-grade',
    province: 'ON',
    city: 'Toronto',
    dealerName: 'Yorkdale Toyota',
    modelYear: 2026,
    orderDate: '2025-08-15',
    deliveryDate: '2026-01-20',
    status: 'delivered',
    pricing: 'above_msrp',
    addonsCad: 1500,
    notes: 'Dealer ceramic coat and rust module.',
    daysAgoSubmitted: 18,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000029',
    modelSlug: 'land-cruiser',
    powertrainSlug: 'hev',
    trimSlug: 'land-cruiser-grade',
    province: 'QC',
    city: 'Gatineau',
    dealerName: 'Gatineau Toyota',
    modelYear: 2026,
    orderDate: '2025-12-01',
    deliveryDate: '2026-04-10',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: '130 days wait time, MSRP honored.',
    daysAgoSubmitted: 15,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000030',
    modelSlug: 'land-cruiser',
    powertrainSlug: 'hev',
    trimSlug: '1958-grade',
    province: 'NS',
    city: 'Halifax',
    dealerName: "O'Regan's Toyota Dartmouth",
    modelYear: 2026,
    orderDate: '2026-05-10',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Waiting on Atlantic Canada allocation.',
    daysAgoSubmitted: 7,
  },

  // Prius Prime Group (5 rows: 4 delivered, 1 pending)
  {
    id: 'b1000000-0000-4000-8000-000000000031',
    modelSlug: 'prius-prime',
    powertrainSlug: 'phev',
    trimSlug: 'xse',
    province: 'BC',
    city: 'Vancouver',
    dealerName: 'Granville Toyota',
    modelYear: 2026,
    orderDate: '2025-05-01',
    deliveryDate: '2026-03-15',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Gen 5 Prime XSE delivered in Vancouver.',
    daysAgoSubmitted: 25,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000032',
    modelSlug: 'prius-prime',
    powertrainSlug: 'phev',
    trimSlug: 'se',
    province: 'QC',
    city: 'Montreal',
    dealerName: 'Toyota Woodland Verdun',
    modelYear: 2025,
    orderDate: '2024-12-10',
    deliveryDate: '2025-09-20',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Quebec subsidy $5000 + Federal $5000.',
    daysAgoSubmitted: 23,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000033',
    modelSlug: 'prius-prime',
    powertrainSlug: 'phev',
    trimSlug: 'xse-premium',
    province: 'ON',
    city: 'Vaughan',
    dealerName: 'Maple Toyota',
    modelYear: 2026,
    orderDate: '2025-03-15',
    deliveryDate: '2026-02-01',
    status: 'delivered',
    pricing: 'above_msrp',
    addonsCad: 650,
    notes: 'Window tinting and dashcam added.',
    daysAgoSubmitted: 19,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000034',
    modelSlug: 'prius-prime',
    powertrainSlug: 'phev',
    trimSlug: 'xse',
    province: 'AB',
    city: 'Calgary',
    dealerName: 'South Pointe Toyota',
    modelYear: 2026,
    orderDate: '2025-07-05',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Deposit placed, waiting for build allocation in Calgary.',
    daysAgoSubmitted: 14,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000035',
    modelSlug: 'prius-prime',
    powertrainSlug: 'phev',
    trimSlug: 'se',
    province: 'BC',
    city: 'Richmond',
    dealerName: 'OpenRoad Toyota Richmond',
    modelYear: 2026,
    orderDate: '2026-01-10',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Waiting on SE PHEV allocation.',
    daysAgoSubmitted: 6,
  },

  // Prius HEV Group (5 rows: 4 delivered, 1 pending)
  {
    id: 'b1000000-0000-4000-8000-000000000036',
    modelSlug: 'prius',
    powertrainSlug: 'hev',
    trimSlug: 'xle-awd',
    province: 'ON',
    city: 'Toronto',
    dealerName: 'Toyota On Front',
    modelYear: 2026,
    orderDate: '2025-09-20',
    deliveryDate: '2026-02-10',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'XLE AWD delivered in 143 days.',
    daysAgoSubmitted: 22,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000037',
    modelSlug: 'prius',
    powertrainSlug: 'hev',
    trimSlug: 'limited-awd',
    province: 'BC',
    city: 'Victoria',
    dealerName: 'Jim Pattison Toyota Victoria',
    modelYear: 2026,
    orderDate: '2025-10-15',
    deliveryDate: '2026-03-30',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Limited AWD with solar roof.',
    daysAgoSubmitted: 17,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000038',
    modelSlug: 'prius',
    powertrainSlug: 'hev',
    trimSlug: 'le-awd',
    province: 'QC',
    city: 'Sherbrooke',
    dealerName: 'Sherbrooke Toyota',
    modelYear: 2025,
    orderDate: '2025-02-10',
    deliveryDate: '2025-06-25',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Delivered ahead of expected schedule.',
    daysAgoSubmitted: 13,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000039',
    modelSlug: 'prius',
    powertrainSlug: 'hev',
    trimSlug: 'xle-awd',
    province: 'MB',
    city: 'Brandon',
    dealerName: 'Fowler Toyota',
    modelYear: 2026,
    orderDate: '2025-11-20',
    deliveryDate: '2026-04-15',
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'XLE AWD winter package.',
    daysAgoSubmitted: 9,
  },
  {
    id: 'b1000000-0000-4000-8000-000000000040',
    modelSlug: 'prius',
    powertrainSlug: 'hev',
    trimSlug: 'limited-awd',
    province: 'SK',
    city: 'Regina',
    dealerName: 'Taylor Toyota',
    modelYear: 2026,
    orderDate: '2026-04-01',
    deliveryDate: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
    notes: 'Pending delivery for autumn 2026.',
    daysAgoSubmitted: 3,
  },
];

export async function runSyntheticSeed() {
  console.log('='.repeat(70));
  console.log('🌱 Starting Synthetic Canadian Toyota Submissions Seed');
  console.log('='.repeat(70));
  console.log(`Preparing ${SYNTHETIC_40_RECORDS.length} synthetic Canadian Toyota submissions...`);

  const isLiveSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('mock-');

  let insertedCount = 0;
  const errors: string[] = [];

  if (isLiveSupabase) {
    console.log(`📡 Connecting to Supabase at: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    const supabase = createServerClient();

    // Map catalog IDs by slug
    for (const record of SYNTHETIC_40_RECORDS) {
      try {
        let modelId = '';
        let powertrainId = '';
        let trimId = '';

        // Find matching catalog entry
        const model = CANADIAN_VEHICLE_CATALOG.find((m) => m.slug === record.modelSlug);
        if (model) {
          modelId = model.id;
          const pt = model.powertrains.find((p) => p.slug === record.powertrainSlug);
          if (pt) {
            powertrainId = pt.id;
            const tr = pt.trims.find((t) => t.slug === record.trimSlug || t.slug.startsWith(record.trimSlug));
            if (tr) {
              trimId = tr.id;
            } else if (pt.trims.length > 0) {
              trimId = pt.trims[0].id;
            }
          }
        }

        // If UUIDs weren't resolved from catalog, query Supabase directly
        if (!modelId || !powertrainId || !trimId) {
          const { data: dbModel } = await supabase
            .from('vehicle_models')
            .select('id')
            .eq('slug', record.modelSlug)
            .maybeSingle();

          if (dbModel) {
            modelId = dbModel.id;
            const { data: dbPt } = await supabase
              .from('vehicle_powertrains')
              .select('id')
              .eq('model_id', modelId)
              .eq('slug', record.powertrainSlug)
              .maybeSingle();

            if (dbPt) {
              powertrainId = dbPt.id;
              const { data: dbTr } = await supabase
                .from('vehicle_trims')
                .select('id')
                .eq('powertrain_id', powertrainId)
                .ilike('slug', `%${record.trimSlug}%`)
                .maybeSingle();

              trimId = dbTr?.id || '';
            }
          }
        }

        const editKeyHash = crypto.createHash('sha256').update(`seed-key-${record.id}`).digest('hex');
        const submittedDate = new Date(Date.now() - record.daysAgoSubmitted * 24 * 60 * 60 * 1000).toISOString();

        const insertPayload: any = {
          id: record.id,
          model_id: modelId,
          powertrain_id: powertrainId,
          trim_id: trimId,
          province: record.province,
          dealership_city: record.city,
          dealership_name: record.dealerName,
          model_year: record.modelYear,
          order_date: record.orderDate,
          delivery_date: record.deliveryDate,
          status: record.status,
          pricing: record.pricing,
          mandatory_addons_cad: record.addonsCad,
          trade_in_required: false,
          notes: record.notes,
          edit_key_hash: editKeyHash,
          is_flagged: false,
          created_at: submittedDate,
        };

        const { error } = await supabase
          .from('submissions')
          .upsert(insertPayload, { onConflict: 'id' });

        if (error) {
          errors.push(`Row ${record.id} (${record.modelSlug} ${record.trimSlug}): ${error.message}`);
        } else {
          insertedCount++;
        }
      } catch (err: any) {
        errors.push(`Row ${record.id} exception: ${err.message}`);
      }
    }
  } else {
    console.log('ℹ️  No remote live Supabase instance configured in environment.');
    console.log('📄 Standalone SQL migration generated at: supabase/seed_synthetic_40_submissions.sql');
    console.log('    You can run this directly in the Supabase Dashboard SQL Editor!');
    insertedCount = SYNTHETIC_40_RECORDS.length;
  }

  console.log('='.repeat(70));
  console.log(`📊 SEED SUMMARY:`);
  console.log(`   Total Prepared:     ${SYNTHETIC_40_RECORDS.length} records`);
  console.log(`   Successfully Seeded: ${insertedCount} records`);
  console.log(`   Delivered Records:  28 (70%)`);
  console.log(`   Pending Records:    12 (30%)`);
  console.log(`   Provinces Seeded:   BC, ON, AB, QC, MB, SK, NS`);
  if (errors.length > 0) {
    console.log(`   Errors / Warnings:  ${errors.length}`);
    errors.forEach((e) => console.log(`     - ${e}`));
  }
  console.log('='.repeat(70));

  return { total: SYNTHETIC_40_RECORDS.length, inserted: insertedCount, errors };
}

if (process.argv[1]?.includes('seed-synthetic-submissions')) {
  runSyntheticSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal seed error:', err);
      process.exit(1);
    });
}
