"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "../utils/errors";
import { requireRoles, getClientIpAndUserAgent } from "../utils/auth";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AuditRepository } from "../repositories/audit-repository";
import {
  portalMessageSchema,
  portalFileUploadSchema,
  portalMeetingSchema,
  portalProfileSchema
} from "@/lib/validations/portal";

// Helper to verify a client owns the project
async function verifyProjectAccess(userId: string, userRole: string, projectId: string) {
  if (userRole === "admin" || userRole === "super-admin" || userRole === "manager") {
    return true; // Admins have global override access
  }

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("client_id", userId)
    .single();

  if (!project) {
    throw new Error("Unauthorized access to this project workspace");
  }
  return true;
}

export async function submitPortalCommentAction(projectId: string, content: string) {
  return handleAction(async () => {
    const user = await requireRoles(["client", "admin", "super-admin", "manager"]);
    portalMessageSchema.parse({ projectId, content });

    await verifyProjectAccess(user.id, user.role, projectId);

    const supabase = await createClient();
    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        project_id: projectId,
        content,
        user_id: user.id,
      })
      .select()
      .single();
    if (error) throw error;

    // Send notifications to admins using service role client
    const { data: admins } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .in("role", ["admin", "super-admin"]);

    if (admins && admins.length > 0) {
      const notificationsPayload = admins.map(admin => ({
        user_id: admin.id,
        title: "Workspace Dialogue Update",
        content: `A client posted feedback in project discussion boards.`,
        link: `/portal/projects/${projectId}`,
      }));
      await supabaseAdmin.from("notifications").insert(notificationsPayload);
    }

    // Log audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "portal.comment.create",
      entity_type: "comment",
      entity_id: comment.id,
      details: { projectId },
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath(`/portal/projects/${projectId}`);
    return comment;
  });
}

export async function submitPortalMessageAction(projectId: string, content: string) {
  return handleAction(async () => {
    const user = await requireRoles(["client", "admin", "super-admin", "manager"]);
    portalMessageSchema.parse({ projectId, content });

    await verifyProjectAccess(user.id, user.role, projectId);

    const supabase = await createClient();
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        project_id: projectId,
        content,
        sender_id: user.id,
      })
      .select()
      .single();
    if (error) throw error;

    // Log audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "portal.message.send",
      entity_type: "message",
      entity_id: message.id,
      details: { projectId },
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/portal/messages");
    return message;
  });
}

export async function uploadPortalFileAction(input: {
  projectId: string;
  name: string;
  filePath: string;
  fileSize: number;
  fileType: string;
}) {
  return handleAction(async () => {
    const user = await requireRoles(["client", "admin", "super-admin", "manager"]);
    const parsed = portalFileUploadSchema.parse(input);

    await verifyProjectAccess(user.id, user.role, parsed.projectId);

    const supabase = await createClient();
    const { data: attachment, error } = await supabase
      .from("attachments")
      .insert({
        project_id: parsed.projectId,
        name: parsed.name,
        file_path: parsed.filePath,
        file_size: parsed.fileSize,
        file_type: parsed.fileType,
        uploaded_by: user.id,
      })
      .select()
      .single();
    if (error) throw error;

    // Log audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "portal.attachment.upload",
      entity_type: "attachment",
      entity_id: attachment.id,
      details: { name: parsed.name, size: parsed.fileSize },
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/portal/files");
    return attachment;
  });
}

export async function deletePortalFileAction(attachmentId: string) {
  return handleAction(async () => {
    const user = await requireRoles(["client", "admin", "super-admin", "manager"]);

    const supabase = await createClient();
    // Retrieve attachment to verify project ownership
    const { data: attachment } = await supabase
      .from("attachments")
      .select("id, project_id, file_path")
      .eq("id", attachmentId)
      .single();

    if (!attachment) throw new Error("Attachment record not found");

    await verifyProjectAccess(user.id, user.role, attachment.project_id);

    // Delete database entry
    const { error: dbError } = await supabase
      .from("attachments")
      .delete()
      .eq("id", attachmentId);
    if (dbError) throw dbError;

    // Delete actual file in bucket using service role client to avoid policy friction
    await supabaseAdmin.storage.from("media").remove([attachment.file_path]);

    // Log audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "portal.attachment.delete",
      entity_type: "attachment",
      entity_id: attachmentId,
      details: { path: attachment.file_path },
      ip_address: ip,
      user_agent: userAgent,
    });

    revalidatePath("/portal/files");
    return { success: true };
  });
}

export async function bookPortalMeetingAction(input: {
  meetingType: "discovery" | "sprint_sync" | "design_review" | "architecture_review";
  dateTime: string;
  description?: string | null;
}) {
  return handleAction(async () => {
    const user = await requireRoles(["client", "admin", "super-admin", "manager"]);
    const parsed = portalMeetingSchema.parse(input);

    const typeLabels = {
      discovery: "Discovery Consultation Call",
      sprint_sync: "Sprint Progression Update Sync",
      design_review: "Design Wireframe Review session",
      architecture_review: "Technical Architecture Review Sync",
    };
    const meetingLabel = typeLabels[parsed.meetingType];

    // Write Client confirmation notification
    await supabaseAdmin.from("notifications").insert({
      user_id: user.id,
      title: "Meeting Reservation Requested",
      content: `Your ${meetingLabel} request on ${parsed.dateTime} has been submitted for review.`,
      link: "/portal",
    });

    // Write Admin incoming booking alerts
    const { data: admins } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .in("role", ["admin", "super-admin"]);

    if (admins && admins.length > 0) {
      const adminNotifications = admins.map(admin => ({
        user_id: admin.id,
        title: "New Meeting Booking Request",
        content: `Client requested a ${meetingLabel} on ${parsed.dateTime}.`,
        link: "/admin",
      }));
      await supabaseAdmin.from("notifications").insert(adminNotifications);
    }

    // Log audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "portal.meeting.book",
      entity_type: "notification",
      entity_id: user.id,
      details: { type: parsed.meetingType, date: parsed.dateTime },
      ip_address: ip,
      user_agent: userAgent,
    });

    return { success: true };
  });
}

export async function updatePortalProfileAction(input: {
  fullName: string;
  avatarUrl: string;
}) {
  return handleAction(async () => {
    const user = await requireRoles(["client", "admin", "super-admin", "manager"]);
    const parsed = portalProfileSchema.parse(input);

    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        full_name: parsed.fullName,
        avatar_url: parsed.avatarUrl || null,
      })
      .eq("id", user.id)
      .select()
      .single();
    if (error) throw error;

    // Log audit log
    const { ip, userAgent } = await getClientIpAndUserAgent();
    await AuditRepository.createSystemLog({
      user_id: user.id,
      action: "portal.profile.update",
      entity_type: "profile",
      entity_id: user.id,
      details: { name: parsed.fullName },
      ip_address: ip,
      user_agent: userAgent,
    });

    return profile;
  });
}
