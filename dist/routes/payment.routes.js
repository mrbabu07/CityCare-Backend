"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const payment_validation_1 = require("../validations/payment.validation");
const router = (0, express_1.Router)();
router.post("/initiate", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("CITIZEN"), (0, validateRequest_1.validateRequest)(payment_validation_1.initiatePaymentSchema), payment_controller_1.initiate);
router.get("/success/:paymentId", payment_controller_1.success);
router.get("/fail/:paymentId", payment_controller_1.fail);
router.get("/cancel/:paymentId", payment_controller_1.cancel);
router.post("/webhook", payment_controller_1.webhook);
router.get("/:complaintId/status", auth_middleware_1.protect, payment_controller_1.getStatus);
router.get("/result", (req, res) => {
    res.status(200).json({ success: true, message: `Payment ${req.query.status}`, data: {} });
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map