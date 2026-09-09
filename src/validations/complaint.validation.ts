import { z } from 'zod';

export const createComplaintSchema = z.object({
    body: z.object({
        title:z.string().min(5, "title must be at least 5 characters long"),
        description: z.string().min(10, "description must be at least 10 characters long"),
        categoryId: z.string().uuid("categoryId must be a valid UUID"),
        address: z.string().min(5, "address must be at least 5 characters long"),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], "priority must be one of 'LOW', 'MEDIUM', 'HIGH', or 'URGENT'").optional(),
    })
});


export const updateStatusSchema = z.object({
    body: z.object({
        status: z.enum([
            "SUBMITTED",
            "UNDER_REVIEW",
            "ASSIGNED",
            "IN_PROGRESS",
            "RESOLVED",
            "REJECTED",
            "CLOSED",
        ]), 
        note: z.string().optional()
    }),
});

export const assignComplaintSchema = z.object({
    body: z.object({
        staffId: z.string().uuid("staffId must be a valid UUID"),
    })
})