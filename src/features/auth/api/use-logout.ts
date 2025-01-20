import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

const $post = client.api.auth.logout.$post;

type ResponseType = InferResponseType<typeof $post>;

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await $post();

      if (!response.ok) {
        toast.error("Faild to log out");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged out");
      // Invalidate and refetch
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Faild to log out");
    },
  });
  return mutation;
};
