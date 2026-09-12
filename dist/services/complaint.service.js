"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteComplaint = exports.assignStaffToComplaint = exports.updateComplaintStatus = exports.getComplaints = exports.getComplaintById = exports.createComplaint = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
const client_1 = require("@prisma/client");
const email_1 = require("../utils/email");
const createComplaint = async (citizenId, data) => {
    const category = await prisma_1.prisma.category.findFirst({
        where: { id: data.categoryId, deletedAt: null },
    });
    if (!category) {
        throw new AppError_1.AppError("Category not found", 404);
    }
    const slaDueAt = new Date(Date.now() + category.slaHours * 60 * 60 * 1000);
    const complaint = await prisma_1.prisma.complaint.create({
        data: {
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            departmentId: category.departmentId,
            citizenId,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            priority: data.priority || client_1.ComplaintPriority.MEDIUM,
            slaDueAt,
        },
    });
    await prisma_1.prisma.complaintStatusHistory.create({
        data: {
            complaintId: complaint.id,
            toStatus: client_1.ComplaintStatus.SUBMITTED,
            changedById: citizenId,
            note: "Complaint submitted",
        },
    });
    return complaint;
};
exports.createComplaint = createComplaint;
const getComplaintById = async (id) => {
    const complaint = await prisma_1.prisma.complaint.findFirst({
        where: { id, deletedAt: null },
        include: {
            citizen: { select: { id: true, name: true, email: true, phone: true } },
            assignedTo: { select: { id: true, name: true, email: true } },
            category: true,
            department: true,
            attachments: true,
            statusHistory: { orderBy: { createdAt: "asc" } },
            feedback: true,
        },
    });
    if (!complaint) {
        throw new AppError_1.AppError("Complaint not found", 404);
    }
    return complaint;
};
exports.getComplaintById = getComplaintById;
const getComplaints = async (params) => {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const skip = (page - 1) * limit;
    const where = {
        deletedAt: null,
        ...(params.status ? { status: params.status } : {}),
        ...(params.departmentId ? { departmentId: params.departmentId } : {}),
        ...(params.citizenId ? { citizenId: params.citizenId } : {}),
        ...(params.assignedToId ? { assignedToId: params.assignedToId } : {}),
        ...(params.search
            ? {
                OR: [
                    { title: { contains: params.search, mode: "insensitive" } },
                    { description: { contains: params.search, mode: "insensitive" } },
                ],
            }
            : {}),
    };
    const [complaints, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.complaint.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                citizen: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
                category: { select: { id: true, name: true } },
                department: { select: { id: true, name: true } },
            },
        }),
        prisma_1.prisma.complaint.count({ where }),
    ]);
    return {
        complaints,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getComplaints = getComplaints;
const VALID_TRANSITIONS = {
    SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
    UNDER_REVIEW: ["ASSIGNED", "REJECTED"],
    ASSIGNED: ["IN_PROGRESS", "UNDER_REVIEW"],
    IN_PROGRESS: ["RESOLVED", "ASSIGNED"],
    RESOLVED: ["CLOSED"],
    REJECTED: [],
    CLOSED: [],
};
const updateComplaintStatus = async (complaintId, newStatus, changedById, note) => {
    const complaint = await (0, exports.getComplaintById)(complaintId);
    const allowedNextStatuses = VALID_TRANSITIONS[complaint.status];
    if (!allowedNextStatuses.includes(newStatus)) {
        throw new AppError_1.AppError(`Cannot change status from ${complaint.status} to ${newStatus}. Allowed: ${allowedNextStatuses.join(", ") || "none"}`, 400);
    }
    const updated = await prisma_1.prisma.$transaction(async (tx) => {
        const updatedComplaint = await tx.complaint.update({
            where: { id: complaintId },
            data: {
                status: newStatus,
                resolvedAt: newStatus === client_1.ComplaintStatus.RESOLVED
                    ? new Date()
                    : complaint.resolvedAt,
            },
        });
        await tx.complaintStatusHistory.create({
            data: {
                complaintId,
                fromStatus: complaint.status,
                toStatus: newStatus,
                changedById,
                note,
            },
        });
        if (newStatus === client_1.ComplaintStatus.RESOLVED || newStatus === client_1.ComplaintStatus.REJECTED) {
            const citizen = await prisma_1.prisma.user.findUnique({ where: { id: complaint.citizenId } });
            if (citizen) {
                (0, email_1.sendEmail)(citizen.email, `Your complaint has been ${newStatus.toLowerCase()}`, `<p>Hi ${citizen.name},</p>
         <p>Your complaint "<strong>${complaint.title}</strong>" has been marked as <strong>${newStatus}</strong>.</p>
         ${note ? `<p>Note: ${note}</p>` : ""}
         <p>Thank you for using CityCare.</p>`);
            }
        }
        return updatedComplaint;
    });
    return updated;
};
exports.updateComplaintStatus = updateComplaintStatus;
const assignStaffToComplaint = async (complaintId, staffId, changedById) => {
    const complaint = await (0, exports.getComplaintById)(complaintId);
    const staff = await prisma_1.prisma.user.findFirst({
        where: { id: staffId, role: "STAFF", deletedAt: null, isActive: true },
    });
    if (!staff) {
        throw new AppError_1.AppError("Staff member not found or is not an active STAFF user", 404);
    }
    if (!["UNDER_REVIEW", "ASSIGNED"].includes(complaint.status)) {
        throw new AppError_1.AppError(`Cannot assign staff while complaint is in ${complaint.status} status`, 400);
    }
    const updated = await prisma_1.prisma.$transaction(async (tx) => {
        const updatedComplaint = await tx.complaint.update({
            where: { id: complaintId },
            data: { assignedToId: staffId, status: client_1.ComplaintStatus.ASSIGNED },
        });
        await tx.complainStatusHistory.create({
            data: {
                complaintId,
                fromStatus: complaint.status,
                toStatus: client_1.ComplaintStatus.ASSIGNED,
                changedById,
                note: `Assigned to staff: ${staff.name}`,
            },
        });
        return updatedComplaint;
    });
    return updated;
};
exports.assignStaffToComplaint = assignStaffToComplaint;
const softDeleteComplaint = async (id) => {
    await (0, exports.getComplaintById)(id);
    return prisma_1.prisma.complaint.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};
exports.softDeleteComplaint = softDeleteComplaint;
//# sourceMappingURL=complaint.service.js.map