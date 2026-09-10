import { Router } from "express";
import { create } from "../controllers/feedback.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { createFeedbackSchema } from "../validations/feedback.validation";

const router = Router({ mergeParams: true });

router.post("/", protect, authorize("CITIZEN"), validateRequest(createFeedbackSchema), create);

export default router;