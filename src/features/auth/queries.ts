import { createSessonClient } from "@/lib/appwrite";

export const getCurrentUser = async () => {
  try {
    const { account } = await createSessonClient();

    return await account.get();
  } catch (error) {
    console.log("auth/actions/getCurrentUser => error:", error);
    return null;
  }
};
