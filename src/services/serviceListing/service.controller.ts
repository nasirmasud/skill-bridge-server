import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  createService,
  getAllServices,
  getServiceById,
  getServicesByFreelancer,
  softDeleteService,
  updateService,
} from "./service.service";

/**
 * @openapi
 * /api/services:
 *   post:
 *     summary: Create a service (freelancer only)
 *     description: Create a new service listing. The freelancer is taken from the JWT.
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Service'
 *               example:
 *                 success: true
 *                 message: Service created successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   title: I will build a responsive React website
 *                   description: Full responsive website using React + Tailwind
 *                   price: 4500
 *                   deliveryDays: 5
 *                   thumbnail: https://example.com/thumb.png
 *                   gallery: []
 *                   tools: []
 *                   highlights: []
 *                   whatYouGet: []
 *                   packageName: null
 *                   packageFeatures: []
 *                   status: ACTIVE
 *                   avgRating: 0
 *                   reviewCount: 0
 *                   categoryId: 550e8400-e29b-41d4-a716-446655440001
 *                   category:
 *                     id: 550e8400-e29b-41d4-a716-446655440001
 *                     name: Web Development
 *                     icon: code
 *                   freelancerId: 550e8400-e29b-41d4-a716-446655440000
 *                   freelancer:
 *                     id: 550e8400-e29b-41d4-a716-446655440000
 *                     name: Rakib Hasan
 *                     profileImg: null
 *                     bio: null
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:00:00.000Z
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const createServiceHandler = async (req: Request, res: Response) => {
  const service = await createService(req.user!.id, req.body);
  sendResponse(res, 201, "Service created successfully", service);
};

/**
 * @openapi
 * /api/services:
 *   get:
 *     summary: Get all services
 *     description: Public endpoint. Paginated list with optional filters for category, price range, and search.
 *     tags:
 *       - Services
 *     security: []
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
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by service title (case-insensitive)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Paginated list of services
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
 *                         $ref: '#/components/schemas/Service'
 *               example:
 *                 success: true
 *                 message: Services retrieved successfully
 *                 meta:
 *                   page: 1
 *                   limit: 10
 *                   total: 42
 *                 data: []
 */
export const getServices = async (req: Request, res: Response) => {
  const result = await getAllServices(req.query);
  sendResponse(res, 200, "Services retrieved successfully", result.data, result.meta);
};

/**
 * @openapi
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     description: Retrieve a single service with category, freelancer, reviews, and average rating.
 *     tags:
 *       - Services
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Service'
 *               example:
 *                 success: true
 *                 message: Service retrieved successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   title: I will build a responsive React website
 *                   description: Full responsive website using React + Tailwind
 *                   price: 4500
 *                   deliveryDays: 5
 *                   thumbnail: https://example.com/thumb.png
 *                   gallery: []
 *                   tools: []
 *                   highlights: []
 *                   whatYouGet: []
 *                   packageName: null
 *                   packageFeatures: []
 *                   status: ACTIVE
 *                   avgRating: 4.5
 *                   reviewCount: 12
 *                   categoryId: 550e8400-e29b-41d4-a716-446655440001
 *                   category:
 *                     id: 550e8400-e29b-41d4-a716-446655440001
 *                     name: Web Development
 *                     icon: code
 *                   freelancerId: 550e8400-e29b-41d4-a716-446655440000
 *                   freelancer:
 *                     id: 550e8400-e29b-41d4-a716-446655440000
 *                     name: Rakib Hasan
 *                     profileImg: null
 *                     bio: null
 *                   reviews: []
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:00:00.000Z
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getService = async (req: Request, res: Response) => {
  const service = await getServiceById(req.params.id as string);
  sendResponse(res, 200, "Service retrieved successfully", service);
};

/**
 * @openapi
 * /api/services/freelancer/{freelancerId}:
 *   get:
 *     summary: Get all services by a freelancer
 *     description: Public endpoint. Returns all active services offered by a specific freelancer.
 *     tags:
 *       - Services
 *     security: []
 *     parameters:
 *       - in: path
 *         name: freelancerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Freelancer's user ID
 *     responses:
 *       200:
 *         description: List of services by the freelancer
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
 *                         $ref: '#/components/schemas/Service'
 *               example:
 *                 success: true
 *                 message: Services retrieved successfully
 *                 data: []
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getFreelancerServices = async (req: Request, res: Response) => {
  const services = await getServicesByFreelancer(
    req.params.freelancerId as string
  );
  sendResponse(res, 200, "Services retrieved successfully", services);
};

/**
 * @openapi
 * /api/services/{id}:
 *   patch:
 *     summary: Update a service
 *     description: Update a service. Only the owner freelancer or an admin can update.
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Service'
 *               example:
 *                 success: true
 *                 message: Service updated successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   title: Updated Title
 *                   description: Updated description
 *                   price: 5000
 *                   deliveryDays: 7
 *                   status: ACTIVE
 *                   avgRating: 4.5
 *                   reviewCount: 12
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
export const updateServiceHandler = async (req: Request, res: Response) => {
  const service = await updateService(
    req.params.id as string,
    req.body,
    req.user!
  );
  sendResponse(res, 200, "Service updated successfully", service);
};

/**
 * @openapi
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     description: Soft-delete a service. Only the owner freelancer or an admin can delete.
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted (soft) successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Service'
 *               example:
 *                 success: true
 *                 message: Service deleted successfully
 *                 data: null
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const deleteService = async (req: Request, res: Response) => {
  const service = await softDeleteService(req.params.id as string, req.user!);
  sendResponse(res, 200, "Service deleted successfully", service);
};
