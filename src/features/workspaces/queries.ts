import { Query } from "node-appwrite";

import { DATABASE_ID, WORKSPACES_ID, MEMBERS_ID } from "@/config";
import { getMember } from "@/features/members/queries";
import { Workspace } from "./types";
import { createSessonClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessonClient();
    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal("userId", user.$id)]);

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.contains("$id", workspaceIds),
      Query.orderDesc("$createdAt"),
    ]);

    return workspaces;
  } catch (error) {
    console.log("workspaces/queries/getWorkspaces => error:", error);
    return { documents: [], total: 0 };
  }
};

export const getWorkspace = async ({ workspaceId }: { workspaceId: string }) => {
  const { account, databases } = await createSessonClient();
  const user = await account.get();

  const member = await getMember({ databases, workspaceId, userId: user.$id });

  if (!member) {
    throw new Error("Unauthorized!!");
  }

  const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

  return workspace;
};

export const getWorkspaceInfo = async ({ workspaceId }: { workspaceId: string }) => {
  const { databases } = await createSessonClient();

  const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);
  if (!workspace) {
    throw new Error("Workspace not found!!");
  }
  return {
    name: workspace.name,
  };
};
