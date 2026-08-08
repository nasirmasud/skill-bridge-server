import { z } from "zod";

export const createOrderSchema = z.object({
  serviceId: z.string().uuid("Invalid service id"),
  requirement: z.string().max(2000).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});
