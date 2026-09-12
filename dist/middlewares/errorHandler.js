"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.globalErrorHandler = exports.notFoundHandler = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const AppError_1 = require("../utils/AppError");
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        errors: [],
    });
};
exports.notFoundHandler = notFoundHandler;
const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues.map((i) => ({
                path: i.path.join("."),
                message: i.message,
            })),
        });
    }
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }
    if (typeof err === "object" && err !== null && "code" in err) {
        const prismaErr = err;
        if (prismaErr.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: `Duplicate value for: ${prismaErr.meta?.target?.join(", ")}`,
                errors: [],
            });
        }
        if (prismaErr.code === "P2025") {
            return res.status(404).json({ success: false, message: "Record not found", errors: [] });
        }
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: err instanceof Error ? err.message : "Internal server error",
        errors: [],
    });
};
exports.globalErrorHandler = globalErrorHandler;
const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};
exports.catchAsync = catchAsync;
//# sourceMappingURL=errorHandler.js.map