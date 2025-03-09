import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $patch = client.api.tasks[":taskId"]["$patch"];

type ResponseType = InferResponseType<typeof $patch, 200>;
type RequestType = InferRequestType<typeof $patch>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await $patch({ json, param });

      if (!response.ok) {
        toast.error("Faild to update task");
        throw new Error("Faild to update task");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task updated");
      //Invalidate
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Faild to update task");
    },
  });

  return mutation;
};
