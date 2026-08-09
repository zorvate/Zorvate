const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.resolve(process.cwd(), '.env.local');
const env = {};

fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
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
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const projectMatch = url && url.match(/https:\/\/([^.]+)\.supabase\.co/);
const projectRef = projectMatch ? projectMatch[1] : null;

if (!url || !serviceKey || !projectRef) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or invalid URL in .env.local');
  process.exit(1);
}

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-central-2', 'eu-north-1',
  'ca-central-1', 'sa-east-1', 'me-central-1', 'af-south-1'
];

async function testHost(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const client = new Client({
    host,
    port: 6543,
    user: `postgres.${projectRef}`,
    password: serviceKey,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const res = await client.query("select column_name from information_schema.columns where table_schema='public' and table_name='portfolio_projects' order by ordinal_position");
    const count = await client.query('select count(*) as count from public.portfolio_projects');
    console.log(`SUCCESS region=${region} host=${host}`);
    console.log('portfolio_projects columns:', res.rows.map((row) => row.column_name));
    console.log('portfolio_projects count:', count.rows[0].count);
    await client.end();
    return true;
  } catch (error) {
    console.error(`FAILED region=${region} host=${host} -> ${error.message}`);
    try { await client.end(); } catch {};
    return false;
  }
}

(async () => {
  for (const region of regions) {
    const ok = await testHost(region);
    if (ok) {
      process.exit(0);
    }
  }
  console.error('No active region found.');
  process.exit(1);
})();
