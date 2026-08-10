import { z } from "zod";

export const createServiceSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  price: z.number().positive("Price must be a positive number"),
  deliveryDays: z.number().int().min(1).max(365),
  categoryId: z.string().uuid("Invalid category id"),
  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
  gallery: z.array(z.string().url("Invalid gallery URL")).max(10).optional(),
  tools: z.array(z.string().max(50)).max(20).optional(),
  highlights: z.array(z.string().max(100)).max(20).optional(),
  whatYouGet: z.array(z.string().max(100)).max(20).optional(),
  packageName: z.string().max(100).optional(),
  packageFeatures: z.array(z.string().max(100)).max(20).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).optional(),
});

export const updateServiceSchema = createServiceSchema.partial();
