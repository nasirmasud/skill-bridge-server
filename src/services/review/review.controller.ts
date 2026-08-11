import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  createReview,
  getReviewById,
  getServiceReviews,
  softDeleteReview,
  updateReview,
} from "./review.service";

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     summary: Create a review (client only)
 *     description: Create a review for a completed order. Only the client who owns the order can review, and only for COMPLETED orders. One review per order.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *               example:
 *                 success: true
 *                 message: Review created successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   rating: 5
 *                   comment: Great work, delivered on time!
 *                   clientId: 550e8400-e29b-41d4-a716-446655440000
 *                   serviceId: 550e8400-e29b-41d4-a716-446655440001
 *                   orderId: 550e8400-e29b-41d4-a716-446655440002
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:00:00.000Z
 *       400:
 *         description: Order not completed or service mismatch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Cannot review another user's order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Order already reviewed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const createReviewHandler = async (req: Request, res: Response) => {
  const review = await createReview(req.user!.id, req.body);
  sendResponse(res, 201, "Review created successfully", review);
};

/**
 * @openapi
 * /api/reviews/service/{serviceId}:
 *   get:
 *     summary: Get reviews for a service
 *     description: Retrieve all reviews for a specific service (public).
 *     tags:
 *       - Reviews
 *     security: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       200:
 *         description: List of reviews for the service
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
 *                         $ref: '#/components/schemas/Review'
 *               example:
 *                 success: true
 *                 message: Reviews retrieved successfully
 *                 data: []
 */
export const getServiceReviewsHandler = async (req: Request, res: Response) => {
  const reviews = await getServiceReviews(req.params.serviceId as string);
  sendResponse(res, 200, "Reviews retrieved successfully", reviews);
};

/**
 * @openapi
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     description: Retrieve a single review by its ID (public).
 *     tags:
 *       - Reviews
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *               example:
 *                 success: true
 *                 message: Review retrieved successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   rating: 5
 *                   comment: Great work, delivered on time!
 *                   clientId: 550e8400-e29b-41d4-a716-446655440000
 *                   serviceId: 550e8400-e29b-41d4-a716-446655440001
 *                   orderId: 550e8400-e29b-41d4-a716-446655440002
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:00:00.000Z
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getReview = async (req: Request, res: Response) => {
  const review = await getReviewById(req.params.id as string);
  sendResponse(res, 200, "Review retrieved successfully", review);
};

/**
 * @openapi
 * /api/reviews/{id}:
 *   patch:
 *     summary: Update a review
 *     description: Update your own review. Only the original client or an admin can update.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewRequest'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *               example:
 *                 success: true
 *                 message: Review updated successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   rating: 4
 *                   comment: Updated comment
 *                   clientId: 550e8400-e29b-41d4-a716-446655440000
 *                   serviceId: 550e8400-e29b-41d4-a716-446655440001
 *                   orderId: 550e8400-e29b-41d4-a716-446655440002
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
export const updateReviewHandler = async (req: Request, res: Response) => {
  const review = await updateReview(req.params.id as string, req.body, req.user!);
  sendResponse(res, 200, "Review updated successfully", review);
};

/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Soft-delete a review. Only the original client or an admin can delete.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted (soft) successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *               example:
 *                 success: true
 *                 message: Review deleted successfully
 *                 data: null
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const deleteReview = async (req: Request, res: Response) => {
  const review = await softDeleteReview(req.params.id as string, req.user!);
  sendResponse(res, 200, "Review deleted successfully", review);
};
