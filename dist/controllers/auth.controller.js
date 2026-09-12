"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const express_1 = require("express");
const errorHandler_1 = require("../middlewares/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const auth_service_1 = require("../services/auth.service");
exports.register = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const result = await (0, auth_service_1.registerUser)(req.body);
    return (0, apiResponse_1.sendSuccess)(res, result, "User registered successfully", 201);
});
exports.login = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const result = await (0, auth_service_1.loginUser)(req.body);
    return (0, apiResponse_1.sendSuccess)(res, result, "User logged in successfully", 200);
});
exports.refresh = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await (0, auth_service_1.refreshAccessToken)(refreshToken);
    return (0, apiResponse_1.sendSuccess)(res, result, "Access token refreshed successfully");
});
exports.logout = (0, errorHandler_1.catchAsync)(async (req, res) => {
    return (0, apiResponse_1.sendSuccess)(res, {}, "Logged out successfully");
});
//# sourceMappingURL=auth.controller.js.map