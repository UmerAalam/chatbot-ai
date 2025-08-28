import { hc } from "hono/client";
import type { AppType } from "../../server/src/server";

const client = hc<AppType>("http://localhost:8000");
export default client;
