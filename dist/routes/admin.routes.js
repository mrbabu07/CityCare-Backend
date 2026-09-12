"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/dashboard-stats", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("ADMIN"), admin_controller_1.dashboardStats);
router.get("/audit-logs", auth_middleware_1.protect, (0, auth_middleware_1.authorize)("ADMIN"), admin_controller_1.auditLogs);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map