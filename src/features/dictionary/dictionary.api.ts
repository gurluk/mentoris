import { apiClient } from "@/lib/axios/api-client";

export const dictionariesApi = {
  getCities: async () => {
    const res = await apiClient.get("/dictionary/cities");

    return res.data;
  },
  createCity: async (_: void) => {
    const res = await apiClient.post("/dictionary/cities");
    return res.data;
  },
};
