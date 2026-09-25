import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/client";
import { env } from "../config/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const createPool = () => {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: env.DB_POOL_MAX,
    // Kept above the keep-alive interval so a ping reuses the same warm
    // connection instead of paying a fresh TLS handshake to Neon.
    idleTimeoutMillis: env.DB_POOL_IDLE_TIMEOUT_MS,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

  // Neon closes idle connections when the compute scales to zero. That is
  // expected here, so it must never become an unhandled error event.
  pool.on("error", (error) => {
    console.warn(`[db-pool] idle client error: ${error.message}`);
  });

  return pool;
};

export const pool = globalForPrisma.pool ?? createPool();

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg(pool, {
      onPoolError: (error) => {
        console.warn(`[db-pool] ${error.message}`);
      },
      onConnectionError: (error) => {
        console.warn(`[db-connection] ${error.message}`);
      },
    }),
  });

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
