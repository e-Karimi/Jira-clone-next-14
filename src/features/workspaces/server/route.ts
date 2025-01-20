import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";

import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID, IMAGES_BUCKET_ID } from "@/config";

const app = new Hono().post("/", zValidator("form", createWorkspaceSchema), sessionMiddleware, async (c) => {
  const databases = c.get("databases");
  const storage = c.get("storage");
  const user = c.get("user");

  const { name, image } = c.req.valid("form");

  let uploadedImageUrl: string | undefined;

  if (image instanceof File) {
    const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
    const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
    uploadedImageUrl = `data:mage/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
  }

  const workspace = await databases.createDocument(DATABASE_ID, WORKSPACES_ID, ID.unique(), {
    userId: user.$id,
    name,
    imageUrl: uploadedImageUrl,
  });

  return c.json({ data: workspace });
});

export default app;
