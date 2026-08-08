import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ApiError } from "../utils/ApiError";

export const validateRequest = (schema: z.ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorSources = result.error.issues.map((issue) => ({
        path: issue.path.join(".") || "body",
        message: issue.message,
      }));

      return next(new ApiError(400, "Validation error", errorSources));
    }

    req.body = result.data;
    next();
  };
};
