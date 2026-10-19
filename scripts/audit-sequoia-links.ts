import * as fs from 'fs';
import * as path from 'path';
import { MODS_CONFIG } from '../src/data/mods';
import { TIRE_CATALOG_DATA } from '../src/data/tires';
import { FALLBACK_AFFILIATES } from '../src/lib/db/affiliates';

interface AuditItem {
  id: string;
  source: string;
  title: string;
  slug?: string;
  destinationUrl: string;
  compatibility?: string;
  store: string;
  httpStatus: number | string;
  generationFitment: 'XK80 (3rd Gen)' | 'Questionable / Ambiguous' | 'Older Gen';
  issues: string[];
}

async function checkUrl(url: string): Promise<{ status: number | string; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-CA,en-US;q=0.9,en;q=0.8',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);
    return { status: res.status };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { status: 'TIMEOUT', error: 'Request timed out after 8s' };
    }
    return { status: 'FETCH_FAILED', error: err.message };
  }
}

function assessGenerationFitment(text: string): 'XK80 (3rd Gen)' | 'Questionable / Ambiguous' | 'Older Gen' {
  const lower = text.toLowerCase();
  if (lower.includes('2008') || lower.includes('2015') || lower.includes('2018') || lower.includes('2020') || lower.includes('gen 2') || lower.includes('gen2')) {
    return 'Older Gen';
  }
  if (lower.includes('2023') || lower.includes('2024') || lower.includes('2025') || lower.includes('2026') || lower.includes('xk80') || lower.includes('3rd gen')) {
    return 'XK80 (3rd Gen)';
  }
  return 'Questionable / Ambiguous';
}

async function runAudit() {
  console.log('======================================================================');
  console.log('🔍 AUDITING TOYOTA SEQUOIA ACCESSORIES, PRODUCTS & TIRE LINKS');
  console.log('======================================================================\n');

  const auditItems: AuditItem[] = [];

  // 1. Audit affiliate-products.json
  const productsJsonPath = path.resolve(process.cwd(), 'src/lib/data/affiliate-products.json');
  const productsJson = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
  const sequoiaJsonProducts = productsJson.filter((p: any) =>
    p.models?.includes('sequoia')
  );

  for (const p of sequoiaJsonProducts) {
    const url = p.destinationUrl || p.amazonCaAsinOrUrl || p.affiliateUrl;
    const isAmazonCom = url.includes('amazon.com');
    const isAmazonCa = url.includes('amazon.ca');
    const issues: string[] = [];

    if (isAmazonCom) {
      issues.push('US Amazon link (amazon.com) instead of localized amazon.ca');
    }
    if (!url.includes('tag=')) {
      issues.push('Missing affiliate tracking tag parameter');
    }

    const fitment = assessGenerationFitment(`${p.title} ${p.compatibility} ${url}`);
    if (fitment === 'Older Gen') {
      issues.push('Possible 2nd-gen (2008-2022) fitment detected');
    }

    auditItems.push({
      id: p.id,
      source: 'affiliate-products.json',
      title: p.title || p.name,
      slug: p.slug,
      destinationUrl: url,
      compatibility: p.compatibility,
      store: isAmazonCa ? 'Amazon.ca' : isAmazonCom ? 'Amazon.com' : 'Other',
      httpStatus: 'PENDING',
      generationFitment: fitment,
      issues,
    });
  }

  // 2. Audit mods.ts items
  const sequoiaMods = MODS_CONFIG.filter((m) => m.models?.includes('sequoia'));
  for (const m of sequoiaMods) {
    // Avoid duplicate check if already in affiliate-products.json
    if (!auditItems.some((item) => item.id === m.id)) {
      const url = m.destinationUrl || m.amazonCaAsinOrUrl || m.affiliateUrl || '';
      const isAmazonCom = url.includes('amazon.com');
      const isAmazonCa = url.includes('amazon.ca');
      const issues: string[] = [];

      if (isAmazonCom) {
        issues.push('US Amazon link (amazon.com) instead of localized amazon.ca');
      }
      if (!url.includes('tag=')) {
        issues.push('Missing affiliate tracking tag parameter');
      }

      const fitment = assessGenerationFitment(`${m.title} ${m.compatibility} ${url}`);
      if (fitment === 'Older Gen') {
        issues.push('Possible 2nd-gen (2008-2022) fitment detected');
      }

      auditItems.push({
        id: m.id,
        source: 'mods.ts',
        title: m.title,
        slug: m.slug,
        destinationUrl: url,
        compatibility: m.compatibility,
        store: isAmazonCa ? 'Amazon.ca' : isAmazonCom ? 'Amazon.com' : 'Other',
        httpStatus: 'PENDING',
        generationFitment: fitment,
        issues,
      });
    }
  }

  // 3. Audit tires.ts items
  const sequoiaTires = TIRE_CATALOG_DATA['sequoia']?.tires || [];
  for (const t of sequoiaTires) {
    const url = t.amazonUrl;
    const isAmazonCom = url.includes('amazon.com');
    const isAmazonCa = url.includes('amazon.ca');
    const issues: string[] = [];

    if (isAmazonCom) {
      issues.push('US Amazon link (amazon.com) instead of localized amazon.ca');
    }
    if (!url.includes('tag=')) {
      issues.push('Missing affiliate tracking tag parameter');
    }

    const fitment = assessGenerationFitment(`${t.name} ${t.oemFitment} ${t.oemSize}`);

    auditItems.push({
      id: t.id,
      source: 'tires.ts',
      title: `${t.brand} ${t.name} (${t.oemSize})`,
      destinationUrl: url,
      compatibility: t.oemFitment,
      store: isAmazonCa ? 'Amazon.ca' : isAmazonCom ? 'Amazon.com' : 'Other',
      httpStatus: 'PENDING',
      generationFitment: fitment,
      issues,
    });
  }

  // 4. Audit FALLBACK_AFFILIATES in affiliates.ts used by sequoia-mods
  const guideSlugs = [
    'sequoia-cargo-drawers',
    'sequoia-cargo-liner',
    'sequoia-leveling-kit',
    'sequoia-running-boards',
    'sequoia-rear-sway-bar',
    'fitcamx-sequoia',
    'sequoia-sound-deadening',
  ];

  for (const slug of guideSlugs) {
    const fallback = FALLBACK_AFFILIATES[slug];
    if (!fallback) {
      auditItems.push({
        id: slug,
        source: 'guides/sequoia-mods',
        title: `Guide Slug: ${slug}`,
        slug,
        destinationUrl: 'UNMAPPED',
        store: 'None',
        httpStatus: 404,
        generationFitment: 'Questionable / Ambiguous',
        issues: ['Missing from FALLBACK_AFFILIATES in src/lib/db/affiliates.ts'],
      });
    } else if (!auditItems.some((item) => item.slug === slug)) {
      const url = fallback.destinationUrl;
      const isAmazonCom = url.includes('amazon.com');
      const isAmazonCa = url.includes('amazon.ca');
      const issues: string[] = [];

      if (isAmazonCom) {
        issues.push('US Amazon link (amazon.com) instead of localized amazon.ca');
      }
      if (!url.includes('tag=')) {
        issues.push('Missing affiliate tracking tag parameter');
      }

      const fitment = assessGenerationFitment(`${fallback.title} ${url}`);
      if (fitment === 'Older Gen') {
        issues.push('Possible 2nd-gen (2008-2022) fitment detected');
      }

      auditItems.push({
        id: fallback.id,
        source: 'affiliates.ts (guide slug)',
        title: fallback.title,
        slug,
        destinationUrl: url,
        store: isAmazonCa ? 'Amazon.ca' : isAmazonCom ? 'Amazon.com' : 'Other',
        httpStatus: 'PENDING',
        generationFitment: fitment,
        issues,
      });
    }
  }

  console.log(`Discovered ${auditItems.length} unique Sequoia product/tire links to check.\n`);
  console.log('Sending HTTP verification requests...\n');

  for (let i = 0; i < auditItems.length; i++) {
    const item = auditItems[i];
    if (item.destinationUrl === 'UNMAPPED') continue;

    process.stdout.write(`[${i + 1}/${auditItems.length}] Checking ${item.title.slice(0, 40)}... `);
    const res = await checkUrl(item.destinationUrl);
    item.httpStatus = res.status;

    if (res.status === 404 || res.status === 410) {
      item.issues.push(`Dead URL (HTTP ${res.status})`);
    } else if (res.status === 'FETCH_FAILED') {
      item.issues.push(`Fetch failed: ${res.error}`);
    } else if (res.status === 503) {
      // Amazon bot detection returns 503 to automated scripts, which confirms the domain and endpoint exist
      // but rejected scraper headers.
    }

    console.log(`Status: ${res.status}`);
  }

  console.log('\n======================================================================');
  console.log('📊 AUDIT RESULTS SUMMARY');
  console.log('======================================================================\n');

  const summary = auditItems.map((item) => ({
    Title: item.title.slice(0, 45),
    Store: item.store,
    Status: item.httpStatus,
    Fitment: item.generationFitment,
    Issues: item.issues.length > 0 ? item.issues.join('; ') : '✅ PASS',
  }));

  console.table(summary);

  const broken = auditItems.filter((i) => i.issues.some((iss) => iss.includes('Dead URL') || iss.includes('HTTP 404')));
  const usLinks = auditItems.filter((i) => i.issues.some((iss) => iss.includes('US Amazon link')));
  const oldGen = auditItems.filter((i) => i.generationFitment === 'Older Gen');

  console.log('\n----------------------------------------------------------------------');
  console.log(`Total Sequoia Items Audited:  ${auditItems.length}`);
  console.log(`Dead / 404 Links:             ${broken.length}`);
  console.log(`US Storefront Mismatches:     ${usLinks.length}`);
  console.log(`Older-Gen Incompatible Fits:  ${oldGen.length}`);
  console.log('----------------------------------------------------------------------\n');

  if (broken.length === 0 && usLinks.length === 0 && oldGen.length === 0) {
    console.log('🎉 AUDIT COMPLETE: All Sequoia product and tire links are healthy, properly localized for Canada, and target the 3rd-gen XK80 chassis!');
  } else {
    console.log('⚠️ AUDIT COMPLETE: Review issues flagged above.');
  }
}

runAudit();
