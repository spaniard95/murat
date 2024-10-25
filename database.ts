import { neon } from "@neon/serverless";

const databaseUrl = Deno.env.get("DATABASE_URL")!;

console.log("Database URL:", databaseUrl);
const sql = neon(databaseUrl);
