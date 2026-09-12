"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.getDashboardStats = void 0;
const prisma_1 = require("../config/prisma");
const getDashboardStats = async () => {
    const [totalComplaints, totalUsers, totalCitizens, totalStaff, complaintsByStatus, complaintsByPriority,] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.complaint.count({ where: { deletedAt: null } }),
        prisma_1.prisma.user.count({ where: { deletedAt: null } }),
        prisma_1.prisma.user.count({ where: { deletedAt: null, role: "CITIZEN" } }),
        prisma_1.prisma.user.count({ where: { deletedAt: null, role: "STAFF" } }),
        prisma_1.prisma.complaint.groupBy({
            by: ["status"],
            where: { deletedAt: null },
            _count: true,
        }),
        prisma_1.prisma.complaint.groupBy({
            by: ["priority"],
            where: { deletedAt: null },
            _count: true,
        }),
    ]);
    const resolvedCount = await prisma_1.prisma.complaint.count({
        where: { deletedAt: null, status: "RESOLVED" },
    });
    return {
        totals: {
            complaints: totalComplaints,
            users: totalUsers,
            citizens: totalCitizens,
            staff: totalStaff,
        },
        resolutionRate: totalComplaints > 0 ? ((resolvedCount / totalComplaints) * 100).toFixed(1) + "%" : "0%",
        complaintsByStatus,
        complaintsByPriority,
    };
};
exports.getDashboardStats = getDashboardStats;
const getAuditLogs = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [logs, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.auditLog.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { actor: { select: { id: true, name: true, email: true, role: true } } },
        }),
        prisma_1.prisma.auditLog.count(),
    ]);
    return { logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};
exports.getAuditLogs = getAuditLogs;
//# sourceMappingURL=admin.service.js.map