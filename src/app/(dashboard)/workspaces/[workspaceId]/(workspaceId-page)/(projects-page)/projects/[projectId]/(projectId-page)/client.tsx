"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";

interface ProjectIdPageClientProps {
  projectId: string;
  workspaceId: string;
}

export const ProjectIdPageClient = ({ projectId, workspaceId }: ProjectIdPageClientProps) => {
  const { data: peoject, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!peoject) {
    return <PageError error="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={peoject.name} image={peoject.imageUrl} className="size-6" />
          <p className="text-base font-semibold">{peoject.name}</p>
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
      <TaskViewSwitcher hideProjectFilters />
    </div>
  );
};
