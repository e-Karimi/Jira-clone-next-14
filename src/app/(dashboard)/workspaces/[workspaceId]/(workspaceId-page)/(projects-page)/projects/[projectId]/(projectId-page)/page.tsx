import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";

import { ProjectIdPageClient } from "./client";

interface ProjectIdPageProps {
  params: {
    projectId: string;
    workspaceId: string;
  };
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <ProjectIdPageClient projectId={params.projectId} workspaceId={params.workspaceId} />;
}
