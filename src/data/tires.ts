/**
 * Canadian Toyota Tire Guide & Review Specifications
 * OEM factory tire sizes, seasonal downsizing recommendations,
 * and curated 3PMSF winter / all-weather tire options for Canadian conditions.
 * Compliant with Amazon Associates Operating Agreement (no hardcoded static prices, statutory disclaimer).
 */

export type TireCategory = 'Dedicated Winter' | 'All-Weather 3PMSF' | 'All-Season Highway';

export interface TireItem {
  id: string;
  name: string;
  brand: string;
  category: 'Dedicated Winter' | 'All-Weather 3PMSF' | 'All-Season Highway';
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
    id: 'corolla',
    label: 'Corolla',
    name: 'Toyota Corolla & Corolla Cross',
    badge: 'Sedan, Hatch & Cross',
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
    yearRange: '2019–2025 (Gen 5) & 2026+ (Gen 6)',
    boltPattern: '5x114.3',
    centerBore: '60.1 mm',
    recommendedLoadIndex: '102 (SL/XL)',
    factorySizes: [
      '5th Gen (2019–2025): 225/65R17 (LE, XLE, Woodland)',
      '5th Gen (2019–2025): 225/60R18 (XSE, Prime SE/XSE, Trail)',
      '5th Gen (2019–2025): 235/55R19 (Limited)',
      '6th Gen (2026+): 225/65R17 (Core LE)',
      '6th Gen (2026+): 225/60R18 (Core XLE, Woodland)',
      '6th Gen (2026+): 235/50R20 (Sport XSE, GR SPORT)',
    ],
    downsizingTip:
      'Downsizing 18" or 19" factory wheels to 17" rims (225/65R17) for winter saves ~$250–$400 per package and provides taller sidewalls to cushion against winter frost heaves and potholes. For 2026+ models with up to 20" wheels on Sport and GR SPORT trims, downsizing to 17" or 18" rims offers the same substantial sidewall protection and savings.',
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
          'Exceptional winter durability backed by manufacturer winter treadwear warranty',
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
          'Higher wear rate if driven continuously during hot summer highway conditions compared to dedicated touring rubber',
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
          'Slight hybrid fuel economy impact due to aggressive high-traction winter block resistance',
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
          'Excellent tire longevity backed by manufacturer winter treadwear warranty',
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
          'Transport Canada 3PMSF severe snow certified braking and traction over standard all-season tires',
          'Exceptional hydroplaning resistance when encountering standing slush and spring highway puddles',
          'Extended tread life backed by multi-season manufacturer warranty',
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
          'Maximum electric range retention, low rolling drag, and confident 3PMSF sub-zero braking on icy city streets and highways.',
        pros: [
          'Lowest rolling resistance among premium Nordic winter tires—minimizes winter EV battery drop',
          'Superb lateral stability on slushy highway lane changes and exit ramps',
          'Manufacturer winter treadwear warranty provides multi-season longevity',
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
          'Heavier unsprung tire weight slightly impacts hybrid fuel efficiency compared to highway touring tires',
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
          'Aggressive tread pattern requires regular seasonal rotations to prevent cupping',
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
  corolla: {
    modelId: 'corolla',
    modelName: 'Toyota Corolla (Sedan, Hatchback & GR)',
    label: 'Corolla (Sedan / Hatch / GR)',
    badge: 'Compact & Performance',
    yearRange: '2020–2026 (Gen 12)',
    boltPattern: '5x100 (GR: 5x114.3)',
    centerBore: '54.1 mm (GR: 60.1 mm)',
    recommendedLoadIndex: '91–95 (SL/XL)',
    factorySizes: [
      '195/65R15 (Base L, LE, Hybrid LE)',
      '205/55R16 (LE Upgrade, SE Hatch, XLE)',
      '225/40R18 (SE Sedan, XSE Sedan, XSE Hatch, Nightshade)',
      '235/40R18 (GR Corolla Core / Premium / Circuit)',
    ],
    downsizingTip:
      'Downsizing from 18" (225/40R18) on SE/XSE to 16" (205/55R16) or 15" (195/65R15) wheels provides 20mm–25mm taller sidewall cushion against winter frost heaves and potholes, and saves ~$250–$400 per tire set.',
    tires: [
      {
        id: 'corolla-blizzak-ws90',
        name: 'Bridgestone Blizzak WS90',
        brand: 'Bridgestone',
        category: 'Dedicated Winter',
        oemSize: '195/65R15',
        badge: 'Deep Snow & Ice Grip',
        loadIndex: '95',
        speedRating: 'T',
        oemFitment: 'Fits OEM 15" (195/65R15) & 16" (205/55R16)',
        rating: 4.9,
        bestFor:
          'Deep unplowed city snow, black ice stopping, and harsh Canadian prairie winter storms on Corolla Sedan and Hybrid.',
        pros: [
          'NanoPro-Tech Multicell compound removes water film on ice for instant stopping grip',
          'Deep zig-zag tread blocks bite through heavy slush ridges with zero hydroplaning',
          'Outstanding fuel economy retention on Corolla Hybrid AWD',
        ],
        cons: [
          'Multicell compound wears faster if driven in temperatures above +7°C',
          'Slightly softer dry road turn-in response compared to all-season performance tires',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Bridgestone+Blizzak+WS90+195+65R15&tag=toyotawaits-20',
        searchQuery: 'Bridgestone Blizzak WS90 195/65R15',
      },
      {
        id: 'corolla-continental-viking7',
        name: 'Continental VikingContact 7',
        brand: 'Continental',
        category: 'Dedicated Winter',
        oemSize: '205/55R16',
        badge: 'Quiet & Cold Traction',
        loadIndex: '94',
        speedRating: 'T',
        oemFitment: 'Fits OEM 16" (205/55R16) & 18" (225/40R18)',
        rating: 4.8,
        bestFor:
          'Whisper-quiet highway cruising, slush tracking, and sub-zero Arctic freeze flexibility.',
        pros: [
          'Nordic silica compound infused with canola oil stays pliable in -35°C deep freezes',
          'Class-leading quiet cabin noise level with negligible tire hum at 110 km/h',
          'Interlocking 3D sipes provide stable highway tracking without squirming',
        ],
        cons: [
          'Slightly higher price point than entry-level winter tires',
          'Directional tread requires front-to-back rotation only',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Continental+VikingContact+7+205+55R16&tag=toyotawaits-20',
        searchQuery: 'Continental VikingContact 7 205/55R16',
      },
      {
        id: 'corolla-nokian-hakka-r5',
        name: 'Nokian Hakkapeliitta R5',
        brand: 'Nokian',
        category: 'Dedicated Winter',
        oemSize: '195/65R15',
        badge: 'Nordic Winter Master',
        loadIndex: '95',
        speedRating: 'R',
        oemFitment: 'Fits OEM 15" (195/65R15) & 16" (205/55R16)',
        rating: 4.9,
        bestFor:
          'Pure Nordic ice performance and ultra-low rolling resistance for maximum Corolla Hybrid efficiency.',
        pros: [
          'Arctic Grip Crystals embedded directly in the tread act like built-in microscopic studs',
          'Extremely low rolling resistance minimizes winter fuel penalties on Corolla Hybrid',
          'Superior lateral stability when navigating frozen mountain switchbacks',
        ],
        cons: [
          'Limited availability at big-box retailers; best ordered early before winter rush',
          'Premium upfront pricing',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Nokian+Hakkapeliitta+R5+195+65R15&tag=toyotawaits-20',
        searchQuery: 'Nokian Hakkapeliitta R5 195/65R15',
      },
      {
        id: 'corolla-crossclimate2',
        name: 'Michelin CrossClimate 2',
        brand: 'Michelin',
        category: 'All-Weather 3PMSF',
        oemSize: '205/55R16',
        badge: 'Top Year-Round All-Weather',
        loadIndex: '94',
        speedRating: 'V',
        oemFitment: 'Fits OEM 15" (195/65R15), 16" (205/55R16), & 18" (225/40R18)',
        rating: 4.8,
        bestFor:
          'Certified 3PMSF severe snow legal four-season performance without seasonal tire swap hassle.',
        pros: [
          'Legally compliant with Quebec winter tire mandate and BC mountain pass regulations',
          'V-Formation directional tread channels water, slush, and snow efficiently',
          'Remarkable dry and wet braking performance rivaling dedicated summer tires',
          'Long tread life backed by 100,000 km manufacturer warranty',
        ],
        cons: [
          'Stiffer ride quality over rough frost heaves than soft Nordic winter tires',
          'Directional pattern requires same-side rotation',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Michelin+CrossClimate+2+205+55R16&tag=toyotawaits-20',
        searchQuery: 'Michelin CrossClimate 2 205/55R16',
      },
      {
        id: 'corolla-michelin-defender2',
        name: 'Michelin Defender 2',
        brand: 'Michelin',
        category: 'All-Season Highway',
        oemSize: '195/65R15',
        badge: '80,000-Mile Longevity',
        loadIndex: '91',
        speedRating: 'H',
        oemFitment: 'Fits OEM 15" (195/65R15) & 16" (205/55R16)',
        rating: 4.8,
        bestFor:
          'Maximum highway durability, plush road comfort, and whisper-quiet daily commuting.',
        pros: [
          'Locking 3D sipes provide outstanding wet braking and hydroplaning resistance',
          'Extremely long tread life backed by 130,000 km warranty',
          'Low rolling resistance optimizes highway fuel economy on Corolla Hybrid',
        ],
        cons: [
          'Not 3PMSF certified; dedicated winter tires required for severe Canadian snow zones',
          'Higher purchase price than budget all-season tires',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Michelin+Defender+2+195+65R15&tag=toyotawaits-20',
        searchQuery: 'Michelin Defender 2 195/65R15',
      },
      {
        id: 'corolla-continental-dws06',
        name: 'Continental ExtremeContact DWS06 Plus',
        brand: 'Continental',
        category: 'All-Season Highway',
        oemSize: '225/40R18',
        badge: 'Ultra High Performance All-Season',
        loadIndex: '92',
        speedRating: 'Y',
        oemFitment: 'Fits OEM 18" (225/40R18) & 18" (235/40R18)',
        rating: 4.9,
        bestFor:
          'Aggressive cornering grip, sports sedan steering response, and wet weather confidence for Corolla SE, XSE, and GR Corolla.',
        pros: [
          'SportPlus Technology delivers razor-sharp turn-in and maximum dry lateral grip',
          'Macro-blocks and high-angle sipes provide class-leading wet and slush braking',
          'Tuned performance indicators (D-W-S) molded directly into tread indicate wear status',
        ],
        cons: [
          'Slightly firmer road feel over coarse bumps due to low 40-series profile',
          'Not intended for deep snow or glare ice conditions',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Continental+ExtremeContact+DWS06+Plus+225+40R18&tag=toyotawaits-20',
        searchQuery: 'Continental ExtremeContact DWS06 Plus 225/40R18',
      },
    ],
  },
  'corolla-cross': {
    modelId: 'corolla-cross',
    modelName: 'Toyota Corolla Cross (FWD & AWD)',
    label: 'Corolla Cross',
    badge: 'Subcompact Crossover',
    yearRange: '2022–2026',
    boltPattern: '5x114.3',
    centerBore: '60.1 mm',
    recommendedLoadIndex: '99–102 (SL/XL)',
    factorySizes: [
      '215/65R17 (Cross L, LE FWD/AWD)',
      '225/55R18 (Cross XLE, SE Hybrid, XSE Hybrid)',
    ],
    downsizingTip:
      'Downsizing 18" factory wheels (225/55R18) on XLE and Hybrid SE/XSE to 17" rims (215/65R17) adds 12mm of protective sidewall cushion for rugged Canadian winter driving and saves ~$180–$250 per set of tires.',
    tires: [
      {
        id: 'cross-crossclimate2-suv',
        name: 'Michelin CrossClimate 2 SUV',
        brand: 'Michelin',
        category: 'All-Weather 3PMSF',
        oemSize: '215/65R17',
        badge: 'Top Year-Round Crossover',
        loadIndex: '102',
        speedRating: 'H',
        oemFitment: 'Fits OEM 17" (215/65R17) & 18" (225/55R18)',
        rating: 4.8,
        bestFor:
          'Severe snow certified (3PMSF) four-season crossover driving with zero seasonal tire swap hassle.',
        pros: [
          'Transport Canada 3PMSF certified severe snow rated for mountain highways and Quebec mandate',
          'Rigid tread blocks resist uneven wear under Corolla Cross AWD torque distribution',
          'Superb slush evacuation preventing dangerous highway hydroplaning',
        ],
        cons: [
          'Directional V-grooves require same-side front-to-back rotation',
          'Premium purchase cost compared to entry-level rubber',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Michelin+CrossClimate+2+SUV+215+65R17&tag=toyotawaits-20',
        searchQuery: 'Michelin CrossClimate 2 SUV 215/65R17',
      },
      {
        id: 'cross-blizzak-ws90',
        name: 'Bridgestone Blizzak WS90',
        brand: 'Bridgestone',
        category: 'Dedicated Winter',
        oemSize: '215/65R17',
        badge: 'Deep Snow & Slush Traction',
        loadIndex: '99',
        speedRating: 'T',
        oemFitment: 'Fits OEM 17" (215/65R17) & 18" (225/55R18)',
        rating: 4.9,
        bestFor:
          'Heavy winter snowstorms, unplowed side streets, and sudden black ice stops across Canada.',
        pros: [
          'Multicell microscopic biting pores grip frozen surfaces like micro-suction cups',
          '3D zig-zag siping creates massive mechanical traction when accelerating in deep snow',
          'High lateral stiffness prevents crossover body float when driving through slush ridges',
        ],
        cons: [
          'Rapid wear if left on in late spring above +7°C',
          'Slightly higher rolling resistance than low-drag touring tires',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Bridgestone+Blizzak+WS90+215+65R17&tag=toyotawaits-20',
        searchQuery: 'Bridgestone Blizzak WS90 215/65R17',
      },
      {
        id: 'cross-nokian-hakka-r5-suv',
        name: 'Nokian Hakkapeliitta R5 SUV',
        brand: 'Nokian',
        category: 'Dedicated Winter',
        oemSize: '215/65R17',
        badge: 'Nordic Arctic Grip',
        loadIndex: '102',
        speedRating: 'R',
        oemFitment: 'Fits OEM 17" (215/65R17)',
        rating: 4.9,
        bestFor:
          'Extreme Arctic conditions, mountain pass blizzards, and maximum hybrid AWD traction.',
        pros: [
          'Aramid Strong Sidewalls infused with Kevlar resist pothole pinch-flats and curb impacts',
          'Arctic Grip Crystals microscopic particle compound for unmatched ice braking',
          'Ultra-low rolling resistance preserves Corolla Cross Hybrid electric battery range',
        ],
        cons: [
          'Higher price per corner than secondary tire brands',
          'R-speed rating (170 km/h) requires adherence to winter speed limits',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Nokian+Hakkapeliitta+R5+SUV+215+65R17&tag=toyotawaits-20',
        searchQuery: 'Nokian Hakkapeliitta R5 SUV 215/65R17',
      },
      {
        id: 'cross-continental-viking7',
        name: 'Continental VikingContact 7',
        brand: 'Continental',
        category: 'Dedicated Winter',
        oemSize: '225/55R18',
        badge: 'Whisper-Quiet Cold Compound',
        loadIndex: '102',
        speedRating: 'T',
        oemFitment: 'Fits OEM 18" (225/55R18)',
        rating: 4.8,
        bestFor:
          'Smooth and serene highway driving with exceptional wet slush evacuation and ice braking.',
        pros: [
          'Flexible active-grip silica matrix stays compliant in deep sub-zero temperatures',
          'Exceptional steering feedback and lane-holding stability on frozen pavement',
          'Very low road noise generation inside the Corolla Cross cabin',
        ],
        cons: [
          'Directional tread limits rotation options',
          'Slightly softer dry braking feel compared to all-season tires',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Continental+VikingContact+7+225+55R18&tag=toyotawaits-20',
        searchQuery: 'Continental VikingContact 7 225/55R18',
      },
      {
        id: 'cross-michelin-defender2',
        name: 'Michelin Defender 2',
        brand: 'Michelin',
        category: 'All-Season Highway',
        oemSize: '215/65R17',
        badge: 'Quiet Highway Touring',
        loadIndex: '99',
        speedRating: 'H',
        oemFitment: 'Fits OEM 17" (215/65R17) & 18" (225/55R18)',
        rating: 4.8,
        bestFor:
          'Long-distance highway touring, minimal road noise, and ultra-durable tread life.',
        pros: [
          'EverTread compound engineered for heavy crossover loads and long highway life',
          'Piano Acoustic Tuning tread pattern eliminates drone at high cruising speeds',
          'Class-leading wet braking distance in heavy downpours',
        ],
        cons: [
          'Not 3PMSF severe snow rated; dedicated winter tires required for Canadian winter laws',
        ],
        amazonUrl:
          'https://www.amazon.ca/s?k=Michelin+Defender+2+215+65R17&tag=toyotawaits-20',
        searchQuery: 'Michelin Defender 2 215/65R17',
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
