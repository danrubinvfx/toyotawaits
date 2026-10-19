import * as fs from 'fs';
import * as path from 'path';
import { createServerClient } from '../../src/lib/supabase/server';

function loadEnv() {
  const envFiles = ['.env.production', '.env.local', '.env'];
  for (const f of envFiles) {
    const full = path.resolve(process.cwd(), f);
    if (fs.existsSync(full)) {
      try {
        const text = fs.readFileSync(full, 'utf-8');
        for (const line of text.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const k = trimmed.slice(0, idx).trim();
            let v = trimmed.slice(idx + 1).trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
              v = v.slice(1, -1);
            }
            if (!process.env[k]) {
              process.env[k] = v;
            }
          }
        }
      } catch {
        // ignore
      }
    }
  }
}
loadEnv();

async function getCount(supabase: any, tableName: string): Promise<number | null> {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });
  if (error) {
    return null;
  }
  return count ?? 0;
}

async function main() {
  const supabase = createServerClient();

  const candidateTables = [
    // Migration 20261017 schema tables
    'sources',
    'dealers',
    'vehicles',
    'dealer_listings',
    'observations',
    'status_events',
    'alert_outbox',
    'source_health_logs',
    // Discovery-prefixed table names
    'discovery_sources',
    'discovery_runs',
    'discovery_vehicles',
    'discovery_listings',
    'discovery_listing_observations',
    'discovery_listing_status_history',
    'discovery_outbox',
  ];

  console.log('='.repeat(65));
  console.log('Supabase Discovery Tables Record Counts');
  console.log('='.repeat(65));

  for (const table of candidateTables) {
    const count = await getCount(supabase, table);
    if (count !== null) {
      console.log(`  ✓ ${table.padEnd(35)} : ${count} rows`);
    }
  }

  // Check statuses in dealer_listings
  const { data: dlList } = await supabase.from('dealer_listings').select('current_status');
  if (dlList) {
    const counts: Record<string, number> = {};
    for (const item of dlList) {
      counts[item.current_status] = (counts[item.current_status] || 0) + 1;
    }
    console.log('\ndealer_listings current_status distribution:');
    for (const [st, c] of Object.entries(counts)) {
      console.log(`  - ${st}: ${c}`);
    }
  }

  // Check statuses in discovery_listings if any
  const { data: discList } = await supabase.from('discovery_listings').select('status');
  if (discList && discList.length > 0) {
    const counts: Record<string, number> = {};
    for (const item of discList) {
      counts[item.status] = (counts[item.status] || 0) + 1;
    }
    console.log('\ndiscovery_listings status distribution:');
    for (const [st, c] of Object.entries(counts)) {
      console.log(`  - ${st}: ${c}`);
    }
  }

  console.log('='.repeat(65));
  process.exit(0);
}

main().catch((err) => {
  console.error('Error querying table counts:', err);
  process.exit(1);
});
