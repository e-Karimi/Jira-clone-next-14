import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $post = client.api.auth.login.$post;

type ResponseType = InferResponseType<typeof $post>;
type RequestType = InferRequestType<typeof $post>;

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await $post({ json });

      if (!response.ok) {
        toast.error("Faild to log in");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged in");
      // Invalidate and refetch
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Faild to log in");
    },
  });

  return mutation;
};
