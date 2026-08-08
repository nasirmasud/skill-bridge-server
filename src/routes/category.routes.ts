import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  createCategoryHandler,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategoryHandler,
} from "../services/category/category.controller";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../services/category/category.validation";

const router = Router();

router.post(
  "/",
  auth,
  checkRole("ADMIN"),
  validateRequest(createCategorySchema),
  createCategoryHandler
);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.patch(
  "/:id",
  auth,
  checkRole("ADMIN"),
  validateRequest(updateCategorySchema),
  updateCategoryHandler
);
router.delete("/:id", auth, checkRole("ADMIN"), deleteCategory);

export default router;
