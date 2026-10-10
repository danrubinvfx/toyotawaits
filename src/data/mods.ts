/**
 * Delivery Prep & Mod Items Configuration
 * Central data schema for community accessories and verified installation/comparison video embeds.
 */

export interface ModItem {
  id: string;
  slug: string;
  name?: string;
  title: string;
  models: string[];
  powertrains?: string[];
  category: 'visibility_protection' | 'cabin_organization' | 'roadside_winter';
  priceEst: string;
  priceEstCad?: string;
  whyBuy: string;
  utilityNote?: string;
  image: string;
  asin?: string;
  destinationUrl: string;
  youtubeVideoId?: string;
  videoTitle?: string;
}

export const MODS_CONFIG: ModItem[] = [
  {
    id: 'prod-fitcamx-rav4',
    slug: 'fitcamx-rav4',
    models: ['rav4'],
    category: 'visibility_protection',
    title: 'FitcamX OEM Integrated 4K Mirror Dashcam (RAV4)',
    name: 'FitcamX OEM Integrated 4K Mirror Dashcam',
    priceEst: '~$210 CAD',
    priceEstCad: '~$210 CAD',
    whyBuy: 'Replaces the TSS mirror shroud with zero dangling cables and no fuse box splicing.',
    utilityNote: 'Replaces the TSS mirror shroud with zero dangling cables and no fuse box splicing.',
    image: '/images/accessories/fitcamx-rav4.png',
    asin: 'B09GLVMB76',
    destinationUrl: 'https://www.amazon.ca/s?k=Fitcamx+Toyota+RAV4+dash+cam&tag=toyotawaits-20',
    youtubeVideoId: 'HrrClvzZpnI',
    videoTitle: 'Fitcamx Plug & Play Installation & Clarity',
  },
  {
    id: 'prod-noco-gb40',
    slug: 'noco-gb40-jump-pack',
    models: ['all'],
    category: 'roadside_winter',
    title: 'NOCO Boost Plus GB40 1000A 12V UltraSafe Lithium Jump Starter',
    name: 'NOCO Boost Plus GB40 1000A Jump Starter',
    priceEst: '~$135 CAD',
    priceEstCad: '~$135 CAD',
    whyBuy: 'Revives a dead 12V auxiliary battery in -30°C Canadian winters without needing another vehicle.',
    utilityNote: 'Revives a dead 12V auxiliary battery in -30°C Canadian winters without needing another vehicle.',
    image: '/images/accessories/noco-gb40-jump-pack.png',
    asin: 'B015TKUPIC',
    destinationUrl: 'https://www.amazon.ca/s?k=NOCO+Boost+Plus+GB40+1000A&tag=toyotawaits-20',
    youtubeVideoId: 'gNDH1z4Is48',
    videoTitle: 'GB40 vs GBX45 Comparison',
  },
  {
    id: 'prod-screen-rav4',
    slug: 'screen-protector-rav4',
    models: ['rav4'],
    category: 'visibility_protection',
    title: 'Anti-Glare 9H Tempered Glass Screen Protector (RAV4)',
    name: 'Anti-Glare Screen Protector',
    priceEst: '~$24 CAD',
    priceEstCad: '~$24 CAD',
    whyBuy: '9H hardness eliminates fingerprint smudges and prevents hairline scratches on the touchscreen.',
    utilityNote: '9H hardness eliminates fingerprint smudges and prevents hairline scratches on the touchscreen.',
    image: '/images/accessories/screen-protector-rav4.png',
    asin: 'B0892TYG6K',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+tempered+glass+screen+protector&tag=toyotawaits-20',
  },
  {
    id: 'prod-mats-rav4',
    slug: 'all-weather-mats-rav4',
    models: ['rav4'],
    category: 'cabin_organization',
    title: 'Laser-Measured All-Weather Floor Mats & Cargo Liner (RAV4)',
    name: 'Laser-Fit All-Weather Floor Liners',
    priceEst: '~$145 CAD',
    priceEstCad: '~$145 CAD',
    whyBuy: 'High-walled TPE protection against slush, winter salt, and muddy boots.',
    utilityNote: 'High-walled TPE protection against slush, winter salt, and muddy boots.',
    image: '/images/accessories/floor-mats-rav4.png',
    asin: 'B089K8P3Q2',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+all+weather+floor+mats+custom+fit&tag=toyotawaits-20',
  },
  {
    id: 'prod-tray-rav4',
    slug: 'console-tray-rav4',
    models: ['rav4'],
    category: 'cabin_organization',
    title: 'Drop-In Center Console Divider & Coin Tray (RAV4)',
    name: 'Center Console Organizer Tray',
    priceEst: '~$22 CAD',
    priceEstCad: '~$22 CAD',
    whyBuy: 'Splits cavernous armrest into accessible dual tiers with coin slots and cable passthroughs.',
    utilityNote: 'Splits cavernous armrest into accessible dual tiers with coin slots and cable passthroughs.',
    image: '/images/accessories/console-tray-rav4.png',
    asin: 'B07WCS2GCS',
    destinationUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+center+console+organizer+tray&tag=toyotawaits-20',
  },
  {
    id: 'prod-j1772-lock',
    slug: 'j1772-charger-lock',
    models: ['rav4'],
    powertrains: ['phev'],
    category: 'roadside_winter',
    title: 'J1772 Public EV Charging Port Combination Lock Ring',
    name: 'J1772 EV Charger Combination Lock',
    priceEst: '~$18 CAD',
    priceEstCad: '~$18 CAD',
    whyBuy: 'Prevents passersby or other EV drivers from unplugging your vehicle at public Level 2 stations.',
    utilityNote: 'Prevents passersby or other EV drivers from unplugging your vehicle at public Level 2 stations.',
    image: '/images/accessories/j1772-charger-lock.png',
    asin: 'B09V7NGLHM',
    destinationUrl: 'https://www.amazon.ca/s?k=J1772+charger+lock+ring+Toyota+RAV4+Prime&tag=toyotawaits-20',
  },
];
