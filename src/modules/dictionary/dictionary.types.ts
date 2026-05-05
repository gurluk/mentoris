import { AppDb } from "~/types/db.types";

import { createDictionaryService } from "./dictionary.service";

export type DictionaryService = ReturnType<typeof createDictionaryService>;
export type DictionaryServiceDeps = {
	db: AppDb;
};
