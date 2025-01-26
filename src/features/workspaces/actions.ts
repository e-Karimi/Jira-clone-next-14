import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";

import { AUTH_COOKIE } from "@/features/auth/constants";
import { DATABASE_ID, WORKSPACES_ID, MEMBERS_ID } from "@/config";


export const getWorkspaces = async () => {
  try {
    const session = cookies().get(AUTH_COOKIE);
    if (!session) return { documents: [], total: 0 };

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    client.setSession(session.value);

    const account = new Account(client);
    const user = await account.get();

    const databases = new Databases(client);

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
