import "server-only";
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.url().transform((url) => url.replace(/\/+$/, "")),
  API_KEY: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

// Validated on first use rather than at import, so `next build` can prerender
// pages that reference the API without needing real credentials.
export function getEnv(): Env {
  if (cached) return cached;

  const result = envSchema.safeParse({
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY || undefined,
  });
  if (!result.success) {
    const names = result.error.issues.map((issue) => issue.path.join("."));
    throw new Error(`Invalid environment variables: ${names.join(", ")}`);
  }

  cached = result.data;
  return cached;
}
