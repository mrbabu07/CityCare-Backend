"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignComplaintSchema = exports.updateStatusSchema = exports.createComplaintSchema = void 0;
const zod_1 = require("zod");
exports.createComplaintSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(5, "title must be at least 5 characters long"),
        description: zod_1.z.string().min(10, "description must be at least 10 characters long"),
        categoryId: zod_1.z.string().uuid("categoryId must be a valid UUID"),
        address: zod_1.z.string().min(5, "address must be at least 5 characters long"),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], "priority must be one of 'LOW', 'MEDIUM', 'HIGH', or 'URGENT'").optional(),
    })
});
exports.updateStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([
            "SUBMITTED",
            "UNDER_REVIEW",
            "ASSIGNED",
            "IN_PROGRESS",
            "RESOLVED",
            "REJECTED",
            "CLOSED",
        ]),
        note: zod_1.z.string().optional()
    }),
});
exports.assignComplaintSchema = zod_1.z.object({
    body: zod_1.z.object({
        staffId: zod_1.z.string().uuid("staffId must be a valid UUID"),
    })
});
//# sourceMappingURL=complaint.validation.js.map