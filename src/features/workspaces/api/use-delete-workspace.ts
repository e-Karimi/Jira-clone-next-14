/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $delete = client.api.workspaces[":workspaceId"]["$delete"];

type RequestType = InferRequestType<typeof $delete>;
type ResponseType = InferResponseType<typeof $delete, 200>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await $delete({ param });

      if (!response.ok) {
        toast.error("Faild to delete workspace");
        throw new Error("Faild to delete workspace");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace deleted");
      //Invalidate
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      data && queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Faild to delete workspace");
    },
  });

  return mutation;
};
