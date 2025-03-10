import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/queries";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { Project } from "../types";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .get("/", sessionMiddleware, zValidator("query", z.object({ workspaceId: z.string() })), async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.valid("query");

    if (!workspaceId) {
      return c.json({ error: "Missing workspaceId" }, 400);
    }

    const member = await getMember({ databases, workspaceId, userId: user.$id });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projects = await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({ data: projects });
  })
  .post("/", sessionMiddleware, zValidator("form", createProjectSchema), async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const storage = c.get("storage");

    const { name, image, workspaceId } = c.req.valid("form");

    const member = await getMember({ databases, workspaceId, userId: user.$id });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    }

    const projects = await databases.createDocument(DATABASE_ID, PROJECTS_ID, ID.unique(), {
      name,
      workspaceId,
      imageUrl: uploadedImageUrl,
    });

    return c.json({ data: projects });
  })
  .patch("/:projectId", zValidator("form", updateProjectSchema), sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { projectId } = c.req.param();
    const { name, image } = c.req.valid("form");

    const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({ databases, workspaceId: existingProject.workspaceId, userId: user.$id });

    if (!member) {
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

    const project = await databases.updateDocument(DATABASE_ID, PROJECTS_ID, projectId, {
      name,
      imageUrl: uploadedImageUrl,
    });

    return c.json({ data: project });
  })
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({ databases, workspaceId: existingProject.workspaceId, userId: user.$id });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({ data: { $id: projectId } }, 200);
  })
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = getMember({ databases, workspaceId: project.workspaceId, userId: user.$id });

    if (!member) {
      return c.json({ error: "Unathorized !!" }, 401);
    }

    return c.json({ data: project });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({ databases, workspaceId: project.workspaceId, userId: user.$id });

    if (!member) {
      return c.json({ error: "Unathorized !!" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const tasksCount = thisMonthTasks.total;
    const tasksDifference = tasksCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthAssignedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const assignedTasksCount = thisMonthAssignedTasks.total;
    const assignedTasksDifference = assignedTasksCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthIncompleteTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const incompleteTasksCount = thisMonthIncompleteTasks.total;
    const incompleteTasksDifference = incompleteTasksCount - lastMonthIncompleteTasks.total;

    const thisMonthCompleteTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthCompleteTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const completeTasksCount = thisMonthCompleteTasks.total;
    const completeTasksDifference = completeTasksCount - lastMonthCompleteTasks.total;

    const thisMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.toISOString()),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);

    const lastMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.toISOString()),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const OverdueTasksCount = thisMonthOverdueTasks.total;
    const OverdueTasksDifference = OverdueTasksCount - lastMonthOverdueTasks.total;

    return c.json({
      data: {
        tasksCount,
        tasksDifference,
        assignedTasksCount,
        assignedTasksDifference,
        incompleteTasksCount,
        incompleteTasksDifference,
        completeTasksCount,
        completeTasksDifference,
        OverdueTasksCount,
        OverdueTasksDifference,
      },
    });
  });

export default app;
