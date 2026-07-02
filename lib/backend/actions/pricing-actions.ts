"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "../utils/errors";
import { requireRoles, getClientIpAndUserAgent } from "../utils/auth";
import { createClient } from "@/lib/supabase/server";
import { AuditRepository } from "../repositories/audit-repository";
import {
  savePlan,
  deletePlan,
  saveFeature,
  deleteFeature,
  saveComparison,
  deleteComparison,
  getAllPlansAdmin,
  getComparisons,
  PricingPlan,
  PricingFeature,
  PricingComparison
} from "@/lib/supabase/pricing";
import {
  pricingPlanSchema,
  pricingFeatureSchema,
  pricingComparisonSchema
} from "@/lib/validations/pricing";

export async function savePlanAction(plan: Partial<PricingPlan>) {
  return handleAction(async () => {
    const user = await requireRoles(["admin", "super-admin"]);
    const validated = pricingPlanSchema.parse(plan);
    const supabase = await createClient();

    const result = await savePlan(supabase, validated as Partial<PricingPlan>);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "pricing.plan.save",
      entity_type: "pricing_plan",
      entity_id: result.id,
      details: { name: result.name, price: result.price },
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/pricing");
    revalidatePath("/admin/pricing");
    return result;
  });
}

export async function deletePlanAction(id: string) {
  return handleAction(async () => {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    await deletePlan(supabase, id);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "pricing.plan.delete",
      entity_type: "pricing_plan",
      entity_id: id,
      details: { id },
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/pricing");
    revalidatePath("/admin/pricing");
    return true;
  });
}

export async function saveFeatureAction(feature: Partial<PricingFeature>) {
  return handleAction(async () => {
    const user = await requireRoles(["admin", "super-admin"]);
    const validated = pricingFeatureSchema.parse(feature);
    const supabase = await createClient();

    const result = await saveFeature(supabase, validated as Partial<PricingFeature>);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "pricing.feature.save",
      entity_type: "pricing_feature",
      entity_id: result.id,
      details: { feature: result.feature },
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/pricing");
    revalidatePath("/admin/pricing");
    return result;
  });
}

export async function deleteFeatureAction(id: string) {
  return handleAction(async () => {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    await deleteFeature(supabase, id);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "pricing.feature.delete",
      entity_type: "pricing_feature",
      entity_id: id,
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/pricing");
    revalidatePath("/admin/pricing");
    return true;
  });
}

export async function saveComparisonAction(comp: Partial<PricingComparison>) {
  return handleAction(async () => {
    const user = await requireRoles(["admin", "super-admin"]);
    const validated = pricingComparisonSchema.parse(comp);
    const supabase = await createClient();

    const result = await saveComparison(supabase, validated as Partial<PricingComparison>);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "pricing.comparison.save",
      entity_type: "pricing_comparison",
      entity_id: result.id,
      details: { feature_name: result.feature_name },
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/pricing");
    revalidatePath("/admin/pricing");
    return result;
  });
}

export async function deleteComparisonAction(id: string) {
  return handleAction(async () => {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    await deleteComparison(supabase, id);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "pricing.comparison.delete",
      entity_type: "pricing_comparison",
      entity_id: id,
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/pricing");
    revalidatePath("/admin/pricing");
    return true;
  });
}

export async function getAllPlansAdminAction() {
  return handleAction(async () => {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    return getAllPlansAdmin(supabase);
  });
}

export async function getComparisonsAction() {
  return handleAction(async () => {
    await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();
    return getComparisons(supabase);
  });
}
