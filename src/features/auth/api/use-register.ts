import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $post = client.api.auth.register.$post;

type RequestType = InferRequestType<typeof $post>;
type ResponseType = InferResponseType<typeof $post>;

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await $post({ json });
      
      if (!response.ok) {
        toast.error("Faild to register");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Registered");
      // Invalidate and refetch
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Faild to register");
    },
  });

  return mutation;
};
