import { hc } from "hono/client";
import type { AppType } from "../../server/src/server";

export const client = hc<AppType>("http://localhost:8000");
