import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	// TODO change to something more conservative for prod
	limiter: Ratelimit.slidingWindow(20, "10 s"),
	analytics: true,
	prefix: "@upstash/ratelimit",
});
