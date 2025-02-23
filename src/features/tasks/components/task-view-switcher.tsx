"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

export const TaskViewSwitcher = () => {
  const { setIsOpen } = useCreateTaskModal();

  return (
    <Tabs defaultValue="tabel" className="flex-1 w-full border rounded-lg ">
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
        TODO : ADD FILTERS
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="tabel" className="mt-0">
            Data tabel{" "}
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Data kanban{" "}
          </TabsContent>
          <TabsContent value="calender" className="mt-0">
            Data calender{" "}
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
