import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $patch = client.api.members[":memberId"]["$patch"];

type RequestType = InferRequestType<typeof $patch>;
type ResponseType = InferResponseType<typeof $patch, 200>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await $patch({ param, json });

      if (!response.ok) {
        toast.error("Faild to update member");
        throw new Error("Faild to update member");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member updated");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("Faild to update member");
    },
  });

  return mutation;
};
