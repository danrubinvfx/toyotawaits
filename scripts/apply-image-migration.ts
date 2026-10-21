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
    console.log('Connected to PostgreSQL database.');

    const migrationFile = path.resolve(
      process.cwd(),
      'supabase/migrations/20261021000003_vehicle_images_and_inventory_cards.sql'
    );
    const sql = fs.readFileSync(migrationFile, 'utf-8');

    console.log('Executing migration: 20261021000003_vehicle_images_and_inventory_cards.sql...');
    await client.query(sql);

    // Verify columns on dealer_listings
    const res = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'dealer_listings' 
        AND column_name IN ('image_url', 'has_real_photo', 'image_source')
      ORDER BY column_name;
    `);

    console.log('\nVerified Created Columns on dealer_listings:');
    res.rows.forEach((r) =>
      console.log(`  - ${r.column_name} (${r.data_type}, default: ${r.column_default})`)
    );

    // Verify index
    const idxRes = await client.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'dealer_listings' 
        AND indexname = 'idx_dealer_inventory_has_real_photo';
    `);

    console.log('\nVerified Partial Index:');
    idxRes.rows.forEach((r) => console.log(`  - ${r.indexname}: ${r.indexdef}`));

    console.log('\nImage migration applied successfully!');
  } catch (err: any) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
