import { Query } from "node-appwrite";

import { DATABASE_ID, WORKSPACES_ID, MEMBERS_ID } from "@/config";
import { getMember } from "../members/queries";
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
    console.log("workspaces/actions/getWorkspaces => error:", error);
    return { documents: [], total: 0 };
  }
};

export const getWorkspace = async ({ workspaceId }: { workspaceId: string }) => {
  try {
    const { account, databases } = await createSessonClient();
    const user = await account.get();

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) return null;

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return workspace;
  } catch (error) {
    console.log("workspaces/actions/getWorkspace => error:", error);
    return null;
  }
};

export const getWorkspaceInfo = async ({ workspaceId }: { workspaceId: string }) => {
  try {
    const { databases } = await createSessonClient();

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return {
      name: workspace.name,
    };
  } catch (error) {
    console.log("workspaces/actions/getWorkspaceInfo => error:", error);
    return null;
  }
};
