import { z } from "zod";

export const initiatePaymentSchema = z.object({
    body: z.object({
        complauntId: z.string().uuid("Invalid Complaint Id")
    })
})