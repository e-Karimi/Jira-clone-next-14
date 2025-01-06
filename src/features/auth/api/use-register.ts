import { useMutation } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

const $post = client.api.auth.register.$post;

type RequestType = InferRequestType<typeof $post>;
type ResponseType = InferResponseType<typeof $post>;

export const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await $post({ json });
      return await response.json();
    },
  });

  return mutation;
};
