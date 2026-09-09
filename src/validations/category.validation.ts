import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Category name is required"),
    departmentId: z.string().uuid("Invalid department ID"),
    slaHours: z.number().int().positive().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slaHours: z.number().int().positive().optional(),
  }),
});