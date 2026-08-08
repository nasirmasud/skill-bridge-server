import { z } from "zod";

export const createReviewSchema = z.object({
  orderId: z.string().uuid("Invalid order id"),
  serviceId: z.string().uuid("Invalid service id"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(500).optional(),
});
