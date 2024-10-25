import { neon } from "@neon/serverless";

const databaseUrl = Deno.env.get("DATABASE_URL");
console.log("DATABASE_URL", databaseUrl);

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}

const sql = neon(databaseUrl);

export { sql as db };
