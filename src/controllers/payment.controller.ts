import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import {
  initiatePayment,
  verifySuccessfulPayment,
  markPaymentFailed,
  getPaymentStatus,
  processPaymentNotification,
} from "../services/payment.service";

const callbackValue = (value: unknown) =>
  typeof value === "string" ? value : "";

export const initiate = catchAsync(async (req: Request, res: Response) => {
  const result = await initiatePayment(req.body.complaintId, req.user!.userId);
  return sendSuccess(res, result, "Payment session created successfully");
});

export const success = catchAsync(async (req: Request, res: Response) => {
  const validationId = callbackValue(req.body?.val_id || req.query.val_id);
  const payment = await verifySuccessfulPayment(
    req.params.paymentId as string,
    validationId,
  );
  return sendSuccess(
    res,
    { paymentId: payment.id, status: payment.status },
    "Payment verified",
  );
});

export const fail = catchAsync(async (req: Request, res: Response) => {
  const payment = await markPaymentFailed(
    req.params.paymentId as string,
    req.method === "GET" ? req.query : req.body,
  );
  return sendSuccess(
    res,
    { paymentId: payment.id, status: payment.status },
    "Payment callback processed",
  );
});

export const cancel = catchAsync(async (req: Request, res: Response) => {
  const payment = await markPaymentFailed(
    req.params.paymentId as string,
    req.method === "GET" ? req.query : req.body,
  );
  return sendSuccess(
    res,
    { paymentId: payment.id, status: payment.status },
    "Cancellation callback processed",
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
