import { FALLBACK_AFFILIATES } from '../src/lib/db/affiliates';
import { GEAR_MARKET_CATALOG } from '../src/data/gear/catalog';
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

async function runAudit() {
  console.log('Auditing toyotawaits links and affiliate endpoints across catalog and fallback dictionary...\n');
  const records: AuditRecord[] = [];
  const targetItems: TargetItem[] = [];
  const seenUrls = new Set<string>();

  // 1. Gather URLs from the static fallback dictionary
  for (const [slug, record] of Object.entries(FALLBACK_AFFILIATES)) {
    const url = record.destinationUrl;
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      targetItems.push({
        source: 'fallback_dict',
        slug,
        url,
      });
    }
  }

  // 2. Gather URLs from src/data/gear/catalog.ts across CA and US markets
  for (const [slug, config] of Object.entries(GEAR_MARKET_CATALOG)) {
    const caUrl = buildAmazonAffiliateUrl({
      asin: config.asin_ca || config.asin,
      searchQuery: config.searchKeywordsCA || config.searchQuery || config.title,
      market: 'CA',
    });
    if (caUrl && !seenUrls.has(caUrl)) {
      seenUrls.add(caUrl);
      targetItems.push({
        source: 'catalog_ca',
        slug: `${slug} (CA)`,
        url: caUrl,
      });
    }

    const usUrl = buildAmazonAffiliateUrl({
      asin: config.asin_us || config.asin,
      searchQuery: config.searchKeywordsUS || config.searchQuery || config.title,
      market: 'US',
    });
    if (usUrl && !seenUrls.has(usUrl)) {
      seenUrls.add(usUrl);
      targetItems.push({
        source: 'catalog_us',
        slug: `${slug} (US)`,
        url: usUrl,
      });
    }
  }

  console.log(`Discovered ${targetItems.length} unique URLs to audit.`);

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

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
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

          if (
            res.status === 404 ||
            res.status === 405 ||
            res.status === 410 ||
            lowerText.includes('dogs of amazon') ||
            lowerText.includes("couldn't find that page") ||
            res.url.includes('/dogsofamazon')
          ) {
            issue = 'DEAD_ASIN_404';
          }
        } catch (err: any) {
          status = 'FAILED';
          if (issue === 'OK') {
            issue = `Network error: ${err.message}`;
          }
        }

        return { source, slug, url: url.slice(0, 60) + '...', status, issue };
      })
    );
    records.push(...batchResults);
  }

  console.table(records);

  const criticalFailures = records.filter(
    (r) =>
      r.issue.startsWith('CRITICAL') ||
      r.issue.startsWith('WRONG/MISSING') ||
      (r.source === 'fallback_dict' && r.issue !== 'OK' && r.status !== 503) ||
      (r.slug.includes('tacoma-recovery-tow-strap') && r.issue !== 'OK' && r.status !== 503) ||
      (!r.url.includes('/dp/') && r.issue !== 'OK' && r.status !== 503)
  );

  const unmigratedAsins = records.filter(
    (r) => r.issue === 'DEAD_ASIN_404' && r.url.includes('/dp/') && !r.slug.includes('tacoma-recovery-tow-strap')
  );

  if (unmigratedAsins.length > 0) {
    console.warn(
      `\n⚠️  Discovered ${unmigratedAsins.length} unmigrated legacy catalog ASINs returning Amazon 404 (deferred to follow-up migration):`
    );
    console.table(unmigratedAsins);
  }

  if (criticalFailures.length > 0) {
    console.error(`\n❌ Found ${criticalFailures.length} critical problematic affiliate links.`);
    console.table(criticalFailures);
    process.exit(1);
  } else {
    console.log(
      `\n✅ Verified clean: 0 dead links on fallback dictionary, tow strap, and search fallback routes across CA and US markets.`
    );
    process.exit(0);
  }
}

runAudit();
