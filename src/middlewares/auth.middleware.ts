import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../lib/jwt";

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "You are not authorized"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
