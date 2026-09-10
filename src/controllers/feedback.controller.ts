import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { createFeedback } from "../services/feedback.service";

export const create = catchAsync(async (req: Request, res: Response) => {
  const feedback = await createFeedback(req.params.complaintId, req.user!.userId, req.body);
  return sendSuccess(res, feedback, "Feedback submitted successfully", 201);
});