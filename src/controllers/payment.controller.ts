import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { initiatePayment, verifySuccessfulPayment, markPaymentFailed, getPaymentStatus } from "../services/payment.service";

const callbackValue = (value: unknown) => typeof value === "string" ? value : "";

export const initiate = catchAsync(async (req: Request, res: Response) => {
  const result = await initiatePayment(req.body.complaintId, req.user!.userId);
  return sendSuccess(res, result, "Payment session created successfully");
});

export const success = catchAsync(async (req: Request, res: Response) => {
  const validationId = callbackValue(req.body.val_id || req.query.val_id);
  await verifySuccessfulPayment(req.params.paymentId as string, validationId);
  return res.redirect(`${process.env.BACKEND_URL}/api/v1/payments/result?status=success`);
});

export const fail = catchAsync(async (req: Request, res: Response) => {
  await markPaymentFailed(req.params.paymentId as string);
  return res.redirect(`${process.env.BACKEND_URL}/api/v1/payments/result?status=fail`);
});

export const cancel = catchAsync(async (req: Request, res: Response) => {
  await markPaymentFailed(req.params.paymentId as string);
  return res.redirect(`${process.env.BACKEND_URL}/api/v1/payments/result?status=cancel`);
});

export const webhook = catchAsync(async (req: Request, res: Response) => {
  const tranId = callbackValue(req.body.tran_id);
  const validationId = callbackValue(req.body.val_id);

  if (tranId && validationId) {
    await verifySuccessfulPayment(tranId, validationId);
  }

  return res.status(200).send("IPN received");
});

export const getStatus = catchAsync(async (req: Request, res: Response) => {
  const payment = await getPaymentStatus(
    req.params.complaintId as string,
    req.user!.userId,
    req.user!.role,
  );
  return sendSuccess(res, payment, "Payment status fetched successfully");
});
