/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $delete = client.api.projects[":projectId"]["$delete"];

type RequestType = InferRequestType<typeof $delete>;
type ResponseType = InferResponseType<typeof $delete, 200>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await $delete({ param });

      if (!response.ok) {
        toast.error("Faild to delete project");
        throw new Error("Faild to delete project");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("project deleted");
      //Invalidate
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      data && queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Faild to delete project");
    },
  });

  return mutation;
};
