/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import { PencilIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateTask } from "../api/use-update-task";
import { DottedSeparator } from "@/components/dotted-separator";
import { Task } from "../types";

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate({
      json: { description: value },
      param: { taskId: task.$id },
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button onClick={() => setIsEditing((prev) => !prev)} disabled={isPending} size="sm" variant="secondary">
          {isEditing ? <XIcon className="size-4" /> : <PencilIcon className="size-4 mr-2" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            placeholder="Add a description..."
            disabled={isPending}
          />
          <Button onClick={handleSave} size="sm" className="w-full mt-auto" disabled={isPending}>
            {isPending ? " Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 text-sm">
          <div>{task?.description || <span className="text-muted-foreground">No description set</span>}</div>
        </div>
      )}
    </div>
  );
};
