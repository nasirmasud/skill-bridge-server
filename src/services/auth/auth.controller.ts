import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  sendResponse(res, 201, "User registered successfully", result);
};

export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  sendResponse(res, 200, "User logged in successfully", result);
};

export const refreshToken = async (req: Request, res: Response) => {
  const result = await refreshAccessToken(req.body.refreshToken);
  sendResponse(res, 200, "Access token refreshed successfully", result);
};
