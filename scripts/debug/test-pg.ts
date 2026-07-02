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

console.log('Project Ref:', projectRef);
console.log('Password length:', password.length);

const client = new Client({
  host: `db.${projectRef}.supabase.co`,
  port: 6543, // Pooler port (transaction mode)
  user: 'postgres',
  password: password,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Successfully connected to Postgres!');
    const res = await client.query('SELECT tablename FROM pg_tables WHERE schemaname = \'public\'');
    console.log('Tables:', res.rows.map(r => r.tablename));
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await client.end();
  }
}

run();
