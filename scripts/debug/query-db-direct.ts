import { Client } from 'pg';

const connectionString = 'postgresql://postgres:sb_secret_WRRtaFMdD0loN3gjR_pDAA_oHfpmMUmsb_publishable_92rbJxg54CVIoHDo5GX68A_1vPDi9PL@db.fqffrmjdgokgheufeejb.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to DB successfully!');
    
    const res = await client.query('SELECT id, full_name, role, created_at FROM public.profiles');
    console.log('Profiles in DB:', res.rows);
  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

run();
