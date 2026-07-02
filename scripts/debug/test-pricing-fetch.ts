import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

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
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: plans, error: plansError } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  console.log('Plans from DB:', { plans, plansError });

  const { data: features, error: featuresError } = await supabase
    .from("pricing_features")
    .select("*")
    .eq("enabled", true)
    .order("display_order", { ascending: true });

  console.log('Features from DB:', { features, featuresError });
}

run();
