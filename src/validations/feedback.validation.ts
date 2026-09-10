import { z } from "zod";

export const createFeedbackSchema = z.object({
    body: z.object({
        rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
        comment: z.string().optional(),
    })
})