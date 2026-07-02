"use server";

import { ProfileService } from "../services/profile-service";
import { ProfileUpdateInput } from "../repositories/profile-repository";
import { handleAction } from "../utils/errors";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(id: string, input: ProfileUpdateInput) {
  return handleAction(async () => {
    const profile = await ProfileService.updateProfile(id, input);
    revalidatePath("/portal/settings");
    revalidatePath("/admin/users");
    return profile;
  });
}

export async function listProfilesAction() {
  return handleAction(async () => {
    return ProfileService.listProfiles();
  });
}
