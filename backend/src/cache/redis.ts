import { createClient, type RedisClientType } from "redis";

const redisUrl: string | undefined = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is missing in environment variables");
}

export const redis: RedisClientType = createClient({ url: redisUrl });

redis.on("error", (err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  // eslint-disable-next-line no-console
  console.error("Redis error:", msg);
});
