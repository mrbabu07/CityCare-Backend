import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { createAuditLog } from "../utils/auditLog";


export const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
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
    throw new AppError("User not found", 404);
  }

  return user;
};

export const updateUserRole = async (
  targetUserId: string,
  newRole: "CITIZEN" | "STAFF" | "ADMIN",
  actorId: string 
) => {
  const targetUser = await prisma.user.findFirst({
    where: {id: targetUserId, deletedAt: null },
  });

  if(!targetUser) {
    throw new AppError("User not found", 404);

  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });
  await createAuditLog({
    actorId, 
    action: "ROLE_CHANGE",
    entityType: "User",
    entityId: targetUserId,
    metadata: { oldRole: targetUser.role, newRole },
  });
  return updated;
}

export const updateMyProfile = async (
  userId: string,
  data: { name?: string; phone?: string }
) => {
  const user = await prisma.user.update({
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