import { Router } from "express";
import {
  initiate,
  success,
  fail,
  cancel,
  webhook,
  getStatus,
} from "../controllers/payment.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  initiatePaymentSchema,
  paymentStatusSchema,
  paymentCallbackSchema,
  paymentNotificationSchema,
  paymentResultSchema,
} from "../validations/payment.validation";

const router = Router();

router.post(
  "/initiate",
  protect,
  authorize("CITIZEN"),
  validateRequest(initiatePaymentSchema),
  initiate,
);
router
  .route("/success/:paymentId")
  .get(validateRequest(paymentCallbackSchema), success)
  .post(validateRequest(paymentCallbackSchema), success);
router
  .route("/fail/:paymentId")
  .get(validateRequest(paymentCallbackSchema), fail)
  .post(validateRequest(paymentCallbackSchema), fail);
router
  .route("/cancel/:paymentId")
  .get(validateRequest(paymentCallbackSchema), cancel)
  .post(validateRequest(paymentCallbackSchema), cancel);
router.post("/webhook", validateRequest(paymentNotificationSchema), webhook);
router.get(
  "/:complaintId/status",
  protect,
  validateRequest(paymentStatusSchema),
  getStatus,
);
router.get("/result", validateRequest(paymentResultSchema), (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Return status is informational; query the protected payment status endpoint for verification",
    data: { reportedStatus: req.query.status },
  });
});

export default router;
