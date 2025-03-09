"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";

interface WorkspaceIdJoinClientPageProps {
  workspaceId: string;
}

export const WorkspaceIdJoinClientPage = ({ workspaceId }: WorkspaceIdJoinClientPageProps) => {
  const { data: workspace, isLoading } = useGetWorkspaceInfo({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!workspace) {
    return <PageError error="workspace not found" />;
  }

  const initialValues = {
    name: workspace.name,
    inviteCode: workspace.inviteCode,
    workspaceId,
  };

  return (
    <div className="w-full lg:max-w-xl bg-gray-100 p-2 ml-2">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
};
