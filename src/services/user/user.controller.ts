import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  getAllUsers,
  getUserById,
  softDeleteUser,
  updateUser,
} from "./user.service";

export const getUsers = async (req: Request, res: Response) => {
  const result = await getAllUsers(req.query);
  sendResponse(res, 200, "Users retrieved successfully", result.data, result.meta);
};

export const getMe = async (req: Request, res: Response) => {
  const user = await getUserById(req.user!.id);
  sendResponse(res, 200, "Profile retrieved successfully", user);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id as string);
  sendResponse(res, 200, "User retrieved successfully", user);
};

export const updateUserHandler = async (req: Request, res: Response) => {
  const user = await updateUser(req.params.id as string, req.body, req.user!);
  sendResponse(res, 200, "User updated successfully", user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await softDeleteUser(req.params.id as string, req.user!);
  sendResponse(res, 200, "User deleted successfully", user);
};
