import { Prisma, Role } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  profileImg: true,
  bio: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

const getPagination = (query: PaginationQuery) => {
  const page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit ?? "10", 10) || 10, 1),
    100
  );
  return { page, limit, skip: (page - 1) * limit };
};

export const getAllUsers = async (query: PaginationQuery & { role?: string }) => {
  const { page, limit, skip } = getPagination(query);

  const where: Prisma.UserWhereInput = { isDeleted: false };

  if (query.role) {
    where.role = query.role as Role;
  }

  const [total, data] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: userPublicSelect,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { meta: { page, limit, total }, data };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: userPublicSelect,
  });

  if (!user) {
    throw new ApiError(404, "User not found", [
      { path: "id", message: "No user found with this id" },
    ]);
  }

  return user;
};

export const updateUser = async (
  id: string,
  data: { name?: string; phone?: string; bio?: string; profileImg?: string },
  actor: { id: string; role: string }
) => {
  const target = await prisma.user.findFirst({
    where: { id, isDeleted: false },
  });

  if (!target) {
    throw new ApiError(404, "User not found", [
      { path: "id", message: "No user found with this id" },
    ]);
  }

  if (actor.role !== "ADMIN" && actor.id !== id) {
    throw new ApiError(403, "You are not allowed to update this user");
  }

  return prisma.user.update({
    where: { id },
    data,
    select: userPublicSelect,
  });
};

export const softDeleteUser = async (
  id: string,
  actor: { id: string; role: string }
) => {
  const target = await prisma.user.findFirst({
    where: { id, isDeleted: false },
  });

  if (!target) {
    throw new ApiError(404, "User not found", [
      { path: "id", message: "No user found with this id" },
    ]);
  }

  if (target.role === "ADMIN") {
    throw new ApiError(403, "Admin accounts cannot be deleted");
  }

  return prisma.user.update({
    where: { id },
    data: { isDeleted: true },
    select: userPublicSelect,
  });
};
