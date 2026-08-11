import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  createOrder,
  getAdminOrders,
  getMyOrders,
  getOrderById,
  getReceivedOrders,
  softDeleteOrder,
  updateOrderStatus,
} from "./order.service";

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Place a new order (client only)
 *     description: Create an order for a service. A client cannot order their own service.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Order'
 *               example:
 *                 success: true
 *                 message: Order placed successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   status: PENDING
 *                   totalPrice: 4500
 *                   requirement: I need a portfolio site with 5 pages
 *                   clientId: 550e8400-e29b-41d4-a716-446655440000
 *                   serviceId: 550e8400-e29b-41d4-a716-446655440001
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
export const placeOrder = async (req: Request, res: Response) => {
  const order = await createOrder(req.user!.id, req.body);
  sendResponse(res, 201, "Order placed successfully", order);
};

/**
 * @openapi
 * /api/orders/my-orders:
 *   get:
 *     summary: Get current client's orders
 *     description: Retrieve a paginated list of orders placed by the authenticated client.
 *     tags:
 *       - Orders
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
 *     responses:
 *       200:
 *         description: Paginated list of client orders
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
 *                         $ref: '#/components/schemas/Order'
 *               example:
 *                 success: true
 *                 message: Orders retrieved successfully
 *                 meta:
 *                   page: 1
 *                   limit: 10
 *                   total: 5
 *                 data: []
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getMyOrdersHandler = async (req: Request, res: Response) => {
  const result = await getMyOrders(req.user!.id, req.query);
  sendResponse(res, 200, "Orders retrieved successfully", result.data, result.meta);
};

/**
 * @openapi
 * /api/orders/received-orders:
 *   get:
 *     summary: Get orders received by freelancer
 *     description: Retrieve a paginated list of orders for services owned by the authenticated freelancer.
 *     tags:
 *       - Orders
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
 *     responses:
 *       200:
 *         description: Paginated list of received orders
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
 *                         $ref: '#/components/schemas/Order'
 *               example:
 *                 success: true
 *                 message: Orders retrieved successfully
 *                 meta:
 *                   page: 1
 *                   limit: 10
 *                   total: 5
 *                 data: []
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getReceivedOrdersHandler = async (req: Request, res: Response) => {
  const result = await getReceivedOrders(req.user!.id, req.query);
  sendResponse(res, 200, "Orders retrieved successfully", result.data, result.meta);
};

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: Retrieve a single order. Accessible by the client who placed it, the freelancer who owns the service, or an admin.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Order'
 *               example:
 *                 success: true
 *                 message: Order retrieved successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   status: COMPLETED
 *                   totalPrice: 4500
 *                   requirement: I need a portfolio site with 5 pages
 *                   clientId: 550e8400-e29b-41d4-a716-446655440000
 *                   serviceId: 550e8400-e29b-41d4-a716-446655440001
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:30:00.000Z
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getOrder = async (req: Request, res: Response) => {
  const order = await getOrderById(req.params.id as string, req.user!);
  sendResponse(res, 200, "Order retrieved successfully", order);
};

/**
 * @openapi
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     description: Update the status of an order following the state machine. Only the freelancer who owns the service or an admin can update.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Order'
 *               example:
 *                 success: true
 *                 message: Order status updated successfully
 *                 data:
 *                   id: 550e8400-e29b-41d4-a716-446655440000
 *                   status: IN_PROGRESS
 *                   totalPrice: 4500
 *                   requirement: I need a portfolio site with 5 pages
 *                   clientId: 550e8400-e29b-41d4-a716-446655440000
 *                   serviceId: 550e8400-e29b-41d4-a716-446655440001
 *                   createdAt: 2024-01-01T10:00:00.000Z
 *                   updatedAt: 2024-01-01T10:30:00.000Z
 *       400:
 *         description: Invalid status transition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const updateOrderStatusHandler = async (req: Request, res: Response) => {
  const order = await updateOrderStatus(
    req.params.id as string,
    req.body.status,
    req.user!
  );
  sendResponse(res, 200, "Order status updated successfully", order);
};

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     description: Retrieve a paginated list of all orders across the platform. Admin access required.
 *     tags:
 *       - Orders
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
 *     responses:
 *       200:
 *         description: Paginated list of all orders
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
 *                         $ref: '#/components/schemas/Order'
 *               example:
 *                 success: true
 *                 message: Orders retrieved successfully
 *                 meta:
 *                   page: 1
 *                   limit: 10
 *                   total: 100
 *                 data: []
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const getAdminOrdersHandler = async (req: Request, res: Response) => {
  const result = await getAdminOrders(req.query);
  sendResponse(res, 200, "Orders retrieved successfully", result.data, result.meta);
};

/**
 * @openapi
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order (admin only)
 *     description: Soft-delete an order. Admin access required.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted (soft) successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Order'
 *               example:
 *                 success: true
 *                 message: Order deleted successfully
 *                 data: null
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
export const deleteOrder = async (req: Request, res: Response) => {
  const order = await softDeleteOrder(req.params.id as string);
  sendResponse(res, 200, "Order deleted successfully", order);
};
