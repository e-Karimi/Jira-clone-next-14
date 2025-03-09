"use client";

import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { useGetProject } from "@/features/projects/api/use-get-project";

interface ProjectIdSettingsPageClientProps {
  projectId: string;
}

export const ProjectIdSettingsPageClient = ({ projectId }: ProjectIdSettingsPageClientProps) => {
  const { data: initialValues, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialValues) {
    return <PageError error="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};
