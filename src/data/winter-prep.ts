/**
 * Canadian Winter Prep & Survival Guide Specifications
 * Vehicle-specific battery jump points, interior floor protection, and freezing rain gear.
 * Adheres to Amazon Associates Operating Agreement (statutory pricing, compliance tags).
 */

export type WinterModelKey =
  | 'rav4'
  | 'grand-highlander'
  | 'sienna'
  | 'prius-prime'
  | 'corolla-cross'
  | 'tacoma';

export interface BatterySpecs {
  auxBatteryLocation: string;
  jumpPointLocation: string;
  recommendedJumpPack: string;
  amazonLink: string;
  hybridColdWeatherTip: string;
}

export interface InteriorProtection {
  floorMatType: string;
  coverageNote: string;
  batteryVentClearance: string;
  amazonLink: string;
}

export interface ExteriorWinterGear {
  frostGuardType: string;
  wiperSpecs: string;
  amazonLink: string;
}

export interface ModelWinterConfig {
  modelKey: WinterModelKey;
  vehicleName: string;
  batterySpecs: BatterySpecs;
  interiorProtection: InteriorProtection;
  exteriorWinterGear: ExteriorWinterGear;
}

export const WINTER_PREP_DATA: Record<WinterModelKey, ModelWinterConfig> = {
  rav4: {
    modelKey: 'rav4',
    vehicleName: 'RAV4 (Hybrid / Prime / Gas)',
    batterySpecs: {
      auxBatteryLocation:
        'Cargo area under right floor deck (Hybrids & Prime). Primary 12V in engine bay on Gas models.',
      jumpPointLocation:
        "Inside the engine bay fuse box under the red plastic '+' flip cap. Ground to bare metal engine bracket (unpainted hoist hook).",
      recommendedJumpPack:
        'NOCO Boost Plus GB40 (1000A) / GBX45 (1250A) UltraSafe Lithium Starter',
      amazonLink: '/out/noco-gb40-jump-pack',
      hybridColdWeatherTip:
        'Never connect negative jump clamp directly to painted fender bolts. Keep NOCO GB40/GBX45 charged in glove box. The hybrid system only draws ~25-30A from the 12V battery for ~10 seconds to close the HV contactor relay into READY mode.',
    },
    interiorProtection: {
      floorMatType:
        'High-wall TuxMat / Husky custom fit laser-scanned all-weather liners',
      coverageNote:
        'Deep footwell bucket coverage protecting dead pedal and door sills from corrosive road salt and slush melt.',
      batteryVentClearance:
        'Must NOT obstruct the high-voltage battery cooling intake mesh located under the right rear passenger seat cushion. Blocking this causes hybrid system thermal warning faults even in sub-zero weather.',
      amazonLink: '/out/high-wall-floor-liners-rav4',
    },
    exteriorWinterGear: {
      frostGuardType:
        'Direct-fit windshield frost guard with side door flap anchors and mirror mittens',
      wiperSpecs:
        'Beam-style silicone winter wiper blades with anti-icing aerodynamic spoilers',
      amazonLink:
        'https://www.amazon.ca/s?k=Toyota+RAV4+windshield+frost+guard+snow+cover&tag=toyotawaits-20',
    },
  },

  'grand-highlander': {
    modelKey: 'grand-highlander',
    vehicleName: 'Grand Highlander (Hybrid MAX & Standard)',
    batterySpecs: {
      auxBatteryLocation:
        'Rear quarter panel compartment behind the removable trim access door.',
      jumpPointLocation:
        "Driver-side engine compartment fuse box with dedicated positive jump terminal under the red flip cap. Ground to unpainted engine hanger bolt.",
      recommendedJumpPack:
        'NOCO Boost Plus GB40 / GBX45 12V UltraSafe Lithium Starter',
      amazonLink: '/out/noco-gb40-jump-pack',
      hybridColdWeatherTip:
        'High electrical draw from heated windshield, heated rear seats, and triple-zone HVAC in sub-zero temps drains 12V reserve if making short urban trips. A portable jump starter in the center console prevents stranded mornings.',
    },
    interiorProtection: {
      floorMatType:
        '3-row full sidewall protection with middle aisle runner',
      coverageNote:
        'Complete floor coverage across row 1, 2 captain chairs aisle, and row 3 with raised perimeter walls containing melted ice and boot slush.',
      batteryVentClearance:
        'Ensure hybrid battery cooling airflow channels under second-row seating are kept clear of heavy winter boots, ski bags, and snow gear.',
      amazonLink: '/out/3-row-all-weather-liners',
    },
    exteriorWinterGear: {
      frostGuardType:
        'Extra-wide SUV windshield frost guard preventing iced wiper cowl jams',
      wiperSpecs:
        'Heavy-duty beam winter wipers resistant to freezing spray and sub-zero tear',
      amazonLink:
        'https://www.amazon.ca/s?k=Toyota+Grand+Highlander+windshield+snow+cover+frost+guard&tag=toyotawaits-20',
    },
  },

  sienna: {
    modelKey: 'sienna',
    vehicleName: 'Sienna (Hybrid AWD)',
    batterySpecs: {
      auxBatteryLocation:
        'Driver-side rear cargo wall compartment behind the removable storage panel.',
      jumpPointLocation:
        "Engine bay fuse box under the flip-up red terminal tab. Connect negative clamp to unpainted engine block grounding bracket.",
      recommendedJumpPack:
        'NOCO Boost Plus GB40 / GBX45 Lithium Jump Starter',
      amazonLink: '/out/noco-gb40-jump-pack',
      hybridColdWeatherTip:
        'Powered sliding doors can ice up along the lower rail channel. Keep jump pack accessible from front doors in case rear hatch power latch is frozen.',
    },
    interiorProtection: {
      floorMatType:
        'Long-slide track floor liners with rubber seat rail seals',
      coverageNote:
        'Full custom coverage with specialized rubber channel seals to prevent salt and melted snow from gumming sliding mechanisms and floor tracks.',
      batteryVentClearance:
        'Hybrid battery intake vent beneath front passenger seat base must stay uncovered by floor mats, boots, or winter blankets.',
      amazonLink: '/out/tuxmat-sienna',
    },
    exteriorWinterGear: {
      frostGuardType:
        'Full minivan windshield frost cover with anti-theft door flap anchors',
      wiperSpecs:
        'Heavy-duty silicone wipers engineered to clear severe slush without streaking',
      amazonLink:
        'https://www.amazon.ca/s?k=Toyota+Sienna+windshield+frost+guard+snow+cover&tag=toyotawaits-20',
    },
  },

  'prius-prime': {
    modelKey: 'prius-prime',
    vehicleName: 'Prius Prime (PHEV)',
    batterySpecs: {
      auxBatteryLocation:
        'Rear trunk area underneath the right side luggage compartment deck.',
      jumpPointLocation:
        "Inside the primary under-hood fuse block under the red positive terminal cover. Ground to bare metal engine hoist bracket.",
      recommendedJumpPack:
        'NOCO Boost Plus GB40 (1000A) Lithium Jump Starter',
      amazonLink: '/out/noco-gb40-jump-pack',
      hybridColdWeatherTip:
        'In temperatures below -10°C, the gas engine will run to heat the cabin regardless of battery charge state. Use the scheduled pre-conditioning cabin heater while plugged in to preserve EV range.',
    },
    interiorProtection: {
      floorMatType:
        'Low-profile, high-rim floor mats that keep dead pedal carpet dry from salt crust',
      coverageNote:
        'Laser-measured 3D TPE liners with raised borders keeping corrosive Canadian road salt off factory floor carpet and kick panels.',
      batteryVentClearance:
        'Maintain clear unobstructed space around the rear passenger seat hybrid battery air intake mesh.',
      amazonLink: '/out/prius-all-weather-liners',
    },
    exteriorWinterGear: {
      frostGuardType:
        'Sleek aerodynamic windshield frost shield with door flap anchors preventing clear coat abrasion',
      wiperSpecs:
        'Low-drag beam-type all-weather silicone wiper blades rated for extreme sub-zero flexibility',
      amazonLink:
        'https://www.amazon.ca/s?k=Toyota+Prius+windshield+frost+guard+snow+cover&tag=toyotawaits-20',
    },
  },

  'corolla-cross': {
    modelKey: 'corolla-cross',
    vehicleName: 'Corolla Cross (Hybrid & Gas)',
    batterySpecs: {
      auxBatteryLocation:
        'Engine bay (Gas models) or cargo floor deck (Hybrid models).',
      jumpPointLocation:
        "Engine fuse block terminal under the red flip cap. Ground clamp attached to unpainted engine block bolt.",
      recommendedJumpPack:
        'NOCO Boost Plus GB40 UltraSafe Lithium Jump Starter',
      amazonLink: '/out/noco-gb40-jump-pack',
      hybridColdWeatherTip:
        'Hybrid system requires minimum auxiliary voltage to energize the main contactor relays; sub-zero cold can drop weak batteries below the 10.5V trigger threshold needed for READY mode.',
    },
    interiorProtection: {
      floorMatType:
        'Laser-measured dual front and rear bench liners',
      coverageNote:
        'High perimeter raised lips holding melted slush, road salt brine, and gravel from driver winter boots.',
      batteryVentClearance:
        'Keep lower rear seat cushion air intake vents unobstructed by boots, blankets, or cargo bags.',
      amazonLink: '/out/corolla-cross-all-weather-liners',
    },
    exteriorWinterGear: {
      frostGuardType:
        'Compact SUV windshield snow shield with side wing door flap anchors',
      wiperSpecs:
        'Direct-fit winter beam wiper blades with anti-icing rubber boots preventing cowl freeze-up',
      amazonLink: '/out/windshield-frost-guard',
    },
  },

  tacoma: {
    modelKey: 'tacoma',
    vehicleName: 'Tacoma (i-FORCE MAX & Turbo)',
    batterySpecs: {
      auxBatteryLocation:
        'Engine bay (driver-side heavy-duty battery tray).',
      jumpPointLocation:
        "Primary 12V terminal posts under hood with red positive protective boot. Ground to unpainted engine block bolt.",
      recommendedJumpPack:
        'NOCO Boost Plus GB40 / GBX45 Heavy-Duty Lithium Starter',
      amazonLink: '/out/noco-gb40-jump-pack',
      hybridColdWeatherTip:
        'For i-FORCE MAX hybrid models, store the jump pack in the rear cab under-seat compartment rather than the truck bed to prevent cold-soaking below operating temps.',
    },
    interiorProtection: {
      floorMatType:
        'Deep-channel heavy-duty rubber all-weather bucket liners',
      coverageNote:
        'High sill coverage trapping snow, gravel, mud, and road salt from heavy work and winter boots.',
      batteryVentClearance:
        'For i-FORCE MAX models, maintain ventilation clearance around the under-seat hybrid battery cooling fan intake beneath the rear double cab bench.',
      amazonLink: '/out/tacoma-all-weather-liners',
    },
    exteriorWinterGear: {
      frostGuardType:
        'Full-size pickup windshield snow/ice guard with anti-theft ear flaps and mirror mittens',
      wiperSpecs:
        'Heavy-duty silicone winter wipers engineered for sub-zero icing and highway wind lift resistance',
      amazonLink: '/out/windshield-frost-guard',
    },
  },
};

/**
 * Normalizes input model slug to one of the 6 supported WinterModelKeys.
 */
export function getWinterPrepForModel(modelSlug?: string): ModelWinterConfig {
  if (!modelSlug) return WINTER_PREP_DATA.rav4;
  const normalized = modelSlug.toLowerCase().trim();

  if (normalized in WINTER_PREP_DATA) {
    return WINTER_PREP_DATA[normalized as WinterModelKey];
  }

  if (normalized.includes('rav4')) return WINTER_PREP_DATA.rav4;
  if (normalized.includes('highlander')) return WINTER_PREP_DATA['grand-highlander'];
  if (normalized.includes('sienna')) return WINTER_PREP_DATA.sienna;
  if (normalized.includes('prius')) return WINTER_PREP_DATA['prius-prime'];
  if (normalized.includes('corolla')) return WINTER_PREP_DATA['corolla-cross'];
  if (normalized.includes('tacoma')) return WINTER_PREP_DATA.tacoma;

  return WINTER_PREP_DATA.rav4;
}
