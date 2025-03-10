import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  if (!data) return null;
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total tasks"
            value={data.tasksCount}
            variant={data.tasksDifference > 0 ? "up" : "down"}
            increaseValue={data.tasksDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned tasks"
            value={data.assignedTasksCount}
            variant={data.assignedTasksDifference > 0 ? "up" : "down"}
            increaseValue={data.assignedTasksDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed tasks"
            value={data.completeTasksCount}
            variant={data.completeTasksDifference > 0 ? "up" : "down"}
            increaseValue={data.completeTasksDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue tasks"
            value={data.OverdueTasksCount}
            variant={data.OverdueTasksDifference > 0 ? "up" : "down"}
            increaseValue={data.OverdueTasksDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="inComplete tasks"
            value={data.incompleteTasksCount}
            variant={data.incompleteTasksDifference > 0 ? "up" : "down"}
            increaseValue={data.incompleteTasksDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
