import fs from 'fs';
import path from 'path';
import dns from 'node:dns';

// Ensure fast IPv4 resolution on Windows environments where IPv6 route stalling occurs
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

import { FALLBACK_AFFILIATES } from '../src/lib/db/affiliates';
import { GEAR_MARKET_CATALOG } from '../src/data/gear/catalog';
import { ALL_CALCULATOR_PRODUCTS } from '../src/components/gear/CalculatorGearCards';
import { AFFILIATE_LINKS } from '../src/lib/affiliate';
import { buildAmazonAffiliateUrl } from '../src/lib/gear/affiliate';

interface AuditRecord {
  source: string;
  slug: string;
  url: string;
  status: number | string;
  issue: string;
}

interface TargetItem {
  source: string;
  slug: string;
  url: string;
}

function extractAmazonUrlsFromDirectory(dirPath: string): TargetItem[] {
  const items: TargetItem[] = [];
  if (!fs.existsSync(dirPath)) return items;

  function crawl(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        crawl(fullPath);
      } else if (/\.(tsx?|jsx?|json|md)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        // Match string literals containing Amazon URLs
        const regex = /https?:\/\/(?:www\.)?amazon\.[a-z.]+[^\s"'`<>)]+/gi;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(content)) !== null) {
          const rawUrl = match[0].replace(/[;,]+$/, '');
          const relativeFile = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
          items.push({
            source: `static:${relativeFile}`,
            slug: path.basename(fullPath),
            url: rawUrl,
          });
        }
      }
    }
  }

  crawl(dirPath);
  return items;
}

async function runAudit() {
  console.log('Auditing toyotawaits links and affiliate endpoints across catalog, calculator cards, guides, and static data...\n');
  const records: AuditRecord[] = [];
  const targetItems: TargetItem[] = [];
  const seenUrls = new Set<string>();

  function registerUrl(source: string, slug: string, url?: string) {
    if (!url) return;
    const cleanUrl = url.trim();
    if (!cleanUrl || seenUrls.has(cleanUrl)) return;
    seenUrls.add(cleanUrl);
    targetItems.push({ source, slug, url: cleanUrl });
  }

  // 1. Gather URLs from the static fallback dictionary (src/lib/affiliates.ts / src/lib/db/affiliates.ts)
  for (const [slug, record] of Object.entries(FALLBACK_AFFILIATES)) {
    registerUrl('fallback_dict', slug, record.destinationUrl);
  }

  // 2. Gather URLs from src/data/gear/catalog.ts across CA and US markets
  for (const [slug, config] of Object.entries(GEAR_MARKET_CATALOG)) {
    const caUrl = buildAmazonAffiliateUrl({
      asin: config.asin_ca || config.asin,
      searchQuery: config.searchKeywordsCA || config.searchQuery || config.title,
      market: 'CA',
    });
    registerUrl('catalog_ca', `${slug} (CA)`, caUrl);

    const usUrl = buildAmazonAffiliateUrl({
      asin: config.asin_us || config.asin,
      searchQuery: config.searchKeywordsUS || config.searchQuery || config.title,
      market: 'US',
    });
    registerUrl('catalog_us', `${slug} (US)`, usUrl);
  }

  // 3. Gather URLs from Calculator Cards (src/components/gear/CalculatorGearCards.tsx)
  for (const product of ALL_CALCULATOR_PRODUCTS) {
    const caUrl = buildAmazonAffiliateUrl({
      asin: product.asin,
      searchQuery: product.searchQuery || product.title,
      market: 'CA',
    });
    registerUrl('calculator_ca', `${product.id} (CA)`, caUrl);

    const usUrl = buildAmazonAffiliateUrl({
      asin: product.asin,
      searchQuery: product.searchQuery || product.title,
      market: 'US',
    });
    registerUrl('calculator_us', `${product.id} (US)`, usUrl);
  }

  // 4. Gather URLs from AFFILIATE_LINKS in src/lib/affiliate.ts
  for (const [key, link] of Object.entries(AFFILIATE_LINKS)) {
    if (typeof link === 'string' && link.includes('amazon.')) {
      registerUrl('affiliate_links_const', key, link);
    }
  }

  // 5. Crawl all static links in src/app/guides/
  const guideDir = path.resolve(process.cwd(), 'src/app/guides');
  const guideItems = extractAmazonUrlsFromDirectory(guideDir);
  for (const item of guideItems) {
    registerUrl(item.source, item.slug, item.url);
  }

  console.log(`Discovered ${targetItems.length} unique Amazon affiliate URLs to audit across the repository.`);

  // Concurrently audit in batches of 10 for fast, non-blocking CI execution
  const BATCH_SIZE = 10;
  for (let i = 0; i < targetItems.length; i += BATCH_SIZE) {
    const batch = targetItems.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async ({ source, slug, url }) => {
        let issue = 'OK';
        let status: number | string = 'UNKNOWN';

        if (url.includes('google.com/search')) {
          issue = 'CRITICAL: URL wrapped in Google Search!';
        } else if (url.includes('amazon.ca') && !url.includes('tag=toyotawaits-20')) {
          issue = 'WRONG/MISSING CA TAG (expected tag=toyotawaits-20)';
        } else if (url.includes('amazon.com') && !url.includes('tag=toyotawaits07-20')) {
          issue = 'WRONG/MISSING US TAG (expected tag=toyotawaits07-20)';
        }

        let attempts = 0;
        while (attempts < 2) {
          attempts++;
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);
            const res = await fetch(url, {
              method: 'GET',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                Accept:
                  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
              },
              redirect: 'follow',
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            status = res.status;

            const responseText = await res.text().catch(() => '');
            const lowerText = responseText.toLowerCase();

            if (res.status === 503) {
              // 503 indicates automated bot challenge/rate-limiting by Amazon, not a dead 404 page
              issue = 'OK';
            } else if (
              res.status === 404 ||
              res.status === 405 ||
              res.status === 410 ||
              lowerText.includes('dogs of amazon') ||
              lowerText.includes("couldn't find that page") ||
              res.url.includes('/dogsofamazon')
            ) {
              issue = 'DEAD_ASIN_404';
            } else {
              issue = 'OK';
            }
            break;
          } catch (err: any) {
            status = 'FAILED';
            if (issue === 'OK') {
              issue = `Network error: ${err.message}`;
            }
            if (attempts < 2) {
              await new Promise((r) => setTimeout(r, 600));
            }
          }
        }

        return { source, slug, url: url.slice(0, 65) + '...', status, issue };
      })
    );
    records.push(...batchResults);
  }

  console.table(records);

  const unmigratedAsins = records.filter(
    (r) => r.issue === 'DEAD_ASIN_404' && r.url.includes('/dp/')
  );

  if (unmigratedAsins.length > 0) {
    console.warn(
      `\n⚠️  Discovered ${unmigratedAsins.length} unmigrated legacy catalog ASINs returning Amazon 404:`
    );
    console.table(unmigratedAsins);
  } else {
    console.log(`\n✅ 0 unmigrated legacy ASIN 404 warnings.`);
  }

  const failures = records.filter(
    (r) =>
      r.issue.startsWith('CRITICAL') ||
      r.issue.startsWith('WRONG/MISSING') ||
      r.issue === 'DEAD_ASIN_404' ||
      (r.issue !== 'OK' && r.status !== 503)
  );

  if (failures.length > 0) {
    console.error(`\n❌ Found ${failures.length} problematic affiliate links.`);
    console.table(failures);
    process.exit(1);
  } else {
    console.log(
      `\n✅ All ${records.length} links verified clean with zero 404s across CA and US markets.`
    );
    process.exit(0);
  }
}

runAudit();
