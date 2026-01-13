import express, { type Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import hospitalsRouter from "./routes/hospitals";
import proximityRouter from "./routes/proximity";
import ambulancesRouter from "./routes/ambulance";
import { redis } from "./cache/redis";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use("/hospitals", hospitalsRouter);
app.use("/hospitals", proximityRouter);
app.use("/ambulances", ambulancesRouter);

app.get("/health", async (_req, res) => {
  const pong: string = await redis.ping();
  res.json({ ok: true, redis: pong });
});

const port: number = Number(process.env.PORT ?? 5000);

async function start(): Promise<void> {
  if (!redis.isOpen) {
    await redis.connect();
  }

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${port}`);
  });
}

start().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", msg);
  process.exit(1);
});