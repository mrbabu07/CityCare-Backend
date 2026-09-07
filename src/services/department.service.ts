import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export const createDepartment = async (data: {
  name: string;
  description?: string;
}) => {
  const existing = await prisma.department.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new AppError("Department already exists", 409);
  }
  return await prisma.department.create({ data });
};

export const getAllDepartments = async () => {
  return prisma.department.findMany({
    where: { deletedAt: null },
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getDepartmentById = async (id: string) => {
  const department = await prisma.department.findFirst({
    where: { id, deletedAt: null },
    include: { categories: true },
  });

  if (!department) {
    throw new AppError("Department not found", 404);
  }
  return department;
};

export const updateDepartment = async (
  id: string,
  data: { name?: string; description?: string },
) => {
  await getDepartmentById(id);
  return prisma.department.update({
    where: { id },
    data,
  });
};

export const softDeleteDepartment = async (id: string) => {
    await getDepartmentById(id);

    return prisma.department.update({
        where: {id}
        data: { deletedAt: new Date()}
    });
}