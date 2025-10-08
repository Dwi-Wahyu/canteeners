import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisPub = createClient({ url: redisUrl });
export const redisSub = redisPub.duplicate();

let connected = false;

export async function connectRedis() {
  if (!connected) {
    await Promise.all([redisPub.connect(), redisSub.connect()]);
    connected = true;
  }
}
