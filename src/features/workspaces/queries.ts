import { Query } from "node-appwrite";

import { DATABASE_ID, WORKSPACES_ID, MEMBERS_ID } from "@/config";
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
