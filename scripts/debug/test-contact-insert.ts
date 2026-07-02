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
  console.log('Testing insert with select().single():');
  const res1 = await supabase
    .from('contact_requests')
    .insert({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message here',
      status: 'new',
      priority: 'medium'
    })
    .select()
    .single();
  console.log('Result with select().single():', { success: !res1.error, error: res1.error });

  console.log('\nTesting insert without select():');
  const res2 = await supabase
    .from('contact_requests')
    .insert({
      id: crypto.randomUUID(),
      name: 'Test User 2',
      email: 'test2@example.com',
      message: 'Test message here 2',
      status: 'new',
      priority: 'medium'
    });
  console.log('Result without select():', { success: !res2.error, error: res2.error });
}

run();
