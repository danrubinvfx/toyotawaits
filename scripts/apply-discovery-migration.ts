import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

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

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not found in environment.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database.');

    const migrationFile = path.resolve(
      process.cwd(),
      'supabase/migrations/20261017_inventory_discovery_schema.sql'
    );
    const sql = fs.readFileSync(migrationFile, 'utf-8');

    console.log(`Executing migration: 20261017_inventory_discovery_schema.sql...`);
    await client.query(sql);

    // Record in _schema_migrations if table exists
    try {
      await client.query(
        `INSERT INTO _schema_migrations (version, applied_at)
         VALUES ('20261017_inventory_discovery_schema.sql', NOW())
         ON CONFLICT (version) DO NOTHING;`
      );
    } catch {
      // ignore
    }

    // Verify created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('sources', 'dealers', 'vehicles', 'dealer_listings', 'observations', 'status_events', 'alert_outbox', 'source_health_logs')
      ORDER BY table_name;
    `);

    console.log('\nVerified Created Discovery Tables:');
    res.rows.forEach((r) => console.log(`  - ${r.table_name}`));

    console.log('\n✅ Discovery schema migration applied successfully!');
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
