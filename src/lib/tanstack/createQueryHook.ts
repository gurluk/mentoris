import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

type QueryOptions<TResponse> = Omit<
  UseQueryOptions<TResponse, Error>,
  "queryKey" | "queryFn"
>;

type AnyAsyncFn = (...args: any[]) => Promise<any>;

type CreateQueryHookParams<TQueryFn extends AnyAsyncFn> = {
  queryKey:
    | readonly unknown[]
    | ((payload: Parameters<TQueryFn>[0]) => readonly unknown[]);
  queryFn: TQueryFn;
  queryOptions?: QueryOptions<Awaited<ReturnType<TQueryFn>>>;
};

export function createQueryHook<TQueryFn extends AnyAsyncFn>({
  queryKey,
  queryFn,
  queryOptions: baseOptions,
}: CreateQueryHookParams<TQueryFn>) {
  type Payload = Parameters<TQueryFn>[0];
  type Response = Awaited<ReturnType<TQueryFn>>;

  function useGeneratedQuery(
    ...args: Payload extends undefined
      ? [options?: QueryOptions<Response>]
      : [payload: Payload, options?: QueryOptions<Response>]
  ) {
    const payload = (args.length === 2 ? args[0] : undefined) as Payload;

    const overrideOptions = (
      args.length === 2 ? args[1] : args[0]
    ) as QueryOptions<Response>;

    return useQuery({
      queryKey: typeof queryKey === "function" ? queryKey(payload) : queryKey,

      queryFn: () => queryFn(payload),

      ...baseOptions,
      ...overrideOptions,
    });
  }

  return useGeneratedQuery;
}
