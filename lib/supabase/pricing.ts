import { SupabaseClient } from "@supabase/supabase-js";

export interface PricingPlan {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billing_label: string;
  gradient: string;
  badge: string | null;
  button_text: string;
  button_url: string;
  is_popular: boolean;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  features?: PricingFeature[];
}

export interface PricingFeature {
  id: string;
  plan_id: string;
  feature: string;
  icon: string;
  enabled: boolean;
  display_order: number;
}

export interface PricingComparison {
  id: string;
  feature_name: string;
  starter: string;
  business: string;
  web_app: string;
  ai: string;
  display_order: number;
}

// PREMIUM SEED FALLBACK DATA
export const MOCK_PRICING_PLANS: PricingPlan[] = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    slug: "starter",
    name: "Starter Website",
    description: "Premium landing page or high-converting site built with strict standards.",
    price: 15000.00,
    currency: "PKR",
    billing_label: "Starting From",
    gradient: "indigo",
    badge: null,
    button_text: "Get Started",
    button_url: "/contact",
    is_popular: false,
    display_order: 0,
    is_active: true,
    features: [
      { id: "f1", plan_id: "a1111111-1111-1111-1111-111111111111", feature: "Custom UI Design Layout", icon: "Check", enabled: true, display_order: 0 },
      { id: "f2", plan_id: "a1111111-1111-1111-1111-111111111111", feature: "Framer Motion Animations", icon: "Check", enabled: true, display_order: 1 },
      { id: "f3", plan_id: "a1111111-1111-1111-1111-111111111111", feature: "Tailwind CSS v4 Styling", icon: "Check", enabled: true, display_order: 2 },
      { id: "f4", plan_id: "a1111111-1111-1111-1111-111111111111", feature: "Strict Search Engine Optimization", icon: "Check", enabled: true, display_order: 3 }
    ]
  },
  {
    id: "b2222222-2222-2222-2222-222222222222",
    slug: "business",
    name: "Business Website",
    description: "Complete SaaS front-end design, API integrations, and CRM custom tools.",
    price: 35000.00,
    currency: "PKR",
    billing_label: "Starting From",
    gradient: "accent",
    badge: "Most Popular",
    button_text: "Schedule Call",
    button_url: "/contact",
    is_popular: true,
    display_order: 1,
    is_active: true,
    features: [
      { id: "f5", plan_id: "b2222222-2222-2222-2222-222222222222", feature: "Everything in Starter included", icon: "Check", enabled: true, display_order: 0 },
      { id: "f6", plan_id: "b2222222-2222-2222-2222-222222222222", feature: "Dynamic CRM integrations", icon: "Check", enabled: true, display_order: 1 },
      { id: "f7", plan_id: "b2222222-2222-2222-2222-222222222222", feature: "Performance Load optimization", icon: "Check", enabled: true, display_order: 2 },
      { id: "f8", plan_id: "b2222222-2222-2222-2222-222222222222", feature: "API Integrations & Sprints", icon: "Check", enabled: true, display_order: 3 }
    ]
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    slug: "web-app",
    name: "Custom Web Application",
    description: "Robust full-stack Next.js applications, serverless database, and secure client access.",
    price: 75000.00,
    currency: "PKR",
    billing_label: "Starting From",
    gradient: "violet",
    badge: null,
    button_text: "Request Quote",
    button_url: "/contact",
    is_popular: false,
    display_order: 2,
    is_active: true,
    features: [
      { id: "f9", plan_id: "c3333333-3333-3333-3333-333333333333", feature: "Everything in Business included", icon: "Check", enabled: true, display_order: 0 },
      { id: "f10", plan_id: "c3333333-3333-3333-3333-333333333333", feature: "Serverless DB & Storage", icon: "Check", enabled: true, display_order: 1 },
      { id: "f11", plan_id: "c3333333-3333-3333-3333-333333333333", feature: "Secure PostgreSQL access controls", icon: "Check", enabled: true, display_order: 2 },
      { id: "f12", plan_id: "c3333333-3333-3333-3333-333333333333", feature: "Full-Stack Portal Workspace", icon: "Check", enabled: true, display_order: 3 }
    ]
  },
  {
    id: "d4444444-4444-4444-4444-444444444444",
    slug: "ai",
    name: "AI Solutions",
    description: "Advanced vector memory, custom AI prompt layers, agents, and pipeline integrations.",
    price: 120000.00,
    currency: "PKR",
    billing_label: "Starting From",
    gradient: "emerald",
    badge: null,
    button_text: "Discovery Session",
    button_url: "/contact",
    is_popular: false,
    display_order: 3,
    is_active: true,
    features: [
      { id: "f13", plan_id: "d4444444-4444-4444-4444-444444444444", feature: "Everything in Web App included", icon: "Check", enabled: true, display_order: 0 },
      { id: "f14", plan_id: "d4444444-4444-4444-4444-444444444444", feature: "Vector Memory Storage nodes", icon: "Check", enabled: true, display_order: 1 },
      { id: "f15", plan_id: "d4444444-4444-4444-4444-444444444444", feature: "Custom AI Agent Automations", icon: "Check", enabled: true, display_order: 2 },
      { id: "f16", plan_id: "d4444444-4444-4444-4444-444444444444", feature: "Prioritized Priority Support", icon: "Check", enabled: true, display_order: 3 }
    ]
  },
  {
    id: "e5555555-5555-5555-5555-555555555555",
    slug: "enterprise",
    name: "Enterprise",
    description: "For complex systems, custom SaaS products, and full-scale systems development.",
    price: 0,
    currency: "PKR",
    billing_label: "Custom Scope",
    gradient: "indigo",
    badge: "Custom Scope",
    button_text: "Request Quote",
    button_url: "/contact",
    is_popular: false,
    display_order: 4,
    is_active: true,
    features: [
      { id: "f17", plan_id: "e5555555-5555-5555-5555-555555555555", feature: "Everything in AI Solutions included", icon: "Check", enabled: true, display_order: 0 },
      { id: "f18", plan_id: "e5555555-5555-5555-5555-555555555555", feature: "Custom API & system architecture", icon: "Check", enabled: true, display_order: 1 },
      { id: "f19", plan_id: "e5555555-5555-5555-5555-555555555555", feature: "Dedicated launching & support desk", icon: "Check", enabled: true, display_order: 2 }
    ]
  }
];

export const MOCK_PRICING_COMPARISONS: PricingComparison[] = [
  { id: "c1", feature_name: "Responsive Layouts", starter: "check", business: "check", web_app: "check", ai: "check", display_order: 0 },
  { id: "c2", feature_name: "Framer Motion Primitives", starter: "check", business: "check", web_app: "check", ai: "check", display_order: 1 },
  { id: "c3", feature_name: "Custom Domain Setup", starter: "check", business: "check", web_app: "check", ai: "check", display_order: 2 },
  { id: "c4", feature_name: "Search Engine Optimization", starter: "Basic SEO", business: "Advanced SEO", web_app: "Complete Audited SEO", ai: "Complete Audited SEO", display_order: 3 },
  { id: "c5", feature_name: "Supabase Auth Integration", starter: "cross", business: "check", web_app: "check", ai: "check", display_order: 4 },
  { id: "c6", feature_name: "API Sync Integrations", starter: "cross", business: "2 Integrations", web_app: "Unlimited", ai: "Unlimited", display_order: 5 },
  { id: "c7", feature_name: "Full-Stack Client Portal", starter: "cross", business: "cross", web_app: "check", ai: "check", display_order: 6 },
  { id: "c8", feature_name: "Database & Storage Vault", starter: "cross", business: "cross", web_app: "check", ai: "check", display_order: 7 },
  { id: "c9", feature_name: "AI Custom Agent workflows", starter: "cross", business: "cross", web_app: "cross", ai: "check", display_order: 8 },
  { id: "c10", feature_name: "Dedicated Engineering Support", starter: "Email Support", business: "Priority Support", web_app: "24/7 Slack Connect", ai: "Dedicated Team", display_order: 9 }
];

// DYNAMIC SERVICES
export async function getPricingPlans(supabase: SupabaseClient): Promise<PricingPlan[]> {
  try {
    const { data: plans, error: plansError } = await supabase
      .from("pricing_plans")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (plansError) throw plansError;
    if (!plans || plans.length === 0) return MOCK_PRICING_PLANS;

    // Fetch features in parallel or nested
    const { data: features, error: featuresError } = await supabase
      .from("pricing_features")
      .select("*")
      .eq("enabled", true)
      .order("display_order", { ascending: true });

    if (featuresError) throw featuresError;

    return (plans as PricingPlan[]).map((plan: PricingPlan) => ({
      ...plan,
      features: (features as PricingFeature[] || []).filter((f: PricingFeature) => f.plan_id === plan.id),
    }));
  } catch (e) {
    console.warn("Pricing DB tables missing, using Mock Fallback Data:", e);
    return MOCK_PRICING_PLANS;
  }
}

export async function getAllPlansAdmin(supabase: SupabaseClient): Promise<PricingPlan[]> {
  try {
    const { data: plans, error: plansError } = await supabase
      .from("pricing_plans")
      .select("*")
      .order("display_order", { ascending: true });

    if (plansError) throw plansError;
    if (!plans || plans.length === 0) return MOCK_PRICING_PLANS;

    const { data: features, error: featuresError } = await supabase
      .from("pricing_features")
      .select("*")
      .order("display_order", { ascending: true });

    if (featuresError) throw featuresError;

    return (plans as PricingPlan[]).map((plan: PricingPlan) => ({
      ...plan,
      features: (features as PricingFeature[] || []).filter((f: PricingFeature) => f.plan_id === plan.id),
    }));
  } catch (e) {
    console.warn("Pricing DB tables missing in Admin, using Mock Fallback:", e);
    return MOCK_PRICING_PLANS;
  }
}

export async function savePlan(supabase: SupabaseClient, plan: Partial<PricingPlan>): Promise<PricingPlan> {
  const { data, error } = await supabase
    .from("pricing_plans")
    .upsert(plan)
    .select()
    .single();

  if (error) throw error;
  return data as PricingPlan;
}

export async function deletePlan(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from("pricing_plans")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function saveFeature(supabase: SupabaseClient, feature: Partial<PricingFeature>): Promise<PricingFeature> {
  const { data, error } = await supabase
    .from("pricing_features")
    .upsert(feature)
    .select()
    .single();

  if (error) throw error;
  return data as PricingFeature;
}

export async function deleteFeature(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from("pricing_features")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function getComparisons(supabase: SupabaseClient): Promise<PricingComparison[]> {
  try {
    const { data, error } = await supabase
      .from("pricing_comparison")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return MOCK_PRICING_COMPARISONS;
    return data as PricingComparison[];
  } catch (e) {
    console.warn("pricing_comparison table missing, returning mock comparison list:", e);
    return MOCK_PRICING_COMPARISONS;
  }
}

export async function saveComparison(supabase: SupabaseClient, row: Partial<PricingComparison>): Promise<PricingComparison> {
  const { data, error } = await supabase
    .from("pricing_comparison")
    .upsert(row)
    .select()
    .single();

  if (error) throw error;
  return data as PricingComparison;
}

export async function deleteComparison(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from("pricing_comparison")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
