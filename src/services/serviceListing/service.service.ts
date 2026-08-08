import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export interface ServiceQuery {
  page?: string;
  limit?: string;
  categoryId?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface CreateServiceData {
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  categoryId: string;
  thumbnail?: string;
  status?: "ACTIVE" | "INACTIVE" | "DRAFT";
}

const categorySelect = { id: true, name: true, icon: true };

const freelancerSelect = {
  id: true,
  name: true,
  profileImg: true,
  bio: true,
};

const getPagination = (query: ServiceQuery) => {
  const page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit ?? "10", 10) || 10, 1),
    100
  );
  return { page, limit, skip: (page - 1) * limit };
};

export const createService = async (
  freelancerId: string,
  data: CreateServiceData
) => {
  const category = await prisma.category.findFirst({
    where: { id: data.categoryId, isDeleted: false },
  });

  if (!category) {
    throw new ApiError(404, "Category not found", [
      { path: "categoryId", message: "No category found with this id" },
    ]);
  }

  return prisma.service.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      deliveryDays: data.deliveryDays,
      thumbnail: data.thumbnail,
      status: data.status ?? "ACTIVE",
      categoryId: data.categoryId,
      freelancerId,
    },
    include: {
      category: { select: categorySelect },
      freelancer: { select: freelancerSelect },
    },
  });
};

export const getAllServices = async (query: ServiceQuery) => {
  const { page, limit, skip } = getPagination(query);

  const where: Prisma.ServiceWhereInput = { isDeleted: false, status: "ACTIVE" };

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.search) {
    where.title = { contains: query.search, mode: "insensitive" };
  }

  const priceFilter: Prisma.DecimalFilter = {};
  if (query.minPrice) {
    priceFilter.gte = parseFloat(query.minPrice);
  }
  if (query.maxPrice) {
    priceFilter.lte = parseFloat(query.maxPrice);
  }
  if (Object.keys(priceFilter).length > 0) {
    where.price = priceFilter;
  }

  const [total, data] = await Promise.all([
    prisma.service.count({ where }),
    prisma.service.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: categorySelect },
        freelancer: { select: freelancerSelect },
        _count: { select: { reviews: true } },
      },
    }),
  ]);

  return { meta: { page, limit, total }, data };
};

export const getServiceById = async (id: string) => {
  const service = await prisma.service.findFirst({
    where: { id, isDeleted: false },
    include: {
      category: { select: categorySelect },
      freelancer: { select: freelancerSelect },
      reviews: {
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { id: true, name: true, profileImg: true } },
        },
      },
    },
  });

  if (!service) {
    throw new ApiError(404, "Service not found", [
      { path: "id", message: "No service found with this id" },
    ]);
  }

  const avg = await prisma.review.aggregate({
    where: { serviceId: id, isDeleted: false },
    _avg: { rating: true },
  });

  return {
    ...service,
    avgRating: avg._avg.rating ?? 0,
    reviewCount: service.reviews.length,
  };
};

const assertCanManageService = async (
  id: string,
  actor: { id: string; role: string }
) => {
  const target = await prisma.service.findFirst({
    where: { id, isDeleted: false },
  });

  if (!target) {
    throw new ApiError(404, "Service not found", [
      { path: "id", message: "No service found with this id" },
    ]);
  }

  if (actor.role !== "ADMIN" && target.freelancerId !== actor.id) {
    throw new ApiError(403, "You are not allowed to manage this service");
  }

  return target;
};

export const updateService = async (
  id: string,
  data: Partial<CreateServiceData>,
  actor: { id: string; role: string }
) => {
  await assertCanManageService(id, actor);

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, isDeleted: false },
    });

    if (!category) {
      throw new ApiError(404, "Category not found", [
        { path: "categoryId", message: "No category found with this id" },
      ]);
    }
  }

  return prisma.service.update({
    where: { id },
    data,
    include: {
      category: { select: categorySelect },
      freelancer: { select: freelancerSelect },
    },
  });
};

export const softDeleteService = async (
  id: string,
  actor: { id: string; role: string }
) => {
  await assertCanManageService(id, actor);

  return prisma.service.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const getServicesByFreelancer = async (freelancerId: string) => {
  const freelancer = await prisma.user.findFirst({
    where: { id: freelancerId, isDeleted: false },
  });

  if (!freelancer) {
    throw new ApiError(404, "Freelancer not found", [
      { path: "freelancerId", message: "No user found with this id" },
    ]);
  }

  return prisma.service.findMany({
    where: { freelancerId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: categorySelect },
      freelancer: { select: freelancerSelect },
      _count: { select: { reviews: true } },
    },
  });
};
