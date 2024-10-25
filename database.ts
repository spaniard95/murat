import { neon } from "@neon/serverless";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import DATABASE_URL from "./envFix.ts";

const databaseUrl = Deno.env.get("DATABASE_URL") || DATABASE_URL;
console.log(config());
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}

const sql = neon(databaseUrl);

export { sql as db };
