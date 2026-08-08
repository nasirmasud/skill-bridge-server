import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { login, refreshToken, register } from "../services/auth/auth.controller";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../services/auth/auth.validation";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh-token", validateRequest(refreshTokenSchema), refreshToken);

export default router;
