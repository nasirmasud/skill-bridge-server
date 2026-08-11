import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "./auth.service";

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account (CLIENT or FREELANCER only). Password is hashed with bcrypt.
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthResponse'
 *               example:
 *                 success: true
 *                 message: User registered successfully
 *                 data:
 *                   user:
 *                     id: 550e8400-e29b-41d4-a716-446655440000
 *                     name: Rakib Hasan
 *                     email: rakib@example.com
 *                     role: FREELANCER
 *                     phone: "+1234567890"
 *                     profileImg: https://example.com/avatar.png
 *                     bio: Frontend developer
 *                     createdAt: 2024-01-01T10:00:00.000Z
 *                     updatedAt: 2024-01-01T10:00:00.000Z
 *                   accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  sendResponse(res, 201, "User registered successfully", result);
};

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: Authenticate a user and return JWT access and refresh tokens.
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthResponse'
 *               example:
 *                 success: true
 *                 message: User logged in successfully
 *                 data:
 *                   user:
 *                     id: 550e8400-e29b-41d4-a716-446655440000
 *                     name: Rakib Hasan
 *                     email: rakib@example.com
 *                     role: FREELANCER
 *                     phone: "+1234567890"
 *                     profileImg: https://example.com/avatar.png
 *                     bio: Frontend developer
 *                     createdAt: 2024-01-01T10:00:00.000Z
 *                     updatedAt: 2024-01-01T10:00:00.000Z
 *                   accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials or social-only account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  sendResponse(res, 200, "User logged in successfully", result);
};

/**
 * @openapi
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Exchange a valid refresh token for a new access token.
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RefreshTokenResponse'
 *               example:
 *                 success: true
 *                 message: Access token refreshed successfully
 *                 data:
 *                   accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const refreshToken = async (req: Request, res: Response) => {
  const result = await refreshAccessToken(req.body.refreshToken);
  sendResponse(res, 200, "Access token refreshed successfully", result);
};
