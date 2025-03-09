import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { ProjectIdSettingsPageClient } from "./client";

interface ProjectIdSettingsPageProps {
  params: {
    projectId: string;
    workspaceId: string;
  };
}

export default async function ProjectIdSettingsPage({ params }: ProjectIdSettingsPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <ProjectIdSettingsPageClient projectId={params.projectId} />;
}
