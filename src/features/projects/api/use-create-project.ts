import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $post = client.api.projects.$post;

type ResponseType = InferResponseType<typeof $post, 200>;
type RequestType = InferRequestType<typeof $post>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await $post({ form });

      if (!response.ok) {
        toast.error("Faild to create project");
        throw new Error("Faild to create project");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Project created");
      //Invalidate
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Faild to create project");
    },
  });

  return mutation;
};
