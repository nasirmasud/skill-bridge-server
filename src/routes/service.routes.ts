import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  createServiceHandler,
  deleteService,
  getFreelancerServices,
  getService,
  getServices,
  updateServiceHandler,
} from "../services/serviceListing/service.controller";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../services/serviceListing/service.validation";

const router = Router();

router.post(
  "/",
  auth,
  checkRole("FREELANCER"),
  validateRequest(createServiceSchema),
  createServiceHandler
);
router.get("/", getServices);
router.get("/freelancer/:freelancerId", getFreelancerServices);
router.get("/:id", getService);
router.patch(
  "/:id",
  auth,
  validateRequest(updateServiceSchema),
  updateServiceHandler
);
router.delete("/:id", auth, deleteService);

export default router;
