import Link from "next/link";

import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, PlusIcon } from "lucide-react";

import { Task } from "@/features/tasks/types";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { DottedSeparator } from "./dotted-separator";

interface TaskListProps {
  data: Task[];
  total: number;
  workspaceId: string;
}

export default function TaskList({ data, total, workspaceId }: TaskListProps) {
  const { setIsOpen } = useCreateTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-slate-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button variant="secondary" size="icon" onClick={() => setIsOpen(true)}>
            <PlusIcon className="size-4 text-blue-700 rounded-full " />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id} className="">
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p className="">{task.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">{formatDistanceToNow(new Date(task.dueDate))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">No tasks found</li>
        </ul>
        <Button asChild variant="tertiary" className="mt-4 w-full">
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
}
