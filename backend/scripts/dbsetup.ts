import "dotenv/config";
import { readFileSync } from "node:fs";
import { Pool } from "pg";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL missing");

async function run(): Promise<void> {
  const pool = new Pool({ connectionString: url });

  const schema = readFileSync("sql/schema.sql", "utf8");
  const seed = readFileSync("sql/seed.sql", "utf8");

  await pool.query(schema);
  await pool.query(seed);

  await pool.end();
  console.log("DB schema + seed applied.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
