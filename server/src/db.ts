import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db/schema";

const connectionString =
  process.env.DATABASE_URL_POSTGRES?.trim() ||
  process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error(
    "DATABASE_URL or DATABASE_URL_POSTGRES must be provided in the environment",
  );
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

const db = drizzle(pool, { schema });

export default db;
