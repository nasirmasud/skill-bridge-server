import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  deleteOrder,
  getAdminOrdersHandler,
  getMyOrdersHandler,
  getOrder,
  getReceivedOrdersHandler,
  placeOrder,
  updateOrderStatusHandler,
} from "../services/order/order.controller";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../services/order/order.validation";

const router = Router();

router.post("/", auth, checkRole("CLIENT"), validateRequest(createOrderSchema), placeOrder);
router.get("/", auth, checkRole("ADMIN"), getAdminOrdersHandler);
router.get("/my-orders", auth, checkRole("CLIENT"), getMyOrdersHandler);
router.get("/received-orders", auth, checkRole("FREELANCER"), getReceivedOrdersHandler);
router.get("/:id", auth, getOrder);
router.patch(
  "/:id/status",
  auth,
  validateRequest(updateOrderStatusSchema),
  updateOrderStatusHandler
);
router.delete("/:id", auth, checkRole("ADMIN"), deleteOrder);

export default router;
