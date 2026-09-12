"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyProfile = exports.updateUserRole = exports.getMyProfile = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
const auditLog_1 = require("../utils/auditLog");
const getMyProfile = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
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
    if (!user) {
        throw new AppError_1.AppError("User not found", 404);
    }
    return user;
};
exports.getMyProfile = getMyProfile;
const updateUserRole = async (targetUserId, newRole, actorId) => {
    const targetUser = await prisma_1.prisma.user.findFirst({
        where: { id: targetUserId, deletedAt: null },
    });
    if (!targetUser) {
        throw new AppError_1.AppError("User not found", 404);
    }
    const updated = await prisma_1.prisma.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
    });
    await (0, auditLog_1.createAuditLog)({
        actorId,
        action: "ROLE_CHANGE",
        entityType: "User",
        entityId: targetUserId,
        metadata: { oldRole: targetUser.role, newRole },
    });
    return updated;
};
exports.updateUserRole = updateUserRole;
const updateMyProfile = async (userId, data) => {
    const user = await prisma_1.prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            updatedAt: true,
        },
    });
    return user;
};
exports.updateMyProfile = updateMyProfile;
//# sourceMappingURL=user.service.js.map