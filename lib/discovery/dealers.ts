/**
 * lib/discovery/dealers.ts
 *
 * Core Registered Dealer Definitions, Convertus Scraping Adapters,
 * and Sweep Execution Service for ToyotaWaits.ca.
 */

import * as crypto from 'crypto';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { parseConvertusPayload } from './adapters/convertus';
import { fetchGoAutoInventory, LANGLEY_CRAFT_SITE_ID } from './adapters/goauto';
import { ingestDealerListings } from './services/ingestion-service';
import {
  AlertDispatchVehicle,
  dispatchPendingAlerts,
  DispatchPendingAlertsSummary,
} from './services/lifecycle-service';
import { evaluateSweepStaleness } from './services/staleness-service';
import { NormalizedListingStatus } from './types';

export const USER_AGENT_AUDITOR =
  'Mozilla/5.0 (compatible; ToyotaWaitsLocalAuditor/1.0; +https://toyotawaits.ca/source-register)';
export const DEFAULT_TIMEOUT_MS = 12000;
export const MAX_RETRIES = 2;
export const INITIAL_BACKOFF_MS = 1000;
export const POLITE_DEALER_COOLDOWN_MS = Number(process.env.POLITE_DEALER_COOLDOWN_MS) || 4000;

export interface RegisteredDealerSource {
  dealerCode: string;
  aliases: string[];
  dealerName: string;
  sourceCode: string;
  platform: 'convertus' | string;
  baseUrl: string;
  endpointUrl: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  websiteUrl: string;
  lat?: number;
  lng?: number;
}

export const REGISTERED_DEALERS: RegisteredDealerSource[] = [
  {
    dealerCode: 'jptoyota-downtown',
    aliases: ['jp-toyota-downtown', 'jptoyota-downtown', 'jim-pattison-toyota-downtown'],
    dealerName: 'Jim Pattison Toyota Downtown',
    sourceCode: 'jp-toyota-downtown-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.jptoyota-downtown.com',
    endpointUrl:
      'https://www.jptoyota-downtown.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1250%26ln%3Den%26sc%3Dnew%26pc%3D100',
    address: '1290 Burrard Street',
    city: 'Vancouver',
    province: 'BC',
    postalCode: 'V6Z 1Z1',
    phone: '(604) 687-6044',
    websiteUrl: 'https://www.jptoyota-downtown.com/',
  },
  {
    dealerCode: 'jptoyota-surrey',
    aliases: ['jp-toyota-surrey', 'jptoyota-surrey', 'jim-pattison-toyota-surrey'],
    dealerName: 'Jim Pattison Toyota Surrey',
    sourceCode: 'jp-toyota-surrey-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.jptoyota-surrey.com',
    endpointUrl:
      'https://www.jptoyota-surrey.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1249%26ln%3Den%26sc%3Dnew%26pc%3D100',
    address: '15389 Guildford Drive',
    city: 'Surrey',
    province: 'BC',
    postalCode: 'V3R 0H9',
    phone: '(604) 495-4100',
    websiteUrl: 'https://www.jptoyota-surrey.com/',
  },
  {
    dealerCode: 'jptoyota-northshore',
    aliases: ['jptoyota-northshore', 'jp-toyota-northshore', 'jim pattison toyota northshore'],
    dealerName: 'Jim Pattison Toyota Northshore',
    sourceCode: 'jp-toyota-northshore-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.jptoyota-northshore.com',
    endpointUrl:
      'https://www.jptoyota-northshore.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1249%26ln%3Den%26sc%3Dnew%26pc%3D100',
    address: '849 Automall Drive',
    city: 'North Vancouver',
    province: 'BC',
    postalCode: 'V7P 3R8',
    phone: '(604) 985-0591',
    websiteUrl: 'https://www.jptoyota-northshore.com/',
  },
  {
    dealerCode: 'destination-toyota-burnaby',
    aliases: ['destination-toyota-burnaby', 'destination-toyota', 'destination toyota'],
    dealerName: 'Destination Toyota Burnaby',
    sourceCode: 'destination-toyota-burnaby-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.destinationtoyota.ca',
    endpointUrl:
      'https://www.destinationtoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1224%26ln%3Den%26pg%3D1%26pc%3D25%26dc%3Dfalse%26qs%3D%26im%3Dtrue%26in_transit%3Dtrue%26in_stock%3Dtrue%26on_order%3Dtrue%26mk%3Dtoyota&action=vms_data',
    address: '4451 Still Creek Drive',
    city: 'Burnaby',
    province: 'BC',
    postalCode: 'V5C 6G9',
    phone: '(604) 571-4399',
    websiteUrl: 'https://www.destinationtoyota.ca/',
  },
  {
    dealerCode: 'west-coast-toyota',
    aliases: ['west-coast-toyota', 'westcoast-toyota', 'west coast toyota'],
    dealerName: 'West Coast Toyota',
    sourceCode: 'west-coast-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.westcoasttoyota.com',
    endpointUrl:
      'https://www.westcoasttoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '19950 Lougheed Hwy',
    city: 'Pitt Meadows',
    province: 'BC',
    postalCode: 'V3Y 2U9',
    phone: '(604) 465-9146',
    websiteUrl: 'https://www.westcoasttoyota.com/',
  },
  {
    dealerCode: 'regency-toyota',
    aliases: ['regency-toyota', 'regency', 'regencytoyota'],
    dealerName: 'Regency Toyota',
    sourceCode: 'regency-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.regencytoyota.com',
    endpointUrl: 'https://www.regencytoyota.com/wp-json/convertus/v1/vehicles',
    address: '401 Kingsway',
    city: 'Vancouver',
    province: 'BC',
    postalCode: 'V5T 3K1',
    phone: '(604) 879-8411',
    websiteUrl: 'https://www.regencytoyota.com/',
  },
  {
    dealerCode: 'openroad-toyota-richmond',
    aliases: ['openroad-toyota-richmond', 'openroad-richmond', 'openroadtoyotarichmond'],
    dealerName: 'OpenRoad Toyota Richmond',
    sourceCode: 'openroad-toyota-richmond-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.openroadtoyotarichmond.com',
    endpointUrl: 'https://www.openroadtoyotarichmond.com/wp-json/convertus/v1/vehicles',
    address: '13251 Smallwood Place',
    city: 'Richmond',
    province: 'BC',
    postalCode: 'V6V 1W8',
    phone: '(604) 273-3766',
    websiteUrl: 'https://www.openroadtoyotarichmond.com/',
  },
  {
    dealerCode: 'openroad-toyota-port-moody',
    aliases: [
      'openroad-toyota-port-moody',
      'openroad port moody',
      'openroad toyota port moody',
      'openroad-port-moody',
      'openroadtoyotaportmoody',
      'port-moody',
    ],
    dealerName: 'OpenRoad Toyota Port Moody',
    sourceCode: 'openroad-toyota-port-moody-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.openroadtoyotaportmoody.com',
    // Convertus VMS proxy with sc=new&pc=100. sweepSingleDealer() uses this or gracefully falls
    // back to the public /sitemap.xml if the host proxy returns 404.
    endpointUrl:
      'https://www.openroadtoyotaportmoody.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '3266 St Johns St',
    city: 'Port Moody',
    province: 'BC',
    postalCode: 'V3H 2C9',
    phone: '(604) 461-2711',
    websiteUrl: 'https://www.openroadtoyotaportmoody.com/',
  },
  {
    dealerCode: 'granville-toyota',
    aliases: ['granville-toyota', 'granville toyota'],
    dealerName: 'Granville Toyota',
    sourceCode: 'granville-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.granvilletoyota.ca',
    endpointUrl:
      'https://www.granvilletoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '8224 Granville St',
    city: 'Vancouver',
    province: 'BC',
    postalCode: 'V6P 4Z4',
    phone: '(604) 263-2711',
    websiteUrl: 'https://www.granvilletoyota.ca/',
  },
  {
    dealerCode: 'valley-toyota',
    aliases: ['valley-toyota', 'valley toyota'],
    dealerName: 'Valley Toyota',
    sourceCode: 'valley-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.valleytoyota.ca',
    endpointUrl:
      'https://www.valleytoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '8750 Young Rd',
    city: 'Chilliwack',
    province: 'BC',
    postalCode: 'V2P 4P4',
    phone: '(604) 792-1167',
    websiteUrl: 'https://www.valleytoyota.ca/',
  },
  {
    dealerCode: 'abbotsford-toyota',
    aliases: ['abbotsford-toyota', 'abbotsford toyota'],
    dealerName: 'Abbotsford Toyota',
    sourceCode: 'abbotsford-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.abbotsfordtoyota.com',
    endpointUrl:
      'https://www.abbotsfordtoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '1215 Mt. Lehman Rd',
    city: 'Abbotsford',
    province: 'BC',
    postalCode: 'V2T 6H7',
    phone: '(604) 857-2658',
    websiteUrl: 'https://www.abbotsfordtoyota.com/',
  },
  {
    dealerCode: 'jptoyota-victoria',
    aliases: ['jptoyota-victoria', 'jp-toyota-victoria', 'jim pattison toyota victoria'],
    dealerName: 'Jim Pattison Toyota Victoria',
    sourceCode: 'jp-toyota-victoria-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.jptoyotavictoria.com',
    endpointUrl:
      'https://www.jptoyotavictoria.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1230%26ln%3Den%26sc%3Dnew%26pc%3D100',
    address: '3050 Douglas St',
    city: 'Victoria',
    province: 'BC',
    postalCode: 'V8T 4N4',
    phone: '(250) 386-3516',
    websiteUrl: 'https://www.jptoyotavictoria.com/',
  },
  {
    dealerCode: 'jptoyota-duncan',
    aliases: ['jptoyota-duncan', 'jp-toyota-duncan', 'jim pattison toyota duncan'],
    dealerName: 'Jim Pattison Toyota Duncan',
    sourceCode: 'jp-toyota-duncan-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.jptoyota-duncan.com',
    endpointUrl:
      'https://www.jptoyota-duncan.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1254%26sc%3Dnew%26pc%3D100',
    address: '6529 Trans-Canada Hwy',
    city: 'Duncan',
    province: 'BC',
    postalCode: 'V9L 6C2',
    phone: '(250) 746-5111',
    websiteUrl: 'https://www.jptoyota-duncan.com/',
  },
  {
    dealerCode: 'kelowna-toyota',
    aliases: ['kelowna-toyota', 'kelowna toyota'],
    dealerName: 'Kelowna Toyota',
    sourceCode: 'kelowna-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.kelownatoyota.com',
    endpointUrl:
      'https://www.kelownatoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1935%26sc%3Dnew%26pc%3D100',
    address: '1624 Cary Rd',
    city: 'Kelowna',
    province: 'BC',
    postalCode: 'V1X 2B9',
    phone: '(250) 491-2475',
    websiteUrl: 'https://www.kelownatoyota.com/',
  },
  {
    dealerCode: 'vernon-toyota',
    aliases: ['vernon-toyota', 'vernon toyota'],
    dealerName: 'Vernon Toyota',
    sourceCode: 'vernon-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.vernontoyota.com',
    endpointUrl:
      'https://www.vernontoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '3401 48 Ave',
    city: 'Vernon',
    province: 'BC',
    postalCode: 'V1T 9B9',
    phone: '(250) 545-0687',
    websiteUrl: 'https://www.vernontoyota.com/',
  },
  {
    dealerCode: 'westminster-toyota',
    aliases: ['westminster-toyota', 'westminster toyota'],
    dealerName: 'Westminster Toyota',
    sourceCode: 'westminster-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.westminstertoyota.com',
    endpointUrl:
      'https://www.westminstertoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '1050 Boyd St',
    city: 'New Westminster',
    province: 'BC',
    postalCode: 'V3M 6B9',
    phone: '(604) 520-3333',
    websiteUrl: 'https://www.westminstertoyota.com/',
  },
  {
    dealerCode: 'openroad-toyota-peace-arch',
    aliases: ['openroad-toyota-peace-arch', 'openroad peace arch', 'peace arch toyota'],
    dealerName: 'OpenRoad Toyota Peace Arch',
    sourceCode: 'openroad-toyota-peace-arch-convertus',
    platform: 'convertus',
    baseUrl: 'https://openroadtoyotapeacearch.com',
    endpointUrl:
      'https://openroadtoyotapeacearch.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '3174 King George Boulevard',
    city: 'Surrey',
    province: 'BC',
    postalCode: 'V4P 1A2',
    phone: '(604) 531-2916',
    websiteUrl: 'https://openroadtoyotapeacearch.com/',
  },
  {
    dealerCode: 'langley-toyota',
    aliases: ['langley-toyota', 'langley toyota'],
    dealerName: 'Langley Toyota',
    sourceCode: 'langley-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.langleytoyota.com',
    endpointUrl:
      'https://www.langleytoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '20622 Langley Bypass',
    city: 'Langley',
    province: 'BC',
    postalCode: 'V3A 5E7',
    phone: '(604) 530-3156',
    websiteUrl: 'https://www.langleytoyota.com/',
  },
  {
    dealerCode: 'nanaimo-toyota',
    aliases: ['nanaimo-toyota', 'nanaimo toyota'],
    dealerName: 'Nanaimo Toyota',
    sourceCode: 'nanaimo-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.nanaimotoyota.com',
    endpointUrl:
      'https://www.nanaimotoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '2487 Bowen Road',
    city: 'Nanaimo',
    province: 'BC',
    postalCode: 'V9T 3L2',
    phone: '(250) 758-9103',
    websiteUrl: 'https://www.nanaimotoyota.com/',
  },
  {
    dealerCode: 'ken-shaw-toyota',
    aliases: ['ken-shaw-toyota', 'kenshaw-toyota', 'ken shaw toyota', 'kenshawtoyota'],
    dealerName: 'Ken Shaw Toyota',
    sourceCode: 'ken-shaw-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.kenshawtoyota.ca',
    endpointUrl:
      'https://www.kenshawtoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '2336 St Clair Ave W',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M6N 1K8',
    phone: '(416) 766-1155',
    websiteUrl: 'https://www.kenshawtoyota.ca/',
  },
  {
    dealerCode: 'attrell-toyota',
    aliases: ['attrell-toyota', 'attrell toyota', 'attrelltoyota'],
    dealerName: 'Attrell Toyota',
    sourceCode: 'attrell-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.attrelltoyota.com',
    endpointUrl:
      'https://www.attrelltoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '110 Canam Crescent',
    city: 'Brampton',
    province: 'ON',
    postalCode: 'L7A 1A9',
    phone: '(905) 451-7235',
    websiteUrl: 'https://www.attrelltoyota.com/',
  },
  {
    dealerCode: 'georgetown-toyota',
    aliases: ['georgetown-toyota', 'georgetown toyota', 'georgetowntoyota'],
    dealerName: 'Georgetown Toyota',
    sourceCode: 'georgetown-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.georgetowntoyota.com',
    endpointUrl:
      'https://www.georgetowntoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '312 Guelph St',
    city: 'Georgetown',
    province: 'ON',
    postalCode: 'L7G 4B5',
    phone: '(905) 877-2296',
    websiteUrl: 'https://www.georgetowntoyota.com/',
  },
  {
    dealerCode: 'erin-park-toyota',
    aliases: ['erin-park-toyota', 'erinpark-toyota', 'erin park toyota', 'erinparktoyota'],
    dealerName: 'Erin Park Toyota',
    sourceCode: 'erin-park-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.erinparktoyota.com',
    endpointUrl:
      'https://www.erinparktoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '2411 Motorway Blvd',
    city: 'Mississauga',
    province: 'ON',
    postalCode: 'L5L 3R2',
    phone: '(905) 828-7711',
    websiteUrl: 'https://www.erinparktoyota.com/',
  },
  {
    dealerCode: 'mississauga-toyota',
    aliases: ['mississauga-toyota', 'mississauga toyota', 'mississaugatoyota'],
    dealerName: 'Mississauga Toyota',
    sourceCode: 'mississauga-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.mississaugatoyota.com',
    endpointUrl:
      'https://www.mississaugatoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D4092%26ln%3Den%26sc%3Dnew%26pc%3D100',
    address: '2215 Dundas Street East',
    city: 'Mississauga',
    province: 'ON',
    postalCode: 'L4X 2X2',
    phone: '(905) 625-3420',
    websiteUrl: 'https://www.mississaugatoyota.com/',
  },
  {
    dealerCode: 'simcoe-toyota',
    aliases: ['simcoe-toyota', 'simcoe toyota', 'simcoetoyota'],
    dealerName: 'Simcoe Toyota',
    sourceCode: 'simcoe-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.simcoetoyota.ca',
    endpointUrl:
      'https://www.simcoetoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1559%26ln%3Den%26sc%3Dnew%26pc%3D100',
    address: '150 Queensway E',
    city: 'Simcoe',
    province: 'ON',
    postalCode: 'N3Y 4K4',
    phone: '(888) 856-8221',
    websiteUrl: 'https://www.simcoetoyota.ca/',
  },
  {
    dealerCode: 'downtown-toyota',
    aliases: ['downtown-toyota', 'downtown toyota', 'downtowntoyota'],
    dealerName: 'Downtown Toyota',
    sourceCode: 'downtown-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.downtowntoyota.ca',
    endpointUrl:
      'https://www.downtowntoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '677 Queen St E',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M4M 1G6',
    phone: '(416) 465-5471',
    websiteUrl: 'https://www.downtowntoyota.ca/',
    lat: 43.6589,
    lng: -79.3507,
  },
  {
    dealerCode: 'don-valley-north-toyota',
    aliases: [
      'don-valley-north-toyota',
      'don valley north toyota',
      'dvn-toyota',
      'dvntoyota',
      'donvalleynorthtoyota',
    ],
    dealerName: 'Don Valley North Toyota',
    sourceCode: 'don-valley-north-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.donvalleynorthtoyota.com',
    endpointUrl:
      'https://www.donvalleynorthtoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '3300 Steeles Ave E',
    city: 'Markham',
    province: 'ON',
    postalCode: 'L3R 1G9',
    phone: '(905) 475-0722',
    websiteUrl: 'https://www.donvalleynorthtoyota.com/',
    lat: 43.8161,
    lng: -79.3422,
  },
  {
    dealerCode: 'thornhill-toyota',
    aliases: ['thornhill-toyota', 'thornhill toyota', 'thornhilltoyota'],
    dealerName: 'Thornhill Toyota',
    sourceCode: 'thornhill-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.thornhilltoyota.com',
    endpointUrl:
      'https://www.thornhilltoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '7800 Yonge St',
    city: 'Vaughan',
    province: 'ON',
    postalCode: 'L4J 1W3',
    phone: '(905) 889-2660',
    websiteUrl: 'https://www.thornhilltoyota.com/',
    lat: 43.8172,
    lng: -79.4241,
  },
  {
    dealerCode: 'richmond-hill-toyota',
    aliases: ['richmond-hill-toyota', 'richmond hill toyota', 'richmondhilltoyota'],
    dealerName: 'Richmond Hill Toyota',
    sourceCode: 'richmond-hill-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.richmondhilltoyota.com',
    endpointUrl:
      'https://www.richmondhilltoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '11240 Yonge St',
    city: 'Richmond Hill',
    province: 'ON',
    postalCode: 'L4S 1K9',
    phone: '(905) 884-9907',
    websiteUrl: 'https://www.richmondhilltoyota.com/',
    lat: 43.9038,
    lng: -79.4426,
  },
  {
    dealerCode: 'oakville-toyota',
    aliases: ['oakville-toyota', 'oakville toyota', 'oakvilletoyota'],
    dealerName: 'Oakville Toyota',
    sourceCode: 'oakville-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.oakvilletoyota.ca',
    endpointUrl:
      'https://www.oakvilletoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '2375 Wyecroft Rd',
    city: 'Oakville',
    province: 'ON',
    postalCode: 'L6L 6L4',
    phone: '(905) 827-2228',
    websiteUrl: 'https://www.oakvilletoyota.ca/',
  },
  {
    dealerCode: 'upper-james-toyota',
    aliases: ['upper-james-toyota', 'upper james toyota', 'upperjamestoyota'],
    dealerName: 'Upper James Toyota',
    sourceCode: 'upper-james-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.upperjamestoyota.ca',
    endpointUrl:
      'https://www.upperjamestoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '999 Upper James St',
    city: 'Hamilton',
    province: 'ON',
    postalCode: 'L9C 3A6',
    phone: '(905) 387-9287',
    websiteUrl: 'https://www.upperjamestoyota.ca/',
  },
  {
    dealerCode: 'pickering-toyota',
    aliases: ['pickering-toyota', 'pickering toyota', 'pickeringtoyota'],
    dealerName: 'Pickering Toyota',
    sourceCode: 'pickering-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.pickeringtoyota.com',
    endpointUrl:
      'https://www.pickeringtoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '557 Kingston Rd',
    city: 'Pickering',
    province: 'ON',
    postalCode: 'L1V 3N7',
    phone: '(905) 420-9000',
    websiteUrl: 'https://www.pickeringtoyota.com/',
  },
  {
    dealerCode: 'whitby-toyota',
    aliases: ['whitby-toyota', 'whitby toyota', 'whitbytoyota'],
    dealerName: 'Whitby Toyota',
    sourceCode: 'whitby-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.whitbytoyota.com',
    endpointUrl:
      'https://www.whitbytoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    address: '1025 Dundas St W',
    city: 'Whitby',
    province: 'ON',
    postalCode: 'L1P 1Z1',
    phone: '(905) 668-4792',
    websiteUrl: 'https://www.whitbytoyota.com/',
  },
  {
    dealerCode: 'openroad-lexus-richmond',
    aliases: ['openroad-lexus-richmond', 'openroad-lexus', 'openroad lexus richmond'],
    dealerName: 'OpenRoad Lexus Richmond',
    sourceCode: 'openroad-lexus-richmond-convertus',
    platform: 'convertus',
    baseUrl: 'https://openroadlexusrichmond.com',
    endpointUrl:
      'https://www.openroadlexusrichmond.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26ln%3Den%26pg%3D1%26pc%3D100%26im%3Dtrue%26in_transit%3Dtrue%26in_stock%3Dtrue%26on_order%3Dtrue%26mk%3Dlexus',
    address: '5631 Parkwood Way',
    city: 'Richmond',
    province: 'BC',
    postalCode: 'V6V 2L1',
    phone: '(604) 273-5533',
    websiteUrl: 'https://openroadlexusrichmond.com/',
  },
  {
    dealerCode: 'pattison-lexus-northshore',
    aliases: ['pattison-lexus-northshore', 'jp-lexus-northshore', 'jim pattison lexus northshore', 'jimpattisonlexus'],
    dealerName: 'Jim Pattison Lexus Northshore',
    sourceCode: 'pattison-lexus-northshore-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.jimpattisonlexus.com',
    endpointUrl:
      'https://www.jimpattisonlexus.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26ln%3Den%26pg%3D1%26pc%3D100%26im%3Dtrue%26in_transit%3Dtrue%26in_stock%3Dtrue%26on_order%3Dtrue%26mk%3Dlexus',
    address: '845 Automall Drive',
    city: 'North Vancouver',
    province: 'BC',
    postalCode: 'V7P 1M8',
    phone: '(604) 982-0033',
    websiteUrl: 'https://www.jimpattisonlexus.com/',
  },
  {
    dealerCode: 'lexus-downtown-toronto',
    aliases: ['lexus-downtown-toronto', 'lexus-downtown', 'lexus downtown toronto', 'lexusdowntown'],
    dealerName: 'Lexus Downtown',
    sourceCode: 'lexus-downtown-toronto-edealer',
    platform: 'edealer',
    baseUrl: 'https://www.lexusdowntown.ca',
    endpointUrl: 'https://www.lexusdowntown.ca/inventory-listing-sitemap.xml',
    address: '77 Overlea Blvd',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5A 1H7',
    phone: '(416) 465-3987',
    websiteUrl: 'https://www.lexusdowntown.ca/',
  },
];

export interface DealerSweepExecutionResult {
  dealerCode: string;
  dealerName: string;
  dealerId?: string;
  success: boolean;
  totalParsed: number;
  quarantinedCount: number;
  listingsCreated: number;
  listingsUpdated: number;
  observationsStored: number;
  durationMs: number;
  errorMessage?: string;
  skippedReason?: string;
  unreservedVehicles?: AlertDispatchVehicle[];
  alertSummary?: DispatchPendingAlertsSummary;
}

export type DealerSweepResult = DealerSweepExecutionResult;

/**
 * Builds a parameterized Convertus VMS proxy URL with explicit page limit and page index.
 */
export function buildConvertusPageUrl(rawUrl: string, page: number = 1, limit: number = 100): string {
  try {
    const urlObj = new URL(rawUrl);
    const endpointParam = urlObj.searchParams.get('endpoint');
    if (endpointParam) {
      const innerUrl = new URL(endpointParam);
      innerUrl.searchParams.set('pc', String(limit));
      innerUrl.searchParams.set('pg', String(page));
      urlObj.searchParams.set('endpoint', innerUrl.toString());
      return urlObj.toString();
    }
  } catch {
    // URL parsing fallback
  }

  let modified = rawUrl;
  if (!modified.includes('pc%3D') && !modified.includes('pc=')) {
    modified += (modified.includes('?') ? '&' : '?') + 'pc=' + limit;
  }
  if (!modified.includes('pg%3D') && !modified.includes('pg=')) {
    modified += '&pg=' + page;
  }
  return modified;
}

const TOYOTA_MODEL_PREFIXES: Array<[string, string, number, string]> = [
  ['grand-highlander-hybrid', 'Grand Highlander Hybrid', 58150, 'Hybrid'],
  ['grand-highlander', 'Grand Highlander', 54150, 'Gas'],
  ['highlander-hybrid', 'Highlander Hybrid', 53950, 'Hybrid'],
  ['highlander', 'Highlander', 50450, 'Gas'],
  ['rav4-plug-in-hybrid', 'RAV4 Plug-in Hybrid', 54590, 'Plug-in Hybrid'],
  ['rav4-prime', 'RAV4 Plug-in Hybrid', 54590, 'Plug-in Hybrid'],
  ['rav4-hybrid', 'RAV4 Hybrid', 39950, 'Hybrid'],
  ['rav4', 'RAV4', 36550, 'Gas'],
  ['prius-plug-in-hybrid', 'Prius Plug-in Hybrid', 43150, 'Plug-in Hybrid'],
  ['prius-prime', 'Prius Plug-in Hybrid', 43150, 'Plug-in Hybrid'],
  ['prius', 'Prius', 40650, 'Hybrid'],
  ['corolla-cross-hybrid', 'Corolla Cross Hybrid', 34990, 'Hybrid'],
  ['corolla-cross', 'Corolla Cross', 30590, 'Gas'],
  ['corolla-hatchback', 'Corolla Hatchback', 27850, 'Gas'],
  ['corolla-hybrid', 'Corolla Hybrid', 29590, 'Hybrid'],
  ['gr-corolla', 'GR Corolla', 49990, 'Gas'],
  ['corolla', 'Corolla', 26790, 'Gas'],
  ['camry-hybrid', 'Camry Hybrid', 37690, 'Hybrid'],
  ['camry', 'Camry Hybrid', 37690, 'Hybrid'],
  ['4runner-hybrid', '4Runner Hybrid', 63950, 'Hybrid'],
  ['4runner', '4Runner', 57450, 'Gas'],
  ['tacoma-hybrid', 'Tacoma Hybrid', 64950, 'Hybrid'],
  ['tacoma', 'Tacoma', 50450, 'Gas'],
  ['tundra-hybrid', 'Tundra Hybrid', 72950, 'Hybrid'],
  ['tundra', 'Tundra', 56450, 'Gas'],
  ['sienna', 'Sienna', 50490, 'Hybrid'],
  ['crown-signia', 'Crown Signia', 57450, 'Hybrid'],
  ['crown', 'Crown', 55590, 'Hybrid'],
  ['land-cruiser', 'Land Cruiser', 72950, 'Hybrid'],
  ['sequoia', 'Sequoia', 82950, 'Hybrid'],
  ['bz4x', 'bZ4X', 48950, 'Electric'],
  ['bz-woodland', 'bZ4X', 52950, 'Electric'],
  ['bz', 'bZ4X', 48950, 'Electric'],
  ['c-hr', 'C-HR', 38950, 'Hybrid'],
  ['gr86', 'GR86', 34950, 'Gas'],
  ['gr-supra', 'GR Supra', 69950, 'Gas'],
  ['gx-550', 'Lexus GX 550', 86500, 'Gas'],
  ['gx550', 'Lexus GX 550', 86500, 'Gas'],
  ['tx-550h', 'Lexus TX', 87500, 'Plug-in Hybrid'],
  ['tx-500h', 'Lexus TX', 84500, 'Hybrid'],
  ['tx-350', 'Lexus TX', 69000, 'Gas'],
  ['tx', 'Lexus TX', 69000, 'Gas'],
  ['rx-500h', 'Lexus RX', 83500, 'Hybrid'],
  ['rx-450h', 'Lexus RX', 87500, 'Plug-in Hybrid'],
  ['rx-350h', 'Lexus RX', 64500, 'Hybrid'],
  ['rx-350', 'Lexus RX', 61500, 'Gas'],
  ['rx', 'Lexus RX', 61500, 'Gas'],
  ['nx-450h', 'Lexus NX', 62500, 'Plug-in Hybrid'],
  ['nx-350h', 'Lexus NX', 54500, 'Hybrid'],
  ['nx-350', 'Lexus NX', 51500, 'Gas'],
  ['nx-250', 'Lexus NX', 49500, 'Gas'],
  ['nx', 'Lexus NX', 51500, 'Gas'],
];

function formatTrimTokens(rawTrimSlug: string): string {
  if (!rawTrimSlug) return 'Base';
  const upperTokens = new Set(['se', 'xse', 'le', 'xle', 'sr', 'sr5', 'trd', 'awd', 'fwd', '4x4', 'max', 'ev']);
  return rawTrimSlug
    .split('-')
    .filter(Boolean)
    .map((tok) => {
      const lower = tok.toLowerCase();
      if (lower === 'ltd') return 'Limited';
      if (upperTokens.has(lower)) return lower.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export function parseToyotaSlugSpec(slug: string): {
  year: number;
  make?: string;
  model: string;
  trim: string;
  msrp: number;
  fuelType: string;
} | null {
  const m = slug.toLowerCase().match(/^(202\d)-(toyota|lexus)-(.+)$/);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  const make = m[2] === 'lexus' ? 'Lexus' : 'Toyota';
  let rest = m[3];

  for (const [prefix, canonicalModel, baseMsrp, fuelType] of TOYOTA_MODEL_PREFIXES) {
    if (rest === prefix || rest.startsWith(prefix + '-')) {
      rest = rest.slice(prefix.length).replace(/^-+/, '');
      if (rest === prefix || rest.startsWith(prefix + '-')) {
        rest = rest.slice(prefix.length).replace(/^-+/, '');
      }
      let finalModel = canonicalModel;
      let finalFuel = fuelType;
      let finalMsrp = baseMsrp;
      if (rest.startsWith('hybrid-') && !finalModel.includes('Hybrid')) {
        finalModel = `${finalModel} Hybrid`;
        finalFuel = 'Hybrid';
        finalMsrp += 3500;
        rest = rest.slice('hybrid-'.length);
      }
      const trim = formatTrimTokens(rest);
      return { year, make, model: finalModel, trim, msrp: finalMsrp, fuelType: finalFuel };
    }
  }
  return null;
}

export function parsePublicSitemapToConvertusItems(xmlText: string): Array<Record<string, unknown>> {
  const items: Array<Record<string, unknown>> = [];
  const urlBlocks = [...xmlText.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((m) => m[1]);

  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/i)?.[1]?.trim();
    if (!loc) continue;
    const imgLoc = block.match(/<image:loc>([^<]+)<\/image:loc>/i)?.[1]?.trim() || null;

    const openRoadMatch = loc.match(/\/new\/([^/]+)\/([A-HJ-NPR-Z0-9]{17})\/?$/i);
    if (openRoadMatch) {
      const slug = openRoadMatch[1];
      const vin = openRoadMatch[2].toUpperCase();
      const spec = parseToyotaSlugSpec(slug);
      if (spec) {
        items.push({
          ad_id: `OR-${vin}`,
          vehicle_id: `OR-${vin}`,
          vin,
          stock_number: `OR-${vin.slice(-6)}`,
          year: spec.year,
          make: spec.make || (slug.includes('lexus') ? 'Lexus' : 'Toyota'),
          model: spec.model,
          trim: spec.trim,
          fuel_type: spec.fuelType,
          sale_class: 'New',
          in_transit: 0,
          on_order: 0,
          msrp: spec.msrp,
          asking_price: spec.msrp,
          final_price: spec.msrp,
          vdp_url: loc,
          image: imgLoc,
        });
      }
      continue;
    }

    // Vernon pattern: /inventory/New-2027-Toyota-.../12345
    const vernonMatch = loc.match(/\/inventory\/([A-Za-z]+)-((?:202\d)-Toyota-[A-Za-z0-9-]+)\/(\d+)\/?$/i);
    if (vernonMatch) {
      const saleClass = vernonMatch[1];
      const rawSlug = vernonMatch[2].toLowerCase();
      const id = vernonMatch[3];
      const spec = parseToyotaSlugSpec(rawSlug);
      if (spec) {
        items.push({
          ad_id: `VT-${id}`,
          vehicle_id: `VT-${id}`,
          vin: null,
          stock_number: `VT-${id}`,
          year: spec.year,
          make: 'Toyota',
          model: spec.model,
          trim: spec.trim,
          fuel_type: spec.fuelType,
          sale_class: saleClass.toLowerCase() === 'new' ? 'New' : 'Used',
          in_transit: 0,
          on_order: 0,
          msrp: spec.msrp,
          asking_price: spec.msrp,
          final_price: spec.msrp,
          vdp_url: loc,
          image: imgLoc,
        });
      }
      continue;
    }

    const edealerMatch = loc.match(/\/inventory\/((?:202\d)-(?:toyota|lexus)-[a-z0-9-]+)-([A-Za-z0-9_-]+)vdp\/?$/i);
    if (edealerMatch) {
      const slug = edealerMatch[1];
      const vdpId = edealerMatch[2];
      const spec = parseToyotaSlugSpec(slug);
      if (spec && spec.year >= 2025) {
        let prefix = 'ED';
        if (loc.includes('kenshawtoyota')) prefix = 'KS';
        else if (loc.includes('attrelltoyota')) prefix = 'ATT';
        else if (loc.includes('downtowntoyota')) prefix = 'DT';
        else if (loc.includes('donvalleynorthtoyota') || loc.includes('dvntoyota')) prefix = 'DVN';
        else if (loc.includes('thornhilltoyota')) prefix = 'TH';
        else if (loc.includes('lexusdowntown')) prefix = 'LDT';
        items.push({
          ad_id: `${prefix}-${vdpId}`,
          vehicle_id: `${prefix}-${vdpId}`,
          vin: null,
          stock_number: `${prefix}-${vdpId.slice(-6).toUpperCase()}`,
          year: spec.year,
          make: spec.make || (slug.includes('lexus') ? 'Lexus' : 'Toyota'),
          model: spec.model,
          trim: spec.trim,
          fuel_type: spec.fuelType,
          sale_class: 'New',
          in_transit: 0,
          on_order: 0,
          msrp: spec.msrp,
          asking_price: spec.msrp,
          final_price: spec.msrp,
          vdp_url: loc,
          image: imgLoc,
        });
      }
      continue;
    }

    const convertusVehicleMatch = loc.match(/\/vehicles\/((?:202\d))\/(lexus|toyota)\/([^/]+)\/([^/]+)\/([^/]+)\/([a-z0-9_-]+)\/?/i);
    if (convertusVehicleMatch) {
      const year = parseInt(convertusVehicleMatch[1], 10);
      const rawMake = convertusVehicleMatch[2];
      const rawModel = convertusVehicleMatch[3];
      const id = convertusVehicleMatch[6];
      const make = rawMake.charAt(0).toUpperCase() + rawMake.slice(1).toLowerCase();
      const spec = parseToyotaSlugSpec(`${year}-${rawMake.toLowerCase()}-${rawModel.toLowerCase()}`);
      const model = spec ? spec.model : (make === 'Lexus' ? `Lexus ${rawModel.toUpperCase()}` : rawModel.toUpperCase());
      const prefix = loc.includes('jimpattisonlexus') ? 'JPL' : 'CV';
      items.push({
        ad_id: `${prefix}-${id}`,
        vehicle_id: `${prefix}-${id}`,
        vin: null,
        stock_number: `${prefix}-${id.slice(-6).toUpperCase()}`,
        year,
        make,
        model,
        trim: spec?.trim || 'Base',
        fuel_type: spec?.fuelType || 'Gas',
        sale_class: 'New',
        in_transit: 0,
        on_order: 0,
        msrp: spec?.msrp || 65000,
        asking_price: spec?.msrp || 65000,
        final_price: spec?.msrp || 65000,
        vdp_url: loc,
        image: imgLoc,
      });
      continue;
    }

    const regencyMatch = loc.match(/\/en\/new-catalog\/toyota\/([a-z0-9-]+)-id(\d+)\/?$/i);
    if (regencyMatch) {
      const slug = regencyMatch[1];
      const catalogId = regencyMatch[2];
      const spec = parseToyotaSlugSpec(slug);
      if (spec) {
        let prefix = 'REG';
        if (loc.includes('georgetowntoyota')) prefix = 'GT';
        else if (loc.includes('erinparktoyota')) prefix = 'EP';
        else if (loc.includes('oakvilletoyota')) prefix = 'OAK';
        else if (loc.includes('whitbytoyota')) prefix = 'WH';
        items.push({
          ad_id: `${prefix}-${catalogId}`,
          vehicle_id: `${prefix}-${catalogId}`,
          vin: null,
          stock_number: `${prefix}-${catalogId}`,
          year: spec.year,
          make: 'Toyota',
          model: spec.model,
          trim: spec.trim,
          fuel_type: spec.fuelType,
          sale_class: 'New',
          in_transit: 0,
          on_order: 0,
          msrp: spec.msrp,
          asking_price: spec.msrp,
          final_price: spec.msrp,
          vdp_url: loc,
          image: imgLoc,
        });
      }
      continue;
    }

    // Nanaimo / Upper James pattern: /new/inventory/2026-Toyota-4Runner-id14454878.html
    const nanaimoMatch = loc.match(/\/new\/inventory\/((?:202\d)-Toyota-[A-Za-z0-9-]+)-id(\d+)\.html/i);
    if (nanaimoMatch) {
      const rawSlug = nanaimoMatch[1].toLowerCase();
      const id = nanaimoMatch[2];
      const spec = parseToyotaSlugSpec(rawSlug);
      if (spec) {
        const prefix = loc.includes('upperjamestoyota') ? 'UJ' : 'NAN';
        items.push({
          ad_id: `${prefix}-${id}`,
          vehicle_id: `${prefix}-${id}`,
          vin: null,
          stock_number: `${prefix}-${id}`,
          year: spec.year,
          make: 'Toyota',
          model: spec.model,
          trim: spec.trim,
          fuel_type: spec.fuelType,
          sale_class: 'New',
          in_transit: 0,
          on_order: 0,
          msrp: spec.msrp,
          asking_price: spec.msrp,
          final_price: spec.msrp,
          vdp_url: loc,
          image: imgLoc,
        });
      }
      continue;
    }
  }

  return items;
}

export function resolveDealer(dealerArg: string): RegisteredDealerSource | null {
  const normalized = dealerArg.toLowerCase().trim();
  for (const dealer of REGISTERED_DEALERS) {
    if (dealer.dealerCode === normalized || dealer.aliases.includes(normalized)) {
      return dealer;
    }
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function seedReferenceEntities(supabase: any, dealerConfig: RegisteredDealerSource) {
  let sourceId: string;
  const { data: existingSource } = await supabase
    .from('sources')
    .select('id')
    .eq('code', dealerConfig.sourceCode)
    .maybeSingle();

  if (existingSource) {
    sourceId = existingSource.id;
  } else {
    const { data: newSource, error: sourceErr } = await supabase
      .from('sources')
      .insert({
        code: dealerConfig.sourceCode,
        name: `${dealerConfig.dealerName} Feed`,
        platform: dealerConfig.platform,
        base_url: dealerConfig.baseUrl,
        endpoint_url: dealerConfig.endpointUrl,
        is_active: true,
      })
      .select('id')
      .single();

    if (sourceErr) throw new Error(`Failed to seed source: ${sourceErr.message}`);
    sourceId = newSource.id;
  }

  let dealerId: string;
  const { data: existingDealer } = await supabase
    .from('dealers')
    .select('id')
    .eq('dealer_code', dealerConfig.dealerCode)
    .maybeSingle();

  if (existingDealer) {
    dealerId = existingDealer.id;
  } else {
    const { data: newDealer, error: dealerErr } = await supabase
      .from('dealers')
      .insert({
        dealer_code: dealerConfig.dealerCode,
        name: dealerConfig.dealerName,
        brand: 'Toyota',
        address: dealerConfig.address,
        city: dealerConfig.city,
        province: dealerConfig.province,
        country: 'CA',
        postal_code: dealerConfig.postalCode,
        phone: dealerConfig.phone,
        website_url: dealerConfig.websiteUrl,
        source_id: sourceId,
      })
      .select('id')
      .single();

    if (dealerErr) throw new Error(`Failed to seed dealer: ${dealerErr.message}`);
    dealerId = newDealer.id;
  }

  return { sourceId, dealerId };
}

export function fetchViaHttps(
  targetUrl: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
  maxRedirects: number = 3
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ body: any; status: number }> {
  return new Promise((resolve, reject) => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      reject(new Error('Request timeout in https fallback'));
    }, Math.min(timeoutMs, 12000));

    const makeRequest = (currentUrl: string, redirectsLeft: number) => {
      if (redirectsLeft < 0) {
        clearTimeout(timer);
        return reject(new Error('Too many redirects'));
      }
      const client = currentUrl.startsWith('https:') ? https : http;
      const req = client.get(
        currentUrl,
        {
          headers: {
            'User-Agent': USER_AGENT_AUDITOR,
            Accept: 'application/json, text/plain, */*',
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const nextUrl = new URL(res.headers.location, currentUrl).toString();
            return makeRequest(nextUrl, redirectsLeft - 1);
          }

          if (res.statusCode === 429) {
            clearTimeout(timer);
            return reject(new Error('HTTP 429: Too Many Requests (Rate limited)'));
          }
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
            clearTimeout(timer);
            return reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }

          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            clearTimeout(timer);
            try {
              const body = JSON.parse(data);
              resolve({ body, status: res.statusCode || 200 });
            } catch (err) {
              reject(err);
            }
          });
        }
      );

      req.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    };

    makeRequest(targetUrl, maxRedirects);
  });
}

async function fetchWithRetry(url: string, timeoutMs: number = DEFAULT_TIMEOUT_MS) {
  let attempt = 0;
  let lastError: unknown = null;
  let httpStatus: number | null = null;
  let currentUrl = url;
  const effectiveTimeout = Math.min(timeoutMs || 12000, 12000);

  while (attempt <= MAX_RETRIES) {
    attempt++;

    try {
      const res = await fetch(currentUrl, {
        headers: {
          'User-Agent': USER_AGENT_AUDITOR,
          Accept: 'application/json, text/plain, */*',
        },
        signal: AbortSignal.timeout(effectiveTimeout),
      });

      httpStatus = res.status;

      if (res.status === 429) {
        throw new Error('HTTP 429: Too Many Requests (Rate limited)');
      }

      if (!res.ok) {
        if (res.status === 403) {
          try {
            const fallback = await fetchViaHttps(currentUrl, effectiveTimeout);
            return { body: fallback.body, status: fallback.status, attempts: attempt };
          } catch {
            // fallback error ignored, continue to throw HTTP 403
          }
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const body = await res.json();
      return { body, status: res.status, attempts: attempt };
    } catch (err: unknown) {
      lastError = err;
      const isTransient =
        (err as { name?: string })?.name === 'AbortError' ||
        (err as { name?: string })?.name === 'TimeoutError' ||
        (err as { message?: string })?.message?.includes('timeout') ||
        (err as { message?: string })?.message?.includes('fetch failed') ||
        (httpStatus != null && httpStatus >= 500);

      if (attempt <= MAX_RETRIES && isTransient) {
        const errMsg = (err as { message?: string })?.message || '';
        if (
          errMsg.includes('ENOTFOUND') ||
          (err as { cause?: { code?: string } })?.cause?.code === 'ENOTFOUND'
        ) {
          if (currentUrl.includes('granvilletoyota.ca')) {
            currentUrl = currentUrl.replace('granvilletoyota.ca', 'granvilletoyota.com');
          } else if (currentUrl.includes('abbotsfordtoyota.com')) {
            currentUrl = currentUrl.replace('abbotsfordtoyota.com', 'openroadtoyotaabbotsford.com');
          }
        }
        const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        break;
      }
    }
  }

  const errMessage = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Fetch failed after ${attempt} attempts: ${errMessage}`);
}

export async function sweepSingleDealer(
  dealerConfig: RegisteredDealerSource,
  options: {
    dryRun: boolean;
    useFixture?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase?: any;
    isServiceKeyConfigured: boolean;
  }
): Promise<DealerSweepResult> {
  const { dryRun, useFixture = false, supabase, isServiceKeyConfigured } = options;
  const startTime = Date.now();
  const sweepTimestamp = new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawPayload: any;

  try {
    if (useFixture) {
      const fixturePath = path.resolve(
        process.cwd(),
        'audit-artifacts',
        'dealer-discovery',
        'convertus-vms-sample.json'
      );
      rawPayload = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
    } else if (dealerConfig.dealerCode === 'langley-toyota') {
      const goAutoData = await fetchGoAutoInventory(LANGLEY_CRAFT_SITE_ID, { page: 1, limit: 100 });
      rawPayload = {
        summary: { total_vehicles: goAutoData.total },
        results: goAutoData.items,
      };
      if (goAutoData.total > 100) {
        let currentPage = 2;
        const maxPages = Math.ceil(goAutoData.total / 100);
        while (rawPayload.results.length < goAutoData.total && currentPage <= maxPages) {
          await new Promise((r) => setTimeout(r, 1500));
          const nextBatch = await fetchGoAutoInventory(LANGLEY_CRAFT_SITE_ID, { page: currentPage, limit: 100 });
          if (!nextBatch.items.length) break;
          rawPayload.results.push(...nextBatch.items);
          currentPage++;
        }
      }
    } else {
      const initialUrl = buildConvertusPageUrl(dealerConfig.endpointUrl, 1, 100);
      let cachedSitemapItems: Array<Record<string, unknown>> | null = null;

      const fetchSitemapFallback = async (baseUrl: string): Promise<Array<Record<string, unknown>>> => {
        if (baseUrl.includes('richmondhilltoyota.com')) {
          const seenIds = new Set<string>();
          const rhItems: Array<Record<string, unknown>> = [];
          for (let page = 1; page <= 3; page++) {
            try {
              const rhRes = await fetch(`https://www.richmondhilltoyota.com/inventory/new?page=${page}`, {
                headers: { 'User-Agent': USER_AGENT_AUDITOR },
                signal: AbortSignal.timeout(12000),
              });
              if (!rhRes.ok) break;
              const html = await rhRes.text();
              const blocks = [
                ...html.matchAll(/<div class="hidden-item-prop"[\s\S]*?<input type="hidden" id="vehicle-makes"/gi),
              ].map((m) => m[0]);
              for (const block of blocks) {
                const vdpUrl = block.match(/<link itemprop="url" href="([^"]+)"/i)?.[1]?.trim();
                const vehicleId = block.match(/id="vehicle_id" value="(\d+)"/i)?.[1]?.trim();
                if (!vdpUrl || !vehicleId || seenIds.has(vehicleId)) continue;
                seenIds.add(vehicleId);
                const yearStr = block.match(/id="vehicle_year" value="(\d{4})"/i)?.[1] || '2026';
                const rawModel = block.match(/id="vehicle_model" value="([^"]+)"/i)?.[1] || 'RAV4';
                const priceStr = block.match(/id="vehicle_price" value="(\d+)"/i)?.[1] || '0';
                const vin =
                  block.match(/<span itemprop="vehicleIdentificationNumber">([A-HJ-NPR-Z0-9]{17})<\/span>/i)?.[1] ||
                  null;
                const sku =
                  block.match(/<span itemprop="sku">([^<]+)<\/span>/i)?.[1]?.trim() || `RH-${vehicleId}`;
                const color = block.match(/id="vehicle_ext_color" value="([^"]*)"/i)?.[1]?.trim() || null;
                const fuel = block.match(/id="vehicle_fuel_type" value="([^"]*)"/i)?.[1]?.trim() || 'Gas';
                const year = parseInt(yearStr, 10);
                const slugAttempt = `${year}-toyota-${rawModel.toLowerCase().replace(/\s+/g, '-')}`;
                const spec = parseToyotaSlugSpec(slugAttempt);
                const model = spec ? spec.model : rawModel;
                const parsedPrice = parseInt(priceStr, 10);
                const finalPrice = parsedPrice > 10000 ? parsedPrice : spec ? spec.msrp : 42000;
                rhItems.push({
                  ad_id: `RH-${vehicleId}`,
                  vehicle_id: `RH-${vehicleId}`,
                  vin,
                  stock_number: sku,
                  year,
                  make: 'Toyota',
                  model,
                  trim: spec?.trim || 'Base',
                  exterior_color: color,
                  fuel_type: fuel.toLowerCase().includes('hybrid') ? 'Hybrid' : spec?.fuelType || 'Gas',
                  sale_class: 'New',
                  in_transit: 0,
                  on_order: 0,
                  msrp: finalPrice,
                  asking_price: finalPrice,
                  final_price: finalPrice,
                  vdp_url: vdpUrl,
                });
              }
            } catch {
              break;
            }
          }
          return rhItems;
        }

        if (baseUrl.includes('pickeringtoyota.com')) {
          try {
            const pkRes = await fetch('https://www.pickeringtoyota.com/toyota-new-inventory', {
              headers: { 'User-Agent': USER_AGENT_AUDITOR },
              signal: AbortSignal.timeout(12000),
            });
            if (!pkRes.ok) return [];
            const html = await pkRes.text();
            const cardMatches = [
              ...html.matchAll(
                /<img src="([^"]+)" class="pt-menu-card-img-top"[\s\S]*?<p class="pt-menu-card-title">\s*(202\d)\s+([^<]+)<\/p>\s*<p class="pt-menu-card-price[^>]*>From <strong>\$([0-9,.]+)<\/strong><\/p>[\s\S]*?href="(toyota-[^"]+)"/gi
              ),
            ];
            const seen = new Set<string>();
            const pkItems: Array<Record<string, unknown>> = [];
            for (const m of cardMatches) {
              const imgRel = m[1].trim();
              const year = parseInt(m[2], 10);
              const rawModelTitle = m[3].trim();
              const priceNum = Math.round(parseFloat(m[4].replace(/,/g, '')));
              const hrefRel = m[5].trim();
              const key = `${year}-${hrefRel}`;
              if (seen.has(key)) continue;
              seen.add(key);

              const modelSlug = hrefRel.replace(/^toyota-/, '').replace(/-for-sale-\d{4}$/, '');
              const spec = parseToyotaSlugSpec(`${year}-toyota-${modelSlug}`);
              const model = spec ? spec.model : rawModelTitle;
              const idSlug = `${year}-${modelSlug}`.toUpperCase();
              pkItems.push({
                ad_id: `PK-${idSlug}`,
                vehicle_id: `PK-${idSlug}`,
                vin: null,
                stock_number: `PK-${idSlug.slice(0, 12)}`,
                year,
                make: 'Toyota',
                model,
                trim: spec?.trim || 'Base',
                fuel_type: spec?.fuelType || 'Gas',
                sale_class: 'New',
                in_transit: 0,
                on_order: 0,
                msrp: priceNum || spec?.msrp || 40000,
                asking_price: priceNum || spec?.msrp || 40000,
                final_price: priceNum || spec?.msrp || 40000,
                vdp_url: `https://www.pickeringtoyota.com/${hrefRel}`,
                image: `https://www.pickeringtoyota.com/${imgRel.replace(/^\/+/, '')}`,
              });
            }
            return pkItems;
          } catch {
            return [];
          }
        }

        let sitemapUrl = `${baseUrl.replace(/\/+$/, '')}/sitemap.xml`;
        if (sitemapUrl.includes('granvilletoyota.ca')) {
          sitemapUrl = sitemapUrl.replace('granvilletoyota.ca', 'granvilletoyota.com');
        } else if (sitemapUrl.includes('abbotsfordtoyota.com')) {
          sitemapUrl = 'https://openroadtoyotaabbotsford.com/sitemap.xml';
        } else if (sitemapUrl.includes('westminstertoyota.com')) {
          sitemapUrl = 'https://www.westminstertoyota.com/inventory-listing-sitemap.xml';
        } else if (sitemapUrl.includes('kenshawtoyota.com') || sitemapUrl.includes('kenshawtoyota.ca')) {
          sitemapUrl = 'https://www.kenshawtoyota.ca/inventory-listing-sitemap.xml';
        } else if (sitemapUrl.includes('attrelltoyota.com')) {
          sitemapUrl = 'https://www.attrelltoyota.com/inventory-listing-sitemap.xml';
        } else if (sitemapUrl.includes('downtowntoyota.ca')) {
          sitemapUrl = 'https://www.downtowntoyota.ca/inventory-listing-sitemap.xml';
        } else if (sitemapUrl.includes('donvalleynorthtoyota.com') || sitemapUrl.includes('dvntoyota.com')) {
          sitemapUrl = 'https://www.donvalleynorthtoyota.com/inventory-listing-sitemap.xml';
        } else if (sitemapUrl.includes('thornhilltoyota.com')) {
          sitemapUrl = 'https://www.thornhilltoyota.com/inventory-listing-sitemap.xml';
        } else if (sitemapUrl.includes('georgetowntoyota.com')) {
          sitemapUrl = 'https://www.georgetowntoyota.com/en/sitemap-xml';
        } else if (sitemapUrl.includes('erinparktoyota.com')) {
          sitemapUrl = 'https://www.erinparktoyota.com/en/sitemap-xml';
        } else if (sitemapUrl.includes('oakvilletoyota.ca')) {
          sitemapUrl = 'https://www.oakvilletoyota.ca/en/sitemap-xml';
        } else if (sitemapUrl.includes('whitbytoyota.com')) {
          sitemapUrl = 'https://www.whitbytoyota.com/en/sitemap-xml';
        } else if (sitemapUrl.includes('vernontoyota.com')) {
          sitemapUrl = 'https://www.vernontoyota.com/sitemap-vehicles.xml';
        } else if (sitemapUrl.includes('nanaimotoyota.com')) {
          sitemapUrl = 'https://www.nanaimotoyota.com/en/sitemap_newinventory.xml';
        } else if (sitemapUrl.includes('upperjamestoyota.ca')) {
          sitemapUrl = 'https://www.upperjamestoyota.ca/en/sitemap_newinventory.xml';
        } else if (sitemapUrl.includes('lexusdowntown.ca')) {
          sitemapUrl = 'https://www.lexusdowntown.ca/inventory-listing-sitemap.xml';
        } else if (sitemapUrl.includes('jimpattisonlexus.com')) {
          sitemapUrl = 'https://www.jimpattisonlexus.com/new-vehicle-1-sitemap.xml';
        } else if (sitemapUrl.includes('openroadlexusrichmond.com')) {
          sitemapUrl = 'https://openroadlexusrichmond.com/sitemap.xml';
        }
        try {
          const res = await fetch(sitemapUrl, {
            headers: {
              'User-Agent': USER_AGENT_AUDITOR,
              Accept: 'application/xml, text/xml, */*',
            },
            signal: AbortSignal.timeout(12000),
          });
          if (!res.ok) return [];
          let xmlText = await res.text();
          const subMatch = xmlText.match(/<loc>([^<]*(?:inventory-listing-sitemap|sitemap-vehicles|sitemap_newinventory|new-vehicle)[^<]*\.xml)<\/loc>/i);
          if (subMatch) {
            try {
              const subRes = await fetch(subMatch[1], {
                headers: {
                  'User-Agent': USER_AGENT_AUDITOR,
                  Accept: 'application/xml, text/xml, */*',
                },
                signal: AbortSignal.timeout(12000),
              });
              if (subRes.ok) {
                xmlText = await subRes.text();
              }
            } catch {
              }
          }
          const parsedItems = parsePublicSitemapToConvertusItems(xmlText);
          if (baseUrl.includes('nanaimotoyota.com') || baseUrl.includes('upperjamestoyota.ca')) {
            try {
              const searchUrl = baseUrl.includes('upperjamestoyota.ca')
                ? 'https://www.upperjamestoyota.ca/new/inventory/search.html'
                : 'https://www.nanaimotoyota.com/new/inventory/search.html';
              const searchRes = await fetch(searchUrl, {
                headers: { 'User-Agent': USER_AGENT_AUDITOR },
                signal: AbortSignal.timeout(12000),
              });
              if (searchRes.ok) {
                const searchHtml = await searchRes.text();
                const jsonLd = [...searchHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(m => m[1]);
                const vinMap = new Map<string, { vin?: string; image?: string; price?: number }>();
                for (const ld of jsonLd) {
                  if (ld.includes('vehicleIdentificationNumber')) {
                    try {
                      const parsed = JSON.parse(ld);
                      if (parsed.sku && parsed.vehicleIdentificationNumber) {
                        vinMap.set(String(parsed.sku), {
                          vin: parsed.vehicleIdentificationNumber,
                          image: Array.isArray(parsed.image) ? parsed.image[0] : parsed.image,
                          price: parsed.offers?.price,
                        });
                      }
                    } catch {}
                  }
                }
                for (const item of parsedItems) {
                  const rawId = String(item.ad_id || '').replace(/^(?:NAN|UJ)-/, '');
                  const extra = vinMap.get(rawId);
                  if (extra) {
                    if (extra.vin) item.vin = extra.vin;
                    if (extra.image) item.image = extra.image;
                    if (extra.price) {
                      item.msrp = extra.price;
                      item.asking_price = extra.price;
                      item.final_price = extra.price;
                    }
                  }
                }
              }
            } catch {
              // best-effort enrichment
            }
          }
          return parsedItems;
        } catch {
          return [];
        }
      };

      try {
        const fetchResult = await fetchWithRetry(initialUrl, DEFAULT_TIMEOUT_MS);
        rawPayload = fetchResult.body;
      } catch (primaryErr: unknown) {
        const pMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
        if (pMsg.includes('429')) {
          throw primaryErr;
        }
        const sitemapItems = await fetchSitemapFallback(dealerConfig.baseUrl);
        if (sitemapItems.length > 0) {
          cachedSitemapItems = sitemapItems;
          rawPayload = {
            summary: { total_vehicles: cachedSitemapItems.length },
            results: cachedSitemapItems.slice(0, 100),
          };
        } else {
          throw primaryErr;
        }
      }

      if (
        rawPayload &&
        (rawPayload.success === false ||
          (rawPayload.msg && String(rawPayload.msg).includes('Querystring')))
      ) {
        const sitemapItems = await fetchSitemapFallback(dealerConfig.baseUrl);
        if (sitemapItems.length > 0) {
          cachedSitemapItems = sitemapItems;
          rawPayload = {
            summary: { total_vehicles: cachedSitemapItems.length },
            results: cachedSitemapItems.slice(0, 100),
          };
        }
      }

      const totalVehicles = rawPayload?.summary?.total_vehicles;
      if (
        totalVehicles &&
        Array.isArray(rawPayload.results) &&
        rawPayload.results.length < totalVehicles
      ) {
        let currentPage = 2;
        const maxPages = 10;
        while (rawPayload.results.length < totalVehicles && currentPage <= maxPages) {
          await new Promise((r) => setTimeout(r, 1500));
          if (cachedSitemapItems) {
            const nextSlice = cachedSitemapItems.slice((currentPage - 1) * 100, currentPage * 100);
            if (nextSlice.length === 0) break;
            rawPayload.results.push(...nextSlice);
            currentPage++;
            continue;
          }
          const nextUrl = buildConvertusPageUrl(dealerConfig.endpointUrl, currentPage, 100);
          try {
            const nextResult = await fetchWithRetry(nextUrl, DEFAULT_TIMEOUT_MS);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nextItems = nextResult.body?.results as any[];
            if (Array.isArray(nextItems) && nextItems.length > 0) {
              const existingIds = new Set(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rawPayload.results.map((x: any) => x.ad_id || x.vehicle_id || x.vin || x.stock_number)
              );
              const newItems = nextItems.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (x: any) => !existingIds.has(x.ad_id || x.vehicle_id || x.vin || x.stock_number)
              );
              if (newItems.length === 0) break;
              rawPayload.results.push(...newItems);
            } else {
              break;
            }
          } catch {
            break;
          }
          currentPage++;
        }
      }
    }

    const parseResult = parseConvertusPayload(rawPayload, {
      dealerBaseUrl: dealerConfig.baseUrl,
      dealerCity: dealerConfig.city,
      dealerProvince: dealerConfig.province,
    });

    const unreservedVehicles: AlertDispatchVehicle[] = parseResult.records
      .filter((rec) => rec.listing.normalizedStatus !== NormalizedListingStatus.RESERVED_SOLD)
      .map((rec) => ({
        vin: rec.vehicle.vin,
        provisionalId: rec.vehicle.provisionalId || rec.listing.sourceListingId,
        model: rec.vehicle.model,
        trim: rec.vehicle.trim,
        powertrain: rec.vehicle.powertrain,
        drivetrain: rec.vehicle.driveTrain,
        status: rec.listing.normalizedStatus,
        stockNumber: rec.listing.stockNumber,
        modelYear: rec.vehicle.modelYear,
        dealerId: dealerConfig.dealerCode,
        dealerName: dealerConfig.dealerName,
        dealerCity: dealerConfig.city,
        vdpUrl: rec.listing.vdpUrl,
        sellingPrice: rec.pricing.sellingPrice ?? rec.pricing.askingPrice ?? rec.pricing.msrp,
        msrp: rec.pricing.msrp,
      }));

    if (!parseResult.success || parseResult.records.length === 0) {
      return {
        dealerCode: dealerConfig.dealerCode,
        dealerName: dealerConfig.dealerName,
        success: false,
        totalParsed: 0,
        quarantinedCount: parseResult.quarantined.length,
        listingsCreated: 0,
        listingsUpdated: 0,
        observationsStored: 0,
        durationMs: Date.now() - startTime,
        errorMessage: parseResult.error || 'Zero valid vehicles found in feed',
        unreservedVehicles: [],
      };
    }

    if (!isServiceKeyConfigured || dryRun) {
      return {
        dealerCode: dealerConfig.dealerCode,
        dealerName: dealerConfig.dealerName,
        success: true,
        totalParsed: parseResult.count,
        quarantinedCount: parseResult.quarantined.length,
        listingsCreated: 0,
        listingsUpdated: 0,
        observationsStored: 0,
        durationMs: Date.now() - startTime,
        skippedReason: !isServiceKeyConfigured
          ? 'SUPABASE_SERVICE_ROLE_KEY not configured'
          : 'Dry run requested',
        unreservedVehicles,
      };
    }

    const { sourceId, dealerId } = await seedReferenceEntities(supabase, dealerConfig);

    const ingestSummary = await ingestDealerListings({
      dealerId,
      sourceId,
      parsedListings: parseResult.records,
      sweepTimestamp,
      supabaseClient: supabase,
    });

    let alertSummary: DispatchPendingAlertsSummary | undefined;
    if (unreservedVehicles.length > 0) {
      alertSummary = await dispatchPendingAlerts(unreservedVehicles, {
        supabaseClient: supabase,
      });
    }

    const activeIds = parseResult.records.map((r) => r.listing.sourceListingId);
    await evaluateSweepStaleness({
      dealerId,
      activeSourceListingIdsInSweep: activeIds,
      sweepTimestamp,
      supabaseClient: supabase,
    });

    try {
      await supabase.from('source_health_logs').insert({
        id: crypto.randomUUID(),
        source_id: sourceId,
        dealer_id: dealerId,
        check_timestamp: sweepTimestamp,
        status: parseResult.quarantined.length > 0 ? 'degraded' : 'success',
        http_status: 200,
        latency_ms: Date.now() - startTime,
        items_observed: parseResult.count,
        quarantined_items: parseResult.quarantined.length,
        error_message: null,
        created_at: sweepTimestamp,
      });
    } catch {
      // Telemetry error does not abort sweep
    }

    return {
      dealerCode: dealerConfig.dealerCode,
      dealerName: dealerConfig.dealerName,
      dealerId,
      success: true,
      totalParsed: parseResult.count,
      quarantinedCount: parseResult.quarantined.length,
      listingsCreated: ingestSummary.listingsCreated,
      listingsUpdated: ingestSummary.listingsUpdated,
      observationsStored: ingestSummary.observationsStored,
      durationMs: Date.now() - startTime,
      unreservedVehicles,
      alertSummary,
    };
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : String(err);
    return {
      dealerCode: dealerConfig.dealerCode,
      dealerName: dealerConfig.dealerName,
      success: false,
      totalParsed: 0,
      quarantinedCount: 0,
      listingsCreated: 0,
      listingsUpdated: 0,
      observationsStored: 0,
      durationMs: Date.now() - startTime,
      errorMessage: errMessage,
      unreservedVehicles: [],
    };
  }
}
