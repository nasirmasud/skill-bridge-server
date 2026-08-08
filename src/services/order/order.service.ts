import { OrderStatus, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

const clientSelect = { id: true, name: true, profileImg: true, email: true };

const serviceSelect = {
  id: true,
  title: true,
  price: true,
  thumbnail: true,
  status: true,
  freelancer: { select: { id: true, name: true, profileImg: true } },
} satisfies Prisma.ServiceSelect;

export interface OrderQuery {
  page?: string;
  limit?: string;
}

const getPagination = (query: OrderQuery) => {
  const page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit ?? "10", 10) || 10, 1),
    100
  );
  return { page, limit, skip: (page - 1) * limit };
};

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const createOrder = async (
  clientId: string,
  data: { serviceId: string; requirement?: string }
) => {
  const service = await prisma.service.findFirst({
    where: { id: data.serviceId, isDeleted: false, status: "ACTIVE" },
  });

  if (!service) {
    throw new ApiError(404, "Service not found", [
      { path: "serviceId", message: "No active service found with this id" },
    ]);
  }

  if (service.freelancerId === clientId) {
    throw new ApiError(403, "You cannot order your own service");
  }

  return prisma.order.create({
    data: {
      status: "PENDING",
      totalPrice: service.price,
      requirement: data.requirement,
      clientId,
      serviceId: service.id,
    },
    include: {
      service: { select: serviceSelect },
      client: { select: clientSelect },
    },
  });
};

export const getMyOrders = async (clientId: string, query: OrderQuery) => {
  const { page, limit, skip } = getPagination(query);

  const where: Prisma.OrderWhereInput = { clientId, isDeleted: false };

  const [total, data] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: serviceSelect },
        review: { select: { id: true, rating: true } },
      },
    }),
  ]);

  return { meta: { page, limit, total }, data };
};

export const getReceivedOrders = async (
  freelancerId: string,
  query: OrderQuery
) => {
  const { page, limit, skip } = getPagination(query);

  const where: Prisma.OrderWhereInput = {
    isDeleted: false,
    service: { freelancerId },
  };

  const [total, data] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: serviceSelect },
        client: { select: clientSelect },
      },
    }),
  ]);

  return { meta: { page, limit, total }, data };
};

export const getOrderById = async (
  id: string,
  actor: { id: string; role: string }
) => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
    include: {
      service: { select: serviceSelect },
      client: { select: clientSelect },
      review: { select: { id: true, rating: true } },
    },
  });

  if (!order) {
    throw new ApiError(404, "Order not found", [
      { path: "id", message: "No order found with this id" },
    ]);
  }

  const isClient = order.clientId === actor.id;
  const isFreelancer = order.service.freelancer.id === actor.id;

  if (actor.role !== "ADMIN" && !isClient && !isFreelancer) {
    throw new ApiError(403, "You are not allowed to view this order");
  }

  return order;
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  actor: { id: string; role: string }
) => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
    include: { service: true },
  });

  if (!order) {
    throw new ApiError(404, "Order not found", [
      { path: "id", message: "No order found with this id" },
    ]);
  }

  if (actor.role !== "ADMIN" && order.service.freelancerId !== actor.id) {
    throw new ApiError(
      403,
      "Only the service freelancer or an admin can update order status"
    );
  }

  if (!ALLOWED_TRANSITIONS[order.status].includes(status)) {
    throw new ApiError(
      400,
      `Cannot move order from ${order.status} to ${status}`,
      [
        {
          path: "status",
          message: `Allowed transitions from ${order.status}: ${ALLOWED_TRANSITIONS[order.status].join(", ") || "none"}`,
        },
      ]
    );
  }

  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      service: { select: serviceSelect },
      client: { select: clientSelect },
    },
  });
};

export const getAdminOrders = async (query: OrderQuery) => {
  const { page, limit, skip } = getPagination(query);

  const where: Prisma.OrderWhereInput = { isDeleted: false };

  const [total, data] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: serviceSelect },
        client: { select: clientSelect },
      },
    }),
  ]);

  return { meta: { page, limit, total }, data };
};

export const softDeleteOrder = async (id: string) => {
  const target = await prisma.order.findFirst({
    where: { id, isDeleted: false },
  });

  if (!target) {
    throw new ApiError(404, "Order not found", [
      { path: "id", message: "No order found with this id" },
    ]);
  }

  return prisma.order.update({
    where: { id },
    data: { isDeleted: true },
  });
};
