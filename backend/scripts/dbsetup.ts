import "dotenv/config";
import { readFileSync } from "node:fs";
import { Pool, type QueryResult } from "pg";

const databaseUrl: string | undefined = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

function withDatabase(url: string, dbName: string): string {
  const u = new URL(url);
  u.pathname = `/${dbName}`;
  return u.toString();
}

function assertSafeIdentifier(name: string): void {
  const ok: boolean = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
  if (!ok) throw new Error(`Unsafe identifier: "${name}"`);
}

async function ensureDatabaseExists(
  adminPool: Pool,
  dbName: string,
): Promise<void> {
  assertSafeIdentifier(dbName);

  const existsResult: QueryResult<{ exists: boolean }> = await adminPool.query(
    "SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = $1) AS exists;",
    [dbName],
  );

  const existsRow = existsResult.rows[0];
  const exists: boolean = Boolean(existsRow?.exists);

  if (exists) {
    console.log(`Database "${dbName}" already exists`);
    return;
  }

  await adminPool.query(`CREATE DATABASE ${dbName};`);
  console.log(`Database "${dbName}" created`);
}

async function run(): Promise<void> {
  const targetDb: string = process.env.DB_NAME ?? "hospital_gis";

  const adminPool: Pool = new Pool({
    connectionString: withDatabase(databaseUrl, "postgres"),
  });

  try {
    await ensureDatabaseExists(adminPool, targetDb);
  } finally {
    await adminPool.end();
  }

  const appPool: Pool = new Pool({
    connectionString: withDatabase(databaseUrl, targetDb),
  });

  try {
    const schemaSql: string = readFileSync("sql/schema.sql", "utf8");
    const seedSql: string = readFileSync("sql/seed.sql", "utf8");

    await appPool.query(schemaSql);
    await appPool.query(seedSql);

    console.log("Database schema and seed applied successfully");
  } finally {
    await appPool.end();
  }
}

run().catch((err: unknown) => {
  const message: string = err instanceof Error ? err.message : String(err);
  console.error("DB setup failed:", message);
  process.exit(1);
});
