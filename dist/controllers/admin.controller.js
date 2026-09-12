"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogs = exports.dashboardStats = void 0;
const express_1 = require("express");
const errorHandler_1 = require("../middlewares/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const admin_service_1 = require("../services/admin.service");
exports.dashboardStats = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const stats = await (0, admin_service_1.getDashboardStats)();
    return (0, apiResponse_1.sendSuccess)(res, stats, "Dashboard stats fetched successfully");
});
exports.auditLogs = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { page, limit } = req.query;
    const result = await (0, admin_service_1.getAuditLogs)(page ? Number(page) : 1, limit ? Number(limit) : 20);
    return (0, apiResponse_1.sendSuccess)(res, result, "Audit logs fetched successfully");
});
//# sourceMappingURL=admin.controller.js.map