import { Router } from "express";
import { initiate, success, fail, cancel, webhook, getStatus } from "../controllers/payment.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import { initiatePaymentSchema, paymentStatusSchema } from "../validations/payment.validation";

const router = Router();

router.post("/initiate", protect, authorize("CITIZEN"), validateRequest(initiatePaymentSchema), initiate);
router.all("/success/:paymentId", success);
router.all("/fail/:paymentId", fail);
router.all("/cancel/:paymentId", cancel);
router.post("/webhook", webhook);
router.get("/:complaintId/status", protect, validateRequest(paymentStatusSchema), getStatus);
router.get("/result", (req, res) => {
  res.status(200).json({ success: true, message: `Payment ${req.query.status}`, data: {} });
});

export default router;
