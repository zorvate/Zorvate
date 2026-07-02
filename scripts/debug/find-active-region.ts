import { Client } from 'pg';
import * as dns from 'dns';

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-central-2', 'eu-north-1',
  'ca-central-1', 'sa-east-1', 'me-central-1', 'af-south-1'
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
  const user = 'postgres.fqffrmjdgokgheufeejb';
  const password = 'sb_secret_WRRtaFMdD0loN3gjR_pDAA_oHfpmMUmsb_publishable_92rbJxg54CVIoHDo5GX68A_1vPDi9PL';
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
    console.log(`SUCCESS: Connected to regional pooler: ${host}`);
    const res = await client.query('SELECT tablename FROM pg_tables WHERE schemaname = \'public\'');
    console.log('Tables:', res.rows.map(r => r.tablename));
    await client.end();
    return true;
  } catch (error: any) {
    console.log(`Failed connecting to ${host}:`, error.message);
    return false;
  }
}

async function run() {
  console.log('Starting regional scan...');
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const ip = await lookupHost(host);
    if (ip) {
      console.log(`Testing region ${region} (${ip})...`);
      const success = await testConnection(host);
      if (success) {
        console.log(`FOUND ACTIVE REGION: ${region}`);
        break;
      }
    }
  }
}

run();
