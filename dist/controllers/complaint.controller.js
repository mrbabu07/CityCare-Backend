"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.assign = exports.updateStatus = exports.getOne = exports.getAll = exports.create = void 0;
const express_1 = require("express");
const errorHandler_1 = require("../middlewares/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const complaint_service_1 = require("../services/complaint.service");
const client_1 = require("@prisma/client");
exports.create = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const complaint = await (0, complaint_service_1.createComplaint)(req.user.userId, req.body);
    return (0, apiResponse_1.sendSuccess)(res, complaint, "Complaint submitted successfully", 201);
});
exports.getAll = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { page, limit, status, departmentId, search } = req.query;
    const filters = {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        status: status,
        departmentId: departmentId,
        search: search,
    };
    if (req.user.role === "CITIZEN") {
        filters.citizenId = req.user.userId;
    }
    else if (req.user.role === "STAFF") {
        filters.assignedToId = req.user.userId;
    }
    const result = await (0, complaint_service_1.getComplaints)(filters);
    return (0, apiResponse_1.sendSuccess)(res, result, "Complaints fetched successfully");
});
exports.getOne = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const complaint = await (0, complaint_service_1.getComplaintById)(req.params.id);
    return (0, apiResponse_1.sendSuccess)(res, complaint, "Complaint fetched successfully");
});
exports.updateStatus = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { status, note } = req.body;
    const complaint = await (0, complaint_service_1.updateComplaintStatus)(req.params.id, status, req.user.userId, note);
    return (0, apiResponse_1.sendSuccess)(res, complaint, "Complaint status updated successfully");
});
exports.assign = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { staffId } = req.body;
    const complaint = await (0, complaint_service_1.assignStaffToComplaint)(req.params.id, staffId, req.user.userId);
    return (0, apiResponse_1.sendSuccess)(res, complaint, "Staff assigned successfully");
});
exports.remove = (0, errorHandler_1.catchAsync)(async (req, res) => {
    await (0, complaint_service_1.softDeleteComplaint)(req.params.id);
    return (0, apiResponse_1.sendSuccess)(res, {}, "Complaint deleted successfully");
});
//# sourceMappingURL=complaint.controller.js.map