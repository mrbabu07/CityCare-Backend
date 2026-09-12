"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedback = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
const createFeedback = async (complaintId, citizenId, data) => {
    const complaint = await prisma_1.prisma.complaint.findFirst({
        where: { id: complaintId, deletedAt: null },
    });
    if (!complaint) {
        throw new AppError_1.AppError("Complaint not found", 404);
    }
    if (complaint.citizenId !== citizenId) {
        throw new AppError_1.AppError("You can only give feedback on your own complaints", 403);
    }
    if (!["RESOLVED", "CLOSED"].includes(complaint.status)) {
        throw new AppError_1.AppError("You can give feedback on resolved complaints", 400);
    }
    const existing = await prisma_1.prisma.feedback.findUnique({ where: { complaintId } });
    if (existing) {
        throw new AppError_1.AppError("Feedback is already submitted for this complaint", 409);
    }
    return prisma_1.prisma.feedback.create({
        data: {
            complaintId,
            citizenId,
            rating: data.rating,
            comment: data.comment,
        },
    });
};
exports.createFeedback = createFeedback;
//# sourceMappingURL=feedback.service.js.map