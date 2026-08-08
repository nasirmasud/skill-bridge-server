import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const checkRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "You are not authorized"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You are not allowed to perform this action")
      );
    }

    next();
  };
};
