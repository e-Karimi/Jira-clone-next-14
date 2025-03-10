import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface useGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

const $get = client.api.workspaces[":workspaceId"]["analytics"]["$get"];

export type WorkspaceAnalyticsResponseType = InferResponseType<typeof $get, 200>;

export const useGetWorkspaceAnalytics = ({ workspaceId }: useGetWorkspaceAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await $get({ param: { workspaceId } });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace analytics");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
