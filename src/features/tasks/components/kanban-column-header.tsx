import React from "react";
import { TaskStatus } from "../types";
import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  CircleIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleCheckIcon,
  CircleDotIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashedIcon className="size-[18px] text-pink-400" />,
  [TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: <CircleDotDashedIcon className="size-[18px] text-yellow-400" />,
  [TaskStatus.IN_REVIEW]: <CircleDotIcon className="size-[18px] text-blue-400" />,
  [TaskStatus.DONE]: <CircleCheckIcon className="size-[18px] text-emerald-400" />,
};

export const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
  const icon = statusIconMap[board];

  const { setIsOpen } = useCreateTaskModal();
  return (
    <div className=" flex items-center justify-between px-2 py-1.5 w-full">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="flex items-center justify-center size-5 rounded-md bg-neutral-200 text-neutral-700 font-medium text-xs">
          {taskCount}
        </div>
      </div>
      <Button variant="tertiary" size="icon" className="size-5" onClick={() => setIsOpen(true)}>
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
