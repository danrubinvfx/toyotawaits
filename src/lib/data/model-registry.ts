export interface ModelRegistryEntry {
  slug: string;
  name: string; // e.g. "Toyota RAV4"
  shortName: string; // e.g. "RAV4"
  dbFilter: string;
  powertrains: string[];
  baseMedian: number;
  baseP25: number;
  baseP75: number;
  popularTrims: Array<{
    trim: string;
    powertrain: string;
    spread: string;
    status: 'High Demand' | 'Balanced' | 'Constrained';
  }>;
  allocationTips: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const MODEL_REGISTRY: Record<string, ModelRegistryEntry> = {
  'rav4': {
    slug: 'rav4',
    name: 'Toyota RAV4',
    shortName: 'RAV4',
    dbFilter: 'rav4',
    powertrains: ['Gas', 'Hybrid', 'Plug-in Hybrid'],
    baseMedian: 240,
    baseP25: 150,
    baseP75: 380,
    popularTrims: [
      { trim: 'LE / XLE AWD', powertrain: 'Gas', spread: '2–4 months (60–120 days)', status: 'Balanced' },
      { trim: 'Hybrid XLE / Woodland AWD', powertrain: 'Hybrid', spread: '5–8 months (150–240 days)', status: 'High Demand' },
      { trim: 'Hybrid XSE / Limited AWD', powertrain: 'Hybrid', spread: '6–9 months (180–270 days)', status: 'High Demand' },
      { trim: 'Plug-in Hybrid SE / XSE AWD', powertrain: 'Plug-in Hybrid', spread: '10–14 months (300–420 days)', status: 'Constrained' },
    ],
    allocationTips: [
      'Hybrid and Plug-in Hybrid production queues are constrained by high provincial ZEV rebate demand in BC and Quebec.',
      'Factory production batches prioritize higher-margin XLE and XSE AWD trims over base trims.',
      'Port-installed hitch and electronic accessory packages may introduce 2–3 weeks of processing time at shipping docks in Vancouver or Halifax.',
      'Placing non-binding deposits at two separate high-allocation dealership groups increases your chance of catching an abandoned factory allocation slot.',
    ],
    faqs: [
      {
        question: 'What is the average wait time for a Toyota RAV4 in Canada in 2026?',
        answer: 'In 2026, the Canadian national median wait time for a Toyota RAV4 is approximately 2 to 4 months for Gas models, 5 to 8 months for Hybrid models, and 10 to 14 months for Plug-in Hybrid variants, with provincial rebate programs heavily influencing delivery speeds.',
      },
      {
        question: 'Which Canadian province has the shortest wait time for the RAV4?',
        answer: 'Alberta, Ontario, and Prairie provinces generally report shorter wait times (often 30–60 days faster) due to lower government electrification subsidy demand compared to British Columbia and Quebec.',
      },
      {
        question: 'Why are RAV4 Plug-in Hybrid wait times longer than gas or hybrid models?',
        answer: 'High demand driven by the federal iZEV incentive combined with CleanBC and Roulez vert provincial rebates, along with battery module supply limits, creates significant national queue pressure for the Plug-in Hybrid.',
      },
      {
        question: 'Can Canadian dealerships charge above MSRP for a Toyota RAV4?',
        answer: 'Under provincial automotive regulations like OMVIC in Ontario and VSA in BC, all-in advertised pricing is mandatory. While outright dealer markup is legally restricted on advertised vehicles, buyers should watch for mandatory dealer add-ons.',
      },
    ],
  },
  'sienna': {
    slug: 'sienna',
    name: 'Toyota Sienna',
    shortName: 'Sienna',
    dbFilter: 'sienna',
    powertrains: ['Hybrid AWD / FWD'],
    baseMedian: 410,
    baseP25: 350,
    baseP75: 420,
    popularTrims: [
      { trim: 'LE FWD (8-Passenger)', powertrain: 'Hybrid AWD / FWD', spread: '8–11 months (240–330 days)', status: 'High Demand' },
      { trim: 'LE / XLE AWD (8-Passenger)', powertrain: 'Hybrid AWD / FWD', spread: '10–13 months (300–390 days)', status: 'Constrained' },
      { trim: 'XSE AWD (7-Passenger)', powertrain: 'Hybrid AWD / FWD', spread: '11–14 months (330–420 days)', status: 'Constrained' },
      { trim: 'Limited / Platinum AWD', powertrain: 'Hybrid AWD / FWD', spread: '12–14 months (360–420 days)', status: 'Constrained' },
    ],
    allocationTips: [
      'The Sienna remains one of the highest-demand vehicles across Canada due to sole-hybrid minivan fuel economy and limited total plant output.',
      '8-passenger configurations (LE/XLE) tend to allocate slightly faster than 7-passenger captain chair models with specialized rear entertainment units.',
      'Factory-ordered rear hitch receivers frequently trigger hold notices—consider taking delivery bare and adding an aftermarket receiver with kick-sensor bracket later.',
      'Dealers in urban centres receive larger allocation batches monthly; contacting mid-sized regional dealerships can occasionally uncover cancelled buyer allocations.',
    ],
    faqs: [
      {
        question: 'What is the average wait time for a Toyota Sienna in Canada in 2026?',
        answer: 'In 2026, the Canadian national median wait time for a Toyota Sienna Hybrid is approximately 11 to 14 months (350 to 420 days). It continues to be one of the tightest allocations in the Toyota lineup.',
      },
      {
        question: 'Which Canadian province has the shortest wait time for the Sienna?',
        answer: 'Ontario and Alberta dealerships with high total volume allocations report slightly shorter wait times, whereas BC and Quebec allocations face extended waiting lists.',
      },
      {
        question: 'Is every Toyota Sienna sold in Canada a hybrid?',
        answer: 'Yes, all current generation Toyota Sienna models sold in Canada come standard with an ultra-efficient Hybrid powertrain, available in either FWD or Electronic On-Demand AWD.',
      },
      {
        question: 'How does dealer allocation work for the Sienna in Canada?',
        answer: 'Toyota Canada allocates Siennas based on dealership sales volume, turn rate, and market share. High-volume dealerships receive more allocations per cycle, though their waitlists are correspondingly larger.',
      },
    ],
  },
  'grand-highlander': {
    slug: 'grand-highlander',
    name: 'Toyota Grand Highlander',
    shortName: 'Grand Highlander',
    dbFilter: 'grand highlander',
    powertrains: ['Gas', 'Hybrid', 'Hybrid MAX'],
    baseMedian: 300,
    baseP25: 240,
    baseP75: 360,
    popularTrims: [
      { trim: 'XLE AWD (Gas Turbo)', powertrain: 'Gas', spread: '4–6 months (120–180 days)', status: 'Balanced' },
      { trim: 'Limited AWD (Gas Turbo)', powertrain: 'Gas', spread: '5–7 months (150–210 days)', status: 'Balanced' },
      { trim: 'XLE / Limited Hybrid AWD', powertrain: 'Hybrid', spread: '8–12 months (240–360 days)', status: 'High Demand' },
      { trim: 'Platinum Hybrid MAX AWD', powertrain: 'Hybrid MAX', spread: '10–13 months (300–400 days)', status: 'Constrained' },
    ],
    allocationTips: [
      'The 2.4L Turbo Gas configuration has substantially shorter wait times than the 2.5L Hybrid or performance Hybrid MAX variants.',
      'Hybrid MAX Platinum trims face specialty chip and inverter component constraints, leading to longer production queues.',
      'Bench seating configurations in XLE trims often receive build slots sooner than second-row captain chairs.',
      'Check dealer pipeline allocations at the start of each month when regional distribution sheets update.',
    ],
    faqs: [
      {
        question: 'What is the average wait time for a Toyota Grand Highlander in Canada in 2026?',
        answer: 'Canadian wait times for the 2026 Grand Highlander average 4 to 6 months for Gas Turbo models, 8 to 12 months for standard Hybrid models, and 10 to 13 months for the top-tier Hybrid MAX Platinum.',
      },
      {
        question: 'Which powertrain is easiest to get on the Grand Highlander?',
        answer: 'The 2.4L Turbo Gas model offers the fastest delivery timeline across Canada, typically arriving several months ahead of the hybrid variants.',
      },
      {
        question: 'Does the Grand Highlander qualify for Canadian EV/hybrid rebates?',
        answer: 'As a non-plug-in conventional hybrid, the Grand Highlander does not qualify for federal iZEV rebates, keeping the buyer waitlist purely consumer-driven without subsidy distortion.',
      },
    ],
  },
  'highlander': {
    slug: 'highlander',
    name: 'Toyota Highlander',
    shortName: 'Highlander',
    dbFilter: 'highlander',
    powertrains: ['Gas', 'Hybrid'],
    baseMedian: 180,
    baseP25: 120,
    baseP75: 270,
    popularTrims: [
      { trim: 'LE / XLE AWD (Gas)', powertrain: 'Gas', spread: '2–4 months (60–120 days)', status: 'Balanced' },
      { trim: 'Limited / Platinum AWD (Gas)', powertrain: 'Gas', spread: '3–5 months (90–150 days)', status: 'Balanced' },
      { trim: 'LE / XLE Hybrid AWD', powertrain: 'Hybrid', spread: '5–8 months (150–240 days)', status: 'High Demand' },
      { trim: 'Limited / Platinum Hybrid AWD', powertrain: 'Hybrid', spread: '6–9 months (180–270 days)', status: 'High Demand' },
    ],
    allocationTips: [
      'The standard Highlander enjoys healthy production pipelines as some 3-row demand has shifted to the larger Grand Highlander.',
      'Gas turbo models are frequently available in dealer inventory or pipeline transit within 60 to 90 days.',
      'Hybrid AWD remains popular for winter commuters—allocating to high-volume Ontario and Quebec dealers provides steady delivery windows.',
    ],
    faqs: [
      {
        question: 'What is the wait time for a Toyota Highlander in Canada?',
        answer: 'Wait times for the Toyota Highlander in Canada range from 2 to 4 months for Gas models and 5 to 8 months for Highlander Hybrid models.',
      },
      {
        question: 'Is the Highlander easier to get than the Grand Highlander?',
        answer: 'Yes, the standard Highlander typically has shorter wait times by 2 to 4 months compared to equivalent Grand Highlander hybrid trims.',
      },
    ],
  },
  'prius': {
    slug: 'prius',
    name: 'Toyota Prius',
    shortName: 'Prius',
    dbFilter: 'prius',
    powertrains: ['Hybrid', 'Plug-in Hybrid'],
    baseMedian: 140,
    baseP25: 90,
    baseP75: 210,
    popularTrims: [
      { trim: 'LE / XLE AWD', powertrain: 'Hybrid', spread: '3–5 months (90–150 days)', status: 'Balanced' },
      { trim: 'Limited AWD', powertrain: 'Hybrid', spread: '4–6 months (120–180 days)', status: 'Balanced' },
      { trim: 'SE / XSE Plug-in Hybrid', powertrain: 'Plug-in Hybrid', spread: '6–9 months (180–270 days)', status: 'High Demand' },
      { trim: 'XSE Premium Plug-in Hybrid', powertrain: 'Plug-in Hybrid', spread: '8–11 months (240–330 days)', status: 'Constrained' },
    ],
    allocationTips: [
      'Strictly designated as Plug-in Hybrid (replacing older Prime nomenclature); eligible for both federal and provincial EV rebates.',
      'XSE Premium models with solar roof options have the tightest factory allocation constraints.',
      'Standard AWD Hybrid models move briskly through distribution hubs in BC and Ontario.',
    ],
    faqs: [
      {
        question: 'What is the wait time for a Toyota Prius or Plug-in Hybrid in Canada?',
        answer: 'In 2026, standard Prius Hybrid wait times average 3 to 5 months, while the Prius Plug-in Hybrid averages 6 to 10 months depending on provincial ZEV incentives.',
      },
      {
        question: 'Is the Prius Prime still called Prime in Canada?',
        answer: 'Toyota has transitioned official nomenclature to "Prius Plug-in Hybrid" to align global electrified vehicle naming conventions.',
      },
    ],
  },
  'tacoma': {
    slug: 'tacoma',
    name: 'Toyota Tacoma',
    shortName: 'Tacoma',
    dbFilter: 'tacoma',
    powertrains: ['i-FORCE', 'i-FORCE MAX'],
    baseMedian: 120,
    baseP25: 75,
    baseP75: 180,
    popularTrims: [
      { trim: 'SR5 / TRD Sport (i-FORCE)', powertrain: 'i-FORCE', spread: '2–4 months (60–120 days)', status: 'Balanced' },
      { trim: 'TRD Off-Road (i-FORCE)', powertrain: 'i-FORCE', spread: '3–5 months (90–150 days)', status: 'Balanced' },
      { trim: 'TRD Off-Road Premium (i-FORCE MAX)', powertrain: 'i-FORCE MAX', spread: '4–7 months (120–210 days)', status: 'High Demand' },
      { trim: 'TRD Pro / Trailhunter (i-FORCE MAX)', powertrain: 'i-FORCE MAX', spread: '7–10 months (210–300 days)', status: 'Constrained' },
    ],
    allocationTips: [
      'Standard i-FORCE 2.4L turbo gas models are readily available across Canadian dealer pipelines.',
      'Trailhunter and TRD Pro flagship trims carry low production quotas per dealership—expect limited allocation batches.',
      'Manual transmission configurations are built in limited runs—be prepared for longer wait times if ordering a 6-speed manual.',
    ],
    faqs: [
      {
        question: 'What is the average wait time for a Toyota Tacoma in Canada in 2026?',
        answer: 'Canadian buyers can expect 2 to 4 months for standard i-FORCE Tacoma trims, and 4 to 8 months for i-FORCE MAX hybrid models, with halo trims like Trailhunter extending to 10 months.',
      },
      {
        question: 'Which Tacoma trims are built in Canada or shortest to deliver?',
        answer: 'SR5 and TRD Sport Double Cab models represent the highest manufacturing volume and arrive fastest across all provinces.',
      },
    ],
  },
  'tundra': {
    slug: 'tundra',
    name: 'Toyota Tundra',
    shortName: 'Tundra',
    dbFilter: 'tundra',
    powertrains: ['i-FORCE', 'i-FORCE MAX'],
    baseMedian: 90,
    baseP25: 60,
    baseP75: 140,
    popularTrims: [
      { trim: 'SR / SR5 CrewMax (i-FORCE)', powertrain: 'i-FORCE', spread: '1–3 months (30–90 days)', status: 'Balanced' },
      { trim: 'Limited CrewMax (i-FORCE)', powertrain: 'i-FORCE', spread: '2–4 months (60–120 days)', status: 'Balanced' },
      { trim: 'Limited / Platinum (i-FORCE MAX)', powertrain: 'i-FORCE MAX', spread: '3–5 months (90–150 days)', status: 'High Demand' },
      { trim: 'TRD Pro / Capstone (i-FORCE MAX)', powertrain: 'i-FORCE MAX', spread: '5–8 months (150–240 days)', status: 'Constrained' },
    ],
    allocationTips: [
      'Tundra supply in Canada is healthy, with multiple SR5 and Limited configurations available in on-the-ground dealer inventory.',
      'TRD Off-Road and TRD Pro packages remain the most sought after in Western Canada (Alberta and BC).',
      'i-FORCE MAX hybrid configurations take 1 to 2 months longer than conventional twin-turbo gas V6 models.',
    ],
    faqs: [
      {
        question: 'What is the wait time for a Toyota Tundra in Canada?',
        answer: 'The Toyota Tundra has one of the healthiest inventories among Toyota trucks in Canada, with lead times of 1 to 3 months for gas models and 3 to 5 months for i-FORCE MAX hybrid trims.',
      },
      {
        question: 'Can I find a Toyota Tundra in stock on dealer lots in Canada?',
        answer: 'Yes, standard SR5 and Limited trims frequently have direct lot availability, especially in Ontario and Alberta.',
      },
    ],
  },
  'corolla-cross': {
    slug: 'corolla-cross',
    name: 'Toyota Corolla Cross',
    shortName: 'Corolla Cross',
    dbFilter: 'corolla cross',
    powertrains: ['Gas', 'Hybrid'],
    baseMedian: 180,
    baseP25: 90,
    baseP75: 270,
    popularTrims: [
      { trim: 'L / LE AWD (Gas)', powertrain: 'Gas', spread: '2–4 months (60–120 days)', status: 'Balanced' },
      { trim: 'XLE AWD (Gas)', powertrain: 'Gas', spread: '3–5 months (90–150 days)', status: 'Balanced' },
      { trim: 'SE AWD (Hybrid)', powertrain: 'Hybrid', spread: '6–9 months (180–270 days)', status: 'High Demand' },
      { trim: 'XSE AWD (Hybrid)', powertrain: 'Hybrid', spread: '7–10 months (210–300 days)', status: 'High Demand' },
    ],
    allocationTips: [
      'The Corolla Cross Hybrid is assembled in limited batches compared to conventional gas trims, resulting in a marked delivery time split.',
      'Gas L and LE AWD trims are commonly available within 90 days across Canadian dealerships.',
      'Flexibility with two-tone roof color selections can shave 60+ days off hybrid order fulfilment.',
    ],
    faqs: [
      {
        question: 'What is the wait time for a Toyota Corolla Cross Hybrid in Canada?',
        answer: 'Corolla Cross Hybrid models currently carry a 6 to 10 month wait time in Canada, whereas standard gas AWD models arrive in 2 to 4 months.',
      },
      {
        question: 'Why is the Corolla Cross Hybrid harder to get than the gas model?',
        answer: 'High fuel efficiency and compact crossover demand make the Hybrid exceptionally popular, while factory production allocation to Canada remains conservative.',
      },
    ],
  },
  'camry': {
    slug: 'camry',
    name: 'Toyota Camry',
    shortName: 'Camry',
    dbFilter: 'camry',
    powertrains: ['Hybrid AWD / FWD'],
    baseMedian: 120,
    baseP25: 70,
    baseP75: 180,
    popularTrims: [
      { trim: 'LE FWD / AWD (Hybrid)', powertrain: 'Hybrid AWD / FWD', spread: '2–4 months (60–120 days)', status: 'Balanced' },
      { trim: 'SE AWD (Hybrid)', powertrain: 'Hybrid AWD / FWD', spread: '3–5 months (90–150 days)', status: 'Balanced' },
      { trim: 'XSE AWD (Hybrid)', powertrain: 'Hybrid AWD / FWD', spread: '4–6 months (120–180 days)', status: 'High Demand' },
      { trim: 'XLE AWD (Hybrid)', powertrain: 'Hybrid AWD / FWD', spread: '4–6 months (120–180 days)', status: 'High Demand' },
    ],
    allocationTips: [
      'The current generation Camry is exclusively hybrid, meaning all Canadian allocations are 2.5L HEVs.',
      'Electronic On-Demand AWD configurations represent the vast majority of Canadian orders and production volume.',
      'SE AWD is the highest-volume trim in Toyota Canada distribution centers and delivers the fastest.',
    ],
    faqs: [
      {
        question: 'What is the wait time for the all-hybrid Toyota Camry in Canada in 2026?',
        answer: 'Average wait times for the 2026 Camry across Canada range from 2 to 5 months (70 to 180 days), with SE AWD being the quickest to deliver.',
      },
      {
        question: 'Is the Toyota Camry available with AWD in Canada?',
        answer: 'Yes, almost all Canadian Camry trims are delivered with Electronic On-Demand AWD, perfectly suited for Canadian winters.',
      },
    ],
  },
  'land-cruiser': {
    slug: 'land-cruiser',
    name: 'Toyota Land Cruiser',
    shortName: 'Land Cruiser',
    dbFilter: 'land cruiser',
    powertrains: ['i-FORCE MAX'],
    baseMedian: 125,
    baseP25: 85,
    baseP75: 145,
    popularTrims: [
      { trim: '1958 Grade', powertrain: 'i-FORCE MAX', spread: '3–5 months (90–150 days)', status: 'Balanced' },
      { trim: 'Land Cruiser Grade', powertrain: 'i-FORCE MAX', spread: '4–6 months (120–180 days)', status: 'High Demand' },
      { trim: 'Land Cruiser with Premium Package', powertrain: 'i-FORCE MAX', spread: '4–6 months (120–180 days)', status: 'High Demand' },
    ],
    allocationTips: [
      'Every Land Cruiser 250 in Canada comes equipped with the i-FORCE MAX hybrid powertrain and full-time 4WD.',
      'The retro round-headlight 1958 Grade offers an authentic enthusiast build with steady allocation frequency.',
      'Allocation numbers are tightly managed on a dealer-by-dealer basis across metropolitan Toyota stores.',
    ],
    faqs: [
      {
        question: 'What is the wait time for a Toyota Land Cruiser in Canada?',
        answer: 'In 2026, Canadian wait times for the Land Cruiser 250 average 3 to 6 months (85 to 160 days), depending on trim and package allocation.',
      },
      {
        question: 'Does the Canadian Land Cruiser come with a hybrid engine?',
        answer: 'Yes, all Land Cruisers sold in Canada feature the turbocharged 2.4L i-FORCE MAX hybrid powertrain paired with an 8-speed automatic transmission.',
      },
    ],
  },
  '4runner': {
    slug: '4runner',
    name: 'Toyota 4Runner',
    shortName: '4Runner',
    dbFilter: '4runner',
    powertrains: ['i-FORCE', 'i-FORCE MAX'],
    baseMedian: 150,
    baseP25: 90,
    baseP75: 210,
    popularTrims: [
      { trim: 'SR5 / TRD Sport (i-FORCE)', powertrain: 'i-FORCE', spread: '3–5 months (90–150 days)', status: 'Balanced' },
      { trim: 'TRD Off-Road (i-FORCE)', powertrain: 'i-FORCE', spread: '4–6 months (120–180 days)', status: 'High Demand' },
      { trim: 'TRD Off-Road Premium (i-FORCE MAX)', powertrain: 'i-FORCE MAX', spread: '5–8 months (150–240 days)', status: 'High Demand' },
      { trim: 'Trailhunter / TRD Pro (i-FORCE MAX)', powertrain: 'i-FORCE MAX', spread: '8–11 months (240–330 days)', status: 'Constrained' },
    ],
    allocationTips: [
      'Built on the TNGA-F truck platform, 4Runner allocations in Canada are heavily weighted toward rugged TRD trims.',
      'High enthusiast demand for Trailhunter and TRD Pro trims means long waiting lists at MSRP dealers.',
      'The standard i-FORCE 2.4L turbo engine arrives 2 to 3 months faster than the i-FORCE MAX hybrid versions.',
    ],
    faqs: [
      {
        question: 'What is the wait time for a 2026 Toyota 4Runner in Canada?',
        answer: 'Wait times for the current generation 4Runner in Canada average 3 to 6 months for i-FORCE models and 5 to 9 months for i-FORCE MAX hybrid configurations.',
      },
      {
        question: 'Which 4Runner trims are most difficult to obtain in Canada?',
        answer: 'The Trailhunter and TRD Pro halo trims face the tightest dealership allocations and highest customer backlogs.',
      },
    ],
  },
  'sequoia': {
    slug: 'sequoia',
    name: 'Toyota Sequoia',
    shortName: 'Sequoia',
    dbFilter: 'sequoia',
    powertrains: ['i-FORCE MAX'],
    baseMedian: 240,
    baseP25: 180,
    baseP75: 330,
    popularTrims: [
      { trim: 'SR5 TRD Off-Road', powertrain: 'i-FORCE MAX', spread: '4–7 months (120–210 days)', status: 'Balanced' },
      { trim: 'Limited Nightshade', powertrain: 'i-FORCE MAX', spread: '5–8 months (150–240 days)', status: 'Balanced' },
      { trim: 'Platinum / Capstone', powertrain: 'i-FORCE MAX', spread: '7–10 months (210–300 days)', status: 'High Demand' },
      { trim: 'TRD Pro', powertrain: 'i-FORCE MAX', spread: '9–13 months (270–390 days)', status: 'Constrained' },
    ],
    allocationTips: [
      'All Canadian Sequoia models are exclusively i-FORCE MAX Twin-Turbo V6 hybrids with 4WD.',
      'TRD Pro models have low dealer allocation counts, often 1–2 units per dealership per year.',
      'Limited Nightshade represents the best balance between luxury equipment and realistic allocation lead times.',
    ],
    faqs: [
      {
        question: 'What is the wait time for a Toyota Sequoia in Canada in 2026?',
        answer: 'The Toyota Sequoia has an average Canadian wait time of 6 to 9 months (180 to 280 days), with specialty TRD Pro trims reaching up to 12 months.',
      },
      {
        question: 'Why are Toyota Sequoia allocations limited in Canada?',
        answer: 'As a full-size body-on-frame luxury SUV produced in Texas alongside the Tundra, Canadian market allocation quotas are tightly managed by Toyota Canada.',
      },
    ],
  },
};

export function getModelConfig(slug: string): ModelRegistryEntry | undefined {
  if (!slug) return undefined;
  return MODEL_REGISTRY[slug.toLowerCase().trim()];
}

export function getAllModelConfigs(): ModelRegistryEntry[] {
  return Object.values(MODEL_REGISTRY);
}
