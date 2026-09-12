"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserRole = exports.updateMe = exports.getMe = exports.getAllUsers = void 0;
const express_1 = require("express");
const errorHandler_1 = require("../middlewares/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = require("../config/prisma");
const user_service_1 = require("../services/user.service");
const user_service_2 = require("../services/user.service");
exports.getAllUsers = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const users = await prisma_1.prisma.user.findMany({
        where: {
            deletedAt: null
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    });
    return (0, apiResponse_1.sendSuccess)(res, users, "Users fetched successfully", 200);
});
exports.getMe = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const user = await (0, user_service_1.getMyProfile)(req.user.userId);
    return (0, apiResponse_1.sendSuccess)(res, user, "Profile fetched successfully");
});
exports.updateMe = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const user = await (0, user_service_1.updateMyProfile)(req.user.userId, req.body);
    return (0, apiResponse_1.sendSuccess)(res, user, "Profile updated successfully");
});
exports.changeUserRole = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const user = await (0, user_service_2.updateUserRole)(req.params.id, req.body.role, req.user.userId);
    return (0, apiResponse_1.sendSuccess)(res, user, "User role updated successfully");
});
//# sourceMappingURL=user.controller.js.map