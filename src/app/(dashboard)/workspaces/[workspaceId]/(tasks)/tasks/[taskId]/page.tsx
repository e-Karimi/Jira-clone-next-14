import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";

import { TaskIdPageClient } from "./client";

export default async function TaskIdPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <TaskIdPageClient />;
}
