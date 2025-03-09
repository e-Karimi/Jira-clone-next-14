import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $patch = client.api.projects[":projectId"]["$patch"];

type RequestType = InferRequestType<typeof $patch>;
type ResponseType = InferResponseType<typeof $patch>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await $patch({ form, param });

      if (!response.ok) {
        toast.error("Faild to update project");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project updated");

      //Invalidate
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data?.$id] });
    },
    onError: () => {
      toast.error("Faild to update project");
    },
  });

  return mutation;
};
