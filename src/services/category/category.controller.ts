import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  softDeleteCategory,
  updateCategory,
} from "./category.service";

export const createCategoryHandler = async (req: Request, res: Response) => {
  const category = await createCategory(req.body);
  sendResponse(res, 201, "Category created successfully", category);
};

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await getAllCategories();
  sendResponse(res, 200, "Categories retrieved successfully", categories);
};

export const getCategory = async (req: Request, res: Response) => {
  const category = await getCategoryById(req.params.id as string);
  sendResponse(res, 200, "Category retrieved successfully", category);
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  const category = await updateCategory(req.params.id as string, req.body);
  sendResponse(res, 200, "Category updated successfully", category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const category = await softDeleteCategory(req.params.id as string);
  sendResponse(res, 200, "Category deleted successfully", category);
};
