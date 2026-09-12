"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const express_1 = require("express");
const errorHandler_1 = require("../middlewares/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const feedback_service_1 = require("../services/feedback.service");
exports.create = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const feedback = await (0, feedback_service_1.createFeedback)(req.params.complaintId, req.user.userId, req.body);
    return (0, apiResponse_1.sendSuccess)(res, feedback, "Feedback submitted successfully", 201);
});
//# sourceMappingURL=feedback.controller.js.map