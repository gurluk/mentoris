import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import Cities from "@/features/cities/Cities";
import { citiesApi } from "@/features/cities/cities.api";
import { getQueryClient } from "@/lib/tanstack/query-client";
import { queryKeys } from "@/lib/tanstack/query-keys";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.cities.all(),
    queryFn: citiesApi.getCities,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Cities />
    </HydrationBoundary>
  );
}
