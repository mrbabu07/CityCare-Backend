import { Router } from "express";
import { create, getAll, getOne, updateStatus, assign, remove } from "../controllers/complaint.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createComplaintSchema,
  updateStatusSchema,
  assignComplaintSchema,
} from "../validations/complaint.validation";
import feedbackRoutes from "./feedback.routes";

const router = Router();

router.post("/", protect, authorize("CITIZEN"), validateRequest(createComplaintSchema), create);
router.get("/", protect, getAll);
router.get("/:id", protect, getOne);

router.patch(
  "/:id/status",
  protect,
  authorize("STAFF", "ADMIN"),
  validateRequest(updateStatusSchema),
  updateStatus
);

router.patch(
  "/:id/assign",
  protect,
  authorize("ADMIN"),
  validateRequest(assignComplaintSchema),
  assign
);

router.delete("/:id", protect, authorize("ADMIN"), remove);
router.use("/:complaintId/feedback", feedbackRoutes);


export default router;