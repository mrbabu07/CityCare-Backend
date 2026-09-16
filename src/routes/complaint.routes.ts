import { Router } from "express";
import { create, getAll, getOne, updateStatus, assign, remove, uploadAttachment, removeAttachment } from "../controllers/complaint.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createComplaintSchema,
  updateStatusSchema,
  assignComplaintSchema,
  complaintListSchema,
} from "../validations/complaint.validation";
import { attachmentParamsSchema, complaintIdParamSchema, idParamSchema } from "../validations/common.validation";
import feedbackRoutes from "./feedback.routes";
import { uploadComplaintAttachment } from "../middlewares/upload.middleware";

const router = Router();

router.post("/", protect, authorize("CITIZEN"), validateRequest(createComplaintSchema), create);
router.get("/", protect, validateRequest(complaintListSchema), getAll);
router.get("/:id", protect, validateRequest(idParamSchema), getOne);

router.patch(
  "/:id/status",
  protect,
  authorize("STAFF", "ADMIN"),
  validateRequest(updateStatusSchema.and(idParamSchema)),
  updateStatus
);

router.patch(
  "/:id/assign",
  protect,
  authorize("ADMIN"),
  validateRequest(assignComplaintSchema),
  assign
);

router.delete("/:id", protect, authorize("ADMIN"), validateRequest(idParamSchema), remove);
router.post(
  "/:complaintId/attachments",
  protect,
  uploadComplaintAttachment,
  validateRequest(complaintIdParamSchema),
  uploadAttachment,
);
router.delete(
  "/:complaintId/attachments/:attachmentId",
  protect,
  validateRequest(attachmentParamsSchema),
  removeAttachment,
);
router.use("/:complaintId/feedback", feedbackRoutes);


export default router;
