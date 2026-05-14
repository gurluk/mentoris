import { db } from "@/db";
import { cities } from "@/db/schema";

export const dictionaryService = {
  async getCities() {
    const data = await db.select().from(cities);

    if (!data) {
      throw new Error("errorrrr");
    }

    return data;
  },
};
