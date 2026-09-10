import { prisma } from "../config/prisma";

export const getDashboardStats = async () => {
  const [
    totalComplaints,
    totalUsers,
    totalCitizens,
    totalStaff,
    complaintsByStatus,
    complaintsByPriority,
  ] = await prisma.$transaction([
    prisma.complaint.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, role: "CITIZEN" } }),
    prisma.user.count({ where: { deletedAt: null, role: "STAFF" } }),
    prisma.complaint.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: true,
    }),
    prisma.complaint.groupBy({
      by: ["priority"],
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
    },
    resolutionRate:
      totalComplaints > 0 ? ((resolvedCount / totalComplaints) * 100).toFixed(1) + "%" : "0%",
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
      include: { actor: { select: { id: true, name: true, email: true, role: true } } },
    }),
    prisma.auditLog.count(),
  ]);

  return { logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};