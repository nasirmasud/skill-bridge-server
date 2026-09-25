import type { RequestHandler } from "express";
import type { Pool } from "pg";
import { env } from "../config/env";

let lastActivityAt = Date.now();
let interval: NodeJS.Timeout | null = null;

/**
 * Records that the API is actually being used. The keep-alive pinger only runs
 * while this timestamp is fresh, so pings stop shortly after traffic stops and
 * an idle night does not spend the monthly CU-hour allowance on keep-alives.
 * Note that the pool itself holds a connection for DB_POOL_IDLE_TIMEOUT_MS, so
 * the compute can still stay warm for that long after the last request.
 */
export const markDbActivity = (): void => {
  lastActivityAt = Date.now();
};

/**
 * Mount on the API router only. Health checks deliberately do not count as
 * activity, so an external uptime monitor can keep the web tier warm without
 * holding the database awake around the clock.
 */
export const trackDbActivity = (): RequestHandler => (_req, _res, next) => {
  markDbActivity();
  next();
};

const ping = async (pool: Pool): Promise<void> => {
  const startedAt = Date.now();

  try {
    await pool.query("SELECT 1");
    console.log(`[db-keepalive] compute warm (${Date.now() - startedAt}ms)`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[db-keepalive] ping failed: ${message}`);
  }
};

export const startDbKeepAlive = (pool: Pool): void => {
  if (!env.DB_KEEPALIVE_ENABLED) {
    console.log("[db-keepalive] disabled (DB_KEEPALIVE_ENABLED=false)");
    return;
  }

  if (interval) {
    return;
  }

  // Warm the pool on boot so the first real request does not pay for it.
  void ping(pool);

  interval = setInterval(() => {
    const idleForMs = Date.now() - lastActivityAt;

    if (idleForMs > env.DB_KEEPALIVE_ACTIVE_WINDOW_MS) {
      return;
    }

    void ping(pool);
  }, env.DB_KEEPALIVE_INTERVAL_MS);

  // Never hold the event loop open on our own account.
  interval.unref();

  console.log(
    `[db-keepalive] every ${env.DB_KEEPALIVE_INTERVAL_MS}ms while API traffic arrived in the last ${env.DB_KEEPALIVE_ACTIVE_WINDOW_MS}ms`
  );
};

export const stopDbKeepAlive = (): void => {
  if (!interval) {
    return;
  }

  clearInterval(interval);
  interval = null;
};
