import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envInCwd = resolve(process.cwd(), ".env");
const envInParent = resolve(process.cwd(), "../.env");
const envPath = existsSync(envInCwd) ? envInCwd : envInParent;

config({ path: envPath, override: true });
