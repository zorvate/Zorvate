"use server";

import { revalidatePath } from "next/cache";
import { handleAction } from "../utils/errors";
import { CareersService } from "../services/careers-service";
import { JobApplicationInputType, JobInputType } from "@/lib/validations/cms";

export async function listJobApplicationsAction() {
  return handleAction(async () => {
    return CareersService.listJobApplications();
  });
}

export async function submitJobApplicationAction(input: JobApplicationInputType) {
  return handleAction(async () => {
    const data = await CareersService.submitJobApplication(input);
    revalidatePath("/admin/careers");
    return data;
  });
}

export async function listJobsAction() {
  return handleAction(async () => {
    return CareersService.listJobsForAdmin();
  });
}

export async function saveJobAction(input: JobInputType) {
  return handleAction(async () => {
    const result = await CareersService.saveJob(input);
    revalidatePath("/admin/careers");
    return result;
  });
}

export async function deleteJobAction(id: string) {
  return handleAction(async () => {
    await CareersService.deleteJob(id);
    revalidatePath("/admin/careers");
    return true;
  });
}

export async function updateJobApplicationStatusAction(id: string, status: string) {
  return handleAction(async () => {
    const data = await CareersService.updateJobApplicationStatus(id, status);
    revalidatePath("/admin/careers");
    return data;
  });
}
