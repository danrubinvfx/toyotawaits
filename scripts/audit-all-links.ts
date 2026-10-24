import { FALLBACK_AFFILIATES } from '../src/lib/affiliates';

interface AuditRecord {
  slug: string;
  url: string;
  status: number | string;
  issue: string;
}

async function runAudit() {
  console.log('Auditing toyotawaits links and affiliate endpoints...\n');
  const records: AuditRecord[] = [];
  const entries = Object.entries(FALLBACK_AFFILIATES);

  // Concurrently audit in batches of 10 for fast CI execution
  const BATCH_SIZE = 10;
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async ([slug, rawUrl]) => {
        const url =
          typeof rawUrl === 'string'
            ? rawUrl
            : (rawUrl as any)?.destinationUrl
            ? String((rawUrl as any).destinationUrl)
            : String(rawUrl);

        let issue = 'OK';
        let status: number | string = 'UNKNOWN';

        if (url.includes('google.com/search')) {
          issue = 'CRITICAL: URL wrapped in Google Search!';
        } else if (url.includes('amazon.ca') && !url.includes('tag=toyotawaits-20')) {
          issue = 'WRONG/MISSING CA TAG (expected toyotawaits-20)';
        } else if (url.includes('amazon.com') && !url.includes('tag=toyotawaits07-20')) {
          issue = 'WRONG/MISSING US TAG (expected toyotawaits07-20)';
        }

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(url, {
            method: 'HEAD',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
            redirect: 'follow',
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          status = res.status;
          if (res.status === 404) {
            issue = 'DEAD 404 (ASIN retired or missing route)';
          }
        } catch (err: any) {
          status = 'FAILED';
          if (issue !== 'OK') {
            // Keep specific formatting issue if already flagged
          } else {
            issue = `Network error: ${err.message}`;
          }
        }

        return { slug, url: url.slice(0, 60) + '...', status, issue };
      })
    );
    records.push(...batchResults);
  }

  console.table(records);

  const failures = records.filter((r) => r.issue !== 'OK' && r.status !== 503);
  if (failures.length > 0) {
    console.error(`\n❌ Found ${failures.length} problematic affiliate links.`);
    process.exit(1);
  } else {
    console.log('\n✅ All links verified clean.');
  }
}

runAudit();
