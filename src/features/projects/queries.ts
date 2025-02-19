import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/queries";
import { Project } from "./types";
import { createSessonClient } from "@/lib/appwrite";

interface GetProjectProps {
  projectId: string;
  workspaceId: string;
}

export const getProject = async ({ projectId, workspaceId }: GetProjectProps) => {
  const { account, databases } = await createSessonClient();
  const user = await account.get();

  const member = await getMember({ databases, workspaceId, userId: user.$id });
  if (!member) {
    throw new Error("Unauthorized!!");
  }

  const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);
  if (!project) {
    throw new Error("Project not found!!");
  }

  return project;
};
