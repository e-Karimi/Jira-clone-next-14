import { MoreHorizontal } from "lucide-react";
import { Task } from "../types";
import { TaskActions } from "./task-actions";
import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface KanbanCard {
  task: Task;
}

export const KanbanCard = ({ task }: KanbanCard) => {
  return (
    <div className=" bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-">
      <div className="flex items-start justify-between gap-x-3">
        <p className="line-clamp-2"> {task.name}</p>
        <TaskActions projectId={task.projectId} id={task.$id}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <DottedSeparator className="py-1.5" />
      <div className="flex items-center gap-x-1.5 ">
        <MemberAvatar name={task.assignee.name} fullbackClassName="text-[10px]" />
        <div className="flex items-center size-1 rounded-full bg-neutral-300">
          <TaskDate value={task.dueDate} className="pl-2 text-xs " />
        </div>
      </div>
      <div className="flex items-center gap-x-1.5 mt-1.5">
        <ProjectAvatar name={task.project.name} image={task.project.imageUrl} fallbackclassName="text-[10px]" />
        <span className=" text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
};
