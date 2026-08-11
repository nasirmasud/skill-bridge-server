import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  softDeleteCategory,
  updateCategory,
} from "./category.service";

/**
 * @openapi
 * /api/categories:
 *   post:
 *     summary: Create a category (admin only)
 *     description: Create a new service category.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 300
 *                 nullable: true
 *               icon:
 *                 type: string
 *                 maxLength: 50
 *                 nullable: true
 *             example:
 *               name: Web Development
 *               description: Custom websites and web applications
 *               icon: code
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *               example:
 *                 success: true
 *                 message: Category created successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   name: Web Development
 *                   description: Custom websites and web applications
 *                   icon: code
 *                   serviceCount: 0
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:00:00.000Z
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const createCategoryHandler = async (req: Request, res: Response) => {
  const category = await createCategory(req.body);
  sendResponse(res, 201, "Category created successfully", category);
};

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories (public). Returns service count for each.
 *     tags:
 *       - Categories
 *     security: []
 *     responses:
 *       200:
 *         description: List of all categories
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
 *                         $ref: '#/components/schemas/Category'
 *               example:
 *                 success: true
 *                 message: Categories retrieved successfully
 *                 data:
 *                   - id: 550e8400-e29b-41d4-a716-446655440000
 *                     name: Web Development
 *                     description: Custom websites and web applications
 *                     icon: code
 *                     serviceCount: 12
 *                     createdAt: 2024-01-01T10:00:00.000Z
 *                     updatedAt: 2024-01-01T10:00:00.000Z
 */
export const getCategories = async (_req: Request, res: Response) => {
  const categories = await getAllCategories();
  sendResponse(res, 200, "Categories retrieved successfully", categories);
};

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieve a single category by its ID (public).
 *     tags:
 *       - Categories
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *               example:
 *                 success: true
 *                 message: Category retrieved successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   name: Web Development
 *                   description: Custom websites and web applications
 *                   icon: code
 *                   serviceCount: 12
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:00:00.000Z
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getCategory = async (req: Request, res: Response) => {
  const category = await getCategoryById(req.params.id as string);
  sendResponse(res, 200, "Category retrieved successfully", category);
};

/**
 * @openapi
 * /api/categories/{id}:
 *   patch:
 *     summary: Update a category (admin only)
 *     description: Update an existing category's name, description, or icon.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 300
 *                 nullable: true
 *               icon:
 *                 type: string
 *                 maxLength: 50
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *               example:
 *                 success: true
 *                 message: Category updated successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   name: Updated Name
 *                   description: Updated description
 *                   icon: layout
 *                   serviceCount: 12
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
 *       409:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const updateCategoryHandler = async (req: Request, res: Response) => {
  const category = await updateCategory(req.params.id as string, req.body);
  sendResponse(res, 200, "Category updated successfully", category);
};

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (admin only)
 *     description: Soft-delete a category.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted (soft) successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *               example:
 *                 success: true
 *                 message: Category deleted successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   name: Web Development
 *                   description: Custom websites and web applications
 *                   icon: code
 *                   serviceCount: 0
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:30:00.000Z
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const deleteCategory = async (req: Request, res: Response) => {
  const category = await softDeleteCategory(req.params.id as string);
  sendResponse(res, 200, "Category deleted successfully", category);
};
