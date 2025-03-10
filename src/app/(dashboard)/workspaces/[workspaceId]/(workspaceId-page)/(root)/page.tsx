import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import WorkspaceIdClientPage from "./client";

export default async function WorkspaceIdPage({ params }: { params: { workspaceId: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <WorkspaceIdClientPage workspaceId={params.workspaceId} />;
}
