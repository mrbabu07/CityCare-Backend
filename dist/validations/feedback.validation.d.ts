import { z } from "zod";
export declare const createFeedbackSchema: z.ZodObject<{
    body: z.ZodObject<{
        rating: z.ZodNumber;
        comment: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=feedback.validation.d.ts.map