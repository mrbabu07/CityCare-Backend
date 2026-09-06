import { z } from "zod";

export const createDepartmentSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Department name is required"),
        description: z.string().optional(),

    }),
});

export const updateDepartmentSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Department name is required").optional(),
        description: z.string().optional(),
    })
});