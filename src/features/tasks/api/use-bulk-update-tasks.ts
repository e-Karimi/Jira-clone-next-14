import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $post = client.api.tasks["bulk-update"]["$post"];

type ResponseType = InferResponseType<typeof $post, 200>;
type RequestType = InferRequestType<typeof $post>;

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await $post({ json });

      if (!response.ok) {
        toast.error("Faild to update tasks");
        throw new Error("Faild to update tasks");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Tasks updated");
      //Invalidate
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Faild to update tasks");
    },
  });

  return mutation;
};
