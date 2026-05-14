import { dictionariesApi } from "./dictionary.api";
import { createMutationHook } from "@/lib/tanstack/createMutationHook";
import { createQueryHook } from "@/lib/tanstack/createQueryHook";

export const useCities = createQueryHook({
  queryFn: dictionariesApi.getCities,
  queryKey: () => ["cities"],
});

export const useCreateCity = createMutationHook({
  mutationFn: dictionariesApi.createCity,
});
