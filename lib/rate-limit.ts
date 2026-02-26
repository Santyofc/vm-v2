/**
 * lib/rate-limit.ts
 *
 * TRADEOFF — Prisma vs Upstash Redis:
 * Prisma (PostgreSQL): zero new infrastructure, survives Docker restarts,
 * works across replicas sharing the same DB. Latency ~5–15 ms per check —
 * acceptable for auth endpoints (called once per login attempt, not per
 * request on hot paths). Upstash Redis would offer ~1–2 ms but requires a
 * separate managed service and secrets. Given the current single-DB setup,
 * Prisma is the right call for this traffic profile.
 *
 * Strategy: Fixed Window — atomically increment a counter per (key, window).
 * A background flag on the entry stores the window expiry; expired entries
 * are treated as fresh starts. Stale rows accumulate slowly; a periodic
 * `DELETE WHERE resetAt < now()` cron or Prisma migrate can clean them up.
 */

import { prisma } from "@/lib/db";

export type RateLimitOptions = {
  /** Maximum allowed requests in the window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
};

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Extracts the real client IP from the request, trusting the
 * X-Forwarded-For header injected by Nginx.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Checks and increments a rate limit counter stored in PostgreSQL.
 *
 * Uses an upsert with a conditional increment:
 *  - If the row doesn't exist or its window has expired → reset to count=1.
 *  - If the row exists and window is still active → increment.
 *
 * NOTE: This is NOT atomic under extreme concurrency (race between
 * findUnique and upsert). For auth endpoints this is acceptable since
 * a few extra requests slipping through on a race is not a security
 * regression given bcrypt cost already throttles brute force.
 */
export async function checkRateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const now = new Date();

  const existing = await prisma.rateLimitEntry.findUnique({
    where: { key },
    select: { count: true, resetAt: true },
  });

  // Window expired or first request — reset
  if (!existing || existing.resetAt <= now) {
    const resetAt = new Date(Date.now() + options.windowMs);
    await prisma.rateLimitEntry.upsert({
      where: { key },
      create: { key, count: 1, resetAt },
      update: { count: 1, resetAt },
    });
    return {
      success: true,
      remaining: options.limit - 1,
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  // Window still active and limit already reached
  if (existing.count >= options.limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetAt.getTime() - Date.now()) / 1000),
    );
    return { success: false, remaining: 0, retryAfterSeconds };
  }

  // Window still active — increment counter
  const updated = await prisma.rateLimitEntry.update({
    where: { key },
    data: { count: { increment: 1 } },
    select: { count: true, resetAt: true },
  });

  const remaining = Math.max(0, options.limit - updated.count);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((updated.resetAt.getTime() - Date.now()) / 1000),
  );

  return { success: true, remaining, retryAfterSeconds };
}

/**
 * Returns standard HTTP headers for rate limit responses.
 */
export function buildRateLimitHeaders(
  result: RateLimitResult,
  options: RateLimitOptions,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(options.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "Retry-After": String(result.retryAfterSeconds),
  };
}
