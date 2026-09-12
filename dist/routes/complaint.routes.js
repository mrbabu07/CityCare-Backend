"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaint_controller_1 = require("../controllers/complaint.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const complaint_validation_1 = require("../validations/complaint.validation");
const feedback_routes_1 = __importDefault(require("./feedback.routes"));
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("CITIZEN"), (0, validateRequest_1.validateRequest)(complaint_validation_1.createComplaintSchema), complaint_controller_1.create);
router.get("/", auth_middleware_1.protect, complaint_controller_1.getAll);
router.get("/:id", auth_middleware_1.protect, complaint_controller_1.getOne);
router.patch("/:id/status", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("STAFF", "ADMIN"), (0, validateRequest_1.validateRequest)(complaint_validation_1.updateStatusSchema), complaint_controller_1.updateStatus);
router.patch("/:id/assign", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("ADMIN"), (0, validateRequest_1.validateRequest)(complaint_validation_1.assignComplaintSchema), complaint_controller_1.assign);
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("ADMIN"), complaint_controller_1.remove);
router.use("/:complaintId/feedback", feedback_routes_1.default);
exports.default = router;
//# sourceMappingURL=complaint.routes.js.map