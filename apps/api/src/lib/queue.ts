import { Queue } from "bullmq";
import { Redis as IORedis } from "ioredis";

export const redisConnection = new IORedis(
  process.env.REDIS_URL ?? "redis://localhost:6379",
  { maxRetriesPerRequest: null },
);

export const GENERATIONS_QUEUE = "generations";

export const generationsQueue = new Queue(GENERATIONS_QUEUE, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 500,
    removeOnFail: 500,
  },
});

export interface GenerationJobData {
  generationId: string;
}
