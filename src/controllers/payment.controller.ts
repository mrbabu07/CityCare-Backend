import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { paymentReturnUrl } from "../utils/paymentReturn";
import {
  initiatePayment,
  verifySuccessfulPayment,
  markPaymentFailed,
  getPaymentStatus,
  processPaymentNotification,
} from "../services/payment.service";

const callbackValue = (value: unknown) =>
  typeof value === "string" ? value : "";

async function browserCallback(
  res: Response,
  outcome: "success" | "failed" | "cancelled",
  verify: () => Promise<{ id: string; status: string; complaintId: string }>,
) {
  // Compute the trusted destination before processing, never from callback input.
  const fallback = paymentReturnUrl("unverified");
  try {
    const payment = await verify();
    const destination = paymentReturnUrl(outcome, payment.complaintId);
    res.setHeader("Cache-Control", "no-store");
    if (destination) return res.redirect(303, destination);
    return sendSuccess(
      res,
      { paymentId: payment.id, status: payment.status },
      "Payment callback processed",
    );
  } catch (error) {
    if (!fallback) throw error;
    res.setHeader("Cache-Control", "no-store");
    return res.redirect(303, fallback);
  }
}

export const initiate = catchAsync(async (req: Request, res: Response) => {
  const result = await initiatePayment(req.body.complaintId, req.user!.userId);
  return sendSuccess(res, result, "Payment session created successfully");
});

export const success = catchAsync(async (req: Request, res: Response) => {
  const validationId = callbackValue(req.body?.val_id || req.query.val_id);
  return browserCallback(res, "success", () =>
    verifySuccessfulPayment(req.params.paymentId as string, validationId),
  );
});

export const fail = catchAsync(async (req: Request, res: Response) => {
  return browserCallback(res, "failed", () =>
    markPaymentFailed(
      req.params.paymentId as string,
      req.method === "GET" ? req.query : req.body,
    ),
  );
});

export const cancel = catchAsync(async (req: Request, res: Response) => {
  return browserCallback(res, "cancelled", () =>
    markPaymentFailed(
      req.params.paymentId as string,
      req.method === "GET" ? req.query : req.body,
    ),
  );
});

export const webhook = catchAsync(async (req: Request, res: Response) => {
  const payment = await processPaymentNotification(req.body);
  return sendSuccess(
    res,
    { paymentId: payment.id, status: payment.status },
    "IPN processed",
  );
});

export const getStatus = catchAsync(async (req: Request, res: Response) => {
  const payment = await getPaymentStatus(
    req.params.complaintId as string,
    req.user!.userId,
    req.user!.role,
  );
  return sendSuccess(res, payment, "Payment status fetched successfully");
});
