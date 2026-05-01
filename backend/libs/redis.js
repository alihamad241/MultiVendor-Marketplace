import Redis from "ioredis"
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    maxRetriesPerRequest: 1,
    connectTimeout: 5000, // 5 seconds
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err.message);
});

redis.on("connect", () => {
    console.log("Connected to Redis successfully.");
});
// await client.set('foo', 'bar');