"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateWorkspacesForm } from "./create-workspaces-form";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

export const CreateWorkspaceModal = () => {
  const { isOpen, setIsOpen } = useCreateWorkspaceModal();

  return (
    <div>
      <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <CreateWorkspacesForm onCancel={() => setIsOpen(false)} />
      </ResponsiveModal>
    </div>
  );
};
