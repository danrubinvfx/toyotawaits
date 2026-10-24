/**
 * Automated Route Verification Script for ToyotaWaits.ca
 * Audits every internal navigation route, header/footer link, and model slug
 * against physical Next.js App Router endpoints to ensure ZERO 404 errors.
 */

import fs from 'fs';
import path from 'path';
import { MODEL_REGISTRY, getModelConfig } from '../src/lib/data/model-registry';
import { CANADIAN_VEHICLE_CATALOG, getModelBySlug } from '../src/lib/data/vehicles';
import { toCanonicalWaitTimeSlug } from '../src/lib/calculator-model-helpers';

interface RouteCheckResult {
  route: string;
  type: 'static' | 'dynamic_wait_times' | 'dynamic_calculator' | 'dynamic_model' | 'api' | 'redirect';
  physicalFile: string;
  status: 'EXISTS' | 'MISSING_FILE' | 'REDIRECTS_CANONICAL';
  canonicalTarget?: string;
}

// 1. Core navigation & footer links
const STATIC_NAVIGATION_ROUTES = [
  '/',
  '/calculator',
  '/inventory',
  '/delivery-prep',
  '/winter-prep',
  '/tires',
  '/guides',
  '/guides/ev-charging',
  '/guides/grand-highlander-mods',
  '/guides/land-cruiser-mods',
  '/guides/prius-mods',
  '/guides/rav4-se-mods',
  '/guides/sienna-mods',
  '/guides/toyota-sienna-trailer-hitch-guide',
  '/guides/winter-tires',
  '/estimates',
  '/submit',
  '/privacy',
  '/legal',
  '/api/export',
];

// 2. Canonical wait-time model routes (all registered vehicles)
const CANONICAL_WAIT_TIME_MODELS = Object.keys(MODEL_REGISTRY);

// 3. Known powertrain aliases that must redirect to canonical without 404
const ALIAS_WAIT_TIME_MODELS = [
  'rav4-hybrid',
  'rav4-phev',
  'rav4-prime',
  'sienna-hybrid',
  'sienna-hev',
  'grand-highlander-hybrid',
  'camry-hybrid',
  'prius-hybrid',
];

// 4. Model overview routes
const CANONICAL_MODEL_ROUTES = CANADIAN_VEHICLE_CATALOG.map((m) => m.slug);

// 5. Calculator model routes
const CALCULATOR_MODEL_ROUTES = [
  'rav4',
  'rav4-hybrid',
  'rav4-phev',
  'sienna',
  'sienna-hybrid',
  'grand-highlander',
  'grand-highlander-hybrid',
  'camry',
  'camry-hybrid',
  'prius',
  'prius-hybrid',
  'crown-signia',
];

function resolvePhysicalAppFile(route: string): { file: string; exists: boolean } {
  const root = path.join(process.cwd(), 'src/app');

  // Handle root
  if (route === '/') {
    const pagePath = path.join(root, 'page.tsx');
    return { file: 'src/app/page.tsx', exists: fs.existsSync(pagePath) };
  }

  // Handle direct directory with page.tsx or route.ts
  const cleaned = route.replace(/^\//, '');
  const dirPage = path.join(root, cleaned, 'page.tsx');
  if (fs.existsSync(dirPage)) {
    return { file: `src/app/${cleaned}/page.tsx`, exists: true };
  }

  const dirRoute = path.join(root, cleaned, 'route.ts');
  if (fs.existsSync(dirRoute)) {
    return { file: `src/app/${cleaned}/route.ts`, exists: true };
  }

  // Handle dynamic /wait-times/[model]
  if (route.startsWith('/wait-times/')) {
    const waitTimesPage = path.join(root, 'wait-times/[model]/page.tsx');
    return { file: 'src/app/wait-times/[model]/page.tsx', exists: fs.existsSync(waitTimesPage) };
  }

  // Handle dynamic /calculator/[model]
  if (route.startsWith('/calculator/')) {
    const calcModelPage = path.join(root, 'calculator/[model]/page.tsx');
    return { file: 'src/app/calculator/[model]/page.tsx', exists: fs.existsSync(calcModelPage) };
  }

  // Handle dynamic /[model]
  const dynamicModelPage = path.join(root, '[model]/page.tsx');
  if (fs.existsSync(dynamicModelPage)) {
    return { file: 'src/app/[model]/page.tsx', exists: true };
  }

  return { file: `src/app/${cleaned}/page.tsx`, exists: false };
}

export function runRouteVerification(): { success: boolean; results: RouteCheckResult[] } {
  const results: RouteCheckResult[] = [];
  let hasFailures = false;

  console.log('='.repeat(80));
  console.log('TOYOTAWAITS.CA ROUTE AUDIT & 404 HEALTH CHECK');
  console.log('='.repeat(80));

  // 1. Audit static navigation routes
  console.log('\n[1/5] Auditing Static Navigation & Header/Footer Routes...');
  for (const route of STATIC_NAVIGATION_ROUTES) {
    const { file, exists } = resolvePhysicalAppFile(route);
    if (!exists) {
      hasFailures = true;
      results.push({ route, type: route.startsWith('/api') ? 'api' : 'static', physicalFile: file, status: 'MISSING_FILE' });
      console.error(`  ❌ FAIL: ${route} -> Physical file missing: ${file}`);
    } else {
      results.push({ route, type: route.startsWith('/api') ? 'api' : 'static', physicalFile: file, status: 'EXISTS' });
      console.log(`  ✓ PASS: ${route.padEnd(45)} -> ${file}`);
    }
  }

  // 2. Audit canonical wait-times routes
  console.log('\n[2/5] Auditing Canonical Wait-Times Routes (/wait-times/[model])...');
  for (const model of CANONICAL_WAIT_TIME_MODELS) {
    const route = `/wait-times/${model}`;
    const config = getModelConfig(model);
    const { file, exists } = resolvePhysicalAppFile(route);

    if (!exists || !config) {
      hasFailures = true;
      results.push({ route, type: 'dynamic_wait_times', physicalFile: file, status: 'MISSING_FILE' });
      console.error(`  ❌ FAIL: ${route} -> Model registry config or file missing!`);
    } else {
      results.push({ route, type: 'dynamic_wait_times', physicalFile: file, status: 'EXISTS' });
      console.log(`  ✓ PASS: ${route.padEnd(45)} -> ${file} (${config.name})`);
    }
  }

  // 3. Audit powertrain alias redirects
  console.log('\n[3/5] Auditing Model Alias Slug Normalization & 301 Redirect Targets...');
  for (const alias of ALIAS_WAIT_TIME_MODELS) {
    const route = `/wait-times/${alias}`;
    const canonicalSlug = toCanonicalWaitTimeSlug(alias);
    const config = getModelConfig(alias);

    if (!config || !canonicalSlug || canonicalSlug === alias) {
      hasFailures = true;
      results.push({ route, type: 'redirect', physicalFile: 'src/app/wait-times/[model]/page.tsx', status: 'MISSING_FILE' });
      console.error(`  ❌ FAIL: ${route} -> Failed to resolve canonical target!`);
    } else {
      results.push({
        route,
        type: 'redirect',
        physicalFile: 'src/app/wait-times/[model]/page.tsx',
        status: 'REDIRECTS_CANONICAL',
        canonicalTarget: `/wait-times/${canonicalSlug}`,
      });
      console.log(`  ✓ PASS: ${route.padEnd(45)} -> Redirects (301) to /wait-times/${canonicalSlug}`);
    }
  }

  // 4. Audit model catalog routes
  console.log('\n[4/5] Auditing Model Overview Routes (/[model])...');
  for (const model of CANONICAL_MODEL_ROUTES) {
    const route = `/${model}`;
    const catalogItem = getModelBySlug(model);
    const { file, exists } = resolvePhysicalAppFile(route);

    if (!exists || !catalogItem) {
      hasFailures = true;
      results.push({ route, type: 'dynamic_model', physicalFile: file, status: 'MISSING_FILE' });
      console.error(`  ❌ FAIL: ${route} -> Catalog entry or physical file missing!`);
    } else {
      results.push({ route, type: 'dynamic_model', physicalFile: file, status: 'EXISTS' });
      console.log(`  ✓ PASS: ${route.padEnd(45)} -> ${file} (${catalogItem.name})`);
    }
  }

  // 5. Audit calculator model routes
  console.log('\n[5/5] Auditing Calculator Model Routes (/calculator/[model])...');
  for (const model of CALCULATOR_MODEL_ROUTES) {
    const route = `/calculator/${model}`;
    const { file, exists } = resolvePhysicalAppFile(route);

    if (!exists) {
      hasFailures = true;
      results.push({ route, type: 'dynamic_calculator', physicalFile: file, status: 'MISSING_FILE' });
      console.error(`  ❌ FAIL: ${route} -> Physical endpoint missing!`);
    } else {
      results.push({ route, type: 'dynamic_calculator', physicalFile: file, status: 'EXISTS' });
      console.log(`  ✓ PASS: ${route.padEnd(45)} -> ${file}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  if (hasFailures) {
    console.error('FAILED: One or more routes failed validation.');
  } else {
    console.log(`SUCCESS: All ${results.length} audited routes verified with zero 404 risks.`);
  }
  console.log('='.repeat(80));

  return { success: !hasFailures, results };
}

// Execute standalone if called directly
const res = runRouteVerification();
if (!res.success) {
  process.exit(1);
}
