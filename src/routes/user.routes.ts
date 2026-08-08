import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  deleteUser,
  getMe,
  getUser,
  getUsers,
  updateUserHandler,
} from "../services/user/user.controller";
import { updateUserSchema } from "../services/user/user.validation";

const router = Router();

router.get("/", auth, checkRole("ADMIN"), getUsers);
router.get("/me", auth, getMe);
router.get("/:id", auth, getUser);
router.patch("/:id", auth, validateRequest(updateUserSchema), updateUserHandler);
router.delete("/:id", auth, checkRole("ADMIN"), deleteUser);

export default router;
