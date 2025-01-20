import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $post = client.api.workspaces.$post;

type ResponseType = InferResponseType<typeof $post>;
type RequestType = InferRequestType<typeof $post>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await $post({ json });

      if (!response.ok) {
        toast.error("Faild to create workspace");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace created");
      // Invalidate
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error("Faild to create workspace");
    },
  });

  return mutation;
};
