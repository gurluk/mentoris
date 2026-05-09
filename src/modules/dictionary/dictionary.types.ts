import { DB } from "~/plugins/db.plugin";

import { createDictionaryService } from "./dictionary.service";

export type DictionaryService = ReturnType<typeof createDictionaryService>;
export type DictionaryServiceDeps = {
	db: DB;
};
