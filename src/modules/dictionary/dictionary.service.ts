import { cities, offerCategories } from "~/db/schema";

import { DictionaryServiceDeps } from "./dictionary.types";

export function createDictionaryService(deps: DictionaryServiceDeps) {
	const { db } = deps;

	async function getCitiesDictionary() {
		return await db.select().from(cities);
	}

	async function getCategoriesDictionary() {
		return await db.select().from(offerCategories);
	}

	return {
		getCitiesDictionary,
		getCategoriesDictionary,
	};
}
