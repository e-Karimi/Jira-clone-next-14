"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";

interface WorkspaceIdSettingsClientPageProps {
  workspaceId: string;
}

export const WorkspaceIdSettingsClientPage = ({ workspaceId }: WorkspaceIdSettingsClientPageProps) => {
  const { data, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError error="workspace not found" />;
  }
  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={data} />
    </div>
  );
};
