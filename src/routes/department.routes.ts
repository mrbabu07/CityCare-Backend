import { Router } from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/department.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../validations/department.validation";
import { idParamSchema } from "../validations/common.validation";

const router = Router();

router.get("/", protect, getAll);
router.get("/:id", protect, validateRequest(idParamSchema), getOne);

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  validateRequest(createDepartmentSchema),
  create,
);
router.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  validateRequest(updateDepartmentSchema.and(idParamSchema)),
  update,
);
router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  validateRequest(idParamSchema),
  remove,
);

export default router;
