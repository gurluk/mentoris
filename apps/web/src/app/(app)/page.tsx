import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/tanstack/query-client";

export default async function Homepage() {
  const queryClient = getQueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: queryKeys.cities.all(),
  //   queryFn: citiesApi.getCities,
  // });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>test</div>
    </HydrationBoundary>
  );
}
