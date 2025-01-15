import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";

import { AUTH_COOKIE } from "./constants";

export const getCurrentUser = async () => {
  try {
    const session = cookies().get(AUTH_COOKIE);
    if (!session) return null;

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    client.setSession(session.value);

    const account = new Account(client);

    return await account.get();
  } catch (error) {
    console.log("auth/actions/getCurrentUser => error:", error);
    return null;
  }
};
