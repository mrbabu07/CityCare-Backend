import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export const createFeedback = async (
    complaintId: string,
    citizenId: string,
    data: { rating: number; comment?: string }
) => {
    const complaint = await prisma.complaint.findFirst({
        where: { id: complaintId, deletedAt: null },
    });

    if(!complaint) {
        throw new AppError("Complaint not found", 404);

    }
    if(complaint.citizenId !== citizenId) {
        throw new AppError("You can only give feedback on your own complaints", 403);

    }

    if(!["RESOLVED", "CLOSED"].includes(complaint.status)){
        throw new AppError("You can give feedback on resolved complaints", 400);
    }
    const existing = await prisma.feedback.findUnique({ where: { complaintId}});
    if(existing) {
        throw new AppError("Feedback is already submitted for this complaint", 409);

    }

    return prisma.feedback.create({
        data: {
            complaintId,
            citizenId,
            rating: data.rating,
            comment: data.comment,
        },
    });
};