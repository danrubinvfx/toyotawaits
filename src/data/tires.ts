/**
 * Canadian Toyota Tire Guide & Review Specifications
 * OEM factory tire sizes, seasonal downsizing recommendations,
 * and curated 3PMSF winter / all-weather tire options for Canadian conditions.
 * Compliant with Amazon Associates Operating Agreement (no hardcoded static prices, statutory disclaimer).
 */

export type TireCategory = 'Dedicated Winter' | 'All-Weather 3PMSF';

export interface TireItem {
  id: string;
  name: string;
  brand: string;
  category: 'Dedicated Winter' | 'All-Weather 3PMSF';
  oemSize: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  amazonUrl: string;
  badge?: string;
  asin?: string;
  loadIndex?: string;
  speedRating?: string;
  // Extended UI attributes (strictly optional to prevent compiler errors)
  oemFitment?: string;
  rating?: number;
  searchQuery?: string;
}

export type TireRecommendation = TireItem;

export interface ModelTireConfig {
  modelId: string;
  modelName: string;
  label: string;
  badge: string;
  yearRange: string;
  boltPattern: string;
  centerBore: string;
  recommendedLoadIndex: string;
  factorySizes: string[];
  downsizingTip: string;
  tires: TireItem[];
}

export const TIRE_VEHICLE_OPTIONS: Array<{
  id: string;
  label: string;
  name: string;
  badge: string;
}> = [
  {
    id: 'rav4',
    label: 'RAV4 (Hybrid / Prime)',
    name: 'Toyota RAV4',
    badge: 'Popular HEV/PHEV',
  },
  {
    id: 'sienna',
    label: 'Sienna',
    name: 'Toyota Sienna',
    badge: 'AWD Minivan',
  },
  {
    id: 'grand-highlander',
    label: 'Grand Highlander',
    name: 'Toyota Grand Highlander',
    badge: '3-Row SUV',
  },
  {
    id: 'prius',
    label: 'Prius / Prime',
    name: 'Toyota Prius & Prime',
    badge: 'Gen 5 Hybrid',
  },
  {
    id: 'land-cruiser',
    label: 'Land Cruiser 250',
    name: 'Toyota Land Cruiser',
    badge: 'Heritage 4WD',
  },
];

export const TIRE_CATALOG_DATA: Record<string, ModelTireConfig> = {
  rav4: {
    modelId: 'rav4',
    modelName: 'Toyota RAV4 (Hybrid, Prime & Gas)',
    label: 'RAV4 (Hybrid / Prime)',
    badge: 'Canada #1 Selling SUV',
    yearRange: '2019–2026 (Gen 5)',
    boltPattern: '5x114.3',
    centerBore: '60.1 mm',
    recommendedLoadIndex: '102 (SL/XL)',
    factorySizes: [
      '225/65R17 (LE, XLE, Woodland)',
      '225/60R18 (XSE, Prime SE/XSE, Trail)',
      '235/55R19 (Limited)',
    ],
    downsizingTip:
      'Downsizing 18" or 19" factory wheels to 17" rims (225/65R17) for winter saves ~$250–$400 per package and provides taller sidewalls to cushion against winter frost heaves and potholes.',
    tires: [
      {
        id: 'rav4-michelin-xice',
        name: 'Michelin X-Ice Snow',
        brand: 'Michelin',
        category: 'Dedicated Winter',
        oemSize: '225/65R17',
        badge: 'Top Pick for Hybrids',
        loadIndex: '102',
        speedRating: 'T',
        oemFitment: 'Fits OEM 17" (225/65R17) & 18" (225/60R18)',
        rating: 4.9,
        bestFor:
          'Low rolling resistance preserves winter EV range; whisper-quiet hybrid cabin comfort with class-leading ice braking.',
        pros: [
          'FleX-Ice 2.0 silica compound stays pliable in -40°C Canadian deep freezes',
          'Low rolling resistance minimizes winter fuel penalty on RAV4 Hybrid & Prime EV mode',
          'V-shaped tread pattern provides confidence-inspiring tracking in frozen ruts',
          'Long tread life backed by Michelin 60,000 km winter manufacturer warranty',
        ],
        cons: [
          'Higher upfront investment per corner than secondary-tier winter brands',
          'Slightly softer dry highway steering response compared to performance summer tires',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Michelin+X-Ice+Snow+225+65R17&tag=toyotawaits-20',
        searchQuery: 'Michelin X-Ice Snow 225/65R17',
      },
      {
        id: 'rav4-bridgestone-blizzak',
        name: 'Bridgestone Blizzak WS90',
        brand: 'Bridgestone',
        category: 'Dedicated Winter',
        oemSize: '225/65R17',
        badge: 'Deep Snow & Slush Bite',
        loadIndex: '102',
        speedRating: 'T',
        oemFitment: 'Fits OEM 17" (225/65R17) & 18" (225/60R18)',
        rating: 4.8,
        bestFor:
          'Deep unplowed snow, heavy slush evacuation, and abrupt stops on wet black ice during severe prairie or mountain storms.',
        pros: [
          'Patented NanoPro-Tech Multicell compound absorbs micro-layer of water over smooth ice',
          'High-density 3D zig-zag block edges deliver aggressive mechanical bite when accelerating up snowed-in inclines',
          'Superb lateral grip when changing lanes across slush ridges at highway speeds',
        ],
        cons: [
          'Slightly higher rolling resistance than low-drag touring rubber due to deep bite siping',
          'Multicell compound wears rapidly if kept on above +7°C in late spring',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Bridgestone+Blizzak+WS90+225+65R17&tag=toyotawaits-20',
        searchQuery: 'Bridgestone Blizzak WS90 225/65R17',
      },
      {
        id: 'rav4-michelin-crossclimate2',
        name: 'Michelin CrossClimate 2',
        brand: 'Michelin',
        category: 'All-Weather 3PMSF',
        oemSize: '225/65R17',
        badge: 'Top Year-Round All-Weather',
        loadIndex: '102',
        speedRating: 'H',
        oemFitment: 'Fits OEM 17" (225/65R17), 18" (225/60R18), & 19" (235/55R19)',
        rating: 4.8,
        bestFor:
          'Severe snow certified (3PMSF) four-season driving with zero bi-annual tire swap hassle, garage line-ups, or storage fees.',
        pros: [
          'Legal for Quebec winter mandate (Dec 1–Mar 15) and BC mountain passes (Oct 1–Apr 30)',
          'Thermal Adaptive tread compound handles +35°C summer heat and -25°C snowstorms alike',
          'V-Formation directional tread clears standing water and slush to prevent hydroplaning',
          'Sharp, responsive dry braking and steering stability on Canadian highways',
        ],
        cons: [
          'Directional tread allows only front-to-back rotation (no cross rotation)',
          'Stopping distance on pure glazed black ice is longer than dedicated Nordic winter rubber compounds',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Michelin+CrossClimate+2+225+65R17&tag=toyotawaits-20',
        searchQuery: 'Michelin CrossClimate 2 225/65R17',
      },
      {
        id: 'rav4-hankook-kinergy-4s2',
        name: 'Hankook Kinergy 4S2 (H750)',
        brand: 'Hankook',
        category: 'All-Weather 3PMSF',
        oemSize: '225/65R17',
        badge: 'Best Value All-Weather',
        loadIndex: '102',
        speedRating: 'V',
        oemFitment: 'Fits OEM 17" (225/65R17) & 18" (225/60R18)',
        rating: 4.6,
        bestFor:
          'Budget-conscious Canadian drivers who want genuine 3PMSF severe snow safety without paying top-tier brand premiums.',
        pros: [
          'Three-Peak Mountain Snowflake certified at an accessible price point',
          'High-density sipes offer strong grip on slushy urban commutes and wet asphalt',
          'High grip silica tread compound stays flexible across wide Canadian temperature swings',
        ],
        cons: [
          'Tread life typically 15,000 km lower than CrossClimate 2 under high highway mileage',
          'Noticeable road hum on coarse asphalt surfaces',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Hankook+Kinergy+4S2+225+65R17&tag=toyotawaits-20',
        searchQuery: 'Hankook Kinergy 4S2 225/65R17',
      },
    ],
  },
  sienna: {
    modelId: 'sienna',
    modelName: 'Toyota Sienna Hybrid AWD',
    label: 'Sienna',
    badge: 'Heavyweight Family Minivan',
    yearRange: '2021–2026 (Gen 4)',
    boltPattern: '5x114.3',
    centerBore: '60.1 mm',
    recommendedLoadIndex: '108 (Reinforced XL)',
    factorySizes: [
      '235/65R17 (LE)',
      '235/60R18 (XLE, Limited)',
      '235/50R20 (Platinum, XSE)',
    ],
    downsizingTip:
      'The Sienna curb weight is 4,600+ lbs plus 7–8 passengers. Downsizing from 20" Platinum wheels to 17" (235/65R17) provides reinforced 108 load-index sidewalls, guarding against rim crack damage on winter potholes.',
    tires: [
      {
        id: 'sienna-nokian-hakka-r5',
        name: 'Nokian Hakkapeliitta R5 SUV',
        brand: 'Nokian',
        category: 'Dedicated Winter',
        oemSize: '235/65R17',
        badge: 'Nordic Arctic Master',
        loadIndex: '108',
        speedRating: 'R',
        oemFitment: 'Fits OEM 17" (235/65R17) & 18" (235/60R18)',
        rating: 4.9,
        bestFor:
          'Uncompromising northern winter security, packed ice, snowstorms, and heavy minivan stability in Ontario, Quebec, and the Prairies.',
        pros: [
          'Aramid Strong sidewall fibers protect the heavy Sienna from pothole pinch-flats',
          'Arctic Grip Crystals act like microscopic studs for supreme black ice stopping power',
          'Engineered for low rolling resistance to protect Sienna hybrid battery fuel economy',
        ],
        cons: [
          'Premium pricing and high demand creates spotty mid-winter retail inventory',
          'Softer tread block squirm at highway speeds when ambient temperature climbs over +10°C',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Nokian+Hakkapeliitta+R5+SUV+235+65R17&tag=toyotawaits-20',
        searchQuery: 'Nokian Hakkapeliitta R5 SUV 235/65R17',
      },
      {
        id: 'sienna-bridgestone-blizzak-dmv2',
        name: 'Bridgestone Blizzak DM-V2',
        brand: 'Bridgestone',
        category: 'Dedicated Winter',
        oemSize: '235/65R17',
        badge: 'Heavy Minivan & SUV Specialist',
        loadIndex: '108',
        speedRating: 'S',
        oemFitment: 'Fits OEM 17" (235/65R17) & 18" (235/60R18)',
        rating: 4.8,
        bestFor:
          'Controlling the heavy 4,600+ lb Sienna chassis on slushy multi-lane highways and unplowed suburban school runs.',
        pros: [
          'Reinforced SUV/Minivan casing handles high passenger and luggage payloads with ease',
          'Multicell compound actively clears surface moisture on hard-packed snow and ice',
          'Deep block depth bites into heavy slush banks when passing or turning at intersections',
        ],
        cons: [
          'Hybrid fuel economy drops ~0.3–0.5 L/100km due to aggressive winter block resistance',
          'Tread wears more quickly when driven on dry highways in late spring',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Bridgestone+Blizzak+DM-V2+235+65R17&tag=toyotawaits-20',
        searchQuery: 'Bridgestone Blizzak DM-V2 235/65R17',
      },
      {
        id: 'sienna-michelin-crossclimate2-suv',
        name: 'Michelin CrossClimate 2 SUV',
        brand: 'Michelin',
        category: 'All-Weather 3PMSF',
        oemSize: '235/65R17',
        badge: 'Year-Round Family Cruiser',
        loadIndex: '108',
        speedRating: 'V',
        oemFitment: 'Fits OEM 17" (235/65R17), 18" (235/60R18), & 20" (235/50R20)',
        rating: 4.8,
        bestFor:
          'Families who want severe-snow 3PMSF legal compliance without the twice-yearly ritual of loading four heavy wheels into the minivan.',
        pros: [
          'High load-index ratings matched to Sienna curb weight and full family payload',
          'Severe snow certified (3PMSF) for Quebec highways and BC Coquihalla regulations',
          'Class-leading wet braking and anti-hydroplaning resistance during heavy spring thaw',
          'Quiet acoustic profile keeps highway road noise out of the Sienna rear cabin',
        ],
        cons: [
          'Directional V-pattern precludes cross-diagonal tire rotation',
          'Higher replacement cost in 20-inch Platinum size (235/50R20)',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Michelin+CrossClimate+2+SUV+235+65R17&tag=toyotawaits-20',
        searchQuery: 'Michelin CrossClimate 2 SUV 235/65R17',
      },
    ],
  },
  'grand-highlander': {
    modelId: 'grand-highlander',
    modelName: 'Toyota Grand Highlander (Hybrid MAX & Turbo Gas)',
    label: 'Grand Highlander',
    badge: '3-Row Flagship SUV',
    yearRange: '2024–2026',
    boltPattern: '5x114.3',
    centerBore: '60.1 mm',
    recommendedLoadIndex: '111 (Reinforced XL)',
    factorySizes: [
      '255/65R18 (XLE)',
      '255/55R20 (Limited, Platinum, Hybrid MAX)',
    ],
    downsizingTip:
      'Downsizing 20" wheels (255/55R20) to 18" rims (255/65R18) cuts package costs by up to $500, offers wider tire availability across Canadian tire shops, and significantly reduces rim curb rash in winter snowbanks.',
    tires: [
      {
        id: 'gh-michelin-xice-suv',
        name: 'Michelin X-Ice Snow SUV',
        brand: 'Michelin',
        category: 'Dedicated Winter',
        oemSize: '255/65R18',
        badge: 'Premium 3-Row Winter King',
        loadIndex: '111',
        speedRating: 'T',
        oemFitment: 'Fits OEM 18" (255/65R18) & 20" (255/55R20)',
        rating: 4.9,
        bestFor:
          'Quiet, smooth winter highway cruising with Hybrid MAX or gas AWD stability and minimal range/fuel economy penalty.',
        pros: [
          'Reinforced SUV casing tuned for 4,500+ lb 3-row crossover weight and towing dynamics',
          'Maintains rubber flexibility down to -40°C in bitter Canadian winter cold spells',
          'Superior directional stability on rutted slush and packed highway snow lanes',
          'Excellent tire longevity backed by Michelin 60,000 km winter tread warranty',
        ],
        cons: [
          'Substantial cost per corner in factory 20-inch size (255/55R20)',
          'Directional tread pattern requires front-to-back rotation only',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Michelin+X-Ice+Snow+SUV+255+65R18&tag=toyotawaits-20',
        searchQuery: 'Michelin X-Ice Snow SUV 255/65R18',
      },
      {
        id: 'gh-bridgestone-blizzak-dmv2',
        name: 'Bridgestone Blizzak DM-V2',
        brand: 'Bridgestone',
        category: 'Dedicated Winter',
        oemSize: '255/65R18',
        badge: 'Heavy Snow & Slush Champ',
        loadIndex: '111',
        speedRating: 'S',
        oemFitment: 'Fits OEM 18" (255/65R18) & 20" (255/55R20)',
        rating: 4.8,
        bestFor:
          'Maximum traction in heavy cottage country snowfalls, unplowed rural driveways, and steep mountain grades.',
        pros: [
          'Extra bite in deep unplowed snow banks and slush ruts',
          'Confidence-inspiring downhill stopping power on slippery descents',
          'Substantial rim protector flange shields expensive Grand Highlander alloy wheels',
        ],
        cons: [
          'Road hum slightly audible in the hybrid cabin on bare dry highway pavement',
          'Tread wear accelerates on warm dry pavement if driven past early spring',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Bridgestone+Blizzak+DM-V2+255+65R18&tag=toyotawaits-20',
        searchQuery: 'Bridgestone Blizzak DM-V2 255/65R18',
      },
      {
        id: 'gh-goodyear-weatherready',
        name: 'Goodyear Assurance WeatherReady',
        brand: 'Goodyear',
        category: 'All-Weather 3PMSF',
        oemSize: '255/65R18',
        badge: 'Asymmetric 4-Season Performer',
        loadIndex: '111',
        speedRating: 'H',
        oemFitment: 'Fits OEM 18" (255/65R18) & 20" (255/55R20)',
        rating: 4.7,
        bestFor:
          'Canadian 3-row drivers seeking true all-weather 3PMSF severe snow traction with asymmetric tread cross-rotation flexibility.',
        pros: [
          'Soybean oil compound stays pliable in cold Canadian winters while maintaining summer heat resilience',
          'Evolving Traction Grooves open wider as the tire wears down to retain water and snow evacuation',
          'Asymmetric tread allows full cross-rotation for longer and more even tread life on heavy SUVs',
        ],
        cons: [
          'Slightly firmer ride over highway expansion joints than dedicated winter rubber',
          'Stopping distance on pure ice is longer than dedicated Nordic winter tires',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Goodyear+Assurance+WeatherReady+255+65R18&tag=toyotawaits-20',
        searchQuery: 'Goodyear Assurance WeatherReady 255/65R18',
      },
      {
        id: 'gh-michelin-crossclimate2-suv',
        name: 'Michelin CrossClimate 2 SUV',
        brand: 'Michelin',
        category: 'All-Weather 3PMSF',
        oemSize: '255/65R18',
        badge: 'Top Crossover All-Weather',
        loadIndex: '111',
        speedRating: 'H',
        oemFitment: 'Fits OEM 18" (255/65R18) & 20" (255/55R20)',
        rating: 4.8,
        bestFor:
          'Year-round peace of mind, severe snow certification, and wet slush dominance on family Grand Highlander road trips.',
        pros: [
          'Stops up to 16 feet shorter in snow than leading standard all-weather competitors',
          'Exceptional hydroplaning resistance when encountering standing slush and spring highway puddles',
          'Ultra-long tread life warranty (up to 95,000 km)',
        ],
        cons: [
          'Higher purchase price in 20-inch sizing (255/55R20)',
          'Directional tread limits rotation pattern to front-to-back',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Michelin+CrossClimate+2+SUV+255+65R18&tag=toyotawaits-20',
        searchQuery: 'Michelin CrossClimate 2 SUV 255/65R18',
      },
    ],
  },
  prius: {
    modelId: 'prius',
    modelName: 'Toyota Prius & Prius Prime (Gen 5)',
    label: 'Prius / Prime',
    badge: 'Aero Efficient EV/HEV',
    yearRange: '2023–2026 (Gen 5)',
    boltPattern: '5x114.3',
    centerBore: '60.1 mm',
    recommendedLoadIndex: '90 (Standard Load)',
    factorySizes: [
      '195/60R17 (LE, Prime SE)',
      '195/50R19 (XLE, Limited, Prime XSE)',
    ],
    downsizingTip:
      'Gen 5 Prius uses unique tall/narrow tires. Downsizing from 19" (195/50R19) to 17" wheels (195/60R17) for winter provides 20mm more sidewall cushion against potholes, preserves electric EV range, and saves ~$300 per set.',
    tires: [
      {
        id: 'prius-continental-viking7',
        name: 'Continental VikingContact 7',
        brand: 'Continental',
        category: 'Dedicated Winter',
        oemSize: '195/60R17',
        badge: 'Hybrid Efficiency & Grip',
        loadIndex: '90',
        speedRating: 'T',
        oemFitment: 'Fits OEM 17" (195/60R17) & 19" (195/50R19)',
        rating: 4.8,
        bestFor:
          'Preserving EV battery range while delivering phenomenal ice and hardpack snow control with whisper-quiet cabin acoustics.',
        pros: [
          'Nordic silica compound with canola oil maintains low rolling resistance in extreme cold',
          'Whisper-quiet low rolling noise complements EV electric drive mode',
          'Interlocking 3D sipes provide crisp steering response on freezing asphalt',
        ],
        cons: [
          'Narrow 195/50R19 factory size has limited regional inventory—requires early fall pre-ordering',
          'Slightly softer sidewall feel in enthusiastic summer-style cornering',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Continental+VikingContact+7+195+60R17&tag=toyotawaits-20',
        searchQuery: 'Continental VikingContact 7 195/60R17',
      },
      {
        id: 'prius-michelin-xice',
        name: 'Michelin X-Ice Snow',
        brand: 'Michelin',
        category: 'Dedicated Winter',
        oemSize: '195/60R17',
        badge: 'EV Range Optimizer',
        loadIndex: '90',
        speedRating: 'H',
        oemFitment: 'Fits OEM 17" (195/60R17) & 19" (195/50R19)',
        rating: 4.9,
        bestFor:
          'Maximum electric range retention, low rolling drag, and class-leading braking distance on icy city streets and highways.',
        pros: [
          'Lowest rolling resistance among premium Nordic winter tires—minimizes winter EV battery drop',
          'Superb lateral stability on slushy highway lane changes and exit ramps',
          'Proven 60,000 km winter treadwear warranty provides multi-season longevity',
        ],
        cons: [
          'Firm sidewall profile transmits sharp frost cracks on broken city roads',
          'Higher initial acquisition cost',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Michelin+X-Ice+Snow+195+60R17&tag=toyotawaits-20',
        searchQuery: 'Michelin X-Ice Snow 195/60R17',
      },
      {
        id: 'prius-pirelli-weatheractive',
        name: 'Pirelli Cinturato WeatherActive',
        brand: 'Pirelli',
        category: 'All-Weather 3PMSF',
        oemSize: '195/60R17',
        badge: 'Sporty All-Weather 3PMSF',
        loadIndex: '90',
        speedRating: 'H',
        oemFitment: 'Fits OEM 17" (195/60R17)',
        rating: 4.7,
        bestFor:
          'Prius drivers seeking sporty handling, low rolling resistance, and year-round 3PMSF severe snow certification.',
        pros: [
          'Three-Peak Mountain Snowflake certified severe snow rating eliminates bi-annual swap fees',
          'Directional trumpet-shaped lateral grooves resist slush planing and water channeling',
          'Advanced polymers engineered for low energy consumption and battery range retention',
        ],
        cons: [
          'Currently available primarily for 17" wheels (19" drivers must downsize)',
          'Braking distance on smooth glare ice is longer than dedicated Nordic winter rubber compounds',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Pirelli+Cinturato+WeatherActive+195+60R17&tag=toyotawaits-20',
        searchQuery: 'Pirelli Cinturato WeatherActive 195/60R17',
      },
    ],
  },
  'land-cruiser': {
    modelId: 'land-cruiser',
    modelName: 'Toyota Land Cruiser 250 (1958 & First Edition)',
    label: 'Land Cruiser 250',
    badge: 'Trail & Arctic Heavy Duty',
    yearRange: '2024–2026 (J250)',
    boltPattern: '6x139.7',
    centerBore: '95.1 mm',
    recommendedLoadIndex: '116 / 124 (LT Commercial)',
    factorySizes: [
      '265/70R18 (1958 Trim, Land Cruiser Grade)',
      '265/60R20 (First Edition, Premium)',
    ],
    downsizingTip:
      'The 18" rim fitment (265/70R18) is the gold standard for Canadian winters and overland trails. Downsizing 20" wheels to 18" delivers a full 32.6" overall diameter with 7.3" of sidewall cushion to absorb jagged trail rocks and hidden frozen curbs.',
    tires: [
      {
        id: 'lc-falken-wildpeak-at4w',
        name: 'Falken Wildpeak A/T4W',
        brand: 'Falken',
        category: 'All-Weather 3PMSF',
        oemSize: '265/70R18',
        badge: 'Severe Snow Trail Beast',
        loadIndex: '116',
        speedRating: 'T',
        oemFitment: 'Fits OEM 18" (265/70R18) & 20" (265/60R20)',
        rating: 4.9,
        bestFor:
          'Year-round off-road capability, sharp rocky trail durability, and genuine 3PMSF severe snow winter performance.',
        pros: [
          'Heavy-duty 3-ply DURASPEC sidewall technology resists puncture from sharp frozen rocks and ice chunks',
          'Full-depth 3D canyon sipes deliver certified 3PMSF snow and slush grip',
          'Aggressive shoulder blocks provide deep snow clawing traction when airing down on trails',
          'Exceptional towing stability and heat dissipation for heavy trailers',
        ],
        cons: [
          'Heavier unsprung tire weight slightly impacts hybrid fuel efficiency (~0.5 L/100km)',
          'Mild road hum audible at 110+ km/h compared to smooth highway touring tires',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Falken+Wildpeak+AT4W+265+70R18&tag=toyotawaits-20',
        searchQuery: 'Falken Wildpeak AT4W 265/70R18',
      },
      {
        id: 'lc-nokian-outpost-nat',
        name: 'Nokian Outpost nAT',
        brand: 'Nokian',
        category: 'All-Weather 3PMSF',
        oemSize: '265/70R18',
        badge: 'Aramid-Armored All-Terrain',
        loadIndex: '116',
        speedRating: 'T',
        oemFitment: 'Fits OEM 18" (265/70R18) & 20" (265/60R20)',
        rating: 4.8,
        bestFor:
          'Overlanding utility, heavy towing, and severe Canadian mountain highway pass crossings in all four seasons.',
        pros: [
          'Aramid Shield puncture-resistant fibers woven directly into both tread and sidewall belts',
          'Low rolling resistance engineered specifically for modern high-torque hybrid powertrains',
          'Summit Sidewalls offer lateral clawing grip when extricating from deep unplowed snow ruts',
        ],
        cons: [
          'Aggressive tread pattern requires regular 8,000 km rotations to prevent cupping',
          'Higher price point reflecting specialized Nordic engineering',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Nokian+Outpost+nAT+265+70R18&tag=toyotawaits-20',
        searchQuery: 'Nokian Outpost nAT 265/70R18',
      },
      {
        id: 'lc-nokian-hakka-lt3',
        name: 'Nokian Hakkapeliitta LT3',
        brand: 'Nokian',
        category: 'Dedicated Winter',
        oemSize: '265/70R18',
        badge: 'Arctic Expedition Benchmark',
        loadIndex: '124',
        speedRating: 'Q',
        oemFitment: 'Fits OEM 18" (265/70R18)',
        rating: 4.9,
        bestFor:
          'Extreme northern Canadian ice, unplowed logging roads, sub-zero expedition travel, and heavy-duty winter towing.',
        pros: [
          'Commercial heavy-duty LT carcass built for severe truck payloads and icy mountain switchbacks',
          'Deep 16/32" tread depth bites through heavy unplowed drifts and slush banks with authority',
          'Industry-leading braking on black ice and frozen lake crossings',
          'Stays flexible down to -45°C without brittle cracking',
        ],
        cons: [
          'Stiffer heavy-duty 10-ply ride on unloaded city pavement',
          'Overkill for drivers who rarely leave plowed urban highways',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Nokian+Hakkapeliitta+LT3+265+70R18&tag=toyotawaits-20',
        searchQuery: 'Nokian Hakkapeliitta LT3 265/70R18',
      },
      {
        id: 'lc-bridgestone-blizzak-lt',
        name: 'Bridgestone Blizzak LT',
        brand: 'Bridgestone',
        category: 'Dedicated Winter',
        oemSize: '265/70R18',
        badge: 'Heavy Commercial Winter',
        loadIndex: '124',
        speedRating: 'R',
        oemFitment: 'Fits OEM 18" (265/70R18)',
        rating: 4.7,
        bestFor:
          'Reliable heavy-duty stopping power in snow, ice, and winter slush with high resistance to tire sway while towing.',
        pros: [
          'Zig-zag sipes and high void ratio efficiently clear deep packed snow from the contact patch',
          'Heavy-duty commercial casing resists tire deflection and trailer sway',
          'Durable winter compound engineered to withstand high torque from the i-FORCE MAX hybrid motor',
        ],
        cons: [
          'Heavier weight increases rolling resistance compared to highway tires',
          'Firm unladen ride quality over city potholes',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Bridgestone+Blizzak+LT+265+70R18&tag=toyotawaits-20',
        searchQuery: 'Bridgestone Blizzak LT 265/70R18',
      },
    ],
  },
};

export function formatAmazonAffiliateUrl(url: string): string {
  const defaultTag =
    process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG ||
    'toyotawaits-20';
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('tag')) {
      parsed.searchParams.set('tag', defaultTag);
    }
    return parsed.toString();
  } catch {
    return url.includes('tag=') ? url : `${url}${url.includes('?') ? '&' : '?'}tag=${defaultTag}`;
  }
}

export function getTiresForModel(modelId: string): ModelTireConfig {
  return TIRE_CATALOG_DATA[modelId] || TIRE_CATALOG_DATA['rav4'];
}
