"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteDepartment = exports.updateDepartment = exports.getDepartmentById = exports.getAllDepartments = exports.createDepartment = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
const createDepartment = async (data) => {
    const existing = await prisma_1.prisma.department.findUnique({
        where: { name: data.name },
    });
    if (existing) {
        throw new AppError_1.AppError("Department already exists", 409);
    }
    return await prisma_1.prisma.department.create({ data });
};
exports.createDepartment = createDepartment;
const getAllDepartments = async () => {
    return prisma_1.prisma.department.findMany({
        where: { deletedAt: null },
        include: { categories: true },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllDepartments = getAllDepartments;
const getDepartmentById = async (id) => {
    const department = await prisma_1.prisma.department.findFirst({
        where: { id, deletedAt: null },
        include: { categories: true },
    });
    if (!department) {
        throw new AppError_1.AppError("Department not found", 404);
    }
    return department;
};
exports.getDepartmentById = getDepartmentById;
const updateDepartment = async (id, data) => {
    await (0, exports.getDepartmentById)(id);
    return prisma_1.prisma.department.update({
        where: { id },
        data,
    });
};
exports.updateDepartment = updateDepartment;
const softDeleteDepartment = async (id) => {
    await (0, exports.getDepartmentById)(id);
    return prisma_1.prisma.department.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};
exports.softDeleteDepartment = softDeleteDepartment;
//# sourceMappingURL=department.service.js.map