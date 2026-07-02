import * as dns from 'dns';

dns.lookup('fqffrmjdgokgheufeejb.supabase.co', (err, address) => {
  if (err) {
    console.error('DNS error:', err);
  } else {
    console.log('IP Address of Gateway:', address);
  }
});
