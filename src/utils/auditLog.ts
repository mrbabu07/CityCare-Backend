import { prisma } from "../config/prisma";

export const createAuditLog = async (data: {
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: object;
}) => {
    await prisma.auditLog.create({ data })
};