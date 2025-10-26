import { betterAuth } from "better-auth";
import "dotenv/config";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../db";
export const auth = betterAuth({
  baseURL: "http://localhost:8000",
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
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
