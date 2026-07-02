import * as dns from 'dns';

dns.lookup('lwwovyvmhoboxakiruzp.supabase.co', (err, address, family) => {
  console.log('Lookup:', { err, address, family });
});
