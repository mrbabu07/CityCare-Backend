"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getOne = exports.getAll = exports.create = void 0;
const express_1 = require("express");
const errorHandler_1 = require("../middlewares/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const department_service_1 = require("../services/department.service");
exports.create = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const department = await (0, department_service_1.createDepartment)(req.body);
    return (0, apiResponse_1.sendSuccess)(res, department, "Department created successfully", 201);
});
exports.getAll = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const departments = await (0, department_service_1.getAllDepartments)();
    return (0, apiResponse_1.sendSuccess)(res, departments, "Departments fetched successfully");
});
exports.getOne = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const department = await (0, department_service_1.getDepartmentById)(req.params.id);
    return (0, apiResponse_1.sendSuccess)(res, department, "Department fetched successfully");
});
exports.update = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const department = await (0, department_service_1.updateDepartment)(req.params.id, req.body);
    return (0, apiResponse_1.sendSuccess)(res, department, "Department updated successfully");
});
exports.remove = (0, errorHandler_1.catchAsync)(async (req, res) => {
    await (0, department_service_1.softDeleteDepartment)(req.params.id);
    return (0, apiResponse_1.sendSuccess)(res, {}, "Department deleted successfully");
});
//# sourceMappingURL=department.controller.js.map