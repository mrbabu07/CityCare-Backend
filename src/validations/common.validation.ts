import { z } from "zod";

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid resource ID") }),
});

export const complaintIdParamSchema = z.object({
  params: z.object({ complaintId: z.string().uuid("Invalid complaint ID") }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});
