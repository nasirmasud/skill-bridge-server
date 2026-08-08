import { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

interface SuccessBody<T> {
  success: true;
  message: string;
  data: T;
}

interface PaginatedBody<T> {
  success: true;
  message: string;
  meta: PaginationMeta;
  data: T;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  meta?: PaginationMeta
): Response<SuccessBody<T> | PaginatedBody<T>> => {
  const body = meta
    ? { success: true, message, meta, data }
    : { success: true, message, data };

  return res.status(statusCode).json(body);
};
