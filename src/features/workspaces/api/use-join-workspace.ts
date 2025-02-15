import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $post = client.api.workspaces[":workspaceId"]["join"]["$post"];

type RequestType = InferRequestType<typeof $post>;
type ResponseType = InferResponseType<typeof $post, 200>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await $post({ param, json });

      if (!response.ok) {
        toast.error("Faild to join workspace ");
        throw new Error("Faild to join workspace ");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("joined workspace ");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Faild to join workspace ");
    },
  });
  return mutation;
};
