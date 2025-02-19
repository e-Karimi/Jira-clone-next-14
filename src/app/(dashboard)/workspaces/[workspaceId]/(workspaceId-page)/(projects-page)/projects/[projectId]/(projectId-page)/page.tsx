import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

interface ProjectIdPageProps {
  params: {
    projectId: string;
    workspaceId: string;
  };
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const peoject = await getProject({ projectId: params.projectId, workspaceId: params.workspaceId });

  if (!peoject) {
    throw new Error("Project not found");
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={peoject.name} image={peoject.imageUrl} className="size-6" />
          <p className="text-base font-semibold">{peoject.name}</p>
        </div>
        <div>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/workspaces/${params.workspaceId}/projects/${params.projectId}/settings`}>
              {" "}
              <PencilIcon className="size-4  mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
