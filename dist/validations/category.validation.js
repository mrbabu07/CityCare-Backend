"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Category name is required"),
        departmentId: zod_1.z.string().uuid("Invalid department ID"),
        slaHours: zod_1.z.number().int().positive().optional(),
    }),
});
exports.updateCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        slaHours: zod_1.z.number().int().positive().optional(),
    }),
});
//# sourceMappingURL=category.validation.js.map