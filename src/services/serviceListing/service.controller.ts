import { Request, Response } from "express";
import { sendResponse } from "../../lib/sendResponse";
import {
  createService,
  getAllServices,
  getServiceById,
  getServicesByFreelancer,
  softDeleteService,
  updateService,
} from "./service.service";

export const createServiceHandler = async (req: Request, res: Response) => {
  const service = await createService(req.user!.id, req.body);
  sendResponse(res, 201, "Service created successfully", service);
};

export const getServices = async (req: Request, res: Response) => {
  const result = await getAllServices(req.query);
  sendResponse(res, 200, "Services retrieved successfully", result.data, result.meta);
};

export const getService = async (req: Request, res: Response) => {
  const service = await getServiceById(req.params.id as string);
  sendResponse(res, 200, "Service retrieved successfully", service);
};

export const getFreelancerServices = async (req: Request, res: Response) => {
  const services = await getServicesByFreelancer(
    req.params.freelancerId as string
  );
  sendResponse(res, 200, "Services retrieved successfully", services);
};

export const updateServiceHandler = async (req: Request, res: Response) => {
  const service = await updateService(
    req.params.id as string,
    req.body,
    req.user!
  );
  sendResponse(res, 200, "Service updated successfully", service);
};

export const deleteService = async (req: Request, res: Response) => {
  const service = await softDeleteService(req.params.id as string, req.user!);
  sendResponse(res, 200, "Service deleted successfully", service);
};
