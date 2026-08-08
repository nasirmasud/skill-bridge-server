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

export const placeOrder = async (req: Request, res: Response) => {
  const order = await createOrder(req.user!.id, req.body);
  sendResponse(res, 201, "Order placed successfully", order);
};

export const getMyOrdersHandler = async (req: Request, res: Response) => {
  const result = await getMyOrders(req.user!.id, req.query);
  sendResponse(res, 200, "Orders retrieved successfully", result.data, result.meta);
};

export const getReceivedOrdersHandler = async (req: Request, res: Response) => {
  const result = await getReceivedOrders(req.user!.id, req.query);
  sendResponse(res, 200, "Orders retrieved successfully", result.data, result.meta);
};

export const getOrder = async (req: Request, res: Response) => {
  const order = await getOrderById(req.params.id as string, req.user!);
  sendResponse(res, 200, "Order retrieved successfully", order);
};

export const updateOrderStatusHandler = async (req: Request, res: Response) => {
  const order = await updateOrderStatus(
    req.params.id as string,
    req.body.status,
    req.user!
  );
  sendResponse(res, 200, "Order status updated successfully", order);
};

export const getAdminOrdersHandler = async (req: Request, res: Response) => {
  const result = await getAdminOrders(req.query);
  sendResponse(res, 200, "Orders retrieved successfully", result.data, result.meta);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const order = await softDeleteOrder(req.params.id as string);
  sendResponse(res, 200, "Order deleted successfully", order);
};
