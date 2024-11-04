import { neon } from "@neon/serverless";

// const wsNeonUrl = Deno.env.get("DATABASE_POOL_URL");
// const ws = new WebSocket(wsNeonUrl);
// neonConfig.webSocketConstructor = ws; // <-- this is the key bit

// ws.onopen = () => {
//   console.log("WebSocket connection established");
// };

const databaseUrl = Deno.env.get("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}

const sql = neon(databaseUrl);

export { sql as db };
