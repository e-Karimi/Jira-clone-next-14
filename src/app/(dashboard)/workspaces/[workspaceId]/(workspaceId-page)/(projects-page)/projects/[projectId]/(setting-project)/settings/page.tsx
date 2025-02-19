import { getCurrentUser } from "@/features/auth/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

interface ProjectIdSettingsPageProps {
  params: {
    projectId: string;
    workspaceId: string;
  };
}

export default async function ProjectIdSettingsPage({ params }: ProjectIdSettingsPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({ projectId: params.projectId, workspaceId: params.workspaceId });

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
}
