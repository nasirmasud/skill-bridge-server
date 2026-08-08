import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorSources: err.errorSources,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Duplicate value",
        errorSources: [
          {
            path: "body",
            message: "A record with this value already exists",
          },
        ],
      });
    }
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    errorSources: [
      { path: "", message: "Something went wrong on the server" },
    ],
  });
};
