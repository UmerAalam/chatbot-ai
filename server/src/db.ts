// import { drizzle } from "drizzle-orm/neon-http";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL! as string,
  },
});
export default db;
