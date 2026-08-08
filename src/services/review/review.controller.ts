import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  createReview,
  getReviewById,
  getServiceReviews,
  softDeleteReview,
  updateReview,
} from "./review.service";

export const createReviewHandler = async (req: Request, res: Response) => {
  const review = await createReview(req.user!.id, req.body);
  sendResponse(res, 201, "Review created successfully", review);
};

export const getServiceReviewsHandler = async (req: Request, res: Response) => {
  const reviews = await getServiceReviews(req.params.serviceId as string);
  sendResponse(res, 200, "Reviews retrieved successfully", reviews);
};

export const getReview = async (req: Request, res: Response) => {
  const review = await getReviewById(req.params.id as string);
  sendResponse(res, 200, "Review retrieved successfully", review);
};

export const updateReviewHandler = async (req: Request, res: Response) => {
  const review = await updateReview(req.params.id as string, req.body, req.user!);
  sendResponse(res, 200, "Review updated successfully", review);
};

export const deleteReview = async (req: Request, res: Response) => {
  const review = await softDeleteReview(req.params.id as string, req.user!);
  sendResponse(res, 200, "Review deleted successfully", review);
};
