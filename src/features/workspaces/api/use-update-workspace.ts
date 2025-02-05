/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $patch = client.api.workspaces[":workspaceId"]["$patch"];

type RequestType = InferRequestType<typeof $patch>;
type ResponseType = InferResponseType<typeof $patch>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await $patch({ form, param });

      if (!response.ok) {
        toast.error("Faild to update workspace");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated");
      //Invalidate
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      data && queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Faild to update workspace");
    },
  });

  return mutation;
};
