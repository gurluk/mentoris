import { httpClient } from "@/lib/http/http-client";
import { httpServer } from "@/lib/http/http-server";
import { isServer } from "@/lib/http/isServer";

export const citiesApi = {
  async getCities() {
    if (isServer) {
      return httpServer("/dictionaries/cities", {
        method: "GET",
      });
    }

    const { data } = await httpClient.get(`/dictionaries/cities`);
    return data;
  },

  async createCity(body: { label: string; code: string }) {
    const { data } = await httpClient.post<{ result: string }>(
      "/dictionaries/cities",
      body,
    );
    return data;
  },
};
