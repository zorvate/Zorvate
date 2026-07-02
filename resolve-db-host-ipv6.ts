import * as dns from 'dns';

dns.resolve6('db.lwwovyvmhoboxakiruzp.supabase.co', (err, addresses) => {
  console.log('IPv6 resolution of db.lwwovyvmhoboxakiruzp.supabase.co:', { err, addresses });
});

dns.resolveAny('db.lwwovyvmhoboxakiruzp.supabase.co', (err, addresses) => {
  console.log('Any resolution of db.lwwovyvmhoboxakiruzp.supabase.co:', { err, addresses });
});
