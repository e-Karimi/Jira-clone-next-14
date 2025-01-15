import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient, } from "@tanstack/react-query";
import type { InferResponseType } from "hono";

import { client } from "@/lib/rpc";


const $post = client.api.auth.logout.$post;

type ResponseType = InferResponseType<typeof $post>;

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await $post();
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
  });
  return mutation;
};
