export interface RolloverDeltaConfig {
  my27DeltaCad: number;
  my27DeltaUsd: number;
}

export const ROLLOVER_MODEL_DELTAS: Record<string, RolloverDeltaConfig> = {
  rav4: { my27DeltaCad: 1500, my27DeltaUsd: 1100 },
  sienna: { my27DeltaCad: 1200, my27DeltaUsd: 900 },
  'grand-highlander': { my27DeltaCad: 900, my27DeltaUsd: 700 },
  highlander: { my27DeltaCad: 4500, my27DeltaUsd: 3500 },
  'corolla-cross': { my27DeltaCad: 565, my27DeltaUsd: 450 },
  camry: { my27DeltaCad: 485, my27DeltaUsd: 385 },
  'land-cruiser': { my27DeltaCad: 1470, my27DeltaUsd: 1100 },
  prius: { my27DeltaCad: 375, my27DeltaUsd: 300 },
  sequoia: { my27DeltaCad: 5560, my27DeltaUsd: 4100 },
  tundra: { my27DeltaCad: 3835, my27DeltaUsd: 2800 },
  '4runner': { my27DeltaCad: 1650, my27DeltaUsd: 1220 },
  tacoma: { my27DeltaCad: 250, my27DeltaUsd: 180 },
};

export function getModelRolloverDeltas(modelSlug: string): RolloverDeltaConfig {
  const clean = modelSlug.toLowerCase().trim();
  return ROLLOVER_MODEL_DELTAS[clean] ?? { my27DeltaCad: 950, my27DeltaUsd: 700 };
}
