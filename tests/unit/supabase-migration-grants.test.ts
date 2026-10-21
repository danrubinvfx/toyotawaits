import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Supabase Migration Standards: Data API Grants (Post-October 30 Rules)', () => {
  const migrationsDir = path.resolve(process.cwd(), 'supabase/migrations');
  const sqlFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));

  it('contains migration files in supabase/migrations/', () => {
    expect(sqlFiles.length).toBeGreaterThan(0);
  });

  it('ensures 20261017_inventory_discovery_schema.sql includes explicit GRANTs alongside RLS', () => {
    const file = path.join(migrationsDir, '20261017_inventory_discovery_schema.sql');
    const content = fs.readFileSync(file, 'utf-8');

    // Expected tables created in this schema
    const tables = [
      'sources',
      'dealers',
      'vehicles',
      'dealer_listings',
      'observations',
      'status_events',
      'source_health_logs',
    ];

    for (const table of tables) {
      expect(content).toMatch(
        new RegExp(`GRANT\\s+SELECT\\s+ON\\s+TABLE\\s+public\\.${table}\\s+TO\\s+anon,\\s*authenticated;`, 'i')
      );
      expect(content).toMatch(
        new RegExp(`GRANT\\s+ALL\\s+ON\\s+TABLE\\s+public\\.${table}\\s+TO\\s+service_role;`, 'i')
      );
    }

    // alert_outbox is worker/service role only
    expect(content).toMatch(/GRANT\s+ALL\s+ON\s+TABLE\s+public\.alert_outbox\s+TO\s+service_role;/i);
  });

  it('ensures 20261020000001_telemetry_affiliate_clicks.sql includes explicit GRANTs for client-side inserts', () => {
    const file = path.join(migrationsDir, '20261020000001_telemetry_affiliate_clicks.sql');
    const content = fs.readFileSync(file, 'utf-8');

    expect(content).toMatch(
      /GRANT\s+SELECT,\s*INSERT\s+ON\s+TABLE\s+public\.telemetry_affiliate_clicks\s+TO\s+anon,\s*authenticated;/i
    );
    expect(content).toMatch(
      /GRANT\s+ALL\s+ON\s+TABLE\s+public\.telemetry_affiliate_clicks\s+TO\s+service_role;/i
    );
  });

  it('ensures 20261010000002_granular_stages_and_notifications.sql includes explicit GRANTs for notifications', () => {
    const file = path.join(migrationsDir, '20261010000002_granular_stages_and_notifications.sql');
    const content = fs.readFileSync(file, 'utf-8');

    expect(content).toMatch(
      /GRANT\s+INSERT\s+ON\s+TABLE\s+public\.notification_requests\s+TO\s+anon,\s*authenticated;/i
    );
    expect(content).toMatch(
      /GRANT\s+ALL\s+ON\s+TABLE\s+public\.notification_requests\s+TO\s+service_role;/i
    );
  });

  it('ensures comprehensive catch-up migration 20261021000004_grant_data_api_permissions.sql covers all public tables', () => {
    const file = path.join(migrationsDir, '20261021000004_grant_data_api_permissions.sql');
    expect(fs.existsSync(file)).toBe(true);

    const content = fs.readFileSync(file, 'utf-8');

    const expectedTables = [
      'vehicle_models',
      'vehicle_powertrains',
      'vehicle_trims',
      'submissions',
      'affiliate_links',
      'notification_requests',
      'sources',
      'dealers',
      'vehicles',
      'dealer_listings',
      'observations',
      'status_events',
      'alert_outbox',
      'source_health_logs',
      'telemetry_affiliate_clicks',
    ];

    for (const table of expectedTables) {
      expect(content).toContain(`public.${table}`);
      expect(content).toMatch(
        new RegExp(`GRANT\\s+(ALL|SELECT|INSERT).*ON\\s+TABLE\\s+public\\.${table}`, 'i')
      );
    }

    // Default privileges for future tables
    expect(content).toContain('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;');
    expect(content).toContain('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;');
  });

  it('verifies every CREATE TABLE statement across all migrations is paired with corresponding GRANT statements', () => {
    // Combine all SQL files to evaluate the complete schema definition
    const combinedSql = sqlFiles
      .map((f) => fs.readFileSync(path.join(migrationsDir, f), 'utf-8'))
      .join('\n\n');

    // Extract all created table names
    const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)/gi;
    const createdTables = new Set<string>();

    let match: RegExpExecArray | null;
    while ((match = tableRegex.exec(combinedSql)) !== null) {
      const tableName = match[1].toLowerCase();
      // Ignore migration tracking tables
      if (tableName === '_schema_migrations') continue;
      createdTables.add(tableName);
    }

    expect(createdTables.size).toBeGreaterThan(0);

    for (const table of createdTables) {
      // Each table must have at least one explicit GRANT in the migration history
      const hasGrant =
        new RegExp(`GRANT\\s+[A-Z,\\s]+\\s+ON\\s+(?:TABLE\\s+)?(?:public\\.)?${table}\\s+TO`, 'i').test(combinedSql);

      expect(hasGrant, `Table "${table}" must have explicit GRANT statements`).toBe(true);
    }
  });

  it('documents migration standards in docs/database-migration-standards.md and AGENTS.md', () => {
    const docsFile = path.resolve(process.cwd(), 'docs/database-migration-standards.md');
    expect(fs.existsSync(docsFile)).toBe(true);

    const docsContent = fs.readFileSync(docsFile, 'utf-8');
    expect(docsContent).toContain('October 30');
    expect(docsContent).toContain('GRANT SELECT ON TABLE public.<table_name> TO anon, authenticated;');
    expect(docsContent).toContain('GRANT ALL ON TABLE public.<table_name> TO service_role;');

    const agentsFile = path.resolve(process.cwd(), 'AGENTS.md');
    const agentsContent = fs.readFileSync(agentsFile, 'utf-8');
    expect(agentsContent).toContain('Supabase Migration Standards: Mandatory Data API Grants');
    expect(agentsContent).toContain('GRANT ALL ON TABLE public.<table_name> TO service_role;');
  });

  it('ensures 20261021000005_grant_submissions_update.sql grants UPDATE on submissions and configures RLS policy', () => {
    const file = path.join(migrationsDir, '20261021000005_grant_submissions_update.sql');
    expect(fs.existsSync(file)).toBe(true);

    const content = fs.readFileSync(file, 'utf-8');
    expect(content).toMatch(/GRANT\s+UPDATE\s+ON\s+TABLE\s+public\.submissions\s+TO\s+anon,\s*authenticated;/i);
    expect(content).toContain('Enable update for users with matching id or key');
    expect(content).toContain('FOR UPDATE');
    expect(content).toContain('TO anon, authenticated');
  });
});

