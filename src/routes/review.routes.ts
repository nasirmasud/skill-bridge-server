import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  createReviewHandler,
  deleteReview,
  getReview,
  getServiceReviewsHandler,
  updateReviewHandler,
} from "../services/review/review.controller";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../services/review/review.validation";

const router = Router();

router.post(
  "/",
  auth,
  checkRole("CLIENT"),
  validateRequest(createReviewSchema),
  createReviewHandler
);
router.get("/service/:serviceId", getServiceReviewsHandler);
router.get("/:id", getReview);
router.patch(
  "/:id",
  auth,
  validateRequest(updateReviewSchema),
  updateReviewHandler
);
router.delete("/:id", auth, deleteReview);

export default router;
