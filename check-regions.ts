import { Client } from 'pg';
import * as dns from 'dns';

const regions = [
  'ap-south-1', 'eu-north-1', 'eu-central-2'
];

async function lookupHost(host: string): Promise<string | null> {
  return new Promise((resolve) => {
    dns.lookup(host, (err, address) => {
      if (err) resolve(null);
      else resolve(address);
    });
  });
}

async function testConnection(host: string) {
  const user = 'postgres.lwwovyvmhoboxakiruzp';
  const password = process.env.SUPABASE_DB_PASSWORD;
  const client = new Client({
    host,
    port: 6543,
    user,
    password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`Successfully connected to pooler: ${host}`);
    const res = await client.query('SELECT tablename FROM pg_tables WHERE schemaname = \'public\'');
    console.log('Tables:', res.rows.map(r => r.tablename));
    return client;
  } catch (error: any) {
    console.log(`Failed connecting to ${host}:`, error.message);
    return null;
  }
}

async function run() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const ip = await lookupHost(host);
    if (ip) {
      console.log(`Region ${region} resolves to ${ip}. Testing connection...`);
      const client = await testConnection(host);
      if (client) {
        await client.end();
        break;
      }
    }
  }
}

run();
