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

/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth
 *     description: Redirects to Google for authentication. Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to be set in the environment. Returns 503 if Google OAuth is not configured.
 *     tags:
 *       - Auth
 *     security: []
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent page
 *       503:
 *         description: Google OAuth is not configured on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/google", startOAuth("google"));

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the Google OAuth callback. Upserts the user, signs a JWT, and redirects to the client URL with access and refresh tokens as query parameters. Returns 503 if Google OAuth is not configured. On user denial, redirects to CLIENT_URL?oauth=error.
 *     tags:
 *       - Auth
 *     security: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *       - in: query
 *         name: error
 *         schema:
 *           type: string
 *         description: OAuth error (if access was denied)
 *     responses:
 *       302:
 *         description: Redirect to client with tokens or error
 *       503:
 *         description: Google OAuth is not configured on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/google/callback", oauthCallbackRoute("google"));

/**
 * @openapi
 * /api/auth/github:
 *   get:
 *     summary: Initiate GitHub OAuth
 *     description: Redirects to GitHub for authentication. Requires GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to be set in the environment. Returns 503 if GitHub OAuth is not configured.
 *     tags:
 *       - Auth
 *     security: []
 *     responses:
 *       302:
 *         description: Redirect to GitHub OAuth consent page
 *       503:
 *         description: GitHub OAuth is not configured on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/github", startOAuth("github"));

/**
 * @openapi
 * /api/auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     description: Handles the GitHub OAuth callback. Upserts the user, signs a JWT, and redirects to the client URL with access and refresh tokens as query parameters. Returns 503 if GitHub OAuth is not configured. On user denial, redirects to CLIENT_URL?oauth=error.
 *     tags:
 *       - Auth
 *     security: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from GitHub
 *       - in: query
 *         name: error
 *         schema:
 *           type: string
 *         description: OAuth error (if access was denied)
 *     responses:
 *       302:
 *         description: Redirect to client with tokens or error
 *       503:
 *         description: GitHub OAuth is not configured on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/github/callback", oauthCallbackRoute("github"));

export default router;
