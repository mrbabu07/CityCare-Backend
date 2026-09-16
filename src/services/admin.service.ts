import { prisma } from "../config/prisma";

export const getDashboardStats = async () => {
  const [
    totalComplaints,
    totalUsers,
    totalCitizens,
    totalStaff,
    complaintsByStatus,
    complaintsByPriority,
    overdueComplaints,
  ] = await prisma.$transaction([
    prisma.complaint.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, role: "CITIZEN" } }),
    prisma.user.count({ where: { deletedAt: null, role: "STAFF" } }),
    prisma.complaint.groupBy({
      by: ["status"],
      orderBy: { status: "asc" },
      where: { deletedAt: null },
      _count: true,
    }),
    prisma.complaint.count({
      where: {
        deletedAt: null,
        slaDueAt: { lt: new Date() },
        status: { notIn: ["RESOLVED", "REJECTED", "CLOSED"] },
      },
    }),
    prisma.complaint.groupBy({
      by: ["priority"],
      orderBy: { priority: "asc" },
      where: { deletedAt: null },
      _count: true,
    }),
  ]);

  const resolvedCount = await prisma.complaint.count({
    where: { deletedAt: null, status: "RESOLVED" },
  });

  return {
    totals: {
      complaints: totalComplaints,
      users: totalUsers,
      citizens: totalCitizens,
      staff: totalStaff,
      overdueComplaints,
    },
    resolutionRate:
      totalComplaints > 0
        ? ((resolvedCount / totalComplaints) * 100).toFixed(1) + "%"
        : "0%",
    complaintsByStatus,
    complaintsByPriority,
  };
};

export const getAuditLogs = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    prisma.auditLog.count(),
  ]);

  return {
    logs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};
