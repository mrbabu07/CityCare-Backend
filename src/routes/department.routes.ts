import { Router } from "express";
import { create, getAll, getOne, update, remove } from "../controllers/department.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createDepartmentSchema, updateDepartmentSchema } from "../validations/department.validation";


const router = Router();

router.get("/", protect, getAll);
router.get("/:id", protect, getOne);

router.post("/", protect, authorize("ADMIN"), validateRequest(createDepartmentSchema), create);
router.patch("/:id", protect, authorize("ADMIN"), validateRequest(updateDepartmentSchema), update);
router.delete("/:id", protect, authorize("ADMIN"), remove);

export default router;