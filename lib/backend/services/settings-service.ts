import { createClient } from "@/lib/supabase/server";
import { SettingsRepository } from "../repositories/settings-repository";
import { requireRoles, getClientIpAndUserAgent } from "../utils/auth";
import { AuditRepository } from "../repositories/audit-repository";
import { AppError } from "../utils/errors";
import { z } from "zod";

const navLinksArraySchema = z.array(
  z.object({
    title: z.string().trim().min(1, "Link title required"),
    href: z.string().trim().min(1, "Link URL required"),
  })
);

function normalizeLinkPayload(value: string) {
  const parsed = JSON.parse(value);
  const normalized = Array.isArray(parsed)
    ? parsed.map((link) => {
        if (typeof link !== "object" || link === null) {
          return { title: "", href: "" };
        }

        const entry = link as Record<string, unknown>;
        return {
          title: typeof entry.title === "string" ? entry.title.trim() : "",
          href: typeof entry.href === "string" ? entry.href.trim() : "",
        };
      })
    : [];

  navLinksArraySchema.parse(normalized);
  return JSON.stringify(normalized);
}

export const SettingsService = {
  async getSettings() {
    const supabase = await createClient();
    const rows = await SettingsRepository.listAll(supabase);
    const dict: Record<string, string> = {};
    rows.forEach(r => {
      dict[r.key] = r.value;
    });
    return dict;
  },

  async saveSetting(key: string, value: string, label: string) {
    const user = await requireRoles(["admin", "super-admin"]);
    const supabase = await createClient();

    // Custom validations for JSON-serialized links
    if (key === "navigation_links" || key === "footer_links") {
      try {
        value = normalizeLinkPayload(value);
      } catch (err) {
        if (err instanceof z.ZodError) {
          throw new AppError(`Links schema validation error: ${err.errors[0]?.message}`, "VALIDATION_ERROR", 400);
        }
        throw new AppError("Invalid JSON format for link coordinates list", "INVALID_JSON", 400);
      }
    }

    // Email format validation
    if (key === "company_email" && value !== "—" && value.trim() !== "") {
      const emailTest = z.string().email().safeParse(value);
      if (!emailTest.success) {
        throw new AppError("Invalid email address format", "VALIDATION_ERROR", 400);
      }
    }

    const result = await SettingsRepository.upsert(supabase, key, value, label);

    // Audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "cms.setting.save",
      entity_type: "site_setting",
      entity_id: key,
      details: { key, label, preview_value: value.substring(0, 100) },
      ip_address: ip,
      user_agent: userAgent,
    });

    return result;
  }
};
