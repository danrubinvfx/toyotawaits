import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

// Automatically load .env.production, .env.local, or .env if present
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
        // ignore read errors
      }
    }
  }
}
loadEnv();

export async function applyAllMigrations(dbUrl?: string): Promise<{ success: boolean; applied: string[]; error?: string }> {
  const connectionString = dbUrl || process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes('placeholder') || connectionString.includes('127.0.0.1')) {
    return {
      success: false,
      applied: [],
      error: 'Valid remote DATABASE_URL is not set in environment or .env.production.',
    };
  }

  console.log('='.repeat(70));
  console.log('🔄 Connecting to PostgreSQL to apply schema migrations...');
  console.log('='.repeat(70));

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  const applied: string[] = [];

  try {
    await client.connect();
    console.log('✅ Connected to database successfully.');

    const migrationsDir = path.resolve(process.cwd(), 'supabase/migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`⚡ Applying: ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      await client.query(sql);
      applied.push(file);
      console.log(`   ✓ ${file} applied successfully.`);
    }

    console.log('='.repeat(70));
    console.log(`🎉 All ${applied.length} migrations applied successfully!`);
    console.log('='.repeat(70));
    return { success: true, applied };
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    return { success: false, applied, error: err.message };
  } finally {
    await client.end().catch(() => {});
  }
}

if (process.argv[1]?.includes('apply-migrations')) {
  applyAllMigrations()
    .then((res) => {
      if (!res.success) {
        console.error(res.error);
        process.exit(1);
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal error applying migrations:', err);
      process.exit(1);
    });
}
