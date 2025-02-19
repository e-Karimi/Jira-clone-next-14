import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

const $post = client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"];

type RequestType = InferRequestType<typeof $post>;
type ResponseType = InferResponseType<typeof $post, 200>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await $post({ param });

      if (!response.ok) {
        toast.error("Faild to reset invite code ");
        throw new Error("Faild to reset invite code ");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("invite cod reset");
      //Update server components
      router.refresh();
      //Invalidate
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Faild to reset invite cod");
    },
  });
  return mutation;
};
