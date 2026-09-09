import { Router } from "express";
import { create, getAll, getOne, update, remove } from "../controllers/category.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createCategorySchema, updateCategorySchema } from "../validations/category.validation";

const router = Router();

router.get("/", protect, getAll);
router.get("/:id", protect, getOne);

router.post("/", protect, authorize("ADMIN"), validateRequest(createCategorySchema), create);
router.patch("/:id", protect, authorize("ADMIN"), validateRequest(updateCategorySchema), update);
router.delete("/:id", protect, authorize("ADMIN"), remove);

export default router;