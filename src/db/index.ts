import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";
import { env } from "@/lib/env";

export type DB = NodePgDatabase<typeof schema>;

// Prevent multiple connections in dev (VERY important in Next.js)
const globalForDb = globalThis as unknown as {
  pool?: Pool;
  db?: DB;
};

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: env.DATABASE_URL,
  });

const db = globalForDb.db ?? drizzle(pool, { schema });

// store in global (fixes hot reload + serverless re-init issues)
if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
  globalForDb.db = db;
}

export { db };
