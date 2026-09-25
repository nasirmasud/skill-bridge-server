import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { sendResponse } from "./lib/sendResponse";
import passport from "./lib/passport";
import { trackDbActivity } from "./lib/dbKeepAlive";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import routes from "./routes";
import { ApiError } from "./utils/ApiError";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(passport.initialize());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs-json", (_req, res) => {
  res.json(swaggerSpec);
});

/**
 * @openapi
 * /api-docs-json:
 *   get:
 *     summary: OpenAPI JSON specification
 *     description: Returns the full OpenAPI 3.0 specification as JSON.
 *     tags:
 *       - Docs
 *     security: []
 *     responses:
 *       200:
 *         description: OpenAPI JSON spec
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check whether the API server is running.
 *     tags:
 *       - Health
 *     security: []
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: Skillbridge API is running
 *               data: null
 */
app.get("/health", (_req, res) => {
  sendResponse(res, 200, "Skillbridge API is running", null);
});

app.use("/api", trackDbActivity());
app.use("/api", routes);

app.use((req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

export default app;
