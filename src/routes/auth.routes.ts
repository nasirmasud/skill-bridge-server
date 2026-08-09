import { NextFunction, Request, Response, Router } from "express";
import { env } from "../config/env";
import { sendResponse } from "../lib/sendResponse";
import passport from "../lib/passport";
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

const oauthConfigured = (provider: string) => {
  if (provider === "google") return Boolean(env.GOOGLE_CLIENT_ID);
  return Boolean(env.GITHUB_CLIENT_ID);
};

const startOAuth = (provider: "google" | "github") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!oauthConfigured(provider)) {
      return sendResponse(
        res,
        503,
        `${provider} OAuth is not configured on the server`,
        null
      );
    }
    passport.authenticate(
      provider,
      provider === "google" ? { scope: ["profile", "email"] } : { scope: ["user:email"] }
    )(req, res, next);
  };
};

const oauthCallback = (provider: "google" | "github") => {
  return (req: Request, res: Response) => {
    const result = req.user as unknown as {
      accessToken: string;
      refreshToken: string;
    };
    const redirectUrl = `${env.CLIENT_URL}?accessToken=${encodeURIComponent(result.accessToken)}&refreshToken=${encodeURIComponent(result.refreshToken)}`;
    return res.redirect(redirectUrl);
  };
};

router.get("/google", startOAuth("google"));
router.get("/google/callback", oauthCallbackRoute("google"));
router.get("/github", startOAuth("github"));
router.get("/github/callback", oauthCallbackRoute("github"));

function oauthCallbackRoute(provider: "google" | "github") {
  return [
    (req: Request, res: Response, next: NextFunction) => {
      if (!oauthConfigured(provider)) {
        return sendResponse(
          res,
          503,
          `${provider} OAuth is not configured on the server`,
          null
        );
      }
      passport.authenticate(provider, {
        session: false,
        failureRedirect: `${env.CLIENT_URL}?oauth=error`,
      })(req, res, next);
    },
    oauthCallback(provider),
  ];
}

export default router;
