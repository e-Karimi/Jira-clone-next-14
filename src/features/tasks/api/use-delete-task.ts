import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";


const $delete = client.api.tasks[":taskId"]["$delete"];

type ResponseType = InferResponseType<typeof $delete, 200>;
type RequestType = InferRequestType<typeof $delete>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();


  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await $delete({ param });

      if (!response.ok) {
        toast.error("Faild to delete task");
        throw new Error("Faild to delete task");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task deleted");
      //Invalidate
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Faild to delete task");
    },
  });

  return mutation;
};
