"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { UseGetTasks } from "../api/use-get-task";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DataFilters } from "./data-filters";
import { useTasksFilters } from "../hooks/use-tasks-filters";

export const TaskViewSwitcher = () => {
  const { setIsOpen } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const [{ projectId, assigneeId, dueDate, search, status }] = useTasksFilters();

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
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="tabel" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              Data kanban{" "}
            </TabsContent>
            <TabsContent value="calender" className="mt-0">
              Data calender{" "}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
