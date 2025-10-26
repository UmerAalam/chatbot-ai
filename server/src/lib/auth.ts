import { betterAuth } from "better-auth";
import { Pool } from "pg";
import "dotenv/config";

export const auth = betterAuth({
  baseURL: "http://localhost:8000",
  secret: process.env.BETTER_AUTH_SECRET!,
  database: new Pool({
    connectionString: process.env.DATABASE_URL!,
  }),
  trustedOrigins: ["http://localhost:3000"],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: "http://localhost:3000/chatpage",
    },
  },
});
