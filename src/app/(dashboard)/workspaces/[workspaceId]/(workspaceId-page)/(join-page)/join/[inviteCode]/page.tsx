import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

export default async function WorkspaceIdJoinPage({ params }: WorkspaceIdJoinPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const workspace = await getWorkspaceInfo({ workspaceId: params.workspaceId });
  if (!workspace) redirect("/workspaces");

  const initialValues = {
    name: workspace.name,
    inviteCode: params.inviteCode,
    workspaceId: params.workspaceId,
  };

  return (
    <div className="w-full lg:max-w-xl bg-gray-100 p-2 ml-2">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
}
