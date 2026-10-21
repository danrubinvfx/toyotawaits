import dns from 'dns';
import { PRODUCTS } from '../lib/products';
import { FALLBACK_AFFILIATES } from '../src/lib/db/affiliates';

dns.setDefaultResultOrder('ipv4first');

// SET YOUR EXPECTED ASSOCIATE IDS:
const EXPECTED_CA_TAG = 'toyotawaits-20'; // Amazon.ca Associates Tag
const EXPECTED_US_TAG = 'toyotawaits-20'; // Amazon.com Associates Tag

interface AuditEntry {
  title: string;
  domain: string;
  asin: string;
  tag: string;
  tagStatus: 'CORRECT' | 'MISMATCH / MISSING';
  httpStatus: number | string;
  issue: string;
}

async function auditAmazonLinks() {
  console.log(`Starting Amazon affiliate audit...\n`);
  const results: AuditEntry[] = [];

  // Combine PRODUCTS catalog and FALLBACK_AFFILIATES (deduplicated by slug)
  const seenSlugs = new Set<string>();
  const allItemsToAudit: any[] = [];

  for (const item of PRODUCTS as any[]) {
    if (item.slug) seenSlugs.add(item.slug);
    allItemsToAudit.push(item);
  }

  for (const record of Object.values(FALLBACK_AFFILIATES)) {
    if (!seenSlugs.has(record.slug)) {
      seenSlugs.add(record.slug);
      allItemsToAudit.push(record);
    }
  }

  for (const item of allItemsToAudit) {
    const rawUrl =
      [item.destinationUrl, item.storeUrl, item.affiliateUrl, item.url].find(
        (u) => typeof u === 'string' && u.includes('amazon.')
      ) ||
      item.affiliateUrl ||
      item.url ||
      '';
    if (!rawUrl.includes('amazon.')) continue;

    let urlObj: URL;
    try {
      urlObj = new URL(rawUrl);
    } catch {
      results.push({
        title: item.name || item.title || 'Unknown',
        domain: 'INVALID_URL',
        asin: 'N/A',
        tag: 'N/A',
        tagStatus: 'MISMATCH / MISSING',
        httpStatus: 'ERR',
        issue: 'Malformed URL string',
      });
      continue;
    }

    const domain = urlObj.hostname.replace('www.', '');
    const currentTag = urlObj.searchParams.get('tag') || 'MISSING';

    // Extract ASIN from path (/dp/B0... or /gp/product/B0...) or fallback to item.asin / search query
    const asinMatch = urlObj.pathname.match(/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
    const searchQuery = urlObj.searchParams.get('k');
    const asin = asinMatch
      ? asinMatch[1]
      : item.asin || (searchQuery ? `SEARCH:${searchQuery.slice(0, 12)}` : 'UNKNOWN_ASIN');

    // Check Tag
    const expectedTag = domain.endsWith('.ca') ? EXPECTED_CA_TAG : EXPECTED_US_TAG;
    const tagStatus: 'CORRECT' | 'MISMATCH / MISSING' =
      currentTag === expectedTag ? 'CORRECT' : 'MISMATCH / MISSING';

    let issue = '';
    if (currentTag === 'MISSING') issue += 'Missing "tag" query parameter. ';
    else if (currentTag !== expectedTag)
      issue += `Wrong tag: found "${currentTag}", expected "${expectedTag}". `;

    if (domain === 'amazon.com' && !domain.endsWith('.ca')) {
      issue += 'Warning: US Amazon link without Canadian localization. ';
    }

    // Ping URL for 404 / Availability
    let httpStatus: number | string = 'UNKNOWN';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(rawUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-CA,en;q=0.9',
        },
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      httpStatus = res.status;
      if (res.status === 404) {
        issue += `HTTP Error ${res.status} (Broken/Inactive ASIN). `;
      } else if (res.status >= 400 && res.status !== 503 && res.status !== 405) {
        issue += `HTTP Error ${res.status} (Broken/Inactive ASIN). `;
      }
    } catch (err: any) {
      httpStatus = 'FAILED';
      issue += `Network timeout or blocked request: ${err.message}. `;
    }

    results.push({
      title: (item.name || item.title || 'Untitled').slice(0, 30),
      domain,
      asin,
      tag: currentTag,
      tagStatus,
      httpStatus,
      issue: issue.trim() || 'OK',
    });
  }

  console.table(results);

  const errors = results.filter((r) => r.tagStatus !== 'CORRECT' || r.issue !== 'OK');
  if (errors.length > 0) {
    console.warn(`\nFound ${errors.length} links needing attention.`);
  } else {
    console.log(`\nAll Amazon links and Associate Tags verified clean!`);
  }
}

auditAmazonLinks();
