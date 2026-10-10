import { Client } from 'pg';

async function cleanupDuplicates() {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://postgres.gcvdxaguvawkvufqwnwt:L0renzoTheC%40t%212@aws-1-us-west-2.pooler.supabase.com:5432/postgres';

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL.');

    // 1. Check total rows
    const initialCount = await client.query('SELECT count(*) FROM submissions;');
    console.log(`Initial submissions count in database: ${initialCount.rows[0].count}`);

    // 2. Find any duplicate rows based on (model_id, powertrain_id, trim_id, province, order_date)
    // Live user submission has ID not matching a1000... or b1000...
    const partitionQuery = `
      SELECT id, model_id, powertrain_id, trim_id, province, order_date, created_at, notes,
             ROW_NUMBER() OVER (
               PARTITION BY model_id, powertrain_id, trim_id, province, order_date
               ORDER BY created_at ASC
             ) as rn
      FROM submissions;
    `;
    const res = await client.query(partitionQuery);
    const duplicates = res.rows.filter((r) => Number(r.rn) > 1);

    console.log(`Duplicates detected: ${duplicates.length}`);

    if (duplicates.length > 0) {
      const idsToDelete = duplicates.map((d) => d.id);
      console.log('Duplicate IDs to remove:', idsToDelete);

      const delRes = await client.query(
        'DELETE FROM submissions WHERE id = ANY($1::uuid[]) AND id NOT IN (SELECT id FROM submissions WHERE id NOT LIKE \'a1000%\' AND id NOT LIKE \'b1000%\')',
        [idsToDelete]
      );
      console.log(`Deleted ${delRes.rowCount} duplicate rows.`);
    }

    // 3. Confirm live user submission
    const liveSubmission = await client.query(`
      SELECT s.id, m.name as model, s.province, s.status, s.order_date, s.created_at
      FROM submissions s
      LEFT JOIN vehicle_models m ON s.model_id = m.id
      WHERE s.id::text NOT LIKE 'a1000%' AND s.id::text NOT LIKE 'b1000%'
      ORDER BY s.created_at DESC;
    `);

    console.log(`Live user submissions found: ${liveSubmission.rows.length}`);
    if (liveSubmission.rows.length > 0) {
      console.log('Live User Submission:', liveSubmission.rows[0]);
    }

    // 4. Final count
    const finalCount = await client.query('SELECT count(*) FROM submissions;');
    console.log(`Final submissions count in database: ${finalCount.rows[0].count}`);

  } catch (err: any) {
    console.error('Error during duplicate cleanup:', err.message);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

cleanupDuplicates();
