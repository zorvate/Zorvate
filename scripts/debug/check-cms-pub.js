const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(process.cwd(), '.env.local');
const env = {};
fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
  const clean = line.trim();
  if (!clean || clean.startsWith('#')) return;
  const parts = line.split('=');
  const key = parts.shift().trim();
  let val = parts.join('=').trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

(async () => {
  try {
    const { data: projects, error: projectsError } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('display_order', { ascending: true })
      .limit(3);
    console.log('portfolio_projects error:', projectsError ? projectsError.message : null);
    console.log('portfolio_projects data:', projects);

    const { data: settings, error: settingsError } = await supabase.from('site_settings').select('*').limit(5);
    console.log('site_settings error:', settingsError ? settingsError.message : null);
    console.log('site_settings count:', settings?.length);

    const { data: team, error: teamError } = await supabase.from('team_members').select('*').order('display_order', { ascending: true }).limit(5);
    console.log('team_members error:', teamError ? teamError.message : null);
    console.log('team_members data:', team);
  } catch (error) {
    console.error('unexpected error', error);
    process.exit(1);
  }
})();
