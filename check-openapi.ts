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

let supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || '';

async function run() {
  const url = supabaseUrl.endsWith('/') ? supabaseUrl : supabaseUrl + '/';
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  };

  try {
    const res = await fetch(url, { headers });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Definitions:', Object.keys(data.definitions || {}));
    console.log('Paths:', Object.keys(data.paths || {}));
  } catch (error) {
    console.error('Error fetching OpenAPI spec:', error);
  }
}

run();
