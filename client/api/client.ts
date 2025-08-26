// src/api/client.ts
import { hc } from "hono/client";
import type { AppType } from "../../server/src/server";

export const client = hc<AppType>("http://localhost:8000");

export const getData = async () => {
  const res = await client.api.lorem.$get();
  const json = await res.json();
  console.log("Data", json);
  return json;
};
