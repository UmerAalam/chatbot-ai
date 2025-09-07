import { hc } from "hono/client";
import type { AppType } from "../../../server/src/server.ts";

export const client = hc<AppType>("http://localhost:3000");
