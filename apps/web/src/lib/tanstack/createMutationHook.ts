import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

type MutationOptions<TRequest, TResponse> = Omit<
  UseMutationOptions<TResponse, Error, TRequest>,
  "mutationFn"
>;

type AnyAsyncFn = (...args: any[]) => Promise<any>;

type CreateMutationHookParams<TMutationFn extends AnyAsyncFn> = {
  mutationFn: TMutationFn;

  mutationOptions?: MutationOptions<
    Parameters<TMutationFn>[0],
    Awaited<ReturnType<TMutationFn>>
  >;
};

export function createMutationHook<TMutationFn extends AnyAsyncFn>({
  mutationFn,
  mutationOptions: baseOptions,
}: CreateMutationHookParams<TMutationFn>) {
  type Payload = Parameters<TMutationFn>[0];
  type Response = Awaited<ReturnType<TMutationFn>>;

  return function useGeneratedMutation(
    overrideOptions?: MutationOptions<Payload, Response>,
  ) {
    return useMutation({
      mutationFn,
      ...baseOptions,
      ...overrideOptions,
    });
  };
}
