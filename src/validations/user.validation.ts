import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().optional(),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid user ID") }),
  body: z.object({ role: z.enum(["CITIZEN", "STAFF", "ADMIN"]) }),
});
