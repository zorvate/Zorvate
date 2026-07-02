import * as dns from 'dns';

const hosts = [
  'db.fqffrmjdgokgheufeejb.supabase.co',
  'db.fqffrmjdgokgheufeejb.supabase.net',
  'db.fqffrmjdgokgheufeejb.supabase.com',
  'db.fqffrmjdgokgheufeejb.co',
  'fqffrmjdgokgheufeejb.supabase.co',
  'fqffrmjdgokgheufeejb.supabase.net',
  'fqffrmjdgokgheufeejb.supabase.com'
];

for (const host of hosts) {
  dns.lookup(host, (err, address) => {
    console.log(`${host}:`, err ? err.code : address);
  });
}
