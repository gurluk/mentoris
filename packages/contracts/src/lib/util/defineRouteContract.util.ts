export type RoutePathBuilder = (...args: any[]) => string;

export type RoutePathBuilders<TPaths extends Record<string, string>> = {
  [TKey in keyof TPaths]: RoutePathBuilder;
};

export type RouteContract<
  TPaths extends Record<string, string>,
  TApi extends RoutePathBuilders<TPaths>,
> = {
  prefix: string;
  paths: TPaths;
  api: TApi;
};

const joinPaths = (prefix: string, path: string) => {
  if (path === "") return prefix;
  return `${prefix}${path.startsWith("/") ? path : `/${path}`}`;
};

export function defineRouteContract<
  const TPaths extends Record<string, string>,
  const TApi extends RoutePathBuilders<TPaths>,
>(contract: {
  prefix: string;
  paths: TPaths;
  api: TApi;
}): RouteContract<TPaths, TApi> {
  const api = Object.fromEntries(
    Object.entries(contract.api).map(([key, builder]) => [
      key,
      (...args: unknown[]) => joinPaths(contract.prefix, builder(...args)),
    ]),
  ) as TApi;

  return {
    ...contract,
    api,
  };
}
