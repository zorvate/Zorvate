import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(__dirname, "../../.env.local");
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim();
      if (key === "NEXT_PUBLIC_SUPABASE_URL" && !supabaseUrl) supabaseUrl = val;
      if (key === "NEXT_PUBLIC_SUPABASE_ANON_KEY" && !supabaseAnonKey) supabaseAnonKey = val;
    }
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment");
  process.exit(1);
}

console.log("Supabase URL configured:", Boolean(supabaseUrl));
console.log("Supabase Anon Key configured:", Boolean(supabaseAnonKey));

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  console.log("\n--- Querying portfolio_projects with select('*').order('display_order', { ascending: true }) ---");
  const res1 = await supabase
    .from("portfolio_projects")
    .select("*")
    .order("display_order", { ascending: true });

  console.log("res1 error:", JSON.stringify(res1.error, null, 2));
  console.log("res1 data count:", res1.data ? res1.data.length : null);

  if (res1.error) {
    console.log("\n--- Fallback: Querying portfolio_projects with select('*').order('created_at', { ascending: false }) ---");
    const res2 = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("res2 error:", JSON.stringify(res2.error, null, 2));
    console.log("res2 data count:", res2.data ? res2.data.length : null);
  }
}

runTest().catch((err) => {
  console.error("Script execution threw exception:", err);
});
