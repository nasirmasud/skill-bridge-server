import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { sendResponse } from "./lib/sendResponse";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { ApiError } from "./utils/ApiError";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  sendResponse(res, 200, "Skillbridge API is running", null);
});

app.use((req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

export default app;
