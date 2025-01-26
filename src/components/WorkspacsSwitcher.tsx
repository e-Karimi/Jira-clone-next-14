"use client";

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

export const WorkspacsSwitcher = () => {
  const { data: workspaces } = useGetWorkspaces();
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { setIsOpen } = useCreateWorkspaceModal();

  const onselect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={() => setIsOpen(true)}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 rounded-full  transition ring-2 ring-blue-500 bg-blue-50 "
        />
      </div>
      <Select value={workspaceId} onValueChange={onselect}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium text-neutral-700 px-1 py-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.total !== 0 &&
            workspaces?.documents.map((workspace) => (
              <SelectItem key={workspace.$id} value={workspace.$id}>
                <div className="flex items-center gap-3 font-medium">
                  <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} />
                  <span className="truncate"> {workspace.name}</span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};
