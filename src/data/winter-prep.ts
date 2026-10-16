/**
 * Canadian Winter Prep & Survival Guide Specifications
 * Vehicle-specific battery jump points, interior floor protection, and freezing rain gear.
 * Each topic embeds both technical advice context and matching vetted recommended gear.
 * Adheres to Amazon Associates Operating Agreement (statutory pricing, compliance tags).
 */

export type WinterModelKey =
  | 'rav4'
  | 'grand-highlander'
  | 'sienna'
  | 'prius-prime'
  | 'corolla-cross'
  | 'tacoma';

export interface WinterRecommendedProduct {
  title: string;
  benefit: string;
  url: string;
  slug?: string;
  badge: 'Essential' | 'Top Pick' | 'Recommended';
}

export interface WinterBatteryTopic {
  title: string;
  auxBatteryLocation: string;
  jumpPointLocation: string;
  coldWeatherTip: string;
  product: WinterRecommendedProduct;
}

export interface WinterFloorTopic {
  title: string;
  floorMatType: string;
  carpetProtectionNote: string;
  batteryVentClearance: string;
  product: WinterRecommendedProduct;
}

export interface WinterWindshieldTopic {
  title: string;
  carCoverWarning: string;
  wiperHingeTip: string;
  frostGuardType: string;
  wiperSpecs: string;
  product: WinterRecommendedProduct;
}

export interface ModelWinterConfig {
  modelKey: WinterModelKey;
  vehicleName: string;
  batteryTopic: WinterBatteryTopic;
  floorTopic: WinterFloorTopic;
  windshieldTopic: WinterWindshieldTopic;

  // Backwards compatibility aliases
  batterySpecs: {
    auxBatteryLocation: string;
    jumpPointLocation: string;
    recommendedJumpPack: string;
    amazonLink: string;
    hybridColdWeatherTip: string;
  };
  interiorProtection: {
    floorMatType: string;
    coverageNote: string;
    batteryVentClearance: string;
    amazonLink: string;
  };
  exteriorWinterGear: {
    frostGuardType: string;
    wiperSpecs: string;
    amazonLink: string;
  };
}

export const WINTER_PREP_DATA: Record<WinterModelKey, ModelWinterConfig> = {
  rav4: {
    modelKey: 'rav4',
    vehicleName: 'RAV4 (Hybrid / Prime / Gas)',
    batteryTopic: {
      title: '12V Battery & Cold Starts',
      auxBatteryLocation:
        'Cargo area under right floor deck (Hybrids & Prime). Primary 12V in engine bay on Gas models.',
      jumpPointLocation:
        "Inside engine bay fuse box under red plastic '+' flip cap. Ground to bare metal engine bracket (unpainted hoist hook).",
      coldWeatherTip:
        'Never connect negative jump clamp directly to painted fender bolts. Keep NOCO GB40/GBX45 charged in glove box. The hybrid system only draws ~25-30A from the 12V battery for ~10 seconds to close the HV contactor relay into READY mode. Sub-zero cold drains auxiliary battery chemical capacity, preventing starter relays from closing.',
      product: {
        title: 'NOCO Boost Plus GB40 (or GBX45 for extreme cold)',
        benefit:
          'Delivers the 12V auxiliary surge needed to close hybrid starter relays. Operating range: -20°C to +50°C (device temperature, not outdoor air) — store indoors in extreme cold. Follow your vehicle owner\'s manual and the NOCO manual for the correct 12V jump procedure.',
        url: 'https://www.amazon.ca/dp/B015TKUPIC?tag=toyotawaits-20',
        badge: 'Essential',
      },
    },
    floorTopic: {
      title: 'Salt & Slush Floor Protection',
      floorMatType:
        'High-wall TuxMat / Husky custom fit laser-scanned all-weather liners',
      carpetProtectionNote:
        'Deep footwell bucket coverage protecting dead pedal and door sills from corrosive road salt and slush melt.',
      batteryVentClearance:
        'Must NOT obstruct the high-voltage battery cooling intake mesh located under the right rear passenger seat cushion. Blocking this causes hybrid system thermal warning faults even in sub-zero weather.',
      product: {
        title: 'TuxMat Custom High-Wall Floor Liners (RAV4)',
        benefit:
          'Maximum edge-to-edge carpet and salt crust protection precision-cut to maintain 100% rear seat battery vent intake clearance.',
        url: 'https://www.amazon.ca/s?k=TuxMat+RAV4&tag=toyotawaits-20',
        badge: 'Top Pick',
      },
    },
    windshieldTopic: {
      title: 'Frost & Windshield Protection',
      carCoverWarning:
        'Full fabric outdoor car covers trap rising engine condensation against sheet metal. In Canadian freeze-thaw cycles, moisture freezes solid between cover and paint, causing severe clear-coat scratches and micro-marring when pulled off.',
      wiperHingeTip:
        'Prevent wiper arm frozen hinges by keeping wipers resting flat against lower windshield heating elements instead of bending tension springs upright in freezing winds.',
      frostGuardType:
        'Direct-fit windshield frost guard with side door flap anchors and mirror mittens',
      wiperSpecs:
        'Beam-style silicone winter wiper blades with anti-icing aerodynamic spoilers',
      product: {
        title: 'Magnetic Door-Anchor Windshield Frost Guard',
        benefit:
          'Multi-layer ice barrier with anti-theft door flap anchors that shields glass and wiper cowl cavity without contacting painted panels.',
        url: 'https://www.amazon.ca/s?k=magnetic+door+anchor+windshield+frost+guard+snow+cover&tag=toyotawaits-20',
        slug: 'magnetic-door-anchor-windshield-frost-guard',
        badge: 'Recommended',
      },
    },
    // Backwards compatibility mappings
    get batterySpecs() {
      return {
        auxBatteryLocation: this.batteryTopic.auxBatteryLocation,
        jumpPointLocation: this.batteryTopic.jumpPointLocation,
        recommendedJumpPack: this.batteryTopic.product.title,
        amazonLink: this.batteryTopic.product.url,
        hybridColdWeatherTip: this.batteryTopic.coldWeatherTip,
      };
    },
    get interiorProtection() {
      return {
        floorMatType: this.floorTopic.floorMatType,
        coverageNote: this.floorTopic.carpetProtectionNote,
        batteryVentClearance: this.floorTopic.batteryVentClearance,
        amazonLink: this.floorTopic.product.url,
      };
    },
    get exteriorWinterGear() {
      return {
        frostGuardType: this.windshieldTopic.frostGuardType,
        wiperSpecs: this.windshieldTopic.wiperSpecs,
        amazonLink: this.windshieldTopic.product.url,
      };
    },
  },

  'grand-highlander': {
    modelKey: 'grand-highlander',
    vehicleName: 'Grand Highlander (Hybrid MAX & Standard)',
    batteryTopic: {
      title: '12V Battery & Cold Starts',
      auxBatteryLocation:
        'Rear quarter panel compartment behind the removable trim access door.',
      jumpPointLocation:
        "Driver-side engine compartment fuse box with dedicated positive jump terminal under the red flip cap. Ground to unpainted engine hanger bolt.",
      coldWeatherTip:
        'High electrical draw from heated windshield, heated rear seats, and triple-zone HVAC in sub-zero temps drains 12V reserve if making short urban trips. A portable jump starter in the center console prevents stranded mornings.',
      product: {
        title: 'NOCO Boost Plus GB40 (or GBX45 for extreme cold)',
        benefit:
          'Ensures reliable 12V auxiliary power to trip starter relays across large 3-row hybrid architectures in deep sub-zero conditions.',
        url: 'https://www.amazon.ca/dp/B015TKUPIC?tag=toyotawaits-20',
        badge: 'Essential',
      },
    },
    floorTopic: {
      title: 'Salt & Slush Floor Protection',
      floorMatType:
        '3-row full sidewall protection with middle aisle runner',
      carpetProtectionNote:
        'Complete floor coverage across row 1, 2 captain chairs aisle, and row 3 with raised perimeter walls containing melted ice and boot slush.',
      batteryVentClearance:
        'Ensure hybrid battery cooling airflow channels under second-row seating are kept clear of heavy winter boots, ski bags, and snow gear.',
      product: {
        title: '3-Row Heavy Duty All-Weather Floor Liners (Grand Highlander)',
        benefit:
          'High-wall sidewall containment locking in salty meltwater while leaving 2nd row hybrid cooling ducts completely unobstructed.',
        url: 'https://www.amazon.ca/dp/B0CM7R9W42?tag=toyotawaits-20',
        badge: 'Top Pick',
      },
    },
    windshieldTopic: {
      title: 'Frost & Windshield Protection',
      carCoverWarning:
        'Full fabric outdoor car covers trap rising engine condensation against sheet metal and freeze rock-solid to the clear coat paint. Windshield-only frost covers protect glass without risking paint damage.',
      wiperHingeTip:
        'Prevent wiper arm frozen hinges by keeping wipers resting on heated windshield defroster zones beneath an extra-wide frost guard.',
      frostGuardType:
        'Extra-wide SUV windshield frost guard preventing iced wiper cowl jams',
      wiperSpecs:
        'Heavy-duty beam winter wipers resistant to freezing spray and sub-zero tear',
      product: {
        title: 'Magnetic Door-Anchor Windshield Frost Guard (SUV Wide)',
        benefit:
          'Extra-wide coverage preventing freezing rain and heavy snow buildup inside the windshield wiper cowl cavity.',
        url: 'https://www.amazon.ca/s?k=magnetic+door+anchor+windshield+frost+guard+snow+cover&tag=toyotawaits-20',
        slug: 'magnetic-door-anchor-windshield-frost-guard',
        badge: 'Recommended',
      },
    },
    get batterySpecs() {
      return {
        auxBatteryLocation: this.batteryTopic.auxBatteryLocation,
        jumpPointLocation: this.batteryTopic.jumpPointLocation,
        recommendedJumpPack: this.batteryTopic.product.title,
        amazonLink: this.batteryTopic.product.url,
        hybridColdWeatherTip: this.batteryTopic.coldWeatherTip,
      };
    },
    get interiorProtection() {
      return {
        floorMatType: this.floorTopic.floorMatType,
        coverageNote: this.floorTopic.carpetProtectionNote,
        batteryVentClearance: this.floorTopic.batteryVentClearance,
        amazonLink: this.floorTopic.product.url,
      };
    },
    get exteriorWinterGear() {
      return {
        frostGuardType: this.windshieldTopic.frostGuardType,
        wiperSpecs: this.windshieldTopic.wiperSpecs,
        amazonLink: this.windshieldTopic.product.url,
      };
    },
  },

  sienna: {
    modelKey: 'sienna',
    vehicleName: 'Sienna (Hybrid AWD)',
    batteryTopic: {
      title: '12V Battery & Cold Starts',
      auxBatteryLocation:
        'Driver-side rear cargo wall compartment behind the removable storage panel.',
      jumpPointLocation:
        "Engine bay fuse box under the flip-up red terminal tab. Connect negative clamp to unpainted engine block grounding bracket.",
      coldWeatherTip:
        'Powered sliding doors can ice up along the lower rail channel. Keep jump pack accessible from front doors in case rear hatch power latch is frozen.',
      product: {
        title: 'NOCO Boost Plus GB40 (or GBX45 for extreme cold)',
        benefit:
          'Compact glove box lithium starter that wakes up hybrid power computers even when power sliding doors and hatch latches freeze.',
        url: 'https://www.amazon.ca/dp/B015TKUPIC?tag=toyotawaits-20',
        badge: 'Essential',
      },
    },
    floorTopic: {
      title: 'Salt & Slush Floor Protection',
      floorMatType:
        'Long-slide track floor liners with rubber seat rail seals',
      carpetProtectionNote:
        'Full custom coverage with specialized rubber channel seals to prevent salt and melted snow from gumming sliding mechanisms and floor tracks across rows 2 and 3.',
      batteryVentClearance:
        'Hybrid battery intake vent beneath front passenger seat base must stay uncovered by floor mats, boots, or winter blankets.',
      product: {
        title: 'TuxMat Custom Floor Liners (Sienna 7/8 Passenger)',
        benefit:
          'Tailored rail-channel seals that keep corrosive slush out of Super-Long-Slide tracks while leaving front passenger battery vents free.',
        url: 'https://www.amazon.ca/dp/B0CM7R9W42?tag=toyotawaits-20',
        badge: 'Top Pick',
      },
    },
    windshieldTopic: {
      title: 'Frost & Windshield Protection',
      carCoverWarning:
        'Full fabric car covers freeze solidly to minivan clear coats during freezing rain. Windshield-only frost covers protect glass without risking paint damage.',
      wiperHingeTip:
        'Prevent wiper arm frozen hinges by keeping wipers parked on heated wiper cowl grid lines and using a door-flap anchored frost guard.',
      frostGuardType:
        'Full minivan windshield frost cover with anti-theft door flap anchors',
      wiperSpecs:
        'Heavy-duty silicone wipers engineered to clear severe slush without streaking',
      product: {
        title: 'Magnetic Door-Anchor Windshield Frost Guard',
        benefit:
          'Secures against high blizzard winds with interior door flaps, keeping wipers flexible and cowl clear of packed snow.',
        url: 'https://www.amazon.ca/s?k=magnetic+door+anchor+windshield+frost+guard+snow+cover&tag=toyotawaits-20',
        slug: 'magnetic-door-anchor-windshield-frost-guard',
        badge: 'Recommended',
      },
    },
    get batterySpecs() {
      return {
        auxBatteryLocation: this.batteryTopic.auxBatteryLocation,
        jumpPointLocation: this.batteryTopic.jumpPointLocation,
        recommendedJumpPack: this.batteryTopic.product.title,
        amazonLink: this.batteryTopic.product.url,
        hybridColdWeatherTip: this.batteryTopic.coldWeatherTip,
      };
    },
    get interiorProtection() {
      return {
        floorMatType: this.floorTopic.floorMatType,
        coverageNote: this.floorTopic.carpetProtectionNote,
        batteryVentClearance: this.floorTopic.batteryVentClearance,
        amazonLink: this.floorTopic.product.url,
      };
    },
    get exteriorWinterGear() {
      return {
        frostGuardType: this.windshieldTopic.frostGuardType,
        wiperSpecs: this.windshieldTopic.wiperSpecs,
        amazonLink: this.windshieldTopic.product.url,
      };
    },
  },

  'prius-prime': {
    modelKey: 'prius-prime',
    vehicleName: 'Prius Prime (PHEV)',
    batteryTopic: {
      title: '12V Battery & Cold Starts',
      auxBatteryLocation:
        'Rear trunk area underneath the right side luggage compartment deck.',
      jumpPointLocation:
        "Inside the primary under-hood fuse block under the red positive terminal cover. Ground to bare metal engine hoist bracket.",
      coldWeatherTip:
        'In temperatures below -10°C, the gas engine will run to heat the cabin regardless of battery charge state. Use the scheduled pre-conditioning cabin heater while plugged in to preserve EV range.',
      product: {
        title: 'NOCO Boost Plus GB40 (or GBX45 for extreme cold)',
        benefit:
          'Delivers instantaneous 12V power to boot the vehicle hybrid control ECUs and contactor relays during extreme Canadian cold snaps.',
        url: 'https://www.amazon.ca/dp/B015TKUPIC?tag=toyotawaits-20',
        badge: 'Essential',
      },
    },
    floorTopic: {
      title: 'Salt & Slush Floor Protection',
      floorMatType:
        'Low-profile, high-rim floor mats that keep dead pedal carpet dry from salt crust',
      carpetProtectionNote:
        'Laser-measured 3D TPE liners with raised borders keeping corrosive Canadian road salt off factory floor carpet and kick panels.',
      batteryVentClearance:
        'Maintain clear unobstructed space around the rear passenger seat hybrid battery air intake mesh.',
      product: {
        title: 'Custom-Fit High-Wall All-Weather Floor Liners (Prius Prime)',
        benefit:
          'High dead-pedal and footwell barrier preventing white salt crust build-up while keeping rear seat cooling mesh clear.',
        url: 'https://www.amazon.ca/s?k=TuxMat+Prius+Prime&tag=toyotawaits-20',
        badge: 'Top Pick',
      },
    },
    windshieldTopic: {
      title: 'Frost & Windshield Protection',
      carCoverWarning:
        'Full fabric outdoor car covers trap rising engine condensation against sheet metal and freeze rock-solid to the clear coat paint. Use door-anchored glass shields.',
      wiperHingeTip:
        'Prevent wiper arm frozen hinges by keeping wipers resting on lower windshield defroster zones beneath an aerodynamic glass shield.',
      frostGuardType:
        'Sleek aerodynamic windshield frost shield with door flap anchors preventing clear coat abrasion',
      wiperSpecs:
        'Low-drag beam-type all-weather silicone wiper blades rated for extreme sub-zero flexibility',
      product: {
        title: 'Magnetic Door-Anchor Windshield Frost Guard',
        benefit:
          'Aero-fit front windshield guard that prevents ice buildup on wipers and eliminates early morning scraping.',
        url: 'https://www.amazon.ca/s?k=magnetic+door+anchor+windshield+frost+guard+snow+cover&tag=toyotawaits-20',
        slug: 'magnetic-door-anchor-windshield-frost-guard',
        badge: 'Recommended',
      },
    },
    get batterySpecs() {
      return {
        auxBatteryLocation: this.batteryTopic.auxBatteryLocation,
        jumpPointLocation: this.batteryTopic.jumpPointLocation,
        recommendedJumpPack: this.batteryTopic.product.title,
        amazonLink: this.batteryTopic.product.url,
        hybridColdWeatherTip: this.batteryTopic.coldWeatherTip,
      };
    },
    get interiorProtection() {
      return {
        floorMatType: this.floorTopic.floorMatType,
        coverageNote: this.floorTopic.carpetProtectionNote,
        batteryVentClearance: this.floorTopic.batteryVentClearance,
        amazonLink: this.floorTopic.product.url,
      };
    },
    get exteriorWinterGear() {
      return {
        frostGuardType: this.windshieldTopic.frostGuardType,
        wiperSpecs: this.windshieldTopic.wiperSpecs,
        amazonLink: this.windshieldTopic.product.url,
      };
    },
  },

  'corolla-cross': {
    modelKey: 'corolla-cross',
    vehicleName: 'Corolla Cross (Hybrid & Gas)',
    batteryTopic: {
      title: '12V Battery & Cold Starts',
      auxBatteryLocation:
        'Engine bay (Gas models) or cargo floor deck (Hybrid models).',
      jumpPointLocation:
        "Engine fuse block terminal under the red flip cap. Ground clamp attached to unpainted engine block bolt.",
      coldWeatherTip:
        'Hybrid system requires minimum auxiliary voltage to energize the main contactor relays; sub-zero cold can drop weak batteries below the 10.5V trigger threshold needed for READY mode.',
      product: {
        title: 'NOCO Boost Plus GB40 (or GBX45 for extreme cold)',
        benefit:
          'Safely overcomes the 10.5V contactor voltage threshold to energize hybrid relays in freezing sub-zero weather.',
        url: 'https://www.amazon.ca/dp/B015TKUPIC?tag=toyotawaits-20',
        badge: 'Essential',
      },
    },
    floorTopic: {
      title: 'Salt & Slush Floor Protection',
      floorMatType:
        'Laser-measured dual front and rear bench liners',
      carpetProtectionNote:
        'High perimeter raised lips holding melted slush, road salt brine, and gravel from driver winter boots.',
      batteryVentClearance:
        'Keep lower rear seat cushion air intake vents unobstructed by boots, blankets, or cargo bags.',
      product: {
        title: 'Custom-Fit All-Weather Floor Mats (Corolla Cross)',
        benefit:
          'Form-fit bucket liners containing melted snow while preserving open airflow to rear bench hybrid intake vents.',
        url: 'https://www.amazon.ca/s?k=Toyota+Corolla+Cross+all+weather+floor+mats+liners&tag=toyotawaits-20',
        slug: 'custom-fit-all-weather-floor-mats-corolla-cross',
        badge: 'Top Pick',
      },
    },
    windshieldTopic: {
      title: 'Frost & Windshield Protection',
      carCoverWarning:
        'Full fabric outdoor car covers trap rising engine condensation against sheet metal and freeze rock-solid to the clear coat paint. Glass frost shields protect clear coat.',
      wiperHingeTip:
        'Prevent wiper arm frozen hinges by keeping wipers flat under a frost guard rather than leaving them extended in icy winds.',
      frostGuardType:
        'Compact SUV windshield snow shield with side wing door flap anchors',
      wiperSpecs:
        'Direct-fit winter beam wiper blades with anti-icing rubber boots preventing cowl freeze-up',
      product: {
        title: 'Magnetic Door-Anchor Windshield Frost Guard',
        benefit:
          'Protects compact SUV glass and wiper cowl from overnight freezing rain glaze and ice pack.',
        url: 'https://www.amazon.ca/s?k=magnetic+door+anchor+windshield+frost+guard+snow+cover&tag=toyotawaits-20',
        slug: 'magnetic-door-anchor-windshield-frost-guard',
        badge: 'Recommended',
      },
    },
    get batterySpecs() {
      return {
        auxBatteryLocation: this.batteryTopic.auxBatteryLocation,
        jumpPointLocation: this.batteryTopic.jumpPointLocation,
        recommendedJumpPack: this.batteryTopic.product.title,
        amazonLink: this.batteryTopic.product.url,
        hybridColdWeatherTip: this.batteryTopic.coldWeatherTip,
      };
    },
    get interiorProtection() {
      return {
        floorMatType: this.floorTopic.floorMatType,
        coverageNote: this.floorTopic.carpetProtectionNote,
        batteryVentClearance: this.floorTopic.batteryVentClearance,
        amazonLink: this.floorTopic.product.url,
      };
    },
    get exteriorWinterGear() {
      return {
        frostGuardType: this.windshieldTopic.frostGuardType,
        wiperSpecs: this.windshieldTopic.wiperSpecs,
        amazonLink: this.windshieldTopic.product.url,
      };
    },
  },

  tacoma: {
    modelKey: 'tacoma',
    vehicleName: 'Tacoma (i-FORCE MAX & Turbo)',
    batteryTopic: {
      title: '12V Battery & Cold Starts',
      auxBatteryLocation:
        'Engine bay (driver-side heavy-duty battery tray).',
      jumpPointLocation:
        "Primary 12V terminal posts under hood with red positive protective boot. Ground to unpainted engine block bolt.",
      coldWeatherTip:
        'For i-FORCE MAX hybrid models, store the jump pack in the rear cab under-seat compartment rather than the truck bed to prevent cold-soaking below operating temps.',
      product: {
        title: 'NOCO Boost Plus GB40 (or GBX45 for extreme cold)',
        benefit:
          'Heavy-duty lithium jump starter designed for truck powertrains and sub-zero trail rescues.',
        url: 'https://www.amazon.ca/dp/B015TKUPIC?tag=toyotawaits-20',
        badge: 'Essential',
      },
    },
    floorTopic: {
      title: 'Salt & Slush Floor Protection',
      floorMatType:
        'Deep-channel heavy-duty rubber all-weather bucket liners',
      carpetProtectionNote:
        'High sill coverage trapping snow, gravel, mud, and road salt from heavy work and winter boots.',
      batteryVentClearance:
        'For i-FORCE MAX models, maintain ventilation clearance around the under-seat hybrid battery cooling fan intake beneath the rear double cab bench.',
      product: {
        title: 'Heavy-Duty All-Weather Floor Liners (Tacoma)',
        benefit:
          'Deep snow and slush channels that keep work boot muck off cab carpet without blocking i-FORCE MAX battery fans.',
        url: 'https://www.amazon.ca/s?k=Toyota+Tacoma+all+weather+floor+mats+liners&tag=toyotawaits-20',
        slug: 'tacoma-all-weather-liners',
        badge: 'Top Pick',
      },
    },
    windshieldTopic: {
      title: 'Frost & Windshield Protection',
      carCoverWarning:
        'Full fabric outdoor car covers trap rising engine condensation against sheet metal and freeze rock-solid to the clear coat paint. Use cab-width windshield snow guards instead.',
      wiperHingeTip:
        'Prevent wiper arm frozen hinges by keeping wipers resting on lower windshield defroster zones beneath a secure frost cover.',
      frostGuardType:
        'Full-size pickup windshield snow/ice guard with anti-theft ear flaps and mirror mittens',
      wiperSpecs:
        'Heavy-duty silicone winter wipers engineered for sub-zero icing and highway wind lift resistance',
      product: {
        title: 'Magnetic Door-Anchor Windshield Frost Guard (Truck/SUV)',
        benefit:
          'Heavy-duty windshield and wiper cowl cover anchored securely through cab doors against blizzard gusts.',
        url: 'https://www.amazon.ca/s?k=magnetic+door+anchor+windshield+frost+guard+snow+cover&tag=toyotawaits-20',
        slug: 'magnetic-door-anchor-windshield-frost-guard',
        badge: 'Recommended',
      },
    },
    get batterySpecs() {
      return {
        auxBatteryLocation: this.batteryTopic.auxBatteryLocation,
        jumpPointLocation: this.batteryTopic.jumpPointLocation,
        recommendedJumpPack: this.batteryTopic.product.title,
        amazonLink: this.batteryTopic.product.url,
        hybridColdWeatherTip: this.batteryTopic.coldWeatherTip,
      };
    },
    get interiorProtection() {
      return {
        floorMatType: this.floorTopic.floorMatType,
        coverageNote: this.floorTopic.carpetProtectionNote,
        batteryVentClearance: this.floorTopic.batteryVentClearance,
        amazonLink: this.floorTopic.product.url,
      };
    },
    get exteriorWinterGear() {
      return {
        frostGuardType: this.windshieldTopic.frostGuardType,
        wiperSpecs: this.windshieldTopic.wiperSpecs,
        amazonLink: this.windshieldTopic.product.url,
      };
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
