import { Router } from "express";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  updateProfileSchema,
  updateRoleSchema,
} from "../validations/user.validation";
import {
  getAllUsers,
  getMe,
  updateMe,
  changeUserRole,
} from "../controllers/user.controller";

const router = Router();

router.get("/me", protect, getMe);
router.patch("/me", protect, validateRequest(updateProfileSchema), updateMe);
router.get("/", protect, authorize("ADMIN"), getAllUsers);
router.patch(
  "/:id/role",
  protect,
  authorize("ADMIN"),
  validateRequest(updateRoleSchema),
  changeUserRole,
);

export default router;
