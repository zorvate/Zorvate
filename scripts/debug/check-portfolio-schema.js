const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.resolve(process.cwd(), '.env.local');
const env = {};

fs.readFileSync(envPath, 'utf8')
  .split(/\r?\n/)
  .forEach((line) => {
    const clean = line.trim();
    if (!clean || clean.startsWith('#')) return;
    const parts = line.split('=');
    const key = parts.shift().trim();
    let val = parts.join('=').trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  });

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const match = url && url.match(/https:\/\/([^.]+)\.supabase\.co/);
const projectRef = match ? match[1] : null;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!projectRef || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const client = new Client({
  host: `db.${projectRef}.supabase.co`,
  port: 6543,
  user: 'postgres',
  password: key,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await client.connect();
    const cols = await client.query(
      "select column_name, data_type from information_schema.columns where table_schema='public' and table_name='portfolio_projects' order by ordinal_position"
    );
    console.log('portfolio_projects columns:');
    cols.rows.forEach((row) => console.log(`- ${row.column_name}: ${row.data_type}`));

    const count = await client.query('select count(*) as count from public.portfolio_projects');
    console.log('row count:', count.rows[0].count);
  } catch (error) {
    console.error('ERROR', error.message || error);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
