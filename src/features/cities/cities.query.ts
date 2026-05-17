import { citiesApi } from "./cities.api";
import { createMutationHook } from "@/lib/tanstack/createMutationHook";
import { createQueryHook } from "@/lib/tanstack/createQueryHook";
import { queryKeys } from "@/lib/tanstack/query-keys";

export const getCities = createQueryHook({
  queryKey: queryKeys.cities.all(),
  queryFn: citiesApi.getCities,
});

export const useCreateCity = createMutationHook({
  mutationFn: citiesApi.createCity,
});
