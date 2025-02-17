"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateProjectForm } from "./create-project-form";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";

export const CreateProjectModal = () => {
  const { isOpen, setIsOpen } = useCreateProjectModal();

  return (
    <div>
      <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <CreateProjectForm onCancel={() => setIsOpen(false)} />
      </ResponsiveModal>
    </div>
  );
};
