import { betterAuth } from "better-auth";
import "dotenv/config";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { randomUUID } from "crypto";
import db from "../db";
import * as schema from "../db/schema";
export const auth = betterAuth({
  baseURL: "http://localhost:8000",
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  session: {
    storeSessionInDatabase: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: (data) => ({
          data: { id: data.id ?? randomUUID() },
        }),
      },
    },
    account: {
      create: {
        before: (data) => ({
          data: { id: data.id ?? randomUUID() },
        }),
      },
    },
    session: {
      create: {
        before: (data) => ({
          data: { id: data.id ?? randomUUID() },
        }),
      },
    },
    verification: {
      create: {
        before: (data) => ({
          data: { id: data.id ?? randomUUID() },
        }),
      },
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: "http://localhost:3000/chatpage",
    },
  },
});
