"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getOne = exports.getAll = exports.create = void 0;
const express_1 = require("express");
const errorHandler_1 = require("../middlewares/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const category_service_1 = require("../services/category.service");
exports.create = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const category = await (0, category_service_1.createCategory)(req.body);
    return (0, apiResponse_1.sendSuccess)(res, category, "Category created successfully", 201);
});
exports.getAll = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const departmentId = req.query.departmentId;
    const categories = await (0, category_service_1.getAllCategories)(departmentId);
    return (0, apiResponse_1.sendSuccess)(res, categories, "Categories fetched successfully");
});
exports.getOne = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const category = await (0, category_service_1.getCategoryById)(req.params.id);
    return (0, apiResponse_1.sendSuccess)(res, category, "Category fetched successfully");
});
exports.update = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const category = await (0, category_service_1.updateCategory)(req.params.id, req.body);
    return (0, apiResponse_1.sendSuccess)(res, category, "Category updated successfully");
});
exports.remove = (0, errorHandler_1.catchAsync)(async (req, res) => {
    await (0, category_service_1.softDeleteCategory)(req.params.id);
    return (0, apiResponse_1.sendSuccess)(res, {}, "Category deleted successfully");
});
//# sourceMappingURL=category.controller.js.map