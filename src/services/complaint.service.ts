import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { ComplaintStatus, ComplaintPriority, Prisma } from "@prisma/client";

export const createComplaint = async (
  citizenId: string,
  data: {
    title: string;
    description: string;
    categoryId: string;
    address: string;
    latitude?: number;
    longitude?: number;
    priority?: ComplaintPriority;
  },
) => {
  const category = await prisma.category.findFirst({
    where: { id: data.categoryId, deletedAt: null },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const slaDueAt = new Date(Date.now() + category.slaHours * 60 * 60 * 1000);

  const complaint = await prisma.complaint.create({
    data: {
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      departmentId: category.departmentId,
      citizenId,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      priority: data.priority || ComplaintPriority.MEDIUM,
      slaDueAt,
    },
  });
  await prisma.complaintStatusHistory.create({
    data: {
      complaintId: complaint.id,
      toStatus: ComplaintStatus.SUBMITTED,
      changedById: citizenId,
      note: "Complaint submitted",
    },
  });
  return complaint;
};
export const getComplaintById = async (id: string) => {
  const complaint = await prisma.complaint.findFirst({
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
    throw new AppError("Complaint not found", 404);
  }

  return complaint;
};

export const getComplaints = async (params: {
  page?: number;
  limit?: number;
  status?: ComplaintStatus;
  departmentId?: string;
  citizenId?: string;
  assignedToId?: string;
  search?: string;
}) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;

  const where: Prisma.ComplaintWhereInput = {
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

  const [complaints, total] = await prisma.$transaction([
    prisma.complaint.findMany({
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
    prisma.complaint.count({ where }),
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

const VALID_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["ASSIGNED", "REJECTED"],
  ASSIGNED: ["IN_PROGRESS", "UNDER_REVIEW"],
  IN_PROGRESS: ["RESOLVED", "ASSIGNED"],
  RESOLVED: ["CLOSED"],
  REJECTED: [],
  CLOSED: [],
};

export const updateComplaintStatus = async (
  complaintId: string,
  newStatus: ComplaintStatus,
  changedById: string,
  note?: string,
) => {
  const complaint = await getComplaintById(complaintId);

  const allowedNextStatuses = VALID_TRANSITIONS[complaint.status];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new AppError(
      `Cannot change status from ${complaint.status} to ${newStatus}. Allowed: ${allowedNextStatuses.join(", ") || "none"}`,
      400,
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedComplaint = await tx.complaint.update({
      where: { id: complaintId },
      data: {
        status: newStatus,
        resolvedAt:
          newStatus === ComplaintStatus.RESOLVED
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

    return updatedComplaint;
  });

  return updated;
};

export const assignStaffToComplaint = async (
  complaintId: string,
  staffId: string,
  changedById: string,
) => {
  const complaint = await getComplaintById(complaintId);

  const staff = await prisma.user.findFirst({
    where: { id: staffId, role: "STAFF", deletedAt: null, isActive: true },
  });

  if (!staff) {
    throw new AppError(
      "Staff member not found or is not an active STAFF user",
      404,
    );
  }

  if (!["UNDER_REVIEW", "ASSIGNED"].includes(complaint.status)) {
    throw new AppError(
      `Cannot assign staff while complaint is in ${complaint.status} status`,
      400,
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedComplaint = await tx.complaint.update({
      where: { id: complaintId },
      data: { assignedToId: staffId, status: ComplaintStatus.ASSIGNED },
    });

    await tx.complainStatusHistory.create({
      data: {
        complaintId,
        fromStatus: complaint.status,
        toStatus: ComplaintStatus.ASSIGNED,
        changedById,
        note: `Assigned to staff: ${staff.name}`,
      },
    });

    return updatedComplaint;
  });

  return updated;
};

export const softDeleteComplaint = async (id: string) => {
  await getComplaintById(id);
  return prisma.complaint.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
