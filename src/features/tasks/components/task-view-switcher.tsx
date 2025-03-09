"use client";

import { useCallback } from "react";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { UseGetTasks } from "../api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DataFilters } from "./data-filters";
import { useTasksFilters } from "../hooks/use-tasks-filters";
import { DataTable } from "./data-tabel";
import { columns } from "./columns";
import { DataKanban } from "./data-kanban";
import { TaskStatus } from "../types";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { DataCalender } from "./data-calender";

interface TaskViewSwitcherProps {
  hideProjectFilters?: boolean;
}

export const TaskViewSwitcher = ({ hideProjectFilters }: TaskViewSwitcherProps) => {
  const { setIsOpen } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const [{ projectId, assigneeId, dueDate, search, status }] = useTasksFilters();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();
  const { data: tasks, isLoading: isLoadingTasks } = UseGetTasks({
    workspaceId,
    projectId,
    assigneeId,
    dueDate,
    search,
    status,
  });

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "tabel",
  });

  const onKanbanChane = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({ json: { tasks } });
    },
    [bulkUpdate]
  );

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="flex-1 w-full border rounded-lg ">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="tabel" className="h-8 w-full lg:w-auto">
              Tabel
            </TabsTrigger>
            <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calender" className="h-8 w-full lg:w-auto">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button onClick={() => setIsOpen(true)} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            New Task
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters hideProjectFilters={hideProjectFilters} />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="tabel" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban data={tasks?.documents ?? []} onChange={onKanbanChane} />
            </TabsContent>
            <TabsContent value="calender" className="mt-0 h-full">
              <DataCalender data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
