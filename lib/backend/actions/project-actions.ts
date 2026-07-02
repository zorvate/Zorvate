"use server";

import { ProjectService } from "../services/project-service";
import { ProjectInput } from "../repositories/project-repository";
import { handleAction } from "../utils/errors";
import { revalidatePath } from "next/cache";

export async function createProjectAction(input: ProjectInput) {
  return handleAction(async () => {
    const project = await ProjectService.createProject(input);
    revalidatePath("/portal");
    revalidatePath("/admin/projects");
    return project;
  });
}

export async function updateProjectAction(id: string, input: Partial<ProjectInput>) {
  return handleAction(async () => {
    const project = await ProjectService.updateProject(id, input);
    revalidatePath("/portal");
    revalidatePath(`/portal/projects/${id}`);
    revalidatePath("/admin/projects");
    return project;
  });
}

export async function deleteProjectAction(id: string) {
  return handleAction(async () => {
    await ProjectService.deleteProject(id);
    revalidatePath("/portal");
    revalidatePath("/admin/projects");
    return true;
  });
}

export async function listProjectsAction() {
  return handleAction(async () => {
    return ProjectService.listProjects();
  });
}
