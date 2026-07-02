import * as dns from 'dns';

const hosts = [
  'db.lwwovyvmhoboxakiruzp.supabase.co',
  'db.lwwovyvmhoboxakiruzp.supabase.net',
  'db.lwwovyvmhoboxakiruzp.supabase.com',
  'db.lwwovyvmhoboxakiruzp.co',
  'lwwovyvmhoboxakiruzp.supabase.co'
];

for (const host of hosts) {
  dns.lookup(host, (err, address) => {
    console.log(`${host}:`, err ? err.code : address);
  });
}
