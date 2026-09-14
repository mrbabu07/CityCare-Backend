import { Router } from "express";
import { create, getAll, getOne, update, remove } from "../controllers/category.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createCategorySchema, updateCategorySchema, categoryListSchema } from "../validations/category.validation";
import { idParamSchema } from "../validations/common.validation";

const router = Router();

router.get("/", protect, validateRequest(categoryListSchema), getAll);
router.get("/:id", protect, validateRequest(idParamSchema), getOne);

router.post("/", protect, authorize("ADMIN"), validateRequest(createCategorySchema), create);
router.patch("/:id", protect, authorize("ADMIN"), validateRequest(updateCategorySchema.and(idParamSchema)), update);
router.delete("/:id", protect, authorize("ADMIN"), validateRequest(idParamSchema), remove);

export default router;
