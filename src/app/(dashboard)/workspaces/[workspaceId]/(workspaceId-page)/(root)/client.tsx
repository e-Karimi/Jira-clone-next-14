/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { Analytics } from "@/components/analytics";
import TaskList from "@/components/task-list";
import ProjectList from "@/components/project-list";
import MemberList from "@/components/members-list";

interface WorkspaceIdClientPageProps {
  workspaceId: string;
}

export default function WorkspaceIdClientPage({ workspaceId }: WorkspaceIdClientPageProps) {
  const { data: analytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: projects, isLoading: isLoadingPojects } = useGetProjects({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading = isLoadingAnalytics || isLoadingPojects || isLoadingTasks || isLoadingMembers;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !projects || !tasks || !members) {
    return <PageError error="Failed to load workspace data" />;
  }

  return (
    <div className="w-full flex flex-col  space-y-4 px-2 ">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ProjectList data={projects.documents} total={projects.total} />
        <MemberList data={members.documents} total={members.total} workspaceId={workspaceId} />
        <TaskList data={tasks.documents} total={tasks.total} workspaceId={workspaceId} />
      </div>
    </div>
  );
}
