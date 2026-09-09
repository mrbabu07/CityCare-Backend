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
  await prisma.complainStatusHistory.create({
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