"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const auth_validation_1 = require("../validations/auth.validation");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(auth_validation_1.registerSchema), auth_controller_1.register);
router.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.loginSchema), auth_controller_1.login);
router.post("/refresh", auth_controller_1.refresh);
router.post("/logout", auth_middleware_1.protect, auth_controller_1.logout);
router.post("/register", rateLimiter_1.authLimiter, (0, validateRequest_1.validateRequest)(auth_validation_1.registerSchema), auth_controller_1.register);
router.post("/login", rateLimiter_1.authLimiter, (0, validateRequest_1.validateRequest)(auth_validation_1.loginSchema), auth_controller_1.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map