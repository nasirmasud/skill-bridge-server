import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

const clientSelect = { id: true, name: true, profileImg: true };

export const createReview = async (
  clientId: string,
  data: { orderId: string; serviceId: string; rating: number; comment?: string }
) => {
  const order = await prisma.order.findFirst({
    where: { id: data.orderId, isDeleted: false },
  });

  if (!order) {
    throw new ApiError(404, "Order not found", [
      { path: "orderId", message: "No order found with this id" },
    ]);
  }

  if (order.clientId !== clientId) {
    throw new ApiError(403, "You can only review your own orders");
  }

  if (order.serviceId !== data.serviceId) {
    throw new ApiError(400, "Service does not match the order", [
      { path: "serviceId", message: "This service is not part of the order" },
    ]);
  }

  if (order.status !== "COMPLETED") {
    throw new ApiError(400, "Order is not completed yet", [
      {
        path: "orderId",
        message: "Reviews can only be created for completed orders",
      },
    ]);
  }

  const existing = await prisma.review.findUnique({
    where: { orderId: order.id },
  });

  if (existing) {
    throw new ApiError(409, "This order has already been reviewed", [
      { path: "orderId", message: "Only one review is allowed per order" },
    ]);
  }

  return prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      clientId,
      serviceId: order.serviceId,
      orderId: order.id,
    },
    include: {
      client: { select: clientSelect },
      service: { select: { id: true, title: true } },
    },
  });
};

export const getServiceReviews = async (serviceId: string) => {
  return prisma.review.findMany({
    where: { serviceId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: clientSelect },
    },
  });
};

export const getReviewById = async (id: string) => {
  const review = await prisma.review.findFirst({
    where: { id, isDeleted: false },
    include: {
      client: { select: clientSelect },
      service: { select: { id: true, title: true } },
    },
  });

  if (!review) {
    throw new ApiError(404, "Review not found", [
      { path: "id", message: "No review found with this id" },
    ]);
  }

  return review;
};

export const updateReview = async (
  id: string,
  data: { rating?: number; comment?: string },
  actor: { id: string; role: string }
) => {
  const review = await prisma.review.findFirst({
    where: { id, isDeleted: false },
  });

  if (!review) {
    throw new ApiError(404, "Review not found", [
      { path: "id", message: "No review found with this id" },
    ]);
  }

  if (actor.role !== "ADMIN" && review.clientId !== actor.id) {
    throw new ApiError(403, "You are not allowed to update this review");
  }

  return prisma.review.update({
    where: { id },
    data,
    include: {
      client: { select: clientSelect },
      service: { select: { id: true, title: true } },
    },
  });
};

export const softDeleteReview = async (
  id: string,
  actor: { id: string; role: string }
) => {
  const review = await prisma.review.findFirst({
    where: { id, isDeleted: false },
  });

  if (!review) {
    throw new ApiError(404, "Review not found", [
      { path: "id", message: "No review found with this id" },
    ]);
  }

  if (actor.role !== "ADMIN" && review.clientId !== actor.id) {
    throw new ApiError(403, "You are not allowed to delete this review");
  }

  return prisma.review.update({
    where: { id },
    data: { isDeleted: true },
  });
};
