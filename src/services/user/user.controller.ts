import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  getAllUsers,
  getUserById,
  softDeleteUser,
  updateUser,
} from "./user.service";

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     description: Retrieve a paginated list of all users. Supports role filtering.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, CLIENT, FREELANCER]
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: Users retrieved successfully
 *               meta:
 *                 page: 1
 *                 limit: 10
 *                 total: 42
 *               data: []
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getUsers = async (req: Request, res: Response) => {
  const result = await getAllUsers(req.query);
  sendResponse(res, 200, "Users retrieved successfully", result.data, result.meta);
};

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the profile of the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *               example:
 *                 success: true
 *                 message: Profile retrieved successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   name: Rakib Hasan
 *                   email: rakib@example.com
 *                   role: FREELANCER
 *                   phone: "+1234567890"
 *                   profileImg: https://example.com/avatar.png
 *                   bio: Frontend developer
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:00:00.000Z
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getMe = async (req: Request, res: Response) => {
  const user = await getUserById(req.user!.id);
  sendResponse(res, 200, "Profile retrieved successfully", user);
};

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a single user's profile by their ID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *               example:
 *                 success: true
 *                 message: User retrieved successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   name: Rakib Hasan
 *                   email: rakib@example.com
 *                   role: FREELANCER
 *                   phone: "+1234567890"
 *                   profileImg: https://example.com/avatar.png
 *                   bio: Frontend developer
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:00:00.000Z
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getUser = async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id as string);
  sendResponse(res, 200, "User retrieved successfully", user);
};

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     summary: Update user profile
 *     description: Update a user's profile. Only the owner or an admin can update.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *               example:
 *                 success: true
 *                 message: User updated successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   name: Updated Name
 *                   email: rakib@example.com
 *                   role: FREELANCER
 *                   phone: "+1234567890"
 *                   profileImg: https://example.com/avatar.png
 *                   bio: Updated bio
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:30:00.000Z
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const updateUserHandler = async (req: Request, res: Response) => {
  const user = await updateUser(req.params.id as string, req.body, req.user!);
  sendResponse(res, 200, "User updated successfully", user);
};

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (admin only)
 *     description: Soft-delete a user. Admin accounts cannot be deleted.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted (soft) successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *               example:
 *                 success: true
 *                 message: User deleted successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   name: Rakib Hasan
 *                   email: rakib@example.com
 *                   role: FREELANCER
 *                   phone: null
 *                   profileImg: null
 *                   bio: null
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:30:00.000Z
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const deleteUser = async (req: Request, res: Response) => {
  const user = await softDeleteUser(req.params.id as string, req.user!);
  sendResponse(res, 200, "User deleted successfully", user);
};
