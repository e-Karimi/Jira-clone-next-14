"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { RiAddCircleFill } from "react-icons/ri";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

export const Projects = () => {
  const workspaceId = useWorkspaceId();
  const { data: projects } = useGetProjects({ workspaceId });
  const pathname = usePathname();
  const { setIsOpen } = useCreateProjectModal();

  const projectId = null; //todo  useProjectId

  return (
    <>
      <div className="flex flex-col gap-y-1 ">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs uppercase text-neutral-500">Projects</p>
          <RiAddCircleFill
            onClick={() => setIsOpen(true)}
            className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 rounded-full  transition ring-2 ring-blue-500 bg-blue-50 "
          />
        </div>
        {projects?.total !== 0 &&
          projects?.documents.map((project) => {
            const href = `/workspaces/${workspaceId}/projects/${projectId}`;
            const isActive = pathname === href;
            return (
              <Link href={href} key={project.$id}>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md hover:opacity-75 transition  cursor-pointer text-neutral-500 ",
                    isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                  )}
                >
                  <ProjectAvatar name={project.name} image={project.imageUrl} />
                  <span className="truncate text-sm"> {project.name}</span>
                </div>
              </Link>
            );
          })}
      </div>
    </>
  );
};
