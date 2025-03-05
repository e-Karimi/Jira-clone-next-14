import { useCallback, useEffect, useState } from "react";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import { Task, TaskStatus } from "../types";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanbanCard";

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TaskState = {
  [key in TaskStatus]: Task[];
};

interface DataKanbanProps {
  data: Task[];
  onChange: (tasks: { $id: string; status: TaskStatus; position: number }[]) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TaskState>(() => {
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task: Task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort((a: Task, b: Task) => a.position - b.position);
    });

    return initialTasks;
  });

  useEffect(() => {
    const newTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };
    data.forEach((task: Task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TaskStatus].sort((a: Task, b: Task) => a.position - b.position);
    });

    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      let updatesPayload: { $id: string; status: TaskStatus; position: number }[] = [];

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        //safety remove tasks from the source column
        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        // If there's no moved task ( shouldn't happen but just in case) return the previous state
        if (!movedTask) {
          console.error("No task found at the source index");
          return prevTasks;
        }
        //Create a new task object potentially updated status
        const updatedMovedTask =
          sourceStatus != destinationStatus ? { ...movedTask, status: destinationStatus } : movedTask;

        //Update the source column
        movedTask[sourceStatus] = sourceColumn;

        // Add the task to the destination column
        const destinationColumn = [...newTasks[destinationStatus]];

        destinationColumn.splice(destination.index, 0, updatedMovedTask);

        newTasks[destinationStatus] = destinationColumn;

        //Prepare minmal update payload
        updatesPayload = [];

        //Always update the moved task
        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000),
        });

        //Update positions for affected tasks in the destination column
        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);

            if (task.position !== newPosition) {
              updatesPayload.push({ $id: task.$id, status: destinationStatus, position: newPosition });
            }
          }
        });

        //If the task moved between colums, update positions in the source column
        // It means the colum is changed
        if (sourceStatus !== destinationStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 1_000_000);

              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }
        return newTasks;
      });

      onChange(updatesPayload);
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div key={board} className="flex-1  mx-1 bg-muted p-1.5 rounded-md min-w-[200px]">
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
            <Droppable droppableId={board}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px] py-1.5 text-[13px]">
                  {tasks[board].map((task, index) => (
                    <Draggable key={task.$id} draggableId={task.$id} index={index}>
                      {(provided) => (
                        <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                          <KanbanCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
