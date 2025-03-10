"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { Analytics } from "@/components/analytics";

interface ProjectIdPageClientProps {
  projectId: string;
  workspaceId: string;
}

export const ProjectIdPageClient = ({ projectId, workspaceId }: ProjectIdPageClientProps) => {
  const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
  const { data: analytics, isLoading: isLoadingAnalytics } = useGetProjectAnalytics({ projectId });

  const isLoading = isLoadingProject || isLoadingAnalytics;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project || !analytics) {
    return <PageError error="project not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6" />
          <p className="text-base font-semibold">{project.name}</p>
        </div>
        <div>
          <Button asChild variant="secondary" size="sm" disabled={isLoading}>
            <Link href={`/workspaces/${workspaceId}/projects/${projectId}/settings`}>
              {" "}
              <PencilIcon className="size-4  mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics && <Analytics data={analytics} />}
      <TaskViewSwitcher hideProjectFilters />
    </div>
  );
};
