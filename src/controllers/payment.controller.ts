import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { initiatePayment, verifyAndUpdatePayment, getPaymentStatus } from "../services/payment.service";

export const initiate = catchAsync(async (req: Request, res: Response) => {
  const result = await initiatePayment(req.body.complaintId, req.user!.userId);
  return sendSuccess(res, result, "Payment session created successfully");
});

export const success = catchAsync(async (req: Request, res: Response) => {
  await verifyAndUpdatePayment(req.params.paymentId, "success");
  return res.redirect(`${process.env.BACKEND_URL}/api/v1/payments/result?status=success`);
});

export const fail = catchAsync(async (req: Request, res: Response) => {
  await verifyAndUpdatePayment(req.params.paymentId, "fail");
  return res.redirect(`${process.env.BACKEND_URL}/api/v1/payments/result?status=fail`);
});

export const cancel = catchAsync(async (req: Request, res: Response) => {
  await verifyAndUpdatePayment(req.params.paymentId, "cancel");
  return res.redirect(`${process.env.BACKEND_URL}/api/v1/payments/result?status=cancel`);
});

export const webhook = catchAsync(async (req: Request, res: Response) => {
  const tranId = req.body.tran_id;
  const status = req.body.status === "VALID" ? "success" : "fail";

  if (tranId) {
    await verifyAndUpdatePayment(tranId, status);
  }

  return res.status(200).send("IPN received");
});

export const getStatus = catchAsync(async (req: Request, res: Response) => {
  const payment = await getPaymentStatus(req.params.complaintId);
  return sendSuccess(res, payment, "Payment status fetched successfully");
});