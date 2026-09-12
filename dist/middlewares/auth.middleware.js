"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const express_1 = require("express");
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../utils/AppError");
const prisma_1 = require("../config/prisma");
const protect = async (req, res, next) => {
    try {
        // ১. Header থেকে টোকেন বের করা
        const authHeader = req.headers.authorization; // ফরম্যাট: "Bearer <token>"
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError_1.AppError("You are not logged in. Please log in to continue.", 401);
        }
        const token = authHeader.split(" ")[1];
        // ২. টোকেন যাচাই করা
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        // ৩. ইউজার এখনো ডাটাবেজে আছে এবং active কিনা চেক করা
        const user = await prisma_1.prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user || !user.isActive || user.deletedAt) {
            throw new AppError_1.AppError("This user no longer exists or is inactive.", 401);
        }
        // ৪. পরবর্তী middleware/controller-এর জন্য req.user-এ বসিয়ে দেওয়া
        req.user = { userId: user.id, role: user.role };
        next();
    }
    catch (err) {
        if (err instanceof AppError_1.AppError)
            return next(err);
        next(new AppError_1.AppError("Invalid or expired token. Please log in again.", 401));
    }
};
exports.protect = protect;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new AppError_1.AppError("You do not have permission to perform this action.", 403));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map