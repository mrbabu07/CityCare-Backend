"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const user_validation_1 = require("../validations/user.validation");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get("/me", auth_middleware_1.protect, user_controller_1.getMe);
router.patch("/me", auth_middleware_1.protect, (0, validateRequest_1.validateRequest)(user_validation_1.updateProfileSchema), user_controller_1.updateMe);
router.get("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("ADMIN"), user_controller_1.getAllUsers);
router.patch("/:id/role", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("ADMIN"), user_controller_1.changeUserRole);
exports.default = router;
//# sourceMappingURL=user.routes.js.map