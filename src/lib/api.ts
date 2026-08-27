import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { fieldErrors } from "./validation";

export interface ApiErrorBody {
  error: { code: string; message: string; details?: Record<string, string> };
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, {
    status: 200,
    ...init,
    headers: { "Cache-Control": "no-store", ...(init?.headers ?? {}) },
  });
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201, headers: { "Cache-Control": "no-store" } });
}

export function fail(code: string, message: string, status: number, details?: Record<string, string>) {
  return NextResponse.json<ApiErrorBody>({ error: { code, message, details } }, { status });
}

/** Parses and validates a JSON body, returning either data or a 422 response. */
export async function readJson<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ data: T; response?: never } | { data?: never; response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { response: fail("invalid_json", "Request body must be valid JSON.", 400) };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      response: fail("validation_failed", "One or more fields are invalid.", 422, fieldErrors(parsed.error as ZodError)),
    };
  }
  return { data: parsed.data };
}

/**
 * Fixed-window rate limiter. In production this is backed by Redis or the
 * edge KV; the in-process map here is correct for a single instance and is
 * enough to demonstrate the contract.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export function clientKey(request: Request, scope: string) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `${scope}:${ip}`;
}

export function rateLimitResponse(resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return NextResponse.json<ApiErrorBody>(
    { error: { code: "rate_limited", message: "Too many requests. Please slow down." } },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

/** Human-readable reference for tickets and receipts. */
export function reference(prefix: string) {
  const n = Math.floor(Math.random() * 90_000) + 10_000;
  return `${prefix}-${n}`;
}
