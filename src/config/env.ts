import "dotenv/config";
import { z } from "zod";

const booleanFlag = (defaultValue: "true" | "false") =>
  z
    .enum(["true", "false"])
    .default(defaultValue)
    .transform((value) => value === "true");

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  OAUTH_CALLBACK_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GITHUB_CLIENT_ID: z.string().min(1).optional(),
  GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
  /**
   * Neon suspends the compute after 5 minutes of inactivity on the free plan and
   * that delay cannot be configured. These flags let the API hold the compute
   * awake with a cheap query, but only while real API traffic is arriving, so an
   * idle night does not burn the monthly CU-hour allowance.
   */
  DB_KEEPALIVE_ENABLED: booleanFlag("true"),
  DB_KEEPALIVE_INTERVAL_MS: z.coerce.number().int().positive().default(240_000),
  DB_KEEPALIVE_ACTIVE_WINDOW_MS: z.coerce.number().int().positive().default(600_000),
  DB_POOL_MAX: z.coerce.number().int().positive().default(5),
  DB_POOL_IDLE_TIMEOUT_MS: z.coerce.number().int().positive().default(600_000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
  );
  process.exit(1);
}

export const env = parsed.data;
