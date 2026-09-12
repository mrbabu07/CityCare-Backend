import { z } from 'zod';
export declare const createComplaintSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        categoryId: z.ZodString;
        address: z.ZodString;
        latitude: z.ZodOptional<z.ZodNumber>;
        longitude: z.ZodOptional<z.ZodNumber>;
        priority: z.ZodOptional<z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            URGENT: "URGENT";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateStatusSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodEnum<{
            SUBMITTED: "SUBMITTED";
            UNDER_REVIEW: "UNDER_REVIEW";
            ASSIGNED: "ASSIGNED";
            IN_PROGRESS: "IN_PROGRESS";
            RESOLVED: "RESOLVED";
            REJECTED: "REJECTED";
            CLOSED: "CLOSED";
        }>;
        note: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const assignComplaintSchema: z.ZodObject<{
    body: z.ZodObject<{
        staffId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=complaint.validation.d.ts.map