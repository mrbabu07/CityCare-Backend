import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export const createCategory = async (data: {
  name: string;
  departmentId: string;
  slaHours?: number;
}) => {
  const department = await prisma.department.findFirst({
    where: { id: data.departmentId, deletedAt: null },
  });

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  return prisma.category.create({ data });
};

export const getAllCategories = async (departmentId?: string) => {
  return prisma.category.findMany({
    where: {
      deletedAt: null,
      ...(departmentId ? { departmentId } : {}),
    },
    include: { department: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: { id, deletedAt: null },
    include: { department: true },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const updateCategory = async (
  id: string,
  data: { name?: string; slaHours?: number }
) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data });
};

export const softDeleteCategory = async (id: string) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
};