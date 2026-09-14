import { z } from "zod";

export const initiatePaymentSchema = z.object({
    body: z.object({
        complaintId: z.string().uuid("Invalid Complaint Id")
    })
})

export const paymentStatusSchema = z.object({
    params: z.object({
        complaintId: z.string().uuid("Invalid complaint ID")
    })
})
