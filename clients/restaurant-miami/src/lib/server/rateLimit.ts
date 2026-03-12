import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type SlidingWindow = `${number} s` | `${number} m` | `${number} h` | `${number} d`;

type RouteRateLimitInput = {
  request: NextRequest;
  namespace: string;
  limit: number;
  window: SlidingWindow;
  identifier?: string;
};

type RouteRateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  reason?: string;
};

let redisClient: Redis | null | undefined;
const rateLimiterCache = new Map<string, Ratelimit>();
let rateLimitWarningShown = false;

function getRedisClient(): Redis | null {
  if (redisClient !== undefined) return redisClient;

  const url = String(process.env.UPSTASH_REDIS_REST_URL || "").trim();
  const token = String(process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
  if (!url || !token) {
    redisClient = null;
    return redisClient;
  }

  redisClient = new Redis({
    url,
    token,
  });
  return redisClient;
}

function sanitizeNamespace(input: string): string {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:_-]/g, "_")
    .slice(0, 80);
}

function sanitizeIdentifier(input: string): string {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:._-]/g, "_")
    .slice(0, 180);
}

function resolveRequestIp(request: NextRequest): string {
  const forwardedFor = String(request.headers.get("x-forwarded-for") || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)[0];
  if (forwardedFor) return forwardedFor;
  const realIp = String(request.headers.get("x-real-ip") || "").trim();
  if (realIp) return realIp;
  return "unknown";
}

function resolveRateLimitIdentifier(request: NextRequest, inputIdentifier?: string): string {
  const provided = sanitizeIdentifier(inputIdentifier || "");
  if (provided) return provided;
  return sanitizeIdentifier(resolveRequestIp(request));
}

function getRateLimiter(namespace: string, limit: number, window: SlidingWindow): Ratelimit | null {
  const redis = getRedisClient();
  if (!redis) return null;

  const safeNamespace = sanitizeNamespace(namespace);
  const safeLimit = Math.max(1, Math.floor(limit || 1));
  const cacheKey = `${safeNamespace}:${safeLimit}:${window}`;
  const existing = rateLimiterCache.get(cacheKey);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(safeLimit, window),
    prefix: `fp:rl:${safeNamespace}`,
    analytics: false,
  });
  rateLimiterCache.set(cacheKey, limiter);
  return limiter;
}

export async function enforceRouteRateLimit(
  input: RouteRateLimitInput,
): Promise<RouteRateLimitResult> {
  const safeLimit = Math.max(1, Math.floor(input.limit || 1));
  const failOpen = (reason: string): RouteRateLimitResult => ({
    allowed: true,
    limit: safeLimit,
    remaining: safeLimit,
    reset: Date.now() + 60_000,
    reason,
  });

  try {
    const limiter = getRateLimiter(input.namespace, input.limit, input.window);
    if (!limiter) {
      return failOpen("upstash_not_configured");
    }

    const identifier = resolveRateLimitIdentifier(input.request, input.identifier);
    const result = await limiter.limit(identifier);
    return {
      allowed: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    if (!rateLimitWarningShown) {
      console.warn("[RateLimit] Falling back to fail-open mode due to provider error.", error);
      rateLimitWarningShown = true;
    }
    return failOpen("upstash_error");
  }
}
