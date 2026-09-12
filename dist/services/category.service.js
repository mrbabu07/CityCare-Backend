"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const prisma_1 = require("../config/prisma");
const AppError_1 = require("../utils/AppError");
const createCategory = async (data) => {
    const department = await prisma_1.prisma.department.findFirst({
        where: { id: data.departmentId, deletedAt: null },
    });
    if (!department) {
        throw new AppError_1.AppError("Department not found", 404);
    }
    return prisma_1.prisma.category.create({ data });
};
exports.createCategory = createCategory;
const getAllCategories = async (departmentId) => {
    return prisma_1.prisma.category.findMany({
        where: {
            deletedAt: null,
            ...(departmentId ? { departmentId } : {}),
        },
        include: { department: true },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (id) => {
    const category = await prisma_1.prisma.category.findFirst({
        where: { id, deletedAt: null },
        include: { department: true },
    });
    if (!category) {
        throw new AppError_1.AppError("Category not found", 404);
    }
    return category;
};
exports.getCategoryById = getCategoryById;
const updateCategory = async (id, data) => {
    await (0, exports.getCategoryById)(id);
    return prisma_1.prisma.category.update({ where: { id }, data });
};
exports.updateCategory = updateCategory;
const softDeleteCategory = async (id) => {
    await (0, exports.getCategoryById)(id);
    return prisma_1.prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
};
exports.softDeleteCategory = softDeleteCategory;
//# sourceMappingURL=category.service.js.map