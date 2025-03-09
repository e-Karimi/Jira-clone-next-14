import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import { WorkspaceIdJoinClientPage } from "./client";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
  };
}

export default async function WorkspaceIdJoinPage({ params }: WorkspaceIdJoinPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <WorkspaceIdJoinClientPage workspaceId={params.workspaceId} />;
}
