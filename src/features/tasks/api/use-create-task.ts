import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $post = client.api.tasks.$post;

type ResponseType = InferResponseType<typeof $post, 200>;
type RequestType = InferRequestType<typeof $post>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await $post({ json });
      
      if (!response.ok) {
        toast.error("Faild to create task");
        throw new Error("Faild to create task");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Task created");
      //Invalidate
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Faild to create task");
    },
  });

  return mutation;
};
