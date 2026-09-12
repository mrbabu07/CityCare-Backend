"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedback_controller_1 = require("../controllers/feedback.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const feedback_validation_1 = require("../validations/feedback.validation");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("CITIZEN"), (0, validateRequest_1.validateRequest)(feedback_validation_1.createFeedbackSchema), feedback_controller_1.create);
exports.default = router;
//# sourceMappingURL=feedback.routes.js.map