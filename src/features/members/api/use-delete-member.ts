import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $delete = client.api.members[":memberId"]["$delete"];

type RequestType = InferRequestType<typeof $delete>;
type ResponseType = InferResponseType<typeof $delete, 200>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await $delete({ param });

      if (!response.ok) {
        toast.error("Faild to delete member");
        throw new Error("Faild to delete member");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member deleted");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("Faild to delete member");
    },
  });

  return mutation;
};
