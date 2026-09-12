"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = exports.webhook = exports.cancel = exports.fail = exports.success = exports.initiate = void 0;
const express_1 = require("express");
const errorHandler_1 = require("../middlewares/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const payment_service_1 = require("../services/payment.service");
exports.initiate = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const result = await (0, payment_service_1.initiatePayment)(req.body.complaintId, req.user.userId);
    return (0, apiResponse_1.sendSuccess)(res, result, "Payment session created successfully");
});
exports.success = (0, errorHandler_1.catchAsync)(async (req, res) => {
    await (0, payment_service_1.verifyAndUpdatePayment)(req.params.paymentId, "success");
    return res.redirect(`${process.env.BACKEND_URL}/api/v1/payments/result?status=success`);
});
exports.fail = (0, errorHandler_1.catchAsync)(async (req, res) => {
    await (0, payment_service_1.verifyAndUpdatePayment)(req.params.paymentId, "fail");
    return res.redirect(`${process.env.BACKEND_URL}/api/v1/payments/result?status=fail`);
});
exports.cancel = (0, errorHandler_1.catchAsync)(async (req, res) => {
    await (0, payment_service_1.verifyAndUpdatePayment)(req.params.paymentId, "cancel");
    return res.redirect(`${process.env.BACKEND_URL}/api/v1/payments/result?status=cancel`);
});
exports.webhook = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const tranId = req.body.tran_id;
    const status = req.body.status === "VALID" ? "success" : "fail";
    if (tranId) {
        await (0, payment_service_1.verifyAndUpdatePayment)(tranId, status);
    }
    return res.status(200).send("IPN received");
});
exports.getStatus = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const payment = await (0, payment_service_1.getPaymentStatus)(req.params.complaintId);
    return (0, apiResponse_1.sendSuccess)(res, payment, "Payment status fetched successfully");
});
//# sourceMappingURL=payment.controller.js.map