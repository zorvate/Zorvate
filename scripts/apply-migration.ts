import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Manually load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};

envContent.split(/\r?\n/).forEach(line => {
  const cleanLine = line.trim();
  if (!cleanLine || cleanLine.startsWith('#')) return;
  const parts = cleanLine.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    let val = parts.slice(1).join('=').trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    env[key] = val;
  }
});

const urlMatch = (env['NEXT_PUBLIC_SUPABASE_URL'] || '').match(/https:\/\/([^.]+)\.supabase\.co/);
const projectRef = urlMatch ? urlMatch[1] : '';
const password = env['SUPABASE_SERVICE_ROLE_KEY'] || '';

if (!projectRef || !password) {
  console.error('Error: Could not retrieve NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY from .env.local');
  process.exit(1);
}

// Supabase common regions list
const regions = [
  'ap-south-1', 'ap-southeast-1', 'ap-northeast-1', 'eu-central-1', 
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1', 
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'sa-east-1'
];

async function tryConnectAndMigrate() {
  const sqlPath = path.resolve(process.cwd(), 'supabase/migrations/011_add_live_url_to_portfolio.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const user = `postgres.${projectRef}`;
    
    console.log(`Testing connection to region ${region} (${host})...`);
    const client = new Client({
      host,
      port: 6543,
      user,
      password: password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`Successfully connected to database pooler: ${host}`);
      console.log('Applying migration...');
      const res = await client.query(sql);
      console.log('Migration completed successfully!', res);
      await client.end();
      return true;
    } catch (error: any) {
      console.log(`Failed region ${region}: ${error.message}`);
      try { await client.end(); } catch {}
    }
  }
  return false;
}

async function run() {
  const success = await tryConnectAndMigrate();
  if (success) {
    console.log('Migration step finished.');
    process.exit(0);
  } else {
    console.error('Migration failed: Could not connect to any database pooler.');
    process.exit(1);
  }
}

run();
