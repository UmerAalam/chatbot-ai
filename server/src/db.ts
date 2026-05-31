import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "./env";

const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client: queryClient });

export default db;
