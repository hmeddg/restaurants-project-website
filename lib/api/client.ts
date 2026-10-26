import "server-only";
import type { z } from "zod";
import { ApiErrorDetailSchema } from "@/lib/api/schemas";
import { getEnv } from "@/lib/env";

const TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Machine-readable reason from the API, e.g. "slot_unavailable". */
    readonly code?: string,
    readonly items?: string[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Every request states its caching strategy explicitly.
type CacheOptions =
  | { cache: "no-store"; next?: never; cachedBy?: never }
  | {
      next: { revalidate: number; tags: string[] };
      cache?: never;
      cachedBy?: never;
    }
  /** The caller is a "use cache" function with cacheLife/cacheTag. */
  | { cachedBy: "use cache"; cache?: never; next?: never };

type ApiRequestOptions = CacheOptions & {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Response schema. Omit when the response body is not used. */
  schema?: z.ZodType;
};

function isRetryable(error: unknown) {
  if (error instanceof ApiError) return error.status >= 500;
  // Network failures surface as TypeError from fetch; timeouts are not retried.
  return error instanceof TypeError;
}

async function readErrorDetail(response: Response) {
  try {
    const parsed = ApiErrorDetailSchema.safeParse(await response.json());
    return parsed.success ? parsed.data.detail : undefined;
  } catch {
    return undefined;
  }
}

async function send(path: string, options: ApiRequestOptions) {
  const { API_URL, API_KEY } = getEnv();
  const { method = "GET", body, schema, cache, next } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(API_KEY && { "x-api-key": API_KEY }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    ...(cache && { cache }),
    ...(next && { next }),
  });

  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new ApiError(
      response.status,
      `${method} ${path} failed`,
      detail?.code,
      detail?.items,
    );
  }
  if (!schema) return undefined;

  const parsed = schema.safeParse(await response.json());
  if (!parsed.success) {
    throw new ApiError(response.status, `${method} ${path} returned bad data`);
  }
  return parsed.data;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions & { schema: z.ZodType<T> },
): Promise<T>;
export async function apiRequest(
  path: string,
  options: ApiRequestOptions & { schema?: undefined },
): Promise<void>;
export async function apiRequest(path: string, options: ApiRequestOptions) {
  try {
    return await send(path, options);
  } catch (error) {
    const method = options.method ?? "GET";
    if (method === "GET" && isRetryable(error)) return send(path, options);
    throw error;
  }
}
