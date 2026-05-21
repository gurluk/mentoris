import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "~/env";

import * as schema from "./schema";

export type DB = NodePgDatabase<typeof schema>;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema,
});

export { pool };
