import { z } from "zod";

export const paymentCallbackSchema = z.object({
  params: z.object({ paymentId: z.string().uuid() }),
});
export const paymentNotificationSchema = z.object({
  body: z
    .object({
      tran_id: z.string().uuid(),
      status: z.enum([
        "VALID",
        "VALIDATED",
        "FAILED",
        "CANCELLED",
        "UNATTEMPTED",
        "EXPIRED",
      ]),
      amount: z.string().min(1),
      currency: z.string().min(1),
      verify_key: z.string().min(1),
      verify_sign: z.string().regex(/^[a-f0-9]{32}$/i),
    })
    .passthrough(),
});
export const paymentResultSchema = z.object({
  query: z.object({ status: z.enum(["success", "fail", "cancel"]) }),
});

export const initiatePaymentSchema = z.object({
  body: z.object({
    complaintId: z.string().uuid("Invalid Complaint Id"),
  }),
});

export const paymentStatusSchema = z.object({
  params: z.object({
    complaintId: z.string().uuid("Invalid complaint ID"),
  }),
});
