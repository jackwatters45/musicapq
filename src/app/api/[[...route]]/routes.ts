import { Redis } from "@upstash/redis/cloudflare";
import { Ratelimit } from "@upstash/ratelimit";

import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import type { Context, Env } from "hono";

declare module "hono" {
	interface ContextVariableMap {
		ratelimit: Ratelimit;
	}
}

export const runtime = "edge";

const app = new Hono().basePath("/api");

const cache = new Map();

type EnvConfig = {
	UPSTASH_REDIS_REST_TOKEN: string;
	UPSTASH_REDIS_REST_URL: string;
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class RedisRaterLimiter {
	static instance: Ratelimit;

	static getInstance(c: Context<Env>) {
		if (!RedisRaterLimiter.instance) {
			const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
				env<EnvConfig>(c);

			const redisClient = new Redis({
				token: UPSTASH_REDIS_REST_TOKEN,
				url: UPSTASH_REDIS_REST_URL,
			});

			const ratelimit = new Ratelimit({
				redis: redisClient,
				limiter: Ratelimit.slidingWindow(20, "10 s"),
				ephemeralCache: cache,
			});

			RedisRaterLimiter.instance = ratelimit;
			return RedisRaterLimiter.instance;
		}

		return RedisRaterLimiter.instance;
	}
}

app.use(async (c, next) => {
	const ratelimit = RedisRaterLimiter.getInstance(c);
	c.set("ratelimit", ratelimit);
	await next();
});

app.use("/*", cors());
app.get("/search", async (c) => {
	try {
		const ratelimit = c.get("ratelimit");
		const ip = c.req.raw.headers.get("CF-Connecting-IP");

		const { success } = await ratelimit.limit(ip ?? "anonymous");
		if (!success) {
			return c.json({ message: "Rate limit exceeded" }, { status: 429 });
		}

		const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
			env<EnvConfig>(c);

		if (!UPSTASH_REDIS_REST_TOKEN || !UPSTASH_REDIS_REST_URL) {
			throw new Error("Missing Upstash Redis REST token or URL");
		}

		const start = performance.now();
		// ---------------------

		const redis = new Redis({
			token: UPSTASH_REDIS_REST_TOKEN,
			url: UPSTASH_REDIS_REST_URL,
		});

		const query = c.req.query("q")?.toUpperCase();

		if (!query) {
			return c.json({ message: "Invalid search query" }, { status: 400 });
		}

		const res = [];
		const rank = await redis.zrank("terms", query);

		if (rank !== null && rank !== undefined) {
			const temp = await redis.zrange<string[]>("terms", rank, rank + 100);

			for (const el of temp) {
				if (!el.startsWith(query)) {
					break;
				}

				if (el.endsWith("*")) {
					res.push(el.substring(0, el.length - 1));
				}
			}
		}

		// ------------------------
		const end = performance.now();

		return c.json({
			results: res,
			duration: end - start,
		});
	} catch (err) {
		console.error(err);

		return c.json(
			{ results: [], message: "Something went wrong." },
			{
				status: 500,
			},
		);
	}
});

export const GET = handle(app);
export default app as never;
