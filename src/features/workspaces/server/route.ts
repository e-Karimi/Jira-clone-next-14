import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID, IMAGES_BUCKET_ID, MEMBERS_ID } from "@/config";
import { MemberRole } from "@/features/members/types";

import type { Workspace } from "../types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/queries";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal("userId", user.$id)]);

    if (members.total === 0) {
      const documents: Workspace[] = [];
      return c.json({ data: { documents, total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.contains("$id", workspaceIds),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({ data: workspaces });
  })

  .post("/", zValidator("form", createWorkspaceSchema), sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { name, image } = c.req.valid("form");

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    }

    //create a document in workspace collection
    const workspace = await databases.createDocument(DATABASE_ID, WORKSPACES_ID, ID.unique(), {
      userId: user.$id,
      name,
      imageUrl: uploadedImageUrl,
      inviteCode: generateInviteCode(6),
    });

    //create a document in members collection
    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      userId: user.$id,
      workspaceId: workspace.$id,
      role: MemberRole.ADMIN,
    });

    return c.json({ data: workspace });
  })
  .patch("/:workspaceId", zValidator("form", updateWorkspaceSchema), sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { workspaceId } = c.req.param();
    const { name, image } = c.req.valid("form");

    const member = await getMember({ databases, workspaceId, userId: user.$id });

    if (!member || member.role != MemberRole.ADMIN) {
      return c.json({ error: "Unauthorize", data: null }, 401);
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    } else {
      uploadedImageUrl = image;
    }

    const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
      name,
      imageUrl: uploadedImageUrl,
    });

    return c.json({ data: workspace }, 200);
  });

export default app;
