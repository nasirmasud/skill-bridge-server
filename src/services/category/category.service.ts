import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export const createCategory = async (data: {
  name: string;
  description?: string;
  icon?: string;
}) => {
  const existing = await prisma.category.findFirst({
    where: { name: data.name, isDeleted: false },
  });

  if (existing) {
    throw new ApiError(409, "Category with this name already exists", [
      { path: "name", message: "Category name is already in use" },
    ]);
  }

  return prisma.category.create({ data });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { name: "asc" },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: { id, isDeleted: false },
  });

  if (!category) {
    throw new ApiError(404, "Category not found", [
      { path: "id", message: "No category found with this id" },
    ]);
  }

  return category;
};

export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string; icon?: string }
) => {
  const target = await prisma.category.findFirst({
    where: { id, isDeleted: false },
  });

  if (!target) {
    throw new ApiError(404, "Category not found", [
      { path: "id", message: "No category found with this id" },
    ]);
  }

  if (data.name) {
    const existing = await prisma.category.findFirst({
      where: { name: data.name, isDeleted: false, id: { not: id } },
    });

    if (existing) {
      throw new ApiError(409, "Category with this name already exists", [
        { path: "name", message: "Category name is already in use" },
      ]);
    }
  }

  return prisma.category.update({ where: { id }, data });
};

export const softDeleteCategory = async (id: string) => {
  const target = await prisma.category.findFirst({
    where: { id, isDeleted: false },
  });

  if (!target) {
    throw new ApiError(404, "Category not found", [
      { path: "id", message: "No category found with this id" },
    ]);
  }

  return prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
};
